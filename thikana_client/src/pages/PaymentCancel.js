import React from "react";
import { useSearchParams } from "react-router-dom";

export default function PaymentCancel() {
  const [searchParams] = useSearchParams();
  const bookingId = searchParams.get("bookingId");
  return (
    <div className="w-full max-w-xl mx-auto bg-white rounded-xl shadow p-8 mt-12 text-center">
      <h2 className="text-2xl font-bold mb-6 text-yellow-700">Payment Cancelled</h2>
      <div className="mb-4">Your payment for booking <span className="font-bold">{bookingId}</span> was cancelled.</div>
      <div className="mb-4">You can retry payment from your dashboard if you wish to complete the booking.</div>
    </div>
  );
}
