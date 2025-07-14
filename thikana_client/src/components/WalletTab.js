import React from "react";

export default function WalletTab({ user }) {
  // You can expand this with real wallet/balance/transactions logic as needed
  return (
    <div className="w-full max-w-xl mx-auto bg-white rounded-xl shadow p-8 space-y-6">
      <h2 className="text-2xl font-bold mb-6 text-center">My Wallet</h2>
      <div className="text-center">
        <div className="text-lg font-semibold mb-2">Wallet Balance</div>
        <div className="text-3xl font-bold text-green-700 mb-4">
          ৳ {user?.walletBalance || "0.00"}
        </div>
        {/* You can add transaction history, add funds, withdraw, etc. here */}
        <div className="text-gray-500">No transactions yet.</div>
      </div>
    </div>
  );
}