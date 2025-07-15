import React, { useEffect, useState } from "react";
import axios from "axios";
import { apiUrl } from "../utils/api";

export default function BookedAgentTab({ user }) {
  const [bookings, setBookings] = useState([]);
  const [agentDetails, setAgentDetails] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchBookings() {
      setLoading(true);
      setError("");
      try {
        const token = localStorage.getItem("thikana_token");
        const res = await axios.get(apiUrl("/api/bookings/user"), {
          headers: { Authorization: `Bearer ${token}` },
        });
        setBookings(res.data);
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
      <h2 className="text-2xl font-bold mb-6 text-center">Booked Agents</h2>
      {loading ? (
        <div className="text-center text-gray-500">Loading...</div>
      ) : error ? (
        <div className="text-center text-red-500">{error}</div>
      ) : bookings.length === 0 ? (
        <div className="text-center text-gray-500">No booked agents yet.</div>
      ) : (
        <div className="space-y-6">
          {bookings.map((booking) => {
            const agent = agentDetails[booking.agentId];
            return (
              <div key={booking._id} className="border rounded-lg p-4 flex flex-col md:flex-row gap-4 items-center">
                {/* Agent details */}
                <div className="flex flex-col items-center w-full md:w-1/3">
                  <img
                    src={agent?.profilePicture ? (agent.profilePicture.startsWith('http') ? agent.profilePicture : apiUrl(agent.profilePicture)) : undefined}
                    alt="Agent"
                    className="w-20 h-20 rounded-full bg-gray-200 mb-2 object-cover"
                  />
                  <div className="font-bold text-lg text-center">{agent?.name || "Agent"}</div>
                  <div className="text-xs text-gray-500 text-center">ID: {booking.agentId}</div>
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
                    <button className="bg-yellow-500 text-white px-3 py-1 rounded-full font-semibold" onClick={() => window.location.href = `/payment?bookingId=${booking._id}`}>Pay Now</button>
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
