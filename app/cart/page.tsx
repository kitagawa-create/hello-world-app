"use client";

import { useState } from "react";

interface Product {
  id: number;
  name: string;
  price: number;
}

interface CartItem extends Product {
  quantity: number;
}

const products: Product[] = [
  { id: 1, name: "コーヒー豆 200g", price: 1200 },
  { id: 2, name: "ドリッパー", price: 2500 },
  { id: 3, name: "マグカップ", price: 800 },
];

export default function CartPage() {
  const [cart, setCart] = useState<CartItem[]>([]);

  const addToCart = (product: Product) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (id: number) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  const changeQuantity = (id: number, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) =>
          item.id === id ? { ...item, quantity: item.quantity + delta } : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div style={{ maxWidth: 600, margin: "0 auto", padding: "2rem", fontFamily: "sans-serif" }}>
      <h1 style={{ fontSize: "1.8rem", marginBottom: "1.5rem" }}>商品リスト</h1>
      <div style={{ display: "flex", flexDirection: "column", gap: "1rem", marginBottom: "2rem" }}>
        {products.map((product) => (
          <div
            key={product.id}
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "1rem",
              border: "1px solid #ddd",
              borderRadius: 8,
            }}
          >
            <div>
              <p style={{ margin: 0, fontWeight: "bold" }}>{product.name}</p>
              <p style={{ margin: 0, color: "#666" }}>¥{product.price.toLocaleString()}</p>
            </div>
            <button
              onClick={() => addToCart(product)}
              style={{
                padding: "0.4rem 1rem",
                fontSize: "1rem",
                cursor: "pointer",
                backgroundColor: "#0070f3",
                color: "#fff",
                border: "none",
                borderRadius: 6,
              }}
            >
              カートに追加
            </button>
          </div>
        ))}
      </div>

      <h2 style={{ fontSize: "1.5rem", marginBottom: "1rem" }}>カート</h2>
      {cart.length === 0 ? (
        <p style={{ color: "#999" }}>カートは空です</p>
      ) : (
        <>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.8rem", marginBottom: "1rem" }}>
            {cart.map((item) => (
              <div
                key={item.id}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "0.8rem 1rem",
                  border: "1px solid #ddd",
                  borderRadius: 8,
                }}
              >
                <div>
                  <p style={{ margin: 0, fontWeight: "bold" }}>{item.name}</p>
                  <p style={{ margin: 0, color: "#666" }}>
                    ¥{item.price.toLocaleString()} × {item.quantity} = ¥{(item.price * item.quantity).toLocaleString()}
                  </p>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  <button
                    onClick={() => changeQuantity(item.id, -1)}
                    style={{ width: 32, height: 32, fontSize: "1.2rem", cursor: "pointer" }}
                  >
                    −
                  </button>
                  <span style={{ minWidth: 24, textAlign: "center" }}>{item.quantity}</span>
                  <button
                    onClick={() => changeQuantity(item.id, 1)}
                    style={{ width: 32, height: 32, fontSize: "1.2rem", cursor: "pointer" }}
                  >
                    +
                  </button>
                  <button
                    onClick={() => removeFromCart(item.id)}
                    style={{
                      marginLeft: "0.5rem",
                      padding: "0.3rem 0.8rem",
                      fontSize: "0.9rem",
                      cursor: "pointer",
                      backgroundColor: "#e00",
                      color: "#fff",
                      border: "none",
                      borderRadius: 6,
                    }}
                  >
                    削除
                  </button>
                </div>
              </div>
            ))}
          </div>
          <p style={{ fontSize: "1.3rem", fontWeight: "bold", textAlign: "right" }}>
            合計: ¥{total.toLocaleString()}
          </p>
        </>
      )}
    </div>
  );
}
