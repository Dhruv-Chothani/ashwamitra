import React, { useState, useMemo } from "react";
import {
  Search, Filter, Star, MapPin, Truck, ShieldCheck, ChevronRight,
  Package, TrendingDown, Clock, X, ShoppingCart, Wheat, Leaf,
  Cherry, Flame, Droplets, Award, ArrowRight, Plus, Minus,
  Check, Eye, Heart, BadgePercent, Zap, Users, BarChart3,
} from "lucide-react";

/* ─────────── TYPES ─────────── */
type PriceTier = { minQty: number; maxQty: number | null; price: number };

type Product = {
  id: string;
  name: string;
  farmer: string;
  location: string;
  state: string;
  category: string;
  subCategory: string;
  price: number;
  marketPrice: number;
  stock: number;
  unit: string;
  minOrder: number;
  rating: number;
  reviews: number;
  delivery: string;
  description: string;
  image: string;
  organic: boolean;
  verified: boolean;
  priceTiers: PriceTier[];
  tags: string[];
};

/* ─────────── CATEGORIES ─────────── */
const categories = [
  { id: "all", label: "All Products", icon: Package, emoji: "📦", color: "from-slate-500 to-slate-700" },
  { id: "Grains", label: "Grains & Cereals", icon: Wheat, emoji: "🌾", color: "from-amber-500 to-yellow-600" },
  { id: "Vegetables", label: "Fresh Vegetables", icon: Leaf, emoji: "🥬", color: "from-emerald-500 to-green-600" },
  { id: "Fruits", label: "Fruits", icon: Cherry, emoji: "🍎", color: "from-red-400 to-rose-600" },
  { id: "Spices", label: "Spices & Herbs", icon: Flame, emoji: "🌶️", color: "from-orange-500 to-red-500" },
  { id: "Dairy", label: "Dairy & Poultry", icon: Droplets, emoji: "🥛", color: "from-sky-400 to-blue-500" },
  { id: "Pulses", label: "Pulses & Lentils", icon: Award, emoji: "🫘", color: "from-yellow-600 to-amber-700" },
];

/* ─────────── PRODUCT DATA ─────────── */
const mockProducts: Product[] = [
  {
    id: "1", name: "Premium Basmati Rice", farmer: "Ramu Reddy", location: "Nalgonda", state: "Telangana",
    category: "Grains", subCategory: "Rice", price: 68, marketPrice: 85, stock: 12000, unit: "kg",
    minOrder: 200, rating: 4.8, reviews: 234, delivery: "3-5 days",
    description: "Extra-long grain aged basmati rice. Perfect for restaurants, hotels and export. FSSAI certified with lab reports available.",
    image: "https://images.unsplash.com/photo-1586201375761-83865001e31b?w=400&q=80&auto=format&fit=crop",
    organic: false, verified: true,
    priceTiers: [{ minQty: 200, maxQty: 500, price: 68 }, { minQty: 501, maxQty: 2000, price: 62 }, { minQty: 2001, maxQty: null, price: 56 }],
    tags: ["Bestseller", "FSSAI"],
  },
  {
    id: "2", name: "Organic Turmeric Powder", farmer: "Lakshmi Bai", location: "Nizamabad", state: "Telangana",
    category: "Spices", subCategory: "Turmeric", price: 145, marketPrice: 195, stock: 2800, unit: "kg",
    minOrder: 50, rating: 4.9, reviews: 189, delivery: "4-6 days",
    description: "High curcumin content (5%+). USDA organic certified turmeric powder, lab tested. Ideal for food producers and exporters.",
    image: "https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=400&q=80&auto=format&fit=crop",
    organic: true, verified: true,
    priceTiers: [{ minQty: 50, maxQty: 200, price: 145 }, { minQty: 201, maxQty: 500, price: 132 }, { minQty: 501, maxQty: null, price: 118 }],
    tags: ["Organic", "Lab Tested"],
  },
  {
    id: "3", name: "Fresh Tomatoes (Grade A)", farmer: "Suresh Kumar", location: "Madanapalle", state: "Andhra Pradesh",
    category: "Vegetables", subCategory: "Tomatoes", price: 28, marketPrice: 42, stock: 8000, unit: "kg",
    minOrder: 100, rating: 4.5, reviews: 312, delivery: "1-2 days",
    description: "Grade-A firm red tomatoes, ideal for wholesale veg markets, HoReCa and food processing. Daily fresh harvest.",
    image: "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=400&q=80&auto=format&fit=crop",
    organic: false, verified: true,
    priceTiers: [{ minQty: 100, maxQty: 500, price: 28 }, { minQty: 501, maxQty: 2000, price: 24 }, { minQty: 2001, maxQty: null, price: 20 }],
    tags: ["Fast Delivery", "Daily Fresh"],
  },
  {
    id: "4", name: "Red Onions (Export Quality)", farmer: "Mahesh Yadav", location: "Nashik", state: "Maharashtra",
    category: "Vegetables", subCategory: "Onions", price: 24, marketPrice: 35, stock: 15000, unit: "kg",
    minOrder: 200, rating: 4.6, reviews: 276, delivery: "2-3 days",
    description: "Export quality red onions. Sizes 45-65mm, uniform shape and color. Cold storage available.",
    image: "https://images.unsplash.com/photo-1582515073490-dc2c6b38e3d3?w=400&q=80&auto=format&fit=crop",
    organic: false, verified: true,
    priceTiers: [{ minQty: 200, maxQty: 1000, price: 24 }, { minQty: 1001, maxQty: 5000, price: 21 }, { minQty: 5001, maxQty: null, price: 18 }],
    tags: ["Export Quality", "Cold Storage"],
  },
  {
    id: "5", name: "Sharbati Wheat", farmer: "Anil Sharma", location: "Sehore", state: "Madhya Pradesh",
    category: "Grains", subCategory: "Wheat", price: 2450, marketPrice: 3200, stock: 500, unit: "quintal",
    minOrder: 5, rating: 4.7, reviews: 198, delivery: "5-7 days",
    description: "MP Sharbati wheat known for golden colour and high protein. Perfect for flour mills and chapati production.",
    image: "https://images.unsplash.com/photo-1603048297172-c92544798d5a?w=400&q=80&auto=format&fit=crop",
    organic: false, verified: true,
    priceTiers: [{ minQty: 5, maxQty: 20, price: 2450 }, { minQty: 21, maxQty: 50, price: 2280 }, { minQty: 51, maxQty: null, price: 2100 }],
    tags: ["MP Origin", "High Protein"],
  },
  {
    id: "6", name: "Kashmiri Red Chilli", farmer: "Rajesh Patel", location: "Byadgi", state: "Karnataka",
    category: "Spices", subCategory: "Chilli", price: 285, marketPrice: 380, stock: 1500, unit: "kg",
    minOrder: 25, rating: 4.8, reviews: 167, delivery: "3-5 days",
    description: "Byadgi variety known for deep red color. Low pungency, high color value. Used by spice brands and food companies.",
    image: "https://images.unsplash.com/photo-1601648764658-cf37e8c89b70?w=400&q=80&auto=format&fit=crop",
    organic: false, verified: true,
    priceTiers: [{ minQty: 25, maxQty: 100, price: 285 }, { minQty: 101, maxQty: 500, price: 260 }, { minQty: 501, maxQty: null, price: 238 }],
    tags: ["High Color Value", "Byadgi"],
  },
  {
    id: "7", name: "Alphonso Mangoes", farmer: "Vijay Desai", location: "Ratnagiri", state: "Maharashtra",
    category: "Fruits", subCategory: "Mangoes", price: 650, marketPrice: 900, stock: 3000, unit: "dozen",
    minOrder: 20, rating: 4.9, reviews: 456, delivery: "2-3 days",
    description: "GI-tagged Ratnagiri Alphonso. Naturally ripened, carbide-free. Available in 3kg and 5kg branded boxes.",
    image: "https://images.unsplash.com/photo-1553279768-865429fa0078?w=400&q=80&auto=format&fit=crop",
    organic: true, verified: true,
    priceTiers: [{ minQty: 20, maxQty: 50, price: 650 }, { minQty: 51, maxQty: 200, price: 580 }, { minQty: 201, maxQty: null, price: 520 }],
    tags: ["GI Tagged", "Carbide Free"],
  },
  {
    id: "8", name: "A2 Gir Cow Ghee", farmer: "Gopal Dairy Farm", location: "Jamnagar", state: "Gujarat",
    category: "Dairy", subCategory: "Ghee", price: 1850, marketPrice: 2400, stock: 600, unit: "litre",
    minOrder: 10, rating: 4.9, reviews: 321, delivery: "3-4 days",
    description: "Traditional bilona method A2 ghee from pure Gir cow milk. Lab certified. Perfect for premium retail and HoReCa.",
    image: "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=400&q=80&auto=format&fit=crop",
    organic: true, verified: true,
    priceTiers: [{ minQty: 10, maxQty: 50, price: 1850 }, { minQty: 51, maxQty: 200, price: 1720 }, { minQty: 201, maxQty: null, price: 1580 }],
    tags: ["A2 Milk", "Bilona Method"],
  },
  {
    id: "9", name: "Fresh Green Peas", farmer: "Harpal Singh", location: "Ambala", state: "Haryana",
    category: "Vegetables", subCategory: "Peas", price: 55, marketPrice: 78, stock: 4000, unit: "kg",
    minOrder: 100, rating: 4.4, reviews: 134, delivery: "2-3 days",
    description: "Sweet green peas harvested fresh. Perfect for wholesale veggie markets and frozen food companies.",
    image: "https://images.unsplash.com/photo-1587735243615-c03f25aaff15?w=400&q=80&auto=format&fit=crop",
    organic: false, verified: true,
    priceTiers: [{ minQty: 100, maxQty: 500, price: 55 }, { minQty: 501, maxQty: 2000, price: 48 }, { minQty: 2001, maxQty: null, price: 42 }],
    tags: ["Seasonal", "Fresh Harvest"],
  },
  {
    id: "10", name: "Organic Moong Dal", farmer: "Kamla Devi", location: "Bikaner", state: "Rajasthan",
    category: "Pulses", subCategory: "Moong", price: 115, marketPrice: 155, stock: 3500, unit: "kg",
    minOrder: 100, rating: 4.6, reviews: 201, delivery: "4-5 days",
    description: "Split yellow moong dal, organically grown. Clean and polished. Suitable for retail packing and institutional use.",
    image: "https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=400&q=80&auto=format&fit=crop",
    organic: true, verified: true,
    priceTiers: [{ minQty: 100, maxQty: 500, price: 115 }, { minQty: 501, maxQty: 2000, price: 105 }, { minQty: 2001, maxQty: null, price: 95 }],
    tags: ["Organic", "Double Washed"],
  },
  {
    id: "11", name: "Coriander Seeds (Dhaniya)", farmer: "Rajesh Meena", location: "Kota", state: "Rajasthan",
    category: "Spices", subCategory: "Coriander", price: 120, marketPrice: 165, stock: 2200, unit: "kg",
    minOrder: 50, rating: 4.7, reviews: 143, delivery: "3-4 days",
    description: "Eagle variety coriander seeds. High essential oil content, aromatic. Used by masala manufacturers.",
    image: "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=400&q=80&auto=format&fit=crop",
    organic: false, verified: true,
    priceTiers: [{ minQty: 50, maxQty: 200, price: 120 }, { minQty: 201, maxQty: 500, price: 108 }, { minQty: 501, maxQty: null, price: 96 }],
    tags: ["Eagle Variety", "Aromatic"],
  },
  {
    id: "12", name: "Pomegranate (Bhagwa)", farmer: "Sanjay Patil", location: "Solapur", state: "Maharashtra",
    category: "Fruits", subCategory: "Pomegranate", price: 95, marketPrice: 140, stock: 5000, unit: "kg",
    minOrder: 50, rating: 4.6, reviews: 189, delivery: "2-4 days",
    description: "Bhagwa variety pomegranate, deep red arils. Export-grade sizing and sorting. Cold chain logistics available.",
    image: "https://images.unsplash.com/photo-1615484477778-ca3b77940c25?w=400&q=80&auto=format&fit=crop",
    organic: false, verified: true,
    priceTiers: [{ minQty: 50, maxQty: 200, price: 95 }, { minQty: 201, maxQty: 1000, price: 85 }, { minQty: 1001, maxQty: null, price: 75 }],
    tags: ["Export Grade", "Cold Chain"],
  },
];

const sortOptions = [
  { label: "Relevance", value: "relevance" },
  { label: "Price: Low to High", value: "price_asc" },
  { label: "Price: High to Low", value: "price_desc" },
  { label: "Highest Rated", value: "rating" },
  { label: "Max Savings", value: "savings" },
];

/* ─────────── HELPERS ─────────── */
const calcSaving = (p: Product) => Math.round(((p.marketPrice - p.price) / p.marketPrice) * 100);

const formatPrice = (n: number) =>
  n >= 10000 ? `₹${(n / 1000).toFixed(1)}K` : `₹${n.toLocaleString("en-IN")}`;

/* ─────────── COMPONENT ─────────── */
const Products: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState("all");
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("relevance");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [orderQty, setOrderQty] = useState<number>(0);
  const [wishlist, setWishlist] = useState<Set<string>>(new Set());
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  /* Filtered + sorted products */
  const products = useMemo(() => {
    let result = mockProducts.filter((p) => {
      const catMatch = activeCategory === "all" || p.category === activeCategory;
      const searchMatch =
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.farmer.toLowerCase().includes(search.toLowerCase()) ||
        p.category.toLowerCase().includes(search.toLowerCase()) ||
        p.tags.some((t) => t.toLowerCase().includes(search.toLowerCase()));
      return catMatch && searchMatch;
    });

    switch (sort) {
      case "price_asc": result.sort((a, b) => a.price - b.price); break;
      case "price_desc": result.sort((a, b) => b.price - a.price); break;
      case "rating": result.sort((a, b) => b.rating - a.rating); break;
      case "savings": result.sort((a, b) => calcSaving(b) - calcSaving(a)); break;
    }

    return result;
  }, [activeCategory, search, sort]);

  const toggleWishlist = (id: string) => {
    setWishlist((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const placeOrder = (product: Product) => {
    // Place order directly with minimum order quantity
    const orderDetails = {
      productId: product.id,
      productName: product.name,
      farmer: product.farmer,
      quantity: product.minOrder,
      unit: product.unit,
      price: product.price,
      totalPrice: product.price * product.minOrder,
      orderDate: new Date().toLocaleDateString(),
      status: "Pending"
    };
    
    alert(`Order placed successfully!\n\nProduct: ${product.name}\nQuantity: ${product.minOrder} ${product.unit}\nTotal: ₹${orderDetails.totalPrice}\nFarmer: ${product.farmer}\n\nOrder ID: ORD${Date.now()}`);
  };

  const openDetail = (p: Product) => { setSelectedProduct(p); setOrderQty(p.minOrder); };

  const currentTier = (p: Product, qty: number): PriceTier =>
    p.priceTiers.slice().reverse().find((t) => qty >= t.minQty) || p.priceTiers[0];

  /* ─── CATEGORY COUNT ─── */
  const categoryCounts = useMemo(() => {
    const map: Record<string, number> = { all: mockProducts.length };
    mockProducts.forEach((p) => { map[p.category] = (map[p.category] || 0) + 1; });
    return map;
  }, []);

  /* ─────────────────────────────────── RENDER ─────────────────────────────────── */
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 p-4 md:p-6 space-y-6">

      {/* ════════ HEADER ════════ */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-600 via-green-600 to-teal-600 p-5 md:p-6 text-white shadow-2xl">
        {/* Animated background elements */}
        <div className="absolute -right-20 -top-20 w-72 h-72 rounded-full bg-white/5 animate-pulse" />
        <div className="absolute -right-10 -bottom-16 w-56 h-56 rounded-full bg-white/5 animate-pulse delay-75" />
        <div className="absolute left-10 top-1/2 -translate-y-1/2 w-32 h-32 rounded-full bg-white/5 animate-pulse delay-150" />
        
        <div className="relative z-10">
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4">
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <span className="px-3 py-1 text-xs font-bold bg-white/20 backdrop-blur-sm rounded-full border border-white/10">B2B MARKETPLACE</span>
                <span className="flex items-center gap-1.5 px-3 py-1 text-xs font-bold bg-gradient-to-r from-yellow-400 to-orange-400 text-white rounded-full shadow-lg">
                  <Zap className="w-3.5 h-3.5" /> LIVE PRICES
                </span>
                <span className="flex items-center gap-1.5 px-3 py-1 text-xs font-bold bg-white/10 backdrop-blur-sm rounded-full">
                  <ShieldCheck className="w-3.5 h-3.5" /> VERIFIED SUPPLIERS
                </span>
              </div>
              <h1 className="text-2xl md:text-3xl font-bold tracking-tight leading-tight">Product Discovery</h1>
              <p className="text-green-50 text-sm max-w-2xl leading-relaxed">Source premium farm-fresh produce at competitive wholesale rates. Connect with verified suppliers, unlock bulk pricing tiers, and enjoy fast delivery across India.</p>
            </div>

            <div className="flex gap-3">
              {[
                { label: "Products", value: mockProducts.length.toString(), icon: Package, color: "from-white/20 to-white/10" },
                { label: "Suppliers", value: "48+", icon: Users, color: "from-emerald-400/20 to-green-400/10" },
                { label: "Avg Savings", value: "28%", icon: TrendingDown, color: "from-blue-400/20 to-indigo-400/10" },
              ].map((s, i) => (
                <div key={s.label} className={`bg-gradient-to-br ${s.color} backdrop-blur-sm rounded-2xl p-3 min-w-[90px] border border-white/10 shadow-xl transform hover:scale-105 transition-all duration-300`}>
                  <s.icon className="w-4 h-4 mx-auto mb-1.5 opacity-90" />
                  <div className="text-lg font-bold">{s.value}</div>
                  <div className="text-[9px] uppercase tracking-wider opacity-80 mt-0.5">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ════════ CATEGORIES (Enhanced Premium Grid) ════════ */}
      <div className="bg-gradient-to-br from-white via-gray-50 to-white rounded-3xl p-3 shadow-2xl border border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <div className="space-y-1">
            <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <div className="w-5 h-5 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center">
                <Package className="w-3 h-3 text-white" />
              </div>
              Browse Categories
            </h3>
            <p className="text-xs text-gray-600">Discover premium agricultural products across all categories</p>
          </div>
          <div className="text-center bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-2 border border-green-100">
            <span className="text-xl font-bold text-green-700">{mockProducts.length}</span>
            <p className="text-xs text-green-600 font-semibold">Products Available</p>
          </div>
        </div>
        
        {/* Enhanced Categories Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-2">
          {categories.map((cat, index) => {
            const isActive = activeCategory === cat.id;
            const count = categoryCounts[cat.id] || 0;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`group relative flex flex-col items-center gap-2 p-3 rounded-lg text-center transition-all duration-700 transform hover:scale-105 hover:-translate-y-1 overflow-hidden
                  ${isActive
                    ? `bg-gradient-to-br ${cat.color} text-white shadow-2xl shadow-${cat.color.split('-')[0]}-300/60 scale-[1.03] ring-2 ring-white ring-offset-2 ring-offset-gray-50`
                    : "bg-white text-gray-700 border-2 border-gray-200 hover:border-gray-300 hover:shadow-xl hover:border-gray-400"
                  }`}
                style={{
                  animationDelay: `${index * 100}ms`,
                  animation: isActive ? 'bounce 2s infinite' : 'none'
                }}
              >
                {/* Enhanced Background Effects */}
                {!isActive && (
                  <>
                    <div className="absolute inset-0 bg-gradient-to-br from-transparent via-gray-50 to-gray-100 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-gray-200/20 to-transparent rounded-full -translate-y-10 translate-x-10" />
                    <div className="absolute bottom-0 left-0 w-16 h-16 bg-gradient-to-br from-gray-200/15 to-transparent rounded-full translate-y-8 -translate-x-8" />
                  </>
                )}
                
                {/* Active State Effects */}
                {isActive && (
                  <>
                    <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent" />
                    <div className="absolute -top-3 -right-3 w-5 h-5 bg-white rounded-full animate-pulse shadow-lg" />
                    <div className="absolute -bottom-3 -left-3 w-4 h-4 bg-white rounded-full animate-pulse shadow-lg delay-75" />
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 bg-gradient-to-br from-white/5 to-transparent rounded-full animate-ping delay-150" />
                  </>
                )}
                
                {/* Enhanced Icon */}
                <div className={`relative z-10 text-5xl transition-all duration-700 ${isActive ? "scale-110" : "group-hover:scale-110 group-hover:rotate-12"}`}>
                  {cat.emoji}
                </div>
                
                {/* Enhanced Content */}
                <div className="flex-1 min-w-0 relative z-10">
                  <div className="font-bold text-sm leading-tight line-clamp-2 mb-2">
                    {cat.label}
                  </div>
                  <div className={`text-xs font-bold ${isActive ? "text-white/90 bg-white/20" : "text-gray-500 bg-gray-100"} px-3 py-1.5 rounded-full inline-block`}>
                    {count} items
                  </div>
                </div>
                
                {/* Enhanced Hover Glow */}
                {!isActive && (
                  <div className="absolute inset-0 bg-gradient-to-br from-green-500/0 via-green-500/5 to-green-500/0 rounded-2xl opacity-0 group-hover:opacity-100 transition-all duration-700 group-hover:scale-110" />
                )}
                
                {/* Shine Effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 transform -skew-x-12 -skew-y-12 group-hover:skew-x-0 group-hover:skew-y-0" />
              </button>
            );
          })}
        </div>
        
        {/* Enhanced Category Description */}
        {activeCategory !== "all" && (
          <div className="mt-8 p-6 bg-gradient-to-r from-green-50 via-emerald-50 to-teal-50 rounded-3xl border-2 border-green-200 shadow-xl transform transition-all duration-500">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center text-3xl shadow-lg animate-pulse">
                {categories.find(c => c.id === activeCategory)?.emoji}
              </div>
              <div className="flex-1">
                <p className="text-lg font-bold text-green-800">
                  {categories.find(c => c.id === activeCategory)?.label}
                </p>
                <p className="text-sm text-green-600 font-medium">
                  {categoryCounts[activeCategory]} premium products available in this category
                </p>
              </div>
              <button
                onClick={() => setActiveCategory("all")}
                className="px-4 py-2 bg-white/80 hover:bg-white text-green-700 rounded-xl text-sm font-semibold transition-all duration-300 hover:scale-105 shadow-md"
              >
                View All
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ════════ SEARCH + SORT BAR (Premium) ════════ */}
      <div className="bg-gradient-to-br from-white via-gray-50 to-white rounded-3xl p-3 shadow-2xl border border-gray-100">
        <div className="flex flex-col lg:flex-row gap-3">
          {/* Premium Search */}
          <div className="relative flex-1">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center pointer-events-none">
              <Search className="w-4 h-4 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search products, farmers, or categories..."
              className="w-full pl-10 pr-10 py-2 rounded-lg bg-gradient-to-br from-gray-50 to-white border-2 border-gray-200 text-sm focus:ring-4 focus:ring-green-500/20 focus:border-green-500 focus:bg-white shadow-lg transition-all duration-500 focus:shadow-xl outline-none font-medium"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
           
             
            
          </div>

          {/* Premium Sort */}
          <div className="relative">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
              <Filter className="w-4 h-4 text-gray-400" />
            </div>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="appearance-none pl-10 pr-10 py-2 rounded-lg bg-gradient-to-br from-gray-50 to-white border-2 border-gray-200 text-sm font-bold text-gray-700 focus:ring-4 focus:ring-green-500/20 focus:border-green-500 focus:bg-white shadow-lg outline-none cursor-pointer transition-all duration-500 min-w-[150px] hover:shadow-xl"
            >
              {sortOptions.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
              <ChevronRight className="w-3.5 h-3.5 text-gray-400 rotate-90" />
            </div>
          </div>

          {/* Premium View Toggle */}
          <div className="hidden lg:flex bg-gradient-to-br from-gray-50 to-white border-2 border-gray-200 rounded-lg overflow-hidden shadow-lg">
            {(["grid", "list"] as const).map((v) => (
              <button
                key={v}
                onClick={() => setViewMode(v)}
                className={`px-3 py-2 text-sm font-bold transition-all duration-500 ${
                  viewMode === v 
                    ? "bg-gradient-to-r from-green-600 to-emerald-600 text-white shadow-xl" 
                    : "text-gray-500 hover:bg-gray-100 hover:text-gray-700"
                }`}
              >
                <span className="text-xl">{v === "grid" ? "⊞" : "☰"}</span>
              </button>
            ))}
          </div>
        </div>
        
        {/* Search Suggestions */}
        {!search && (
          <div className="mt-3 flex flex-wrap gap-2">
            <span className="text-xs text-gray-500 font-medium">Popular searches:</span>
            {["Basmati Rice", "Organic Turmeric", "Fresh Tomatoes", "Alphonso Mangoes"].map((term) => (
              <button
                key={term}
                onClick={() => setSearch(term)}
                className="text-xs px-2 py-1 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-full transition-colors duration-300 hover:scale-105"
              >
                {term}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* ════════ RESULTS SUMMARY (Enhanced) ════════ */}
      <div className="bg-white rounded-2xl p-2 shadow-lg border border-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center">
              <Package className="w-3 h-3 text-white" />
            </div>
            <div>
              <p className="text-xs text-gray-500">
                Showing <span className="font-bold text-gray-900 text-xs">{products.length}</span> products
                {activeCategory !== "all" && <span> in <span className="font-bold text-green-600">{categories.find((c) => c.id === activeCategory)?.label}</span></span>}
              </p>
              {search && <p className="text-xs text-gray-400 italic">Results for "{search}"</p>}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-400">Sort by:</span>
            <span className="text-xs font-semibold text-gray-700 bg-gray-100 px-2 py-1 rounded-full">
              {sortOptions.find(o => o.value === sort)?.label}
            </span>
          </div>
        </div>
      </div>

      {/* ════════ PRODUCT GRID (Enhanced) ════════ */}
      {products.length === 0 ? (
        <div className="text-center py-24 bg-white rounded-3xl border-2 border-dashed border-gray-200 shadow-lg">
          <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-gray-100 to-gray-50 flex items-center justify-center">
            <Package className="w-10 h-10 text-gray-300" />
          </div>
          <h3 className="text-xl font-bold text-gray-700 mb-2">No products found</h3>
          <p className="text-sm text-gray-400 mb-6 max-w-md mx-auto">Try adjusting your search or category filter to find what you're looking for</p>
          <button 
            onClick={() => { setSearch(""); setActiveCategory("all"); }} 
            className="px-6 py-3 rounded-2xl bg-gradient-to-r from-green-600 to-emerald-600 text-white text-sm font-bold hover:from-green-700 hover:to-emerald-700 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
          >
            Clear All Filters
          </button>
        </div>
      ) : (
        <div className={viewMode === "grid" ? "grid sm:grid-cols-2 xl:grid-cols-3 gap-6" : "space-y-4"}>
          {products.map((p) => {
            const saving = calcSaving(p);
            const inWishlist = wishlist.has(p.id);
            const lowestPrice = p.priceTiers[p.priceTiers.length - 1].price;

            return viewMode === "grid" ? (
              /* ─── ENHANCED GRID CARD ─── */
              <div
                key={p.id}
                className="group relative bg-white rounded-3xl border-2 border-gray-100 shadow-lg hover:shadow-2xl hover:border-green-300 transition-all duration-500 overflow-hidden transform hover:-translate-y-1"
              >
                {/* Image Container */}
                <div className="relative h-56 overflow-hidden bg-gradient-to-br from-gray-100 to-gray-50">
                  <img
                    src={p.image}
                    alt={p.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    loading="lazy"
                  />

                  {/* Top-left badges */}
                  <div className="absolute top-4 left-4 flex flex-col gap-2">
                    {saving >= 20 && (
                      <span className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl shadow-lg backdrop-blur-sm">
                        <BadgePercent className="w-3.5 h-3.5" /> {saving}% OFF
                      </span>
                    )}
                    {p.organic && (
                      <span className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl shadow-lg backdrop-blur-sm">
                        <Leaf className="w-3.5 h-3.5" /> ORGANIC
                      </span>
                    )}
                    {p.tags[0] === "Bestseller" && (
                      <span className="px-3 py-1.5 text-xs font-bold bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-xl shadow-lg backdrop-blur-sm">🔥 BESTSELLER</span>
                    )}
                  </div>

                  {/* Top-right wishlist */}
                  <button
                    onClick={(e) => { e.stopPropagation(); toggleWishlist(p.id); }}
                    className={`absolute top-4 right-4 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 shadow-lg backdrop-blur-sm transform hover:scale-110
                      ${inWishlist ? "bg-red-500/90 text-white" : "bg-white/90 text-gray-400 hover:text-red-500 hover:bg-white"}`}
                  >
                    <Heart className="w-5 h-5" fill={inWishlist ? "currentColor" : "none"} />
                  </button>

                  {/* Bottom image overlay */}
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent p-4">
                    <div className="flex items-center gap-2">
                      <span className="flex items-center gap-1 bg-amber-400/90 text-black text-xs font-bold px-2 py-1 rounded-lg">
                        <Star className="w-4 h-4" fill="currentColor" /> {p.rating}
                      </span>
                      <span className="text-xs text-white/90 font-medium">({p.reviews} reviews)</span>
                    </div>
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-5 space-y-3">
                  {/* Category + verification */}
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-green-700 bg-green-50 px-3 py-1.5 rounded-full uppercase tracking-wider border border-green-100">{p.subCategory}</span>
                    {p.verified && (
                      <span className="flex items-center gap-1 text-xs text-blue-600 font-bold bg-blue-50 px-3 py-1.5 rounded-full border border-blue-100">
                        <ShieldCheck className="w-3.5 h-3.5" /> Verified
                      </span>
                    )}
                  </div>

                  {/* Product Name */}
                  <h3 className="font-bold text-gray-900 text-base leading-tight line-clamp-2 group-hover:text-green-700 transition-colors duration-300">{p.name}</h3>

                  {/* Supplier Info - Simplified */}
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <span className="flex items-center gap-1 font-medium"><Users className="w-3.5 h-3.5" />{p.farmer}</span>
                  </div>

                  {/* Enhanced Price Block */}
                  <div className="bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 rounded-xl p-3 space-y-1.5 border border-green-100">
                    <div className="flex items-baseline gap-2">
                      <span className="text-lg font-extrabold text-green-700">₹{p.price}</span>
                      <span className="text-xs text-gray-500 font-medium">/{p.unit}</span>
                      <span className="text-xs text-gray-400 line-through ml-auto">₹{p.marketPrice}</span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-emerald-600 font-bold">Save {saving}%</span>
                    </div>
                  </div>

                  {/* Simplified Quick Info - Only Stock and MOQ */}
                  <div className="grid grid-cols-2 gap-2">
                    <div className="bg-gradient-to-br from-gray-50 to-slate-50 rounded-xl p-3 text-center border border-gray-100">
                      <Package className="w-4 h-4 text-gray-400 mx-auto mb-1" />
                      <div className="text-xs font-bold text-gray-700">{p.stock.toLocaleString()} {p.unit}</div>
                      <div className="text-[9px] text-gray-400">Stock</div>
                    </div>
                    <div className="bg-gradient-to-br from-gray-50 to-slate-50 rounded-xl p-3 text-center border border-gray-100">
                      <ShoppingCart className="w-4 h-4 text-gray-400 mx-auto mb-1" />
                      <div className="text-xs font-bold text-gray-700">{p.minOrder} {p.unit}</div>
                      <div className="text-[9px] text-gray-400">MOQ</div>
                    </div>
                  </div>

                  {/* Enhanced Actions */}
                  <div className="flex gap-2 pt-1">
                    <button
                      onClick={() => placeOrder(p)}
                      className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 active:scale-95"
                    >
                      <ShoppingCart className="w-4 h-4" /> Order
                    </button>
                    <button
                      onClick={() => openDetail(p)}
                      className="flex items-center justify-center w-9 h-9 rounded-xl border border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-all duration-300 transform hover:scale-105"
                    >
                      <Eye className="w-4 h-4 text-gray-500" />
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              /* ─── ENHANCED LIST CARD ─── */
              <div
                key={p.id}
                className="group flex flex-col sm:flex-row bg-white rounded-3xl border-2 border-gray-100 shadow-lg hover:shadow-2xl hover:border-green-300 transition-all duration-500 overflow-hidden transform hover:-translate-y-1"
              >
                {/* Enhanced Image */}
                <div className="relative sm:w-64 h-48 sm:h-auto shrink-0 overflow-hidden">
                  <img 
                    src={p.image} 
                    alt={p.name} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                    loading="lazy" 
                  />
                  {saving >= 20 && (
                    <span className="absolute top-4 left-4 flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl shadow-lg backdrop-blur-sm">
                      <BadgePercent className="w-3.5 h-3.5" />{saving}% OFF
                    </span>
                  )}
                  {p.organic && (
                    <span className="absolute top-4 right-4 flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl shadow-lg backdrop-blur-sm">
                      <Leaf className="w-3.5 h-3.5" /> ORGANIC
                    </span>
                  )}
                </div>
                
                {/* Enhanced Content */}
                <div className="flex-1 p-6 flex flex-col justify-between gap-4">
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-bold text-green-700 bg-green-50 px-3 py-1.5 rounded-full uppercase tracking-wider border border-green-100">{p.subCategory}</span>
                      {p.organic && <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-100">🌿 Organic</span>}
                      {p.verified && <span className="flex items-center gap-1 text-xs font-bold text-blue-600 bg-blue-50 px-3 py-1.5 rounded-full border border-blue-100"><ShieldCheck className="w-3.5 h-3.5" /> Verified</span>}
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 group-hover:text-green-700 transition-colors duration-300 leading-tight">{p.name}</h3>
                    <p className="text-sm text-gray-600 leading-relaxed line-clamp-2">{p.description}</p>
                    <div className="flex items-center gap-6 text-sm text-gray-500">
                      <span className="flex items-center gap-1.5 font-medium"><Users className="w-4 h-4" />{p.farmer}</span>
                      <span className="flex items-center gap-1.5 font-medium"><MapPin className="w-4 h-4" />{p.location}, {p.state}</span>
                      <span className="flex items-center gap-1.5 font-medium text-amber-600"><Star className="w-4 h-4" fill="currentColor" />{p.rating} ({p.reviews})</span>
                    </div>
                  </div>
                  
                  <div className="flex items-end justify-between gap-4">
                    <div className="space-y-2">
                      <div className="flex items-baseline gap-2">
                        <span className="text-2xl font-extrabold text-green-700">₹{p.price}</span>
                        <span className="text-sm text-gray-500 font-medium">/{p.unit}</span>
                        <span className="text-sm text-gray-400 line-through">₹{p.marketPrice}</span>
                      </div>
                      <div className="flex gap-4 text-xs text-gray-500">
                        <span className="font-medium">MOQ: {p.minOrder} {p.unit}</span>
                        <span className="font-medium">Stock: {p.stock.toLocaleString()} {p.unit}</span>
                        <span className="font-medium">🚚 {p.delivery}</span>
                      </div>
                      <div className="text-xs font-bold text-emerald-600">Save {saving}% vs market price</div>
                    </div>
                    
                    <div className="flex gap-3">
                      <button
                        onClick={() => placeOrder(p)}
                        className="flex items-center gap-2 px-6 py-3 rounded-2xl text-sm font-bold text-white bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                      >
                        <ShoppingCart className="w-4.5 h-4.5" /> Order
                      </button>
                      <button 
                        onClick={() => toggleWishlist(p.id)} 
                        className={`w-11 h-11 rounded-2xl border-2 flex items-center justify-center transition-all duration-300 transform hover:scale-105 ${
                          inWishlist ? "border-red-200 bg-red-50 text-red-500 hover:bg-red-100" : "border-gray-200 text-gray-400 hover:bg-gray-50 hover:border-gray-300"
                        }`}
                      >
                        <Heart className="w-4.5 h-4.5" fill={inWishlist ? "currentColor" : "none"} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* RESPONSIVE PRODUCT DETAIL MODAL */}
      {selectedProduct && (() => {
  const p = selectedProduct;
  const saving = calcSaving(p);
  const tier = currentTier(p, orderQty);
  const totalCost = tier.price * orderQty;

  return (
    <div
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6"
      onClick={() => setSelectedProduct(null)}
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
        
        {/* HEADER (Fixed Height) */}
        <div className="bg-gradient-to-r from-green-600 to-emerald-600 p-2 xs:p-3 sm:p-4 text-white flex-shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 xs:gap-3">
              <div className="w-6 h-6 xs:w-8 xs:h-8 sm:w-10 sm:h-10 rounded-xl bg-white/20 flex items-center justify-center">
                <span className="text-xs xs:text-sm sm:text-base">🛒</span>
              </div>
              <div>
                <h3 className="text-xs xs:text-sm sm:text-base md:text-lg font-bold truncate max-w-[100px] xs:max-w-[150px] sm:max-w-[200px]">
                  {p.name}
                </h3>
                <p className="text-green-100 text-xs xs:text-sm">
                  {p.category} • {p.location}
                </p>
              </div>
            </div>
            <button
              onClick={() => setSelectedProduct(null)}
              className="w-5 h-5 xs:w-6 xs:h-6 sm:w-8 sm:h-8 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/30 transition"
            >
              <span className="text-xs xs:text-sm sm:text-base">×</span>
            </button>
          </div>
        </div>

        {/* NO SCROLL BODY - Fixed Height */}
        <div className="flex-1 flex flex-col p-2 xs:p-3 sm:p-4 md:p-4 lg:p-6">
          <div className="grid grid-cols-1 xs:grid-cols-1 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-2 gap-2 xs:gap-3 sm:gap-4">

            {/* LEFT */}
            <div className="space-y-2 xs:space-y-3">
              <div className="bg-gray-50 rounded-xl p-2 xs:p-3 border">
                <h4 className="font-bold mb-1 xs:mb-2 text-xs xs:text-sm">Product Details</h4>
                <div className="space-y-1 text-xs xs:text-sm">
                  <div className="flex justify-between">
                    <span>Stock:</span>
                    <span className="font-bold">
                      {p.stock.toLocaleString()} {p.unit}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Min Order:</span>
                    <span className="font-bold">
                      {p.minOrder} {p.unit}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Rating:</span>
                    <span className="font-bold">
                      {p.rating} ⭐
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-purple-50 rounded-xl p-2 xs:p-3 border">
                <h4 className="font-bold mb-1 xs:mb-2 text-xs xs:text-sm">Supplier Info</h4>
                <div className="space-y-1 text-xs xs:text-sm">
                  <div className="flex justify-between">
                    <span>Name:</span>
                    <span className="font-bold truncate max-w-[80px] xs:max-w-[120px]">{p.farmer}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Location:</span>
                    <span className="font-bold truncate max-w-[80px] xs:max-w-[120px]">{p.location}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT */}
            <div className="space-y-2 xs:space-y-3">
              <div className="bg-yellow-50 rounded-xl p-2 xs:p-3 border">
                <h4 className="font-bold mb-1 xs:mb-2 text-xs xs:text-sm">Pricing</h4>
                <div className="space-y-1 text-xs xs:text-sm">
                  <div className="flex justify-between">
                    <span>Current:</span>
                    <span className="font-bold text-orange-600">
                      ₹{p.price}/{p.unit}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Market:</span>
                    <span className="font-bold">
                      ₹{p.marketPrice}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Save:</span>
                    <span className="font-bold text-green-600">
                      {saving}%
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-green-50 rounded-xl p-2 xs:p-3 border">
                <h4 className="font-bold mb-1 xs:mb-2 text-xs xs:text-sm">Order</h4>

                <input
                  type="number"
                  min={p.minOrder}
                  max={p.stock}
                  value={orderQty}
                  onChange={(e) =>
                    setOrderQty(Number(e.target.value))
                  }
                  className="w-full mb-1 xs:mb-2 px-2 xs:px-3 py-1 xs:py-1.5 border rounded-lg focus:ring-2 focus:ring-green-500 text-xs xs:text-sm"
                />

                <div className="bg-white rounded-lg p-1 xs:p-2 border text-xs xs:text-sm">
                  <div className="flex justify-between">
                    <span>Price/unit:</span>
                    <span className="font-bold">
                      ₹{tier.price}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Qty:</span>
                    <span className="font-bold">
                      {orderQty} {p.unit}
                    </span>
                  </div>
                  <div className="border-t mt-1 pt-1 flex justify-between font-bold">
                    <span>Total:</span>
                    <span className="text-green-600">
                      ₹{totalCost.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* BUTTONS - Fixed Position Always Visible */}
          <div className="flex gap-2 xs:gap-3 mt-2 xs:mt-4 pt-2 xs:pt-3 border-t border-gray-200 flex-shrink-0">
            <button className="flex-1 py-2.5 xs:py-3 rounded-xl bg-green-600 text-white font-bold hover:bg-green-700 transition text-xs xs:text-sm shadow-lg min-h-[40px] xs:min-h-[44px]">
              Place Order
            </button>
            <button
              onClick={() => setSelectedProduct(null)}
              className="flex-1 py-2.5 xs:py-3 rounded-xl border-2 border-gray-300 font-bold hover:bg-gray-100 transition text-xs xs:text-sm shadow-md min-h-[40px] xs:min-h-[44px]"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
})()}
    </div>
  );
};

export default Products;