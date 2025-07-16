import React, { useEffect, useState } from "react";
import coverImg from "../assect/images/profile-cover.png";
import defaultProfile from "../assect/images/profile-thumb.png";
import { Link } from "react-router-dom";
import { apiUrl } from "../utils/api";
import { io } from "socket.io-client";
import moment from "moment";

export default function DashboardTab({ user, properties }) {
  const [avgRating, setAvgRating] = useState(null);
  const [ratingCount, setRatingCount] = useState(null);
  const [status, setStatus] = useState(null);

  useEffect(() => {
    async function fetchAgentRatings() {
      if (!user?._id) return;
      try {
        const avgRes = await fetch(apiUrl(`/api/agent/${user._id}/rating/average`));
        const avgData = await avgRes.json();
        setAvgRating(avgData.averageRating || 0);
        const countRes = await fetch(apiUrl(`/api/agent/${user._id}/ratings`));
        const countData = await countRes.json();
        setRatingCount(Array.isArray(countData) ? countData.length : 0);
      } catch {}
    }
    fetchAgentRatings();
  }, [user?._id]);

  useEffect(() => {
    if (!user?._id) return;
    const socket = io(apiUrl("/"), { path: "/socket.io", autoConnect: true, reconnection: true });
    socket.emit("check-user-status", user._id);
    socket.on("user-status", ({ userId, online, lastSeen }) => {
      if (userId === user._id) {
        setStatus({ online, lastSeen });
      }
    });
    const interval = setInterval(() => {
      socket.emit("check-user-status", user._id);
    }, 30000);
    return () => {
      clearInterval(interval);
      socket.disconnect();
    };
  }, [user?._id]);

  return (
    <>
      <div className="w-full mb-8 relative">
        <div className="rounded-3xl overflow-hidden shadow-lg w-full">
          <img
            src={user?.coverPicture ? (user.coverPicture.startsWith('http') ? user.coverPicture : apiUrl(user.coverPicture)) : coverImg}
            alt="Cover"
            className="w-full h-56 object-cover rounded-3xl"
          />
          {/* Avatar and name on left, buttons on right */}
          <div className="absolute left-8 bottom-[-58px] flex items-center gap-4 w-[calc(100%-4rem)] justify-between">
            <div className="flex items-center gap-4">
              <div className="relative mb-2">
                <img
                  src={user?.profilePicture ? (user.profilePicture.startsWith('http') ? user.profilePicture : apiUrl(user.profilePicture)) : defaultProfile}
                  alt={user?.name}
                  className={`w-24 h-24 rounded-full object-cover border-4 shadow-lg transition-transform duration-200 ${status && status.online ? 'border-green-500' : 'border-gray-400'}`}
                  style={{ boxShadow: status && status.online ? '0 0 0 4px #bbf7d0' : '0 0 0 4px #e5e7eb' }}
                />
                <span className={`absolute right-2 bottom-2 w-5 h-5 border-2 border-white rounded-full z-50 animate-pulse ${status && status.online ? 'bg-green-500' : 'bg-gray-400'}`}
                  title={status && status.online ? 'Online' : 'Offline'}
                ></span>
                {status && (
                  <span className={`absolute left-2 top-2 px-2 py-0.5 rounded-full text-xs font-bold shadow ${status.online ? 'bg-green-100 text-green-700 border border-green-300' : 'bg-gray-200 text-gray-600 border border-gray-300'}`}>{status.online ? 'Online' : 'Offline'}</span>
                )}
              </div>
              <div className="ml-2">
                <h3 className="text-xl mt-5 font-bold text-gray-800">{user?.name || "User Name"}</h3>
              </div>
            </div>
            {/* Agent rating display */}
            {avgRating > 0 && ratingCount > 0 && (
              <div className="flex items-center mt-5 mr-4">
                <span className="text-yellow-400 text-2xl mr-1">★</span>
                <span className="font-bold text-lg text-gray-800">{avgRating.toFixed(1)}</span>
                <span className="ml-2 text-gray-600 text-sm">({ratingCount} rating{ratingCount > 1 ? 's' : ''})</span>
              </div>
            )}
          </div>
        </div>
      </div>
      {/* Property Items */}
      <div className="text-black-700" style={{paddingTop:'100px'}}>
        <h2 className="text-2xl font-bold mb-6">My Properties</h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8 w-full">
        {properties.map((property) => (
          <div key={property.id || property._id} className="card property border-0 shadow position-relative overflow-hidden rounded-3">
            {property.verified && (
              <span className="badge bg-green-500 text-white absolute top-3 left-3 z-10">Verified</span>
            )}
            <img src={property.image ? (property.image.startsWith('http') ? property.image : apiUrl(property.image)) : defaultProfile} className="w-full h-48 object-cover rounded-t-3" alt={property.title} />
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
                <span className="mr-4 flex items-center"><i className="fas fa-expand text-green-700 mr-1"></i>{property.size} sq.ft</span>
                <span className="mr-4 flex items-center"><i className="fas fa-bed text-green-700 mr-1"></i>{property.beds} Beds</span>
                <span className="flex items-center"><i className="fas fa-bath text-green-700 mr-1"></i>{property.baths} Baths</span>
              </div>
              <div className="flex justify-between items-center mt-2">
                <div>
                  <span className="text-gray-500 text-xs">Price</span>
                  <div className="font-bold text-green-700">৳{property.nowPrice || property.price}/month</div>
                </div>
                <div>
                  <span className="text-gray-500 text-xs">Rating</span>
                  <div className="flex items-center">
                    {[...Array(Math.floor(property.rating || 0))].map((_, i) => (
                      <i key={i} className="fas fa-star text-yellow-400 mr-1"></i>
                    ))}
                    <span className="ml-1 text-gray-700 font-semibold">{property.rating || 0} ({property.reviews?.length || 0})</span>
                  </div>
                </div>
              </div>
              {/* You can add Edit/Delete buttons here if needed */}
            </div>
          </div>
        ))}
      </div>
    </>
  );
}