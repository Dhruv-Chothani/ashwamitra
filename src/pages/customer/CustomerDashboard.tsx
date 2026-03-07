


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
  Loader2,
  Star,
  Truck,
} from "lucide-react";
import { useProducts, useCreateOrder } from "@/hooks/useApi";
import CartComponent from "./components/CartComponent";
import OrdersComponent from "./components/OrdersComponent";
import ProfileComponent from "./components/ProfileComponent";
import WhatsAppButton from "@/components/common/WhatsAppButton";

const categories = ["All", "Vegetables", "Fruits", "Grains", "Other"];

function qualityBadge(quality: string) {
  const styles: Record<string, string> = {
    Standard: "bg-gray-100 text-gray-700 border border-gray-300",
    Premium: "bg-purple-100 text-purple-700 border border-purple-300",
    Organic: "bg-green-100 text-green-700 border border-green-300",
  };
  return (
    <span className={`px-2 py-1 text-xs rounded-md font-medium ${styles[quality] || styles["Standard"]}`}>
      {quality}
    </span>
  );
}

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

  const { data: products, isLoading, error } = useProducts();
  const createOrder = useCreateOrder();

  const addToCart = (product: any, quantity: number = 1) => {
    setCart((prev) => {
      const next = new Map(prev);
      const currentQty = next.get(product._id) || 0;
      next.set(product._id, currentQty + quantity);
      return next;
    });
    setAddedProduct(product.name);
    setShowCartNotification(true);
    setTimeout(() => setShowCartNotification(false), 3000);
  };

  const placeOrder = async (product: any) => {
    const quantity = cart.get(product._id) || 1;
    try {
      await createOrder.mutateAsync({
        items: [{
          productId: product._id,
          productName: product.name,
          quantity: quantity,
          pricePerUnit: product.pricePerUnit,
          total: product.pricePerUnit * quantity
        }],
        totalAmount: product.pricePerUnit * quantity,
        deliveryAddress: "Customer Address - To be updated",
        paymentMethod: "cod"
      });
      
      // Clear cart for this product
      setCart(prev => {
        const newCart = new Map(prev);
        newCart.delete(product._id);
        return newCart;
      });
      
      setShowOrderSuccess(true);
      setTimeout(() => setShowOrderSuccess(false), 5000);
    } catch (error) {
      console.error("Order failed:", error);
    }
  };

  const getCartItemsCount = () => {
    let count = 0;
    cart.forEach((quantity) => {
      count += quantity;
    });
    return count;
  };

  const filteredProducts = (products && Array.isArray(products)) ? products.filter((product) => {
    const matchCategory =
      selectedCategory === "All" || product.category === selectedCategory;

    const matchSearch =
      product.name.toLowerCase().includes(search.toLowerCase()) ||
      product.description?.toLowerCase().includes(search.toLowerCase());

    return matchCategory && matchSearch && product.isAvailable !== false;
  }) : [];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-yellow-50 to-green-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-green-600" />
        <span className="ml-3 text-gray-600">Loading fresh products...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-yellow-50 to-green-50 flex items-center justify-center">
        <div className="text-center">
          <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Unable to load products</h3>
          <p className="text-gray-500">Please check your connection and try again.</p>
        </div>
      </div>
    );
  }

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
                const discount = product.marketPrice > 0 ? Math.round(
                  ((product.marketPrice - product.pricePerUnit) /
                    product.marketPrice) *
                    100
                ) : 0;

                return (
                  <div
                    key={product._id}
                    className="bg-white rounded-2xl border border-green-100 p-4 hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
                  >
                    <div className="h-36 w-full bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl flex items-center justify-center text-5xl mb-3">
                      {product.imageUrl ? (
                        <img 
                          src={product.imageUrl} 
                          alt={product.name} 
                          className="h-full w-full object-cover rounded-xl"
                        />
                      ) : (
                        <span>🌾</span>
                      )}
                    </div>

                    <h3 className="text-sm font-semibold text-green-800 mb-1">
                      {product.name}
                    </h3>

                    <p className="text-xs text-gray-500 mb-2">
                      {product.farmerName || "Local Farmer"} • {product.village}
                    </p>

                    {/* Quality and Organic */}
                    <div className="flex gap-1 mb-2">
                      {product.quality && qualityBadge(product.quality)}
                      {product.isOrganic && (
                        <span className="px-2 py-1 text-xs rounded-md font-medium bg-green-100 text-green-700 border border-green-300">
                          Organic
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-2 mb-3">
                      <span className="font-bold text-green-700 text-sm">
                        ₹{product.pricePerUnit}/{product.unit}
                      </span>
                      {product.marketPrice > 0 && product.marketPrice !== product.pricePerUnit && (
                        <span className="text-xs line-through text-gray-400">
                          ₹{product.marketPrice}
                        </span>
                      )}
                      {discount > 0 && (
                        <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded-full">
                          {discount}% OFF
                        </span>
                      )}
                    </div>

                    <div className="flex justify-between text-xs text-gray-600 mb-3">
                      <span>Stock: {product.availableQuantity}{product.unit}</span>
                      <span>Min: {product.minimumOrder}{product.unit}</span>
                    </div>

                    <button 
                      onClick={() => placeOrder(product)}
                      disabled={createOrder.isPending}
                      className="w-full py-2 rounded-full bg-gradient-to-r from-green-600 to-green-700 text-white text-xs font-semibold hover:scale-105 transition disabled:opacity-50"
                    >
                      {createOrder.isPending ? "Placing Order..." : "Order Now"}
                    </button>
                  </div>
                );
              })}

              {filteredProducts.length === 0 && !isLoading && (
                <div className="col-span-full text-center py-12">
                  <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
                    <Package className="w-10 h-10 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No products found</h3>
                  <p className="text-gray-500">No farmer products available matching your criteria.</p>
                </div>
              )}

              {products && products.length === 0 && !isLoading && (
                <div className="col-span-full text-center py-12">
                  <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
                    <Package className="w-10 h-10 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No Products Available</h3>
                  <p className="text-gray-500">Farmers haven't added any products yet.</p>
                </div>
              )}
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