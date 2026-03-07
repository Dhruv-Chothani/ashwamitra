import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

interface Payment {
  id: string;
  product: string;
  farmer: string;
  buyer: string;
  amount: string;
  status: "Pending" | "Completed";
  date: string;
  method: string;
}

const paymentsData: Payment[] = [
  {
    id: "PAY-101",
    product: "Tomatoes",
    farmer: "Ramesh Kumar",
    buyer: "FreshMart",
    amount: "₹4500",
    status: "Pending",
    date: "12 Feb 2026",
    method: "UPI",
  },
  {
    id: "PAY-102",
    product: "Potatoes",
    farmer: "Suresh Patel",
    buyer: "City Grocery",
    amount: "₹6200",
    status: "Completed",
    date: "10 Feb 2026",
    method: "Bank Transfer",
  },
  {
    id: "PAY-103",
    product: "Onions",
    farmer: "Mahesh Yadav",
    buyer: "Green Basket",
    amount: "₹3900",
    status: "Pending",
    date: "9 Feb 2026",
    method: "UPI",
  },
];

const Payments = () => {
  const [filter, setFilter] = useState("All");
  const navigate = useNavigate();

  const filtered =
    filter === "All"
      ? paymentsData
      : paymentsData.filter((p) => p.status === filter);

  const handleViewPayment = (paymentId: string) => {
    navigate(`/payments/${paymentId}`);
  };

  return (
    <div className="space-y-8">
      {/* HEADER */}
      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-2xl p-6 shadow-lg flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Payments</h1>
          <p className="text-purple-100 text-sm">
            Track settlements and transactions
          </p>
        </div>
        <div className="text-sm bg-white/20 px-4 py-2 rounded-lg">
          Secure Payment Ledger
        </div>
      </div>

      {/* FILTER TABS */}
      <div className="flex gap-3 flex-wrap">
        {["All", "Pending", "Completed"].map((tab) => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            className={`px-5 py-2 rounded-full text-sm font-medium transition ${
              filter === tab
                ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow"
                : "bg-white border border-gray-200 hover:bg-gray-50"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* TABLE */}
      <div className="bg-white border border-gray-100 rounded-2xl shadow-md overflow-x-auto">
        <table className="w-full min-w-[700px]">
          <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">ID</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Product</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Farmer</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Buyer</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Amount</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Status</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Action</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((p) => (
              <tr
                key={p.id}
                className="border-t hover:bg-gray-50 transition"
              >
                <td className="px-6 py-4 font-medium">{p.id}</td>
                <td className="px-6 py-4">{p.product}</td>
                <td className="px-6 py-4">{p.farmer}</td>
                <td className="px-6 py-4">{p.buyer}</td>
                <td className="px-6 py-4 font-semibold text-green-700">
                  {p.amount}
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      p.status === "Completed"
                        ? "bg-green-100 text-green-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {p.status}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <button
                    onClick={() => handleViewPayment(p.id)}
                    className="px-4 py-1 text-xs font-medium text-white rounded-lg bg-gradient-to-r from-indigo-500 to-purple-600 hover:opacity-90"
                  >
                    View Details
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Payments;