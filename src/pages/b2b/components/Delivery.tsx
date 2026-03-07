import React, { useState } from "react";

type Delivery = {
  id: string;
  product: string;
  supplier: string;
  location: string;
  eta: string;
  status: "Processing" | "Shipped" | "Out for Delivery" | "Delivered";
  trackingNumber?: string;
};

const deliveries: Delivery[] = [
  {
    id: "DLV001",
    product: "Basmati Rice",
    supplier: "Ramu Reddy",
    location: "Hyderabad Warehouse",
    eta: "2 Days",
    status: "Shipped",
    trackingNumber: "SR123456789",
  },
  {
    id: "DLV002",
    product: "Turmeric",
    supplier: "Lakshmi Bai",
    location: "Warangal Hub",
    eta: "1 Day",
    status: "Out for Delivery",
    trackingNumber: "SR987654321",
  },
  {
    id: "DLV003",
    product: "Wheat",
    supplier: "Suresh Kumar",
    location: "Chennai Center",
    eta: "3 Hours",
    status: "Delivered",
    trackingNumber: "SR456789123",
  },
  {
    id: "DLV004",
    product: "Coriander Seeds",
    supplier: "Anita Devi",
    location: "Mumbai Port",
    eta: "4 Hours",
    status: "Processing",
    trackingNumber: "SR789123456",
  },
  {
    id: "DLV005",
    product: "Red Chilli",
    supplier: "Mahesh Patel",
    location: "Delhi Hub",
    eta: "1 Day",
    status: "Processing",
    trackingNumber: "SR321654987",
  },
];

const Delivery = () => {
  const [selected, setSelected] = useState<Delivery | null>(null);

  return (
    <div className="space-y-6">

      {/* <div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-500 to-indigo-600 bg-clip-text text-transparent">
          Delivery Tracking
        </h1>
        <p className="text-gray-500 text-sm">
          Monitor shipment updates
        </p>
      </div> */}
      <div className="bg-gradient-to-r from-indigo-600 to-blue-500 text-white rounded-2xl p-6 shadow-lg flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold"> Delivery Tracking</h1>
          <p className="text-blue-100 text-sm">
          Monitor shipment updates
          </p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border overflow-x-auto">

        <table className="w-full min-w-[700px]">

          <thead className="bg-gray-50">
            <tr>
              <th className="px-5 py-3 text-xs text-left">ID</th>
              <th className="px-5 py-3 text-xs text-left">Product</th>
              <th className="px-5 py-3 text-xs text-left">Supplier</th>
              <th className="px-5 py-3 text-xs text-left">Location</th>
              <th className="px-5 py-3 text-xs text-left">ETA</th>
              <th className="px-5 py-3 text-xs text-left">Status</th>
              <th className="px-5 py-3 text-xs text-left">Action</th>
            </tr>
          </thead>

          <tbody>

            {deliveries.map((d) => (
              <tr key={d.id} className="border-b hover:bg-gray-50">

                <td className="px-5 py-3">{d.id}</td>
                <td className="px-5 py-3 font-medium">{d.product}</td>
                <td className="px-5 py-3">{d.supplier}</td>
                <td className="px-5 py-3">{d.location}</td>
                <td className="px-5 py-3">{d.eta}</td>

                <td className="px-5 py-3">

                  <span
                    className={`px-2 py-1 text-xs rounded-full ${
                      d.status === "Delivered"
                        ? "bg-green-100 text-green-700"
                        : d.status === "Shipped"
                        ? "bg-blue-100 text-blue-700"
                        : d.status === "Out for Delivery"
                        ? "bg-purple-100 text-purple-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {d.status}
                  </span>

                </td>

                <td className="px-5 py-3">

                  <button
                    onClick={() => setSelected(d)}
                    className="px-4 py-1 text-sm bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-md"
                  >
                    View
                  </button>

                </td>

              </tr>
            ))}

          </tbody>

        </table>

      </div>

      {/* COMPACT DELIVERY DETAILS MODAL */}
      {selected && (
        <div
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6"
          onClick={() => setSelected(null)}
        >
          <div
            className="bg-white rounded-2xl w-full max-w-md sm:max-w-lg 
                       max-h-[85vh] sm:max-h-[80vh] 
                       shadow-xl border border-gray-100 
                       overflow-hidden flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-green-600 to-emerald-600 p-4 sm:p-5 text-white">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                    <span className="text-lg font-bold">🚚</span>
                  </div>
                  <div>
                    <h3 className="text-base sm:text-lg font-bold">Delivery Details</h3>
                    <p className="text-green-100 text-xs">{selected.id}</p>
                  </div>
                </div>
                <button 
                  onClick={() => setSelected(null)}
                  className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center hover:bg-white/30 transition-colors"
                >
                  <span className="text-white text-lg">×</span>
                </button>
              </div>
              
              {/* Status Badge */}
              <div className="inline-flex">
                {selected.status === "Processing" && (
                  <span className="px-3 py-1 bg-yellow-400/20 text-yellow-100 rounded-full text-xs font-bold border border-yellow-400/30">
                    ⏳ {selected.status}
                  </span>
                )}
                {selected.status === "Shipped" && (
                  <span className="px-3 py-1 bg-blue-400/20 text-blue-100 rounded-full text-xs font-bold border border-blue-400/30">
                    🚢 {selected.status}
                  </span>
                )}
                {selected.status === "Out for Delivery" && (
                  <span className="px-3 py-1 bg-purple-400/20 text-purple-100 rounded-full text-xs font-bold border border-purple-400/30">
                    🚚 {selected.status}
                  </span>
                )}
                {selected.status === "Delivered" && (
                  <span className="px-3 py-1 bg-green-400/20 text-green-100 rounded-full text-xs font-bold border border-green-400/30">
                    ✅ {selected.status}
                  </span>
                )}
              </div>
            </div>
            
            {/* NO SCROLL BODY - Fixed Height */}
            <div className="flex-1 flex flex-col p-2 xs:p-3 sm:p-4 md:p-4 lg:p-6">
              {/* Product & Location Info - Side by Side */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {/* Product Info - Left */}
                <div className="bg-gradient-to-r from-blue-50 to-green-50 rounded-xl p-3 border border-gray-200">
                  <h4 className="text-xs font-bold text-gray-900 mb-2 flex items-center gap-2">
                    <span className="text-sm">📦</span> Product Information
                  </h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-xs text-gray-600">Product:</span>
                      <span className="text-xs font-bold text-gray-900">{selected.product}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-xs text-gray-600">Supplier:</span>
                      <span className="text-xs font-bold text-gray-900">{selected.supplier}</span>
                    </div>
                  </div>
                </div>
                
                {/* Location Info - Right */}
                <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-3 border border-gray-200">
                  <h4 className="text-xs font-bold text-gray-900 mb-2 flex items-center gap-2">
                    <span className="text-sm">📍</span> Location Information
                  </h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-xs text-gray-600">Current Location:</span>
                      <span className="text-xs font-bold text-gray-900">{selected.location}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-xs text-gray-600">ETA:</span>
                      <span className="text-xs font-bold text-gray-900">{selected.eta}</span>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Delivery Timeline - Side by Side */}
              <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl p-3 border border-gray-200">
                <h4 className="text-xs font-bold text-gray-900 mb-2 flex items-center gap-2">
                  <span className="text-sm">⏰</span> Delivery Timeline
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {/* Left Side - Steps 1 & 2 */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <div className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold ${
                        selected.status === "Processing" || selected.status === "Shipped" || selected.status === "Out for Delivery" || selected.status === "Delivered" 
                          ? "bg-green-500 text-white" 
                          : "bg-gray-300 text-gray-600"
                      }`}>
                        1
                      </div>
                      <div className="flex-1">
                        <p className="text-xs font-bold text-gray-900">Order Processed</p>
                        <p className="text-xs text-gray-500">Package prepared</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <div className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold ${
                        selected.status === "Shipped" || selected.status === "Out for Delivery" || selected.status === "Delivered" 
                          ? "bg-green-500 text-white" 
                          : "bg-gray-300 text-gray-600"
                      }`}>
                        2
                      </div>
                      <div className="flex-1">
                        <p className="text-xs font-bold text-gray-900">Shipped</p>
                        <p className="text-xs text-gray-500">Package on the way</p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Right Side - Steps 3 & 4 */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <div className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold ${
                        selected.status === "Out for Delivery" || selected.status === "Delivered" 
                          ? "bg-green-500 text-white" 
                          : "bg-gray-300 text-gray-600"
                      }`}>
                        3
                      </div>
                      <div className="flex-1">
                        <p className="text-xs font-bold text-gray-900">Out for Delivery</p>
                        <p className="text-xs text-gray-500">Package out for delivery</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <div className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold ${
                        selected.status === "Delivered" 
                          ? "bg-green-500 text-white" 
                          : "bg-gray-300 text-gray-600"
                      }`}>
                        4
                      </div>
                      <div className="flex-1">
                        <p className="text-xs font-bold text-gray-900">Delivered</p>
                        <p className="text-xs text-gray-500">Package delivered</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Action Buttons - Small */}
              <div className="flex gap-2 pt-2 border-t border-gray-200">
                <button 
                  onClick={() => {
                    // Navigate to shipment partner tracking
                    const trackingUrl = `https://www.shiprocket.com/tracking/${selected.trackingNumber}`;
                    window.open(trackingUrl, '_blank');
                  }}
                  className="flex-1 py-2 rounded-lg bg-gradient-to-r from-indigo-600 to-blue-600 text-white font-bold hover:opacity-90 transition-opacity shadow text-xs"
                >
                  Track Order
                </button>
                <button
                  onClick={() => setSelected(null)}
                  className="flex-1 py-2 rounded-lg border-2 border-gray-300 text-gray-700 font-bold hover:bg-gray-50 transition-colors text-xs"
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

export default Delivery;