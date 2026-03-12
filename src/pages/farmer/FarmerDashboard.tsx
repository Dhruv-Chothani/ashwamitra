import React, { useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import {
  Package, ShoppingCart, CreditCard, TrendingUp, Bell, ArrowUpRight,
  ArrowDownRight, Star, MapPin, Wheat, CheckCircle, Clock, AlertCircle, Loader2
} from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts";
import FarmerProducts from "./components/FarmerProducts";
import FarmerOrders from "./components/FarmerOrders";
import FarmerPayments from "./components/FarmerPayments";
import FarmerAnalytics from "./components/FarmerAnalytics";
import FarmerNotification from "./components/FarmerNotification";
import FarmerSettings from "./components/FarmerSettings";
import { useFarmerDashboard, useMyProducts, useNotifications, useFarmerOrders } from "@/hooks/useApi";
import { useAuth } from "@/context/AuthContext";

export const statusBadge = (status: string) => {
  if (status === "Available" || status === "available") return <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-700">{status}</span>;
  if (status === "Low Stock") return <span className="px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-700">{status}</span>;
  return <span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-600">{status}</span>;
};

const FarmerDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const { profile } = useAuth();
  const { data: dashboardData, isLoading: dashLoading } = useFarmerDashboard();
  const { data: products, isLoading: prodsLoading } = useMyProducts();
  const { data: notifications } = useNotifications();
  const { data: orders } = useFarmerOrders();
  const [chartProduct, setChartProduct] = useState("all");
  const [chartType, setChartType] = useState<"bar" | "line">("bar");

  const stats = dashboardData || {};

  // Build live chart data from orders - product-wise sold qty
  const buildChartData = () => {
    if (!orders || !Array.isArray(orders) || orders.length === 0) return [];
    const monthMap: Record<string, Record<string, number>> = {};
    orders.forEach((order: any) => {
      if (!order.createdAt) return;
      const month = new Date(order.createdAt).toLocaleDateString("en-US", { month: "short", year: "2-digit" });
      if (!monthMap[month]) monthMap[month] = {};
      (order.items || []).forEach((item: any) => {
        const name = item.productName || "Unknown";
        if (chartProduct !== "all" && name !== chartProduct) return;
        monthMap[month][name] = (monthMap[month][name] || 0) + (item.quantity || 0);
      });
    });
    return Object.entries(monthMap).map(([month, prods]) => {
      const total = Object.values(prods).reduce((s, v) => s + v, 0);
      return { month, qty: total, ...prods };
    });
  };

  const chartData = buildChartData();
  const productNames = Array.from(new Set(
    (orders || []).flatMap((o: any) => (o.items || []).map((i: any) => i.productName)).filter(Boolean)
  ));

  return (
    <DashboardLayout activeTab={activeTab} onTabChange={setActiveTab}>
      {activeTab === "dashboard" && (
        <div className="space-y-6">
          {/* Header */}
          <div className="bg-gradient-to-r from-green-700 via-emerald-600 to-lime-500 rounded-2xl p-4 sm:p-6 text-white shadow-lg">
            <h1 className="text-xl sm:text-2xl font-bold">Farmer Dashboard</h1>
            <p className="text-white/80 text-xs sm:text-sm">Manage your produce and track your earnings</p>
          </div>

          {/* Location */}
          {profile && (
            <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-500">
              <MapPin className="w-4 h-4 text-green-600"/>
              <span>{profile.village || ""} · {profile.mandal || ""} · {profile.state || ""} · {profile.pinCode || ""}</span>
            </div>
          )}

          {/* Stats */}
          {dashLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-6 h-6 animate-spin text-green-600" />
              <span className="ml-2 text-sm text-gray-500">Loading dashboard...</span>
            </div>
          ) : (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              {[
                { label: "Total Products", value: stats.totalProducts ?? products?.length ?? 0, icon: Package, delta: "Active listings", up: true },
                { label: "Products Sold", value: `${stats.totalSold ?? 0} kg`, icon: ShoppingCart, delta: "Total sold", up: true },
                { label: "Pending Payments", value: `₹${(stats.pendingPayments ?? 0).toLocaleString()}`, icon: CreditCard, delta: `${stats.pendingCount ?? 0} transactions`, up: false },
                { label: "Total Earnings", value: `₹${(stats.totalEarnings ?? 0).toLocaleString()}`, icon: TrendingUp, delta: "Via ASWAMITHRA", up: true },
              ].map((stat) => {
                const Icon = stat.icon;
                return (
                  <div key={stat.label} className="bg-gradient-to-br from-white to-green-50 border border-green-100 rounded-xl p-3 sm:p-5 shadow-sm hover:shadow-lg transition">
                    <div className="flex justify-between mb-2 sm:mb-3">
                      <div className="p-1.5 sm:p-2 rounded-lg bg-green-100"><Icon className="w-3 h-3 sm:w-4 sm:h-4 text-green-700"/></div>
                      <span className={`flex items-center text-xs font-medium ${stat.up ? "text-green-600" : "text-yellow-600"}`}>
                        {stat.up ? <ArrowUpRight className="w-3 h-3"/> : <ArrowDownRight className="w-3 h-3"/>}
                      </span>
                    </div>
                    <div className="text-base sm:text-xl font-bold text-gray-800">{stat.value}</div>
                    <div className="text-xs text-gray-600">{stat.label}</div>
                    <div className="text-xs text-gray-400 hidden sm:block">{stat.delta}</div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Live Product Sold Chart */}
          <div className="bg-gradient-to-br from-white to-green-50 border border-green-100 rounded-2xl p-4 sm:p-6 shadow-md">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-4">
              <div>
                <h3 className="font-semibold text-gray-800">Products Sold (Live)</h3>
                <p className="text-xs text-gray-500">Quantity sold by product and month</p>
              </div>
              <div className="flex flex-wrap gap-2">
                <select value={chartProduct} onChange={e => setChartProduct(e.target.value)}
                  className="text-xs border rounded-lg px-2 py-1.5 bg-white">
                  <option value="all">All Products</option>
                  {productNames.map(n => <option key={n} value={n}>{n}</option>)}
                </select>
                <div className="flex rounded-lg border overflow-hidden">
                  <button onClick={() => setChartType("bar")}
                    className={`px-3 py-1.5 text-xs font-medium ${chartType === "bar" ? "bg-green-600 text-white" : "bg-white text-gray-600"}`}>
                    Bar
                  </button>
                  <button onClick={() => setChartType("line")}
                    className={`px-3 py-1.5 text-xs font-medium ${chartType === "line" ? "bg-green-600 text-white" : "bg-white text-gray-600"}`}>
                    Line
                  </button>
                </div>
              </div>
            </div>
            {chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height={250}>
                {chartType === "bar" ? (
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3"/>
                    <XAxis dataKey="month" tick={{ fontSize: 12 }}/>
                    <YAxis tick={{ fontSize: 12 }}/>
                    <Tooltip />
                    <Bar dataKey="qty" name="Qty Sold" fill="#16a34a" radius={[6, 6, 0, 0]} />
                  </BarChart>
                ) : (
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3"/>
                    <XAxis dataKey="month" tick={{ fontSize: 12 }}/>
                    <YAxis tick={{ fontSize: 12 }}/>
                    <Tooltip />
                    <Line type="monotone" dataKey="qty" name="Qty Sold" stroke="#16a34a" strokeWidth={3} />
                  </LineChart>
                )}
              </ResponsiveContainer>
            ) : (
              <div className="text-center py-12 text-gray-400 text-sm">No sales data yet. Orders will appear here.</div>
            )}
          </div>

          {/* Notifications */}
          <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-3 bg-gradient-to-br from-white to-green-50 border border-green-100 rounded-2xl p-4 sm:p-6 shadow-md">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <Bell className="w-4 h-4 text-green-600"/>
                Recent Notifications
              </h3>
              <div className="space-y-3">
                {(notifications || []).slice(0, 4).map((n: any) => (
                  <div key={n._id || n.id} className="flex items-start gap-3 p-3 bg-white border border-gray-100 rounded-lg hover:shadow-sm transition">
                    <CheckCircle className="w-4 h-4 mt-1 text-green-600"/>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-semibold truncate">{n.title}</div>
                      <div className="text-xs text-gray-500 truncate">{n.message}</div>
                      <div className="text-xs text-gray-400">{n.createdAt ? new Date(n.createdAt).toLocaleDateString() : ""}</div>
                    </div>
                  </div>
                ))}
                {(!notifications || notifications.length === 0) && (
                  <p className="text-xs text-gray-400 text-center py-4">No notifications yet</p>
                )}
              </div>
            </div>
          </div>

          {/* Products Table */}
          <div className="bg-gradient-to-br from-white to-green-50 border border-green-100 rounded-2xl shadow-md">
            <div className="flex justify-between items-center p-4 sm:p-5 border-b">
              <h3 className="font-semibold text-gray-800">My Products</h3>
              <button
                onClick={() => setActiveTab("products")}
                className="px-3 sm:px-4 py-2 text-xs font-semibold rounded-lg bg-gradient-to-r from-green-600 to-emerald-500 text-white shadow hover:shadow-md"
              >
                + Add Product
              </button>
            </div>
            <div className="overflow-x-auto">
              {prodsLoading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="w-5 h-5 animate-spin text-green-600" />
                </div>
              ) : (
                <table className="w-full">
                  <thead className="bg-green-50">
                    <tr>
                      {["Product","Category","Quantity","Price","Status"].map((h)=>(
                        <th key={h} className="px-3 sm:px-5 py-3 text-xs text-gray-500 text-left">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {(products || []).slice(0, 5).map((p: any) => (
                      <tr key={p._id} className="hover:bg-green-50 transition">
                        <td className="px-3 sm:px-5 py-3 text-sm font-medium">{p.name}</td>
                        <td className="px-3 sm:px-5 py-3 text-sm text-gray-500">{p.category}</td>
                        <td className="px-3 sm:px-5 py-3 text-sm">{p.availableQuantity} {p.unit}</td>
                        <td className="px-3 sm:px-5 py-3 text-sm font-semibold">₹{p.pricePerUnit}/{p.unit}</td>
                        <td className="px-3 sm:px-5 py-3">
                          {statusBadge(
                            p.isAvailable === false
                              ? "Out of Stock"
                              : p.availableQuantity <= 5
                                ? "Low Stock"
                                : "Available"
                          )}
                        </td>
                      </tr>
                    ))}
                    {(!products || products.length === 0) && (
                      <tr><td colSpan={5} className="px-5 py-8 text-center text-sm text-gray-400">No products listed yet</td></tr>
                    )}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
      )}

      {activeTab === "products" && <FarmerProducts/>}
      {activeTab === "orders" && <FarmerOrders/>}
      {activeTab === "payments" && <FarmerPayments/>}
      {activeTab === "analytics" && <FarmerAnalytics/>}
      {activeTab === "notifications" && <FarmerNotification/>}
      {activeTab === "settings" && <FarmerSettings/>}
    </DashboardLayout>
  );
};

export default FarmerDashboard;
