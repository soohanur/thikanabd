import React from "react";
import { useSearchParams } from "react-router-dom";

export default function PaymentCancel() {
  const [searchParams] = useSearchParams();
  const bookingId = searchParams.get("bookingId");
  return (
    <div className="w-full min-h-screen flex items-center justify-center bg-gradient-to-br from-yellow-50 to-white px-[15px]">
      <div className="w-full max-w-xl bg-white rounded-2xl shadow-lg p-10 text-center border border-yellow-100">
        <div className="flex flex-col items-center mb-6">
          <div className="bg-yellow-100 rounded-full p-4 mb-4 flex items-center justify-center" style={{width: '90px', height: '90px'}}>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <circle cx="12" cy="12" r="10" fill="#fde68a"/>
              <path stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" d="M8 12l4 4 4-8" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold mb-2 text-yellow-700">Payment Cancelled</h2>
        </div>
        <div className="mb-4 text-lg text-gray-700">Your payment for booking <span className="font-bold">{bookingId}</span> was cancelled.</div>
        <div className="mb-4 text-gray-600">You can retry payment from your dashboard if you wish to complete the booking.</div>
        <button
          className="mt-6 bg-yellow-500 hover:bg-yellow-600 text-white px-6 py-2 rounded-full font-bold text-lg shadow transition"
          onClick={() => window.location.href = '/profiles'}
        >
          Dashboard
        </button>
      </div>
    </div>
  );
}
