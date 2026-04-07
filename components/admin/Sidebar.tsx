"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  BookOpen,
  HandCoins,
  LogOut,
} from "lucide-react";

const navItems = [
  { href: "/admin", label: "ダッシュボード", icon: LayoutDashboard },
  { href: "/admin/books", label: "書籍管理", icon: BookOpen },
  { href: "/admin/loans", label: "貸出管理", icon: HandCoins },
];

interface SidebarProps {
  onLogout: () => void;
}

export default function Sidebar({ onLogout }: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        bottom: 0,
        width: "256px",
        backgroundColor: "#071833",
        display: "flex",
        flexDirection: "column",
        zIndex: 50,
      }}
    >
      {/* Logo */}
      <div style={{ padding: "22px 20px 18px" }}>
        <p style={{ fontSize: "20px", fontWeight: 800, color: "#ffffff", lineHeight: 1.2 }}>BookShelf</p>
        <p style={{ fontSize: "14px", marginTop: "4px", color: "rgba(255,255,255,0.7)" }}>Admin Panel</p>
      </div>
      <div style={{ margin: "0 16px", borderBottom: "1px solid rgba(255,255,255,0.08)" }} />

      {/* Nav */}
      <nav style={{ flex: 1, padding: "20px 16px 0", display: "flex", flexDirection: "column", gap: "8px" }}>
        {navItems.map((item) => {
          const isActive =
            item.href === "/admin"
              ? pathname === "/admin"
              : pathname.startsWith(item.href);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                padding: "0 16px",
                height: "48px",
                borderRadius: "12px",
                fontSize: "15px",
                fontWeight: 600,
                color: "#ffffff",
                backgroundColor: isActive ? "#2f5df5" : "transparent",
                textDecoration: "none",
                transition: "background-color 0.15s",
              }}
              onMouseEnter={(e) => {
                if (!isActive) e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.06)";
              }}
              onMouseLeave={(e) => {
                if (!isActive) e.currentTarget.style.backgroundColor = "transparent";
              }}
            >
              <Icon size={20} color="#ffffff" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      <div style={{ padding: "0 16px 18px" }}>
        <button
          onClick={onLogout}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            padding: "0 16px",
            width: "100%",
            height: "46px",
            borderRadius: "12px",
            fontSize: "15px",
            fontWeight: 600,
            color: "#ffffff",
            backgroundColor: "rgba(255,255,255,0.08)",
            border: "none",
            cursor: "pointer",
            transition: "background-color 0.15s",
          }}
          onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.14)"; }}
          onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.08)"; }}
        >
          <LogOut size={20} color="#ffffff" />
          ログアウト
        </button>
      </div>
    </aside>
  );
}
