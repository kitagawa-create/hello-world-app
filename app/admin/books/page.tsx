"use client";

import { useEffect, useState, useCallback } from "react";
import { Plus, Pencil, Trash2 } from "lucide-react";
import {
  subscribeBooks,
  addBook,
  updateBook,
  deleteBook,
  Book,
} from "@/lib/firestore";
import Toast from "@/components/admin/Toast";
import ConfirmDialog from "@/components/admin/ConfirmDialog";

const emptyForm = { title: "", author: "", price: "", stock: "" };

export default function BooksPage() {
  const [books, setBooks] = useState<Book[]>([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => subscribeBooks(setBooks), []);

  const closeToast = useCallback(() => setToast(null), []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = {
        title: form.title.trim(),
        author: form.author.trim(),
        price: Number(form.price),
        stock: Number(form.stock),
      };
      if (editingId) {
        await updateBook(editingId, data);
        setToast({ message: "書籍を更新しました", type: "success" });
        setEditingId(null);
      } else {
        await addBook(data);
        setToast({ message: "書籍を追加しました", type: "success" });
      }
      setForm(emptyForm);
    } catch {
      setToast({ message: "エラーが発生しました", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (book: Book) => {
    setEditingId(book.id);
    setForm({
      title: book.title,
      author: book.author,
      price: String(book.price),
      stock: String(book.stock),
    });
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await deleteBook(deleteTarget);
      setToast({ message: "書籍を削除しました", type: "success" });
    } catch {
      setToast({ message: "削除に失敗しました", type: "error" });
    }
    setDeleteTarget(null);
  };

  const handleCancel = () => {
    setEditingId(null);
    setForm(emptyForm);
  };

  return (
    <div className="px-[40px] pt-[28px] pb-[40px]">
      {/* Title */}
      <h1 className="text-[28px] font-[800]" style={{ color: "#111827" }}>書籍管理</h1>
      <p className="text-[14px] font-[500] mt-[8px]" style={{ color: "#4b5563" }}>
        書籍の登録・編集・削除を行います
      </p>

      {/* Book Form Card */}
      <div
        className="bg-white rounded-[16px] mt-[28px] overflow-hidden"
        style={{ border: "1px solid #e5e7eb", boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}
      >
        <div className="px-[24px] py-[18px]" style={{ borderBottom: "1px solid #edf0f3" }}>
          <h2 className="text-[20px] font-[800]" style={{ color: "#111827" }}>
            {editingId ? "書籍を編集" : "新規書籍登録"}
          </h2>
          <p className="text-[14px] mt-[2px]" style={{ color: "#6b7280" }}>
            {editingId ? "書籍情報を更新します" : "新しい書籍を登録します"}
          </p>
        </div>
        <form onSubmit={handleSubmit} className="px-[24px] pt-[28px] pb-[24px]">
          <div className="grid grid-cols-2 gap-x-[16px] gap-y-[18px]">
            <div>
              <label className="block text-[14px] font-[600] mb-[6px]" style={{ color: "#374151" }}>
                タイトル <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                placeholder="書籍タイトルを入力"
                className="w-full px-[14px] rounded-[10px] bg-white text-[14px] focus:outline-none focus:ring-2 focus:ring-blue-400/40"
                style={{ height: "42px", border: "1px solid #cfd6df", color: "#1f2937" }}
              />
            </div>
            <div>
              <label className="block text-[14px] font-[600] mb-[6px]" style={{ color: "#374151" }}>
                著者 <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={form.author}
                onChange={(e) => setForm({ ...form, author: e.target.value })}
                placeholder="著者名を入力"
                className="w-full px-[14px] rounded-[10px] bg-white text-[14px] focus:outline-none focus:ring-2 focus:ring-blue-400/40"
                style={{ height: "42px", border: "1px solid #cfd6df", color: "#1f2937" }}
              />
            </div>
            <div>
              <label className="block text-[14px] font-[600] mb-[6px]" style={{ color: "#374151" }}>
                価格 <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                required
                min="0"
                value={form.price}
                onChange={(e) => setForm({ ...form, price: e.target.value })}
                placeholder="価格を入力"
                className="w-full px-[14px] rounded-[10px] bg-white text-[14px] focus:outline-none focus:ring-2 focus:ring-blue-400/40"
                style={{ height: "42px", border: "1px solid #cfd6df", color: "#1f2937" }}
              />
            </div>
            <div>
              <label className="block text-[14px] font-[600] mb-[6px]" style={{ color: "#374151" }}>
                在庫数 <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                required
                min="0"
                value={form.stock}
                onChange={(e) => setForm({ ...form, stock: e.target.value })}
                placeholder="在庫数を入力"
                className="w-full px-[14px] rounded-[10px] bg-white text-[14px] focus:outline-none focus:ring-2 focus:ring-blue-400/40"
                style={{ height: "42px", border: "1px solid #cfd6df", color: "#1f2937" }}
              />
            </div>
          </div>
          <div className="flex justify-end gap-[12px] mt-[24px]">
            {editingId && (
              <button
                type="button"
                onClick={handleCancel}
                className="px-5 py-2.5 rounded-[12px] text-[14px] font-[600] bg-gray-100 hover:bg-gray-200 transition-colors"
                style={{ color: "#374151" }}
              >
                キャンセル
              </button>
            )}
            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-[8px] justify-center rounded-[12px] text-[14px] font-[700] text-white transition-colors hover:opacity-90 disabled:opacity-50"
              style={{ width: "120px", height: "54px", backgroundColor: "#2f5df5" }}
            >
              <Plus size={18} />
              {editingId ? "更新する" : "書籍を追加"}
            </button>
          </div>
        </form>
      </div>

      {/* Book List Card */}
      <div
        className="bg-white rounded-[16px] mt-[24px] overflow-hidden"
        style={{ border: "1px solid #e5e7eb", boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}
      >
        <div className="px-[24px] py-[18px]" style={{ borderBottom: "1px solid #edf0f3" }}>
          <h2 className="text-[20px] font-[800]" style={{ color: "#111827" }}>書籍一覧</h2>
          <p className="text-[14px] mt-[2px]" style={{ color: "#6b7280" }}>
            登録済みの書籍: {books.length}件
          </p>
        </div>
        <div className="p-[24px]">
          <table className="w-full">
            <thead>
              <tr style={{ backgroundColor: "#f8fafc" }}>
                <th className="text-left px-[16px] py-[12px] text-[14px] font-[700]" style={{ color: "#374151" }}>タイトル</th>
                <th className="text-left px-[16px] py-[12px] text-[14px] font-[700]" style={{ color: "#374151" }}>著者</th>
                <th className="text-left px-[16px] py-[12px] text-[14px] font-[700]" style={{ color: "#374151" }}>価格</th>
                <th className="text-left px-[16px] py-[12px] text-[14px] font-[700]" style={{ color: "#374151" }}>在庫数</th>
                <th className="text-right px-[16px] py-[12px] text-[14px] font-[700]" style={{ color: "#374151" }}>操作</th>
              </tr>
            </thead>
            <tbody>
              {books.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-[16px] py-[40px] text-center text-[14px]" style={{ color: "#9ca3af" }}>
                    書籍が登録されていません
                  </td>
                </tr>
              ) : (
                books.map((book) => (
                  <tr key={book.id} className="border-b border-gray-100 last:border-b-0 hover:bg-gray-50/50 transition-colors" style={{ height: "54px" }}>
                    <td className="px-[16px] text-[14px] font-[500]" style={{ color: "#1f2937" }}>{book.title}</td>
                    <td className="px-[16px] text-[14px]" style={{ color: "#1f2937" }}>{book.author}</td>
                    <td className="px-[16px] text-[14px]" style={{ color: "#1f2937" }}>¥{book.price.toLocaleString()}</td>
                    <td className="px-[16px]">
                      <span
                        className="inline-flex items-center justify-center rounded-full text-[13px] font-[600]"
                        style={{
                          height: "28px",
                          padding: "0 10px",
                          backgroundColor: book.stock > 0 ? "#dcfce7" : "#fee2e2",
                          color: book.stock > 0 ? "#15803d" : "#dc2626",
                        }}
                      >
                        {book.stock}冊
                      </span>
                    </td>
                    <td className="px-[16px] text-right">
                      <div className="flex items-center justify-end gap-[10px]">
                        <button
                          onClick={() => handleEdit(book)}
                          className="flex items-center justify-center rounded-[8px] bg-gray-100 hover:bg-gray-200 transition-colors"
                          style={{ width: "38px", height: "28px" }}
                        >
                          <Pencil size={14} style={{ color: "#4b5563" }} />
                        </button>
                        <button
                          onClick={() => setDeleteTarget(book.id)}
                          className="flex items-center justify-center rounded-[8px] bg-red-500 hover:bg-red-600 transition-colors"
                          style={{ width: "38px", height: "28px" }}
                        >
                          <Trash2 size={14} className="text-white" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Confirm Dialog */}
      <ConfirmDialog
        open={!!deleteTarget}
        title="書籍を削除"
        message="この書籍を削除してもよろしいですか？この操作は取り消せません。"
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />

      {toast && <Toast message={toast.message} type={toast.type} onClose={closeToast} />}
    </div>
  );
}
