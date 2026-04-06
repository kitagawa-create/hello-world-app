"use client";

interface Book {
  id: number;
  title: string;
  price: number;
  inStock: boolean;
}

const books: Book[] = [
  { id: 1, title: "React入門", price: 2800, inStock: true },
  { id: 2, title: "TypeScript実践ガイド", price: 3200, inStock: true },   // false → true に変更
  { id: 3, title: "Next.js徹底解説", price: 3500, inStock: false },       // true → false に変更
  { id: 4, title: "JavaScript基礎", price: 2400, inStock: false },
  { id: 5, title: "Web開発の教科書", price: 2900, inStock: true },
  { id: 6, title: "CSS設計完全ガイド", price: 3000, inStock: true },      // 新規追加
];

export default function BooksPage() {
  return (
    <div style={{ maxWidth: 600, margin: "0 auto", padding: "2rem", fontFamily: "sans-serif" }}>
      <h1 style={{ fontSize: "1.8rem", marginBottom: "1.5rem" }}>本のリスト</h1>
      <ul style={{ listStyle: "none", padding: 0, display: "flex", flexDirection: "column", gap: "0.8rem" }}>
        {books.map((book) => (
          <li
            key={book.id}
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
              <p style={{ margin: 0, fontWeight: "bold" }}>{book.title}</p>
              <p style={{ margin: 0, color: "#666" }}>¥{book.price.toLocaleString()}</p>
            </div>
            {book.inStock && (
              <span style={{ color: "#16a34a", fontWeight: "bold" }}>✅ 在庫あり</span>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
