import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import B2BCart from "./components/B2BCart";

// Mock products data (same as in B2BProducts)
const b2bProducts = [
  {
    id: "B2B001",
    name: "Premium Basmati Rice",
    farmer: "Ramesh Kumar",
    location: "Nalgonda",
    category: "Grains",
    price: 85,
    marketPrice: 95,
    stock: 5000,
    image: "🍚",
    minOrder: 100,
  },
  {
    id: "B2B002",
    name: "Fresh Tomatoes",
    farmer: "Suresh Patel",
    location: "Warangal",
    category: "Vegetables",
    price: 35,
    marketPrice: 45,
    stock: 2000,
    image: "🍅",
    minOrder: 50,
  },
  {
    id: "B2B003",
    name: "Organic Turmeric",
    farmer: "Lakshmi Bai",
    location: "Nizamabad",
    category: "Spices",
    price: 95,
    marketPrice: 120,
    stock: 800,
    image: "🟡",
    minOrder: 25,
  },
  {
    id: "B2B004",
    name: "Fresh Onions",
    farmer: "Govind Rao",
    location: "Adilabad",
    category: "Vegetables",
    price: 28,
    marketPrice: 35,
    stock: 3000,
    image: "🧅",
    minOrder: 75,
  },
];

const B2BCartPage: React.FC = () => {
  const navigate = useNavigate();
  const [cart, setCart] = useState<Map<string, number>>(new Map());

  // Load cart from localStorage on mount
  React.useEffect(() => {
    const savedCart = localStorage.getItem('b2b_cart');
    if (savedCart) {
      setCart(new Map(JSON.parse(savedCart)));
    }
  }, []);

  // Save cart to localStorage whenever it changes
  React.useEffect(() => {
    localStorage.setItem('b2b_cart', JSON.stringify(Array.from(cart.entries())));
  }, [cart]);

  const handleCartUpdate = (newCart: Map<string, number>) => {
    setCart(newCart);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-indigo-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate("/b2b/dashboard")}
                className="text-gray-600 hover:text-gray-900"
              >
                ← Back to Dashboard
              </button>
              <h1 className="text-2xl font-bold text-gray-900">Shopping Cart</h1>
            </div>
            <button
              onClick={() => navigate("/b2b/products")}
              className="text-blue-600 hover:text-blue-700"
            >
              Continue Shopping →
            </button>
          </div>
        </div>
      </div>

      {/* Cart Component */}
      <B2BCart 
        cart={cart} 
        products={b2bProducts} 
        onUpdateCart={handleCartUpdate}
      />
    </div>
  );
};

export default B2BCartPage;
