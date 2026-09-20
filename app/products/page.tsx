"use client";
import React, { useState, useEffect } from 'react';
import { Package, Plus, Search, Edit2, Trash2, Filter, X } from 'lucide-react';

type Product = {
  id: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  status: string;
};

type ApiProduct = Omit<Product, "id"> & {
  _id: string;
};

const initialProducts: Product[] = [
  {
    id: "1",
    name: "Black Oversized T-Shirt",
    category: "T-Shirts",
    price: 1299,
    stock: 42,
    status: "In Stock",
  },
  {
    id: "2",
    name: "Black Hoodie",
    category: "Hoodies",
    price: 1899,
    stock: 18,
    status: "In Stock",
  },
  {
    id: "3",
    name: "Korean Cargo Pants",
    category: "Pants",
    price: 2499,
    stock: 7,
    status: "Low Stock",
  },
  {
    id: "4",
    name: "Oversized White T-Shirt",
    category: "T-Shirts",
    price: 1199,
    stock: 0,
    status: "Out of Stock",
  },
];



const Page = () => {

  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);


  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch("/api/products");

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.message || "Failed to fetch products");
        }

        const formattedProducts = data.products.map((product: ApiProduct) => ({
          ...product,
          id: product._id,
        }));

        setProducts(formattedProducts);

      } catch (error) {
        console.error("Fetch product error:", error);
      }
    };

    fetchProducts();
  }, []);


  const createProduct = async () => {
    const res = await fetch("/api/products", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name,
        category,
        price: Number(price),
        stock: Number(stock),
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message || "Failed to create product");
    }

    return {
      ...data.product,
      id: data.product._id,
    };
  };

  const updateProduct = async (): Promise<Product> => {
    if (!editingProduct) {
      throw new Error("No product selected for update");
    };

    const res = await fetch(`/api/products/${editingProduct.id}`, {
      method: "PUT",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify({
        name,
        category,
        price: Number(price),
        stock: Number(stock),
      }),
    });

    const data = await res.json()

    if (!res.ok) {
      throw new Error(data.message || "Failed to update product");
    }

    return {
      ...data.product,
      id: data.product._id,
    };
  };

  // Add Product
  const AddProductForm = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();


    if (editingProduct) {
      try {
        const updatedProduct = await updateProduct();

        setProducts((currentProducts) =>
          currentProducts.map((product) =>
            product.id === editingProduct.id
              ? updatedProduct
              : product
          )
        );
      } catch (error) {
        console.error("Update product error:", error);
        alert("Failed to update product");
        return;
      }
    } else {
      try {
        const newProduct = await createProduct();

        setProducts((currentProducts: Product[]) => [
          newProduct,
          ...currentProducts,
        ]);

      } catch (error) {
        console.error("Create Product error:", error);
        alert("Failed to create product");
        return;
      }

    }

    setEditingProduct(null);
    setName("");
    setCategory("");
    setPrice("");
    setStock("");
    setShowForm(false);
  }

  // Filtered Product
  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name
      .toLowerCase()
      .includes(search.toLowerCase());

    const matchesCategory =
      selectedCategory === "All Categories" ||
      product.category === selectedCategory;

    return matchesCategory && matchesSearch;
  });

  // Delete Product
  const deleteProduct = async (productName: string, id: string) => {
    if (!window.confirm(`Are you sure you want to delete ${productName} ?`)) {
      return;
    }

    try {

      const res = await fetch(`/api/products/${id}`, {
        method: "DELETE",
      });
  
      const data = await res.json();
      
          if (!res.ok) {
            throw new Error(data.message || "Failed to delete product");
          }

          setProducts((currentProducts) =>
            currentProducts.filter(
              (currentProduct) => currentProduct.id !== id
            )
          );
          
        } catch (error) {
          console.error("Delete product error:", error);
          alert("Failed to delete product");
        }
        
  }

  // Edit Product
  const editProduct = (product: Product) => {
    setEditingProduct(product);
    setName(product.name);
    setCategory(product.category);
    setPrice(String(product.price))
    setStock(String(product.stock))
    setShowForm(true)
  }


  return (
    <main className="max-w-7xl mx-auto space-y-6 p-4 sm:p-6 md:p-8 animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
            Products
          </h1>
          <p className="mt-1 text-sm text-gray-500 font-medium">
            Manage your inventory catalog and stock levels.
          </p>
        </div>

        <button 
          onClick={() => {
            if(showForm) {
                setShowForm(false)
                setEditingProduct(null);
                setName("");
                setCategory("");
                setPrice("");
                setStock("");
            } else {
                setShowForm(true)
            }
          }} 
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-blue-700 hover:shadow-md active:scale-[0.98]"
        >
          {showForm ? <><X className="h-4 w-4" /> Close Form</> : <><Plus className="h-4 w-4" /> Add Product</>}
        </button>
      </div>

      {showForm && (
        <div className="rounded-2xl bg-white p-6 md:p-8 shadow-sm ring-1 ring-gray-200 animate-in slide-in-from-top-4 duration-300">
          <div className="mb-6">
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <Package className="h-5 w-5 text-blue-600" />
              {editingProduct ? "Edit Product" : "Add New Product"}
            </h2>
            <p className="mt-1 text-sm text-gray-500 font-medium">
              Fill in the product details below to {editingProduct ? "update the" : "add a new"} item in your catalog.
            </p>
          </div>

          <form
            onSubmit={(e) => AddProductForm(e)}
            className="grid gap-6 sm:grid-cols-2"
          >
            {/* Product Name */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">
                Product Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Premium Cotton T-Shirt"
                className="w-full rounded-xl border border-gray-200 bg-gray-50/50 px-4 py-2.5 text-sm outline-none transition-all focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 focus:bg-white"
                required
              />
            </div>

            {/* category */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">Category</label>
              <div className="relative">
                <select 
                  value={category} 
                  onChange={(e) => setCategory(e.target.value)} 
                  required 
                  className="w-full appearance-none rounded-xl border border-gray-200 bg-gray-50/50 px-4 py-2.5 text-sm outline-none transition-all focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 focus:bg-white"
                >
                  <option value="" disabled>Select category</option>
                  <option value="T-Shirts">T-Shirts</option>
                  <option value="Hoodies">Hoodies</option>
                  <option value="Pants">Pants</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-500">
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                </div>
              </div>
            </div>

            {/* Price */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">
                Price (₹)
              </label>
              <input
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="0.00"
                min="0"
                required
                className="w-full rounded-xl border border-gray-200 bg-gray-50/50 px-4 py-2.5 text-sm outline-none transition-all focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 focus:bg-white"
              />
            </div>

            {/* Stock */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">
                Stock Quantity
              </label>
              <input
                type="number"
                value={stock}
                onChange={(e) => setStock(e.target.value)}
                placeholder="0"
                min="0"
                required
                className="w-full rounded-xl border border-gray-200 bg-gray-50/50 px-4 py-2.5 text-sm outline-none transition-all focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 focus:bg-white"
              />
            </div>

            {/* Buttons */}
            <div className="flex flex-col-reverse sm:flex-row gap-3 pt-4 md:col-span-2 sm:justify-end">
              <button 
                type="button" 
                onClick={() => {
                  setShowForm(false)
                  setEditingProduct(null);
                  setName("");
                  setCategory("");
                  setPrice("");
                  setStock("");
                }} 
                className="rounded-xl border border-gray-200 bg-white px-5 py-2.5 text-sm font-semibold text-gray-700 shadow-sm transition-all hover:bg-gray-50 hover:text-gray-900"
              >
                Cancel
              </button>
              <button 
                type="submit" 
                className="rounded-xl bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-blue-700 hover:shadow-md"
              >
                {editingProduct ? "Save Changes" : "Create Product"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Search & Filter */}
      <div className="flex flex-col sm:flex-row gap-4 p-4 rounded-2xl bg-white shadow-sm ring-1 ring-gray-200">
        <div className="relative flex-1">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
            <Search className="h-4 w-4 text-gray-400" />
          </div>
          <input 
            type="text" 
            value={search} 
            onChange={(e) => setSearch(e.target.value)} 
            placeholder="Search products by name..." 
            className="w-full rounded-xl border-none bg-gray-50/50 py-2.5 pl-11 pr-4 text-sm outline-none ring-1 ring-inset ring-gray-200 transition-all focus:bg-white focus:ring-2 focus:ring-inset focus:ring-blue-500" 
          />
        </div>

        <div className="relative sm:w-48">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
            <Filter className="h-4 w-4 text-gray-400" />
          </div>
          <select 
            value={selectedCategory} 
            onChange={(e) => setSelectedCategory(e.target.value)} 
            className="w-full appearance-none rounded-xl border-none bg-gray-50/50 py-2.5 pl-11 pr-10 text-sm font-medium outline-none ring-1 ring-inset ring-gray-200 transition-all focus:bg-white focus:ring-2 focus:ring-inset focus:ring-blue-500 hover:cursor-pointer"
          >
            <option>All Categories</option>
            <option>T-Shirts</option>
            <option>Hoodies</option>
            <option>Pants</option>
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-4 text-gray-500">
             <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 9l4-4 4 4m0 6l-4 4-4-4"></path></svg>
          </div>
        </div>
      </div>

      {/* Product Table */}
      <div className="rounded-2xl bg-white shadow-sm ring-1 ring-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/50">
                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-gray-500">Product</th>
                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-gray-500">Category</th>
                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-gray-500">Price</th>
                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-gray-500">Stock</th>
                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-gray-500">Status</th>
                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-gray-500 text-right">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center">
                    <div className="flex flex-col items-center justify-center">
                      <div className="rounded-full bg-gray-50 p-4 mb-3">
                         <Package className="h-8 w-8 text-gray-400" />
                      </div>
                      <p className="text-sm font-semibold text-gray-900">No products found</p>
                      <p className="text-xs text-gray-500 mt-1">Try adjusting your search or filters.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredProducts.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-50/50 transition-colors group">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                          <Package className="h-5 w-5" />
                        </div>
                        <p className="font-semibold text-gray-900">{product.name}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center rounded-md bg-gray-50 px-2 py-1 text-xs font-medium text-gray-600 ring-1 ring-inset ring-gray-200">
                        {product.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <p className="font-bold text-gray-900">₹{product.price.toLocaleString("en-IN")}</p>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <p className={`font-semibold ${product.stock === 0 ? 'text-red-600' : 'text-gray-700'}`}>
                        {product.stock}
                      </p>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                          product.status === "In Stock" 
                            ? "bg-green-100 text-green-700" 
                            : product.status === "Low Stock" 
                            ? "bg-amber-100 text-amber-700" 
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {product.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button 
                          onClick={() => editProduct(product)} 
                          className="rounded-lg p-2 text-gray-400 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                          title="Edit"
                        >
                          <Edit2 className="h-4 w-4" />
                        </button>
                        <button 
                          onClick={() => deleteProduct(product.name, product.id)} 
                          className="rounded-lg p-2 text-gray-400 hover:bg-red-50 hover:text-red-600 transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="h-4 w-4" />
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
    </main>
  );
}

export default Page
