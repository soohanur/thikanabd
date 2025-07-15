import React, { useEffect, useState } from "react";
import axios from "axios";
import defaultProfile from "../assect/images/profile-thumb.png";

const MIN_WITHDRAWAL = 1000;

export default function WalletTab({ user }) {
  const [transactions, setTransactions] = useState([]);
  const [balance, setBalance] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [withdrawMsg, setWithdrawMsg] = useState("");
  const [payouts, setPayouts] = useState([]);
  const [payoutLoading, setPayoutLoading] = useState(false);

  useEffect(() => {
    async function fetchTransactions() {
      setLoading(true);
      setError("");
      try {
        const token = localStorage.getItem("thikana_token");
        // Get all paid bookings for this agent
        const res = await axios.get("http://localhost:5000/api/bookings/agent", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const paidBookings = res.data.filter(b => b.payment === "paid" && b.agentCharge);
        setTransactions(paidBookings);
        // Calculate wallet balance (sum of 75% of agentCharge for all paid bookings)
        const total = paidBookings.reduce((sum, b) => sum + (b.agentCharge * 0.75), 0);
        setBalance(user?.walletBalance ?? total); // Prefer DB walletBalance if available
      } catch (err) {
        setError("Failed to load wallet data.");
      } finally {
        setLoading(false);
      }
    }
    fetchTransactions();
  }, [user]);

  useEffect(() => {
    async function fetchPayouts() {
      setPayoutLoading(true);
      try {
        const token = localStorage.getItem("thikana_token");
        const res = await axios.get("http://localhost:5000/api/wallet/payouts", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setPayouts(res.data);
      } catch {
        setPayouts([]);
      } finally {
        setPayoutLoading(false);
      }
    }
    fetchPayouts();
  }, [user]);

  const handleWithdraw = async (e) => {
    e.preventDefault();
    setWithdrawMsg("");
    if (!withdrawAmount || isNaN(withdrawAmount) || Number(withdrawAmount) < MIN_WITHDRAWAL) {
      setWithdrawMsg(`Minimum withdrawal amount is ৳${MIN_WITHDRAWAL}`);
      return;
    }
    try {
      const token = localStorage.getItem("thikana_token");
      const res = await axios.post("http://localhost:5000/api/wallet/withdraw", {
        amount: Number(withdrawAmount),
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setWithdrawMsg(res.data.message || "Withdrawal request submitted.");
      setWithdrawAmount("");
      // Refresh payout history
      const payoutRes = await axios.get("http://localhost:5000/api/wallet/payouts", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPayouts(payoutRes.data);
    } catch (err) {
      setWithdrawMsg(err?.response?.data?.message || "Failed to submit withdrawal request.");
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto bg-white rounded-xl shadow p-8">
      <h2 className="text-2xl font-bold mb-6 text-center">Wallet Balance</h2>
      <div className="mb-6 text-center">
        <span className="text-4xl font-bold text-green-700">৳{balance.toFixed(2)}</span>
        <div className="text-sm text-gray-500">(75% of agent fees, 25% platform charge)</div>
      </div>
      <form className="mb-8" onSubmit={handleWithdraw}>
        <h3 className="text-lg font-semibold mb-2">Request Withdrawal</h3>
        <div className="flex gap-2 mb-2">
          <input
            type="number"
            className="form-input w-1/2"
            placeholder={`Amount (min ৳${MIN_WITHDRAWAL})`}
            value={withdrawAmount}
            onChange={e => setWithdrawAmount(e.target.value)}
            min={MIN_WITHDRAWAL}
            required
          />
          <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded font-bold">Withdraw</button>
        </div>
        {withdrawMsg && <div className={`mt-2 text-sm font-bold ${withdrawMsg.includes("success") || withdrawMsg.includes("submitted") ? "text-green-600" : "text-red-600"}`}>{withdrawMsg}</div>}
      </form>
      <h3 className="text-xl font-semibold mb-4">Transaction History</h3>
      {loading ? (
        <div className="text-center text-gray-500">Loading...</div>
      ) : error ? (
        <div className="text-center text-red-500">{error}</div>
      ) : transactions.length === 0 ? (
        <div className="text-center text-gray-500">No transactions yet.</div>
      ) : (
        <div className="space-y-4 mb-8">
          {transactions.map(tx => (
            <div key={tx._id} className="flex items-center justify-between border rounded-lg p-4">
              <div className="flex items-center gap-3">
                <img
                  src={tx.userProfilePicture
                    ? (tx.userProfilePicture.startsWith('http')
                        ? tx.userProfilePicture
                        : `http://localhost:5000${tx.userProfilePicture}`)
                    : defaultProfile}
                  alt="User"
                  className="w-12 h-12 rounded-full bg-gray-200 object-cover"
                />
                <div>
                  <div className="font-bold">{tx.userName || "User"}</div>
                  <div className="text-xs text-gray-500">Paid by</div>
                </div>
              </div>
              <div className="text-right">
                <div className="font-bold text-green-700">৳{(tx.agentCharge * 0.75).toFixed(2)}</div>
                <div className="text-xs text-gray-500">{new Date(tx.createdAt).toLocaleString()}</div>
                <div className="text-xs text-orange-500">Platform Charge: ৳{(tx.agentCharge * 0.25).toFixed(2)}</div>
              </div>
            </div>
          ))}
        </div>
      )}
      <h3 className="text-xl font-semibold mb-4">Payout History</h3>
      {payoutLoading ? (
        <div className="text-center text-gray-500">Loading payouts...</div>
      ) : payouts.length === 0 ? (
        <div className="text-center text-gray-500">No payout requests yet.</div>
      ) : (
        <div className="space-y-4">
          {payouts.map(p => (
            <div key={p._id} className="flex items-center justify-between border rounded-lg p-4">
              <div>
                <div className="font-bold">৳{p.amount}</div>
                <div className="text-xs text-gray-500">Bkash: {p.bkashNumber}</div>
              </div>
              <div className="text-right">
                <div className={`font-bold ${p.status === "pending" ? "text-yellow-600" : p.status === "completed" ? "text-green-700" : "text-red-600"}`}>{p.status.charAt(0).toUpperCase() + p.status.slice(1)}</div>
                <div className="text-xs text-gray-500">{new Date(p.requestedAt).toLocaleString()}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}