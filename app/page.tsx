import Link from "next/link";

const pages = [
  { href: "/counter", title: "カウンター", description: "ボタンを押すと数字が増える。リセット機能付き。" },
  { href: "/darkmode", title: "ダークモード", description: "ライト/ダークモードをボタンで切り替え。" },
  { href: "/cart", title: "カート", description: "商品の追加・削除・数量変更ができるカート機能。" },
  { href: "/books", title: "本リスト", description: "本の一覧を表示。在庫ありの本にマーク付き。" },
];

export default function Home() {
  return (
    <div style={{ maxWidth: 700, margin: "0 auto", padding: "3rem 2rem", fontFamily: "sans-serif" }}>
      <h1 style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>React Demo Site</h1>
      <p style={{ color: "#666", marginBottom: "2rem" }}>useStateを使ったReact機能デモ集</p>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
        {pages.map((page) => (
          <Link
            key={page.href}
            href={page.href}
            style={{
              padding: "1.5rem",
              border: "1px solid #ddd",
              borderRadius: 10,
              textDecoration: "none",
              color: "inherit",
              transition: "border-color 0.2s, box-shadow 0.2s",
            }}
            onMouseEnter={undefined}
          >
            <h2 style={{ margin: "0 0 0.5rem", fontSize: "1.3rem" }}>{page.title}</h2>
            <p style={{ margin: 0, color: "#666", fontSize: "0.9rem" }}>{page.description}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
