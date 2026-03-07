import React, { useState } from "react";

type Order = {
  id: string;
  farmer: string;
  product: string;
  quantity: string;
  amount: string;
  date: string;
  location: string;
  status: "Pending" | "Processing" | "Completed" | "Cancelled";
  trackingNumber?: string;
};

const orders: Order[] = [
  {
    id: "ORD101",
    farmer: "Ramu Reddy",
    product: "Basmati Rice",
    quantity: "1000 kg",
    amount: "₹68,000",
    date: "12 Feb 2026",
    location: "Hyderabad",
    status: "Pending",
    trackingNumber: "SR123456789"
  },
  {
    id: "ORD102",
    farmer: "Lakshmi Bai",
    product: "Turmeric",
    quantity: "300 kg",
    amount: "₹28,500",
    date: "14 Feb 2026",
    location: "Warangal",
    status: "Processing",
    trackingNumber: "SR987654321"
  },
  {
    id: "ORD103",
    farmer: "Suresh Kumar",
    product: "Tomatoes",
    quantity: "500 kg",
    amount: "₹17,500",
    date: "15 Feb 2026",
    location: "Guntur",
    status: "Completed",
    trackingNumber: "SR456789123"
  },
  {
    id: "ORD104",
    farmer: "Mahesh Yadav",
    product: "Onions",
    quantity: "700 kg",
    amount: "₹22,000",
    date: "16 Feb 2026",
    location: "Nashik",
    status: "Cancelled",
    trackingNumber: "SR789123456"
  },
  {
    id: "ORD105",
    farmer: "Anil Kumar",
    product: "Potatoes",
    quantity: "1200 kg",
    amount: "₹36,000",
    date: "18 Feb 2026",
    location: "Agra",
    status: "Pending",
    trackingNumber: "SR321654987"
  },
];

const statusBadge = (status: Order["status"]) => {
  const styles = {
    Pending: "bg-yellow-100 text-yellow-700",
    Processing: "bg-blue-100 text-blue-700",
    Completed: "bg-green-100 text-green-700",
    Cancelled: "bg-red-100 text-red-700",
  };

  return (
    <span className={`px-3 py-1 text-xs font-medium rounded-full ${styles[status]}`}>
      {status}
    </span>
  );
};

const Orders = () => {
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [filter, setFilter] = useState<string>("All");

  const filteredOrders =
    filter === "All" ? orders : orders.filter((o) => o.status === filter);

  return (
    <div className="space-y-8">

      {/* HEADER */}

      <div className="bg-gradient-to-r from-indigo-600 to-blue-500 text-white rounded-2xl p-6 shadow-lg flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Order Management</h1>
          <p className="text-blue-100 text-sm">
            Track and manage procurement orders
          </p>
        </div>

        <button className="px-4 py-2 bg-white text-indigo-600 rounded-lg text-sm font-medium shadow hover:bg-gray-100">
          + Create Order
        </button>
      </div>

      {/* FILTER TABS */}

      <div className="flex flex-wrap gap-3">
        {["All", "Pending", "Processing", "Completed", "Cancelled"].map(
          (tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`px-5 py-2 text-sm rounded-full font-medium transition ${
                filter === tab
                  ? "bg-gradient-to-r from-indigo-600 to-blue-500 text-white shadow"
                  : "bg-white border border-gray-200 hover:bg-gray-50"
              }`}
            >
              {tab}
            </button>
          )
        )}
      </div>

      {/* ORDERS TABLE */}

      <div className="bg-white rounded-2xl border border-gray-100 shadow-md overflow-x-auto">

        <table className="w-full min-w-[850px]">

          <thead className="bg-gradient-to-r from-gray-50 to-gray-100">

            <tr>
              {[
                "Order ID",
                "Supplier",
                "Product",
                "Amount",
                "Status",
                "Actions",
              ].map((h) => (
                <th
                  key={h}
                  className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase"
                >
                  {h}
                </th>
              ))}
            </tr>

          </thead>

          <tbody>

            {filteredOrders.map((o) => (
              <tr
                key={o.id}
                className="border-t hover:bg-gray-50 transition"
              >
                <td className="px-6 py-4 font-medium">{o.id}</td>

                <td className="px-6 py-4">{o.farmer}</td>

                <td className="px-6 py-4">{o.product}</td>

                <td className="px-6 py-4 font-semibold text-green-700">
                  {o.amount}
                </td>

                <td className="px-6 py-4">
                  {statusBadge(o.status)}
                </td>

                <td className="px-6 py-4">

                  <button
                    onClick={() => setSelectedOrder(o)}
                    className="px-4 py-1 text-xs font-medium rounded-lg text-white bg-gradient-to-r from-blue-500 to-indigo-600 hover:opacity-90"
                  >
                    View
                  </button>

                </td>

              </tr>
            ))}

          </tbody>

        </table>

      </div>

      {/* COMPACT ORDER DETAILS MODAL */}

     {selectedOrder && (
  <div
    className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6"
    onClick={() => setSelectedOrder(null)}
  >
    <div
      className="
        bg-white rounded-2xl 
        w-[95vw] xs:w-[90vw] sm:w-[85vw] md:w-[80vw] lg:w-[75vw] xl:w-[70vw] 2xl:w-[65vw]
        h-[92vh] xs:h-[90vh] sm:h-[88vh] md:h-[86vh] lg:h-[84vh] xl:h-[82vh] 2xl:h-[80vh]
        shadow-2xl border border-gray-100 
        flex flex-col overflow-hidden
      "
      onClick={(e) => e.stopPropagation()}
    >
      
      {/* Modal Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-blue-600 p-2 xs:p-3 sm:p-4 text-white flex-shrink-0">
        <div className="flex items-center justify-between mb-2 xs:mb-3">
          <div className="flex items-center gap-2 xs:gap-3">
            <div className="w-6 h-6 xs:w-8 xs:h-8 sm:w-10 sm:h-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
              <span className="text-xs xs:text-sm sm:text-base">📦</span>
            </div>
            <div>
              <h3 className="text-xs xs:text-sm sm:text-base md:text-lg font-bold">Order Details</h3>
              <p className="text-indigo-100 text-xs">{selectedOrder.id}</p>
            </div>
          </div>
          <button
            onClick={() => setSelectedOrder(null)}
            className="w-5 h-5 xs:w-6 xs:h-6 sm:w-8 sm:h-8 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center hover:bg-white/30 transition-colors"
          >
            <span className="text-xs xs:text-sm sm:text-base">×</span>
          </button>
        </div>

        {/* Status Badge */}
        <div className="inline-flex">
          {selectedOrder.status === "Pending" && (
            <span className="px-2 xs:px-3 py-0.5 xs:py-1 bg-yellow-400/20 text-yellow-100 rounded-full text-xs font-bold border border-yellow-400/30">
              ⏳ {selectedOrder.status}
            </span>
          )}
          {selectedOrder.status === "Processing" && (
            <span className="px-2 xs:px-3 py-0.5 xs:py-1 bg-blue-400/20 text-blue-100 rounded-full text-xs font-bold border border-blue-400/30">
              🔄 {selectedOrder.status}
            </span>
          )}
          {selectedOrder.status === "Completed" && (
            <span className="px-2 xs:px-3 py-0.5 xs:py-1 bg-green-400/20 text-green-100 rounded-full text-xs font-bold border border-green-400/30">
              ✅ {selectedOrder.status}
            </span>
          )}
          {selectedOrder.status === "Cancelled" && (
            <span className="px-2 xs:px-3 py-0.5 xs:py-1 bg-red-400/20 text-red-100 rounded-full text-xs font-bold border border-red-400/30">
              ❌ {selectedOrder.status}
            </span>
          )}
        </div>
      </div>

      {/* NO SCROLL BODY - Fixed Height */}
      <div className="flex-1 flex flex-col p-2 xs:p-3 sm:p-4 md:p-4 lg:p-6">
        <div className="grid grid-cols-1 xs:grid-cols-1 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-2 gap-2 xs:gap-3 sm:gap-4">

          {/* Product Info */}
          <div className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl p-2 xs:p-3 border border-gray-200">
            <h4 className="text-xs xs:text-sm font-bold text-gray-900 mb-1 xs:mb-2 md:mb-3 flex items-center gap-1 xs:gap-2">
              <span className="text-sm xs:text-base sm:text-lg">🛒</span> Product Information
            </h4>
            <div className="grid grid-cols-1 xs:grid-cols-2 gap-2 xs:gap-3">
              <div>
                <p className="text-xs text-gray-500 mb-1">Product</p>
                <p className="text-xs xs:text-sm font-bold text-gray-900 truncate">
                  {selectedOrder.product}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Quantity</p>
                <p className="text-xs xs:text-sm font-bold text-gray-900">
                  {selectedOrder.quantity}
                </p>
              </div>
            </div>
          </div>

          {/* Supplier Info */}
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-2 xs:p-3 border border-gray-200">
            <h4 className="text-xs xs:text-sm font-bold text-gray-900 mb-1 xs:mb-2 md:mb-3 flex items-center gap-1 xs:gap-2">
              <span className="text-sm xs:text-base sm:text-lg">👤</span> Supplier Information
            </h4>
            <div className="grid grid-cols-1 xs:grid-cols-2 gap-2 xs:gap-3">
              <div>
                <p className="text-xs text-gray-500 mb-1">Supplier Name</p>
                <p className="text-xs xs:text-sm font-bold text-gray-900 truncate">
                  {selectedOrder.farmer}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Location</p>
                <p className="text-xs xs:text-sm font-bold text-gray-900 truncate">
                  {selectedOrder.location}
                </p>
              </div>
            </div>
          </div>

          {/* Order Summary - Small & Under */}
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-2 xs:p-3 border border-gray-200 lg:col-span-2">
            <h4 className="text-xs xs:text-sm font-bold text-gray-900 mb-1 xs:mb-2 flex items-center gap-1 xs:gap-2">
              <span className="text-sm xs:text-base">💰</span> Order Summary
            </h4>
            <div className="grid grid-cols-2 gap-2 xs:gap-3">
              <div>
                <p className="text-xs text-gray-500 mb-1">Total Amount</p>
                <p className="text-sm xs:text-base font-bold text-green-700">
                  {selectedOrder.amount}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Order Date</p>
                <p className="text-xs xs:text-sm font-bold text-gray-900">
                  {selectedOrder.date}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* BUTTONS - Fixed Position Always Visible */}
        <div className="flex gap-2 xs:gap-3 mt-3 xs:mt-4 pt-3 xs:pt-4 border-t border-gray-200 flex-shrink-0">
          <button 
            onClick={() => {
              // Navigate to shipment partner tracking
              const trackingUrl = `https://www.shiprocket.in/shipment-tracking/`;
              window.open(trackingUrl, '_blank');
            }}
            className="flex-1 py-3 xs:py-3.5 rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 text-white font-bold hover:opacity-90 transition-all shadow-lg text-xs xs:text-sm min-h-[44px] xs:min-h-[48px]"
          >
            Track Order
          </button>
          <button
            onClick={() => setSelectedOrder(null)}
            className="flex-1 py-3 xs:py-3.5 rounded-xl border-2 border-gray-300 text-gray-700 font-bold hover:bg-gray-50 transition-all shadow-md text-xs xs:text-sm min-h-[44px] xs:min-h-[48px]"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  </div>
)}
    </div>
  );
};

export default Orders;