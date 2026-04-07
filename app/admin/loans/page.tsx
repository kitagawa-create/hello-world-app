"use client";

import { useEffect, useState, useCallback } from "react";
import { Plus, Trash2, RotateCcw } from "lucide-react";
import {
  subscribeBooks,
  subscribeLoans,
  addLoan,
  returnLoan,
  deleteLoan,
  Book,
  Loan,
} from "@/lib/firestore";
import Toast from "@/components/admin/Toast";
import ConfirmDialog from "@/components/admin/ConfirmDialog";

const emptyForm = { userName: "", bookId: "", loanDate: new Date().toISOString().split("T")[0] };

export default function LoansPage() {
  const [books, setBooks] = useState<Book[]>([]);
  const [loans, setLoans] = useState<Loan[]>([]);
  const [form, setForm] = useState(emptyForm);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const unsub1 = subscribeBooks(setBooks);
    const unsub2 = subscribeLoans(setLoans);
    return () => { unsub1(); unsub2(); };
  }, []);

  const closeToast = useCallback(() => setToast(null), []);

  const availableBooks = books.filter((b) => b.stock > 0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const book = books.find((b) => b.id === form.bookId);
      if (!book) throw new Error("書籍を選択してください");
      await addLoan({
        userName: form.userName.trim(),
        bookId: form.bookId,
        bookTitle: book.title,
        loanDate: form.loanDate,
      });
      setToast({ message: "貸出を登録しました", type: "success" });
      setForm(emptyForm);
    } catch (err) {
      setToast({ message: err instanceof Error ? err.message : "エラーが発生しました", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  const handleReturn = async (loanId: string) => {
    try {
      await returnLoan(loanId);
      setToast({ message: "返却しました", type: "success" });
    } catch {
      setToast({ message: "返却に失敗しました", type: "error" });
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await deleteLoan(deleteTarget);
      setToast({ message: "貸出記録を削除しました", type: "success" });
    } catch {
      setToast({ message: "削除に失敗しました", type: "error" });
    }
    setDeleteTarget(null);
  };

  const totalLoans = loans.length;
  const activeLoans = loans.filter((l) => !l.returnedProcessed).length;

  return (
    <div style={{ padding: "28px 40px 40px" }}>
      {/* Title */}
      <h1 style={{ fontSize: "30px", fontWeight: 800, color: "#111827", margin: 0 }}>貸出管理</h1>
      <p style={{ fontSize: "14px", fontWeight: 500, color: "#4b5563", marginTop: "8px" }}>
        書籍の貸出・返却管理
      </p>

      {/* Loan Form Card */}
      <div style={{ backgroundColor: "#fff", borderRadius: "14px", marginTop: "28px", border: "1px solid #e5e7eb", boxShadow: "0 1px 3px rgba(0,0,0,0.04)", overflow: "hidden" }}>
        <div style={{ padding: "18px 24px", borderBottom: "1px solid #edf0f3" }}>
          <h2 style={{ fontSize: "20px", fontWeight: 800, color: "#111827", margin: 0 }}>新規貸出申請</h2>
          <p style={{ fontSize: "14px", color: "#6b7280", marginTop: "2px" }}>貸出情報を入力して登録</p>
        </div>
        <form onSubmit={handleSubmit} style={{ padding: "28px 24px 24px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "16px" }}>
            <div>
              <label style={{ display: "block", fontSize: "14px", fontWeight: 600, color: "#374151", marginBottom: "6px" }}>
                利用者名 <span style={{ color: "#ef4444" }}>*</span>
              </label>
              <input
                type="text"
                required
                value={form.userName}
                onChange={(e) => setForm({ ...form, userName: e.target.value })}
                placeholder="利用者名を入力"
                style={{ width: "100%", height: "42px", padding: "0 14px", borderRadius: "10px", border: "1px solid #cfd6df", fontSize: "14px", color: "#1f2937", outline: "none" }}
              />
            </div>
            <div>
              <label style={{ display: "block", fontSize: "14px", fontWeight: 600, color: "#374151", marginBottom: "6px" }}>
                書籍タイトル <span style={{ color: "#ef4444" }}>*</span>
              </label>
              <select
                required
                value={form.bookId}
                onChange={(e) => setForm({ ...form, bookId: e.target.value })}
                style={{ width: "100%", height: "42px", padding: "0 14px", borderRadius: "10px", border: "1px solid #cfd6df", fontSize: "14px", color: "#1f2937", outline: "none", backgroundColor: "#fff" }}
              >
                <option value="">選択してください</option>
                {availableBooks.map((book) => (
                  <option key={book.id} value={book.id}>
                    {book.title} (在庫: {book.stock})
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label style={{ display: "block", fontSize: "14px", fontWeight: 600, color: "#374151", marginBottom: "6px" }}>
                貸出希望日 <span style={{ color: "#ef4444" }}>*</span>
              </label>
              <input
                type="date"
                required
                value={form.loanDate}
                onChange={(e) => setForm({ ...form, loanDate: e.target.value })}
                style={{ width: "100%", height: "42px", padding: "0 14px", borderRadius: "10px", border: "1px solid #cfd6df", fontSize: "14px", color: "#1f2937", outline: "none" }}
              />
            </div>
          </div>
          <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "24px" }}>
            <button
              type="submit"
              disabled={loading}
              style={{
                display: "flex", alignItems: "center", gap: "8px", justifyContent: "center",
                width: "120px", height: "54px", borderRadius: "12px", border: "none",
                fontSize: "14px", fontWeight: 700, color: "#fff", backgroundColor: "#2f5df5",
                cursor: loading ? "not-allowed" : "pointer", opacity: loading ? 0.5 : 1,
              }}
            >
              <Plus size={18} />
              貸出登録
            </button>
          </div>
        </form>
      </div>

      {/* Loan List Card */}
      <div style={{ backgroundColor: "#fff", borderRadius: "14px", marginTop: "24px", border: "1px solid #e5e7eb", boxShadow: "0 1px 3px rgba(0,0,0,0.04)", overflow: "hidden" }}>
        <div style={{ padding: "18px 24px", borderBottom: "1px solid #edf0f3" }}>
          <h2 style={{ fontSize: "20px", fontWeight: 800, color: "#111827", margin: 0 }}>貸出一覧</h2>
          <p style={{ fontSize: "14px", color: "#6b7280", marginTop: "2px" }}>
            総貸出数: {totalLoans}件 | 貸出中: {activeLoans}件
          </p>
        </div>
        <div style={{ padding: "24px" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ backgroundColor: "#f8fafc" }}>
                <th style={{ textAlign: "left", padding: "12px 16px", fontSize: "14px", fontWeight: 700, color: "#374151" }}>利用者名</th>
                <th style={{ textAlign: "left", padding: "12px 16px", fontSize: "14px", fontWeight: 700, color: "#374151" }}>書籍タイトル</th>
                <th style={{ textAlign: "left", padding: "12px 16px", fontSize: "14px", fontWeight: 700, color: "#374151" }}>貸出日</th>
                <th style={{ textAlign: "left", padding: "12px 16px", fontSize: "14px", fontWeight: 700, color: "#374151" }}>ステータス</th>
                <th style={{ textAlign: "right", padding: "12px 16px", fontSize: "14px", fontWeight: 700, color: "#374151" }}>操作</th>
              </tr>
            </thead>
            <tbody>
              {loans.length === 0 ? (
                <tr>
                  <td colSpan={5} style={{ padding: "40px 16px", textAlign: "center", fontSize: "14px", color: "#9ca3af" }}>
                    貸出記録がありません
                  </td>
                </tr>
              ) : (
                loans.map((loan) => {
                  const isReturned = loan.returnedProcessed;
                  return (
                    <tr key={loan.id} style={{ height: "54px", borderBottom: "1px solid #f3f4f6" }}>
                      <td style={{ padding: "0 16px", fontSize: "14px", fontWeight: 500, color: "#1f2937" }}>{loan.userName}</td>
                      <td style={{ padding: "0 16px", fontSize: "14px", color: "#1f2937" }}>{loan.bookTitle}</td>
                      <td style={{ padding: "0 16px", fontSize: "14px", color: "#1f2937" }}>{loan.loanDate}</td>
                      <td style={{ padding: "0 16px" }}>
                        <span
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            height: "30px",
                            padding: "0 12px",
                            borderRadius: "9999px",
                            fontSize: "13px",
                            fontWeight: 600,
                            backgroundColor: isReturned ? "#f3f4f6" : "#dbeafe",
                            color: isReturned ? "#4b5563" : "#1d4ed8",
                          }}
                        >
                          {isReturned ? "返却済み" : "貸出中"}
                        </span>
                      </td>
                      <td style={{ padding: "0 16px", textAlign: "right" }}>
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", gap: "10px" }}>
                          {!isReturned && (
                            <button
                              onClick={() => handleReturn(loan.id)}
                              style={{
                                display: "flex", alignItems: "center", justifyContent: "center",
                                height: "30px", padding: "0 12px", borderRadius: "8px", border: "none",
                                fontSize: "13px", fontWeight: 600, color: "#15803d", backgroundColor: "#dcfce7",
                                cursor: "pointer",
                              }}
                            >
                              <RotateCcw size={14} style={{ marginRight: "4px" }} />
                              返却
                            </button>
                          )}
                          <button
                            onClick={() => setDeleteTarget(loan.id)}
                            style={{
                              display: "flex", alignItems: "center", justifyContent: "center",
                              width: "30px", height: "30px", borderRadius: "8px", border: "none",
                              backgroundColor: "#ef4444", cursor: "pointer",
                            }}
                          >
                            <Trash2 size={14} color="#ffffff" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      <ConfirmDialog
        open={!!deleteTarget}
        title="貸出記録を削除"
        message="この貸出記録を削除してもよろしいですか？この操作は取り消せません。"
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />

      {toast && <Toast message={toast.message} type={toast.type} onClose={closeToast} />}
    </div>
  );
}
