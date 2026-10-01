"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  Ticket,
  ScanLine,
  Store,
  BarChart3,
  Settings,
  LogOut,
  UtensilsCrossed,
  X,
} from "lucide-react";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const menuItems = [
  {
    title: "Dashboard",
    href: "/",
    icon: LayoutDashboard,
  },
  {
    title: "Customers",
    href: "/customers",
    icon: Users,
  },
  {
    title: "Passes",
    href: "/passes",
    icon: Ticket,
  },
  {
    title: "Redemptions",
    href: "/redemptions",
    icon: ScanLine,
  },
  {
    title: "Branches",
    href: "/branches",
    icon: Store,
  },
  {
    title: "Reports",
    href: "/reports",
    icon: BarChart3,
  },
];

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside className={`app-sidebar ${isOpen ? "sidebar-open" : ""}`}>
      {/* Logo */}
      <div className="sidebar-logo">
        <div className="logo-icon">
          <UtensilsCrossed size={21} />
        </div>

        <div className="sidebar-brand">
          <h5 className="mb-0 fw-bold">DigiCoupon</h5>

          <small>Restaurant Pass</small>
        </div>

        {/* Mobile close */}
        <button type="button" className="sidebar-close" onClick={onClose}>
          <X size={21} />
        </button>
      </div>

      {/* Navigation */}
      <div className="sidebar-menu">
        <div className="sidebar-section-title">MAIN MENU</div>

        {menuItems.map((item) => {
          const Icon = item.icon;

          const isActive =
            pathname === item.href || pathname.startsWith(`${item.href}/`);

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onClose}
              className={`sidebar-link ${isActive ? "active" : ""}`}
            >
              <Icon size={19} />

              <span>{item.title}</span>
            </Link>
          );
        })}

        <div className="sidebar-section-title system-title">SYSTEM</div>

        <Link
          href="/settings"
          onClick={onClose}
          className={`sidebar-link ${
            pathname.startsWith("/settings") ? "active" : ""
          }`}
        >
          <Settings size={19} />

          <span>Settings</span>
        </Link>
      </div>

      {/* Bottom */}
      <div className="sidebar-bottom">
        <button type="button" className="sidebar-link logout-button">
          <LogOut size={19} />

          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}
