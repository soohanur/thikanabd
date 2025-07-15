import React from "react";
import { useSearchParams } from "react-router-dom";

export default function PaymentFail() {
  const [searchParams] = useSearchParams();
  const bookingId = searchParams.get("bookingId");
  return (
    <div className="w-full max-w-xl mx-auto bg-white rounded-xl shadow p-8 mt-12 text-center">
      <h2 className="text-2xl font-bold mb-6 text-red-700">Payment Failed</h2>
      <div className="mb-4">
        Your payment for booking{" "}
        <span className="font-bold">{bookingId}</span> was not successful.
      </div>
      <div className="mb-4">
        Please try again or contact support if the issue persists.
      </div>
    </div>
  );
}
