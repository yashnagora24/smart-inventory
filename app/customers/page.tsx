"use client";

import { useEffect, useState } from "react";
import { Users, Plus, X, User, Phone, Mail, MapPin, Edit2, Trash2 } from "lucide-react";

type Customer = {
  _id: string;
  name: string;
  phone: string;
  email?: string;
  address?: string;
};

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);

  const [showForm, setShowForm] = useState(false);
  const [editingCustomer, setEditingCustomer] =
    useState<Customer | null>(null);

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const res = await fetch("/api/customers");
        const data = await res.json();

        if (!res.ok) {
          throw new Error(
            data.message || "Failed to fetch customers"
          );
        }

        setCustomers(data.customers);
      } catch (error) {
        console.error("Fetch customers error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCustomers();
  }, []);

  const resetForm = () => {
    setName("");
    setPhone("");
    setEmail("");
    setAddress("");
    setEditingCustomer(null);
    setShowForm(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const url = editingCustomer
        ? `/api/customers/${editingCustomer._id}`
        : "/api/customers";

      const method = editingCustomer ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          phone,
          email,
          address,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(
          data.message || "Failed to save customer"
        );
      }

      if (editingCustomer) {
        setCustomers((currentCustomers) =>
          currentCustomers.map((customer) =>
            customer._id === editingCustomer._id
              ? data.customer
              : customer
          )
        );
      } else {
        setCustomers((currentCustomers) => [
          data.customer,
          ...currentCustomers,
        ]);
      }

      resetForm();
    } catch (error) {
      console.error("Save customer error:", error);
      alert("Failed to save customer");
    }
  };

  const editCustomer = (customer: Customer) => {
    setEditingCustomer(customer);

    setName(customer.name);
    setPhone(customer.phone);
    setEmail(customer.email || "");
    setAddress(customer.address || "");

    setShowForm(true);
  };

  const deleteCustomer = async (
    customerName: string,
    customerId: string
  ) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete ${customerName}?`
    );

    if (!confirmed) {
      return;
    }

    try {
      const res = await fetch(
        `/api/customers/${customerId}`,
        {
          method: "DELETE",
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(
          data.message || "Failed to delete customer"
        );
      }

      setCustomers((currentCustomers) =>
        currentCustomers.filter(
          (customer) => customer._id !== customerId
        )
      );
    } catch (error) {
      console.error("Delete customer error:", error);
      alert("Failed to delete customer");
    }
  };

  return (
    <main className="max-w-7xl mx-auto space-y-6 p-4 sm:p-6 md:p-8 animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
            Customers
          </h1>
          <p className="mt-1 text-sm text-gray-500 font-medium">
            Manage your customer database and contact information.
          </p>
        </div>

        <button
          onClick={() => {
            if (showForm) {
              resetForm();
            } else {
              setShowForm(true);
            }
          }}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-blue-700 hover:shadow-md active:scale-[0.98]"
        >
          {showForm ? <><X className="h-4 w-4" /> Close Form</> : <><Plus className="h-4 w-4" /> Add Customer</>}
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <div className="rounded-2xl bg-white p-6 md:p-8 shadow-sm ring-1 ring-gray-200 animate-in slide-in-from-top-4 duration-300">
          <div className="mb-6">
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <Users className="h-5 w-5 text-blue-600" />
              {editingCustomer ? "Edit Customer" : "Add New Customer"}
            </h2>
            <p className="mt-1 text-sm text-gray-500 font-medium">
                Fill in the customer's contact details below.
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
            className="grid gap-6 md:grid-cols-2"
          >
            {/* Name */}
            <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">Customer Name</label>
                <div className="relative">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-gray-400">
                        <User className="h-4 w-4" />
                    </div>
                    <input
                        type="text"
                        placeholder="John Doe"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full rounded-xl border-none bg-gray-50/50 py-2.5 pl-11 pr-4 text-sm outline-none ring-1 ring-inset ring-gray-200 transition-all focus:bg-white focus:ring-2 focus:ring-inset focus:ring-blue-500"
                        required
                    />
                </div>
            </div>

            {/* Phone */}
            <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">Phone Number</label>
                <div className="relative">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-gray-400">
                        <Phone className="h-4 w-4" />
                    </div>
                    <input
                        type="text"
                        placeholder="+91 98765 43210"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full rounded-xl border-none bg-gray-50/50 py-2.5 pl-11 pr-4 text-sm outline-none ring-1 ring-inset ring-gray-200 transition-all focus:bg-white focus:ring-2 focus:ring-inset focus:ring-blue-500"
                        required
                    />
                </div>
            </div>

            {/* Email */}
            <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">Email Address (Optional)</label>
                <div className="relative">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-gray-400">
                        <Mail className="h-4 w-4" />
                    </div>
                    <input
                        type="email"
                        placeholder="john@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full rounded-xl border-none bg-gray-50/50 py-2.5 pl-11 pr-4 text-sm outline-none ring-1 ring-inset ring-gray-200 transition-all focus:bg-white focus:ring-2 focus:ring-inset focus:ring-blue-500"
                    />
                </div>
            </div>

            {/* Address */}
            <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">Address (Optional)</label>
                <div className="relative">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-gray-400">
                        <MapPin className="h-4 w-4" />
                    </div>
                    <input
                        type="text"
                        placeholder="123 Main St, City"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        className="w-full rounded-xl border-none bg-gray-50/50 py-2.5 pl-11 pr-4 text-sm outline-none ring-1 ring-inset ring-gray-200 transition-all focus:bg-white focus:ring-2 focus:ring-inset focus:ring-blue-500"
                    />
                </div>
            </div>

            {/* Buttons */}
            <div className="flex flex-col-reverse sm:flex-row gap-3 pt-4 md:col-span-2 sm:justify-end border-t border-gray-100 mt-2">
              <button
                type="button"
                onClick={resetForm}
                className="rounded-xl border border-gray-200 bg-white px-5 py-2.5 text-sm font-semibold text-gray-700 shadow-sm transition-all hover:bg-gray-50 hover:text-gray-900"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="rounded-xl bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-blue-700 hover:shadow-md"
              >
                {editingCustomer ? "Save Changes" : "Save Customer"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Customer List */}
      <div className="rounded-2xl bg-white shadow-sm ring-1 ring-gray-200 overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <Users className="h-5 w-5 text-blue-600" />
            Customer List
          </h2>
          <p className="mt-1 text-sm text-gray-500 font-medium">
            All registered customers in your system.
          </p>
        </div>

        {loading ? (
            <div className="py-12 flex flex-col items-center justify-center">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-blue-600 mb-4"></div>
                <p className="text-gray-500 font-medium">Loading customers...</p>
            </div>
        ) : customers.length === 0 ? (
            <div className="py-16 text-center">
                <div className="flex flex-col items-center justify-center">
                    <div className="rounded-full bg-gray-50 p-4 mb-3">
                        <Users className="h-8 w-8 text-gray-400" />
                    </div>
                    <p className="text-sm font-semibold text-gray-900">No customers found</p>
                    <p className="text-xs text-gray-500 mt-1">Add a new customer to see them here.</p>
                </div>
            </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/50">
                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-gray-500">
                    Name
                  </th>
                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-gray-500">
                    Phone
                  </th>
                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-gray-500">
                    Email
                  </th>
                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-gray-500">
                    Address
                  </th>
                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-gray-500 text-right">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100">
                {customers.map((customer) => (
                  <tr
                    key={customer._id}
                    className="hover:bg-gray-50/50 transition-colors group"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-50 text-blue-600">
                                <span className="font-semibold">{customer.name.charAt(0).toUpperCase()}</span>
                            </div>
                            <span className="font-semibold text-gray-900">{customer.name}</span>
                        </div>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2 text-gray-700">
                            <Phone className="h-4 w-4 text-gray-400" />
                            {customer.phone}
                        </div>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap">
                      {customer.email ? (
                        <div className="flex items-center gap-2 text-gray-700">
                            <Mail className="h-4 w-4 text-gray-400" />
                            {customer.email}
                        </div>
                      ) : (
                        <span className="text-gray-400 italic">Not provided</span>
                      )}
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap">
                      {customer.address ? (
                         <div className="flex items-center gap-2 text-gray-700">
                            <MapPin className="h-4 w-4 text-gray-400" />
                            {customer.address}
                         </div>
                      ) : (
                        <span className="text-gray-400 italic">Not provided</span>
                      )}
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => editCustomer(customer)}
                          className="rounded-lg p-2 text-gray-400 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                          title="Edit Customer"
                        >
                          <Edit2 className="h-4 w-4" />
                        </button>

                        <button
                          onClick={() =>
                            deleteCustomer(
                              customer.name,
                              customer._id
                            )
                          }
                          className="rounded-lg p-2 text-gray-400 hover:bg-red-50 hover:text-red-600 transition-colors"
                          title="Delete Customer"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
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
