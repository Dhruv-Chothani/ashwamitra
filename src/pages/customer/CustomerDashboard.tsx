


"use client";

import React, { useState } from "react";
import {
  Search,
  MapPin,
  Home,
  ShoppingCart,
  Package,
  User,
  LogOut,
  CheckCircle,
} from "lucide-react";
import { products } from "@/data/Products";
import CartComponent from "./components/CartComponent";
import OrdersComponent from "./components/OrdersComponent";
import ProfileComponent from "./components/ProfileComponent";
import WhatsAppButton from "@/components/common/WhatsAppButton";

const categories = ["All", "Vegetables", "Fruits", "Grains"];

/* ============================= */
/* MOCK ORDERS (Backend later)   */
/* ============================= */

const orders = [
  {
    id: "ORD001",
    product: "Tomatoes",
    qty: "5 kg",
    price: 175,
    farmer: "Ramu Reddy",
    status: "Delivered",
    date: "Jan 20",
  },
  {
    id: "ORD002",
    product: "Basmati Rice",
    qty: "10 kg",
    price: 680,
    farmer: "Suresh Kumar",
    status: "Pending",
    date: "Jan 18",
  },
];

/* ============================= */
/* ORDER COMPONENT               */
/* ============================= */



/* ============================= */
/* CART COMPONENT                */
/* ============================= */


/* ============================= */
/* PROFILE COMPONENT             */
/* ============================= */



/* ============================= */
/* MAIN DASHBOARD                */
/* ============================= */

export default function CustomerDashboard() {
  const [activeTab, setActiveTab] = useState("shop");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [search, setSearch] = useState("");
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [cart, setCart] = useState<Map<string, number>>(new Map());
  const [showCartNotification, setShowCartNotification] = useState(false);
  const [addedProduct, setAddedProduct] = useState<string>("");
  const [showOrderSuccess, setShowOrderSuccess] = useState(false);

  const addToCart = (product: any, quantity: number = 1) => {
    setCart((prev) => {
      const next = new Map(prev);
      const currentQty = next.get(product.id) || 0;
      next.set(product.id, currentQty + quantity);
      return next;
    });
    setAddedProduct(product.name);
    setShowCartNotification(true);
    setTimeout(() => setShowCartNotification(false), 3000);
  };

  const getCartItemsCount = () => {
    let count = 0;
    cart.forEach((quantity) => {
      count += quantity;
    });
    return count;
  };

  const handleLogout = () => {
    // Clear cart and logout
    setCart(new Map());
    setSelectedProduct(null);
    setSearch("");
    setActiveTab("shop");
    // In real app, this would handle actual logout
    window.location.href = "/";
  };

  const handleOrder = (product: any) => {
    // Add product to cart
    addToCart(product, 1);
    // Navigate to cart tab
    setActiveTab("cart");
  };

  const handleCartUpdate = (newCart: Map<string, number>) => {
    setCart(newCart);
    // Show order success notification if cart is cleared (order placed)
    if (newCart.size === 0 && cart.size > 0) {
      setShowOrderSuccess(true);
      setTimeout(() => setShowOrderSuccess(false), 5000);
      // Navigate to profile to show subscription
      setActiveTab("profile");
    }
  };

  const filteredProducts = products.filter((product) => {
    const matchCategory =
      selectedCategory === "All" || product.category === selectedCategory;

    const matchSearch =
      product.name.toLowerCase().includes(search.toLowerCase());

    return matchCategory && matchSearch;
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-yellow-50 to-green-50">
      {/* Cart Notification */}
      {showCartNotification && (
        <div className="fixed top-20 right-4 z-50 bg-green-600 text-white px-4 py-3 rounded-lg shadow-lg flex items-center gap-3 animate-pulse">
          <ShoppingCart className="w-5 h-5" />
          <span className="font-medium">{addedProduct} added to cart!</span>
        </div>
      )}

      {/* Order Success Notification */}
      {showOrderSuccess && (
        <div className="fixed top-20 right-4 z-50 bg-gradient-to-r from-green-600 to-emerald-600 text-white px-6 py-4 rounded-lg shadow-lg flex items-center gap-3 animate-pulse max-w-sm">
          <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
            <CheckCircle className="w-5 h-5 text-white" />
          </div>
          <div>
            <span className="font-bold block">Order Placed Successfully!</span>
            <span className="text-sm text-green-100">Check your profile for subscription details</span>
          </div>
        </div>
      )}

      {/* ===================== */}
      {/* TOP NAVBAR */}
      {/* ===================== */}

      <div className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-b border-green-100">
        <div className="max-w-7xl mx-auto px-4 py-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">

          {/* Location */}
          <div className="flex items-center gap-2 text-green-700 font-medium">
            <MapPin className="w-4 h-4" />
            Delivering to Hyderabad
          </div>

          {/* Search */}
          <div className="relative w-full sm:w-96">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />

            <input
              type="text"
              placeholder="Search fresh vegetables, fruits..."
              className="w-full pl-9 pr-3 py-2 rounded-full bg-green-50 border border-green-200 focus:outline-none focus:ring-2 focus:ring-green-400 text-sm"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {/* DESKTOP NAVIGATION */}
          <div className="hidden sm:flex items-center gap-6 text-sm font-medium">

            <button
              onClick={() => setActiveTab("shop")}
              className={`flex items-center gap-1 ${
                activeTab === "shop"
                  ? "text-green-700"
                  : "text-gray-600 hover:text-green-700"
              }`}
            >
              <Home size={18} />
              Shop
            </button>

            <button
              onClick={() => setActiveTab("orders")}
              className={`flex items-center gap-1 ${
                activeTab === "orders"
                  ? "text-green-700"
                  : "text-gray-600 hover:text-green-700"
              }`}
            >
              <Package size={18} />
              Orders
            </button>

            <button
              onClick={() => setActiveTab("cart")}
              className={`relative flex items-center gap-1 ${
                activeTab === "cart"
                  ? "text-green-700"
                  : "text-gray-600 hover:text-green-700"
              }`}
            >
              <ShoppingCart size={18} />
              Cart
              {getCartItemsCount() > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                  {getCartItemsCount()}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab("profile")}
              className={`flex items-center gap-1 ${
                activeTab === "profile"
                  ? "text-green-700"
                  : "text-gray-600 hover:text-green-700"
              }`}
            >
              <User size={18} />
              Profile
            </button>

            <button
              onClick={handleLogout}
              className="flex items-center gap-1 text-red-600 hover:text-red-700 transition-colors"
            >
              <LogOut size={18} />
              Logout
            </button>

          </div>

        </div>
      </div>

      {/* ===================== */}
      {/* MAIN CONTENT */}
      {/* ===================== */}

      <div className="pt-24 pb-24 sm:pb-10">

        {activeTab === "shop" && (
          <div className="max-w-7xl mx-auto px-4">

            {/* CATEGORY FILTER */}

            <div className="flex gap-3 overflow-x-auto py-4">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-5 py-2 rounded-full text-sm font-medium transition ${
                    selectedCategory === cat
                      ? "bg-green-600 text-white shadow-md"
                      : "bg-white text-green-700 border border-green-200 hover:bg-green-50"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* PRODUCTS */}

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
              {filteredProducts.map((product) => {
                const discount = Math.round(
                  ((product.marketPrice - product.price) /
                    product.marketPrice) *
                    100
                );

                return (
                  <div
                    key={product.id}
                    className="bg-white rounded-2xl border border-green-100 p-4 hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
                  >
                    <img
                      src={product.image}
                      alt={product.name}
                      className="h-36 w-full object-cover rounded-xl"
                    />

                    <h3 className="mt-3 text-sm font-semibold text-green-800">
                      {product.name}
                    </h3>

                    <p className="text-xs text-gray-500">
                      {product.farmer}
                    </p>

                    <div className="flex items-center gap-2 mt-1">
                      <span className="font-bold text-green-700 text-sm">
                        ₹{product.price}
                      </span>

                      <span className="text-xs line-through text-gray-400">
                        ₹{product.marketPrice}
                      </span>
                    </div>

                    <button 
                      onClick={() => handleOrder(product)}
                      className="w-full mt-3 py-2 rounded-full bg-gradient-to-r from-green-600 to-green-700 text-white text-xs font-semibold hover:scale-105 transition"
                    >
                      Order Now
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {activeTab === "orders" && <OrdersComponent />}
        {activeTab === "cart" && <CartComponent cart={cart} products={products} onUpdateCart={handleCartUpdate} />}
        {activeTab === "profile" && <ProfileComponent/> }
      </div>

      {/* WhatsApp Button */}
      <WhatsAppButton />

      {/* ===================== */}
      {/* MOBILE NAV */}
      {/* ===================== */}

      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-green-100 shadow-inner z-50 sm:hidden">
        <div className="flex justify-around items-center py-3 text-xs font-medium">

          <button
            onClick={() => setActiveTab("shop")}
            className={`flex flex-col items-center ${
              activeTab === "shop" ? "text-green-600" : "text-gray-500"
            }`}
          >
            <Home size={20} />
            Shop
          </button>

          <button
            onClick={() => setActiveTab("orders")}
            className={`flex flex-col items-center ${
              activeTab === "orders" ? "text-green-600" : "text-gray-500"
            }`}
          >
            <Package size={20} />
            Orders
          </button>

          <button
            onClick={() => setActiveTab("cart")}
            className={`flex flex-col items-center ${
              activeTab === "cart" ? "text-green-600" : "text-gray-500"
            }`}
          >
            <ShoppingCart size={20} />
            Cart
          </button>

          <button
            onClick={() => setActiveTab("profile")}
            className={`flex flex-col items-center ${
              activeTab === "profile" ? "text-green-600" : "text-gray-500"
            }`}
          >
            <User size={20} />
            Profile
          </button>

          <button
            onClick={handleLogout}
            className={`flex flex-col items-center text-red-600 hover:text-red-700 transition-colors`}
          >
            <LogOut size={20} />
            Logout
          </button>

        </div>
      </div>
    </div>
  );
};