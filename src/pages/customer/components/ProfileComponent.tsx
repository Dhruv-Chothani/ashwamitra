import React, { useState, useEffect } from "react";
import { User, Phone, Mail, MapPin, Edit3, Save, Camera, Shield, Award, ShoppingBag, Package, Star, ChevronRight, Settings, LogOut, Home, CreditCard, HelpCircle, Plus, Trash2, Eye, EyeOff, Calendar, Clock, CheckCircle, X, AlertCircle, Wallet } from "lucide-react";
import WalletComponent from "../../../components/wallet/WalletComponent";

type Address = {
  street: string;
  city: string;
  state: string;
  pincode: string;
};

type PaymentMethod = {
  id: string;
  type: "card" | "upi" | "netbanking";
  name: string;
  last4?: string;
  cardNumber?: string;
  upiId?: string;
  bankName?: string;
  isDefault: boolean;
  expiryDate?: string;
};

type Order = {
  id: string;
  product: string;
  farmer: string;
  quantity: string;
  price: number;
  status: "Delivered" | "Pending" | "Cancelled" | "Processing";
  date: string;
  address: string;
  image: string;
  trackingId?: string;
  estimatedDelivery?: string;
};

type UserProfile = {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: Address;
  avatar?: string;
  memberSince: string;
  totalOrders: number;
  totalSpent: number;
  loyaltyPoints: number;
  membershipTier: "Silver" | "Gold" | "Platinum";
  subscription?: {
    type: "monthly" | "daily" | "none";
    status: "active" | "cancelled" | "expired";
    startDate: string;
    endDate: string;
    nextBillingDate: string;
    discount: number;
    benefits: string[];
    deliveryFrequency?: "daily" | "monthly";
  };
};

/* ========================= */
/* MOCK API DATA             */
/* ========================= */

const mockUser: UserProfile = {
  id: "USR001",
  name: "Abhijeet Kumar",
  email: "abhijeet@email.com",
  phone: "+91 9876543210",
  address: {
    street: "Banjara Hills Road 12",
    city: "Hyderabad",
    state: "Telangana",
    pincode: "500034",
  },
  avatar: "👨‍🌾",
  memberSince: "Jan 2024",
  totalOrders: 47,
  totalSpent: 15420,
  loyaltyPoints: 1250,
  membershipTier: "Gold",
  subscription: {
    type: "daily",
    status: "active",
    startDate: "Jan 15, 2024",
    endDate: "Dec 15, 2024",
    nextBillingDate: "Feb 15, 2024",
    discount: 5,
    benefits: [
      "5% discount on all orders",
      "Daily delivery to your home",
      "Free delivery on all orders",
      "Priority customer support",
      "Fresh products every day"
    ],
    deliveryFrequency: "daily"
  }
};

const mockOrders: Order[] = [
  {
    id: "ORD001",
    product: "Fresh Tomatoes",
    farmer: "Ramesh Kumar",
    quantity: "5 kg",
    price: 175,
    status: "Delivered",
    date: "20 Jan 2026",
    address: "Hyderabad, Telangana",
    image: "🍅",
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
    status: "Processing",
    date: "24 Jan 2026",
    address: "Hyderabad, Telangana",
    image: "🌿",
    trackingId: "TRK123456791"
  },
  {
    id: "ORD004",
    product: "Fresh Potatoes",
    farmer: "Mohan Singh",
    quantity: "8 kg",
    price: 240,
    status: "Cancelled",
    date: "18 Jan 2026",
    address: "Hyderabad, Telangana",
    image: "🥔"
  },
  {
    id: "ORD005",
    product: "Green Chilies",
    farmer: "Priya Sharma",
    quantity: "2 kg",
    price: 160,
    status: "Delivered",
    date: "15 Jan 2026",
    address: "Hyderabad, Telangana",
    image: "🌶️",
    trackingId: "TRK123456792"
  }
];

const mockPaymentMethods: PaymentMethod[] = [
  {
    id: "PM001",
    type: "card",
    name: "HDFC Credit Card",
    cardNumber: "**** **** **** 1234",
    last4: "1234",
    expiryDate: "12/25",
    isDefault: true
  },
  {
    id: "PM002",
    type: "upi",
    name: "Google Pay UPI",
    upiId: "abhijeet@okhdfcbank",
    isDefault: false
  },
  {
    id: "PM003",
    type: "netbanking",
    name: "ICICI Net Banking",
    bankName: "ICICI Bank",
    isDefault: false
  }
];

const ProfileComponent: React.FC = () => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showAddPayment, setShowAddPayment] = useState(false);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>(mockPaymentMethods);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const [cancellingSubscription, setCancellingSubscription] = useState(false);
  const [showManageOptions, setShowManageOptions] = useState(false);
  
  // Listen for subscription updates from checkout
  useEffect(() => {
    // This would normally come from backend or context
    // For now, we'll simulate subscription updates
    const handleSubscriptionUpdate = (event: CustomEvent) => {
      const { subscription } = event.detail;
      if (user && subscription) {
        setUser({
          ...user,
          subscription: subscription
        });
      }
    };

    window.addEventListener('subscriptionUpdate', handleSubscriptionUpdate as EventListener);
    return () => {
      window.removeEventListener('subscriptionUpdate', handleSubscriptionUpdate as EventListener);
    };
  }, [user]);

  const [newPayment, setNewPayment] = useState<{
    type: "card" | "upi" | "netbanking";
    name: string;
    cardNumber: string;
    last4: string;
    expiryDate: string;
    isDefault: boolean;
    upiId?: string;
    bankName?: string;
  }>({
    type: "card",
    name: "",
    cardNumber: "",
    last4: "",
    expiryDate: "",
    isDefault: false
  });

  useEffect(() => {
    const fetchUser = async () => {
      setTimeout(() => {
        setUser(mockUser);
        setLoading(false);
      }, 500);
    };
    fetchUser();
  }, []);

  const handleChange = (field: string, value: string) => {
    if (!user) return;

    if (field in user.address) {
      setUser({
        ...user,
        address: {
          ...user.address,
          [field]: value,
        },
      });
    } else {
      setUser({
        ...user,
        [field]: value,
      });
    }
  };

  const handleSave = async () => {
    setEditing(false);
    console.log("Updated User Data:", user);
  };

  // Subscription handlers
  const handleCancelSubscription = async () => {
    if (!user?.subscription) return;
    
    setCancellingSubscription(true);
    
    try {
      // Simulate API call to cancel subscription
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Update subscription status to cancelled
      const updatedSubscription = {
        ...user.subscription,
        status: "cancelled" as const
      };
      
      setUser({
        ...user,
        subscription: updatedSubscription
      });
      
      // Emit subscription update event
      window.dispatchEvent(new CustomEvent('subscriptionUpdate', {
        detail: { subscription: updatedSubscription }
      }));
      
      setShowCancelConfirm(false);
      console.log("Subscription cancelled:", updatedSubscription);
    } catch (error) {
      console.error("Error cancelling subscription:", error);
    } finally {
      setCancellingSubscription(false);
    }
  };

  // Manage subscription handlers
  const handleChangeSubscriptionType = async () => {
    if (!user?.subscription) return;
    
    try {
      // Simulate API call to change subscription type
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newType = user.subscription.type === "daily" ? "monthly" : "daily";
      const newDiscount = newType === "daily" ? 5 : 10;
      const newBenefits = newType === "daily" ? [
        "5% discount on all orders",
        "Daily delivery to your home",
        "Free delivery on all orders",
        "Priority customer support",
        "Fresh products every day"
      ] : [
        "10% discount on all orders",
        "Priority delivery",
        "Free delivery on orders above ₹500",
        "Exclusive seasonal products",
        "Early access to new products"
      ];

      const updatedSubscription = {
        ...user.subscription,
        type: newType as "daily" | "monthly",
        discount: newDiscount,
        benefits: newBenefits,
        deliveryFrequency: newType === "daily" ? "daily" as const : "monthly" as const
      };
      
      setUser({
        ...user,
        subscription: updatedSubscription
      });
      
      // Emit subscription update event
      window.dispatchEvent(new CustomEvent('subscriptionUpdate', {
        detail: { subscription: updatedSubscription }
      }));
      
      setShowManageOptions(false);
      console.log("Subscription type changed:", updatedSubscription);
      alert(`Successfully changed to ${newType} subscription!`);
    } catch (error) {
      console.error("Error changing subscription type:", error);
      alert("Failed to change subscription type. Please try again.");
    }
  };

  const handleUpdateDeliverySchedule = () => {
    setShowManageOptions(false);
    alert("Delivery schedule update feature coming soon! You'll be able to change delivery time and frequency.");
  };

  const handleUpdatePaymentMethod = () => {
    setShowManageOptions(false);
    alert("Payment method update feature coming soon! You'll be able to switch between COD and Card payment.");
  };

  const handlePauseSubscription = () => {
    setShowManageOptions(false);
    alert("Pause subscription feature coming soon! You'll be able to temporarily pause your subscription.");
  };

  const handleViewSubscriptionHistory = () => {
    setShowManageOptions(false);
    alert("Subscription history feature coming soon! You'll be able to view past orders and billing history.");
  };

  // Payment handlers
  const handleAddPayment = () => {
    if (newPayment.name && newPayment.cardNumber) {
      const payment: PaymentMethod = {
        id: `PM${Date.now()}`,
        type: newPayment.type,
        name: newPayment.name,
        cardNumber: `**** **** **** ${newPayment.cardNumber.slice(-4)}`,
        last4: newPayment.cardNumber.slice(-4),
        expiryDate: newPayment.expiryDate,
        isDefault: newPayment.isDefault
      };
      setPaymentMethods([...paymentMethods, payment]);
      setNewPayment({
        type: "card",
        name: "",
        cardNumber: "",
        last4: "",
        expiryDate: "",
        isDefault: false
      });
      setShowAddPayment(false);
      alert("Payment method added successfully!");
    }
  };

  const handleDeletePayment = (id: string) => {
    setPaymentMethods(paymentMethods.filter(pm => pm.id !== id));
    alert("Payment method removed!");
  };

  const handleSetDefaultPayment = (id: string) => {
    setPaymentMethods(paymentMethods.map(pm => 
      pm.id === id ? { ...pm, isDefault: true } : { ...pm, isDefault: false }
    ));
    alert("Default payment method updated!");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center mb-4">
            <User className="w-8 h-8 text-white" />
          </div>
          <p className="text-lg font-semibold text-gray-700">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  const getTierColor = (tier: string) => {
    switch(tier) {
      case "Platinum": return "from-purple-500 to-purple-700";
      case "Gold": return "from-yellow-500 to-amber-600";
      case "Silver": return "from-gray-400 to-gray-600";
      default: return "from-gray-400 to-gray-600";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900">My Profile</h1>
            <div className="flex items-center gap-3">
              <button className="p-2 rounded-xl hover:bg-gray-100 transition-colors">
                <HelpCircle className="w-5 h-5 text-gray-600" />
              </button>
              <button className="p-2 rounded-xl hover:bg-gray-100 transition-colors">
                <Settings className="w-5 h-5 text-gray-600" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-6">
        {/* Profile Header Card */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 mb-6 overflow-hidden">
          <div className="bg-gradient-to-r from-green-600 to-emerald-600 p-6">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="w-20 h-20 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                  <span className="text-4xl">{user.avatar}</span>
                </div>
                <button className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-lg">
                  <Camera className="w-4 h-4 text-gray-600" />
                </button>
              </div>
              <div className="flex-1 text-white">
                <h2 className="text-2xl font-bold mb-1">{user.name}</h2>
                <div className="flex items-center gap-4 text-sm text-green-100">
                  <span className="flex items-center gap-1">
                    <Shield className="w-4 h-4" />
                    {user.membershipTier} Member
                  </span>
                  <span>•</span>
                  <span>Since {user.memberSince}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 mb-6 p-2">
          <div className="flex gap-2">
            {[
              { id: "overview", label: "Overview", icon: User },
              { id: "personal", label: "Personal Info", icon: Edit3 },
              { id: "address", label: "Address", icon: MapPin },
              { id: "orders", label: "Orders", icon: Package },
              { id: "subscription", label: "Subscription", icon: Award },
              { id: "wallet", label: "Wallet", icon: Wallet },
              { id: "payment", label: "Payment", icon: CreditCard },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-3 rounded-xl font-medium transition-all ${
                  activeTab === tab.id
                    ? "bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-md"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                <tab.icon className="w-4 h-4" />
                <span className="text-sm">{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
          {activeTab === "overview" && (
            <div className="space-y-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Account Overview</h3>
              
              {/* Stats Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-100">
                  <div className="flex items-center justify-between mb-2">
                    <ShoppingBag className="w-5 h-5 text-blue-600" />
                    <span className="text-2xl font-bold text-blue-700">{user.totalOrders}</span>
                  </div>
                  <p className="text-sm text-gray-600">Total Orders</p>
                </div>
                
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-4 border border-green-100">
                  <div className="flex items-center justify-between mb-2">
                    <Award className="w-5 h-5 text-green-600" />
                    <span className="text-2xl font-bold text-green-700">{user.loyaltyPoints}</span>
                  </div>
                  <p className="text-sm text-gray-600">Loyalty Points</p>
                </div>
                
                <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-4 border border-purple-100">
                  <div className="flex items-center justify-between mb-2">
                    <Star className="w-5 h-5 text-purple-600" />
                    <span className={`text-lg font-bold px-3 py-1 rounded-full ${getTierColor(user.membershipTier)} text-white`}>
                      {user.membershipTier}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">Membership Tier</p>
                </div>
                
                <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-xl p-4 border border-yellow-100">
                  <div className="flex items-center justify-between mb-2">
                    <Package className="w-5 h-5 text-yellow-600" />
                    <span className="text-2xl font-bold text-yellow-700">₹{user.totalSpent.toLocaleString()}</span>
                  </div>
                  <p className="text-sm text-gray-600">Total Spent</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === "personal" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-gray-900">Personal Information</h3>
                <button
                  onClick={() => setEditing(!editing)}
                  className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl hover:opacity-90 transition-opacity"
                >
                  {editing ? <Save className="w-4 h-4" /> : <Edit3 className="w-4 h-4" />}
                  {editing ? "Save" : "Edit"}
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                    {editing ? (
                      <input
                        type="text"
                        value={user.name}
                        onChange={(e) => handleChange("name", e.target.value)}
                        className="w-full p-3 border border-gray-200 rounded-xl focus:ring-4 focus:ring-green-500/20 focus:border-green-500 outline-none"
                      />
                    ) : (
                      <div className="p-3 bg-gray-50 rounded-xl">
                        <p className="font-medium text-gray-900">{user.name}</p>
                      </div>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                    {editing ? (
                      <input
                        type="email"
                        value={user.email}
                        onChange={(e) => handleChange("email", e.target.value)}
                        className="w-full p-3 border border-gray-200 rounded-xl focus:ring-4 focus:ring-green-500/20 focus:border-green-500 outline-none"
                      />
                    ) : (
                      <div className="p-3 bg-gray-50 rounded-xl">
                        <p className="font-medium text-gray-900">{user.email}</p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                    {editing ? (
                      <input
                        type="tel"
                        value={user.phone}
                        onChange={(e) => handleChange("phone", e.target.value)}
                        className="w-full p-3 border border-gray-200 rounded-xl focus:ring-4 focus:ring-green-500/20 focus:border-green-500 outline-none"
                      />
                    ) : (
                      <div className="p-3 bg-gray-50 rounded-xl">
                        <p className="font-medium text-gray-900">{user.phone}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {editing && (
                <button
                  onClick={handleSave}
                  className="w-full py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl font-semibold hover:opacity-90 transition-opacity"
                >
                  Save Changes
                </button>
              )}
            </div>
          )}

          {activeTab === "address" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-gray-900">Delivery Address</h3>
                <button
                  onClick={() => setEditing(!editing)}
                  className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl hover:opacity-90 transition-opacity"
                >
                  {editing ? <Save className="w-4 h-4" /> : <Edit3 className="w-4 h-4" />}
                  {editing ? "Save" : "Edit"}
                </button>
              </div>

              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-100">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Street Address</label>
                    {editing ? (
                      <textarea
                        value={user.address.street}
                        onChange={(e) => handleChange("street", e.target.value)}
                        className="w-full p-3 border border-gray-200 rounded-xl focus:ring-4 focus:ring-green-500/20 focus:border-green-500 outline-none resize-none h-20"
                      />
                    ) : (
                      <p className="font-medium text-gray-900">{user.address.street}</p>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
                      {editing ? (
                        <input
                          type="text"
                          value={user.address.city}
                          onChange={(e) => handleChange("city", e.target.value)}
                          className="w-full p-3 border border-gray-200 rounded-xl focus:ring-4 focus:ring-green-500/20 focus:border-green-500 outline-none"
                        />
                      ) : (
                        <p className="font-medium text-gray-900">{user.address.city}</p>
                      )}
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">State</label>
                      {editing ? (
                        <input
                          type="text"
                          value={user.address.state}
                          onChange={(e) => handleChange("state", e.target.value)}
                          className="w-full p-3 border border-gray-200 rounded-xl focus:ring-4 focus:ring-green-500/20 focus:border-green-500 outline-none"
                        />
                      ) : (
                        <p className="font-medium text-gray-900">{user.address.state}</p>
                      )}
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Pincode</label>
                      {editing ? (
                        <input
                          type="text"
                          value={user.address.pincode}
                          onChange={(e) => handleChange("pincode", e.target.value)}
                          className="w-full p-3 border border-gray-200 rounded-xl focus:ring-4 focus:ring-green-500/20 focus:border-green-500 outline-none"
                        />
                      ) : (
                        <p className="font-medium text-gray-900">{user.address.pincode}</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {editing && (
                <button
                  onClick={handleSave}
                  className="w-full py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl font-semibold hover:opacity-90 transition-opacity"
                >
                  Save Address
                </button>
              )}
            </div>
          )}

          {activeTab === "orders" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-gray-900">Order History</h3>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600">{mockOrders.length} orders</span>
                  <select className="text-sm border border-gray-200 rounded-lg px-3 py-1 focus:ring-2 focus:ring-green-500/20 focus:border-green-500 outline-none">
                    <option value="all">All Orders</option>
                    <option value="delivered">Delivered</option>
                    <option value="pending">Pending</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
              </div>

              {/* Orders List */}
              <div className="space-y-4">
                {mockOrders.map((order) => (
                  <div
                    key={order.id}
                    onClick={() => setSelectedOrder(order)}
                    className="bg-white rounded-xl border border-gray-200 p-4 hover:shadow-md transition-all cursor-pointer hover:border-green-300"
                  >
                    <div className="flex items-center gap-4">
                      <div className="text-3xl">{order.image}</div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-bold text-gray-900">{order.product}</h4>
                          <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                            order.status === "Delivered" ? "bg-green-100 text-green-700" :
                            order.status === "Pending" ? "bg-yellow-100 text-yellow-700" :
                            order.status === "Processing" ? "bg-blue-100 text-blue-700" :
                            "bg-red-100 text-red-600"
                          }`}>
                            {order.status}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600">₹{order.price}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-gray-500">{order.date}</p>
                        <ChevronRight className="w-4 h-4 text-gray-400" />
                      </div>
                    </div>
                    <div className="mt-3 pt-3 border-t border-gray-100">
                      <div className="flex items-center justify-between text-sm">
                        <div>
                          <p className="text-gray-600">Quantity: <span className="font-bold text-gray-900">{order.quantity}</span></p>
                          <p className="text-gray-600">Farmer: <span className="font-bold text-gray-900">{order.farmer}</span></p>
                        </div>
                        {order.trackingId && (
                          <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                            Track: {order.trackingId}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Order Details Modal */}
              {selectedOrder && (
                <div
                  className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
                  onClick={() => setSelectedOrder(null)}
                >
                  <div
                    className="bg-white rounded-2xl w-full max-w-2xl max-h-[80vh] overflow-y-auto shadow-xl border border-gray-100"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="p-6">
                      <div className="flex items-center justify-between mb-6">
                        <h3 className="text-xl font-bold text-gray-900">Order Details</h3>
                        <button
                          onClick={() => setSelectedOrder(null)}
                          className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors"
                        >
                          <X className="w-4 h-4 text-gray-600" />
                        </button>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                          <h4 className="text-sm font-bold text-gray-900 mb-3">Order Information</h4>
                          <div className="space-y-3">
                            <div className="flex justify-between">
                              <span className="text-sm text-gray-600">Order ID:</span>
                              <span className="text-sm font-bold text-gray-900">{selectedOrder.id}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-sm text-gray-600">Product:</span>
                              <span className="text-sm font-bold text-gray-900">{selectedOrder.product}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-sm text-gray-600">Quantity:</span>
                              <span className="text-sm font-bold text-gray-900">{selectedOrder.quantity}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-sm text-gray-600">Price:</span>
                              <span className="text-sm font-bold text-gray-900">₹{selectedOrder.price}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-sm text-gray-600">Status:</span>
                              <span className={`text-sm font-bold ${
                                selectedOrder.status === "Delivered" ? "text-green-600" :
                                selectedOrder.status === "Pending" ? "text-yellow-600" :
                                selectedOrder.status === "Processing" ? "text-blue-600" :
                                "text-red-600"
                              }`}>{selectedOrder.status}</span>
                            </div>
                          </div>
                        </div>

                        <div className="space-y-4">
                          <h4 className="text-sm font-bold text-gray-900 mb-3">Delivery Information</h4>
                          <div className="space-y-3">
                            <div className="flex justify-between">
                              <span className="text-sm text-gray-600">Delivery Address:</span>
                              <span className="text-sm font-bold text-gray-900">{selectedOrder.address}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-sm text-gray-600">Order Date:</span>
                              <span className="text-sm font-bold text-gray-900">{selectedOrder.date}</span>
                            </div>
                            {selectedOrder.estimatedDelivery && (
                              <div className="flex justify-between">
                                <span className="text-sm text-gray-600">Est. Delivery:</span>
                                <span className="text-sm font-bold text-gray-900">{selectedOrder.estimatedDelivery}</span>
                              </div>
                            )}
                            {selectedOrder.trackingId && (
                              <div className="flex justify-between">
                                <span className="text-sm text-gray-600">Tracking ID:</span>
                                <span className="text-sm font-bold text-blue-600">{selectedOrder.trackingId}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === "subscription" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-gray-900">Subscription Management</h3>
                {user.subscription?.status === "active" && (
                  <button 
                    onClick={() => setShowCancelConfirm(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-colors"
                  >
                    <X className="w-4 h-4" />
                    Cancel Subscription
                  </button>
                )}
              </div>

              {user.subscription && user.subscription.type !== "none" && user.subscription.status === "active" ? (
                <div className={`rounded-xl p-6 border ${
                  user.subscription.type === "daily" 
                    ? "bg-gradient-to-r from-blue-50 to-cyan-50 border-blue-200"
                    : "bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200"
                }`}>
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h4 className={`text-lg font-bold ${
                        user.subscription.type === "daily" ? "text-blue-900" : "text-purple-900"
                      }`}>
                        {user.subscription.type === "daily" ? "Daily Subscription" : "Monthly Subscription"}
                      </h4>
                      <p className={`text-sm ${
                        user.subscription.type === "daily" ? "text-blue-600" : "text-purple-600"
                      }`}>
                        Active since {user.subscription.startDate}
                      </p>
                    </div>
                    <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                      Active
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6 mb-6">
                    <div>
                      <h5 className="font-semibold text-gray-900 mb-3">Subscription Details</h5>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Type:</span>
                          <span className="font-medium">
                            {user.subscription.type === "daily" ? "Daily" : "Monthly"}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Discount:</span>
                          <span className="font-medium text-green-600">{user.subscription.discount}% off</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Start Date:</span>
                          <span className="font-medium">{user.subscription.startDate}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">End Date:</span>
                          <span className="font-medium">{user.subscription.endDate}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Next Billing:</span>
                          <span className={`font-medium ${
                            user.subscription.type === "daily" ? "text-blue-600" : "text-purple-600"
                          }`}>
                            {user.subscription.nextBillingDate}
                          </span>
                        </div>
                        {user.subscription.type === "daily" && (
                          <div className="flex justify-between">
                            <span className="text-gray-600">Delivery:</span>
                            <span className="font-medium">Daily to your home</span>
                          </div>
                        )}
                        <div className="flex justify-between">
                          <span className="text-gray-600">Payment Method:</span>
                          <span className="font-medium">
                            {user.subscription.type === "daily" ? "COD or Card" : "Card or COD"}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h5 className="font-semibold text-gray-900 mb-3">Subscription Benefits</h5>
                      <div className="space-y-2">
                        {user.subscription.benefits.map((benefit, index) => (
                          <div key={index} className="flex items-center gap-2 text-sm">
                            <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                            <span className="text-gray-700">{benefit}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className={`border-t pt-4 ${
                    user.subscription.type === "daily" ? "border-blue-200" : "border-purple-200"
                  }`}>
                    <div className="flex items-center justify-between mb-4">
                      <h5 className="font-semibold text-gray-900">Quick Actions</h5>
                    </div>
                    <div className="flex gap-3">
                      <button 
                        onClick={() => setShowManageOptions(true)}
                        className={`flex-1 px-4 py-2 text-white rounded-lg transition-colors ${
                          user.subscription.type === "daily" 
                            ? "bg-blue-600 hover:bg-blue-700" 
                            : "bg-purple-600 hover:bg-purple-700"
                        }`}
                      >
                        <Settings className="w-4 h-4 mr-2" />
                        Manage Subscription
                      </button>
                      <button className={`flex-1 px-4 py-2 border rounded-lg transition-colors ${
                        user.subscription.type === "daily"
                          ? "border-blue-300 text-blue-600 hover:bg-blue-50"
                          : "border-purple-300 text-purple-600 hover:bg-purple-50"
                      }`}>
                        <HelpCircle className="w-4 h-4 mr-2" />
                        Get Support
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-gray-50 rounded-xl p-6 border border-gray-200 text-center">
                  <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Award className="w-8 h-8 text-gray-400" />
                  </div>
                  <h4 className="text-lg font-bold text-gray-900 mb-2">No Active Subscription</h4>
                  <p className="text-gray-600 mb-6">Subscribe to get exclusive benefits and discounts on your orders</p>
                  <button className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl hover:opacity-90 transition-opacity">
                    <Plus className="w-4 h-4 mr-2" />
                    Subscribe Now
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Cancel Subscription Confirmation Dialog */}
          {showCancelConfirm && (
            <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
              <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-2xl">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-gray-900">Cancel Subscription</h3>
                  <button 
                    onClick={() => setShowCancelConfirm(false)}
                    className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors"
                  >
                    <X className="w-4 h-4 text-gray-600" />
                  </button>
                </div>

                <div className="mb-6">
                  <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <AlertCircle className="w-8 h-8 text-red-600" />
                  </div>
                  
                  <h4 className="text-center font-semibold text-gray-900 mb-2">
                    Cancel {user.subscription?.type === "daily" ? "Daily" : "Monthly"} Subscription?
                  </h4>
                  
                  <p className="text-center text-gray-600 text-sm mb-4">
                    Are you sure you want to cancel your {user.subscription?.type === "daily" ? "daily" : "monthly"} subscription? 
                    You will lose access to all subscription benefits.
                  </p>

                  <div className="bg-gray-50 rounded-lg p-3 mb-4">
                    <p className="text-xs font-medium text-gray-700 mb-2">What you'll lose:</p>
                    <ul className="text-xs text-gray-600 space-y-1">
                      <li>• {user.subscription?.discount}% discount on all orders</li>
                      <li>• {user.subscription?.type === "daily" ? "Daily delivery to your home" : "Priority delivery"}</li>
                      <li>• {user.subscription?.type === "daily" ? "Free delivery on all orders" : "Free delivery on orders above ₹500"}</li>
                      <li>• {user.subscription?.type === "daily" ? "Priority customer support" : "Exclusive seasonal products"}</li>
                    </ul>
                  </div>

                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                    <p className="text-xs text-yellow-800">
                      <strong>Note:</strong> You can always subscribe again later, but you'll lose any current benefits.
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button 
                    onClick={() => setShowCancelConfirm(false)}
                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Keep Subscription
                  </button>
                  <button 
                    onClick={handleCancelSubscription}
                    disabled={cancellingSubscription}
                    className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {cancellingSubscription ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                        Cancelling...
                      </>
                    ) : (
                      "Yes, Cancel"
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Manage Subscription Options Modal */}
          {showManageOptions && (
            <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
              <div className="bg-white rounded-xl w-full max-w-sm p-4 shadow-xl">
                {/* Header */}
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-semibold text-gray-900">
                    Manage Subscription
                  </h3>
                  <button 
                    onClick={() => setShowManageOptions(false)}
                    className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors"
                  >
                    <X className="w-3 h-3 text-gray-600" />
                  </button>
                </div>

                <div className="space-y-3">
                  {/* Change Subscription Type */}
                  <div 
                    onClick={handleChangeSubscriptionType}
                    className="border border-gray-200 rounded-lg p-3 hover:bg-gray-50 transition-colors cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                        user.subscription?.type === "daily" 
                          ? "bg-blue-100" 
                          : "bg-purple-100"
                      }`}>
                        <Package className={`w-4 h-4 ${
                          user.subscription?.type === "daily" 
                            ? "text-blue-600" 
                            : "text-purple-600"
                        }`} />
                      </div>
                      <div className="flex-1">
                        <h4 className="text-sm font-semibold text-gray-900">
                          Change to {user.subscription?.type === "daily" ? "Monthly" : "Daily"}
                        </h4>
                        <p className="text-xs text-gray-600">
                          Switch subscription type
                        </p>
                      </div>
                      <ChevronRight className="w-4 h-4 text-gray-400" />
                    </div>
                  </div>

                  {/* Update Delivery */}
                  <div 
                    onClick={handleUpdateDeliverySchedule}
                    className="border border-gray-200 rounded-lg p-3 hover:bg-gray-50 transition-colors cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-green-100 flex items-center justify-center">
                        <Calendar className="w-4 h-4 text-green-600" />
                      </div>
                      <div className="flex-1">
                        <h4 className="text-sm font-semibold text-gray-900">
                          Update Delivery
                        </h4>
                        <p className="text-xs text-gray-600">
                          Change delivery schedule
                        </p>
                      </div>
                      <ChevronRight className="w-4 h-4 text-gray-400" />
                    </div>
                  </div>

                  {/* Update Payment */}
                  <div 
                    onClick={handleUpdatePaymentMethod}
                    className="border border-gray-200 rounded-lg p-3 hover:bg-gray-50 transition-colors cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-yellow-100 flex items-center justify-center">
                        <CreditCard className="w-4 h-4 text-yellow-600" />
                      </div>
                      <div className="flex-1">
                        <h4 className="text-sm font-semibold text-gray-900">
                          Update Payment
                        </h4>
                        <p className="text-xs text-gray-600">
                          Change payment method
                        </p>
                      </div>
                      <ChevronRight className="w-4 h-4 text-gray-400" />
                    </div>
                  </div>

                  {/* Pause Subscription */}
                  <div 
                    onClick={handlePauseSubscription}
                    className="border border-gray-200 rounded-lg p-3 hover:bg-gray-50 transition-colors cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-orange-100 flex items-center justify-center">
                        <Clock className="w-4 h-4 text-orange-600" />
                      </div>
                      <div className="flex-1">
                        <h4 className="text-sm font-semibold text-gray-900">
                          Pause Subscription
                        </h4>
                        <p className="text-xs text-gray-600">
                          Temporarily pause
                        </p>
                      </div>
                      <ChevronRight className="w-4 h-4 text-gray-400" />
                    </div>
                  </div>

                  {/* View History */}
                  <div 
                    onClick={handleViewSubscriptionHistory}
                    className="border border-gray-200 rounded-lg p-3 hover:bg-gray-50 transition-colors cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-indigo-100 flex items-center justify-center">
                        <ShoppingBag className="w-4 h-4 text-indigo-600" />
                      </div>
                      <div className="flex-1">
                        <h4 className="text-sm font-semibold text-gray-900">
                          View History
                        </h4>
                        <p className="text-xs text-gray-600">
                          Past orders & billing
                        </p>
                      </div>
                      <ChevronRight className="w-4 h-4 text-gray-400" />
                    </div>
                  </div>

                  {/* Cancel Subscription */}
                  <div 
                    onClick={() => {
                      setShowManageOptions(false);
                      setShowCancelConfirm(true);
                    }}
                    className="border border-red-200 rounded-lg p-3 hover:bg-red-50 transition-colors cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-red-100 flex items-center justify-center">
                        <X className="w-4 h-4 text-red-600" />
                      </div>
                      <div className="flex-1">
                        <h4 className="text-sm font-semibold text-red-900">
                          Cancel Subscription
                        </h4>
                        <p className="text-xs text-red-600">
                          Permanently cancel
                        </p>
                      </div>
                      <ChevronRight className="w-4 h-4 text-red-400" />
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-gray-200">
                  <p className="text-xs text-gray-500 text-center">
                    Need help? Contact support.
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === "wallet" && (
            <WalletComponent 
              userId={user?.id || "customer_001"} 
              userName={user?.name}
            />
          )}

          {activeTab === "payment" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-gray-900">Payment Methods</h3>
                <button
                  onClick={() => setShowAddPayment(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl hover:opacity-90 transition-opacity"
                >
                  <Plus className="w-4 h-4" />
                  Add Payment Method
                </button>
              </div>

              {/* Payment Methods List */}
              <div className="space-y-4">
                {paymentMethods.map((payment) => (
                  <div
                    key={payment.id}
                    className="bg-white rounded-xl border border-gray-200 p-4 hover:shadow-md transition-all"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        {/* Payment Icon */}
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                          payment.type === "card" ? "bg-gradient-to-br from-blue-100 to-indigo-100" :
                          payment.type === "upi" ? "bg-gradient-to-br from-green-100 to-emerald-100" :
                          "bg-gradient-to-br from-purple-100 to-pink-100"
                        }`}>
                          {payment.type === "card" && <CreditCard className="w-6 h-6 text-blue-600" />}
                          {payment.type === "upi" && <div className="text-2xl">📱</div>}
                          {payment.type === "netbanking" && <div className="text-2xl">🏦</div>}
                        </div>

                        {/* Payment Details */}
                        <div className="flex-1">
                          <h4 className="font-bold text-gray-900">{payment.name}</h4>
                          {payment.type === "card" && (
                            <div className="space-y-1">
                              <p className="text-sm text-gray-600">Card Number: <span className="font-medium text-gray-900">{payment.cardNumber}</span></p>
                              <div className="flex items-center gap-2">
                                <p className="text-sm text-gray-600">Expires: <span className="font-medium text-gray-900">{payment.expiryDate}</span></p>
                                {payment.isDefault && (
                                  <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full">DEFAULT</span>
                                )}
                              </div>
                            </div>
                          )}
                          {payment.type === "upi" && (
                            <div className="space-y-1">
                              <p className="text-sm text-gray-600">UPI ID: <span className="font-medium text-gray-900">{payment.upiId}</span></p>
                              {payment.isDefault && (
                                <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full">DEFAULT</span>
                              )}
                            </div>
                          )}
                          {payment.type === "netbanking" && (
                            <div className="space-y-1">
                              <p className="text-sm text-gray-600">Bank: <span className="font-medium text-gray-900">{payment.bankName}</span></p>
                              {payment.isDefault && (
                                <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full">DEFAULT</span>
                              )}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex items-center gap-2">
                        {!payment.isDefault && (
                          <button
                            onClick={() => handleSetDefaultPayment(payment.id)}
                            className="px-3 py-1 bg-green-100 text-green-700 text-sm font-medium rounded-lg hover:bg-green-200 transition-colors"
                          >
                            Set Default
                          </button>
                        )}
                        <button
                          onClick={() => handleDeletePayment(payment.id)}
                          className="px-3 py-1 bg-red-100 text-red-700 text-sm font-medium rounded-lg hover:bg-red-200 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Add Payment Modal */}
              {showAddPayment && (
                <div
                  className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
                  onClick={() => setShowAddPayment(false)}
                >
                  <div
                    className="bg-white rounded-2xl w-full max-w-md shadow-xl border border-gray-100 overflow-hidden"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {/* Modal Header */}
                    <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-4 text-white">
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-bold">Add Payment Method</h3>
                        <button
                          onClick={() => setShowAddPayment(false)}
                          className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center hover:bg-white/30 transition-colors"
                        >
                          <X className="w-4 h-4 text-white" />
                        </button>
                      </div>
                    </div>

                    {/* Modal Body */}
                    <div className="p-6 space-y-4">
                      {/* Payment Type Selection */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Payment Type</label>
                        <div className="grid grid-cols-3 gap-3">
                          <button
                            onClick={() => setNewPayment({...newPayment, type: "card"})}
                            className={`p-3 rounded-xl border-2 transition-all ${
                              newPayment.type === "card" 
                                ? "border-blue-500 bg-blue-50 text-blue-700" 
                                : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                            }`}
                          >
                            <CreditCard className="w-5 h-5 mx-auto mb-1" />
                            <span className="text-sm">Card</span>
                          </button>
                          <button
                            onClick={() => setNewPayment({...newPayment, type: "upi"})}
                            className={`p-3 rounded-xl border-2 transition-all ${
                              newPayment.type === "upi" 
                                ? "border-green-500 bg-green-50 text-green-700" 
                                : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                            }`}
                          >
                            <div className="text-2xl mx-auto mb-1">📱</div>
                            <span className="text-sm">UPI</span>
                          </button>
                          <button
                            onClick={() => setNewPayment({...newPayment, type: "netbanking"})}
                            className={`p-3 rounded-xl border-2 transition-all ${
                              newPayment.type === "netbanking" 
                                ? "border-purple-500 bg-purple-50 text-purple-700" 
                                : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                            }`}
                          >
                            <div className="text-2xl mx-auto mb-1">🏦</div>
                            <span className="text-sm">Net Banking</span>
                          </button>
                        </div>
                      </div>

                      {/* Conditional Fields Based on Type */}
                      {newPayment.type === "card" && (
                        <div className="space-y-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Cardholder Name</label>
                            <input
                              type="text"
                              value={newPayment.name}
                              onChange={(e) => setNewPayment({...newPayment, name: e.target.value})}
                              className="w-full p-3 border border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
                              placeholder="John Doe"
                            />
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">Card Number</label>
                              <input
                                type="text"
                                value={newPayment.cardNumber}
                                onChange={(e) => setNewPayment({...newPayment, cardNumber: e.target.value})}
                                className="w-full p-3 border border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
                                placeholder="1234 5678 9012 3456"
                                maxLength={16}
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">Expiry Date</label>
                              <input
                                type="text"
                                value={newPayment.expiryDate}
                                onChange={(e) => setNewPayment({...newPayment, expiryDate: e.target.value})}
                                className="w-full p-3 border border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
                                placeholder="MM/YY"
                                maxLength={5}
                              />
                            </div>
                          </div>
                        </div>
                      )}

                      {newPayment.type === "upi" && (
                        <div className="space-y-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">UPI ID</label>
                            <input
                              type="text"
                              value={newPayment.upiId}
                              onChange={(e) => setNewPayment({...newPayment, upiId: e.target.value})}
                              className="w-full p-3 border border-gray-200 rounded-xl focus:ring-4 focus:ring-green-500/20 focus:border-green-500 outline-none"
                              placeholder="yourname@upi"
                            />
                          </div>
                        </div>
                      )}

                      {newPayment.type === "netbanking" && (
                        <div className="space-y-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Bank Name</label>
                            <input
                              type="text"
                              value={newPayment.bankName}
                              onChange={(e) => setNewPayment({...newPayment, bankName: e.target.value})}
                              className="w-full p-3 border border-gray-200 rounded-xl focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 outline-none"
                              placeholder="Bank Name"
                            />
                          </div>
                        </div>
                      )}

                      {/* Default Payment Toggle */}
                      <div className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          id="defaultPayment"
                          checked={newPayment.isDefault}
                          onChange={(e) => setNewPayment({...newPayment, isDefault: e.target.checked})}
                          className="w-4 h-4 text-blue-600 rounded"
                        />
                        <label htmlFor="defaultPayment" className="text-sm font-medium text-gray-700">
                          Set as default payment method
                        </label>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex gap-3 pt-4">
                        <button
                          onClick={handleAddPayment}
                          className="flex-1 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-semibold hover:opacity-90 transition-opacity"
                        >
                          Add Payment Method
                        </button>
                        <button
                          onClick={() => setShowAddPayment(false)}
                          className="flex-1 py-3 bg-gray-200 text-gray-700 rounded-xl font-semibold hover:bg-gray-300 transition-colors"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfileComponent;