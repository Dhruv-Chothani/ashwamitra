import React, { useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import {
  ShoppingCart,
  CreditCard,
  TrendingUp,
  Package,
  Building2,
  ArrowUpRight,
  BarChart3,
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

export const procurementData = [
  { month: "Aug", spend: 145000, orders: 12 },
  { month: "Sep", spend: 188000, orders: 16 },
  { month: "Oct", spend: 162000, orders: 14 },
  { month: "Nov", spend: 210000, orders: 18 },
  { month: "Dec", spend: 245000, orders: 22 },
  { month: "Jan", spend: 228000, orders: 20 },
];

export const recentOrders = [
  {
    id: "ORD-2401",
    product: "Basmati Rice",
    qty: "2000 kg",
    farmer: "Ramu Reddy, Nalgonda",
    amount: "₹1,36,000",
    status: "Delivered",
    date: "Jan 18",
  },
  {
    id: "ORD-2398",
    product: "Tomatoes",
    qty: "500 kg",
    farmer: "Suresh Kumar, Warangal",
    amount: "₹17,500",
    status: "In Transit",
    date: "Jan 20",
  },
  {
    id: "ORD-2392",
    product: "Turmeric",
    qty: "200 kg",
    farmer: "Lakshmi Bai, Nizamabad",
    amount: "₹19,000",
    status: "Confirmed",
    date: "Jan 22",
  },
  {
    id: "ORD-2390",
    product: "Onions",
    qty: "1000 kg",
    farmer: "Govind Rao, Adilabad",
    amount: "₹28,000",
    status: "Pending",
    date: "Jan 23",
  },
];

export const orderStatus = (status: string) => {
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

const topProducts = [
  { name: "Basmati Rice", volume: "12,400 kg", savings: "18%", icon: "🌾" },
  { name: "Turmeric", volume: "2,800 kg", savings: "22%", icon: "🟡" },
  { name: "Tomatoes", volume: "5,200 kg", savings: "15%", icon: "🍅" },
  { name: "Onions", volume: "8,000 kg", savings: "12%", icon: "🧅" },
];

const B2BDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState("dashboard");

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
                Manage orders, suppliers and analytics
              </p>
            </div>

            <div className="flex items-center gap-2 text-xs px-3 py-2 rounded-lg bg-green-100 text-green-700 font-medium shadow-sm">
              <Building2 className="w-4 h-4" />
              GSTIN Verified
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              {
                label: "Total Purchases",
                value: "₹11.78L",
                icon: ShoppingCart,
                color: "from-blue-500 to-indigo-600",
              },
              {
                label: "Payments Made",
                value: "₹10.24L",
                icon: CreditCard,
                color: "from-emerald-500 to-green-600",
              },
              {
                label: "Active Orders",
                value: "6",
                icon: Package,
                color: "from-orange-400 to-orange-600",
              },
              {
                label: "Cost Savings",
                value: "₹2.14L",
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
                    Monthly Procurement
                  </h3>
                  <p className="text-xs text-gray-500">
                    Spending analytics
                  </p>
                </div>

                <button className="text-xs bg-blue-100 text-blue-600 px-3 py-1 rounded-lg hover:bg-blue-200 transition">
                  Export
                </button>
              </div>

              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={procurementData}>
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
                + New Order
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
                  {recentOrders.map((o) => (
                    <tr
                      key={o.id}
                      className="border-t hover:bg-blue-50/60 transition"
                    >
                      <td className="px-5 py-3 text-xs text-gray-500 font-mono">
                        {o.id}
                      </td>

                      <td className="px-5 py-3 font-medium">
                        {o.product}
                      </td>

                      <td className="px-5 py-3">{o.qty}</td>

                      <td className="px-5 py-3 text-gray-500">
                        {o.farmer}
                      </td>

                      <td className="px-5 py-3 font-semibold">
                        {o.amount}
                      </td>

                      <td className="px-5 py-3 text-gray-500">
                        {o.date}
                      </td>

                      <td className="px-5 py-3">
                        {orderStatus(o.status)}
                      </td>
                    </tr>
                  ))}
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