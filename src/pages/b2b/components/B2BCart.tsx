import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Package, MapPin, CreditCard, User, Phone, Mail, Calendar, Truck, X, CheckCircle, AlertCircle, Plus, Minus, ShoppingCart } from "lucide-react";

type CartItem = {
  id: string;
  name: string;
  farmer: string;
  price: number;
  quantity: number;
  unit: string;
  minOrder: number;
};

type Product = {
  id: string;
  name: string;
  farmer: string;
  location: string;
  category: string;
  price: number;
  marketPrice: number;
  stock: number;
  image: string;
  minOrder: number;
};

type B2BCartProps = {
  cart: Map<string, number>;
  products: Product[];
  onUpdateCart?: (cart: Map<string, number>) => void;
};

// Mock B2B products data
const b2bProducts: Product[] = [
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

const B2BCart: React.FC<B2BCartProps> = ({ cart, products, onUpdateCart }) => {
  const navigate = useNavigate();
  const [showCheckout, setShowCheckout] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [deliveryInfo, setDeliveryInfo] = useState({
    businessName: "",
    contactPerson: "",
    phone: "",
    email: "",
    deliveryAddress: "",
    city: "",
    state: "",
    pincode: "",
    deliveryDate: "",
    deliveryTime: "",
    paymentMethod: "cod",
    specialInstructions: "",
  });

  // Convert cart Map to cart items array
  const cartItems: CartItem[] = Array.from(cart.entries()).map(([productId, quantity]) => {
    const product = b2bProducts.find(p => p.id === productId);
    if (!product) return null;
    return {
      id: productId,
      name: product.name,
      farmer: product.farmer,
      price: product.price,
      quantity: quantity,
      unit: "kg",
      minOrder: product.minOrder,
    };
  }).filter(Boolean) as CartItem[];

  const total = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const deliveryCharge = total > 10000 ? 0 : 500;
  const tax = Math.round(total * 0.05); // 5% tax
  const finalTotal = total + deliveryCharge + tax;

  // Quantity control functions
  const updateQuantity = (productId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      // Remove item from cart if quantity is 0 or less
      const newCart = new Map(cart);
      newCart.delete(productId);
      onUpdateCart?.(newCart);
    } else {
      // Update quantity
      const newCart = new Map(cart);
      newCart.set(productId, newQuantity);
      onUpdateCart?.(newCart);
    }
  };

  const increaseQuantity = (productId: string) => {
    const currentQuantity = cart.get(productId) || 0;
    updateQuantity(productId, currentQuantity + 1);
  };

  const decreaseQuantity = (productId: string) => {
    const currentQuantity = cart.get(productId) || 0;
    updateQuantity(productId, currentQuantity - 1);
  };

  const handleCheckout = () => {
    setShowCheckout(true);
  };

  const handlePlaceOrder = () => {
    // Validate delivery info
    if (!deliveryInfo.businessName || !deliveryInfo.contactPerson || !deliveryInfo.phone || !deliveryInfo.deliveryAddress) {
      alert("Please fill in all required delivery information");
      return;
    }

    // Clear cart after successful order placement
    if (onUpdateCart) {
      onUpdateCart(new Map());
    }

    setOrderPlaced(true);
    setTimeout(() => {
      setOrderPlaced(false);
      setShowCheckout(false);
      // Navigate to orders
      navigate("/b2b/orders");
    }, 3000);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 space-y-6">

      <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
        <ShoppingCart className="w-6 h-6" />
        B2B Shopping Cart
      </h2>

      {/* Empty Cart State */}
      {cartItems.length === 0 ? (
        <div className="bg-white border border-gray-200 rounded-xl p-12 text-center">
          <div className="w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-6">
            <ShoppingCart className="w-12 h-12 text-gray-400" />
          </div>
          <h3 className="text-xl font-semibold text-gray-800 mb-3">Your cart is empty</h3>
          <p className="text-gray-500 mb-6 max-w-md mx-auto">
            Looks like you haven't added any products to your cart yet. Start browsing to add bulk agricultural products!
          </p>
          <button
            onClick={() => navigate("/b2b/dashboard")}
            className="px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors"
          >
            Browse Products
          </button>
        </div>
      ) : (
        <>
          {/* Cart Items */}
          <div className="space-y-4">
            {cartItems.map((item) => (
              <div
                key={item.id}
                className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-xl bg-blue-50 flex items-center justify-center text-2xl">
                      {b2bProducts.find(p => p.id === item.id)?.image}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 text-lg">
                        {item.name}
                      </h3>
                      <p className="text-sm text-gray-500">
                        Farmer: {item.farmer}
                      </p>
                      <p className="text-xs text-gray-400">
                        ₹{item.price}/{item.unit} • Min Order: {item.minOrder} {item.unit}
                      </p>
                    </div>
                  </div>

                  <div className="text-right">
                    <p className="font-bold text-blue-700 text-lg">
                      ₹{item.price * item.quantity}
                    </p>
                    <p className="text-sm text-gray-500">
                      {item.quantity} {item.unit}
                    </p>
                  </div>
                </div>

                {/* Quantity Controls */}
                <div className="flex items-center justify-between bg-gray-50 rounded-lg p-3">
                  <span className="text-sm font-medium text-gray-700">Quantity:</span>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => decreaseQuantity(item.id)}
                      className="w-8 h-8 rounded-full bg-red-100 hover:bg-red-200 text-red-600 flex items-center justify-center transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      disabled={item.quantity <= item.minOrder}
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="w-16 text-center font-semibold text-gray-800">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => increaseQuantity(item.id)}
                      className="w-8 h-8 rounded-full bg-blue-100 hover:bg-blue-200 text-blue-600 flex items-center justify-center transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                    <span className="text-xs text-gray-500 ml-2">
                      Min: {item.minOrder} {item.unit}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Cart Summary */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Order Summary</h3>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-medium">₹{total.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Delivery Charge</span>
                <span className="font-medium">
                  {deliveryCharge === 0 ? (
                    <span className="text-green-600">FREE</span>
                  ) : (
                    `₹${deliveryCharge}`
                  )}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Tax (5%)</span>
                <span className="font-medium">₹{tax}</span>
              </div>
              {total <= 10000 && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 text-xs text-yellow-800">
                  <AlertCircle className="w-4 h-4 inline mr-1" />
                  Add ₹{10001 - total} more for FREE delivery!
                </div>
              )}
              <div className="border-t border-blue-200 pt-3 flex justify-between">
                <span className="text-lg font-bold text-gray-900">Total Amount</span>
                <span className="text-xl font-bold text-blue-700">₹{finalTotal.toLocaleString()}</span>
              </div>
            </div>
          </div>

          <button 
            onClick={handleCheckout}
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white py-4 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg"
          >
            Proceed to Checkout
          </button>
        </>
      )}

      {/* CHECKOUT MODAL */}
      {showCheckout && (
        <div
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setShowCheckout(false)}
        >
          <div
            className="bg-white rounded-2xl w-full max-w-2xl max-h-[85vh] overflow-y-auto shadow-xl border border-gray-100"
            onClick={(e) => e.stopPropagation()}
          >
            
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 text-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                    <CreditCard className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">B2B Checkout</h3>
                    <p className="text-blue-100 text-sm">Complete your bulk order</p>
                  </div>
                </div>
                <button 
                  onClick={() => setShowCheckout(false)}
                  className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center hover:bg-white/30 transition-colors"
                >
                  <span className="text-white text-lg">×</span>
                </button>
              </div>
            </div>
            
            {/* Modal Body */}
            <div className="p-6 space-y-6">
              {orderPlaced ? (
                /* Order Success Screen */
                <div className="text-center py-8">
                  <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="w-10 h-10 text-green-600" />
                  </div>
                  <h3 className="text-xl font-bold text-green-800 mb-2">Order Placed Successfully!</h3>
                  <p className="text-gray-600 mb-4">Your bulk order has been placed and will be processed soon.</p>
                  <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-4 border border-green-200">
                    <p className="text-sm text-gray-600 mb-2">Order Total</p>
                    <p className="text-2xl font-bold text-green-700">₹{finalTotal.toLocaleString()}</p>
                  </div>
                </div>
              ) : (
                /* Checkout Form */
                <>
                  {/* Business Information */}
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 border border-gray-200">
                    <h4 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
                      <User className="w-4 h-4" /> Business Information
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs font-medium text-gray-700 mb-1 block">Business Name *</label>
                        <input
                          type="text"
                          value={deliveryInfo.businessName}
                          onChange={(e) => setDeliveryInfo({...deliveryInfo, businessName: e.target.value})}
                          className="w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none text-sm"
                          placeholder="Your Business Name"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-medium text-gray-700 mb-1 block">Contact Person *</label>
                        <input
                          type="text"
                          value={deliveryInfo.contactPerson}
                          onChange={(e) => setDeliveryInfo({...deliveryInfo, contactPerson: e.target.value})}
                          className="w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none text-sm"
                          placeholder="Contact Person Name"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-medium text-gray-700 mb-1 block">Phone *</label>
                        <input
                          type="tel"
                          value={deliveryInfo.phone}
                          onChange={(e) => setDeliveryInfo({...deliveryInfo, phone: e.target.value})}
                          className="w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none text-sm"
                          placeholder="+91 98765 43210"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-medium text-gray-700 mb-1 block">Email</label>
                        <input
                          type="email"
                          value={deliveryInfo.email}
                          onChange={(e) => setDeliveryInfo({...deliveryInfo, email: e.target.value})}
                          className="w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none text-sm"
                          placeholder="business@email.com"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Delivery Information */}
                  <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-4 border border-gray-200">
                    <h4 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
                      <MapPin className="w-4 h-4" /> Delivery Information
                    </h4>
                    <div className="space-y-3">
                      <div>
                        <label className="text-xs font-medium text-gray-700 mb-1 block">Delivery Address *</label>
                        <textarea
                          value={deliveryInfo.deliveryAddress}
                          onChange={(e) => setDeliveryInfo({...deliveryInfo, deliveryAddress: e.target.value})}
                          className="w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none resize-none h-16 text-sm"
                          placeholder="Complete delivery address"
                        />
                      </div>
                      <div className="grid grid-cols-3 gap-3">
                        <div>
                          <label className="text-xs font-medium text-gray-700 mb-1 block">City</label>
                          <input
                            type="text"
                            value={deliveryInfo.city}
                            onChange={(e) => setDeliveryInfo({...deliveryInfo, city: e.target.value})}
                            className="w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none text-sm"
                            placeholder="City"
                          />
                        </div>
                        <div>
                          <label className="text-xs font-medium text-gray-700 mb-1 block">State</label>
                          <input
                            type="text"
                            value={deliveryInfo.state}
                            onChange={(e) => setDeliveryInfo({...deliveryInfo, state: e.target.value})}
                            className="w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none text-sm"
                            placeholder="State"
                          />
                        </div>
                        <div>
                          <label className="text-xs font-medium text-gray-700 mb-1 block">Pincode</label>
                          <input
                            type="text"
                            value={deliveryInfo.pincode}
                            onChange={(e) => setDeliveryInfo({...deliveryInfo, pincode: e.target.value})}
                            className="w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none text-sm"
                            placeholder="500001"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Order Summary */}
                  <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-4 border border-green-200">
                    <h4 className="text-sm font-bold text-gray-900 mb-3">Order Summary</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Subtotal</span>
                        <span className="font-medium">₹{total.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Delivery</span>
                        <span className="font-medium">
                          {deliveryCharge === 0 ? "FREE" : `₹${deliveryCharge}`}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Tax</span>
                        <span className="font-medium">₹{tax}</span>
                      </div>
                      <div className="border-t border-green-200 pt-2 flex justify-between">
                        <span className="text-lg font-bold text-gray-900">Total</span>
                        <span className="text-xl font-bold text-green-700">₹{finalTotal.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>

                  {/* Place Order Button */}
                  <button 
                    onClick={handlePlaceOrder}
                    className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold hover:opacity-90 transition-opacity shadow-lg"
                  >
                    Place Bulk Order • ₹{finalTotal.toLocaleString()}
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default B2BCart;
