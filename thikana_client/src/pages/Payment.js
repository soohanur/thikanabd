import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import axios from "axios";

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
        const res = await axios.get("http://localhost:5000/api/bookings/user", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const found = res.data.find(b => b._id === bookingId || b._id?.toString() === bookingId);
        if (!found) {
          setError("Booking not found.");
          setLoading(false);
          return;
        }
        setBooking(found);
        const agentRes = await axios.get(`http://localhost:5000/api/users/${found.agentId}`);
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
      const res = await axios.post("http://localhost:5000/api/payment/initiate", { bookingId }, {
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
    <div className="w-full max-w-xl mx-auto bg-white rounded-xl shadow p-8 mt-12">
      <h2 className="text-2xl font-bold mb-6 text-center">Payment</h2>
      {loading ? (
        <div className="text-center text-gray-500">Loading...</div>
      ) : error ? (
        <div className="text-center text-red-500">{error}</div>
      ) : booking && agent ? (
        <>
          <div className="mb-4 text-center">
            <div className="font-bold text-lg">Agent: {agent.name}</div>
            <img
              src={agent.profilePicture ? (agent.profilePicture.startsWith('http') ? agent.profilePicture : `http://localhost:5000${agent.profilePicture}`) : undefined}
              alt="Agent"
              className="w-20 h-20 rounded-full bg-gray-200 mx-auto mb-2 object-cover"
            />
            <div className="text-gray-600">Service: {booking.service}</div>
            <div className="text-gray-600">Agent Charge: <span className="font-bold text-green-700">৳{agent.agentCharge}</span></div>
          </div>
          <div className="mb-4">
            <div className="font-semibold">Booking Details:</div>
            <div>Name: {booking.name}</div>
            <div>Address: {booking.address}</div>
            <div>Phone: {booking.phone}</div>
            <div>Email: {booking.email}</div>
            <div>Description: {booking.description}</div>
          </div>
          <button
            className="bg-green-600 text-white px-6 py-2 rounded font-bold w-full"
            onClick={handlePay}
            disabled={redirecting}
          >
            {redirecting ? "Redirecting to Payment..." : `Pay ৳${agent.agentCharge} with SSLCommerz`}
          </button>
        </>
      ) : null}
    </div>
  );
}
