"use client";

import { useEffect, useState, useMemo } from "react";
import { BookOpen, ArrowUpDown, Users, Clock, Trophy, BarChart3, UserPen } from "lucide-react";
import { subscribeBooks, subscribeLoans, subscribeRecentLoans, Book, Loan } from "@/lib/firestore";

export function getLoanBadge(loan: Loan) {
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

  // SQL equivalent:
  // SELECT b.title, b.author, b.price, COUNT(l.bookId) AS loan_count
  // FROM books b LEFT JOIN loans l ON b.id = l.bookId
  // GROUP BY b.id, b.title, b.author, b.price
  // ORDER BY loan_count DESC
  const popularBooks = useMemo(() => {
    const loanCounts: Record<string, number> = {};
    for (const loan of loans) {
      loanCounts[loan.bookId] = (loanCounts[loan.bookId] || 0) + 1;
    }
    return books
      .map((b) => ({ ...b, loanCount: loanCounts[b.id] || 0 }))
      .sort((a, b) => b.loanCount - a.loanCount);
  }, [books, loans]);

  // SQL equivalent:
  // SELECT category, COUNT(*) AS book_count, SUM(price) AS total_price, ROUND(AVG(price),0) AS avg_price
  // FROM books
  // GROUP BY category ORDER BY book_count DESC
  const categoryStats = useMemo(() => {
    const map: Record<string, { count: number; total: number }> = {};
    for (const b of books) {
      const cat = b.category || "未分類";
      if (!map[cat]) map[cat] = { count: 0, total: 0 };
      map[cat].count += 1;
      map[cat].total += b.price;
    }
    return Object.entries(map)
      .map(([category, v]) => ({
        category,
        bookCount: v.count,
        totalPrice: v.total,
        avgPrice: Math.round(v.total / v.count),
      }))
      .sort((a, b) => b.bookCount - a.bookCount);
  }, [books]);

  // SQL equivalent:
  // SELECT author, COUNT(*) AS book_count, ROUND(AVG(price),0) AS avg_price,
  //        MIN(price) AS min_price, MAX(price) AS max_price
  // FROM books GROUP BY author ORDER BY avg_price DESC
  const authorStats = useMemo(() => {
    const map: Record<string, { count: number; total: number; min: number; max: number }> = {};
    for (const b of books) {
      if (!map[b.author]) map[b.author] = { count: 0, total: 0, min: Infinity, max: 0 };
      map[b.author].count += 1;
      map[b.author].total += b.price;
      if (b.price < map[b.author].min) map[b.author].min = b.price;
      if (b.price > map[b.author].max) map[b.author].max = b.price;
    }
    return Object.entries(map)
      .map(([author, v]) => ({
        author,
        bookCount: v.count,
        avgPrice: Math.round(v.total / v.count),
        minPrice: v.min,
        maxPrice: v.max,
      }))
      .sort((a, b) => b.avgPrice - a.avgPrice);
  }, [books]);

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

      {/* Popular Books Card (sorted by loan_count) */}
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
        <div style={{ padding: "18px 24px", borderBottom: "1px solid #edf0f3", display: "flex", alignItems: "center", gap: "10px" }}>
          <Trophy size={20} color="#f59e0b" />
          <div>
            <h2 style={{ fontSize: "20px", fontWeight: 800, color: "#111827", margin: 0 }}>人気書籍ランキング</h2>
            <p style={{ fontSize: "14px", color: "#6b7280", marginTop: "2px" }}>書籍を貸出回数順に表示</p>
          </div>
        </div>
        <div style={{ padding: "24px" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ backgroundColor: "#f8fafc" }}>
                <th style={{ textAlign: "left", padding: "12px 16px", fontSize: "14px", fontWeight: 700, color: "#374151", width: "50px" }}>順位</th>
                <th style={{ textAlign: "left", padding: "12px 16px", fontSize: "14px", fontWeight: 700, color: "#374151" }}>タイトル</th>
                <th style={{ textAlign: "left", padding: "12px 16px", fontSize: "14px", fontWeight: 700, color: "#374151" }}>著者</th>
                <th style={{ textAlign: "left", padding: "12px 16px", fontSize: "14px", fontWeight: 700, color: "#374151" }}>価格</th>
                <th style={{ textAlign: "left", padding: "12px 16px", fontSize: "14px", fontWeight: 700, color: "#374151" }}>貸出回数</th>
              </tr>
            </thead>
            <tbody>
              {popularBooks.length === 0 ? (
                <tr>
                  <td colSpan={5} style={{ padding: "40px 16px", textAlign: "center", fontSize: "14px", color: "#9ca3af" }}>
                    書籍がありません
                  </td>
                </tr>
              ) : (
                popularBooks.map((book, i) => (
                  <tr key={book.id} style={{ height: "54px", borderBottom: "1px solid #f3f4f6" }}>
                    <td style={{ padding: "0 16px", fontSize: "14px", fontWeight: 700, color: i < 3 ? "#f59e0b" : "#6b7280" }}>
                      {i + 1}
                    </td>
                    <td style={{ padding: "0 16px", fontSize: "14px", fontWeight: 500, color: "#1f2937" }}>{book.title}</td>
                    <td style={{ padding: "0 16px", fontSize: "14px", color: "#1f2937" }}>{book.author}</td>
                    <td style={{ padding: "0 16px", fontSize: "14px", color: "#1f2937" }}>¥{book.price.toLocaleString()}</td>
                    <td style={{ padding: "0 16px" }}>
                      <span
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          justifyContent: "center",
                          height: "28px",
                          padding: "0 10px",
                          borderRadius: "9999px",
                          fontSize: "13px",
                          fontWeight: 600,
                          backgroundColor: book.loanCount > 0 ? "#dbeafe" : "#f3f4f6",
                          color: book.loanCount > 0 ? "#1d4ed8" : "#9ca3af",
                        }}
                      >
                        {book.loanCount}回
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Category Stats Card */}
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
        <div style={{ padding: "18px 24px", borderBottom: "1px solid #edf0f3", display: "flex", alignItems: "center", gap: "10px" }}>
          <BarChart3 size={20} color="#6366f1" />
          <div>
            <h2 style={{ fontSize: "20px", fontWeight: 800, color: "#111827", margin: 0 }}>カテゴリ別集計</h2>
            <p style={{ fontSize: "14px", color: "#6b7280", marginTop: "2px" }}>書籍をカテゴリ別に集計（多い順）</p>
          </div>
        </div>
        <div style={{ padding: "24px" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ backgroundColor: "#f8fafc" }}>
                <th style={{ textAlign: "left", padding: "12px 16px", fontSize: "14px", fontWeight: 700, color: "#374151" }}>カテゴリ</th>
                <th style={{ textAlign: "left", padding: "12px 16px", fontSize: "14px", fontWeight: 700, color: "#374151" }}>冊数</th>
                <th style={{ textAlign: "left", padding: "12px 16px", fontSize: "14px", fontWeight: 700, color: "#374151" }}>合計金額</th>
                <th style={{ textAlign: "left", padding: "12px 16px", fontSize: "14px", fontWeight: 700, color: "#374151" }}>平均価格</th>
              </tr>
            </thead>
            <tbody>
              {categoryStats.length === 0 ? (
                <tr>
                  <td colSpan={4} style={{ padding: "40px 16px", textAlign: "center", fontSize: "14px", color: "#9ca3af" }}>
                    書籍がありません
                  </td>
                </tr>
              ) : (
                categoryStats.map((row) => (
                  <tr key={row.category} style={{ height: "54px", borderBottom: "1px solid #f3f4f6" }}>
                    <td style={{ padding: "0 16px", fontSize: "14px", fontWeight: 600, color: "#1f2937" }}>{row.category}</td>
                    <td style={{ padding: "0 16px" }}>
                      <span
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          justifyContent: "center",
                          height: "28px",
                          padding: "0 10px",
                          borderRadius: "9999px",
                          fontSize: "13px",
                          fontWeight: 600,
                          backgroundColor: "#ede9fe",
                          color: "#6d28d9",
                        }}
                      >
                        {row.bookCount}冊
                      </span>
                    </td>
                    <td style={{ padding: "0 16px", fontSize: "14px", color: "#1f2937" }}>¥{row.totalPrice.toLocaleString()}</td>
                    <td style={{ padding: "0 16px", fontSize: "14px", color: "#1f2937" }}>¥{row.avgPrice.toLocaleString()}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Author Stats Card */}
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
        <div style={{ padding: "18px 24px", borderBottom: "1px solid #edf0f3", display: "flex", alignItems: "center", gap: "10px" }}>
          <UserPen size={20} color="#0891b2" />
          <div>
            <h2 style={{ fontSize: "20px", fontWeight: 800, color: "#111827", margin: 0 }}>著者別 平均価格</h2>
            <p style={{ fontSize: "14px", color: "#6b7280", marginTop: "2px" }}>著者ごとの冊数・平均価格・価格帯（平均価格の高い順）</p>
          </div>
        </div>
        <div style={{ padding: "24px" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ backgroundColor: "#f8fafc" }}>
                <th style={{ textAlign: "left", padding: "12px 16px", fontSize: "14px", fontWeight: 700, color: "#374151" }}>著者</th>
                <th style={{ textAlign: "left", padding: "12px 16px", fontSize: "14px", fontWeight: 700, color: "#374151" }}>冊数</th>
                <th style={{ textAlign: "left", padding: "12px 16px", fontSize: "14px", fontWeight: 700, color: "#374151" }}>平均価格</th>
                <th style={{ textAlign: "left", padding: "12px 16px", fontSize: "14px", fontWeight: 700, color: "#374151" }}>最安</th>
                <th style={{ textAlign: "left", padding: "12px 16px", fontSize: "14px", fontWeight: 700, color: "#374151" }}>最高</th>
              </tr>
            </thead>
            <tbody>
              {authorStats.length === 0 ? (
                <tr>
                  <td colSpan={5} style={{ padding: "40px 16px", textAlign: "center", fontSize: "14px", color: "#9ca3af" }}>
                    書籍がありません
                  </td>
                </tr>
              ) : (
                authorStats.map((row) => (
                  <tr key={row.author} style={{ height: "54px", borderBottom: "1px solid #f3f4f6" }}>
                    <td style={{ padding: "0 16px", fontSize: "14px", fontWeight: 600, color: "#1f2937" }}>{row.author}</td>
                    <td style={{ padding: "0 16px" }}>
                      <span
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          justifyContent: "center",
                          height: "28px",
                          padding: "0 10px",
                          borderRadius: "9999px",
                          fontSize: "13px",
                          fontWeight: 600,
                          backgroundColor: "#cffafe",
                          color: "#0e7490",
                        }}
                      >
                        {row.bookCount}冊
                      </span>
                    </td>
                    <td style={{ padding: "0 16px", fontSize: "14px", fontWeight: 700, color: "#111827" }}>¥{row.avgPrice.toLocaleString()}</td>
                    <td style={{ padding: "0 16px", fontSize: "14px", color: "#6b7280" }}>¥{row.minPrice.toLocaleString()}</td>
                    <td style={{ padding: "0 16px", fontSize: "14px", color: "#6b7280" }}>¥{row.maxPrice.toLocaleString()}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
