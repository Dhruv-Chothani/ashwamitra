import React, { useState } from "react";
import { Package, MapPin, CreditCard, User, Phone, Mail, Calendar, Truck, X, CheckCircle, AlertCircle, Plus, Minus, ShoppingCart } from "lucide-react";
import WalletCheckoutIntegration from "../../../components/wallet/WalletCheckoutIntegration";
import { WalletUtils } from "../../../utils/walletUtils";

type CartItem = {
  _id: string;
  name: string;
  farmerName?: string;
  village?: string;
  pricePerUnit: number;
  quantity: number;
  unit: string;
  imageUrl?: string;
  quality?: string;
  isOrganic?: boolean;
};

type Product = {
  _id: string;
  name: string;
  farmerName?: string;
  village?: string;
  district?: string;
  state?: string;
  category: string;
  pricePerUnit: number;
  marketPrice?: number;
  availableQuantity: number;
  minimumOrder: number;
  unit: string;
  imageUrl?: string;
  quality?: string;
  isOrganic?: boolean;
};

type CartComponentProps = {
  cart: Map<string, number>;
  products: Product[];
  onUpdateCart?: (cart: Map<string, number>) => void;
};

const CartComponent: React.FC<CartComponentProps> = ({ cart, products, onUpdateCart }) => {
  const [showCheckout, setShowCheckout] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [addSubscription, setAddSubscription] = useState(false);
  const [useWallet, setUseWallet] = useState(false);
  const [walletAmount, setWalletAmount] = useState(0);
  const [deliveryInfo, setDeliveryInfo] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
    landmark: "",
    city: "",
    state: "",
    pincode: "",
    deliveryDate: "",
    deliveryTime: "",
    paymentMethod: "cod",
    subscription: "none" // none, monthly, daily
  });

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

  // Convert cart Map to cart items array
  const cartItems: CartItem[] = Array.from(cart.entries()).map(([productId, quantity]) => {
    const product = products.find(p => p._id === productId);
    if (!product) return null;
    return {
      _id: productId,
      name: product.name,
      farmerName: product.farmerName || "Local Farmer",
      village: product.village,
      pricePerUnit: product.pricePerUnit,
      quantity: quantity,
      unit: product.unit || "kg",
      imageUrl: product.imageUrl,
      quality: product.quality,
      isOrganic: product.isOrganic
    };
  }).filter(Boolean) as CartItem[];

  const total = cartItems.reduce(
    (sum, item) => sum + item.pricePerUnit * item.quantity,
    0
  );

  const deliveryCharge = total > 500 ? 0 : 40;
  const tax = Math.round(total * 0.05); // 5% tax
  const subscriptionDiscount = deliveryInfo.subscription === "monthly" 
    ? Math.round(total * 0.10) 
    : deliveryInfo.subscription === "daily" 
    ? Math.round(total * 0.05) 
    : 0; // 5% discount for daily
  const finalTotal = total + deliveryCharge + tax - subscriptionDiscount;
  
  // Calculate monthly total for daily subscriptions
  const monthlyTotal = deliveryInfo.subscription === "daily" ? finalTotal * 30 : finalTotal; // 30 days in a month
  
  // Calculate remaining amount after wallet deduction
  const remainingAmount = useWallet ? monthlyTotal - walletAmount : monthlyTotal;

  const handleCheckout = () => {
    setShowCheckout(true);
  };

  const handlePlaceOrder = () => {
    // Validate delivery info
    if (!deliveryInfo.name || !deliveryInfo.phone || !deliveryInfo.address) {
      alert("Please fill in all required delivery information");
      return;
    }

    // Create subscription data if subscription is selected
    let subscriptionData = null;
    if (deliveryInfo.subscription !== "none") {
      const today = new Date();
      const startDate = today.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
      const endDate = new Date(today.setMonth(today.getMonth() + 12)).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
      const nextBillingDate = new Date(today.setMonth(today.getMonth() + 1)).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });

      subscriptionData = {
        type: deliveryInfo.subscription,
        status: "active" as const,
        startDate: startDate,
        endDate: endDate,
        nextBillingDate: nextBillingDate,
        discount: deliveryInfo.subscription === "monthly" ? 10 : 5,
        benefits: deliveryInfo.subscription === "monthly" ? [
          "10% discount on all orders",
          "Priority delivery",
          "Free delivery on orders above ₹500",
          "Exclusive seasonal products",
          "Early access to new products"
        ] : [
          "5% discount on all orders",
          "Daily delivery to your home",
          "Free delivery on all orders",
          "Priority customer support",
          "Fresh products every day"
        ],
        deliveryFrequency: deliveryInfo.subscription === "daily" ? "daily" as const : "monthly" as const
      };

      // Handle wallet deduction if wallet is being used
      if (useWallet && walletAmount > 0) {
        const userId = "customer_001"; // In real app, get from auth/context
        const success = WalletUtils.deductMoney(
          userId,
          walletAmount,
          `Order payment - ${cartItems.map(item => item.name).join(", ")}`
        );
        
        if (!success) {
          alert("Failed to deduct wallet amount. Please try again.");
          return;
        }
        
        console.log(`₹${walletAmount} deducted from wallet for order payment`);
      }

      // Emit subscription update event if subscription is selected
      if (subscriptionData) {
        window.dispatchEvent(new CustomEvent('subscriptionUpdate', {
          detail: { subscription: subscriptionData }
        }));
      }

      console.log("Order placed:", {
        items: cartItems,
        deliveryInfo,
        subscriptionData,
        subscriptionDiscount,
        dailyTotal: finalTotal,
        monthlyTotal: monthlyTotal,
        total: monthlyTotal,
        walletUsed: useWallet,
        walletAmount: walletAmount,
        remainingAmount: remainingAmount
      });

    }

    // Clear cart after successful order placement
    if (onUpdateCart) {
      onUpdateCart(new Map());
    }

    setOrderPlaced(true);
    setTimeout(() => {
      setOrderPlaced(false);
      setShowCheckout(false);
      // Reset form
      setDeliveryInfo({
        name: "",
        phone: "",
        email: "",
        address: "",
        landmark: "",
        city: "",
        state: "",
        pincode: "",
        deliveryDate: "",
        deliveryTime: "",
        paymentMethod: "cod",
        subscription: "none"
      });
      // Reset wallet states
      setUseWallet(false);
      setWalletAmount(0);
    }, 3000);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 space-y-5">

      <h2 className="text-xl font-bold text-green-800">
        Shopping Cart
      </h2>

      {/* Empty Cart State */}
      {cartItems.length === 0 ? (
        <div className="bg-white border border-green-100 rounded-xl p-12 text-center">
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center mx-auto mb-6">
            <ShoppingCart className="w-12 h-12 text-gray-400" />
          </div>
          <h3 className="text-xl font-semibold text-gray-800 mb-3">Your cart is empty</h3>
          <p className="text-gray-500 mb-6 max-w-md mx-auto">
            Looks like you haven't added any fresh products to your cart yet. Start shopping to add some delicious items!
          </p>
          <div className="space-y-3">
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-4 border border-green-200">
              <p className="text-sm font-medium text-green-800 mb-2">💡 Quick Tips:</p>
              <ul className="text-sm text-green-700 space-y-1 text-left max-w-xs mx-auto">
                <li>• Browse fresh vegetables and fruits</li>
                <li>• Add quality grains and pulses</li>
                <li>• Support local farmers</li>
                <li>• Get doorstep delivery</li>
              </ul>
            </div>
          </div>
        </div>
      ) : (
        <>
          {cartItems.map((item) => (
            <div
              key={item._id}
              className="bg-white border border-green-100 rounded-xl p-4 hover:shadow-md transition-shadow"
            >
              <div className="flex justify-between items-start mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-100 to-emerald-100 flex items-center justify-center">
                    {item.imageUrl ? (
                      <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover rounded-xl" />
                    ) : (
                      <Package className="w-6 h-6 text-green-600" />
                    )}
                  </div>
                  <div>
                    <p className="font-semibold text-green-800">
                      {item.name}
                    </p>
                    <p className="text-sm text-gray-500">
                      Farmer: {item.farmerName}
                    </p>
                    <p className="text-xs text-gray-400">
                      ₹{item.pricePerUnit}/{item.unit}
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <p className="font-bold text-green-700">
                    ₹{item.pricePerUnit * item.quantity}
                  </p>
                  <p className="text-xs text-gray-500">
                    {item.quantity} {item.unit}
                  </p>
                </div>
              </div>

              {/* Quantity Controls */}
              <div className="flex items-center justify-between bg-gray-50 rounded-lg p-2">
                <span className="text-sm font-medium text-gray-700">Quantity:</span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => decreaseQuantity(item._id)}
                    className="w-8 h-8 rounded-full bg-red-100 hover:bg-red-200 text-red-600 flex items-center justify-center transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={item.quantity <= 1}
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="w-12 text-center font-semibold text-gray-800">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() => increaseQuantity(item._id)}
                    className="w-8 h-8 rounded-full bg-green-100 hover:bg-green-200 text-green-600 flex items-center justify-center transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}

          {/* Cart Summary */}
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-6 border border-green-200">
            <h3 className="text-lg font-bold text-green-800 mb-4">Order Summary</h3>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-medium">₹{total}</span>
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
              {total <= 500 && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 text-xs text-yellow-800">
                  <AlertCircle className="w-4 h-4 inline mr-1" />
                  Add ₹{501 - total} more for FREE delivery!
                </div>
              )}
              <div className="border-t border-green-200 pt-3 flex justify-between">
                <span className="text-lg font-bold text-green-800">Total Amount</span>
                <span className="text-xl font-bold text-green-700">₹{finalTotal}</span>
              </div>
            </div>
          </div>

          <button 
            onClick={handleCheckout}
            className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white py-4 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg"
          >
            Proceed to Checkout
          </button>
        </>
      )}

      {/* CHECKOUT MODAL */}
      {showCheckout && (
        <div
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6"
          onClick={() => setShowCheckout(false)}
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
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                    <CreditCard className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <h3 className="text-base sm:text-lg font-bold">Checkout</h3>
                    <p className="text-green-100 text-xs">Complete your order</p>
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
            
            {/* Scrollable Body */}
            <div className="p-5 sm:p-6 space-y-4 overflow-y-auto">
              {orderPlaced ? (
                /* Order Success Screen */
                <div className="text-center py-8">
                  <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="w-10 h-10 text-green-600" />
                  </div>
                  <h3 className="text-xl font-bold text-green-800 mb-2">Order Placed Successfully!</h3>
                  <p className="text-gray-600 mb-4">Your order has been placed and will be delivered soon.</p>
                  <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-4 border border-green-200">
                    <p className="text-sm text-gray-600 mb-2">Order Total</p>
                    <p className="text-2xl font-bold text-green-700">₹{finalTotal}</p>
                  </div>
                </div>
              ) : (
                /* Checkout Form */
                <>
                  {/* Delivery Information */}
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 border border-gray-200">
                    <h4 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
                      <MapPin className="w-4 h-4" /> Delivery Information
                    </h4>
                    <div className="space-y-3">
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="text-xs font-medium text-gray-700 mb-1 block">Full Name *</label>
                          <input
                            type="text"
                            value={deliveryInfo.name}
                            onChange={(e) => setDeliveryInfo({...deliveryInfo, name: e.target.value})}
                            className="w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500/20 focus:border-green-500 outline-none text-sm"
                            placeholder="John Doe"
                          />
                        </div>
                        <div>
                          <label className="text-xs font-medium text-gray-700 mb-1 block">Phone *</label>
                          <input
                            type="tel"
                            value={deliveryInfo.phone}
                            onChange={(e) => setDeliveryInfo({...deliveryInfo, phone: e.target.value})}
                            className="w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500/20 focus:border-green-500 outline-none text-sm"
                            placeholder="+91 98765 43210"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="text-xs font-medium text-gray-700 mb-1 block">Email</label>
                        <input
                          type="email"
                          value={deliveryInfo.email}
                          onChange={(e) => setDeliveryInfo({...deliveryInfo, email: e.target.value})}
                          className="w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500/20 focus:border-green-500 outline-none text-sm"
                          placeholder="john@example.com"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-medium text-gray-700 mb-1 block">Address *</label>
                        <textarea
                          value={deliveryInfo.address}
                          onChange={(e) => setDeliveryInfo({...deliveryInfo, address: e.target.value})}
                          className="w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500/20 focus:border-green-500 outline-none resize-none h-16 text-sm"
                          placeholder="123 Main Street, Area Name"
                        />
                      </div>
                      <div className="grid grid-cols-3 gap-3">
                        <div>
                          <label className="text-xs font-medium text-gray-700 mb-1 block">City</label>
                          <input
                            type="text"
                            value={deliveryInfo.city}
                            onChange={(e) => setDeliveryInfo({...deliveryInfo, city: e.target.value})}
                            className="w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500/20 focus:border-green-500 outline-none text-sm"
                            placeholder="Hyderabad"
                          />
                        </div>
                        <div>
                          <label className="text-xs font-medium text-gray-700 mb-1 block">State</label>
                          <input
                            type="text"
                            value={deliveryInfo.state}
                            onChange={(e) => setDeliveryInfo({...deliveryInfo, state: e.target.value})}
                            className="w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500/20 focus:border-green-500 outline-none text-sm"
                            placeholder="Telangana"
                          />
                        </div>
                        <div>
                          <label className="text-xs font-medium text-gray-700 mb-1 block">Pincode</label>
                          <input
                            type="text"
                            value={deliveryInfo.pincode}
                            onChange={(e) => setDeliveryInfo({...deliveryInfo, pincode: e.target.value})}
                            className="w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500/20 focus:border-green-500 outline-none text-sm"
                            placeholder="500001"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Delivery Schedule */}
                  <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-4 border border-gray-200">
                    <h4 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
                      <Calendar className="w-4 h-4" /> Delivery Schedule
                    </h4>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs font-medium text-gray-700 mb-1 block">Delivery Date</label>
                        <input
                          type="date"
                          value={deliveryInfo.deliveryDate}
                          onChange={(e) => setDeliveryInfo({...deliveryInfo, deliveryDate: e.target.value})}
                          className="w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500/20 focus:border-green-500 outline-none text-sm"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-medium text-gray-700 mb-1 block">Delivery Time</label>
                        <select
                          value={deliveryInfo.deliveryTime}
                          onChange={(e) => setDeliveryInfo({...deliveryInfo, deliveryTime: e.target.value})}
                          className="w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500/20 focus:border-green-500 outline-none text-sm"
                        >
                          <option value="">Select Time</option>
                          <option value="9am-12pm">9 AM - 12 PM</option>
                          <option value="12pm-3pm">12 PM - 3 PM</option>
                          <option value="3pm-6pm">3 PM - 6 PM</option>
                          <option value="6pm-9pm">6 PM - 9 PM</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Payment Method */}
                  <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl p-4 border border-gray-200">
                    <h4 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
                      <CreditCard className="w-4 h-4" /> Payment Method
                    </h4>
                    <div className="space-y-2">
                      <label className="flex items-center gap-3 p-2 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                        <input
                          type="radio"
                          name="payment"
                          value="cod"
                          checked={deliveryInfo.paymentMethod === "cod"}
                          onChange={(e) => setDeliveryInfo({...deliveryInfo, paymentMethod: e.target.value})}
                          className="text-green-600"
                        />
                        <div className="flex-1">
                          <p className="text-sm font-medium">Cash on Delivery</p>
                          <p className="text-xs text-gray-500">Pay when you receive</p>
                        </div>
                      </label>
                      <label className="flex items-center gap-3 p-2 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                        <input
                          type="radio"
                          name="payment"
                          value="online"
                          checked={deliveryInfo.paymentMethod === "online"}
                          onChange={(e) => setDeliveryInfo({...deliveryInfo, paymentMethod: e.target.value})}
                          className="text-green-600"
                        />
                        <div className="flex-1">
                          <p className="text-sm font-medium">Online Payment</p>
                          <p className="text-xs text-gray-500">Pay now securely</p>
                        </div>
                      </label>
                    </div>
                  </div>

                  {/* Subscription Option */}
                  <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-4 border border-purple-200">
                    <h4 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
                      <Package className="w-4 h-4 text-purple-600" /> Subscription (Optional)
                    </h4>
                    <div className="space-y-3">
                      <label className="flex items-center gap-3 p-2 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                        <input
                          type="radio"
                          name="subscription"
                          value="none"
                          checked={deliveryInfo.subscription === "none"}
                          onChange={(e) => setDeliveryInfo({...deliveryInfo, subscription: e.target.value})}
                          className="text-purple-600"
                        />
                        <div className="flex-1">
                          <p className="text-sm font-medium">No Subscription</p>
                          <p className="text-xs text-gray-500">One-time purchase only</p>
                        </div>
                      </label>
                      <label className="flex items-center gap-3 p-2 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                        <input
                          type="radio"
                          name="subscription"
                          value="daily"
                          checked={deliveryInfo.subscription === "daily"}
                          onChange={(e) => setDeliveryInfo({...deliveryInfo, subscription: e.target.value})}
                          className="text-purple-600"
                        />
                        <div className="flex-1">
                          <p className="text-sm font-medium">Daily Subscription</p>
                          <p className="text-xs text-gray-500">Daily delivery to your home</p>
                        </div>
                      </label>
                      {deliveryInfo.subscription === "daily" && (
                        <div className="bg-purple-100 rounded-lg p-3 border border-purple-200">
                          <p className="text-xs font-medium text-purple-800 mb-1">Daily Benefits:</p>
                          <ul className="text-xs text-purple-700 space-y-1">
                            <li>• 5% discount on all orders</li>
                            <li>• Daily delivery to your home</li>
                            <li>• Free delivery on all orders</li>
                            <li>• Priority customer support</li>
                            <li>• Fresh products every day</li>
                          </ul>
                        </div>
                      )}
                      {deliveryInfo.subscription === "daily" && (
                        <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl p-4 border border-blue-200">
                          <h4 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
                            <CreditCard className="w-4 h-4 text-blue-600" /> Daily Payment Method
                          </h4>
                          <div className="space-y-3">
                            <label className="flex items-center gap-3 p-2 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                              <input
                                type="radio"
                                name="dailyPaymentMethod"
                                value="cod"
                                checked={deliveryInfo.paymentMethod === "cod"}
                                onChange={(e) => setDeliveryInfo({...deliveryInfo, paymentMethod: e.target.value})}
                                className="text-blue-600"
                              />
                              <div className="flex-1">
                                <p className="text-sm font-medium">Cash on Delivery (COD)</p>
                                <p className="text-xs text-gray-500">Pay when you receive daily delivery</p>
                              </div>
                            </label>
                            <label className="flex items-center gap-3 p-2 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                              <input
                                type="radio"
                                name="dailyPaymentMethod"
                                value="card"
                                checked={deliveryInfo.paymentMethod === "card"}
                                onChange={(e) => setDeliveryInfo({...deliveryInfo, paymentMethod: e.target.value})}
                                className="text-blue-600"
                              />
                              <div className="flex-1">
                                <p className="text-sm font-medium">Card Payment</p>
                                <p className="text-xs text-gray-500">Auto-billed monthly for daily orders</p>
                              </div>
                            </label>
                            <div className="bg-blue-100 rounded-lg p-3 border border-blue-200">
                              <p className="text-xs font-medium text-blue-800 mb-1">Daily Payment Info:</p>
                              <ul className="text-xs text-blue-700 space-y-1">
                                <li>• COD: Pay cash to delivery person daily</li>
                                <li>• Card: Auto-billed monthly for all daily orders</li>
                                <li>• Free delivery for all daily subscribers</li>
                                <li>• Invoice provided for card payments</li>
                              </ul>
                            </div>
                          </div>
                        </div>
                      )}
                      <label className="flex items-center gap-3 p-2 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                        <input
                          type="radio"
                          name="subscription"
                          value="monthly"
                          checked={deliveryInfo.subscription === "monthly"}
                          onChange={(e) => setDeliveryInfo({...deliveryInfo, subscription: e.target.value})}
                          className="text-purple-600"
                        />
                        <div className="flex-1">
                          <p className="text-sm font-medium">Monthly Subscription</p>
                          <p className="text-xs text-gray-500">Get fresh products every month</p>
                        </div>
                      </label>
                      {deliveryInfo.subscription === "monthly" && (
                        <div className="bg-purple-100 rounded-lg p-3 border border-purple-200">
                          <p className="text-xs font-medium text-purple-800 mb-1">Monthly Benefits:</p>
                          <ul className="text-xs text-purple-700 space-y-1">
                            <li>• 10% discount on all orders</li>
                            <li>• Priority delivery</li>
                            <li>• Free delivery on orders above ₹500</li>
                            <li>• Exclusive seasonal products</li>
                            <li>• Early access to new products</li>
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Wallet Integration */}
                  <WalletCheckoutIntegration
                    userId="customer_001"
                    orderTotal={monthlyTotal}
                    onWalletAmountChange={setWalletAmount}
                    onUseWalletChange={setUseWallet}
                  />

                  {/* Order Summary */}
                  <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-4 border border-green-200">
                    <h4 className="text-sm font-bold text-gray-900 mb-3">Order Summary</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Subtotal</span>
                        <span className="font-medium">₹{total}</span>
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
                      {subscriptionDiscount > 0 && (
                        <div className="flex justify-between text-sm">
                          <span className="text-purple-600">
                            {deliveryInfo.subscription === "monthly" ? "Subscription Discount (10%)" : "Subscription Discount (5%)"}
                          </span>
                          <span className="font-medium text-purple-600">-₹{subscriptionDiscount}</span>
                        </div>
                      )}
                      {useWallet && walletAmount > 0 && (
                        <div className="flex justify-between text-sm">
                          <span className="text-green-600">Wallet Deduction</span>
                          <span className="font-medium text-green-600">-₹{walletAmount}</span>
                        </div>
                      )}
                      <div className="border-t border-green-200 pt-2 flex justify-between">
                        <div>
                          <span className="text-lg font-bold text-green-800">
                            {deliveryInfo.subscription === "daily" ? "Monthly Total (30 days)" : "Total"}
                          </span>
                          {deliveryInfo.subscription === "daily" && (
                            <p className="text-xs text-gray-500">Daily: ₹{finalTotal} × 30 days</p>
                          )}
                          {useWallet && walletAmount > 0 && (
                            <p className="text-xs text-green-600">Wallet: ₹{walletAmount} applied</p>
                          )}
                        </div>
                        <div className="text-right">
                          <span className="text-xl font-bold text-green-700">₹{monthlyTotal}</span>
                          {useWallet && walletAmount > 0 && (
                            <p className="text-xs text-green-600">Pay: ₹{remainingAmount}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Place Order Button */}
                  <button 
                    onClick={handlePlaceOrder}
                    className="w-full py-3 rounded-xl bg-gradient-to-r from-green-600 to-emerald-600 text-white font-bold hover:opacity-90 transition-opacity shadow-lg"
                  >
                    Place Order • ₹{useWallet && walletAmount > 0 ? remainingAmount : monthlyTotal}
                    {useWallet && walletAmount > 0 && remainingAmount === 0 && " (Paid with Wallet)"}
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

export default CartComponent;