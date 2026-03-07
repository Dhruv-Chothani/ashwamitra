import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, MapPin, ShoppingCart, Package, Plus, Minus, Filter } from "lucide-react";

// Mock B2B products data
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
    description: "Premium quality basmati rice, aged for 12 months for perfect aroma and taste.",
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
    description: "Fresh, juicy tomatoes grown organically without pesticides.",
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
    description: "Pure organic turmeric powder with high curcumin content.",
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
    description: "Fresh red onions with excellent storage quality.",
  },
  {
    id: "B2B005",
    name: "Green Chilies",
    farmer: "Priya Sharma",
    location: "Karimnagar",
    category: "Vegetables",
    price: 42,
    marketPrice: 55,
    stock: 1500,
    image: "🌶️",
    minOrder: 30,
    description: "Spicy green chilies, perfect for commercial kitchens.",
  },
  {
    id: "B2B006",
    name: "Wheat Flour",
    farmer: "Mahesh Reddy",
    location: "Medak",
    category: "Grains",
    price: 32,
    marketPrice: 40,
    stock: 4000,
    image: "🌾",
    minOrder: 200,
    description: "Premium wheat flour, finely milled for perfect texture.",
  },
];

const categories = ["All", "Grains", "Vegetables", "Spices", "Fruits"];

const B2BProducts: React.FC = () => {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [search, setSearch] = useState("");
  const [cart, setCart] = useState<Map<string, number>>(new Map());
  const [showCartNotification, setShowCartNotification] = useState(false);
  const [addedProduct, setAddedProduct] = useState<string>("");

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

  const filteredProducts = b2bProducts.filter((product) => {
    const matchCategory =
      selectedCategory === "All" || product.category === selectedCategory;

    const matchSearch =
      product.name.toLowerCase().includes(search.toLowerCase());

    return matchCategory && matchSearch;
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-indigo-50">
      {/* Cart Notification */}
      {showCartNotification && (
        <div className="fixed top-20 right-4 z-50 bg-blue-600 text-white px-4 py-3 rounded-lg shadow-lg flex items-center gap-3 animate-pulse">
          <ShoppingCart className="w-5 h-5" />
          <span className="font-medium">{addedProduct} added to cart!</span>
        </div>
      )}

      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <h1 className="text-2xl font-bold text-gray-900">B2B Products</h1>
              <span className="text-sm text-gray-500">Bulk agricultural produce</span>
            </div>
            <button
              onClick={() => navigate("/b2b/cart")}
              className="relative flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <ShoppingCart className="w-5 h-5" />
              Cart
              {getCartItemsCount() > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                  {getCartItemsCount()}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search products..."
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {/* Category Filter */}
          <div className="flex gap-2 overflow-x-auto">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-3 rounded-xl text-sm font-medium transition whitespace-nowrap ${
                  selectedCategory === cat
                    ? "bg-blue-600 text-white shadow-md"
                    : "bg-white text-gray-700 border border-gray-200 hover:bg-gray-50"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <div className="max-w-7xl mx-auto px-4 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product) => {
            const discount = Math.round(
              ((product.marketPrice - product.price) / product.marketPrice) * 100
            );

            return (
              <div
                key={product.id}
                className="bg-white rounded-2xl border border-gray-200 p-6 hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
              >
                {/* Product Image */}
                <div className="w-full h-40 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl flex items-center justify-center text-5xl mb-4">
                  {product.image}
                </div>

                {/* Product Info */}
                <h3 className="font-semibold text-gray-900 text-lg mb-2">
                  {product.name}
                </h3>
                
                <p className="text-sm text-gray-500 mb-1">
                  Farmer: {product.farmer}
                </p>
                
                <p className="text-sm text-gray-500 mb-3 flex items-center gap-1">
                  <MapPin className="w-3 h-3" />
                  {product.location}
                </p>

                {/* Price and Discount */}
                <div className="flex items-center gap-2 mb-3">
                  <span className="font-bold text-blue-700 text-lg">
                    ₹{product.price}/kg
                  </span>
                  <span className="text-sm line-through text-gray-400">
                    ₹{product.marketPrice}
                  </span>
                  <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                    {discount}% OFF
                  </span>
                </div>

                {/* Stock and Min Order */}
                <div className="flex justify-between text-sm text-gray-600 mb-4">
                  <span>Stock: {product.stock}kg</span>
                  <span>Min Order: {product.minOrder}kg</span>
                </div>

                {/* Description */}
                <p className="text-xs text-gray-600 mb-4 line-clamp-2">
                  {product.description}
                </p>

                {/* Add to Cart Section */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between bg-gray-50 rounded-lg p-2">
                    <span className="text-sm font-medium text-gray-700">Quantity (kg):</span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          const currentQty = cart.get(product.id) || 0;
                          if (currentQty > product.minOrder) {
                            setCart(prev => {
                              const newCart = new Map(prev);
                              newCart.set(product.id, currentQty - 1);
                              return newCart;
                            });
                          }
                        }}
                        className="w-6 h-6 rounded-full bg-red-100 hover:bg-red-200 text-red-600 flex items-center justify-center text-xs disabled:opacity-50"
                        disabled={(cart.get(product.id) || 0) <= product.minOrder}
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="w-12 text-center font-semibold text-sm">
                        {cart.get(product.id) || product.minOrder}
                      </span>
                      <button
                        onClick={() => {
                          const currentQty = cart.get(product.id) || 0;
                          setCart(prev => {
                            const newCart = new Map(prev);
                            newCart.set(product.id, currentQty + 1);
                            return newCart;
                          });
                        }}
                        className="w-6 h-6 rounded-full bg-blue-100 hover:bg-blue-200 text-blue-600 flex items-center justify-center text-xs"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                  </div>

                  <button
                    onClick={() => addToCart(product, cart.get(product.id) || product.minOrder)}
                    className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-sm font-semibold hover:scale-105 transition"
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
              <Package className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No products found</h3>
            <p className="text-gray-500">Try adjusting your search or filter criteria</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default B2BProducts;
