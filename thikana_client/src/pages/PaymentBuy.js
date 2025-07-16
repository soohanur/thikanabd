import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { apiUrl } from "../utils/api";

export default function PaymentBuy() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const propertyId = searchParams.get("propertyId");
  const [property, setProperty] = useState(null);
  const [owner, setOwner] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [redirecting, setRedirecting] = useState(false);
  const [buyerPhone, setBuyerPhone] = useState("");

  useEffect(() => {
    async function fetchProperty() {
      setLoading(true);
      setError("");
      try {
        if (!propertyId) {
          setError("No property ID provided.");
          setLoading(false);
          return;
        }
        const res = await axios.get(apiUrl("/api/properties/all"));
        const found = res.data.find(p => p._id === propertyId || p._id?.toString() === propertyId);
        if (!found) {
          setError("Property not found.");
          setLoading(false);
          return;
        }
        setProperty(found);
        const ownerRes = await axios.get(apiUrl(`/api/users/${found.userId}`));
        setOwner(ownerRes.data.user);
      } catch (err) {
        setError("Failed to load property or owner info.");
      } finally {
        setLoading(false);
      }
    }
    fetchProperty();
    // Get phone from localStorage (set in buy.js)
    const storedPhone = localStorage.getItem("thikana_buyer_phone");
    if (storedPhone) setBuyerPhone(storedPhone);
  }, [propertyId]);

  // Calculate platform charge and total
  let platformCharge = 0;
  let total = 0;
  if (property) {
    if (property.type && property.type.toLowerCase() === 'buy') {
      platformCharge = 5000;
      total = (parseFloat(property.price) || 0) + platformCharge;
    } else if (property.type && property.type.toLowerCase() === 'rent') {
      platformCharge = Math.round((parseFloat(property.price) || 0) * 0.10);
      total = (parseFloat(property.price) || 0) + platformCharge;
    }
  }

  const handlePay = async () => {
    setRedirecting(true);
    try {
      const token = localStorage.getItem("thikana_token");
      if (!buyerPhone) {
        setError("No phone number found. Please go back and fill the buy form.");
        setRedirecting(false);
        return;
      }
      const res = await axios.post(apiUrl("/api/payment/initiate-buy"), { propertyId, phone: buyerPhone }, {
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
        ) : property && owner ? (
          <>
            <div className="mb-4 text-center">
              <div className="font-bold text-lg">Owner: {owner.name}</div>
              <img
                src={owner.profilePicture ? (owner.profilePicture.startsWith('http') ? owner.profilePicture : apiUrl(owner.profilePicture)) : undefined}
                alt="Owner"
                className="w-20 h-20 rounded-full bg-gray-200 mx-auto mb-2 object-cover border-4 border-green-100"
              />
              <div className="text-gray-600">Property: {property.title}</div>
              <div className="text-gray-600">Type: {property.type}</div>
              <div className="text-gray-600">Price: <span className="font-bold text-green-700">৳{property.price}</span></div>
            </div>
            <div className="mb-4 bg-green-50 rounded-lg p-4 border border-green-100 text-left">
              <div className="font-semibold mb-2 text-green-700">Payment Details</div>
              <div><span className="font-semibold">Platform Charge:</span> ৳{platformCharge}</div>
              <div><span className="font-semibold">Total Payable:</span> <span className="font-bold text-green-700">৳{total}</span></div>
            </div>
            <div className="flex flex-col gap-3 mt-6">
              <button
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-full font-bold w-full text-lg shadow transition"
                onClick={handlePay}
                disabled={redirecting}
              >
                {redirecting ? "Redirecting to Payment..." : `Pay ৳${total}`}
              </button>
              <button
                className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-6 py-2 rounded-full font-bold w-full border border-gray-300 transition"
                onClick={() => navigate('/profiles?tab=booked-properties')}
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
