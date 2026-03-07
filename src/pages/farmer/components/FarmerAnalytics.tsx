import React from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";

import { earningsData } from "../FarmerDashboard";

const FarmerAnalytics = () => {
  return (
    <div className="space-y-8">

      {/* HEADER */}

      <div className="bg-gradient-to-r from-green-600 to-emerald-500 p-6 rounded-2xl text-white shadow">

        <h1 className="text-2xl font-bold">
          Sales Analytics
        </h1>

        <p className="text-sm opacity-90">
          Monitor your monthly farm sales and earnings
        </p>

      </div>

      {/* BAR CHART */}

      <div className="bg-white border border-green-100 rounded-2xl p-6 shadow-sm">

        <h2 className="font-semibold mb-4 text-gray-700">
          Monthly Revenue
        </h2>

        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={earningsData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Bar
              dataKey="aswamithra"
              fill="#16a34a"
              radius={[6, 6, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>

      </div>

      {/* AREA CHART */}

      <div className="bg-white border border-green-100 rounded-2xl p-6 shadow-sm">

        <h2 className="font-semibold mb-4 text-gray-700">
          Sales Growth
        </h2>

        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={earningsData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />

            <Area
              type="monotone"
              dataKey="aswamithra"
              stroke="#16a34a"
              fill="#bbf7d0"
            />

          </AreaChart>
        </ResponsiveContainer>

      </div>

    </div>
  );
};

export default FarmerAnalytics;