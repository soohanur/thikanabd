import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import logoDark from "../assect/images/logo-dark.png";
import logoLight from "../assect/images/logo-light.png";
import { FiUser } from "../assect/icons/vander";
import axios from "axios";
import { apiUrl, API_BASE_URL } from "../utils/api";
import { useOnlineStatusContext } from "../utils/OnlineStatusContext";
import { io } from "socket.io-client";

function NavbarOnlineSocket() {
  const { setOnlineUsers } = useOnlineStatusContext();
  React.useEffect(() => {
    const localUser = localStorage.getItem("thikana_user");
    if (!localUser) return;
    const parsed = JSON.parse(localUser);
    const myId = parsed._id || parsed.userId;
    if (!myId) return;
    const socket = io(API_BASE_URL, { autoConnect: true, reconnection: true });
    socket.on("connect", () => {
      socket.emit("user-online", myId);
    });
    socket.on("online-users", (users) => {
      setOnlineUsers(users);
    });
    return () => {
      socket.disconnect();
    };
  }, [setOnlineUsers]);
  return null;
}

export default function Navbar({ navClass, logolight, menuClass }) {
    const [isMenu, setIsMenu] = useState(false);
    const [isSticky, setIsSticky] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [unreadCount, setUnreadCount] = useState(0); // State to manage unread messages count

    useEffect(() => {
        const handleScroll = () => {
            setIsSticky(window.scrollY > 0);
        };

        window.addEventListener("scroll", handleScroll);

        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, []);

    useEffect(() => {
        // Check login status on mount and when localStorage changes
        const checkLogin = () => {
            setIsLoggedIn(!!localStorage.getItem('thikana_token'));
        };
        checkLogin();
        window.addEventListener('storage', checkLogin);
        return () => window.removeEventListener('storage', checkLogin);
    }, []);

    useEffect(() => {
        // Fetch unread message count from backend
        const fetchUnreadCount = async () => {
            const token = localStorage.getItem('thikana_token');
            if (!token) {
                setUnreadCount(0);
                return;
            }
            try {
                const res = await axios.get(apiUrl('/api/messages/conversations'), {
                    headers: { Authorization: `Bearer ${token}` },
                });
                // Count all unread messages (lastMessage sent by other user and not read)
                let count = 0;
                const user = JSON.parse(localStorage.getItem('thikana_user'));
                res.data.forEach(conv => {
                    const otherId = conv.participants.find(id => id !== user?.userId && id !== user?._id);
                    if (conv.lastMessage && conv.lastMessage.senderId === otherId && !conv.lastMessage.read) {
                        count++;
                    }
                });
                setUnreadCount(count);
            } catch {
                setUnreadCount(0);
            }
        };

        fetchUnreadCount();
        const interval = setInterval(fetchUnreadCount, 10000); // Poll every 10s

        return () => clearInterval(interval);
    }, [isLoggedIn]);

    return (
        <>
            <NavbarOnlineSocket />
            <header
                id="topnav"
                className={`${navClass} ${isSticky ? "sticky" : ""}`}
                style={{
                    backgroundColor: "white",
                    boxShadow: isSticky ? "0 2px 4px rgba(0, 0, 0, 0.1)" : "none",
                    transition: "background-color 0.3s ease, box-shadow 0.3s ease",
                }}
            >
                <div className="container">
                    <Link className="logo" to="/">
                        {logolight ? (
                            <span className="logo-light-mode">
                                <img src={logoDark} className="l-dark" alt="Logo" />
                                <img src={logoLight} className="l-light" alt="Logo" />
                            </span>
                        ) : (
                            <>
                                <img src={logoDark} className="logo-light-mode" alt="Logo" />
                                <img src={logoLight} className="logo-dark-mode" alt="Logo" />
                            </>
                        )}
                    </Link>

                    <ul className="buy-button list-inline mb-0">
                        {isLoggedIn ? (
                            <>
                                <li className="list-inline-item ps-1 mb-0 position-relative">
                                    <Link to="/messages" className="btn btn-sm btn-icon btn-pills btn-primary position-relative" style={{background:'#fff',marginRight:'10px', paddingTop:'2px'}}>
                                        <i className="fas fa-envelope icons" style={{ fontSize: 15 }}></i>
                                        {/* Notification Badge */}
                                        {unreadCount > 0 && (
                                            <span style={{position:'absolute',top:'-7px',right:'-7px',background:'#ff3b3b',color:'#fff',borderRadius:'50%',fontSize:'12px',fontWeight:'bold',padding:'0px 5px',marginTop:'1px',zIndex:2}}>
                                                {unreadCount}
                                            </span>
                                        )}
                                    </Link>
                                </li>
                                <li className="list-inline-item ps-1 mb-0">
                                    <Link to="/profiles" className="btn btn-sm btn-icon btn-pills btn-primary">
                                        <FiUser className="icons" />
                                    </Link>
                                </li>
                            </>
                        ) : (
                            <>
                                <li className="list-inline-item ps-1 mb-0">
                                    <Link to="/auth-login" className="btn btn-sm btn-outline-primary" style={{ fontSize: "16px" }}>Sign In</Link>
                                </li>
                                <li className="list-inline-item ps-1 mb-0">
                                    <Link to="/auth-signup" className="btn btn-sm btn-primary" style={{ fontSize: "16px" }}>Register</Link>
                                </li>
                            </>
                        )}
                    </ul>

                    <div id="navigation" style={{ display: isMenu ? "block" : "none" }}>
                        <ul className={menuClass}>
                            <li className="has-submenu parent-menu-item">
                                <Link to="/">Home</Link>
                            </li>
                            <li>
                                <Link to="/agents" className="sub-menu-item">
                                    Agent
                                </Link>
                            </li>
                            <li className="has-submenu parent-menu-item">
                                <Link to="/grid-sidebar">Properties</Link>
                            </li>
                            <li>
                                <Link to="/contactus" className="sub-menu-item">
                                    Contact Us
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>
            </header>
        </>
    );
}