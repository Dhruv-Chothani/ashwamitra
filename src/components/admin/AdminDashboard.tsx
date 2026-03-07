import React, { useState } from 'react';
import { Users, Package, ShoppingCart, TrendingUp, CreditCard, Calendar, Filter, Search, Eye, Edit, Trash2, MoreHorizontal, BarChart3, DollarSign, UserCheck, AlertCircle, CheckCircle, Clock, ArrowUpRight, ArrowDownRight, X, Wheat, Star } from 'lucide-react';
import FarmerDetails from './FarmerDetails';
import WalletComponent from '../wallet/WalletComponent';
import SubscriptionComponent, { UserSubscription } from '../subscription/SubscriptionComponent';

export type AdminStats = {
  totalUsers: number;
  totalFarmers: number;
  totalBusinesses: number;
  totalCustomers: number;
  totalOrders: number;
  totalRevenue: number;
  activeSubscriptions: number;
  pendingOrders: number;
  monthlyGrowth: number;
  yearlyGrowth: number;
};

export type AdminUser = {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'farmer' | 'business' | 'customer' | 'admin';
  status: 'active' | 'inactive' | 'suspended';
  joinDate: string;
  lastActive: string;
  totalOrders: number;
  totalSpent: number;
  rating?: number;
  products?: number; // For farmers
  revenue?: number; // For farmers
};

type AdminDashboardProps = {
  onUserSelect: (user: AdminUser) => void;
  onFarmerDetails: (farmerId: string) => void;
};

const AdminDashboard: React.FC<AdminDashboardProps> = ({
  onUserSelect,
  onFarmerDetails
}) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);
  const [showFarmerDetails, setShowFarmerDetails] = useState(false);
  const [showWalletManagement, setShowWalletManagement] = useState(false);
  const [showSubscriptionManagement, setShowSubscriptionManagement] = useState(false);

  // Mock data - in real app, this would come from API
  const stats: AdminStats = {
    totalUsers: 1247,
    totalFarmers: 342,
    totalBusinesses: 156,
    totalCustomers: 749,
    totalOrders: 8934,
    totalRevenue: 2847500,
    activeSubscriptions: 234,
    pendingOrders: 47,
    monthlyGrowth: 12.5,
    yearlyGrowth: 34.8
  };

  const users: AdminUser[] = [
    {
      id: 'FARM001',
      name: 'Ramesh Kumar',
      email: 'ramesh@farm.com',
      phone: '+91 9876543210',
      role: 'farmer',
      status: 'active',
      joinDate: '2024-01-15',
      lastActive: '2024-02-26',
      totalOrders: 156,
      totalSpent: 0,
      rating: 4.5,
      products: 12,
      revenue: 125000
    },
    {
      id: 'BIZ001',
      name: 'FreshMart Wholesale',
      email: 'orders@freshmart.com',
      phone: '+91 9876543211',
      role: 'business',
      status: 'active',
      joinDate: '2024-02-01',
      lastActive: '2024-02-26',
      totalOrders: 89,
      totalSpent: 450000,
      revenue: 0
    },
    {
      id: 'CUST001',
      name: 'Priya Sharma',
      email: 'priya@email.com',
      phone: '+91 9876543212',
      role: 'customer',
      status: 'active',
      joinDate: '2024-01-20',
      lastActive: '2024-02-26',
      totalOrders: 23,
      totalSpent: 12500,
      rating: 4.8
    },
    {
      id: 'FARM002',
      name: 'Lakshmi Devi',
      email: 'lakshmi@farm.com',
      phone: '+91 9876543213',
      role: 'farmer',
      status: 'inactive',
      joinDate: '2023-12-10',
      lastActive: '2024-02-20',
      totalOrders: 98,
      totalSpent: 0,
      rating: 4.2,
      products: 8,
      revenue: 87000
    }
  ];

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = filterRole === 'all' || user.role === filterRole;
    const matchesStatus = filterStatus === 'all' || user.status === filterStatus;
    return matchesSearch && matchesRole && matchesStatus;
  });

  const handleUserAction = (user: AdminUser) => {
    if (user.role === 'farmer') {
      onFarmerDetails(user.id);
      setShowFarmerDetails(true);
    } else {
      setSelectedUser(user);
      onUserSelect(user);
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

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'farmer': return 'text-green-700 bg-green-100';
      case 'business': return 'text-blue-700 bg-blue-100';
      case 'customer': return 'text-purple-700 bg-purple-100';
      default: return 'text-gray-700 bg-gray-100';
    }
  };

  const StatCard = ({ title, value, icon: Icon, change, color = 'blue' }: {
    title: string;
    value: string | number;
    icon: React.ElementType;
    change?: number;
    color?: string;
  }) => (
    <div className={`bg-white rounded-2xl p-6 border border-gray-200 hover:shadow-lg transition-all duration-300`}>
      <div className="flex items-center justify-between mb-4">
        <div className={`w-12 h-12 rounded-xl bg-${color}-100 flex items-center justify-center`}>
          <Icon className={`w-6 h-6 text-${color}-600`} />
        </div>
        {change !== undefined && (
          <div className={`flex items-center gap-1 text-sm font-medium ${
            change >= 0 ? 'text-green-600' : 'text-red-600'
          }`}>
            {change >= 0 ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
            {Math.abs(change)}%
          </div>
        )}
      </div>
      <h3 className="text-2xl font-bold text-gray-900">{value}</h3>
      <p className="text-gray-600 text-sm">{title}</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-slate-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
            <p className="text-gray-600 mt-2">Manage users, orders, and system operations</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => setShowWalletManagement(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300"
            >
              <CreditCard className="w-4 h-4 inline mr-2" />
              Wallet Management
            </button>
            <button
              onClick={() => setShowSubscriptionManagement(true)}
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300"
            >
              <Users className="w-4 h-4 inline mr-2" />
              Subscriptions
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-2 mb-8">
          <div className="flex gap-2">
            {['overview', 'users', 'farmers', 'businesses', 'customers', 'orders'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
                  activeTab === tab
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatCard
                title="Total Users"
                value={stats.totalUsers.toLocaleString()}
                icon={Users}
                change={stats.monthlyGrowth}
                color="blue"
              />
              <StatCard
                title="Total Revenue"
                value={`₹${stats.totalRevenue.toLocaleString()}`}
                icon={DollarSign}
                change={stats.yearlyGrowth}
                color="green"
              />
              <StatCard
                title="Total Orders"
                value={stats.totalOrders.toLocaleString()}
                icon={ShoppingCart}
                change={stats.monthlyGrowth}
                color="purple"
              />
              <StatCard
                title="Active Subscriptions"
                value={stats.activeSubscriptions}
                icon={UserCheck}
                change={stats.monthlyGrowth}
                color="orange"
              />
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-200">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Quick Actions</h3>
                <div className="space-y-3">
                  <button
                    onClick={() => setActiveTab('users')}
                    className="w-full text-left px-4 py-3 rounded-xl bg-white hover:bg-gray-50 transition-colors duration-200 flex items-center gap-3"
                  >
                    <Users className="w-5 h-5 text-blue-500" />
                    <span>Manage All Users</span>
                  </button>
                  <button
                    onClick={() => setShowWalletManagement(true)}
                    className="w-full text-left px-4 py-3 rounded-xl bg-white hover:bg-gray-50 transition-colors duration-200 flex items-center gap-3"
                  >
                    <CreditCard className="w-5 h-5 text-green-500" />
                    <span>Wallet Management</span>
                  </button>
                  <button
                    onClick={() => setShowSubscriptionManagement(true)}
                    className="w-full text-left px-4 py-3 rounded-xl bg-white hover:bg-gray-50 transition-colors duration-200 flex items-center gap-3"
                  >
                    <UserCheck className="w-5 h-5 text-purple-500" />
                    <span>Subscription Management</span>
                  </button>
                </div>
              </div>

              <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 border border-green-200">
                <h3 className="text-lg font-bold text-gray-900 mb-4">System Health</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Server Status</span>
                    <span className="flex items-center gap-1 text-green-600">
                      <CheckCircle className="w-4 h-4" />
                      Healthy
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Database</span>
                    <span className="flex items-center gap-1 text-green-600">
                      <CheckCircle className="w-4 h-4" />
                      Connected
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">API Response</span>
                    <span className="text-green-600">124ms</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Pending Tasks</span>
                    <span className="text-orange-600">{stats.pendingOrders}</span>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6 border border-purple-200">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Recent Activity</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-sm">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-gray-600">New user registered</span>
                    <span className="text-gray-400 ml-auto">2 min ago</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span className="text-gray-600">Order #ORD8934 completed</span>
                    <span className="text-gray-400 ml-auto">15 min ago</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                    <span className="text-gray-600">Subscription activated</span>
                    <span className="text-gray-400 ml-auto">1 hour ago</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                    <span className="text-gray-600">Payment received</span>
                    <span className="text-gray-400 ml-auto">2 hours ago</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Farmers Tab */}
        {activeTab === 'farmers' && (
          <div className="space-y-6">
            {/* Farmers Header */}
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-6 border border-green-200 mb-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                    <Wheat className="w-6 h-6 text-green-600" />
                    Farmers Management
                  </h3>
                  <p className="text-gray-600 mt-2">Manage all registered farmers and their details</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="bg-green-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                    {stats.totalFarmers} Total Farmers
                  </span>
                </div>
              </div>
            </div>

            {/* Farmers List */}
            <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-green-50 border-b border-green-200">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Farmer</th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Products</th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Orders</th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Revenue</th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Rating</th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {filteredUsers.filter(user => user.role === 'farmer').map((farmer) => (
                      <tr key={farmer.id} className="hover:bg-green-50 transition-colors duration-200">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                              <Wheat className="w-5 h-5 text-green-600" />
                            </div>
                            <div>
                              <div className="text-sm font-medium text-gray-900">{farmer.name}</div>
                              <div className="text-xs text-gray-500">{farmer.email}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(farmer.status)}`}>
                            <span className="capitalize">{farmer.status}</span>
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {farmer.products || 0}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {farmer.totalOrders}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          ₹{(farmer.revenue || 0).toLocaleString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          <div className="flex items-center gap-1">
                            <span className="font-medium">{farmer.rating || 0}</span>
                            <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button
                            onClick={() => handleUserAction(farmer)}
                            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-xs font-medium transition-all duration-300 hover:scale-105 flex items-center gap-2"
                            title="View Complete Farmer Details"
                          >
                            <Eye className="w-4 h-4" />
                            Details
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Users Tab (for non-farmers) */}
        {(activeTab === 'users' || activeTab === 'businesses' || activeTab === 'customers') && (
          <div className="space-y-6">
            {/* Filters */}
            <div className="bg-white rounded-2xl p-6 border border-gray-200">
              <div className="flex flex-col lg:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search users..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
                <select
                  value={filterRole}
                  onChange={(e) => setFilterRole(e.target.value)}
                  className="px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">All Roles</option>
                  <option value="farmer">Farmers</option>
                  <option value="business">Businesses</option>
                  <option value="customer">Customers</option>
                </select>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">All Status</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="suspended">Suspended</option>
                </select>
              </div>
            </div>

            {/* Users Table */}
            <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Join Date</th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Orders</th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Revenue/Spent</th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {filteredUsers.map((user) => (
                      <tr key={user.id} className="hover:bg-gray-50 transition-colors duration-200">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-gray-900">{user.name}</div>
                            <div className="text-sm text-gray-500">{user.email}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getRoleColor(user.role)}`}>
                            <span className="capitalize">{user.role}</span>
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(user.status)}`}>
                            <span className="capitalize">{user.status}</span>
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {user.joinDate}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {user.totalOrders}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          ₹{user.totalSpent.toLocaleString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          {user.role === 'farmer' && (
                            <>
                              <button
                                onClick={() => handleUserAction(user)}
                                className="text-blue-600 hover:text-blue-900 mr-2"
                                title="View Farmer Details"
                              >
                                <Eye className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleUserAction(user)}
                                className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-lg text-xs font-medium transition-colors duration-200"
                                title="View Complete Details"
                              >
                                Details
                              </button>
                            </>
                          )}
                          {user.role !== 'farmer' && (
                            <button
                              onClick={() => handleUserAction(user)}
                              className="text-blue-600 hover:text-blue-900"
                              title="View User Details"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Orders Tab */}
        {activeTab === 'orders' && (
          <div className="bg-white rounded-2xl p-6 border border-gray-200">
            <h3 className="text-xl font-bold text-gray-900 mb-6">Order Management</h3>
            <div className="text-center py-12">
              <ShoppingCart className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">Order management interface coming soon...</p>
            </div>
          </div>
        )}
      </div>

      {/* Farmer Details Modal */}
      {showFarmerDetails && (
        <FarmerDetails
          farmer={{
            id: 'FARM001',
            name: 'Ramesh Kumar',
            email: 'ramesh@farm.com',
            phone: '+91 9876543210',
            address: '123 Farm Road, Village Green',
            landmark: 'Near Temple',
            city: 'Hyderabad',
            state: 'Telangana',
            pincode: '500001',
            status: 'active',
            joinDate: '2024-01-15',
            lastActive: '2024-02-26',
            rating: 4.5,
            totalProducts: 12,
            totalOrders: 156,
            totalRevenue: 125000,
            subscription: {
              planId: 'daily-monthly',
              planName: 'Daily Delivery (Monthly)',
              status: 'active',
              endDate: '2024-03-15'
            },
            wallet: {
              balance: 2500.00,
              totalCredit: 10000.00,
              totalDebit: 7500.00
            },
            products: [
              {
                id: 'PROD001',
                name: 'Fresh Tomatoes',
                category: 'Vegetables',
                price: 35,
                stock: 500,
                status: 'active'
              },
              {
                id: 'PROD002',
                name: 'Organic Potatoes',
                category: 'Vegetables',
                price: 28,
                stock: 750,
                status: 'active'
              }
            ],
            orders: [
              {
                id: 'ORD001',
                date: '2024-02-26',
                total: 1250,
                status: 'delivered',
                customer: 'FreshMart Wholesale'
              },
              {
                id: 'ORD002',
                date: '2024-02-25',
                total: 890,
                status: 'processing',
                customer: 'Green Groceries'
              }
            ]
          }}
          onActivate={(farmerId) => console.log('Activate:', farmerId)}
          onDeactivate={(farmerId) => console.log('Deactivate:', farmerId)}
          onEdit={(farmer) => console.log('Edit:', farmer)}
          onDelete={(farmerId) => console.log('Delete:', farmerId)}
          onClose={() => setShowFarmerDetails(false)}
        />
      )}

      {/* Wallet Management Modal */}
      {showWalletManagement && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-3xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6 flex items-center justify-between">
              <h2 className="text-2xl font-bold">Wallet Management</h2>
              <button
                onClick={() => setShowWalletManagement(false)}
                className="text-white hover:bg-white/20 rounded-full p-2 transition-colors duration-200"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
              <WalletComponent
                userId="admin"
              />
            </div>
          </div>
        </div>
      )}

      {/* Subscription Management Modal */}
      {showSubscriptionManagement && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-3xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden">
            <div className="bg-gradient-to-r from-green-600 to-emerald-600 text-white p-6 flex items-center justify-between">
              <h2 className="text-2xl font-bold">Subscription Management</h2>
              <button
                onClick={() => setShowSubscriptionManagement(false)}
                className="text-white hover:bg-white/20 rounded-full p-2 transition-colors duration-200"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
              <SubscriptionComponent
                currentSubscription={{
                  id: 'SUB001',
                  userId: 'FARM001',
                  planId: 'daily-monthly',
                  planName: 'Daily Delivery (Monthly)',
                  planType: 'monthly',
                  startDate: '2024-02-15',
                  endDate: '2024-03-15',
                  status: 'active',
                  autoRenew: true,
                  price: 299
                }}
                onSelectPlan={(plan) => console.log('Select plan:', plan)}
                onCancelSubscription={() => console.log('Cancel subscription')}
                onUpgradeSubscription={(plan) => console.log('Upgrade plan:', plan)}
                onRenewSubscription={() => console.log('Renew subscription')}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
