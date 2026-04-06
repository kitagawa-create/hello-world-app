"use client";

import { useState } from "react";

export default function CounterPage() {
  const [count, setCount] = useState(10);

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "100vh" }}>
      <p style={{ fontSize: "4rem", margin: "0 0 1rem" }}>{count}</p>
      <div style={{ display: "flex", gap: "1rem" }}>
        <button
          onClick={() => setCount(count + 1)}
          style={{ fontSize: "1.5rem", padding: "0.5rem 2rem", cursor: "pointer" }}
        >
          カウントアップ
        </button>
        <button
          onClick={() => setCount(0)}
          style={{ fontSize: "1.5rem", padding: "0.5rem 2rem", cursor: "pointer" }}
        >
          リセット
        </button>
      </div>
    </div>
  );
}
