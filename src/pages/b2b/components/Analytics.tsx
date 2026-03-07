import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

const procurementData = [
  { month: "Jan", spend: 12000 },
  { month: "Feb", spend: 18000 },
  { month: "Mar", spend: 15000 },
  { month: "Apr", spend: 22000 },
  { month: "May", spend: 20000 },
];

const Analytics = () => {
  return (
    <div className="space-y-6">

      <div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-green-500 to-emerald-600 bg-clip-text text-transparent">
          Procurement Analytics
        </h1>
        <p className="text-gray-500 text-sm">
          Monthly spending insights
        </p>
      </div>

      {/* KPI CARDS */}

      <div className="grid md:grid-cols-3 gap-6">

        <div className="bg-gradient-to-br from-green-500 to-emerald-600 text-white p-6 rounded-xl shadow-lg">
          <p className="text-sm opacity-80">Total Spend</p>
          <h2 className="text-2xl font-bold">₹87,000</h2>
        </div>

        <div className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white p-6 rounded-xl shadow-lg">
          <p className="text-sm opacity-80">Total Orders</p>
          <h2 className="text-2xl font-bold">126</h2>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-pink-600 text-white p-6 rounded-xl shadow-lg">
          <p className="text-sm opacity-80">Active Suppliers</p>
          <h2 className="text-2xl font-bold">32</h2>
        </div>

      </div>

      {/* CHART */}

      <div className="bg-white border rounded-xl p-6 shadow-sm">

        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={procurementData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="spend"
              stroke="#22c55e"
              strokeWidth={3}
            />
          </LineChart>
        </ResponsiveContainer>

      </div>

    </div>
  );
};

export default Analytics;