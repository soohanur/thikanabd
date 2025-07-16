import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { apiUrl, API_BASE_URL } from "../utils/api";
import coverImg from "../assect/images/profile-cover.png";
import defaultProfile from "../assect/images/profile-thumb.png";
import Navbar from "../components/navbar";
import Footer from "../components/footer";
import { io } from "socket.io-client";
import moment from "moment";

export default function PublicProfile() {
  const { username } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [avgRating, setAvgRating] = useState(null);
  const [ratingCount, setRatingCount] = useState(null);
  const [isOnline, setIsOnline] = useState(false);
  const [lastSeen, setLastSeen] = useState(null);

  useEffect(() => {
    let socket;
    let userId = null;
    async function fetchUserAndStatus() {
      try {
        const res = await axios.get(apiUrl(`/api/users/${username}`));
        setUser(res.data.user);
        setProperties(res.data.properties || []);
        setLoading(false);
        userId = res.data.user?._id;
        if (userId) {
          // Connect to socket.io for real-time status
          socket = io(API_BASE_URL, { autoConnect: true, reconnection: true });
          socket.emit("check-user-status", userId);
          socket.on("user-status", ({ userId: id, online, lastSeen }) => {
            if (id === userId) {
              setIsOnline(!!online);
              setLastSeen(lastSeen);
            }
          });
          // Optionally, request status again every 30s
          const interval = setInterval(() => {
            socket.emit("check-user-status", userId);
          }, 30000);
          return () => {
            clearInterval(interval);
            socket.disconnect();
          };
        }
      } catch (err) {
        setLoading(false);
        setUser(null);
      }
    }
    const cleanup = fetchUserAndStatus();
    return () => {
      if (typeof cleanup === 'function') cleanup();
      if (socket) socket.disconnect();
    };
  }, [username]);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await axios.get(apiUrl(`/api/users/${username}`));
        setUser(res.data.user);
        setProperties(res.data.properties || []);
        setLoading(false);
        // If logged-in user is viewing their own profile, redirect
        const localUser = localStorage.getItem("thikana_user");
        // COMMENTED OUT REDIRECT FOR DEBUGGING
        // if (localUser) {
        //   const parsed = JSON.parse(localUser);
        //   if (parsed.username === username || parsed._id === username) {
        //     navigate("/profiles", { replace: true });
        //   }
        // }
        // Fetch agent rating info if user is agent
        if (res.data.user && res.data.user._id && res.data.user.agent === "agent") {
          const avgRes = await fetch(apiUrl(`/api/agent/${res.data.user._id}/rating/average`));
          const avgData = await avgRes.json();
          setAvgRating(avgData.averageRating || 0);
          const countRes = await fetch(apiUrl(`/api/agent/${res.data.user._id}/ratings`));
          const countData = await countRes.json();
          setRatingCount(Array.isArray(countData) ? countData.length : 0);
        }
      } catch (err) {
        setLoading(false);
        setUser(null);
      }
    }
    fetchData();
  }, [username, navigate]);

  if (loading) return <div>Loading...</div>;
  if (!user) return <div>User not found.</div>;

  return (
    <div className="bg-gradient-to-br from-[#f3f4f6] to-[#e0e7ff] min-h-screen">
      <Navbar navClass="defaultscroll sticky top-0 z-50" menuClass="navigation-menu nav-left" />
      <main className="container pt-12" style={{ paddingTop: "130px", paddingBottom: "100px" }}>
        <div className="w-full mb-8 relative">
          <div className="rounded-3xl overflow-hidden shadow-lg w-full">
            <img
              src={user.coverPicture ? (user.coverPicture.startsWith("http") ? user.coverPicture : apiUrl(user.coverPicture)) : coverImg}
              alt="Cover"
              className="w-full h-56 object-cover rounded-3xl"
            />
            <div className="absolute left-8 bottom-[-64px] flex items-center gap-6">
              <div className="relative mb-2">
                <img
                  src={user?.profilePicture ? (user.profilePicture.startsWith("http") ? user.profilePicture : apiUrl(user.profilePicture)) : defaultProfile}
                  alt={user?.name}
                  className={`w-32 h-32 rounded-full object-cover border-4 shadow-lg transition-transform duration-200 ${isOnline ? 'border-green-500' : 'border-gray-400'}`}
                  style={{ boxShadow: isOnline ? '0 0 0 4px #bbf7d0' : '0 0 0 4px #e5e7eb' }}
                />
                <span className={`absolute right-2 bottom-2 w-6 h-6 border-2 border-white rounded-full z-50 animate-pulse ${isOnline ? 'bg-green-500' : 'bg-gray-400'}`}
                  title={isOnline ? 'Online' : 'Offline'}
                ></span>
                <span className={`absolute left-2 top-2 px-2 py-0.5 rounded-full text-xs font-bold shadow ${isOnline ? 'bg-green-100 text-green-700 border border-green-300' : 'bg-gray-200 text-gray-600 border border-gray-300'}`}>{isOnline ? 'Online' : 'Offline'}</span>
              </div>
              <div className="flex flex-col gap-2 bg-white/80 apple-blur rounded-xl shadow-lg px-6 py-4 min-w-[220px]">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xl font-bold text-white">{user.name || "User Name"}</span>
                  {user.agent === "agent" && (
                    <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded font-semibold ml-1">Agent</span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  {isOnline ? (
                    <span className="text-green-400 text-base font-semibold flex items-center gap-1"><span className="animate-pulse">●</span> Active now</span>
                  ) : lastSeen ? (
                    <span className="text-white text-base flex items-center gap-1"><span>●</span> Last seen {moment(lastSeen).fromNow()}</span>
                  ) : (
                    <span className="text-white text-base flex items-center gap-1"><span>●</span> Offline</span>
                  )}
                </div>
                {user.agent === "agent" && avgRating > 0 && ratingCount > 0 && (
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-yellow-400 text-2xl">★</span>
                    <span className="font-bold text-lg text-white">{avgRating.toFixed(1)}</span>
                    <span className="text-white text-sm">({ratingCount} rating{ratingCount > 1 ? 's' : ''})</span>
                  </div>
                )}
              </div>
            </div>
            <div className="absolute right-8 top-[250px] flex gap-4">
              <button
                className="bg-green-600 text-white px-8 py-3 rounded-full font-semibold shadow hover:bg-green-700 transition text-lg"
                onClick={() => navigate(`/messages/${user._id}`)}
              >
                Message
              </button>
              {user.agent === "agent" && (
                <button
                  className="bg-green-600  text-white px-8 py-3 rounded-full font-semibold shadow hover:bg-green-700 transition text-lg"
                  onClick={() => navigate(`/book-agent/${user._id}`)}
                >
                  Book Now
                </button>
              )}
            </div>
            {/* Agent Charge badge (top right) */}
            {user.agent === "agent" && user.agentCharge && (
              <div style={{position: 'absolute', top: 32, right: 32, zIndex: 20}}>
                <span className="bg-green-600 text-white apple-blur px-5 py-2 rounded-full shadow-lg font-bold text-base">
                  Agent Charge: ৳{user.agentCharge}
                </span>
              </div>
            )}
          </div>
        </div>
        {/* Property Items */}
        <div className="text-black-700" style={{ paddingTop: "100px" }}>
          <h2 className="text-2xl font-bold mb-6">Properties list</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full">
          {properties.length === 0 && <div className="col-span-4 text-gray-500">No properties listed.</div>}
          {properties.map((property) => (
            <div key={property.id || property._id} className="card property border-0 shadow position-relative overflow-hidden rounded-3">
              {property.verified && (
                <span className="badge bg-green-500 text-white absolute top-3 left-3 z-10">Verified</span>
              )}
              <img
                src={property.coverImage
                  ? (property.coverImage.startsWith("http")
                      ? property.coverImage
                      : apiUrl(`/uploads/${property.coverImage}`))
                  : property.image
                    ? (property.image.startsWith("http")
                        ? property.image
                        : apiUrl(`/uploads/${property.image}`))
                    : defaultProfile}
                className="w-full h-48 object-cover rounded-t-3"
                alt={property.title}
              />
              <div className="bg-white p-4 rounded-b-3">
                <h4 className="font-bold text-lg mb-2">
                  <Link
                    to={`/property-detail/${property._id || property.id}`}
                    className="hover:text-green-800 text-black transition-colors duration-200"
                    style={{ textDecoration: 'none' }}
                  >
                    {property.title}
                  </Link>
                </h4>
                <div className="flex items-center text-gray-500 text-sm mb-2">
                  <span className="mr-4 flex items-center">
                    <i className="fas fa-expand text-green-700 mr-1"></i>
                    {property.size} sq.ft
                  </span>
                  <span className="mr-4 flex items-center">
                    <i className="fas fa-bed text-green-700 mr-1"></i>
                    {property.beds} Beds
                  </span>
                  <span className="flex items-center">
                    <i className="fas fa-bath text-green-700 mr-1"></i>
                    {property.baths} Baths
                  </span>
                </div>
                <div className="flex justify-between items-center mt-2">
                  <div>
                    <span className="text-gray-500 text-xs">Price</span>
                    <div className="font-bold text-green-700">৳{property.nowPrice || property.price}</div>
                  </div>
                </div>
                {/* No Edit/Delete buttons for public view */}
              </div>
            </div>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
}
