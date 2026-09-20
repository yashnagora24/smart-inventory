"use client";

import { useState, useEffect } from "react";
import SalesChart from "@/components/layout/dashboard/SalesChart";
import { Package, TrendingUp, DollarSign, AlertTriangle, XCircle, ArrowRight, ArrowUpRight } from "lucide-react";

export default function DashboardPage() {

  const [stats, setStats] = useState({
    totalProducts: 0,
    lowStockProducts: 0,
    outOfStockProducts: 0,
    totalSales: 0,
    totalRevenue: 0,
  });

  const [recentSales, setRecentSales] = useState<unknown[]>([]);
  const [lowStockProducts, setLowStockProducts] = useState<{
    _id: string;
    name: string;
    stock: number;
    status: string;
  }[]>([]);

  const [monthlySales, setMonthlySales] = useState<{
    _id: {
      year: number;
      month: number;
    };
    revenue: number;
    sales: number;
  }[]>([]);

  const [loading, setLoading] = useState(true);


  useEffect(() => {

    const fetchDashboardStats = async () => {

      try {
        const res = await fetch("/api/dashboard")

        const data = await res.json();

        if (!res.ok) {
          throw new Error(
            data.message || "Failed to fetch dashboard data"
          );
        }

        setStats(data.Stats);
        setRecentSales(data.recentSales)
        setLowStockProducts(data.lowStockProducts)
        setMonthlySales(data.monthlySales);

      } catch (error) {
        console.error("Dashboard stats error:", error);
      } finally {
        setLoading(false);
      }

    };

    fetchDashboardStats();
  }, []);

  return (
    <main className="max-w-7xl mx-auto space-y-6 p-4 sm:p-6 md:p-8 animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight">Dashboard Overview</h1>
          <p className="mt-2 text-sm md:text-base text-gray-500 font-medium">Welcome back! Here&apos;s what&apos;s happening with your inventory today.</p>
        </div>
        <div className="flex items-center gap-2">
           <span className="inline-flex items-center gap-1.5 rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">
             <span className="h-1.5 w-1.5 rounded-full bg-green-500"></span>
             Live Data
           </span>
        </div>
      </div>
      
      {/* Stats */}
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-5">
        <div className="group relative overflow-hidden rounded-2xl bg-white p-5 sm:p-6 shadow-sm ring-1 ring-gray-200 transition-all hover:shadow-md hover:ring-gray-300">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-gray-500">Total Products</p>
            <div className="rounded-lg bg-blue-50 p-2 text-blue-600 transition-colors group-hover:bg-blue-100"><Package className="h-5 w-5" /></div>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <h2 className="text-3xl font-bold text-gray-900 tracking-tight">{loading ? "..." : stats.totalProducts}</h2>
          </div>
          <p className="mt-2 flex items-center gap-1 text-sm font-medium text-green-600">
            <ArrowUpRight className="h-4 w-4" /> 12% <span className="text-gray-400 font-normal">from last month</span>
          </p>
        </div>

        <div className="group relative overflow-hidden rounded-2xl bg-white p-5 sm:p-6 shadow-sm ring-1 ring-gray-200 transition-all hover:shadow-md hover:ring-gray-300">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-gray-500">Total Sales</p>
            <div className="rounded-lg bg-indigo-50 p-2 text-indigo-600 transition-colors group-hover:bg-indigo-100"><TrendingUp className="h-5 w-5" /></div>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <h2 className="text-3xl font-bold text-gray-900 tracking-tight">{loading ? "..." : stats.totalSales}</h2>
          </div>
          <p className="mt-2 flex items-center gap-1 text-sm font-medium text-green-600">
            <ArrowUpRight className="h-4 w-4" /> 8.5% <span className="text-gray-400 font-normal">from last month</span>
          </p>
        </div>

        <div className="group relative overflow-hidden rounded-2xl bg-white p-5 sm:p-6 shadow-sm ring-1 ring-gray-200 transition-all hover:shadow-md hover:ring-gray-300">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-gray-500">Total Revenue</p>
            <div className="rounded-lg bg-emerald-50 p-2 text-emerald-600 transition-colors group-hover:bg-emerald-100"><DollarSign className="h-5 w-5" /></div>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <h2 className="text-3xl font-bold text-gray-900 tracking-tight">{loading ? "..." : `₹${stats.totalRevenue.toLocaleString("en-IN")}`}</h2>
          </div>
          <p className="mt-2 flex items-center gap-1 text-sm font-medium text-green-600">
            <ArrowUpRight className="h-4 w-4" /> 5.2% <span className="text-gray-400 font-normal">from last month</span>
          </p>
        </div>

        <div className="group relative overflow-hidden rounded-2xl bg-white p-5 sm:p-6 shadow-sm ring-1 ring-gray-200 transition-all hover:shadow-md hover:ring-gray-300">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-gray-500">Low Stock</p>
            <div className="rounded-lg bg-amber-50 p-2 text-amber-600 transition-colors group-hover:bg-amber-100"><AlertTriangle className="h-5 w-5" /></div>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <h2 className="text-3xl font-bold text-gray-900 tracking-tight">{loading ? "..." : stats.lowStockProducts}</h2>
          </div>
          <p className="mt-2 text-sm font-medium text-amber-600">Requires attention</p>
        </div>

        <div className="group relative overflow-hidden rounded-2xl bg-white p-5 sm:p-6 shadow-sm ring-1 ring-gray-200 transition-all hover:shadow-md hover:ring-gray-300">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-gray-500">Out of Stock</p>
            <div className="rounded-lg bg-red-50 p-2 text-red-600 transition-colors group-hover:bg-red-100"><XCircle className="h-5 w-5" /></div>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <h2 className="text-3xl font-bold text-gray-900 tracking-tight">{loading ? "..." : stats.outOfStockProducts}</h2>
          </div>
          <p className="mt-2 text-sm font-medium text-red-600">Action required</p>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-3 items-start">
        {/* Recent Sales */}
        <div className="lg:col-span-2 rounded-2xl bg-white shadow-sm ring-1 ring-gray-200 overflow-hidden flex flex-col">
          <div className="flex items-center justify-between border-b border-gray-100 p-4 sm:p-6 bg-white">
            <h2 className="text-lg font-bold text-gray-900">Recent Sales</h2>
            <button className="group flex items-center gap-1 text-sm font-semibold text-blue-600 hover:text-blue-700 transition-colors">
              View All <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/50">
                  <th className="py-4 px-6 text-xs font-semibold uppercase tracking-wider text-gray-500">Customer</th>
                  <th className="py-4 px-6 text-xs font-semibold uppercase tracking-wider text-gray-500">Product</th>
                  <th className="py-4 px-6 text-xs font-semibold uppercase tracking-wider text-gray-500">Amount</th>
                  <th className="py-4 px-6 text-xs font-semibold uppercase tracking-wider text-gray-500">Status</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100">
                {recentSales.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="py-8 text-center text-sm text-gray-500 font-medium">
                      No recent sales found
                    </td>
                  </tr>
                ) : (
                  recentSales.map((sale) => {
                    const saleData = sale as {
                      _id: string;
                      customerName: string;
                      productName: string;
                      totalAmount: number;
                      status: string;
                    };
                    return (
                      <tr key={saleData._id} className="hover:bg-gray-50/50 transition-colors">
                        <td className="py-4 px-6 whitespace-nowrap">
                          <div className="font-semibold text-gray-900">{saleData.customerName}</div>
                        </td>
                        <td className="py-4 px-6 whitespace-nowrap">
                          <div className="font-medium text-gray-600">{saleData.productName}</div>
                        </td>
                        <td className="py-4 px-6 whitespace-nowrap">
                          <div className="font-bold text-gray-900">₹{saleData.totalAmount.toLocaleString("en-IN")}</div>
                        </td>
                        <td className="py-4 px-6 whitespace-nowrap">
                          <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                            saleData.status === "Completed"
                              ? "bg-green-100 text-green-700"
                              : "bg-amber-100 text-amber-700"
                          }`}>
                            {saleData.status}
                          </span>
                        </td>
                      </tr>
                    )
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Low Stock */}
        <div className="rounded-2xl bg-white shadow-sm ring-1 ring-gray-200 flex flex-col">
          <div className="flex items-center justify-between border-b border-gray-100 p-4 sm:p-6 bg-white">
            <h2 className="text-lg font-bold text-gray-900">Low Stock Alert</h2>
          </div>
          
          <div className="p-4 sm:p-6">
            {loading ? (
              <div className="flex justify-center py-4">
                <div className="h-6 w-6 animate-spin rounded-full border-2 border-gray-300 border-t-blue-600"></div>
              </div>
            ) : lowStockProducts.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <div className="rounded-full bg-green-50 p-3 mb-3 text-green-500">
                   <Package className="h-6 w-6" />
                </div>
                <p className="text-sm font-medium text-gray-900">Inventory is healthy</p>
                <p className="text-xs text-gray-500 mt-1">No low stock items found.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {lowStockProducts.map((product) => (
                  <div
                    key={product._id}
                    className={`group relative overflow-hidden rounded-xl border p-4 transition-all hover:shadow-md ${
                      product.stock < 6 
                        ? "border-red-100 bg-red-50/50 hover:border-red-200 hover:bg-red-50" 
                        : "border-amber-100 bg-amber-50/50 hover:border-amber-200 hover:bg-amber-50"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-bold text-gray-900 truncate max-w-[150px]" title={product.name}>
                          {product.name}
                        </p>
                        <p className="mt-0.5 text-xs font-medium text-gray-600">
                          {product.stock} {product.stock !== 1 ? "items" : "item"} remaining
                        </p>
                      </div>
                      <span className={`inline-flex rounded-full px-2 py-1 text-[10px] font-bold uppercase tracking-wider ${
                        product.stock < 6 ? "bg-red-100 text-red-700" : "bg-amber-100 text-amber-700"
                      }`}>
                        {product.stock === 0 ? "Out" : "Low"}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-gray-200 sm:p-6">
        <h2 className="mb-6 text-lg font-bold text-gray-900">Revenue Analytics</h2>
        <div className="w-full">
          <SalesChart data={monthlySales}/>
        </div>
      </div>
    </main>
  )
}
