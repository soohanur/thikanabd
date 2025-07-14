import React from "react";

export default function BookedPropertyTab({ user }) {
  return (
    <div className="w-full max-w-2xl mx-auto bg-white rounded-xl shadow p-8">
      <h2 className="text-2xl font-bold mb-6 text-center">Booked Property</h2>
      <div className="text-gray-500 text-center">No booked property data yet.</div>
    </div>
  );
}
