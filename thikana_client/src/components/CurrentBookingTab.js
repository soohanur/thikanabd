import React, { useEffect, useState } from "react";
import axios from "axios";
import { apiUrl } from "../utils/api";

export default function BookingListTab({ user }) {
  const [bookings, setBookings] = useState([]);
  const [userDetails, setUserDetails] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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
      } catch (err) {
        setError("Failed to load bookings.");
      } finally {
        setLoading(false);
      }
    }
    fetchBookings();
  }, []);

  return (
    <div className="w-full max-w-2xl mx-auto bg-white rounded-xl shadow p-8">
      <h2 className="text-2xl font-bold mb-6 text-center">Current Bookings</h2>
      {loading ? (
        <div className="text-center text-gray-500">Loading...</div>
      ) : error ? (
        <div className="text-center text-red-500">{error}</div>
      ) : bookings.length === 0 ? (
        <div className="text-center text-gray-500">No current bookings yet.</div>
      ) : (
        <div className="space-y-6">
          {bookings.map((booking) => {
            const bookedUser = userDetails[booking.userId];
            return (
              <div key={booking._id} className="border rounded-lg p-4 flex flex-col md:flex-row gap-4 items-center">
                {/* User details */}
                <div className="flex flex-col items-center w-full md:w-1/3">
                  <img
                    src={bookedUser?.profilePicture ? (bookedUser.profilePicture.startsWith('http') ? bookedUser.profilePicture : apiUrl(bookedUser.profilePicture)) : undefined}
                    alt="User"
                    className="w-20 h-20 rounded-full bg-gray-200 mb-2 object-cover"
                  />
                  <div className="font-bold text-lg text-center">{bookedUser?.name || "User"}</div>
                  <div className="text-xs text-gray-500 text-center">ID: {booking.userId}</div>
                </div>
                {/* Booking details */}
                <div className="flex-1 w-full">
                  <div className="mb-1"><span className="font-semibold">Service:</span> {booking.service}</div>
                  <div className="mb-1"><span className="font-semibold">Name:</span> {booking.name}</div>
                  <div className="mb-1"><span className="font-semibold">Address:</span> {booking.address}</div>
                  <div className="mb-1"><span className="font-semibold">Phone:</span> {booking.phone}</div>
                  <div className="mb-1"><span className="font-semibold">Email:</span> {booking.email}</div>
                  <div className="mb-1"><span className="font-semibold">Description:</span> {booking.description}</div>
                  <div className="mb-1"><span className="font-semibold">Payment:</span> {booking.payment === "paid" ? (
                    <span className="text-green-600 font-bold">Paid</span>
                  ) : (
                    <span className="text-yellow-600 font-bold">Unpaid</span>
                  )}</div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}