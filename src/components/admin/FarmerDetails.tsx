import React, { useState } from 'react';
import { User, Mail, Phone, MapPin, Calendar, Package, CreditCard, Wallet, ShoppingBag, Edit, Trash2, Power, PowerOff, X, Check, AlertCircle, TrendingUp, Users, Star } from 'lucide-react';

export type Farmer = {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  landmark: string;
  city: string;
  state: string;
  pincode: string;
  status: 'active' | 'inactive' | 'suspended';
  joinDate: string;
  lastActive: string;
  rating: number;
  totalProducts: number;
  totalOrders: number;
  totalRevenue: number;
  subscription?: {
    planId: string;
    planName: string;
    status: 'active' | 'expired' | 'cancelled';
    endDate: string;
  };
  wallet: {
    balance: number;
    totalCredit: number;
    totalDebit: number;
  };
  products: Array<{
    id: string;
    name: string;
    category: string;
    price: number;
    stock: number;
    status: 'active' | 'inactive';
  }>;
  orders: Array<{
    id: string;
    date: string;
    total: number;
    status: 'pending' | 'processing' | 'delivered' | 'cancelled';
    customer: string;
  }>;
};

type FarmerDetailsProps = {
  farmer: Farmer;
  onActivate: (farmerId: string) => void;
  onDeactivate: (farmerId: string) => void;
  onEdit: (farmer: Farmer) => void;
  onDelete: (farmerId: string) => void;
  onClose: () => void;
};

const FarmerDetails: React.FC<FarmerDetailsProps> = ({
  farmer,
  onActivate,
  onDeactivate,
  onEdit,
  onDelete,
  onClose
}) => {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showStatusConfirm, setShowStatusConfirm] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleStatusToggle = async () => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      if (farmer.status === 'active') {
        onDeactivate(farmer.id);
      } else {
        onActivate(farmer.id);
      }
      setShowStatusConfirm(false);
    } catch (error) {
      console.error('Status update failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      onDelete(farmer.id);
      setShowDeleteConfirm(false);
      onClose();
    } catch (error) {
      console.error('Delete failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-600 bg-green-100';
      case 'inactive': return 'text-gray-600 bg-gray-100';
      case 'suspended': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <Check className="w-4 h-4" />;
      case 'inactive': return <PowerOff className="w-4 h-4" />;
      case 'suspended': return <X className="w-4 h-4" />;
      default: return <AlertCircle className="w-4 h-4" />;
    }
  };

  const getOrderStatusColor = (status: string) => {
    switch (status) {
      case 'delivered': return 'text-green-600 bg-green-100';
      case 'processing': return 'text-blue-600 bg-blue-100';
      case 'pending': return 'text-yellow-600 bg-yellow-100';
      case 'cancelled': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-green-600 to-emerald-600 text-white p-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
              <User className="w-8 h-8" />
            </div>
            <div>
              <h2 className="text-2xl font-bold">{farmer.name}</h2>
              <p className="text-green-100">Farmer ID: {farmer.id}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-white hover:bg-white/20 rounded-full p-2 transition-colors duration-200"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Left Column - Basic Info */}
            <div className="lg:col-span-1 space-y-6">
              {/* Status Card */}
              <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Account Status</h3>
                <div className="space-y-4">
                  <div className={`inline-flex items-center gap-2 px-3 py-2 rounded-full text-sm font-medium ${getStatusColor(farmer.status)}`}>
                    {getStatusIcon(farmer.status)}
                    <span className="capitalize">{farmer.status}</span>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setShowStatusConfirm(true)}
                      className={`flex-1 px-4 py-2 rounded-xl font-medium transition-all duration-300 ${
                        farmer.status === 'active'
                          ? 'bg-red-600 hover:bg-red-700 text-white'
                          : 'bg-green-600 hover:bg-green-700 text-white'
                      }`}
                    >
                      {farmer.status === 'active' ? 'Deactivate' : 'Activate'}
                    </button>
                    <button
                      onClick={() => onEdit(farmer)}
                      className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl font-medium transition-all duration-300"
                    >
                      <Edit className="w-4 h-4 inline mr-2" />
                      Edit
                    </button>
                  </div>
                </div>
              </div>

              {/* Contact Info */}
              <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <User className="w-5 h-5 text-blue-500" />
                  Complete Contact Information
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <User className="w-4 h-4 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-600">Full Name</p>
                      <p className="font-medium text-gray-900">{farmer.name}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Mail className="w-4 h-4 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-600">Email Address</p>
                      <p className="font-medium text-gray-900">{farmer.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone className="w-4 h-4 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-600">Phone Number</p>
                      <p className="font-medium text-gray-900">{farmer.phone}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <MapPin className="w-4 h-4 text-gray-400 mt-1" />
                    <div>
                      <p className="text-sm text-gray-600">Complete Address</p>
                      <p className="font-medium text-gray-900">{farmer.address}</p>
                      {farmer.landmark && (
                        <p className="text-sm text-gray-700">Landmark: {farmer.landmark}</p>
                      )}
                      <p className="font-medium text-gray-900">
                        {farmer.city}, {farmer.state} - {farmer.pincode}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-600">Member Since</p>
                      <p className="font-medium text-gray-900">{farmer.joinDate}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <TrendingUp className="w-4 h-4 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-600">Last Active</p>
                      <p className="font-medium text-gray-900">{farmer.lastActive}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Star className="w-4 h-4 text-yellow-500" />
                    <div>
                      <p className="text-sm text-gray-600">Performance Rating</p>
                      <div className="flex items-center gap-1">
                        <span className="font-medium text-gray-900">{farmer.rating}</span>
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-3 h-3 ${
                                i < Math.floor(farmer.rating)
                                  ? 'text-yellow-400 fill-yellow-400'
                                  : 'text-gray-300'
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Account Info */}
              <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-purple-500" />
                  Account Information
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Join Date:</span>
                    <span className="font-medium text-gray-900">{farmer.joinDate}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Last Active:</span>
                    <span className="font-medium text-gray-900">{farmer.lastActive}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Rating:</span>
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-yellow-500 fill-current" />
                      <span className="font-medium text-gray-900">{farmer.rating.toFixed(1)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Middle Column - Business Info */}
            <div className="lg:col-span-1 space-y-6">
              {/* Stats Overview */}
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-200">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-blue-500" />
                  Business Overview
                </h3>
                <div className="space-y-4">
                  <div className="bg-white rounded-xl p-4 border border-blue-100">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-gray-600 text-sm">Total Products</span>
                      <Package className="w-4 h-4 text-blue-500" />
                    </div>
                    <p className="text-2xl font-bold text-gray-900">{farmer.totalProducts}</p>
                  </div>
                  <div className="bg-white rounded-xl p-4 border border-blue-100">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-gray-600 text-sm">Total Orders</span>
                      <ShoppingBag className="w-4 h-4 text-green-500" />
                    </div>
                    <p className="text-2xl font-bold text-gray-900">{farmer.totalOrders}</p>
                  </div>
                  <div className="bg-white rounded-xl p-4 border border-blue-100">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-gray-600 text-sm">Total Revenue</span>
                      <CreditCard className="w-4 h-4 text-purple-500" />
                    </div>
                    <p className="text-2xl font-bold text-gray-900">₹{farmer.totalRevenue.toLocaleString()}</p>
                  </div>
                </div>
              </div>

              {/* Subscription Info */}
              {farmer.subscription && (
                <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200">
                  <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <CreditCard className="w-5 h-5 text-green-500" />
                    Subscription
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Plan:</span>
                      <span className="font-medium text-gray-900">{farmer.subscription.planName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Status:</span>
                      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(farmer.subscription.status)}`}>
                        {getStatusIcon(farmer.subscription.status)}
                        <span className="capitalize">{farmer.subscription.status}</span>
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">End Date:</span>
                      <span className="font-medium text-gray-900">{farmer.subscription.endDate}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Wallet Info */}
              <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Wallet className="w-5 h-5 text-yellow-500" />
                  Wallet Balance
                </h3>
                <div className="space-y-3">
                  <div className="bg-green-50 rounded-xl p-4 border border-green-200">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-gray-600 text-sm">Current Balance</span>
                      <Wallet className="w-4 h-4 text-green-500" />
                    </div>
                    <p className="text-2xl font-bold text-green-600">₹{farmer.wallet.balance.toFixed(2)}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-white rounded-xl p-3 border border-gray-200">
                      <p className="text-xs text-gray-600 mb-1">Total Credit</p>
                      <p className="text-sm font-bold text-green-600">₹{farmer.wallet.totalCredit.toFixed(2)}</p>
                    </div>
                    <div className="bg-white rounded-xl p-3 border border-gray-200">
                      <p className="text-xs text-gray-600 mb-1">Total Debit</p>
                      <p className="text-sm font-bold text-red-600">₹{farmer.wallet.totalDebit.toFixed(2)}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Products & Orders */}
            <div className="lg:col-span-1 space-y-6">
              {/* Products */}
              <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Package className="w-5 h-5 text-orange-500" />
                  Products ({farmer.products.length})
                </h3>
                <div className="space-y-3 max-h-64 overflow-y-auto">
                  {farmer.products.map((product) => (
                    <div key={product.id} className="bg-white rounded-xl p-4 border border-gray-200">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold text-gray-900">{product.name}</h4>
                        <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                          product.status === 'active' ? 'text-green-600 bg-green-100' : 'text-gray-600 bg-gray-100'
                        }`}>
                          {product.status === 'active' ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />}
                          <span className="capitalize">{product.status}</span>
                        </span>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div>
                          <span className="text-gray-600">Category:</span>
                          <p className="font-medium text-gray-900">{product.category}</p>
                        </div>
                        <div>
                          <span className="text-gray-600">Price:</span>
                          <p className="font-medium text-gray-900">₹{product.price}</p>
                        </div>
                        <div>
                          <span className="text-gray-600">Stock:</span>
                          <p className="font-medium text-gray-900">{product.stock} units</p>
                        </div>
                        <div>
                          <span className="text-gray-600">Status:</span>
                          <p className="font-medium capitalize text-gray-900">{product.status}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recent Orders */}
              <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <ShoppingBag className="w-5 h-5 text-purple-500" />
                  Recent Orders
                </h3>
                <div className="space-y-3 max-h-64 overflow-y-auto">
                  {farmer.orders.slice(0, 5).map((order) => (
                    <div key={order.id} className="bg-white rounded-xl p-4 border border-gray-200">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold text-gray-900">#{order.id}</h4>
                        <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getOrderStatusColor(order.status)}`}>
                          <span className="capitalize">{order.status}</span>
                        </span>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div>
                          <span className="text-gray-600">Date:</span>
                          <p className="font-medium text-gray-900">{order.date}</p>
                        </div>
                        <div>
                          <span className="text-gray-600">Total:</span>
                          <p className="font-medium text-gray-900">₹{order.total}</p>
                        </div>
                        <div>
                          <span className="text-gray-600">Customer:</span>
                          <p className="font-medium text-gray-900">{order.customer}</p>
                        </div>
                        <div>
                          <span className="text-gray-600">Status:</span>
                          <p className="font-medium capitalize text-gray-900">{order.status}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 mt-8 pt-6 border-t border-gray-200">
            <button
              onClick={() => onEdit(farmer)}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300"
            >
              <Edit className="w-4 h-4 inline mr-2" />
              Edit Farmer
            </button>
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="flex-1 bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300"
            >
              <Trash2 className="w-4 h-4 inline mr-2" />
              Delete Farmer
            </button>
          </div>
        </div>
      </div>

      {/* Status Confirmation Modal */}
      {showStatusConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-60">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              {farmer.status === 'active' ? 'Deactivate Farmer?' : 'Activate Farmer?'}
            </h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to {farmer.status === 'active' ? 'deactivate' : 'activate'} {farmer.name}? 
              {farmer.status === 'active' ? ' This will prevent them from selling products.' : ' This will allow them to resume selling products.'}
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowStatusConfirm(false)}
                className="flex-1 px-6 py-3 rounded-xl border-2 border-gray-300 text-gray-700 font-semibold hover:bg-gray-50 transition-all duration-300"
              >
                Cancel
              </button>
              <button
                onClick={handleStatusToggle}
                disabled={loading}
                className={`flex-1 px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                  farmer.status === 'active'
                    ? 'bg-red-600 hover:bg-red-700 text-white'
                    : 'bg-green-600 hover:bg-green-700 text-white'
                } disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                {loading ? 'Processing...' : farmer.status === 'active' ? 'Deactivate' : 'Activate'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-60">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Delete Farmer?</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete {farmer.name}? This action cannot be undone and will remove all their products, orders, and data.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 px-6 py-3 rounded-xl border-2 border-gray-300 text-gray-700 font-semibold hover:bg-gray-50 transition-all duration-300"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={loading}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Deleting...' : 'Delete Farmer'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FarmerDetails;
