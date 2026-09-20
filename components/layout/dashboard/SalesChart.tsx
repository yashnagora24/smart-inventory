"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

type SalesData = {
  _id: {
    year: number;
    month: number;
  };
  revenue: number;
  sales: number;
};

type SalesChartProps = {
  data: SalesData[];
};

const monthNames = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

export default function SalesChart({ data }: SalesChartProps) {
  const chartData = data.map((item) => ({
    month: `${monthNames[item._id.month - 1]} ${item._id.year}`,
    revenue: item.revenue,
    sales: item.sales,
  }));

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      {/* Revenue Chart */}
      <div className="rounded-xl bg-white p-6 shadow-sm">
        <div className="mb-5">
          <h2 className="text-xl font-semibold text-gray-900">
            Revenue Overview
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Monthly revenue
          </p>
        </div>

        <div className="h-80 w-full">
          {chartData.length === 0 ? (
            <div className="flex h-full items-center justify-center text-gray-500">
              No revenue data available.
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />

                <XAxis dataKey="month" />

                <YAxis />

                <Tooltip
                  formatter={(value) =>
                    `₹${Number(value).toLocaleString("en-IN")}`
                  }
                />

                <Bar
                  dataKey="revenue"
                  name="Revenue"
                />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Sales Chart */}
      <div className="rounded-xl bg-white p-6 shadow-sm">
        <div className="mb-5">
          <h2 className="text-xl font-semibold text-gray-900">
            Sales Overview
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Monthly number of sales
          </p>
        </div>

        <div className="h-80 w-full">
          {chartData.length === 0 ? (
            <div className="flex h-full items-center justify-center text-gray-500">
              No sales data available.
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />

                <XAxis dataKey="month" />

                <YAxis />

                <Tooltip />

                <Bar
                  dataKey="sales"
                  name="Sales"
                />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
    </div>
  );
}