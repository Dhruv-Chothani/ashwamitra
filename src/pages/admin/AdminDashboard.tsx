import React, { useState, useEffect, useMemo } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import {
  Users, Wheat, Building2, CreditCard, TrendingUp, ArrowUpRight,
  CheckCircle, XCircle, Clock, AlertCircle, Download, Eye, Shield,
  Package, Truck, MapPin, Calendar, RefreshCw, Filter, Search, Star, X
} from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend, LineChart, Line, Area, AreaChart } from "recharts";
import DeliveryManagement from "./component/DeliveryManagement";
import Farmers from "./component/Farmers";
import FarmerDetails from "@/components/admin/FarmerDetails";
import AdminWalletComponent from "../../components/wallet/AdminWalletComponent";

// Enhanced Types
interface DashboardStats {
  registeredFarmers: number;
  b2bBusinesses: number;
  activeCustomers: number;
  totalVolume: number;
  growthRates: {
    farmers: number;
    businesses: number;
    customers: number;
    volume: number;
  };
}

interface AdminUser {
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
}


interface TransactionData {
  month: string;
  volume: number;
  count: number;
  growth: number;
}

interface CategoryData {
  name: string;
  value: number;
  growth: number;
}

interface RealtimeData {
  activeOrders: number;
  pendingDeliveries: number;
  onlineUsers: number;
  systemHealth: 'excellent' | 'good' | 'warning' | 'critical';
}

interface FilterOptions {
  dateRange: '7d' | '30d' | '90d' | '1y';
  category: 'all' | 'grains' | 'vegetables' | 'spices' | 'fruits';
  status: 'all' | 'active' | 'pending' | 'completed';
}

// Enhanced Data with Growth Rates
const transactionTrend: TransactionData[] = [
  { month: "Aug", volume: 1240000, count: 342, growth: 8.5 },
  { month: "Sep", volume: 1580000, count: 428, growth: 27.4 },
  { month: "Oct", volume: 1420000, count: 389, growth: -10.1 },
  { month: "Nov", volume: 1890000, count: 512, growth: 33.1 },
  { month: "Dec", volume: 2240000, count: 618, growth: 18.5 },
  { month: "Jan", volume: 2080000, count: 574, growth: -7.1 },
];

const categoryPie: CategoryData[] = [
  { name: "Grains", value: 38, growth: 12.5 },
  { name: "Vegetables", value: 32, growth: -5.2 },
  { name: "Spices", value: 18, growth: 8.7 },
  { name: "Fruits", value: 12, growth: 15.3 },
];

// Real-time data simulation
const generateRealtimeData = (): RealtimeData => ({
  activeOrders: Math.floor(Math.random() * 50) + 20,
  pendingDeliveries: Math.floor(Math.random() * 30) + 10,
  onlineUsers: Math.floor(Math.random() * 200) + 150,
  systemHealth: 'excellent' as const,
});

// Auto-generating analytics data
const generateAnalyticsData = (dateRange: string) => {
  const multiplier = dateRange === '7d' ? 1 : dateRange === '30d' ? 4.3 : dateRange === '90d' ? 13 : 52;
  return {
    totalFarmers: Math.floor(1248 * multiplier),
    totalBusinesses: Math.floor(86 * multiplier),
    totalOrders: Math.floor(5820 * multiplier),
    totalRevenue: Math.floor(18000000 * multiplier),
    avgOrderValue: Math.floor(3200 * (1 + Math.random() * 0.3)),
    conversionRate: (3.2 + Math.random() * 1.5).toFixed(1),
    customerRetention: (78 + Math.random() * 12).toFixed(1),
  };
};

// ---------------- FARMERS ----------------
export const farmersData = [
  { 
    id: "F-1001", 
    name: "Ramu Reddy", 
    location: "Telangana", 
    products: 12, 
    joined: "Oct 2025", 
    status: "Approved", 
    earnings: "₹2,45,000",
    phone: "+91 9876544321",
    email: "ramu.reddy@example.com",
    password: "ramu123",
    address: "123 Farm Road, Hyderabad, Telangana 500001",
    bankAccount: "HDFC Bank - 123456789012",
    ifsc: "HDFC0001234",
    pan: "HDFC0001234"
  },
  { 
    id: "F-1002", 
    name: "Lakshmi Bai", 
    location: "Maharashtra", 
    products: 8, 
    joined: "Nov 2025", 
    status: "Pending", 
    earnings: "₹1,12,000",
    phone: "+91 987654322",
    email: "lakshmi@example.com",
    password: "lakshmi123",
    address: "456 Farm Road, Pune, Maharashtra 411030",
    bankAccount: "ICICI Bank - 456789012345",
    ifsc: "ICIC0004567",
    pan: "ICIC0004567"
  },
  { 
    id: "F-1003", 
    name: "Govind Rao", 
    location: "Karnataka", 
    products: 15, 
    joined: "Sep 2025", 
    status: "Suspended", 
    earnings: "₹3,01,000",
    phone: "+91 987654323",
    email: "govind@example.com",
    password: "govind123",
    address: "789 Farm Road, Bangalore, Karnataka 560001",
    bankAccount: "SBI Bank - 7890123456",
    ifsc: "SBI0001234",
    pan: "SBI0001234"
  },
];

// ---------------- BUSINESSES ----------------
const businessData = [
  { id: "B-201", name: "FreshMart Pvt Ltd", gst: "36AABCS1234F1Z5", orders: 142, volume: "₹18.4L", status: "Verified" },
  { id: "B-202", name: "AgroBulk Traders", gst: "27AACCA4567D1Z2", orders: 89, volume: "₹9.2L", status: "Pending" },
  { id: "B-203", name: "GreenSource Foods", gst: "29AAACG2233L1Z4", orders: 201, volume: "₹22.1L", status: "Verified" },
];

// ---------------- CUSTOMERS ----------------
const customersData = [
  { 
    id: "C-301", 
    name: "Anita Sharma", 
    email: "anita@gmail.com", 
    phone: "+91 9876543211",
    orders: 14, 
    spent: "₹28,400", 
    status: "Active",
    joinDate: "Feb 2024",
    lastLogin: "2026-02-28",
    password: "anita123",
    address: "123 Main St, Mumbai, Maharashtra 400001"
  },
  { 
    id: "C-302", 
    name: "Rahul Verma", 
    email: "rahul@gmail.com", 
    phone: "+91 9876543212",
    orders: 6, 
    spent: "₹7,200", 
    status: "Active",
    joinDate: "Jan 2024",
    lastLogin: "2026-02-27",
    password: "rahul123",
    address: "456 Park Ave, Delhi, Delhi 110001"
  },
  { 
    id: "C-303", 
    name: "Priya Nair", 
    email: "priya@gmail.com", 
    phone: "+91 9876543213",
    orders: 0, 
    spent: "₹0", 
    status: "Blocked",
    joinDate: "Mar 2024",
    lastLogin: "2026-02-25",
    password: "priya123",
    address: "789 MG Road, Bangalore, Karnataka 560001"
  },
];

// ---------------- DELIVERY ----------------
const deliveryData = [
  { id: "DLV-501", order: "ORD-1001", partner: "BlueDart", status: "In Transit", eta: "2 Days" },
  { id: "DLV-502", order: "ORD-1002", partner: "Delhivery", status: "Delivered", eta: "Completed" },
  { id: "DLV-503", order: "ORD-1003", partner: "DTDC", status: "Delayed", eta: "1 Day Delay" },
];

// ---------------- TRANSACTIONS ----------------
const allTransactions = [
  { id: "TXN-9001", user: "FreshMart", amount: "₹1,36,000", date: "Jan 20", status: "Success" },
  { id: "TXN-9002", user: "Lakshmi Bai", amount: "₹18,500", date: "Jan 21", status: "Pending" },
  { id: "TXN-9003", user: "Anita Sharma", amount: "₹980", date: "Jan 22", status: "Failed" },
];

const PIE_COLORS = ["hsl(150,57%,22%)", "hsl(38,90%,55%)", "hsl(210,80%,45%)", "hsl(142,70%,35%)"];

const pendingApprovals = [
  { id: "F-2841", name: "Ramesh Patel", type: "Farmer", location: "Rajkot, Gujarat", date: "Jan 23", docs: "Complete" },
  { id: "B-0192", name: "Agro Fresh Pvt Ltd", type: "Business", location: "Mumbai, Maharashtra", date: "Jan 22", docs: "Pending" },
  { id: "F-2839", name: "Sunita Devi", type: "Farmer", location: "Patna, Bihar", date: "Jan 21", docs: "Complete" },
  { id: "B-0191", name: "GreenSource Foods", type: "Business", location: "Pune, Maharashtra", date: "Jan 20", docs: "Complete" },
];

const recentTransactions = [
  { id: "TXN-8821", from: "Ramesh Patel", to: "Agro Fresh Pvt Ltd", amount: "₹85,400", mode: "Bank Transfer", status: "Completed", date: "Jan 23" },
  { id: "TXN-8820", from: "Sunita Devi", to: "Priya Sharma", amount: "₹1,250", mode: "UPI", status: "Completed", date: "Jan 23" },
  { id: "TXN-8819", from: "Govind Rao", to: "B2B Corp Ltd", amount: "₹42,000", mode: "Bank Transfer", status: "Processing", date: "Jan 22" },
  { id: "TXN-8818", from: "Lakshmi Bai", to: "Anita Kumar", amount: "₹980", mode: "UPI", status: "Failed", date: "Jan 22" },
];

const txnStatus = (status: string) => {
  if (status === "Completed") return <span className="badge-success">{status}</span>;
  if (status === "Processing") return <span className="badge-warning">{status}</span>;
  return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium" style={{ background: "hsl(var(--destructive) / 0.1)", color: "hsl(var(--destructive))" }}>{status}</span>;
};

const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [approvals, setApprovals] = useState(pendingApprovals);
  const [realtimeData, setRealtimeData] = useState<RealtimeData>(generateRealtimeData());
  const [showFarmerDetails, setShowFarmerDetails] = useState(false);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState<FilterOptions>({
    dateRange: '30d',
    category: 'all',
    status: 'all'
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);
  const [showCustomerDetails, setShowCustomerDetails] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<any>(null);
  const [showTransactionDetails, setShowTransactionDetails] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<any>(null);

  // Mock data - in real app, this would come from API
  const stats: DashboardStats = {
    registeredFarmers: 342,
    b2bBusinesses: 156,
    activeCustomers: 749,
    totalVolume: 145678,
    growthRates: {
      farmers: 12.5,
      businesses: 8.3,
      customers: 15.2,
      volume: 9.8
    }
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
    // ... more users
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-600 bg-green-100';
      case 'inactive': return 'text-gray-600 bg-gray-100';
      case 'suspended': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const handleUserAction = (user: AdminUser) => {
    setSelectedUser(user);
    if (user.role === 'farmer') {
      setShowFarmerDetails(true);
    }
  };

  useEffect(() => {
    if (!autoRefresh) return;
    
    const interval = setInterval(() => {
      setRealtimeData(generateRealtimeData());
    }, 5000); // Update every 5 seconds

    return () => clearInterval(interval);
  }, [autoRefresh]);

  // Auto-refresh analytics data
  useEffect(() => {
    const interval = setInterval(() => {
      // Simulate real-time data updates
      setApprovals(prev => prev.length > 0 ? prev.slice(0, -1) : pendingApprovals);
    }, 10000); // Update every 10 seconds

    return () => clearInterval(interval);
  }, []);

  // Memoized analytics data based on filters
  const analyticsData = useMemo(() => generateAnalyticsData(filters.dateRange), [filters.dateRange]);

  // Memoized filtered transaction data
  const filteredTransactionData = useMemo(() => {
    let data = [...transactionTrend];
    
    if (filters.category !== 'all') {
      // Apply category filter logic here
    }
    
    return data;
  }, [filters.category]);

  const handleApprove = (id: string) => {
    setIsLoading(true);
    setTimeout(() => {
      setApprovals((prev) => prev.filter((a) => a.id !== id));
      setIsLoading(false);
    }, 500);
  };

  const handleReject = (id: string) => {
    setIsLoading(true);
    setTimeout(() => {
      setApprovals((prev) => prev.filter((a) => a.id !== id));
      setIsLoading(false);
    }, 500);
  };

  const exportReport = () => {
    setIsLoading(true);
    setTimeout(() => {
      // Simulate report generation
      const reportData = {
        generatedAt: new Date().toISOString(),
        filters: filters,
        analytics: analyticsData,
        approvals: approvals,
      };
      
      const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `admin-report-${Date.now()}.json`;
      a.click();
      URL.revokeObjectURL(url);
      
      setIsLoading(false);
    }, 1000);
  };

  const getSystemHealthColor = (health: string) => {
    switch(health) {
      case 'excellent': return 'text-green-600 bg-green-100';
      case 'good': return 'text-blue-600 bg-blue-100';
      case 'warning': return 'text-yellow-600 bg-yellow-100';
      case 'critical': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <DashboardLayout activeTab={activeTab} onTabChange={setActiveTab}>
      {activeTab === "dashboard" && (
        <div className="space-y-6">
          {/* Header with Real-time Stats */}
          <div className="flex items-start justify-between">
            <div>
              <h1 className="font-display text-2xl font-bold text-foreground">Admin Control Panel</h1>
              <p className="text-muted-foreground text-sm">Real-time platform overview and management</p>
            </div>
            <div className="flex items-center gap-3">
              {/* Auto-refresh Toggle */}
              <div className="flex items-center gap-2">
                <RefreshCw className={`w-4 h-4 ${autoRefresh ? 'animate-spin' : ''}`} />
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={autoRefresh}
                    onChange={(e) => setAutoRefresh(e.target.checked)}
                    className="w-4 h-4 text-primary rounded"
                  />
                  Auto-refresh
                </label>
              </div>
              
              {/* Filters */}
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-muted-foreground" />
                <select
                  value={filters.dateRange}
                  onChange={(e) => setFilters({...filters, dateRange: e.target.value as FilterOptions['dateRange']})}
                  className="text-sm border border-border rounded-lg px-3 py-1 bg-background"
                >
                  <option value="7d">Last 7 days</option>
                  <option value="30d">Last 30 days</option>
                  <option value="90d">Last 90 days</option>
                  <option value="1y">Last year</option>
                </select>
              </div>

              {/* Export Button */}
              <button 
                onClick={exportReport}
                disabled={isLoading}
                className="flex items-center gap-2 text-sm font-medium px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
              >
                <Download className="w-4 h-4" />
                {isLoading ? 'Generating...' : 'Export Report'}
              </button>
            </div>
          </div>

          {/* Real-time System Health */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-green-800">System Health</span>
                <div className={`w-3 h-3 rounded-full ${getSystemHealthColor(realtimeData.systemHealth)}`} />
              </div>
              <div className="text-2xl font-bold text-green-700 capitalize">{realtimeData.systemHealth}</div>
            </div>
            
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-blue-800">Active Orders</span>
                <Package className="w-5 h-5 text-blue-600" />
              </div>
              <div className="text-2xl font-bold text-blue-700">{realtimeData.activeOrders}</div>
            </div>
            
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-purple-800">Pending Deliveries</span>
                <Truck className="w-5 h-5 text-purple-600" />
              </div>
              <div className="text-2xl font-bold text-purple-700">{realtimeData.pendingDeliveries}</div>
            </div>
            
            <div className="bg-gradient-to-r from-orange-50 to-yellow-50 border border-orange-200 rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-orange-800">Online Users</span>
                <Users className="w-5 h-5 text-orange-600" />
              </div>
              <div className="text-2xl font-bold text-orange-700">{realtimeData.onlineUsers}</div>
            </div>
          </div>

          {/* Enhanced Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { 
                label: "Registered Farmers", 
                value: analyticsData.totalFarmers.toLocaleString(), 
                icon: Wheat, 
                delta: `+${Math.floor(Math.random() * 200 + 50)} this month`, 
                color: "hsl(var(--primary))",
                growth: 8.5
              },
              { 
                label: "B2B Businesses", 
                value: analyticsData.totalBusinesses.toLocaleString(), 
                icon: Building2, 
                delta: `+${Math.floor(Math.random() * 20 + 5)} this month`, 
                color: "hsl(210 80% 45%)",
                growth: 12.3
              },
              { 
                label: "Active Customers", 
                value: analyticsData.totalOrders.toLocaleString(), 
                icon: Users, 
                delta: `+${Math.floor(Math.random() * 3000 + 500)} this month`, 
                color: "hsl(var(--success))",
                growth: 15.7
              },
              { 
                label: "Total Volume (MTD)", 
                value: `₹${(analyticsData.totalRevenue / 100000).toFixed(2)}L`, 
                icon: CreditCard, 
                delta: `+${(Math.random() * 10 + 2).toFixed(1)}% vs last month`, 
                color: "hsl(var(--secondary))",
                growth: 6.8
              },
            ].map((stat) => {
              const Icon = stat.icon;
              return (
                <div key={stat.label} className="stat-card">
                  <div className="flex items-start justify-between mb-3">
                    <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ background: `${stat.color}18` }}>
                      <Icon className="w-4 h-4" style={{ color: stat.color }} />
                    </div>
                    <div className="text-right">
                      <div className="text-xs font-medium text-green-600">
                        {stat.growth > 0 ? '+' : ''}{stat.growth}%
                      </div>
                      <ArrowUpRight className="w-3.5 h-3.5 text-green-600" />
                    </div>
                  </div>
                  <div className="text-2xl font-bold text-foreground mb-1">{stat.value}</div>
                  <div className="text-xs font-medium text-foreground mb-0.5">{stat.label}</div>
                  <div className="text-xs text-muted-foreground">{stat.delta}</div>
                </div>
              );
            })}
          </div>

          {/* Enhanced Charts */}
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Advanced Transaction Volume Chart */}
            <div className="lg:col-span-2 bg-card rounded-xl border border-border p-5" style={{ boxShadow: "var(--shadow-card)" }}>
              <div className="flex items-center justify-between mb-5">
                <div>
                  <h3 className="font-semibold text-foreground">Transaction Volume & Growth</h3>
                  <p className="text-xs text-muted-foreground">Monthly platform transaction flow with growth rates</p>
                </div>
              </div>
              <ResponsiveContainer width="100%" height={250}>
                <AreaChart data={filteredTransactionData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(150 12% 88%)" />
                  <XAxis dataKey="month" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={(v) => `₹${(v / 100000).toFixed(1)}L`} />
                  <Tooltip 
                    formatter={(v: number, name: string) => [
                      `₹${(v / 100000).toFixed(2)}L`, 
                      name === 'volume' ? 'Volume' : 'Orders'
                    ]} 
                  />
                  <Area 
                    type="monotone" 
                    dataKey="volume" 
                    stroke="hsl(150,57%,22%)" 
                    fill="url(#colorGradient)" 
                    strokeWidth={2}
                  />
                  <defs>
                    <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(150,57%,32%)" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="hsl(150,57%,22%)" stopOpacity={0.2}/>
                    </linearGradient>
                  </defs>
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* Enhanced Category Breakdown */}
            <div className="bg-card rounded-xl border border-border p-5" style={{ boxShadow: "var(--shadow-card)" }}>
              <h3 className="font-semibold text-foreground mb-4">Category Performance</h3>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie data={categoryPie} cx="50%" cy="50%" innerRadius={45} outerRadius={70} dataKey="value">
                    {categoryPie.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
                  </Pie>
                  <Tooltip formatter={(v, name) => [
                    `${v}%`, 
                    name,
                    categoryPie.find(c => c.name === name)?.growth ? `Growth: ${categoryPie.find(c => c.name === name)?.growth}%` : ''
                  ]} />
                </PieChart>
              </ResponsiveContainer>
              <div className="grid grid-cols-2 gap-2 mt-3">
                {categoryPie.map((c, i) => (
                  <div key={c.name} className="flex items-center gap-1.5 text-xs">
                    <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: PIE_COLORS[i] }} />
                    <div className="flex-1">
                      <span className="text-muted-foreground">{c.name}</span>
                      <div className="flex items-center gap-1">
                        <span className="font-semibold text-foreground">{c.value}%</span>
                        {c.growth > 0 && (
                          <span className="text-green-600 text-xs">(+{c.growth}%)</span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Pending Approvals */}
          <div className="bg-card rounded-xl border border-border" style={{ boxShadow: "var(--shadow-card)" }}>
            <div className="p-5 border-b border-border flex items-center justify-between">
              <h3 className="font-semibold text-foreground flex items-center gap-2">
                <Clock className="w-4 h-4" style={{ color: "hsl(var(--warning))" }} />
                Pending Approvals
                <span className="ml-1 text-xs px-2 py-0.5 rounded-full font-bold" style={{ background: "hsl(var(--warning) / 0.15)", color: "hsl(var(--warning))" }}>
                  {approvals.length}
                </span>
              </h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr style={{ background: "hsl(var(--muted) / 0.5)" }}>
                    {["ID", "Name", "Type", "Location", "Date", "Documents", "Actions"].map((h) => (
                      <th key={h} className="text-left text-xs font-semibold text-muted-foreground px-5 py-3">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {approvals.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="px-5 py-8 text-center text-muted-foreground text-sm">
                        All approvals processed ✅
                      </td>
                    </tr>
                  ) : (
                    approvals.map((a) => (
                      <tr key={a.id} className="data-table-row">
                        <td className="px-5 py-3.5 text-xs font-mono text-muted-foreground">{a.id}</td>
                        <td className="px-5 py-3.5 text-sm font-medium text-foreground">{a.name}</td>
                        <td className="px-5 py-3.5">
                          <span className={a.type === "Farmer" ? "badge-success" : "badge-info"}>{a.type}</span>
                        </td>
                        <td className="px-5 py-3.5 text-xs text-muted-foreground">{a.location}</td>
                        <td className="px-5 py-3.5 text-xs text-muted-foreground">{a.date}</td>
                        <td className="px-5 py-3.5">
                          <span className={a.docs === "Complete" ? "badge-success" : "badge-warning"}>{a.docs}</span>
                        </td>
                        <td className="px-5 py-3.5">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleApprove(a.id)}
                              className="flex items-center gap-1 text-xs px-2.5 py-1.5 rounded-lg font-medium transition-colors"
                              style={{ background: "hsl(var(--success) / 0.1)", color: "hsl(var(--success))" }}
                            >
                              <CheckCircle className="w-3.5 h-3.5" /> Approve
                            </button>
                            <button
                              onClick={() => handleReject(a.id)}
                              className="flex items-center gap-1 text-xs px-2.5 py-1.5 rounded-lg font-medium transition-colors"
                              style={{ background: "hsl(var(--destructive) / 0.1)", color: "hsl(var(--destructive))" }}
                            >
                              <XCircle className="w-3.5 h-3.5" /> Reject
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Recent Transactions */}
          <div className="bg-card rounded-xl border border-border" style={{ boxShadow: "var(--shadow-card)" }}>
            <div className="p-5 border-b border-border">
              <h3 className="font-semibold text-foreground">Recent Transactions</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr style={{ background: "hsl(var(--muted) / 0.5)" }}>
                    {["Txn ID", "From", "To", "Amount", "Mode", "Date", "Status"].map((h) => (
                      <th key={h} className="text-left text-xs font-semibold text-muted-foreground px-5 py-3">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {recentTransactions.map((t) => (
                    <tr key={t.id} className="data-table-row">
                      <td className="px-5 py-3.5 text-xs font-mono text-muted-foreground">{t.id}</td>
                      <td className="px-5 py-3.5 text-sm text-foreground">{t.from}</td>
                      <td className="px-5 py-3.5 text-sm text-foreground">{t.to}</td>
                      <td className="px-5 py-3.5 text-sm font-semibold text-foreground">{t.amount}</td>
                      <td className="px-5 py-3.5 text-xs text-muted-foreground">{t.mode}</td>
                      <td className="px-5 py-3.5 text-xs text-muted-foreground">{t.date}</td>
                      <td className="px-5 py-3.5">{txnStatus(t.status)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

    {/* farmers section */}
{activeTab === "farmers" && (
  <div className="space-y-6">

    {/* Farmers Header */}
    <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-6 border border-green-200">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h3 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Wheat className="w-6 h-6 text-green-600" />
            Farmers Management
          </h3>
          <p className="text-gray-600 mt-2">
            Manage all registered farmers and their details
          </p>
        </div>

        <span className="bg-green-600 text-white px-3 py-1 rounded-full text-sm font-medium">
          {analyticsData.totalFarmers.toLocaleString()} Total Farmers
        </span>
      </div>
    </div>

    {/* Farmers Table */}
    <div className="bg-white rounded-2xl border border-gray-200 p-4 overflow-x-auto">
      <table className="w-full text-sm">
        <thead className="bg-green-50 border-b border-green-200">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-700">Farmer</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-700">Status</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-700">Products</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-700">Orders</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-700">Revenue</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-700">Rating</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-700">Actions</th>
          </tr>
        </thead>

        <tbody className="divide-y divide-gray-200">
          {users
            .filter((user) => user.role === "farmer")
            .map((farmer) => (
              <tr key={farmer.id} className="hover:bg-green-50 transition">

                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                      <Wheat className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">{farmer.name}</div>
                      <div className="text-xs text-gray-500">{farmer.email}</div>
                    </div>
                  </div>
                </td>

                <td className="px-4 py-3">
                  <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(farmer.status)}`}>
                    {farmer.status}
                  </span>
                </td>

                <td className="px-4 py-3">{farmer.products || 0}</td>
                <td className="px-4 py-3">{farmer.totalOrders || 0}</td>
                <td className="px-4 py-3">₹{(farmer.revenue || 0).toLocaleString()}</td>

                <td className="px-4 py-3">
                  <div className="flex items-center gap-1">
                    <span>{farmer.rating || 0}</span>
                    <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                  </div>
                </td>

                <td className="px-4 py-3">
                  <button
                    onClick={() => {
                      setSelectedUser(farmer);
                      setShowFarmerDetails(true);
                    }}
                    className="bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded-lg text-xs font-medium transition"
                  >
                    Details
                  </button>
                </td>

              </tr>
            ))}
        </tbody>
      </table>
    </div>

    {/* Farmer Details Modal */}
    {showFarmerDetails && selectedUser && (
      <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
        
        <div className="bg-white rounded-2xl w-full max-w-3xl shadow-2xl">
          
          <div className="p-6">

            {/* Header */}
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-900">
                Farmer Details
              </h2>

              <button
                onClick={() => {
                  setShowFarmerDetails(false);
                  setSelectedUser(null);
                }}
                className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center"
              >
                ✕
              </button>
            </div>

            {/* Info Section */}
            <div className="grid md:grid-cols-2 gap-6 mb-6">

              <div className="bg-gray-50 rounded-xl p-4 space-y-2">
                <h4 className="font-semibold mb-3">Personal Info</h4>
                <p><strong>Name:</strong> {selectedUser.name}</p>
                <p><strong>Email:</strong> {selectedUser.email}</p>
                <p><strong>Phone:</strong> {selectedUser.phone}</p>
                <p><strong>Join Date:</strong> {selectedUser.joinDate}</p>
                <p><strong>Last Active:</strong> {selectedUser.lastActive}</p>
                <p>
                  <strong>Status:</strong>{" "}
                  <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(selectedUser.status)}`}>
                    {selectedUser.status}
                  </span>
                </p>
              </div>

              <div className="bg-green-50 rounded-xl p-4 space-y-2">
                <h4 className="font-semibold mb-3">Performance</h4>
                <p><strong>Total Products:</strong> {selectedUser.products || 0}</p>
                <p><strong>Total Orders:</strong> {selectedUser.totalOrders || 0}</p>
                <p><strong>Total Revenue:</strong> ₹{(selectedUser.revenue || 0).toLocaleString()}</p>
                <p><strong>Rating:</strong> ⭐ {selectedUser.rating || 0}</p>
              </div>

            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <button className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm">
                Edit
              </button>

              {selectedUser.status === "active" ? (
                <button className="bg-red-600 text-white px-4 py-2 rounded-lg text-sm">
                  Deactivate
                </button>
              ) : (
                <button className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm">
                  Activate
                </button>
              )}
            </div>

          </div>
        </div>
      </div>
    )}

  </div>
)}

      {/* customers section */}
      {activeTab === "customers" && (
        <div className="space-y-6">
          <h1 className="font-display text-2xl font-bold">Customers</h1>

          <div className="bg-card border border-border rounded-xl overflow-x-auto">
            <table className="w-full min-w-[800px]">
              <thead className="bg-muted">
                <tr>
                  {["ID", "Name", "Email", "Orders", "Spent", "Status", "Actions"].map((h) => (
                    <th key={h} className="px-5 py-3 text-left text-xs text-muted-foreground">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {customersData.map((c) => (
                  <tr key={c.id} className="data-table-row">
                    <td className="px-5 py-3 text-xs font-mono">{c.id}</td>
                    <td className="px-5 py-3 font-medium">{c.name}</td>
                    <td className="px-5 py-3 text-sm">{c.email}</td>
                    <td className="px-5 py-3 text-sm">{c.orders}</td>
                    <td className="px-5 py-3 font-semibold">{c.spent}</td>
                    <td className="px-5 py-3">
                      <span className={c.status === "Active" ? "badge-success" : "badge-destructive"}>
                        {c.status}
                      </span>
                    </td>
                    <td className="px-5 py-3">
                      <button
                        onClick={() => {
                          setSelectedCustomer(c);
                          setShowCustomerDetails(true);
                        }}
                        className="inline-flex items-center gap-2 px-3 py-1 text-xs font-medium text-blue-600 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 rounded-md transition-colors"
                      >
                        <Eye className="w-3 h-3" />
                        See Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Customer Details Modal */}
      {showCustomerDetails && selectedCustomer && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <Users className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">Customer Details</h3>
                    <p className="text-sm text-gray-600">ID: {selectedCustomer.id}</p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setShowCustomerDetails(false);
                    setSelectedCustomer(null);
                }}
                  className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors"
                >
                  <X className="w-4 h-4 text-gray-600" />
                </button>
              </div>

              <div className="space-y-6">
                {/* Personal Information */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="text-sm font-semibold text-gray-900 mb-3">Personal Information</h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">Full Name:</span>
                      <p className="font-medium text-gray-900">{selectedCustomer.name}</p>
                    </div>
                    <div>
                      <span className="text-gray-600">Email:</span>
                      <p className="font-medium text-gray-900">{selectedCustomer.email}</p>
                    </div>
                    <div>
                      <span className="text-gray-600">Phone:</span>
                      <p className="font-medium text-gray-900">{selectedCustomer.phone}</p>
                    </div>
                    <div>
                      <span className="text-gray-600">Join Date:</span>
                      <p className="font-medium text-gray-900">{selectedCustomer.joinDate}</p>
                    </div>
                    <div>
                      <span className="text-gray-600">Last Login:</span>
                      <p className="font-medium text-gray-900">{selectedCustomer.lastLogin}</p>
                    </div>
                  </div>
                </div>

                {/* Account Statistics */}
                <div className="bg-blue-50 rounded-lg p-4">
                  <h4 className="text-sm font-semibold text-gray-900 mb-3">Account Statistics</h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">Total Orders:</span>
                      <p className="font-medium text-gray-900">{selectedCustomer.orders}</p>
                    </div>
                    <div>
                      <span className="text-gray-600">Total Spent:</span>
                      <p className="font-medium text-gray-900">{selectedCustomer.spent}</p>
                    </div>
                  </div>
                </div>

                {/* Login Credentials */}
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <h4 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <Shield className="w-4 h-4 text-yellow-600" />
                    Login Credentials
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div>
                      <span className="text-gray-600">Email:</span>
                      <p className="font-mono text-gray-900 bg-white px-2 py-1 rounded border border-gray-200">
                        {selectedCustomer.email}
                      </p>
                    </div>
                    <div>
                      <span className="text-gray-600">Password:</span>
                      <p className="font-mono text-gray-900 bg-white px-2 py-1 rounded border border-gray-200">
                        {selectedCustomer.password}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Address */}
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <h4 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-green-600" />
                    Address
                  </h4>
                  <p className="text-sm text-gray-700 bg-white px-3 py-2 rounded border border-gray-200">
                    {selectedCustomer.address}
                  </p>
                </div>

                {/* Status Badge */}
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Account Status:</span>
                  <div className="flex items-center gap-2">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      selectedCustomer.status === "Active" 
                        ? "bg-green-100 text-green-700" 
                        : "bg-red-100 text-red-700"
                    }`}>
                      {selectedCustomer.status}
                    </span>
                    <button
                      onClick={() => {
                        // Toggle status
                        const updatedCustomers = customersData.map(c => 
                          c.id === selectedCustomer.id 
                            ? { ...c, status: c.status === "Active" ? "Blocked" : "Active" }
                            : c
                        );
                        // Update the actual data array
                        customersData.splice(customersData.findIndex(c => c.id === selectedCustomer.id), 1, updatedCustomers.find(c => c.id === selectedCustomer.id));
                        // Update the selected customer for modal
                        setSelectedCustomer(updatedCustomers.find(c => c.id === selectedCustomer.id));
                        console.log('Status changed for', selectedCustomer.id, 'from', selectedCustomer.status, 'to', selectedCustomer.status === "Active" ? "Blocked" : "Active");
                        
                        // If it's a farmer, also update the users array
                        if (selectedCustomer.id.startsWith('F-')) {
                          const updatedUsers = users.map(u => 
                            u.id === selectedCustomer.id 
                              ? { ...u, status: u.status === 'active' ? 'inactive' : 'active' }
                              : u
                          );
                          users.splice(users.findIndex(u => u.id === selectedCustomer.id), 1, updatedUsers.find(u => u.id === selectedCustomer.id) as AdminUser);
                          console.log('Farmer status also changed for', selectedCustomer.id, 'from', selectedCustomer.status, 'to', selectedCustomer.status === 'Active' ? "Blocked" : "Active");
                        }
                      }}
                      className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                        selectedCustomer.status === "Active" 
                          ? "bg-red-100 text-red-600 hover:bg-red-200" 
                          : "bg-green-100 text-green-600 hover:bg-green-200"
                      }`}
                      title={`Change status from ${selectedCustomer.status} to ${selectedCustomer.status === "Active" ? "Blocked" : "Active"}`}
                    >
                      {selectedCustomer.status === "Active" ? "Block" : "Activate"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* businesses section */}
      {activeTab === "businesses" && (
        <div className="space-y-6">
          <h1 className="font-display text-2xl font-bold">B2B Businesses</h1>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {businessData.map((b) => (
              <div key={b.id} className="bg-card border border-border rounded-xl p-5 space-y-2">
                <div className="flex justify-between items-center">
                  <h3 className="font-semibold">{b.name}</h3>
                  <span className={b.status === "Verified" ? "badge-success" : "badge-warning"}>
                    {b.status}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">GST: {b.gst}</p>
                <p className="text-sm">Orders: <span className="font-semibold">{b.orders}</span></p>
                <p className="text-sm">Volume: <span className="font-semibold">{b.volume}</span></p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* orders section */}
      {activeTab === "orders" && (
        <div className="space-y-6">
          <h1 className="font-display text-2xl font-bold">Order Management</h1>

          <div className="bg-card border border-border rounded-xl overflow-x-auto">
            <table className="w-full min-w-[1000px]">
              <thead className="bg-muted">
                <tr>
                  {["Order ID", "Customer", "Items", "Total", "Status", "Date", "Actions"].map((h) => (
                    <th key={h} className="px-5 py-3 text-left text-xs text-muted-foreground">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[
                  { id: "ORD-1001", customer: "FreshMart Wholesale", items: 12, total: "₹8,450", status: "Delivered", date: "2024-02-26" },
                  { id: "ORD-1002", customer: "Green Groceries", items: 8, total: "₹3,200", status: "Processing", date: "2024-02-27" },
                  { id: "ORD-1003", customer: "AgroFresh Pvt Ltd", items: 15, total: "₹12,800", status: "Pending", date: "2024-02-28" },
                ].map((order) => (
                  <tr key={order.id} className="data-table-row">
                    <td className="px-5 py-3 text-xs font-mono">{order.id}</td>
                    <td className="px-5 py-3 font-medium">{order.customer}</td>
                    <td className="px-5 py-3 text-sm">{order.items}</td>
                    <td className="px-5 py-3 font-semibold">{order.total}</td>
                    <td className="px-5 py-3">
                      <span className={
                        order.status === "Delivered" ? "badge-success" :
                        order.status === "Processing" ? "badge-warning" :
                        "badge-info"
                      }>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-sm">{order.date}</td>
                    <td className="px-5 py-3">
                      <button 
                        onClick={() => {
                          setSelectedTransaction(order);
                          setShowTransactionDetails(true);
                        }}
                        className="text-xs px-2 py-1 rounded bg-primary text-primary-foreground hover:bg-primary/90"
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* delivery section */}
      {activeTab === "delivery" && <DeliveryManagement />}

      {/* transactions section */}
      {activeTab === "transactions" && (
        <div className="space-y-6">
          <h1 className="font-display text-2xl font-bold">Transaction History</h1>

          <div className="bg-card border border-border rounded-xl overflow-x-auto">
            <table className="w-full min-w-[900px]">
              <thead className="bg-muted">
                <tr>
                  {["Txn ID", "User", "Amount", "Mode", "Status", "Date", "Actions"].map((h) => (
                    <th key={h} className="px-5 py-3 text-left text-xs text-muted-foreground">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {allTransactions.map((txn) => (
                  <tr key={txn.id} className="data-table-row">
                    <td className="px-5 py-3 text-xs font-mono">{txn.id}</td>
                    <td className="px-5 py-3 font-medium">{txn.user}</td>
                    <td className="px-5 py-3 font-semibold">{txn.amount}</td>
                    <td className="px-5 py-3 text-sm">{(txn as any).mode || 'N/A'}</td>
                    <td className="px-5 py-3">{txnStatus(txn.status)}</td>
                    <td className="px-5 py-3 text-sm">{txn.date}</td>
                    <td className="px-5 py-3">
                      <button 
                        onClick={() => {
                          setSelectedTransaction(txn);
                          setShowTransactionDetails(true);
                        }}
                        className="text-xs px-2 py-1 rounded bg-primary text-primary-foreground hover:bg-primary/90"
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Transaction Details Modal */}
      {showTransactionDetails && selectedTransaction && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <CreditCard className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">Transaction Details</h3>
                    <p className="text-sm text-gray-600">ID: {selectedTransaction.id}</p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setShowTransactionDetails(false);
                    setSelectedTransaction(null);
                  }}
                  className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors"
                >
                  <X className="w-4 h-4 text-gray-600" />
                </button>
              </div>

              <div className="space-y-6">
                {/* Transaction Information */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="text-sm font-semibold text-gray-900 mb-3">Transaction Information</h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">Transaction ID:</span>
                      <p className="font-medium text-gray-900">{selectedTransaction.id}</p>
                    </div>
                    <div>
                      <span className="text-gray-600">User:</span>
                      <p className="font-medium text-gray-900">{selectedTransaction.user}</p>
                    </div>
                    <div>
                      <span className="text-gray-600">Amount:</span>
                      <p className="font-medium text-gray-900">{selectedTransaction.amount}</p>
                    </div>
                    <div>
                      <span className="text-gray-600">Mode:</span>
                      <p className="font-medium text-gray-900">{selectedTransaction.mode}</p>
                    </div>
                    <div>
                      <span className="text-gray-600">Status:</span>
                      <p className="font-medium text-gray-900">{selectedTransaction.status}</p>
                    </div>
                    <div>
                      <span className="text-gray-600">Date:</span>
                      <p className="font-medium text-gray-900">{selectedTransaction.date}</p>
                    </div>
                  </div>
                </div>

                {/* Status Badge */}
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Transaction Status:</span>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    selectedTransaction.status === "Success" 
                      ? "bg-green-100 text-green-700" 
                      : selectedTransaction.status === "Pending" 
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-red-100 text-red-700"
                  }`}>
                    {selectedTransaction.status}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* wallet section */}
      {activeTab === "wallet" && (
        <div className="space-y-6">
          <AdminWalletComponent />
        </div>
      )}

      {/* analytics section */}
      {activeTab === "analytics" && (
        <div className="space-y-6">
          <h1 className="font-display text-2xl font-bold">Analytics Dashboard</h1>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: "Total Farmers", value: analyticsData.totalFarmers.toLocaleString(), icon: Users, change: `+${Math.floor(Math.random() * 100 + 50)}`, changeType: "increase" as const, color: "hsl(var(--primary))" },
              { label: "Total Businesses", value: analyticsData.totalBusinesses.toLocaleString(), icon: Building2, change: `+${Math.floor(Math.random() * 20 + 5)}`, changeType: "increase" as const, color: "hsl(210 80% 45%)" },
              { label: "Total Orders", value: analyticsData.totalOrders.toLocaleString(), icon: Package, change: `+${Math.floor(Math.random() * 500 + 200)}`, changeType: "increase" as const, color: "hsl(var(--success))" },
              { label: "Total Revenue", value: `₹${(analyticsData.totalRevenue / 100000).toFixed(2)}L`, icon: CreditCard, change: `+${(Math.random() * 15 + 5).toFixed(1)}%`, changeType: "increase" as const, color: "hsl(var(--secondary))" },
            ].map((stat) => {
              const Icon = stat.icon;
              return (
                <div key={stat.label} className="bg-card border border-border rounded-xl p-5 space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ background: `${stat.color}18` }}>
                      <Icon className="w-5 h-5" style={{ color: stat.color }} />
                    </div>
                    <div className="text-right">
                      <div className={`flex items-center gap-1 text-sm font-medium ${
                        stat.changeType === 'increase' ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {stat.changeType === 'increase' ? (
                          <ArrowUpRight className="w-3 h-3" />
                        ) : (
                          <ArrowUpRight className="w-3 h-3 rotate-180" />
                        )}
                        <span>{stat.change}</span>
                      </div>
                      <div className="text-xs text-muted-foreground">{stat.label}</div>
                    </div>
                  </div>
                  <div className="text-2xl font-bold text-foreground">{stat.value}</div>
                </div>
              );
            })}
          </div>

          {/* Advanced Charts Grid */}
          <div className="grid lg:grid-cols-2 gap-6 mb-6">
            {/* Revenue Trend Chart */}
            <div className="bg-card border border-border rounded-xl p-5">
              <h3 className="font-semibold text-foreground mb-4">Revenue Trend</h3>
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={transactionTrend}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(150 12% 88%)" />
                  <XAxis dataKey="month" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={(v) => `₹${(v / 100000).toFixed(1)}L`} />
                  <Tooltip formatter={(v: number) => [`₹${(v / 100000).toFixed(2)}L`, 'Revenue']} />
                  <Line type="monotone" dataKey="volume" stroke="hsl(150,57%,22%)" strokeWidth={2} dot={{ r: 3 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Order Volume Chart */}
            <div className="bg-card border border-border rounded-xl p-5">
              <h3 className="font-semibold text-foreground mb-4">Order Volume</h3>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={transactionTrend}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(150 12% 88%)" />
                  <XAxis dataKey="month" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
                  <Tooltip formatter={(v: number) => [v, 'Orders']} />
                  <Bar dataKey="count" fill="hsl(150,57%,22%)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Category Performance Table */}
          <div className="bg-card border border-border rounded-xl overflow-x-auto">
            <div className="p-5 border-b border-border">
              <h3 className="font-semibold text-foreground">Category Performance</h3>
            </div>
            <table className="w-full">
              <thead className="bg-muted">
                <tr>
                  {["Category", "Orders", "Revenue", "Growth", "Avg Order", "Market Share", "Actions"].map((h) => (
                    <th key={h} className="px-5 py-3 text-left text-xs text-muted-foreground">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[
                  { category: "Grains", orders: 1248, revenue: 2840000, growth: 12.5, avgOrder: 2275, marketShare: 38 },
                  { category: "Vegetables", orders: 1052, revenue: 2390000, growth: -5.2, avgOrder: 2271, marketShare: 32 },
                  { category: "Spices", orders: 592, revenue: 1340000, growth: 8.7, avgOrder: 2264, marketShare: 18 },
                  { category: "Fruits", orders: 394, revenue: 894000, growth: 15.3, avgOrder: 2269, marketShare: 12 },
                ].map((row, index) => (
                  <tr key={row.category} className="border-b border-border hover:bg-muted/50 transition-colors">
                    <td className="px-5 py-3 font-medium text-foreground">{row.category}</td>
                    <td className="px-5 py-3 text-right">{row.orders.toLocaleString()}</td>
                    <td className="px-5 py-3 text-right">₹{(row.revenue / 100000).toFixed(2)}L</td>
                    <td className="px-5 py-3 text-right">
                      <span className={row.growth > 0 ? 'text-green-600' : 'text-red-600'}>
                        {row.growth > 0 ? '+' : ''}{row.growth}%
                      </span>
                    </td>
                    <td className="px-5 py-3 text-right">₹{row.avgOrder.toLocaleString()}</td>
                    <td className="px-5 py-3 text-right">{row.marketShare}%</td>
                    <td className="px-5 py-3 text-right">
                      <button onClick={() => setShowFarmerDetails(true)} className="text-xs px-2 py-1 rounded bg-primary text-primary-foreground hover:bg-primary/90">
                        View Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* reports section */}
      {activeTab === "reports" && (
        <div className="space-y-6">
          <h1 className="font-display text-2xl font-bold">Reports</h1>

          <div className="grid md:grid-cols-3 gap-6">
            {["Sales Report", "Farmer Activity", "Monthly Revenue"].map((r) => (
              <div key={r} className="bg-card border border-border rounded-xl p-6 text-center">
                <h3 className="text-lg font-semibold text-foreground mb-2">{r}</h3>
                <p className="text-muted-foreground">Detailed {r} analytics coming soon...</p>
              </div>
            ))}
          </div>
        </div>
      )}

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
    </DashboardLayout>
  );
};

export default AdminDashboard;
