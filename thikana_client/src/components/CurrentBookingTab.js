import React, { useEffect, useState } from "react";
import axios from "axios";
import { apiUrl } from "../utils/api";
import { Link, useNavigate } from "react-router-dom";

function StarDisplay({ value }) {
  return (
    <div className="flex gap-0.5 items-center">
      {[1, 2, 3, 4, 5].map((star) => (
        <span key={star} className={star <= value ? "text-yellow-400 text-xl" : "text-gray-300 text-xl"}>★</span>
      ))}
    </div>
  );
}

export default function BookingListTab({ user }) {
  const [bookings, setBookings] = useState([]);
  const [userDetails, setUserDetails] = useState({});
  const [bookingRatings, setBookingRatings] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [agentStatus, setAgentStatus] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchBookings() {
      setLoading(true);
      setError("");
      try {
        const token = localStorage.getItem("thikana_token");
        const res = await axios.get(apiUrl("/api/bookings/agent"), {
          headers: { Authorization: `Bearer ${token}` },
        });
        setBookings(res.data);
        // Fetch user details for each booking
        const userIds = [...new Set(res.data.map(b => b.userId))];
        const details = {};
        await Promise.all(userIds.map(async (uid) => {
          try {
            const userRes = await axios.get(apiUrl(`/api/users/${uid}`));
            details[uid] = userRes.data.user;
          } catch {}
        }));
        setUserDetails(details);
        // Fetch ratings for these bookings
        const bookingIds = res.data.map(b => b._id);
        if (bookingIds.length > 0) {
          const ratingsRes = await axios.post(apiUrl('/api/agent/booking/ratings-for-bookings'), { bookingIds }, { headers: { Authorization: `Bearer ${token}` } });
          const ratingsMap = {};
          ratingsRes.data.forEach(r => { ratingsMap[r.bookingId] = r; });
          setBookingRatings(ratingsMap);
        }
      } catch (err) {
        setError("Failed to load bookings.");
      } finally {
        setLoading(false);
      }
    }
    fetchBookings();
  }, []);

  useEffect(() => {
    async function fetchStatuses() {
      const statuses = {};
      await Promise.all(bookings.map(async (booking) => {
        try {
          const res = await axios.get(apiUrl(`/api/users/${booking.agentId}/status`));
          statuses[booking.agentId] = res.data;
        } catch {
          statuses[booking.agentId] = { online: false };
        }
      }));
      setAgentStatus(statuses);
    }
    if (bookings.length > 0) fetchStatuses();
  }, [bookings]);

  // Only show paid bookings, sorted latest first
  const paidBookings = bookings.filter(b => b.payment === 'paid').sort((a, b) => {
    if (a.createdAt && b.createdAt) {
      return new Date(b.createdAt) - new Date(a.createdAt);
    }
    return (b._id?.toString() || '').localeCompare(a._id?.toString() || '');
  });

  return (
    <div className="w-full min-h-screen p-4 flex flex-col items-center">
      <h2 className="text-3xl font-bold mb-8 text-center text-green-700 drop-shadow">Current Bookings</h2>
      {loading ? (
        <div className="text-center text-gray-500">Loading...</div>
      ) : error ? (
        <div className="text-center text-red-500">{error}</div>
      ) : bookings.length === 0 ? (
        <div className="text-center text-gray-500">No current bookings yet.</div>
      ) : (
        <ul className="w-full max-w-5xl flex flex-col gap-6">
          {paidBookings.map((booking) => {
            const bookedUser = userDetails[booking.userId];
            return (
              <li
                key={booking._id}
                className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-shadow flex flex-col md:flex-row items-center gap-6 p-6 border border-gray-100 relative md:items-stretch"
              >
                {/* User details */}
                <div className="flex flex-col items-center w-full md:w-1/5 mb-4 md:mb-0">
                  <div className="relative mb-2">
                    <img
                      src={bookedUser?.profilePicture ? (bookedUser.profilePicture.startsWith('http') ? bookedUser.profilePicture : apiUrl(bookedUser.profilePicture)) : process.env.PUBLIC_URL + '/default-profile.png'}
                      alt={bookedUser?.name}
                      className={`w-24 h-24 rounded-full object-cover border-4 shadow-lg group-hover:scale-110 transition-transform duration-200 ${agentStatus[booking.agentId]?.online ? 'border-green-500' : 'border-gray-400'}`}
                      style={{ boxShadow: agentStatus[booking.agentId]?.online ? '0 0 0 4px #bbf7d0' : '0 0 0 4px #e5e7eb' }}
                    />
                    <span
                      className={`absolute right-2 bottom-2 w-5 h-5 border-2 border-white rounded-full z-50 animate-pulse ${agentStatus[booking.agentId]?.online ? 'bg-green-500' : 'bg-gray-400'}`}
                      title={agentStatus[booking.agentId]?.online ? 'Online' : 'Offline'}
                    ></span>
                    {agentStatus[booking.agentId] && (
                      <span className={`absolute left-2 top-2 px-2 py-0.5 rounded-full text-xs font-bold shadow ${agentStatus[booking.agentId].online ? 'bg-green-100 text-green-700 border border-green-300' : 'bg-gray-200 text-gray-600 border border-gray-300'}`}>
                        {agentStatus[booking.agentId].online ? 'Online' : 'Offline'}
                      </span>
                    )}
                  </div>
                  <div className="font-bold text-lg text-center text-gray-800 truncate max-w-[120px]">
                    <Link to={`/public-profile/${booking.agentId}`} className="hover:underline text-green-700 hover:text-green-800 transition-colors">
                      {bookedUser?.name || "User"}
                    </Link>
                  </div>
                  <div className="flex gap-2 mt-2 flex-wrap justify-center">
                    <button
                      className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded-full font-semibold shadow text-xs transition"
                      onClick={() => navigate(`/messages/${booking.userId}`)}
                    >
                      Message
                    </button>
                    {bookedUser?.phone && (
                      <a
                        href={`tel:${bookedUser.phone}`}
                        className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded-full font-semibold shadow text-xs transition flex items-center"
                        style={{ textDecoration: 'none' }}
                      >
                        Call Now
                      </a>
                    )}
                  </div>
                </div>
                {/* Booking details */}
                <div className="flex-1 w-full grid grid-cols-1 md:grid-cols-2 gap-0 pr-0 md:pr-32 relative">
                  <div className="mb-1"><span className="font-semibold">Service:</span> {booking.service}</div>
                  <div className="mb-1"><span className="font-semibold">Name:</span> {booking.name}</div>
                  <div className="mb-1"><span className="font-semibold">Address:</span> {booking.address}</div>
                  <div className="mb-1"><span className="font-semibold">Phone:</span> {booking.phone}</div>
                  <div className="mb-1"><span className="font-semibold">Email:</span> {booking.email}</div>
                  <div className="mb-1"><span className="font-semibold">Description:</span> {booking.description}</div>
                  {/* Booking date bottom right */}
                  <div className="absolute right-0 bottom-0 text-xs text-gray-400 italic pr-2 pb-1">
                    Booked: {booking.createdAt ? new Date(booking.createdAt).toLocaleString() : "Unknown"}
                  </div>
                  {/* Rating display right side */}
                  {bookingRatings[booking._id] && (
                    <div className="absolute right-0 top-0 flex flex-col items-end pr-2 pt-1">
                      <StarDisplay value={bookingRatings[booking._id].rating} />
                      {bookingRatings[booking._id].comment && (
                        <div className="text-xs text-gray-600 max-w-xs text-right mt-1 bg-gray-100 rounded p-1">{bookingRatings[booking._id].comment}</div>
                      )}
                    </div>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}