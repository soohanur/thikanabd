import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import defaultProfile from "../assect/images/profile-thumb.png";
import Navbar from "../components/navbar";
import Footer from "../components/footer";
import { apiUrl } from "../utils/api";
import { io } from "socket.io-client";

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
  const [searchTerm, setSearchTerm] = useState("");
  const [onlineUsers, setOnlineUsers] = useState([]);

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

  // Scroll to the latest message when messages or selected conversation change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, selectedConv]);

  // Socket.io setup for real-time features
  useEffect(() => {
    const socket = io("http://localhost:5000");
    if (user?.userId || user?._id) {
      socket.emit("user-online", user.userId || user._id);
    }
    socket.on("online-users", (users) => {
      setOnlineUsers(users);
    });
    return () => {
      socket.disconnect();
    };
  }, [user]);

  return (
    <>
    <Navbar navClass="defaultscroll sticky top-0 z-50" menuClass="navigation-menu nav-left" />
    <div className="flex flex-col md:flex-row h-[80vh] md:h-[80vh] mt-[110px] mx-auto max-w-6xl rounded-2xl shadow-lg overflow-hidden bg-white border border-gray-200 w-full sm:w-11/12 md:w-5/6 lg:w-4/5 xl:w-3/4">
      {/* Sidebar: Conversations */}
      <aside className="w-full md:w-1/3 bg-gray-50 border-r border-gray-200 flex flex-col min-h-[200px] max-h-[40vh] md:max-h-full md:min-h-0">
        {/* Sidebar Header */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-4 border-b border-gray-200 bg-white">
          <h3 className="font-bold text-lg sm:text-xl text-gray-800">Chats</h3>
          <button className="p-2 rounded-full hover:bg-gray-100 transition"><i className="fas fa-ellipsis-v text-gray-500"></i></button>
        </div>
        {/* Search Bar */}
        <div className="px-4 sm:px-6 py-3 border-b border-gray-200 bg-white">
          <input
            type="text"
            placeholder="Search users..."
            className="w-full px-3 sm:px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-200 bg-gray-100 text-sm"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>
        {/* User List */}
        <ul className="flex-1 overflow-y-auto divide-y divide-gray-100">
          {conversations
            .filter(conv => {
              const otherId = conv.participants.find(id => id !== user?.userId && id !== user?._id);
              const info = userInfos[otherId] || {};
              const name = (info.name || "").toLowerCase();
              const lastMsg = (conv.lastMessage?.text || "").toLowerCase();
              return (
                name.includes(searchTerm.toLowerCase()) ||
                lastMsg.includes(searchTerm.toLowerCase())
              );
            })
            .map(conv => {
              const otherId = conv.participants.find(id => id !== user?.userId && id !== user?._id);
              const info = userInfos[otherId] || {};
              const isUnread = conv.lastMessage && conv.lastMessage.senderId === otherId && !conv.lastMessage.read;
              const isOnline = onlineUsers.includes(otherId);
              return (
                <li key={conv.conversationId}
                  className={`flex items-center gap-3 px-6 py-4 cursor-pointer transition hover:bg-blue-50 ${selectedConv === conv.conversationId ? 'bg-green-100' : 'bg-white'}`}
                  style={{ fontWeight: isUnread ? 'bold' : 'normal' }}
                  onClick={() => setSelectedConv(conv.conversationId)}>
                  <img src={info.profilePicture ? (info.profilePicture.startsWith('http') ? info.profilePicture : apiUrl(info.profilePicture)) : defaultProfile} alt="avatar" className="w-12 h-12 rounded-full object-cover border-2 border-blue-100" />
                  <div className="flex-1 min-w-0">
                    <div className="truncate text-gray-900 text-base flex items-center gap-2">
                      
                        {info.name || otherId?.slice(-6) || "User"}
                      
                      {isOnline && <span className="inline-block w-2 h-2 rounded-full bg-green-500" title="Online"></span>}
                    </div>
                    <div className="truncate text-xs text-gray-500">{conv.lastMessage?.text?.slice(0, 30) || "No messages yet"}</div>
                  </div>
                  <div className="ml-auto text-xs text-gray-400 font-mono hidden md:block">{conv.lastMessage?.timestamp ? new Date(conv.lastMessage.timestamp).toLocaleTimeString() : ""}</div>
                </li>
              );
            })}
        </ul>
      </aside>
      {/* Main Chat Area */}
      <section className="flex-1 flex flex-col bg-white min-h-[200px]">
        {/* Chat Header */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-4 border-b border-gray-200 bg-white">
          {selectedConv ? (
            <div className="flex items-center gap-3">
              {(() => {
                const conv = conversations.find(c => c.conversationId === selectedConv);
                const otherId = conv?.participants.find(id => id !== user?.userId && id !== user?._id);
                const info = userInfos[otherId] || {};
                const isOnline = onlineUsers.includes(otherId);
                // Find last seen time (if not online)
                const lastMsg = conv?.lastMessage;
                let lastSeen = "";
                if (!isOnline && lastMsg?.timestamp) {
                  const last = new Date(lastMsg.timestamp);
                  const now = new Date();
                  const diffMs = now - last;
                  const diffMin = Math.floor(diffMs / 60000);
                  if (diffMin < 1) lastSeen = "just now";
                  else if (diffMin < 60) lastSeen = `${diffMin} min ago`;
                  else if (diffMin < 1440) lastSeen = `${Math.floor(diffMin/60)} hr ago`;
                  else lastSeen = `${Math.floor(diffMin/1440)} days ago`;
                }
                return <>
                  <img src={info.profilePicture ? (info.profilePicture.startsWith('http') ? info.profilePicture : apiUrl(info.profilePicture)) : defaultProfile} alt="avatar" className="w-10 h-10 rounded-full object-cover border-2 border-blue-100" />
                  <div>
                  <span
                        className="cursor-pointer hover:underline"
                        onClick={() => window.location.href = `/public-profile/${otherId}`}
                      >
                    <div className="font-semibold text-gray-900">{info.name || otherId?.slice(-6) || "User"}</div>
                  </span>
                    <div className="text-xs text-gray-400">
                      {isOnline ? "Online" : lastSeen ? `Last seen ${lastSeen}` : "Offline"}
                    </div>
                  </div>
                </>;
              })()}
            </div>
          ) : <div className="font-semibold text-gray-500">Select a conversation</div>}
          <div className="flex items-center gap-2">
            <button className="p-2 rounded-full hover:bg-gray-100 transition"><i className="fas fa-search text-gray-500"></i></button>
            <button className="p-2 rounded-full hover:bg-gray-100 transition"><i className="fas fa-ellipsis-v text-gray-500"></i></button>
          </div>
        </div>
        {/* Messages area */}
        <div className="flex-1 flex flex-col gap-3 px-2 sm:px-4 py-4 sm:py-6 overflow-y-auto bg-gray-50 min-h-[120px]">
          {messages.map((msg, idx) => (
            <div key={idx} className={`flex ${msg.senderId === user?.userId || msg.senderId === user?._id ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[80vw] sm:max-w-[60%] px-5 py-3 rounded-2xl shadow text-sm sm:text-base break-words transition-all duration-200 ${msg.senderId === user?.userId || msg.senderId === user?._id ? 'bg-blue-500 text-white' : 'bg-white text-gray-800 border border-gray-200'}`}>{msg.text}</div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
        {/* Input area */}
        <form className="flex items-center gap-2 px-2 sm:px-4 py-3 sm:py-4 border-t border-gray-200 bg-white" onSubmit={handleSend}>
          <input
            type="text"
            className="flex-1 border border-gray-200 rounded-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-200 bg-gray-100 shadow-sm"
            placeholder="Type your message..."
            value={messageText}
            onChange={e => setMessageText(e.target.value)}
            autoComplete="off"
          />
          <button type="submit" className="bg-blue-500 hover:bg-blue-600 transition text-white px-4 sm:px-6 py-2 rounded-full font-bold text-sm sm:text-base shadow">Send</button>
        </form>
      </section>
    </div>
    </>
  );
}

export default MessagesPage;
