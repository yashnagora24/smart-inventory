"use client";

import { usePathname } from "next/navigation";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

export default function AppShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const isAuthPage =
    pathname === "/login" || pathname === "/register";

  if (isAuthPage) {
    return <>{children}</>;
  }

  return (
    <div className="flex min-h-screen items-start bg-slate-50">
      <Sidebar />

      <div className="flex min-w-0 flex-1 flex-col pb-20 lg:pb-0">
        <Navbar />

        <main className="flex-1">
          {children}
        </main>
      </div>
    </div>
  );
}
