"use client";

import { useState, useRef, useEffect } from "react";
import { LogOut, Menu, TicketCheck, UserCircle, ChevronDown, UtensilsCrossed } from "lucide-react";
import { useAuth } from "@/app/context/AuthContext";

interface TopHeaderProps {
  onMenuClick: () => void;
}

export default function TopHeader({ onMenuClick }: TopHeaderProps) {
  const { user, restaurant, userName, restaurantName, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setMenuOpen(false);
      }
    }
    if (menuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [menuOpen]);

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
          <div className="header-brand-subtitle">
            {restaurant ? "Restaurant Pass" : "Restaurant Pass"}
          </div>
        </div>
      </div>

      {/* Center Restaurant Name */}
      <div className="header-center">
        {restaurantName ? (
          <div className="header-restaurant-pill" title={restaurantName}>
            <UtensilsCrossed size={15} className="header-restaurant-icon" />
            <span className="header-restaurant-name">{restaurantName}</span>
          </div>
        ) : null}
      </div>

      {/* Right actions */}
      <div className="header-actions">
        {/* Profile with Dropdown */}
        <div style={{ position: "relative" }} ref={dropdownRef}>
          <button
            type="button"
            className="header-profile"
            aria-label="Profile"
            onClick={() => setMenuOpen((prev) => !prev)}
            style={{
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "8px",
              padding: "4px 8px",
              borderRadius: "8px",
              background: menuOpen ? "rgba(249, 115, 22, 0.08)" : "transparent",
              transition: "background 0.2s ease",
            }}
          >
            <UserCircle size={30} />

            <div className="profile-info">
              <strong>{userName || "Restaurant Owner"}</strong>
              <small>Admin</small>
            </div>

            <ChevronDown
              size={14}
              style={{
                marginLeft: "2px",
                color: "#94a3b8",
                transform: menuOpen ? "rotate(180deg)" : "rotate(0deg)",
                transition: "transform 0.2s ease",
              }}
            />
          </button>

          {menuOpen && (
            <div
              style={{
                position: "absolute",
                top: "calc(100% + 8px)",
                right: 0,
                width: "220px",
                backgroundColor: "#ffffff",
                border: "1px solid #e2e8f0",
                borderRadius: "10px",
                boxShadow: "0 10px 25px rgba(15, 23, 42, 0.12)",
                zIndex: 1000,
                padding: "8px",
                animation: "dropdownFadeIn 0.15s ease-out",
              }}
            >
              <div
                style={{
                  padding: "8px 10px 10px",
                  borderBottom: "1px solid #f1f5f9",
                  marginBottom: "6px",
                }}
              >
                <div
                  style={{
                    fontSize: "13px",
                    fontWeight: 600,
                    color: "#1e293b",
                  }}
                >
                  {userName || "Restaurant Owner"}
                </div>
                {user?.email && (
                  <div
                    style={{
                      fontSize: "12px",
                      color: "#64748b",
                      marginTop: "2px",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {user.email}
                  </div>
                )}
              </div>

              <button
                type="button"
                onClick={() => {
                  setMenuOpen(false);
                  logout();
                }}
                style={{
                  width: "100%",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  padding: "8px 10px",
                  border: "none",
                  borderRadius: "6px",
                  background: "transparent",
                  color: "#dc2626",
                  fontSize: "13px",
                  fontWeight: 500,
                  cursor: "pointer",
                  textAlign: "left",
                  transition: "background 0.15s ease",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.backgroundColor = "#fef2f2")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.backgroundColor = "transparent")
                }
              >
                <LogOut size={15} />
                <span>Sign Out</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
