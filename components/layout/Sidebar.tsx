"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Package, ShoppingCart, Receipt, Users, Settings, LogOut } from "lucide-react";
import React from 'react';

const menuItems = [
    {name: "Dashboard", href: "/dashboard", icon: LayoutDashboard},
    {name: "Products", href: "/products", icon: Package},
    {name: "Sales", href: "/sales", icon: ShoppingCart},
    {name: "Purchases", href: "/purchases", icon: Receipt},
    {name: "Customers", href: "/customers", icon: Users},
];

const Sidebar = () => {
  const pathname = usePathname();

  return (
    <>
    <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col border-r border-slate-800 bg-[#0f172a] text-slate-300 shadow-2xl lg:flex">
      {/* Logo */}
      <div className="flex h-16 shrink-0 items-center px-6 border-b border-slate-800/60 bg-[#0f172a]/95 backdrop-blur">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 shadow-lg shadow-blue-600/20">
            <Package className="h-5 w-5 text-white" strokeWidth={2.5} />
          </div>
          <div>
            <h1 className="text-lg font-bold text-slate-100 tracking-tight leading-tight">Smart Inventory</h1>
            <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">Management System</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 py-6 scrollbar-hide">
        <p className="mb-3 px-3 text-xs font-semibold uppercase tracking-wider text-slate-500">Main Menu</p>
        <div className="space-y-1">
            {menuItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                      key={item.href}
                      href={item.href}
                      className={`group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200 ${
                        isActive 
                          ? "bg-blue-600/10 text-blue-400" 
                          : "text-slate-400 hover:bg-slate-800/50 hover:text-slate-100"
                      }`}
                  >
                      <item.icon className={`h-5 w-5 transition-colors ${isActive ? "text-blue-500" : "text-slate-500 group-hover:text-slate-300"}`} strokeWidth={isActive ? 2.5 : 2} />
                      {item.name}
                      {isActive && (
                        <span className="ml-auto h-1.5 w-1.5 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.8)]"></span>
                      )}
                  </Link>
                );
            })}
        </div>
      </nav>

      {/* Bottom */}
      <div className="border-t border-slate-800/60 p-4 bg-slate-900/30">
        <Link href="#" className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-400 transition-colors hover:bg-slate-800/50 hover:text-slate-100">
          <Settings className="h-5 w-5 text-slate-500" />
          Settings
        </Link>
      </div>
    </aside>

    <nav className="fixed inset-x-0 bottom-0 z-50 grid grid-cols-5 border-t border-slate-200 bg-white/95 px-1 pb-[env(safe-area-inset-bottom)] pt-1 shadow-[0_-8px_24px_rgba(15,23,42,0.08)] backdrop-blur lg:hidden">
      {menuItems.map((item) => {
        const isActive = pathname === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`flex min-w-0 flex-col items-center gap-1 rounded-lg px-1 py-2 text-[10px] font-semibold transition-colors ${
              isActive ? "text-blue-600" : "text-slate-500"
            }`}
          >
            <item.icon className={`h-5 w-5 ${isActive ? "text-blue-600" : "text-slate-500"}`} strokeWidth={isActive ? 2.5 : 2} />
            <span className="max-w-full truncate">{item.name}</span>
          </Link>
        );
      })}
    </nav>
    </>
  )
}

export default Sidebar;
