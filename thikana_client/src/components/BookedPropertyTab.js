import React, { useEffect, useState } from "react";
import axios from "axios";
import { apiUrl } from "../utils/api";
import { useNavigate } from "react-router-dom";

export default function BookedPropertyTab({ user }) {
  const [activeTab, setActiveTab] = useState("booked");
  const [bookings, setBookings] = useState([]);
  const [sold, setSold] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      setError("");
      try {
        const token = localStorage.getItem("thikana_token");
        // Booked properties (user is buyer)
        const res = await axios.get(apiUrl("/api/property-bookings/user"), {
          headers: { Authorization: `Bearer ${token}` },
        });
        // Fetch property and owner details for each booking
        const bookingsWithDetails = await Promise.all(
          res.data.map(async (b) => {
            let propertyName = "";
            let ownerName = "";
            try {
              const propRes = await axios.get(apiUrl(`/api/properties/all`));
              const property = propRes.data.find(
                (p) => p._id === b.propertyId || p._id?.toString() === b.propertyId
              );
              propertyName = property?.title || property?.name || b.propertyId;
              const ownerRes = await axios.get(apiUrl(`/api/users/${b.ownerId}`));
              ownerName = ownerRes.data.user?.name || b.ownerId;
            } catch {}
            return { ...b, propertyName, ownerName };
          })
        );
        setBookings(bookingsWithDetails.filter((b) => b.propertyId && b.ownerId !== user?._id));
        // Sold properties (user is owner and status is paid)
        const soldRes = await axios.get(apiUrl("/api/property-bookings/owner"), {
          headers: { Authorization: `Bearer ${token}` },
        });
        const soldWithDetails = await Promise.all(
          soldRes.data.map(async (b) => {
            let propertyName = "";
            let ownerName = "";
            try {
              const propRes = await axios.get(apiUrl(`/api/properties/all`));
              const property = propRes.data.find(
                (p) => p._id === b.propertyId || p._id?.toString() === b.propertyId
              );
              propertyName = property?.title || property?.name || b.propertyId;
              const ownerRes = await axios.get(apiUrl(`/api/users/${b.ownerId}`));
              ownerName = ownerRes.data.user?.name || b.ownerId;
            } catch {}
            return { ...b, propertyName, ownerName };
          })
        );
        setSold(soldWithDetails.filter((b) => b.propertyId && b.status === "paid" && b.ownerId === user?._id));
      } catch (err) {
        setError("Failed to load property data.");
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [user]);

  const renderList = (list, type) => (
    <ul className="w-full max-w-5xl flex flex-col gap-6">
      {list.map((booking) => (
        <li
          key={booking._id}
          className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-shadow flex flex-col md:flex-row items-center gap-6 p-6 border border-gray-100 relative md:items-stretch"
        >
          <div className="flex flex-col items-center w-full md:w-1/5 mb-4 md:mb-0">
            <div className="relative mb-2">
              {booking.nidFront && (
                <img
                  src={apiUrl(booking.nidFront)}
                  alt="NID Front"
                  className="w-24 h-24 rounded-full object-cover border-4 shadow-lg"
                />
              )}
            </div>
            <div className="font-bold text-lg text-center text-gray-800 truncate max-w-[120px]">
              {booking.ownerName}
            </div>
            <div className="text-xs text-green-700 mt-2 cursor-pointer underline" onClick={() => navigate(`/property-detail/${booking.propertyId}`)}>
              {booking.propertyName}
            </div>
          </div>
          <div className="flex-1 w-full md:w-3/5 grid grid-cols-1 md:grid-cols-2 gap-1 pr-0 md:pr-32 relative">
            <div className="mb-1">
              <span className="font-semibold">Permanent Address:</span> {booking.permanentAddress}
            </div>
            <div className="mb-1">
              <span className="font-semibold">District:</span> {booking.district}
            </div>
            <div className="mb-1">
              <span className="font-semibold">Thana:</span> {booking.thana}
            </div>
            <div className="mb-1">
              <span className="font-semibold">Profession:</span> {booking.profession}
            </div>
            {booking.university && (
              <div className="mb-1">
                <span className="font-semibold">University:</span> {booking.university}
              </div>
            )}
            {booking.institution && (
              <div className="mb-1">
                <span className="font-semibold">Institution:</span> {booking.institution}
              </div>
            )}
            <div className="mb-1">
              <span className="font-semibold">Phone:</span> {booking.phone}
            </div>
            {booking.nidFront && (
              <div className="mb-1">
                <span className="font-semibold">NID Front:</span>{' '}
                <a
                  href={apiUrl(booking.nidFront)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-green-700 underline"
                >
                  View
                </a>
              </div>
            )}
            {booking.nidBack && (
              <div className="mb-1">
                <span className="font-semibold">NID Back:</span>{' '}
                <a
                  href={apiUrl(booking.nidBack)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-green-700 underline"
                >
                  View
                </a>
              </div>
            )}
            <div className="mb-1 flex items-center gap-2 col-span-2 flex-wrap">
              <span className="font-semibold">Payment:</span>
              {booking.status === "paid" ? (
                <span className="text-green-600 font-bold">Paid</span>
              ) : (
                <>
                  <span className="text-orange-600 font-bold">Pending</span>
                  <button
                    className="inline-flex items-center gap-1 bg-green-600 hover:bg-green-700 text-white text-xs px-3 py-1 rounded-full font-semibold shadow-sm transition ml-2"
                    onClick={() => (window.location.href = `/PaymentBuy?propertyId=${booking.propertyId}`)}
                  >
                    Pay Now
                  </button>
                </>
              )}
            </div>
            <div className="absolute right-0 bottom-0 text-xs text-gray-400 italic pr-2 pb-1">
              {type === "sold"
                ? "Sold:"
                : "Booked:"}{" "}
              {booking.createdAt ? new Date(booking.createdAt).toLocaleString() : "Unknown"}
            </div>
          </div>
        </li>
      ))}
    </ul>
  );

  return (
    <div className="w-full min-h-screen p-4 flex flex-col items-center">
      <div className="flex gap-4 mb-8">
        <button
          className={`px-6 py-2 rounded-full font-bold shadow ${
            activeTab === "sold" ? "bg-green-700 text-white" : "bg-gray-100 text-green-700"
          }`}
          onClick={() => setActiveTab("sold")}
        >
          Sold Property
        </button>
        <button
          className={`px-6 py-2 rounded-full font-bold shadow ${
            activeTab === "booked" ? "bg-green-700 text-white" : "bg-gray-100 text-green-700"
          }`}
          onClick={() => setActiveTab("booked")}
        >
          Booked Property
        </button>
      </div>
      <h2 className="text-3xl font-bold mb-8 text-center text-green-700 drop-shadow">
        {activeTab === "sold" ? "Sold Properties" : "Booked Properties"}
      </h2>
      {loading ? (
        <div className="text-center text-gray-500">Loading...</div>
      ) : error ? (
        <div className="text-center text-red-500">{error}</div>
      ) : activeTab === "sold" ? (
        sold.length === 0 ? (
          <div className="text-center text-gray-500">No sold properties yet.</div>
        ) : (
          renderList(sold, "sold")
        )
      ) : (
        bookings.length === 0 ? (
          <div className="text-center text-gray-500">No booked properties yet.</div>
        ) : (
          renderList(bookings, "booked")
        )
      )}
    </div>
  );
}
