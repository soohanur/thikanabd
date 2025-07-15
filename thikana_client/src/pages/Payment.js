import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { apiUrl } from "../utils/api";

export default function Payment() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const bookingId = searchParams.get("bookingId");
  const [booking, setBooking] = useState(null);
  const [agent, setAgent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [redirecting, setRedirecting] = useState(false);

  useEffect(() => {
    async function fetchBooking() {
      setLoading(true);
      setError("");
      try {
        if (!bookingId) {
          setError("No booking ID provided.");
          setLoading(false);
          return;
        }
        const token = localStorage.getItem("thikana_token");
        const res = await axios.get(apiUrl("/api/bookings/user"), {
          headers: { Authorization: `Bearer ${token}` },
        });
        const found = res.data.find(b => b._id === bookingId || b._id?.toString() === bookingId);
        if (!found) {
          setError("Booking not found.");
          setLoading(false);
          return;
        }
        setBooking(found);
        const agentRes = await axios.get(apiUrl(`/api/users/${found.agentId}`));
        setAgent(agentRes.data.user);
      } catch (err) {
        setError("Failed to load booking or agent info.");
      } finally {
        setLoading(false);
      }
    }
    fetchBooking();
  }, [bookingId]);

  const handlePay = async () => {
    setRedirecting(true);
    try {
      const token = localStorage.getItem("thikana_token");
      const res = await axios.post(apiUrl("/api/payment/initiate"), { bookingId }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.data.url) {
        window.location.href = res.data.url;
      } else {
        setError("Failed to initiate payment.");
        setRedirecting(false);
      }
    } catch (err) {
      setError("Failed to initiate payment.");
      setRedirecting(false);
    }
  };

  return (
    <div className="w-full min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-white px-[15px]">
      <div className="w-full max-w-xl bg-white rounded-2xl shadow-lg p-10 text-center border border-green-100">
        
        {loading ? (
          <div className="text-center text-gray-500">Loading...</div>
        ) : error ? (
          <div className="text-center text-red-500">{error}</div>
        ) : booking && agent ? (
          <>
            <div className="mb-4 text-center">
              <div className="font-bold text-lg">Agent: {agent.name}</div>
              <img
                src={agent.profilePicture ? (agent.profilePicture.startsWith('http') ? agent.profilePicture : apiUrl(agent.profilePicture)) : undefined}
                alt="Agent"
                className="w-20 h-20 rounded-full bg-gray-200 mx-auto mb-2 object-cover border-4 border-green-100"
              />
              <div className="text-gray-600">Service: {booking.service}</div>
              <div className="text-gray-600">Agent Charge: <span className="font-bold text-green-700">৳{agent.agentCharge}</span></div>
            </div>
            <div className="mb-4 bg-green-50 rounded-lg p-4 border border-green-100 text-left">
              <div className="font-semibold mb-2 text-green-700">Booking Details</div>
              <div><span className="font-semibold">Name:</span> {booking.name}</div>
              <div><span className="font-semibold">Address:</span> {booking.address}</div>
              <div><span className="font-semibold">Phone:</span> {booking.phone}</div>
              <div><span className="font-semibold">Email:</span> {booking.email}</div>
              <div><span className="font-semibold">Description:</span> {booking.description}</div>
            </div>
            <div className="flex flex-col gap-3 mt-6">
              <button
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-full font-bold w-full text-lg shadow transition"
                onClick={handlePay}
                disabled={redirecting}
              >
                {redirecting ? "Redirecting to Payment..." : `Pay ৳${agent.agentCharge}`}
              </button>
              <button
                className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-6 py-2 rounded-full font-bold w-full border border-gray-300 transition"
                onClick={() => navigate('/profiles?tab=booked-agents')}
                type="button"
              >
                Pay Later
              </button>
            </div>
          </>
        ) : null}
      </div>
    </div>
  );
}
