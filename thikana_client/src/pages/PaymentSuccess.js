import React from "react";
import { useSearchParams } from "react-router-dom";

export default function PaymentSuccess() {
  const [searchParams] = useSearchParams();
  const bookingId = searchParams.get("bookingId");
  return (
    <div className="w-full max-w-xl mx-auto bg-white rounded-xl shadow p-8 mt-12 text-center">
      <h2 className="text-2xl font-bold mb-6 text-green-700">Payment Successful!</h2>
      <div className="mb-4">Your payment for booking <span className="font-bold">{bookingId}</span> was successful.</div>
      <div className="mb-4">Thank you for booking an agent. You can view your booking details in your dashboard.</div>
    </div>
  );
}
