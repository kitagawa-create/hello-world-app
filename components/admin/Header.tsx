"use client";

import { Bell, User } from "lucide-react";

export default function Header() {
  return (
    <header
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        height: "84px",
        padding: "0 32px",
        backgroundColor: "#ffffff",
        borderBottom: "1px solid #e5e7eb",
      }}
    >
      {/* Left */}
      <div>
        <p style={{ fontSize: "24px", fontWeight: 800, color: "#111827", lineHeight: 1.2 }}>
          BookShelf
        </p>
        <p style={{ fontSize: "14px", fontWeight: 500, color: "#4b5563" }}>
          書籍管理システム
        </p>
      </div>

      {/* Right */}
      <div style={{ display: "flex", alignItems: "center", gap: "24px" }}>
        {/* Bell */}
        <button
          style={{
            padding: "8px",
            borderRadius: "50%",
            border: "none",
            backgroundColor: "transparent",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Bell size={20} color="#6b7280" />
        </button>

        {/* Admin info */}
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <div style={{ textAlign: "right" }}>
            <p style={{ fontSize: "14px", fontWeight: 600, color: "#111827" }}>管理者</p>
            <p style={{ fontSize: "14px", color: "#6b7280" }}>admin@bookshelf.com</p>
          </div>
          {/* Avatar */}
          <div
            style={{
              width: "40px",
              height: "40px",
              borderRadius: "50%",
              backgroundColor: "#2f5df5",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <User size={20} color="#ffffff" />
          </div>
        </div>
      </div>
    </header>
  );
}
