import React from "react";
import { useSearchParams } from "react-router-dom";


export default function PaymentSuccess() {
  const [searchParams] = useSearchParams();
  const bookingId = searchParams.get("bookingId");
  return (
    <div className="w-full min-h-screen flex items-center justify-center bg-gray-50 px-[15px]">
      <div className="w-full max-w-xl bg-white rounded-xl shadow p-8 text-center">
        <div className="flex flex-col items-center mb-6">
          <div className="bg-green-100 rounded-full p-4 mb-4 flex items-center justify-center" style={{width: '90px', height: '90px'}}>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <circle cx="12" cy="12" r="10" fill="#22c55e"/>
              <path stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" d="M8 12.5l3 3 5-5" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold mb-2 text-green-700">Payment Successful!</h2>
        </div>
        <div className="mb-4 text-gray-600">Thank you for booking an agent. You can view your booking details in your dashboard.</div>
        <button
          className="mt-6 bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-full font-bold text-lg shadow transition"
          onClick={() => window.location.href = '/profiles'}
        >
          Dashboard
        </button>
      </div>
    </div>
  );
}
