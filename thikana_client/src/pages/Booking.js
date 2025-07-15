import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { apiUrl } from "../utils/api";

const SERVICE_OPTIONS = [
  "Sell a Property",
  "Rent A Property",
  "Find a Property"
];

export default function Booking() {
  const { agentId } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    address: "",
    service: SERVICE_OPTIONS[0],
    phone: "",
    email: "",
    description: ""
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Redirect to login if not authenticated
  useEffect(() => {
    const token = localStorage.getItem("thikana_token");
    if (!token) {
      navigate(`/auth-login?redirect=/book-agent/${agentId}`);
    }
  }, [agentId, navigate]);

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const token = localStorage.getItem("thikana_token");
      const res = await axios.post(apiUrl("/api/bookings"), { ...form, agentId }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log("Booking API response:", res.data); // Debug log
      // Use bookingId from response to redirect to payment
      let bookingId = res.data.bookingId;
      if (bookingId && typeof bookingId === 'object' && bookingId.$oid) {
        bookingId = bookingId.$oid;
      } else if (bookingId && bookingId.toString) {
        bookingId = bookingId.toString();
      }
      if (bookingId) {
        navigate(`/payment?bookingId=${bookingId}`);
      } else {
        setError("Booking created, but could not find booking ID for payment.");
      }
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to submit booking. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-xl mx-auto bg-white rounded-xl shadow p-8 mt-12">
      <h2 className="text-2xl font-bold mb-6 text-center">Book Agent</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-semibold mb-1">Name</label>
          <input className="form-input w-full" name="name" value={form.name} onChange={handleChange} required />
        </div>
        <div>
          <label className="block font-semibold mb-1">Address</label>
          <input className="form-input w-full" name="address" value={form.address} onChange={handleChange} required />
        </div>
        <div>
          <label className="block font-semibold mb-1">Service</label>
          <select className="form-select w-full" name="service" value={form.service} onChange={handleChange} required>
            {SERVICE_OPTIONS.map(opt => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block font-semibold mb-1">Phone Number</label>
          <input className="form-input w-full" name="phone" value={form.phone} onChange={handleChange} required />
        </div>
        <div>
          <label className="block font-semibold mb-1">Email</label>
          <input className="form-input w-full" name="email" value={form.email} onChange={handleChange} required type="email" />
        </div>
        <div>
          <label className="block font-semibold mb-1">Description</label>
          <textarea className="form-input w-full" name="description" value={form.description} onChange={handleChange} />
        </div>
        {error && <div className="text-red-600 font-bold">{error}</div>}
        <button type="submit" className="bg-green-600 text-white px-6 py-2 rounded font-bold w-full" disabled={loading}>
          {loading ? "Booking..." : "Book Agent"}
        </button>
      </form>
    </div>
  );
}
