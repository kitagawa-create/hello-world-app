"use client";

import { useState } from "react";

export default function DarkModePage() {
  const [isDark, setIsDark] = useState(false);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        backgroundColor: isDark ? "#1a1a1a" : "#ffffff",
        color: isDark ? "#f0f0f0" : "#1a1a1a",
        transition: "background-color 0.3s, color 0.3s",
      }}
    >
      <p style={{ fontSize: "2rem", margin: "0 0 1rem" }}>
        {isDark ? "ダークモード" : "ライトモード"}
      </p>
      <button
        onClick={() => setIsDark(!isDark)}
        style={{
          fontSize: "1.5rem",
          padding: "0.5rem 2rem",
          cursor: "pointer",
          backgroundColor: isDark ? "#f0f0f0" : "#1a1a1a",
          color: isDark ? "#1a1a1a" : "#f0f0f0",
          border: "none",
          borderRadius: "8px",
          transition: "background-color 0.3s, color 0.3s",
        }}
      >
        {isDark ? "ライトモードへ" : "ダークモードへ"}
      </button>
    </div>
  );
}
