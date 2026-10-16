"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import Sidebar from "./Sidebar";
import Header from "./Header";
import { useAuth } from "@/app/context/AuthContext";

export default function AppShell({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();
  const { isLoading } = useAuth();

  const isAuthPage =
    pathname?.startsWith("/auth") || pathname?.startsWith("/restuarant");
  const isPublicCustomerPage = pathname.startsWith("/public/customer/");
  if (isAuthPage) {
    return <>{children}</>;
  }

  if (isPublicCustomerPage) {
    return <>{children}</>
  }

  return (
    <div className="app-layout">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="sidebar-overlay"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <main className="app-main">
        <Header onMenuClick={() => setSidebarOpen(true)} />
        <div className="app-content">{children}</div>
      </main>
    </div>
  );
}
