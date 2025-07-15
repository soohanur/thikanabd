import React from "react";
import { useSearchParams } from "react-router-dom";

export default function PaymentFail() {
  const [searchParams] = useSearchParams();
  const bookingId = searchParams.get("bookingId");
  return (
    <div className="w-full min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-white px-[15px]">
      <div className="w-full max-w-xl bg-white rounded-2xl shadow-lg p-10 text-center border border-red-100">
        <div className="flex flex-col items-center mb-6">
          <div
            className="bg-red-100 rounded-full p-4 mb-4 flex items-center justify-center"
            style={{ width: "90px", height: "90px" }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-16 w-16 text-red-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <circle cx="12" cy="12" r="10" fill="#ef4444" />
              <path
                stroke="#fff"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M8 8l8 8M16 8l-8 8"
              />
            </svg>
          </div>
          <h2 className="text-2xl font-bold mb-2 text-red-700">
            Payment Failed
          </h2>
        </div>
        <div className="mb-4 text-gray-600">
          Please try again or contact support if the issue persists.
        </div>
        <button
          className="mt-6 bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-full font-bold text-lg shadow transition"
          onClick={() => (window.location.href = "/profiles")}
        >
          Dashboard
        </button>
      </div>
    </div>
  );
}
