import React, { useState } from "react";
import { Eye, X, Loader2 } from "lucide-react";
import { useFarmerOrders } from "@/hooks/useApi";

const statusBadge = (status: string) => {
  const styles: Record<string, string> = {
    pending: "bg-gradient-to-r from-yellow-400 to-orange-500 text-white shadow",
    confirmed: "bg-gradient-to-r from-blue-400 to-blue-600 text-white shadow",
    delivered: "bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow",
    cancelled: "bg-gradient-to-r from-red-500 to-rose-600 text-white shadow",
  };
  return (
    <span className={`px-3 py-1 text-xs rounded-full font-semibold ${styles[status.toLowerCase()] || styles.pending}`}>
      {status}
    </span>
  );
};

const FarmerOrders = () => {
  const { data: orders, isLoading } = useFarmerOrders();
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [filter, setFilter] = useState<string>("All");

  const filteredOrders = filter === "All"
    ? (orders || [])
    : (orders || []).filter((o: any) => o.status?.toLowerCase() === filter.toLowerCase());

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-6 h-6 animate-spin text-green-600" />
        <span className="ml-2">Loading orders...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-green-600 to-emerald-500 p-6 rounded-2xl text-white shadow">
        <h1 className="text-2xl font-bold">Order Management</h1>
        <p className="text-sm opacity-90">Track all incoming orders</p>
      </div>

      <div className="flex gap-3 flex-wrap">
        {["All", "Pending", "Confirmed", "Delivered", "Cancelled"].map((tab) => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            className={`px-4 py-2 text-sm rounded-lg transition font-medium ${
              filter === tab
                ? "text-white bg-gradient-to-r from-green-600 to-emerald-500 shadow-md"
                : "bg-white border hover:bg-green-50"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="bg-white border rounded-xl shadow-lg overflow-x-auto">
        <table className="w-full min-w-[800px]">
          <thead className="bg-gradient-to-r from-green-50 to-emerald-50">
            <tr>
              {["Order ID", "Buyer", "Items", "Amount", "Date", "Status", "Actions"].map((h) => (
                <th key={h} className="text-left px-6 py-4 text-xs font-semibold text-gray-600 uppercase">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filteredOrders.map((order: any) => (
              <tr key={order._id} className="border-t hover:bg-green-50 transition">
                <td className="px-6 py-4 font-medium">#{order._id?.slice(-6)}</td>
                <td className="px-6 py-4">{order.buyerId?.name || "Customer"}</td>
                <td className="px-6 py-4">{order.items?.map((i: any) => i.productName).join(", ")}</td>
                <td className="px-6 py-4 font-semibold text-green-700">₹{order.totalAmount?.toLocaleString()}</td>
                <td className="px-6 py-4">{order.createdAt ? new Date(order.createdAt).toLocaleDateString() : ""}</td>
                <td className="px-6 py-4">{statusBadge(order.status || "pending")}</td>
                <td className="px-6 py-4">
                  <button onClick={() => setSelectedOrder(order)} className="flex items-center gap-1 px-3 py-1 text-xs text-white rounded-md bg-gradient-to-r from-blue-500 to-indigo-600 hover:scale-105 transition">
                    <Eye size={14} /> View
                  </button>
                </td>
              </tr>
            ))}
            {filteredOrders.length === 0 && (
              <tr><td colSpan={7} className="px-6 py-8 text-center text-gray-400">No orders found</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {selectedOrder && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-2xl relative">
            <button onClick={() => setSelectedOrder(null)} className="absolute right-4 top-4 text-gray-500 hover:text-black"><X size={18} /></button>
            <h3 className="text-xl font-semibold mb-5">Order Details</h3>
            <div className="space-y-3 text-sm">
              <p><b>Order ID:</b> #{selectedOrder._id?.slice(-6)}</p>
              <p><b>Buyer:</b> {selectedOrder.buyerId?.name}</p>
              <p><b>Items:</b> {selectedOrder.items?.map((i: any) => `${i.productName} (${i.quantity})`).join(", ")}</p>
              <p><b>Total:</b> ₹{selectedOrder.totalAmount?.toLocaleString()}</p>
              <p><b>Date:</b> {selectedOrder.createdAt ? new Date(selectedOrder.createdAt).toLocaleDateString() : ""}</p>
              <p><b>Payment:</b> {selectedOrder.paymentStatus}</p>
              <div className="flex items-center gap-2"><b>Status:</b> {statusBadge(selectedOrder.status)}</div>
            </div>
            <button onClick={() => setSelectedOrder(null)} className="mt-6 w-full py-2 rounded-lg text-white bg-gradient-to-r from-green-600 to-emerald-500 hover:scale-105 transition">Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FarmerOrders;
