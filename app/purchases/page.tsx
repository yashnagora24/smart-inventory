"use client";

import React, { useEffect, useState } from "react";
import { Receipt, Plus, X, Package, FileText, CheckCircle, Clock } from "lucide-react";

type Product = {
  _id: string;
  name: string;
  price: number;
  stock: number;
  status: string;
};

type Purchase = {
  _id: string;
  supplierName: string;
  productName: string;
  quantity: number;
  price: number;
  totalAmount: number;
  status: "Completed" | "Pending";
  createdAt: string;
};

export default function PurchasesPage() {
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [products, setProducts] = useState<Product[]>([]);

  const [showForm, setShowForm] = useState(false);

  const [supplierName, setSupplierName] = useState("");
  const [productId, setProductId] = useState("");
  const [quantity, setQuantity] = useState("");
  const [price, setPrice] = useState("");

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Fetch purchases
  useEffect(() => {
    const fetchPurchases = async () => {
      try {
        const res = await fetch("/api/purchases");
        const data = await res.json();

        if (!res.ok) {
          throw new Error(
            data.message || "Failed to fetch purchases"
          );
        }

        setPurchases(data.purchases);
      } catch (error) {
        console.error("Fetch purchases error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPurchases();
  }, []);

  // Fetch products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch("/api/products");
        const data = await res.json();

        if (!res.ok) {
          throw new Error(
            data.message || "Failed to fetch products"
          );
        }

        setProducts(data.products);
      } catch (error) {
        console.error("Fetch products error:", error);
      }
    };

    fetchProducts();
  }, []);

  // Create purchase
  const createPurchase = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setSubmitting(true);

      const res = await fetch("/api/purchases", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          supplierName,
          productId,
          quantity: Number(quantity),
          price: Number(price),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(
          data.message || "Failed to create purchase"
        );
      }

      // Add new purchase to the top
      setPurchases((currentPurchases) => [
        data.purchase,
        ...currentPurchases,
      ]);

      // Update product stock in UI
      setProducts((currentProducts) =>
        currentProducts.map((product) =>
          product._id === productId
            ? data.updatedProduct
            : product
        )
      );

      // Reset form
      setSupplierName("");
      setProductId("");
      setQuantity("");
      setPrice("");
      setShowForm(false);

      alert("Purchase created successfully!");
    } catch (error) {
      console.error("Create purchase error:", error);

      alert(
        error instanceof Error
          ? error.message
          : "Failed to create purchase"
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="max-w-7xl mx-auto space-y-6 p-4 sm:p-6 md:p-8 animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
            Purchases
          </h1>
          <p className="mt-1 text-sm text-gray-500 font-medium">
            Manage your purchases and supplier orders.
          </p>
        </div>

        <button
          onClick={() => {
            setShowForm(!showForm);
            if(showForm) {
                setSupplierName("");
                setProductId("");
                setQuantity("");
                setPrice("");
            }
          }}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-blue-700 hover:shadow-md active:scale-[0.98]"
        >
          {showForm ? <><X className="h-4 w-4" /> Close Form</> : <><Plus className="h-4 w-4" /> New Purchase</>}
        </button>
      </div>

      {/* Purchase Form */}
      {showForm && (
        <div className="rounded-2xl bg-white p-6 md:p-8 shadow-sm ring-1 ring-gray-200 animate-in slide-in-from-top-4 duration-300">
          <div className="mb-6">
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <Receipt className="h-5 w-5 text-blue-600" />
              Create New Purchase
            </h2>
            <p className="mt-1 text-sm text-gray-500 font-medium">
                Record a new supplier order to replenish stock.
            </p>
          </div>

          <form
            onSubmit={createPurchase}
            className="grid gap-6 md:grid-cols-2"
          >
            {/* Supplier */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">
                Supplier Name
              </label>
              <input
                type="text"
                value={supplierName}
                onChange={(e) =>
                  setSupplierName(e.target.value)
                }
                placeholder="Enter supplier name"
                required
                className="w-full rounded-xl border border-gray-200 bg-gray-50/50 px-4 py-2.5 text-sm outline-none transition-all focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 focus:bg-white"
              />
            </div>

            {/* Product */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">
                Product
              </label>
              <div className="relative">
                <select
                  value={productId}
                  onChange={(e) =>
                    setProductId(e.target.value)
                  }
                  required
                  className="w-full appearance-none rounded-xl border border-gray-200 bg-gray-50/50 px-4 py-2.5 text-sm outline-none transition-all focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 focus:bg-white"
                >
                  <option value="" disabled>Select Product</option>
                  {products.map((product) => (
                    <option
                      key={product._id}
                      value={product._id}
                    >
                      {product.name} - Current Stock:{" "}
                      {product.stock}
                    </option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-500">
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                </div>
              </div>
            </div>

            {/* Quantity */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">
                Quantity
              </label>
              <input
                type="number"
                min="1"
                value={quantity}
                onChange={(e) =>
                  setQuantity(e.target.value)
                }
                placeholder="Enter quantity"
                required
                className="w-full rounded-xl border border-gray-200 bg-gray-50/50 px-4 py-2.5 text-sm outline-none transition-all focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 focus:bg-white"
              />
            </div>

            {/* Price */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">
                Purchase Price (₹)
              </label>
              <input
                type="number"
                min="0"
                value={price}
                onChange={(e) =>
                  setPrice(e.target.value)
                }
                placeholder="Enter purchase price per unit"
                required
                className="w-full rounded-xl border border-gray-200 bg-gray-50/50 px-4 py-2.5 text-sm outline-none transition-all focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 focus:bg-white"
              />
            </div>

            {/* Buttons */}
            <div className="flex flex-col-reverse sm:flex-row gap-3 pt-4 md:col-span-2 sm:justify-end border-t border-gray-100 mt-2">
              <button
                type="button"
                onClick={() => {
                    setShowForm(false)
                    setSupplierName("");
                    setProductId("");
                    setQuantity("");
                    setPrice("");
                }}
                className="rounded-xl border border-gray-200 bg-white px-5 py-2.5 text-sm font-semibold text-gray-700 shadow-sm transition-all hover:bg-gray-50 hover:text-gray-900"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-blue-700 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-50"
              >
                {submitting
                  ? "Processing..."
                  : "Complete Purchase"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Purchase History */}
      <div className="rounded-2xl bg-white shadow-sm ring-1 ring-gray-200 overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <FileText className="h-5 w-5 text-blue-600" />
            Purchase History
          </h2>
          <p className="mt-1 text-sm text-gray-500 font-medium">
            View and manage all completed supplier purchases.
          </p>
        </div>

        {loading ? (
            <div className="py-12 flex flex-col items-center justify-center">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-blue-600 mb-4"></div>
                <p className="text-gray-500 font-medium">Loading purchases data...</p>
            </div>
        ) : purchases.length === 0 ? (
            <div className="py-16 text-center">
                <div className="flex flex-col items-center justify-center">
                    <div className="rounded-full bg-gray-50 p-4 mb-3">
                        <Receipt className="h-8 w-8 text-gray-400" />
                    </div>
                    <p className="text-sm font-semibold text-gray-900">No purchases found</p>
                    <p className="text-xs text-gray-500 mt-1">Record your first purchase to see it here.</p>
                </div>
            </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/50">
                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-gray-500">
                    Supplier
                  </th>
                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-gray-500">
                    Product
                  </th>
                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-gray-500">
                    Quantity
                  </th>
                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-gray-500">
                    Price
                  </th>
                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-gray-500">
                    Total
                  </th>
                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-gray-500">
                    Status
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100">
                {purchases.map((purchase) => (
                    <tr
                      key={purchase._id}
                      className="hover:bg-gray-50/50 transition-colors"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="font-semibold text-gray-900">{purchase.supplierName}</div>
                        <div className="text-xs text-gray-500 mt-0.5">{new Date(purchase.createdAt).toLocaleDateString()}</div>
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                            <Package className="h-4 w-4 text-gray-400" />
                            <span className="text-gray-700 font-medium">{purchase.productName}</span>
                        </div>
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center rounded-md bg-gray-50 px-2 py-1 text-xs font-medium text-gray-600 ring-1 ring-inset ring-gray-200">
                            {purchase.quantity} units
                        </span>
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap text-gray-700">
                        ₹{purchase.price.toLocaleString("en-IN")}
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="font-bold text-gray-900">
                            ₹{purchase.totalAmount.toLocaleString("en-IN")}
                        </span>
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-green-50 px-2.5 py-1 text-xs font-semibold text-green-700 ring-1 ring-inset ring-green-600/20">
                            {purchase.status === "Completed" ? <CheckCircle className="h-3.5 w-3.5" /> : <Clock className="h-3.5 w-3.5" />}
                            {purchase.status}
                        </span>
                      </td>
                    </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </main>
  );
}
