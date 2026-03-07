import React, { useState } from "react";
import { Package, MapPin, Calendar, Phone, User, Truck, CheckCircle, Clock, XCircle, X, Star, MessageCircle, RefreshCw } from "lucide-react";

type Order = {
  id: string;
  product: string;
  farmer: string;
  quantity: string;
  price: number;
  status: "Delivered" | "Pending" | "Cancelled";
  date: string;
  address: string;
  phone: string;
  email: string;
  trackingId?: string;
  estimatedDelivery?: string;
  rating?: number;
  image: string;
};

const orders: Order[] = [
  {
    id: "ORD001",
    product: "Fresh Tomatoes",
    farmer: "Ramesh Kumar",
    quantity: "5 kg",
    price: 175,
    status: "Delivered",
    date: "20 Jan 2026",
    address: "Hyderabad, Telangana",
    phone: "+91 98765 43210",
    email: "ramesh.kumar@email.com",
    image: "🍅",
    rating: 4.5,
    trackingId: "TRK123456789"
  },
  {
    id: "ORD002",
    product: "Basmati Rice",
    farmer: "Suresh Reddy",
    quantity: "10 kg",
    price: 680,
    status: "Pending",
    date: "22 Jan 2026",
    address: "Hyderabad, Telangana",
    phone: "+91 98765 43211",
    email: "suresh.reddy@email.com",
    image: "🍚",
    estimatedDelivery: "25 Jan 2026",
    trackingId: "TRK123456790"
  },
  {
    id: "ORD003",
    product: "Organic Turmeric",
    farmer: "Lakshmi Devi",
    quantity: "3 kg",
    price: 285,
    status: "Cancelled",
    date: "18 Jan 2026",
    address: "Hyderabad, Telangana",
    phone: "+91 98765 43212",
    email: "lakshmi.devi@email.com",
    image: "🌿"
  },
];

const OrdersComponent = () => {
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showContactModal, setShowContactModal] = useState(false);
  const [contactMessage, setContactMessage] = useState("");
  const [showReorderModal, setShowReorderModal] = useState(false);
  const [reorderQuantity, setReorderQuantity] = useState("");

  // Handle Contact Farmer
  const handleContactFarmer = () => {
    setShowContactModal(true);
  };

  const sendContactMessage = () => {
    if (contactMessage.trim()) {
      // Here you would typically send the message to your backend
      alert(`Message sent to ${selectedOrder?.farmer}: "${contactMessage}"`);
      setContactMessage("");
      setShowContactModal(false);
    }
  };

  // Handle Reorder
  const handleReorder = () => {
    // Set default quantity from original order
    const originalQuantity = selectedOrder?.quantity.split(" ")[0];
    setReorderQuantity(originalQuantity || "1");
    setShowReorderModal(true);
  };

  const placeReorder = () => {
    if (reorderQuantity && selectedOrder) {
      // Here you would typically send the reorder to your backend
      alert(`Reorder placed: ${reorderQuantity} ${selectedOrder.quantity.split(" ")[1]} of ${selectedOrder.product} from ${selectedOrder.farmer}`);
      setReorderQuantity("");
      setShowReorderModal(false);
      setSelectedOrder(null);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 space-y-5">

      <h2 className="text-xl font-bold text-green-800">
        My Orders
      </h2>

      {orders.map((order) => (
        <div
          key={order.id}
          onClick={() => setSelectedOrder(order)}
          className="bg-white border border-green-100 rounded-xl p-5 shadow-sm hover:shadow-md transition cursor-pointer hover:border-green-200"
        >
          <div className="flex justify-between items-center">

            <div>
              <p className="font-semibold text-green-800">
                {order.product}
              </p>

              <p className="text-sm text-gray-500">
                Farmer: {order.farmer}
              </p>

              <p className="text-xs text-gray-400 mt-1">
                {order.quantity} • {order.date}
              </p>

              <p className="text-xs text-gray-400">
                Delivery: {order.address}
              </p>
            </div>

            <div className="text-right">
              <p className="font-bold text-green-700">
                ₹{order.price}
              </p>

              <span
                className={`text-xs px-2 py-1 rounded-full ${
                  order.status === "Delivered"
                    ? "bg-green-100 text-green-700"
                    : order.status === "Pending"
                    ? "bg-yellow-100 text-yellow-700"
                    : "bg-red-100 text-red-600"
                }`}
              >
                {order.status}
              </span>
            </div>

          </div>
        </div>
      ))}

      {/* ORDER DETAILS MODAL */}
      {selectedOrder && (
        <div
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6"
          onClick={() => setSelectedOrder(null)}
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
                    <span className="text-lg font-bold">📦</span>
                  </div>
                  <div>
                    <h3 className="text-base sm:text-lg font-bold">Order Details</h3>
                    <p className="text-green-100 text-xs">{selectedOrder.id}</p>
                  </div>
                </div>
                <button 
                  onClick={() => setSelectedOrder(null)}
                  className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center hover:bg-white/30 transition-colors"
                >
                  <span className="text-white text-lg">×</span>
                </button>
              </div>
              
              {/* Status Badge */}
              <div className="inline-flex">
                {selectedOrder.status === "Delivered" && (
                  <span className="px-3 py-1 bg-green-400/20 text-green-100 rounded-full text-xs font-bold border border-green-400/30">
                    ✅ Delivered
                  </span>
                )}
                {selectedOrder.status === "Pending" && (
                  <span className="px-3 py-1 bg-yellow-400/20 text-yellow-100 rounded-full text-xs font-bold border border-yellow-400/30">
                    ⏳ Pending
                  </span>
                )}
                {selectedOrder.status === "Cancelled" && (
                  <span className="px-3 py-1 bg-red-400/20 text-red-100 rounded-full text-xs font-bold border border-red-400/30">
                    ❌ Cancelled
                  </span>
                )}
              </div>
            </div>
            
            {/* Scrollable Body */}
            <div className="p-5 sm:p-6 space-y-4 overflow-y-auto">
              {/* Product Info */}
              <div className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl p-4 border border-gray-200">
                <h4 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
                  <span className="text-lg">📦</span> Product Information
                </h4>
                <div className="flex items-center gap-3">
                  <div className="text-4xl">{selectedOrder.image}</div>
                  <div>
                    <p className="text-sm font-bold text-gray-900">{selectedOrder.product}</p>
                    <p className="text-xs text-gray-500">Quantity: {selectedOrder.quantity}</p>
                    <p className="text-sm font-bold text-green-600">₹{selectedOrder.price}</p>
                  </div>
                </div>
              </div>
              
              {/* Farmer Info */}
              <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-4 border border-gray-200">
                <h4 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
                  <span className="text-lg">👤</span> Farmer Information
                </h4>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-gray-500" />
                    <p className="text-sm font-bold text-gray-900">{selectedOrder.farmer}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-gray-500" />
                    <p className="text-sm text-gray-900">{selectedOrder.phone}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm">📧</span>
                    <p className="text-sm text-gray-900">{selectedOrder.email}</p>
                  </div>
                </div>
              </div>
              
              {/* Delivery Info */}
              <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl p-4 border border-gray-200">
                <h4 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
                  <span className="text-lg">📍</span> Delivery Information
                </h4>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-gray-500" />
                    <p className="text-sm text-gray-900">{selectedOrder.address}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-gray-500" />
                    <p className="text-sm text-gray-900">Order Date: {selectedOrder.date}</p>
                  </div>
                  {selectedOrder.estimatedDelivery && (
                    <div className="flex items-center gap-2">
                      <Truck className="w-4 h-4 text-gray-500" />
                      <p className="text-sm text-gray-900">Est. Delivery: {selectedOrder.estimatedDelivery}</p>
                    </div>
                  )}
                  {selectedOrder.trackingId && (
                    <div className="flex items-center gap-2">
                      <Package className="w-4 h-4 text-gray-500" />
                      <p className="text-sm text-gray-900">Tracking ID: {selectedOrder.trackingId}</p>
                    </div>
                  )}
                </div>
              </div>
              
              {/* Rating (for delivered orders) */}
              {selectedOrder.status === "Delivered" && selectedOrder.rating && (
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-4 border border-gray-200">
                  <h4 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
                    <span className="text-lg">⭐</span> Order Rating
                  </h4>
                  <div className="flex items-center gap-2">
                    <Star className="w-5 h-5 text-yellow-500 fill-current" />
                    <span className="text-lg font-bold text-gray-900">{selectedOrder.rating}</span>
                    <span className="text-sm text-gray-500">out of 5</span>
                  </div>
                </div>
              )}
              
              {/* Action Buttons */}
              <div className="flex gap-3 pt-2">
                {selectedOrder.status === "Pending" && (
                  <>
                    <button className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-green-600 to-emerald-600 text-white font-bold hover:opacity-90 transition-opacity shadow">
                      Track Order
                    </button>
                    <button className="flex-1 py-2.5 rounded-xl border-2 border-gray-200 text-gray-700 font-bold hover:bg-gray-50 transition-colors">
                      Cancel Order
                    </button>
                  </>
                )}
                {selectedOrder.status === "Delivered" && (
                  <>
                    <button 
                      onClick={handleContactFarmer}
                      className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold hover:opacity-90 transition-opacity shadow"
                    >
                      <MessageCircle className="w-4 h-4 inline mr-1" /> Contact Farmer
                    </button>
                    <button 
                      onClick={handleReorder}
                      className="flex-1 py-2.5 rounded-xl border-2 border-gray-200 text-gray-700 font-bold hover:bg-gray-50 transition-colors"
                    >
                      <RefreshCw className="w-4 h-4 inline mr-1" /> Reorder
                    </button>
                  </>
                )}
                {selectedOrder.status === "Cancelled" && (
                  <>
                    <button 
                      onClick={handleReorder}
                      className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-green-600 to-emerald-600 text-white font-bold hover:opacity-90 transition-opacity shadow"
                    >
                      <RefreshCw className="w-4 h-4 inline mr-1" /> Reorder
                    </button>
                    <button 
                      onClick={() => setSelectedOrder(null)}
                      className="flex-1 py-2.5 rounded-xl border-2 border-gray-200 text-gray-700 font-bold hover:bg-gray-50 transition-colors"
                    >
                      Close
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* CONTACT FARMER MODAL */}
      {showContactModal && selectedOrder && (
        <div
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6"
          onClick={() => setShowContactModal(false)}
        >
          <div
            className="bg-white rounded-2xl w-full max-w-md sm:max-w-lg 
                     shadow-xl border border-gray-100 
                     overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-4 sm:p-5 text-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                    <MessageCircle className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <h3 className="text-base sm:text-lg font-bold">Contact Farmer</h3>
                    <p className="text-blue-100 text-xs">{selectedOrder.farmer}</p>
                  </div>
                </div>
                <button 
                  onClick={() => setShowContactModal(false)}
                  className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center hover:bg-white/30 transition-colors"
                >
                  <span className="text-white text-lg">×</span>
                </button>
              </div>
            </div>
            
            {/* Modal Body */}
            <div className="p-5 sm:p-6 space-y-4">
              <div className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl p-4 border border-gray-200">
                <h4 className="text-sm font-bold text-gray-900 mb-3">Order Reference</h4>
                <div className="space-y-2">
                  <p className="text-sm text-gray-600">Order ID: <span className="font-bold text-gray-900">{selectedOrder.id}</span></p>
                  <p className="text-sm text-gray-600">Product: <span className="font-bold text-gray-900">{selectedOrder.product}</span></p>
                  <p className="text-sm text-gray-600">Quantity: <span className="font-bold text-gray-900">{selectedOrder.quantity}</span></p>
                </div>
              </div>
              
              <div>
                <label className="text-sm font-bold text-gray-900 mb-2 block">Your Message</label>
                <textarea
                  value={contactMessage}
                  onChange={(e) => setContactMessage(e.target.value)}
                  placeholder="Type your message to the farmer..."
                  className="w-full p-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 outline-none resize-none h-32 text-sm"
                />
              </div>
              
              <div className="flex gap-3 pt-2">
                <button 
                  onClick={sendContactMessage}
                  className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold hover:opacity-90 transition-opacity shadow"
                >
                  Send Message
                </button>
                <button 
                  onClick={() => setShowContactModal(false)}
                  className="flex-1 py-2.5 rounded-xl border-2 border-gray-200 text-gray-700 font-bold hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* REORDER MODAL */}
      {showReorderModal && selectedOrder && (
        <div
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6"
          onClick={() => setShowReorderModal(false)}
        >
          <div
            className="bg-white rounded-2xl w-full max-w-md sm:max-w-lg 
                     shadow-xl border border-gray-100 
                     overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-green-600 to-emerald-600 p-4 sm:p-5 text-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                    <RefreshCw className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <h3 className="text-base sm:text-lg font-bold">Reorder Product</h3>
                    <p className="text-green-100 text-xs">{selectedOrder.product}</p>
                  </div>
                </div>
                <button 
                  onClick={() => setShowReorderModal(false)}
                  className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center hover:bg-white/30 transition-colors"
                >
                  <span className="text-white text-lg">×</span>
                </button>
              </div>
            </div>
            
            {/* Modal Body */}
            <div className="p-5 sm:p-6 space-y-4">
              <div className="bg-gradient-to-r from-gray-50 to-green-50 rounded-xl p-4 border border-gray-200">
                <h4 className="text-sm font-bold text-gray-900 mb-3">Product Details</h4>
                <div className="flex items-center gap-3">
                  <div className="text-4xl">{selectedOrder.image}</div>
                  <div>
                    <p className="text-sm font-bold text-gray-900">{selectedOrder.product}</p>
                    <p className="text-xs text-gray-500">Farmer: {selectedOrder.farmer}</p>
                    <p className="text-sm font-bold text-green-600">₹{selectedOrder.price}</p>
                  </div>
                </div>
              </div>
              
              <div>
                <label className="text-sm font-bold text-gray-900 mb-2 block">Quantity ({selectedOrder.quantity.split(" ")[1]})</label>
                <input
                  type="number"
                  value={reorderQuantity}
                  onChange={(e) => setReorderQuantity(e.target.value)}
                  placeholder="Enter quantity"
                  min="1"
                  className="w-full p-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-green-500/20 focus:border-green-500 outline-none text-sm"
                />
              </div>
              
              <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl p-4 border border-gray-200">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-bold text-gray-900">Estimated Total:</span>
                  <span className="text-lg font-bold text-orange-600">
                    ₹{reorderQuantity ? (parseInt(reorderQuantity) * selectedOrder.price) : selectedOrder.price}
                  </span>
                </div>
              </div>
              
              <div className="flex gap-3 pt-2">
                <button 
                  onClick={placeReorder}
                  className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-green-600 to-emerald-600 text-white font-bold hover:opacity-90 transition-opacity shadow"
                >
                  Place Reorder
                </button>
                <button 
                  onClick={() => setShowReorderModal(false)}
                  className="flex-1 py-2.5 rounded-xl border-2 border-gray-200 text-gray-700 font-bold hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrdersComponent;