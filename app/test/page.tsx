"use client";

import { useState } from "react";

export default function TestPage() {
  const [count, setCount] = useState(0);

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "100vh" }}>
      <p style={{ fontSize: "4rem", margin: "0 0 1rem" }}>{count}</p>
      <button
        onClick={() => setCount(count + 1)}
        style={{ fontSize: "1.5rem", padding: "0.5rem 2rem", cursor: "pointer" }}
      >
        +1
      </button>
    </div>
  );
}
