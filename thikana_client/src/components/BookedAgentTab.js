import React, { useEffect, useState } from "react";
import axios from "axios";
import { apiUrl } from "../utils/api";
import { Link, useNavigate } from "react-router-dom";

function StarRating({ value, onChange }) {
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          className={
            star <= value
              ? "text-yellow-400 text-2xl focus:outline-none"
              : "text-gray-300 text-2xl focus:outline-none"
          }
          onClick={() => onChange(star)}
        >
          ★
        </button>
      ))}
    </div>
  );
}

export default function BookedAgentTab({ user }) {
  const [bookings, setBookings] = useState([]);
  const [agentDetails, setAgentDetails] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showRating, setShowRating] = useState({});
  const [ratingValue, setRatingValue] = useState({});
  const [ratingComment, setRatingComment] = useState({});
  const [ratingSuccess, setRatingSuccess] = useState({});
  const [ratingError, setRatingError] = useState({});
  const [userRatings, setUserRatings] = useState({});
  const [agentStatus, setAgentStatus] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchBookings() {
      setLoading(true);
      setError("");
      try {
        const token = localStorage.getItem("thikana_token");
        const res = await axios.get(apiUrl("/api/bookings/user"), {
          headers: { Authorization: `Bearer ${token}` },
        });
        // Only keep bookings that have agentId (i.e., agent bookings)
        setBookings(res.data.filter(b => b.agentId));
        // Fetch agent details for each booking
        const agentIds = [...new Set(res.data.map(b => b.agentId))];
        const details = {};
        await Promise.all(agentIds.map(async (aid) => {
          try {
            const agentRes = await axios.get(apiUrl(`/api/users/${aid}`));
            details[aid] = agentRes.data.user;
          } catch {}
        }));
        setAgentDetails(details);
        // Fetch user ratings for these bookings (always get latest from DB)
        const bookingIds = res.data.map(b => b._id);
        const ratingsRes = await axios.post(apiUrl('/api/agent/booking/ratings-by-user'), { bookingIds }, { headers: { Authorization: `Bearer ${token}` } });
        const ratingsMap = {};
        ratingsRes.data.forEach(r => { ratingsMap[r.bookingId] = r; });
        setUserRatings(ratingsMap);
      } catch (err) {
        setError("Failed to load bookings.");
      } finally {
        setLoading(false);
      }
    }
    fetchBookings();
  }, []);

  // Always check latest rating after submitting
  async function refreshUserRatings(bookingIds) {
    try {
      const token = localStorage.getItem("thikana_token");
      const ratingsRes = await axios.post(apiUrl('/api/agent/booking/ratings-by-user'), { bookingIds }, { headers: { Authorization: `Bearer ${token}` } });
      const ratingsMap = {};
      ratingsRes.data.forEach(r => { ratingsMap[r.bookingId] = r; });
      setUserRatings(ratingsMap);
    } catch {}
  }

  // Fetch agent online/offline statuses
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

  // Sort bookings: unpaid first, then latest booking (by createdAt or _id descending)
  const sortedBookings = bookings.slice().sort((a, b) => {
    // Unpaid first
    if ((a.payment === 'paid') && (b.payment !== 'paid')) return 1;
    if ((a.payment !== 'paid') && (b.payment === 'paid')) return -1;
    // Both same payment status, sort by createdAt or _id descending
    if (a.createdAt && b.createdAt) {
      return new Date(b.createdAt) - new Date(a.createdAt);
    }
    return (b._id?.toString() || '').localeCompare(a._id?.toString() || '');
  });

  // Cancel booking handler
  async function handleCancelBooking(bookingId) {
    if (!window.confirm('Are you sure you want to cancel this booking?')) return;
    try {
      const token = localStorage.getItem('thikana_token');
      await axios.delete(apiUrl(`/api/bookings/${bookingId}`), {
        headers: { Authorization: `Bearer ${token}` },
      });
      setBookings(prev => prev.filter(b => b._id !== bookingId));
    } catch (err) {
      alert('Failed to cancel booking. Please try again.');
    }
  }

  return (
    <div className="w-full min-h-screen p-4 flex flex-col items-center">
      <h2 className="text-3xl font-bold mb-8 text-center text-green-700 drop-shadow">Booked Agents</h2>
      {loading ? (
        <div className="text-center text-gray-500">Loading...</div>
      ) : error ? (
        <div className="text-center text-red-500">{error}</div>
      ) : bookings.length === 0 ? (
        <div className="text-center text-gray-500">No booked agents yet.</div>
      ) : (
        <ul className="w-full max-w-5xl flex flex-col gap-6">
          {sortedBookings.map((booking) => {
            const agent = agentDetails[booking.agentId];
            return (
              <li
                key={booking._id}
                className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-shadow flex flex-col md:flex-row items-center gap-6 p-6 border border-gray-100 relative md:items-stretch"
              >
                {/* Rate Agent button, form, or submitted rating - top right */}
                <div className="absolute top-6 right-6 flex flex-col items-end z-10 min-w-[180px]">
                  {userRatings[booking._id] ? (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-3 flex flex-col items-end shadow">
                      <div className="flex gap-1 mb-1">
                        {[1,2,3,4,5].map(star => (
                          <span key={star} className={star <= (userRatings[booking._id].rating || 0) ? 'text-yellow-400 text-xl' : 'text-gray-300 text-xl'}>★</span>
                        ))}
                      </div>
                      {userRatings[booking._id].comment && (
                        <div className="text-xs text-gray-700 italic max-w-[160px] text-right">"{userRatings[booking._id].comment}"</div>
                      )}
                      <div className="text-green-700 text-xs mt-1 font-semibold">You rated this agent</div>
                    </div>
                  ) : (
                    (!userRatings[booking._id]) && (
                      <>
                        <button
                          className="bg-green-700 hover:bg-green-800 text-white px-4 py-1 rounded-full font-semibold shadow transition mb-2"
                          onClick={() => setShowRating((prev) => ({ ...prev, [booking._id]: !prev[booking._id] }))}
                        >
                          {showRating[booking._id] ? "Close Rating" : "Rate Agent"}
                        </button>
                        {showRating[booking._id] && (
                          <form
                            className="mt-2 w-64 flex flex-col items-center gap-2 bg-gray-50 p-3 rounded-lg border shadow-lg"
                            onSubmit={async (e) => {
                              e.preventDefault();
                              setRatingError({ ...ratingError, [booking._id]: null });
                              setRatingSuccess({ ...ratingSuccess, [booking._id]: null });
                              try {
                                const token = localStorage.getItem("thikana_token");
                                await axios.post(
                                  apiUrl(`/api/agent/${booking.agentId}/rating`),
                                  {
                                    rating: ratingValue[booking._id] || 0,
                                    comment: ratingComment[booking._id] || "",
                                    bookingId: booking._id,
                                  },
                                  { headers: { Authorization: `Bearer ${token}` } }
                                );
                                setRatingSuccess({ ...ratingSuccess, [booking._id]: "Thank you for your rating!" });
                                setShowRating({ ...showRating, [booking._id]: false });
                                setRatingValue({ ...ratingValue, [booking._id]: 0 });
                                setRatingComment({ ...ratingComment, [booking._id]: "" });
                                // Always refresh from DB after submit
                                await refreshUserRatings([booking._id]);
                              } catch (err) {
                                setRatingError({ ...ratingError, [booking._id]: "Failed to submit rating." });
                              }
                            }}
                          >
                            <StarRating
                              value={ratingValue[booking._id] || 0}
                              onChange={(val) => setRatingValue({ ...ratingValue, [booking._id]: val })}
                            />
                            <textarea
                              className="w-full mt-2 p-2 border rounded"
                              rows={2}
                              placeholder="Leave a comment (optional)"
                              value={ratingComment[booking._id] || ""}
                              onChange={(e) => setRatingComment({ ...ratingComment, [booking._id]: e.target.value })}
                            />
                            <button
                              type="submit"
                              className="bg-green-700 hover:bg-green-800 text-white px-4 py-1 rounded-full font-semibold shadow transition mt-2"
                              disabled={!(ratingValue[booking._id] > 0)}
                            >
                              Submit Rating
                            </button>
                            {ratingError[booking._id] && (
                              <div className="text-red-500 text-xs mt-1">{ratingError[booking._id]}</div>
                            )}
                            {ratingSuccess[booking._id] && (
                              <div className="text-green-700 text-xs mt-1">{ratingSuccess[booking._id]}</div>
                            )}
                          </form>
                        )}
                      </>
                    )
                  )}
                </div>
                {/* Agent details */}
                <div className="flex flex-col items-center w-full md:w-1/5 mb-4 md:mb-0">
                  <div className="relative mb-2">
                    <img
                      src={agent?.profilePicture ? (agent.profilePicture.startsWith('http') ? agent.profilePicture : apiUrl(agent.profilePicture)) : process.env.PUBLIC_URL + '/default-profile.png'}
                      alt={agent?.name}
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
                      {agent?.name || "Agent"}
                    </Link>
                  </div>
                  <div className="flex gap-2 mt-2 flex-wrap justify-center">
                    <button
                      className="bg-green-700 hover:bg-green-800 text-white px-3 py-1 rounded-full font-semibold shadow text-xs transition"
                      onClick={() => navigate(`/messages/${booking.agentId}`)}
                    >
                      Message
                    </button>
                    {agent?.phone && (
                      <a
                        href={`tel:${agent.phone}`}
                        className="bg-green-700 hover:bg-green-800 text-white px-3 py-1 rounded-full font-semibold shadow text-xs transition flex items-center"
                        style={{ textDecoration: 'none' }}
                      >
                        Call Now
                      </a>
                    )}
                  </div>
                </div>
                {/* Booking details */}
                <div className="flex-1 w-full md:w-3/5 grid grid-cols-1 md:grid-cols-2 gap-1 pr-0 md:pr-32 relative">
                  <div className="mb-1"><span className="font-semibold">Service:</span> {booking.service}</div>
                  <div className="mb-1"><span className="font-semibold">Name:</span> {booking.name}</div>
                  <div className="mb-1"><span className="font-semibold">Address:</span> {booking.address}</div>
                  <div className="mb-1"><span className="font-semibold">Phone:</span> {booking.phone}</div>
                  <div className="mb-1"><span className="font-semibold">Email:</span> {booking.email}</div>
                  <div className="mb-1"><span className="font-semibold">Description:</span> {booking.description}</div>
                  <div className="mb-1 flex items-center gap-2 col-span-2 flex-wrap">
                    <span className="font-semibold">Payment:</span>
                    {booking.payment === "paid" ? (
                      <span className="text-green-600 font-bold">Paid</span>
                    ) : (
                      <div className="flex items-center gap-2">
                        <button
                          className="inline-flex items-center gap-1 bg-green-600 hover:bg-green-700 text-white text-xs px-3 py-1 rounded-full font-semibold shadow-sm transition focus:outline-none focus:ring-2 focus:ring-green-400"
                          onClick={() => navigate(`/payment?bookingId=${booking._id}`)}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a5 5 0 00-10 0v2M5 12h14M7 16h10" /></svg>
                          Pay Now
                        </button>
                        <button
                          className="inline-flex items-center gap-1 bg-gray-200 hover:bg-gray-300 text-gray-800 text-xs px-3 py-1 rounded-full font-semibold shadow-sm transition focus:outline-none focus:ring-2 focus:ring-gray-400"
                          onClick={() => handleCancelBooking(booking._id)}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                          Cancel
                        </button>
                      </div>
                    )}
                  </div>
                  {/* Booking date bottom right */}
                  <div className="absolute right-0 bottom-0 text-xs text-gray-400 italic pr-2 pb-1">
                    Booked: {booking.createdAt ? new Date(booking.createdAt).toLocaleString() : "Unknown"}
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
