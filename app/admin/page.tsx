"use client";

import { useEffect, useState } from "react";
import { BookOpen, ArrowUpDown, Users, Clock } from "lucide-react";
import { subscribeBooks, subscribeLoans, subscribeRecentLoans, Book, Loan } from "@/lib/firestore";

function getLoanBadge(loan: Loan) {
  if (loan.returnedProcessed) return { label: "返却済み", bg: "#f3f4f6", text: "#4b5563" };
  return { label: "貸出中", bg: "#dbeafe", text: "#1d4ed8" };
}

export default function DashboardPage() {
  const [books, setBooks] = useState<Book[]>([]);
  const [loans, setLoans] = useState<Loan[]>([]);
  const [recentLoans, setRecentLoans] = useState<Loan[]>([]);

  useEffect(() => {
    const unsub1 = subscribeBooks(setBooks);
    const unsub2 = subscribeLoans(setLoans);
    const unsub3 = subscribeRecentLoans(5, setRecentLoans);
    return () => { unsub1(); unsub2(); unsub3(); };
  }, []);

  const totalBooks = books.length;
  const lendingCount = loans.filter((l) => !l.returnedProcessed).length;
  const uniqueUsers = new Set(loans.map((l) => l.userName)).size;
  const activeLoans = loans.filter((l) => !l.returnedProcessed).length;

  const stats = [
    { label: "総書籍数", value: totalBooks, icon: BookOpen, color: "#2f80ff" },
    { label: "貸出中", value: lendingCount, icon: ArrowUpDown, color: "#22c55e" },
    { label: "利用者数", value: uniqueUsers, icon: Users, color: "#a855f7" },
    { label: "進行中の貸出", value: activeLoans, icon: Clock, color: "#f97316" },
  ];

  return (
    <div style={{ padding: "28px 40px 40px" }}>
      {/* Title */}
      <h1 style={{ fontSize: "30px", fontWeight: 800, color: "#111827", lineHeight: 1.2, margin: 0 }}>
        ダッシュボード
      </h1>
      <p style={{ fontSize: "14px", fontWeight: 500, color: "#4b5563", marginTop: "8px" }}>
        システムの概要と最新の活動状況
      </p>

      {/* Stats Cards */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: "24px",
          marginTop: "28px",
        }}
      >
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              style={{
                backgroundColor: "#ffffff",
                borderRadius: "14px",
                padding: "24px",
                border: "1px solid #e5e7eb",
                boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
                height: "170px",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <div
                style={{
                  width: "48px",
                  height: "48px",
                  borderRadius: "12px",
                  backgroundColor: stat.color,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Icon size={24} color="#ffffff" />
              </div>
              <p style={{ fontSize: "42px", fontWeight: 800, color: "#111827", marginTop: "20px", lineHeight: 1 }}>
                {stat.value}
              </p>
              <p style={{ fontSize: "14px", color: "#4b5563", marginTop: "4px" }}>
                {stat.label}
              </p>
            </div>
          );
        })}
      </div>

      {/* Recent Loans Card */}
      <div
        style={{
          backgroundColor: "#ffffff",
          borderRadius: "14px",
          marginTop: "26px",
          border: "1px solid #e5e7eb",
          boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
          overflow: "hidden",
        }}
      >
        {/* Card Header */}
        <div style={{ padding: "18px 24px", borderBottom: "1px solid #edf0f3" }}>
          <h2 style={{ fontSize: "20px", fontWeight: 800, color: "#111827", margin: 0 }}>最近の貸出</h2>
          <p style={{ fontSize: "14px", color: "#6b7280", marginTop: "2px" }}>直近5件の貸出記録</p>
        </div>

        {/* Table */}
        <div style={{ padding: "24px" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ backgroundColor: "#f8fafc" }}>
                <th style={{ textAlign: "left", padding: "12px 16px", fontSize: "14px", fontWeight: 700, color: "#374151" }}>利用者</th>
                <th style={{ textAlign: "left", padding: "12px 16px", fontSize: "14px", fontWeight: 700, color: "#374151" }}>書籍</th>
                <th style={{ textAlign: "left", padding: "12px 16px", fontSize: "14px", fontWeight: 700, color: "#374151" }}>貸出日</th>
                <th style={{ textAlign: "left", padding: "12px 16px", fontSize: "14px", fontWeight: 700, color: "#374151" }}>ステータス</th>
              </tr>
            </thead>
            <tbody>
              {recentLoans.length === 0 ? (
                <tr>
                  <td colSpan={4} style={{ padding: "40px 16px", textAlign: "center", fontSize: "14px", color: "#9ca3af" }}>
                    貸出記録がありません
                  </td>
                </tr>
              ) : (
                recentLoans.map((loan) => {
                  const badge = getLoanBadge(loan);
                  return (
                    <tr key={loan.id} style={{ height: "54px", borderBottom: "1px solid #f3f4f6" }}>
                      <td style={{ padding: "0 16px", fontSize: "14px", color: "#1f2937" }}>{loan.userName}</td>
                      <td style={{ padding: "0 16px", fontSize: "14px", color: "#1f2937" }}>{loan.bookTitle}</td>
                      <td style={{ padding: "0 16px", fontSize: "14px", color: "#1f2937" }}>{loan.loanDate}</td>
                      <td style={{ padding: "0 16px" }}>
                        <span
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            justifyContent: "center",
                            height: "30px",
                            padding: "0 12px",
                            borderRadius: "9999px",
                            fontSize: "13px",
                            fontWeight: 600,
                            backgroundColor: badge.bg,
                            color: badge.text,
                          }}
                        >
                          {badge.label}
                        </span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
