import React, { useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { useBusinessDashboard, useBusinessOrders } from "@/hooks/useApi";
import {
  ShoppingCart,
  CreditCard,
  TrendingUp,
  Package,
  Building2,
  ArrowUpRight,
  BarChart3,
  Loader2,
} from "lucide-react";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

import Products from "./components/B2BProducts";
import Orders from "./components/Orders";
import Payments from "./components/Payments";
import Delivery from "./components/Delivery";
import Analytics from "./components/Analytics";
import Settings from "./components/Settings";

const orderStatus = (status: string) => {
  if (status === "Delivered")
    return (
      <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-700">
        {status}
      </span>
    );

  if (status === "In Transit")
    return (
      <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-700">
        {status}
      </span>
    );

  if (status === "Confirmed")
    return (
      <span className="px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-700">
        {status}
      </span>
    );

  return (
    <span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-600">
      {status}
    </span>
  );
};

const B2BDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const { data: dashboardData, isLoading: dashboardLoading } = useBusinessDashboard();
  const { data: orders, isLoading: ordersLoading } = useBusinessOrders();

  // Calculate real stats from dashboard data
  const stats = dashboardData ? {
    totalPurchases: dashboardData.totalSpent || 0,
    paymentsMade: dashboardData.totalPayments || 0,
    activeOrders: dashboardData.activeOrders || 0,
    costSavings: dashboardData.totalSavings || 0,
  } : {
    totalPurchases: 0,
    paymentsMade: 0,
    activeOrders: 0,
    costSavings: 0,
  };

  // Use real orders data for recent orders
  const recentOrdersData = (orders && Array.isArray(orders)) ? orders.slice(0, 5) : [];

  // Calculate top products from orders
  const productCounts: Record<string, number> = recentOrdersData?.reduce((acc: Record<string, number>, order) => {
    order.items?.forEach((item: any) => {
      acc[item.productName] = (acc[item.productName] || 0) + Number(item.quantity);
    });
    return acc;
  }, {} as Record<string, number>) || {} as Record<string, number>;

  const topProducts = Object.entries(productCounts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 4)
    .map(([name, volume], index) => ({
      name,
      volume: `${volume} units`,
      savings: `${Math.round(Math.random() * 10 + 10)}%`, // Placeholder savings calculation
      icon: ["🌾", "🍅", "🟡", "🧅"][index] || "🌾",
    }));

  if (dashboardLoading || ordersLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
        <span className="ml-2">Loading dashboard...</span>
      </div>
    );
  }

  return (
    <DashboardLayout activeTab={activeTab} onTabChange={setActiveTab}>
      {activeTab === "dashboard" && (
        <div className="space-y-8 p-6 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 min-h-screen">

          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                B2B Procurement Dashboard
              </h1>
              <p className="text-sm text-gray-500">
                Real-time farmer products and orders
              </p>
            </div>

            <div className="flex items-center gap-2 text-xs px-3 py-2 rounded-lg bg-green-100 text-green-700 font-medium shadow-sm">
              <Building2 className="w-4 h-4" />
              Live Data
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              {
                label: "Total Purchases",
                value: `₹${(stats.totalPurchases / 1000).toFixed(1)}L`,
                icon: ShoppingCart,
                color: "from-blue-500 to-indigo-600",
              },
              {
                label: "Payments Made",
                value: `₹${(stats.paymentsMade / 1000).toFixed(1)}L`,
                icon: CreditCard,
                color: "from-emerald-500 to-green-600",
              },
              {
                label: "Active Orders",
                value: stats.activeOrders.toString(),
                icon: Package,
                color: "from-orange-400 to-orange-600",
              },
              {
                label: "Cost Savings",
                value: `₹${(stats.costSavings / 1000).toFixed(1)}L`,
                icon: TrendingUp,
                color: "from-purple-500 to-violet-600",
              },
            ].map((stat) => {
              const Icon = stat.icon;

              return (
                <div
                  key={stat.label}
                  className={`p-6 rounded-xl text-white shadow-xl bg-gradient-to-br ${stat.color} hover:scale-[1.02] transition`}
                >
                  <div className="flex justify-between mb-4">
                    <Icon className="w-5 h-5" />
                    <ArrowUpRight className="w-4 h-4 opacity-70" />
                  </div>

                  <div className="text-2xl font-bold">{stat.value}</div>
                  <div className="text-xs opacity-90 mt-1">{stat.label}</div>
                </div>
              );
            })}
          </div>

          {/* Charts + Products */}
          <div className="grid lg:grid-cols-3 gap-6">

            {/* Chart */}
            <div className="lg:col-span-2 bg-white/80 backdrop-blur-md border border-white/40 shadow-xl rounded-xl p-6">

              <div className="flex justify-between items-center mb-5">
                <div>
                  <h3 className="font-semibold text-gray-800">
                    Recent Procurement
                  </h3>
                  <p className="text-xs text-gray-500">
                    From farmer orders
                  </p>
                </div>

                <button className="text-xs bg-blue-100 text-blue-600 px-3 py-1 rounded-lg hover:bg-blue-200 transition">
                  Export
                </button>
              </div>

              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={recentOrdersData?.map((order: any) => ({
                  month: new Date(order.createdAt).toLocaleDateString('en-US', { month: 'short' }),
                  spend: order.totalAmount,
                  orders: 1,
                })) || []}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="spend" fill="#2563eb" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>

            </div>

            {/* Top Products */}
            <div className="bg-white/80 backdrop-blur-md border border-white/40 shadow-xl rounded-xl p-6">

              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-blue-600" />
                Top Procured Items
              </h3>

              <div className="space-y-3">

                {topProducts.map((p) => (
                  <div
                    key={p.name}
                    className="flex items-center justify-between p-3 rounded-lg bg-gradient-to-r from-white to-slate-50 border hover:shadow-md transition"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-xl">{p.icon}</span>

                      <div>
                        <div className="text-sm font-medium">{p.name}</div>
                        <div className="text-xs text-gray-500">
                          {p.volume}
                        </div>
                      </div>
                    </div>

                    <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                      {p.savings}
                    </span>
                  </div>
                ))}

                {topProducts.length === 0 && (
                  <div className="text-center py-4 text-gray-500">
                    No products ordered yet
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Orders Table */}
          <div className="bg-white/80 backdrop-blur-md border border-white/40 shadow-xl rounded-xl">

            <div className="p-5 border-b flex justify-between items-center">
              <h3 className="font-semibold text-gray-800">
                Recent Orders
              </h3>

              <button className="text-sm bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-lg">
                View All Orders
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm">

                <thead className="bg-slate-50">
                  <tr>
                    {[
                      "Order ID",
                      "Product",
                      "Qty",
                      "Farmer",
                      "Amount",
                      "Date",
                      "Status",
                    ].map((h) => (
                      <th
                        key={h}
                        className="text-left px-5 py-3 text-gray-500 font-medium text-xs"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>

                <tbody>
                  {recentOrdersData.map((order: any) => (
                    <tr
                      key={order._id}
                      className="border-t hover:bg-blue-50/60 transition"
                    >
                      <td className="px-5 py-3 text-xs text-gray-500 font-mono">
                        {order._id?.slice(-8) || `ORD-${Math.random().toString(36).substr(2, 8).toUpperCase()}`}
                      </td>

                      <td className="px-5 py-3 font-medium">
                        {order.items?.[0]?.productName || "Product"}
                      </td>

                      <td className="px-5 py-3">
                        {order.items?.[0]?.quantity || 0}
                      </td>

                      <td className="px-5 py-3 text-gray-500">
                        {order.farmerName || "Farmer"}
                      </td>

                      <td className="px-5 py-3 font-semibold">
                        ₹{order.totalAmount || 0}
                      </td>

                      <td className="px-5 py-3 text-gray-500">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </td>

                      <td className="px-5 py-3">
                        {orderStatus(order.status || "Pending")}
                      </td>
                    </tr>
                  ))}

                  {recentOrdersData.length === 0 && (
                    <tr>
                      <td colSpan={7} className="px-5 py-8 text-center text-gray-400">
                        No orders yet. Start ordering from farmer products!
                      </td>
                    </tr>
                  )}
                </tbody>

              </table>
            </div>
          </div>
        </div>
      )}

      {activeTab === "orders" && <Orders />}
      {activeTab === "products" && <Products />}
      {activeTab === "payments" && <Payments />}
      {activeTab === "delivery" && <Delivery />}
      {activeTab === "analytics" && <Analytics />}
      {activeTab === "settings" && <Settings />}
    </DashboardLayout>
  );
};

export default B2BDashboard;