export default function Home() {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        padding: "2rem",
        fontFamily: "var(--font-geist-sans), sans-serif",
      }}
    >
      <p style={{ fontSize: "1rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "#888", marginBottom: "0.5rem" }}>
        Welcome to
      </p>
      <h1
        style={{
          fontSize: "clamp(2.5rem, 8vw, 5rem)",
          fontWeight: 700,
          letterSpacing: "-0.03em",
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          marginBottom: "1rem",
        }}
      >
        Hello World
      </h1>
      <p
        style={{
          fontSize: "1.2rem",
          color: "#666",
          maxWidth: "480px",
          textAlign: "center",
          lineHeight: 1.6,
        }}
      >
        Next.js + TypeScript + Firebase App Hosting
      </p>
      <div
        style={{
          marginTop: "2.5rem",
          display: "flex",
          gap: "1rem",
          flexWrap: "wrap",
          justifyContent: "center",
        }}
      >
        <a
          href="https://nextjs.org/docs"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            padding: "0.75rem 1.5rem",
            borderRadius: "9999px",
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            color: "#fff",
            fontWeight: 600,
            fontSize: "0.95rem",
            transition: "opacity 0.2s",
          }}
        >
          Next.js Docs
        </a>
        <a
          href="https://firebase.google.com/docs/app-hosting"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            padding: "0.75rem 1.5rem",
            borderRadius: "9999px",
            border: "1px solid #ddd",
            color: "inherit",
            fontWeight: 600,
            fontSize: "0.95rem",
            transition: "opacity 0.2s",
          }}
        >
          Firebase Docs
        </a>
      </div>
    </div>
  );
}
