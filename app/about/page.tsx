export default function AboutPage() {
  return (
    <div style={{ maxWidth: 700, margin: "0 auto", padding: "3rem 2rem", fontFamily: "sans-serif" }}>
      <h1 style={{ fontSize: "2rem", marginBottom: "1.5rem" }}>自己紹介</h1>

      <section style={{ marginBottom: "2rem" }}>
        <p style={{ fontSize: "1.1rem", lineHeight: 1.8 }}>
          こんにちは！フロントエンド開発を学んでいるエンジニアです。
          React / Next.js を中心に、モダンなWeb開発を勉強中です。
        </p>
      </section>

      <section style={{ marginBottom: "2rem" }}>
        <h2 style={{ fontSize: "1.4rem", marginBottom: "0.8rem" }}>スキル</h2>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
          {["React", "Next.js", "TypeScript", "Flutter", "Dart", "HTML / CSS"].map((skill) => (
            <span
              key={skill}
              style={{
                padding: "0.4rem 1rem",
                backgroundColor: "#f0f0f0",
                borderRadius: 20,
                fontSize: "0.95rem",
              }}
            >
              {skill}
            </span>
          ))}
        </div>
      </section>

      <section style={{ marginBottom: "2rem" }}>
        <h2 style={{ fontSize: "1.4rem", marginBottom: "0.8rem" }}>趣味</h2>
        <p style={{ lineHeight: 1.8 }}>新しい技術を触ること、個人開発が好きです。</p>
      </section>

      <section>
        <h2 style={{ fontSize: "1.4rem", marginBottom: "0.8rem" }}>制作物</h2>
        <ul style={{ listStyle: "none", padding: 0, display: "flex", flexDirection: "column", gap: "0.5rem" }}>
          <li style={{ padding: "0.8rem 1rem", border: "1px solid #ddd", borderRadius: 8 }}>
            X(Twitter)クローンアプリ — Flutter製
          </li>
          <li style={{ padding: "0.8rem 1rem", border: "1px solid #ddd", borderRadius: 8 }}>
            React Demo Site — このサイト（Next.js）
          </li>
        </ul>
      </section>
    </div>
  );
}
