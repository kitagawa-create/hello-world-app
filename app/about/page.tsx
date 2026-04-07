import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About | BookShelf",
  description: "BookShelf について",
};

export default function AboutPage() {
  return (
    <main
      style={{
        maxWidth: "720px",
        margin: "60px auto",
        padding: "40px 32px",
        fontFamily: "system-ui, sans-serif",
        backgroundColor: "#ffffff",
        borderRadius: "16px",
        boxShadow: "0 4px 12px rgba(0,0,0,0.06)",
        border: "1px solid #e5e7eb",
      }}
    >
      <h1
        style={{
          fontSize: "32px",
          fontWeight: 800,
          color: "#111827",
          margin: 0,
        }}
      >
        About BookShelf
      </h1>
      <p
        style={{
          fontSize: "14px",
          color: "#6b7280",
          marginTop: "8px",
        }}
      >
        書籍貸出管理システム
      </p>

      <section style={{ marginTop: "32px" }}>
        <h2
          style={{
            fontSize: "20px",
            fontWeight: 700,
            color: "#111827",
            margin: 0,
          }}
        >
          BookShelf とは
        </h2>
        <p
          style={{
            fontSize: "15px",
            lineHeight: 1.7,
            color: "#374151",
            marginTop: "12px",
          }}
        >
          BookShelf は、図書館や社内文庫向けに設計された書籍貸出管理システムです。
          書籍の登録・貸出・返却・利用統計まで、運営に必要な機能を1つのダッシュボードで提供します。
        </p>
      </section>

      <section style={{ marginTop: "28px" }}>
        <h2
          style={{
            fontSize: "20px",
            fontWeight: 700,
            color: "#111827",
            margin: 0,
          }}
        >
          主な機能
        </h2>
        <ul
          style={{
            fontSize: "15px",
            lineHeight: 1.9,
            color: "#374151",
            marginTop: "12px",
            paddingLeft: "20px",
          }}
        >
          <li>📚 書籍の登録・編集・削除</li>
          <li>🔄 貸出と返却の管理</li>
          <li>📊 カテゴリ別・著者別の集計ダッシュボード</li>
          <li>👥 利用者ごとの貸出履歴</li>
          <li>🔔 Slack 通知連携</li>
        </ul>
      </section>

      <section style={{ marginTop: "28px" }}>
        <h2
          style={{
            fontSize: "20px",
            fontWeight: 700,
            color: "#111827",
            margin: 0,
          }}
        >
          技術スタック
        </h2>
        <ul
          style={{
            fontSize: "15px",
            lineHeight: 1.9,
            color: "#374151",
            marginTop: "12px",
            paddingLeft: "20px",
          }}
        >
          <li>Next.js (App Router)</li>
          <li>React</li>
          <li>TypeScript</li>
          <li>Firebase / Firestore</li>
          <li>Sentry(エラー監視)</li>
        </ul>
      </section>
    </main>
  );
}
