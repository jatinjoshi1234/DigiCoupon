"use client";

import Link from "next/link";
import { Menu, TicketCheck, UserCircle } from "lucide-react";

interface TopHeaderProps {
  onMenuClick: () => void;
}

export default function TopHeader({ onMenuClick }: TopHeaderProps) {
  return (
    <header className="app-header">
      {/* Mobile menu button */}
      <button
        type="button"
        className="sidebar-toggle"
        onClick={onMenuClick}
        aria-label="Open menu"
      >
        <Menu size={22} />
      </button>

      {/* Brand */}
      <div className="header-brand">
        <div className="header-brand-icon">
          <TicketCheck size={19} />
        </div>

        <div>
          <div className="header-brand-name">DigiCoupon</div>
          <div className="header-brand-subtitle">Restaurant Pass</div>
        </div>
      </div>

      {/* Right actions */}
      <div className="header-actions">
        {/* Redeem Pass */}
        <Link href="/redemptions/new" className="redeem-header-button">
          <TicketCheck size={18} />
          <span>Redeem Pass</span>
        </Link>

        {/* Profile */}
        <button type="button" className="header-profile" aria-label="Profile">
          <UserCircle size={30} />

          <div className="profile-info">
            <strong>Restaurant Owner</strong>
            <small>Admin</small>
          </div>
        </button>
      </div>
    </header>
  );
}
