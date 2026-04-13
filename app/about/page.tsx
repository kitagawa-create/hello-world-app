export default function AboutPage() {
  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#f9fafb", display: "flex", alignItems: "center", justifyContent: "center", padding: "24px" }}>
      <div style={{ maxWidth: "480px", width: "100%", backgroundColor: "#ffffff", borderRadius: "16px", padding: "40px", border: "1px solid #e5e7eb", boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}>
        <h1 style={{ fontSize: "28px", fontWeight: 800, color: "#111827", margin: 0 }}>BookShelf</h1>
        <p style={{ fontSize: "14px", color: "#6b7280", marginTop: "8px" }}>書籍貸出管理アプリケーション</p>

        <div style={{ marginTop: "24px", display: "flex", flexDirection: "column", gap: "12px" }}>
          <div>
            <p style={{ fontSize: "13px", fontWeight: 600, color: "#374151" }}>バージョン</p>
            <p style={{ fontSize: "14px", color: "#6b7280" }}>0.1.0</p>
          </div>
          <div>
            <p style={{ fontSize: "13px", fontWeight: 600, color: "#374151" }}>技術スタック</p>
            <p style={{ fontSize: "14px", color: "#6b7280" }}>Next.js / Firebase / Tailwind CSS</p>
          </div>
          <div>
            <p style={{ fontSize: "13px", fontWeight: 600, color: "#374151" }}>概要</p>
            <p style={{ fontSize: "14px", color: "#6b7280", lineHeight: 1.6 }}>
              書籍の登録・貸出・返却を管理するためのアプリです。ダッシュボードで統計情報を確認し、書籍管理と貸出管理を行えます。
            </p>
          </div>
        </div>

        <a
          href="/admin"
          style={{ display: "inline-block", marginTop: "28px", fontSize: "14px", fontWeight: 600, color: "#2f5df5", textDecoration: "none" }}
        >
          管理画面に戻る
        </a>
      </div>
    </div>
  );
}
