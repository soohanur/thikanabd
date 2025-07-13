import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import defaultProfile from "../assect/images/profile-thumb.png";
import Navbar from "../components/navbar";
import Footer from "../components/footer";

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

  // Fetch conversations and auto-select the one with userId if present
  useEffect(() => {
    const token = localStorage.getItem("thikana_token");
    if (!token) return;
    axios.get("http://localhost:5000/api/messages/conversations", {
      headers: { Authorization: `Bearer ${token}` },
    }).then(res => {
      setConversations(res.data);
      if (userId) {
        // Find or create conversation with userId
        let conv = res.data.find(c => c.participants.includes(userId));
        if (conv) {
          setSelectedConv(conv.conversationId);
        } else {
          // No conversation yet, create one by sending an empty message (or handle in UI)
          setSelectedConv(null);
        }
      } else if (res.data.length > 0) {
        setSelectedConv(res.data[0].conversationId);
      }
    });
  }, [userId]);

  useEffect(() => {
    if (!selectedConv) return;
    const token = localStorage.getItem("thikana_token");
    setLoading(true);
    axios.get(`http://localhost:5000/api/messages/${selectedConv}`, {
      headers: { Authorization: `Bearer ${token}` },
    }).then(res => {
      setMessages(res.data);
      setLoading(false);
      // setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }), 100); // auto-scroll disabled
    });
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
            const res = await axios.get(`http://localhost:5000/api/users/${id}`);
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
      axios.get("http://localhost:5000/api/messages/conversations", {
        headers: { Authorization: `Bearer ${token}` },
      }).then(res => {
        // Sort by lastMessage timestamp desc
        const sorted = [...res.data].sort((a, b) => {
          const tA = a.lastMessage?.timestamp ? new Date(a.lastMessage.timestamp).getTime() : 0;
          const tB = b.lastMessage?.timestamp ? new Date(b.lastMessage.timestamp).getTime() : 0;
          return tB - tA;
        });
        setConversations(sorted);
        if (userId) {
          let conv = sorted.find(c => c.participants.includes(userId));
          if (conv) setSelectedConv(conv.conversationId);
        }
      });
    };
    fetchConversations();
    const interval = setInterval(fetchConversations, 2000);
    return () => clearInterval(interval);
  }, [userId]);

  // Poll for messages in selected conversation
  useEffect(() => {
    if (!selectedConv) return;
    const token = localStorage.getItem("thikana_token");
    const fetchMessages = () => {
      setLoading(true);
      axios.get(`http://localhost:5000/api/messages/${selectedConv}`, {
        headers: { Authorization: `Bearer ${token}` },
      }).then(res => {
        setMessages(res.data);
        setLoading(false);
        // setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }), 100); // auto-scroll disabled
      });
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
      axios.post(`http://localhost:5000/api/messages/${selectedConv}/read`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      }).then(() => {
        // Optionally, refresh conversations
        axios.get("http://localhost:5000/api/messages/conversations", {
          headers: { Authorization: `Bearer ${token}` },
        }).then(res => setConversations(res.data));
      });
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
    await axios.post("http://localhost:5000/api/messages", {
      receiverId,
      text: messageText,
    }, {
      headers: { Authorization: `Bearer ${token}` },
    });
    setMessageText("");
    // Refresh conversations and select the new/updated conversation
    axios.get("http://localhost:5000/api/messages/conversations", {
      headers: { Authorization: `Bearer ${token}` },
    }).then(res => {
      setConversations(res.data);
      let conv = res.data.find(c => c.participants.includes(receiverId));
      if (conv) setSelectedConv(conv.conversationId);
    });
    // Refresh messages if conversation is now selected
    if (selectedConv) {
      axios.get(`http://localhost:5000/api/messages/${selectedConv}`, {
        headers: { Authorization: `Bearer ${token}` },
      }).then(res => {
        setMessages(res.data);
        // setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }), 100); // auto-scroll disabled
      });
    }
  };

  return (
    <>
    <Navbar navClass="defaultscroll sticky top-0 z-50" menuClass="navigation-menu nav-left" />
    <div className="flex h-[600px] mt-[130px] container bg-white rounded-3xl shadow overflow-hidden">
        
      {/* Sidebar: Conversations */}
      <div className="w-1/3   border-r bg-gray-50 p-4 overflow-y-auto">
        <h3 className="font-bold text-lg mb-4">Messages</h3>
        <ul>
          {conversations.map(conv => {
            const otherId = conv.participants.find(id => id !== user?.userId && id !== user?._id);
            const info = userInfos[otherId] || {};
            const isUnread = conv.lastMessage && conv.lastMessage.senderId === otherId && !conv.lastMessage.read;
            return (
              <li key={conv.conversationId}
                  className={`flex items-center gap-3 p-2 rounded cursor-pointer mb-2 ${selectedConv === conv.conversationId ? 'bg-green-100' : ''}`}
                  style={{ background: isUnread ? 'rgb(255 230 230)' : undefined }}
                  onClick={() => setSelectedConv(conv.conversationId)}>
                <img src={info.profilePicture ? (info.profilePicture.startsWith('http') ? info.profilePicture : `http://localhost:5000${info.profilePicture}`) : defaultProfile} alt="avatar" className="w-10 h-10 rounded-full object-cover" />
                <div>
                  <div className="font-semibold">{info.name || otherId?.slice(-6) || "User"}</div>
                  <div className="text-xs text-gray-500">{conv.lastMessage?.text?.slice(0, 30) || "No messages yet"}</div>
                </div>
                <div className="ml-auto text-xs text-gray-400">{conv.lastMessage?.timestamp ? new Date(conv.lastMessage.timestamp).toLocaleTimeString() : ""}</div>
              </li>
            );
          })}
        </ul>
      </div>
      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        <div className="bg-blue-500 text-white px-6 py-3 font-bold">{selectedConv ? `Conversation` : "Select a conversation"}</div>
        <div className="flex-1 p-6 overflow-y-auto bg-gray-100">
          {/* Remove loading message for real-time updates */}
          <div className="flex flex-col gap-2">
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.senderId === user?.userId || msg.senderId === user?._id ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[60%] px-4 py-2 rounded-2xl shadow ${msg.senderId === user?.userId || msg.senderId === user?._id ? 'bg-green-500 text-white' : 'bg-white text-gray-800'}`}>{msg.text}</div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        </div>
        <form className="flex items-center px-6 py-4 border-t bg-white" onSubmit={handleSend}>
          <input
            type="text"
            className="flex-1 border rounded-full px-4 py-2 mr-2"
            placeholder="Chat message"
            value={messageText}
            onChange={e => setMessageText(e.target.value)}
          />
          <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded-full font-bold">Send</button>
        </form>
      </div>
    </div>
    </>
  );
}

export default MessagesPage;
