import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import defaultProfile from "../assect/images/profile-thumb.png";
import Navbar from "../components/navbar";
import Footer from "../components/footer";
import { apiUrl } from "../utils/api";

function MessagesPage({ user: propUser }) {
  const { userId } = useParams();
  const [conversations, setConversations] = useState([]);
  const [selectedConv, setSelectedConv] = useState(null);
  const [messages, setMessages] = useState([]);
  const [messageText, setMessageText] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const [user, setUser] = useState(propUser || (() => {
    const u = localStorage.getItem('thikana_user');
    return u ? JSON.parse(u) : null;
  }));
  const [userInfos, setUserInfos] = useState({}); // userId -> {name, profilePicture}

  // Helper for axios 403 error handling
  function handleAxiosError(err) {
    if (err.response && err.response.status === 403) {
      alert("Session expired or unauthorized. Please log in again.");
      localStorage.removeItem("thikana_token");
      window.location.href = "/login";
      return true;
    }
    return false;
  }

  // Fetch conversations and auto-select the one with userId if present
  useEffect(() => {
    const token = localStorage.getItem("thikana_token");
    if (!token) return;
    axios.get(apiUrl("/api/messages/conversations"), {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => {
        setConversations(res.data);
        if (userId) {
          // Find or create conversation with userId
          let conv = res.data.find(c => c.participants.includes(userId));
          if (conv) {
            setSelectedConv(conv.conversationId);
          } else {
            setSelectedConv(null);
          }
        }
      })
      .catch(handleAxiosError);
  }, [userId]);

  useEffect(() => {
    if (!selectedConv) return;
    const token = localStorage.getItem("thikana_token");
    setLoading(true);
    axios.get(apiUrl(`/api/messages/${selectedConv}`), {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => {
        setMessages(res.data);
        setLoading(false);
        // setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }), 100); // auto-scroll disabled
      })
      .catch(handleAxiosError);
  }, [selectedConv]);

  // Fetch user info for all conversation participants (except self)
  useEffect(() => {
    const fetchUserInfos = async () => {
      const ids = conversations
        .map(conv => conv.participants.find(id => id !== user?.userId && id !== user?._id))
        .filter(Boolean);
      const uniqueIds = Array.from(new Set(ids));
      const infos = { ...userInfos };
      await Promise.all(uniqueIds.map(async (id) => {
        if (!infos[id]) {
          try {
            const res = await axios.get(apiUrl(`/api/users/${id}`));
            infos[id] = {
              name: res.data.user?.name || 'User',
              profilePicture: res.data.user?.profilePicture || '',
            };
          } catch {
            infos[id] = { name: 'User', profilePicture: '' };
          }
        }
      }));
      setUserInfos(infos);
    };
    if (conversations.length && user) fetchUserInfos();
    // eslint-disable-next-line
  }, [conversations, user]);

  // Poll for new messages every 2 seconds for real-time updates
  useEffect(() => {
    const token = localStorage.getItem("thikana_token");
    if (!token) return;
    const fetchConversations = () => {
      axios.get(apiUrl("/api/messages/conversations"), {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then(res => {
          // Sort by lastMessage timestamp desc
          const sorted = [...res.data].sort((a, b) => {
            const tA = a.lastMessage?.timestamp ? new Date(a.lastMessage.timestamp).getTime() : 0;
            const tB = b.lastMessage?.timestamp ? new Date(b.lastMessage.timestamp).getTime() : 0;
            return tB - tA;
          });
          setConversations(sorted);
          // Only update selectedConv if userId is present in the URL and no conversation is selected yet
          if (userId && !selectedConv) {
            let conv = sorted.find(c => c.participants.includes(userId));
            if (conv) setSelectedConv(conv.conversationId);
          } else if (selectedConv && !sorted.some(c => c.conversationId === selectedConv)) {
            // If the selected conversation was deleted, clear selection
            setSelectedConv(null);
          }
          // Otherwise, do not change selectedConv
        })
        .catch(handleAxiosError);
    };
    fetchConversations();
    const interval = setInterval(fetchConversations, 2000);
    return () => clearInterval(interval);
  }, [userId, selectedConv]);

  // Poll for messages in selected conversation
  useEffect(() => {
    if (!selectedConv) return;
    const token = localStorage.getItem("thikana_token");
    const fetchMessages = () => {
      setLoading(true);
      axios.get(apiUrl(`/api/messages/${selectedConv}`), {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then(res => {
          setMessages(res.data);
          setLoading(false);
          // setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }), 100); // auto-scroll disabled
        })
        .catch(handleAxiosError);
    };
    fetchMessages();
    const interval = setInterval(fetchMessages, 2000);
    return () => clearInterval(interval);
  }, [selectedConv]);

  // Mark messages as read when opening a conversation
  useEffect(() => {
    if (!selectedConv) return;
    const token = localStorage.getItem("thikana_token");
    // Find the conversation and check if there are unread messages
    const conv = conversations.find(c => c.conversationId === selectedConv);
    if (!conv) return;
    const otherId = conv.participants.find(id => id !== user?.userId && id !== user?._id);
    if (conv.lastMessage && conv.lastMessage.senderId === otherId && !conv.lastMessage.read) {
      // Mark as read (send a PATCH or POST to backend to update read status)
      axios.post(apiUrl(`/api/messages/${selectedConv}/read`), {}, {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then(() => {
          // Optionally, refresh conversations
          axios.get(apiUrl("/api/messages/conversations"), {
            headers: { Authorization: `Bearer ${token}` },
          }).then(res => setConversations(res.data));
        })
        .catch(handleAxiosError);
    }
  }, [selectedConv]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!messageText.trim()) return;
    const token = localStorage.getItem("thikana_token");
    let receiverId = null;
    if (selectedConv) {
      // Find receiverId from conversation participants
      const conv = conversations.find(c => c.conversationId === selectedConv);
      receiverId = conv?.participants?.find(id => id !== user?.userId && id !== user?._id);
    } else if (userId) {
      receiverId = userId;
    }
    if (!receiverId) return;
    await axios.post(apiUrl("/api/messages"), {
      receiverId,
      text: messageText,
    }, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .catch(handleAxiosError);
    setMessageText("");
    // Refresh conversations and select the new/updated conversation
    axios.get(apiUrl("/api/messages/conversations"), {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => {
        setConversations(res.data);
        let conv = res.data.find(c => c.participants.includes(receiverId));
        if (conv) setSelectedConv(conv.conversationId);
      })
      .catch(handleAxiosError);
    // Refresh messages if conversation is now selected
    if (selectedConv) {
      axios.get(apiUrl(`/api/messages/${selectedConv}`), {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then(res => {
          setMessages(res.data);
          // setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }), 100); // auto-scroll disabled
        })
        .catch(handleAxiosError);
    }
  };

  return (
    <>
    <Navbar navClass="defaultscroll sticky top-0 z-50" menuClass="navigation-menu nav-left" />
    <div className="flex mb-5 flex-col md:flex-row bg-gray-50 min-h-[600px] mt-[110px] ml-[15px] mr-[15px] container p-0 rounded-3xl shadow overflow-hidden">
      {/* Sidebar: Conversations */}
      <div className="w-full md:w-1/3 border-b md:border-b-0 md:border-r bg-gray-50 p-2 sm:p-4 overflow-x-auto md:overflow-y-auto flex-shrink-0">
        <h3 className="font-bold text-lg mt-4 mb-4 px-2 md:px-0">Messages</h3>
        <ul className="ml-0 md:ml-[-30px] flex md:block gap-2 md:gap-0 overflow-x-auto pb-2 md:pb-0">
          {conversations.map(conv => {
            const otherId = conv.participants.find(id => id !== user?.userId && id !== user?._id);
            const info = userInfos[otherId] || {};
            const isUnread = conv.lastMessage && conv.lastMessage.senderId === otherId && !conv.lastMessage.read;
            return (
              <li key={conv.conversationId}
                  className={`flex items-center gap-3 p-2 rounded-xl cursor-pointer mb-0 md:mb-2 min-w-[220px] md:min-w-0 ${selectedConv === conv.conversationId ? 'bg-green-100' : ''}`}
                  style={{ background: isUnread ? 'rgb(255 230 230)' : undefined }}
                  onClick={() => setSelectedConv(conv.conversationId)}>
                <img src={info.profilePicture ? (info.profilePicture.startsWith('http') ? info.profilePicture : apiUrl(info.profilePicture)) : defaultProfile} alt="avatar" className="w-10 h-10 rounded-full object-cover" />
                <div className="flex-1 min-w-0">
                  <div className="font-semibold truncate">{info.name || otherId?.slice(-6) || "User"}</div>
                  <div className="text-xs text-gray-500 truncate">{conv.lastMessage?.text?.slice(0, 30) || "No messages yet"}</div>
                </div>
                <div className="ml-auto text-xs text-gray-400 hidden md:block">{conv.lastMessage?.timestamp ? new Date(conv.lastMessage.timestamp).toLocaleTimeString() : ""}</div>
              </li>
            );
          })}
        </ul>
      </div>
      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col min-h-[350px] shadow-md overflow-hidden">
        {/* Chat header */}
        <div className="bg-green-700 text-white px-4 sm:px-6 py-3 font-bold text-center md:text-left text-base sm:text-lg sticky top-0 z-10 shadow min-h-[48px] flex items-center">
          {selectedConv ? `Conversation` : "Select a conversation"}
        </div>
        {/* Messages area - scrollable */}
        <div className="flex-1 flex flex-col gap-2 px-2 py-3 sm:px-4 sm:py-6 overflow-y-auto scrollbar-thin scrollbar-thumb-green-200 scrollbar-track-gray-100"
             style={{ maxHeight: 'calc(100dvh - 220px)' }}>
          {messages.map((msg, idx) => (
            <div key={idx} className={`flex ${msg.senderId === user?.userId || msg.senderId === user?._id ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[85vw] sm:max-w-[60%] px-4 py-2 rounded-2xl shadow text-sm sm:text-base break-words ${msg.senderId === user?.userId || msg.senderId === user?._id ? 'bg-green-700 text-white' : 'bg-white text-gray-800'}`}>{msg.text}</div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
        {/* Input area */}
        <form className="flex items-center gap-2 px-2 sm:px-6 py-3 border-t bg-white sticky bottom-0 z-10" onSubmit={handleSend}>
          <input
            type="text"
            className="flex-1 border rounded-full px-4 py-2 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-green-400 bg-gray-50"
            placeholder="Chat message"
            value={messageText}
            onChange={e => setMessageText(e.target.value)}
            autoComplete="off"
          />
          <button type="submit" className="bg-green-700 text-white px-4 py-2 rounded-full font-bold text-sm sm:text-base">Send</button>
        </form>
      </div>
    </div>
    </>
  );
}

export default MessagesPage;
