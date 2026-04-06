"use client";

import { useEffect, useState, useCallback } from "react";
import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  onSnapshot,
  serverTimestamp,
  Timestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { trackBookAdded, trackBookUpdated, trackBookDeleted, trackBookLent, trackBookReturned } from "@/lib/analytics";
import BookForm, { BookFormData } from "@/components/BookForm";
import BookTable, { Book } from "@/components/BookTable";
import Toast from "@/components/Toast";

interface Lending {
  id: string;
  bookTitle: string;
  borrower: string;
  lentAt: Timestamp;
  dueDate: Timestamp;
  returnedAt: Timestamp | null;
}

type Status = "returned" | "due-soon" | "lending" | "overdue";

function getStatus(lending: Lending): Status {
  if (lending.returnedAt) return "returned";
  const now = new Date();
  const due = lending.dueDate.toDate();
  const diff = due.getTime() - now.getTime();
  const daysLeft = diff / (1000 * 60 * 60 * 24);
  if (daysLeft < 0) return "overdue";
  if (daysLeft <= 3) return "due-soon";
  return "lending";
}

const statusStyle: Record<Status, string> = {
  lending: "bg-blue-100 text-blue-700",
  "due-soon": "bg-amber-100 text-amber-700",
  overdue: "bg-red-100 text-red-700",
  returned: "bg-emerald-100 text-emerald-700",
};

const statusLabel: Record<Status, string> = {
  lending: "貸出中",
  "due-soon": "期限間近",
  overdue: "延滞中",
  returned: "返却済",
};

interface ToastState {
  message: string;
  type: "success" | "error";
}

type Tab = "books" | "lendings";

const emptyLendForm = {
  bookTitle: "",
  borrower: "",
  lendDate: new Date().toISOString().split("T")[0],
  dueDays: "14",
};

export default function BooksPage() {
  const [tab, setTab] = useState<Tab>("books");
  const [books, setBooks] = useState<Book[]>([]);
  const [lendings, setLendings] = useState<Lending[]>([]);
  const [showBookForm, setShowBookForm] = useState(false);
  const [editingBook, setEditingBook] = useState<Book | null>(null);
  const [showLendForm, setShowLendForm] = useState(false);
  const [lendForm, setLendForm] = useState(emptyLendForm);
  const [toast, setToast] = useState<ToastState | null>(null);

  useEffect(() => {
    const unsub = onSnapshot(collection(db, "books"), (snapshot) => {
      setBooks(snapshot.docs.map((d) => ({ id: d.id, ...d.data() } as Book)));
    });
    return unsub;
  }, []);

  useEffect(() => {
    const unsub = onSnapshot(collection(db, "lendings"), (snapshot) => {
      const data = snapshot.docs.map((d) => ({ id: d.id, ...d.data() } as Lending));
      data.sort((a, b) => (getStatus(a) === "returned" ? 1 : 0) - (getStatus(b) === "returned" ? 1 : 0));
      setLendings(data);
    });
    return unsub;
  }, []);

  const handleBookSubmit = async (data: BookFormData) => {
    try {
      if (editingBook) {
        await updateDoc(doc(db, "books", editingBook.id), { ...data, updatedAt: serverTimestamp() });
        trackBookUpdated(editingBook.id, data.title);
        setToast({ message: "書籍を更新しました", type: "success" });
      } else {
        await addDoc(collection(db, "books"), { ...data, createdAt: serverTimestamp() });
        trackBookAdded(data.title, data.author, data.stock);
        setToast({ message: "書籍を追加しました", type: "success" });
      }
      setShowBookForm(false);
      setEditingBook(null);
    } catch {
      setToast({ message: "エラーが発生しました", type: "error" });
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const book = books.find((b) => b.id === id);
      await deleteDoc(doc(db, "books", id));
      if (book) trackBookDeleted(id, book.title);
      setToast({ message: "書籍を削除しました", type: "success" });
    } catch {
      setToast({ message: "削除に失敗しました", type: "error" });
    }
  };

  const handleEdit = (book: Book) => {
    setEditingBook(book);
    setShowBookForm(true);
  };

  const handleLend = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const lendDate = new Date(lendForm.lendDate);
      const due = new Date(lendDate.getTime() + Number(lendForm.dueDays) * 86400000);
      await addDoc(collection(db, "lendings"), {
        bookTitle: lendForm.bookTitle,
        borrower: lendForm.borrower.trim(),
        lendDate: Timestamp.fromDate(lendDate),
        lentAt: serverTimestamp(),
        dueDate: Timestamp.fromDate(due),
        returnedAt: null,
      });
      trackBookLent(lendForm.bookTitle, lendForm.borrower.trim(), Number(lendForm.dueDays));
      setToast({ message: "貸出しました", type: "success" });
      setLendForm(emptyLendForm);
      setShowLendForm(false);
    } catch {
      setToast({ message: "エラーが発生しました", type: "error" });
    }
  };

  const handleReturn = async (id: string) => {
    const lending = lendings.find((l) => l.id === id);
    await updateDoc(doc(db, "lendings", id), { returnedAt: serverTimestamp() });
    if (lending) trackBookReturned(lending.bookTitle, lending.borrower, getStatus(lending) === "overdue");
    setToast({ message: "返却しました", type: "success" });
  };

  const closeToast = useCallback(() => setToast(null), []);

  const activeLendings = lendings.filter((l) => getStatus(l) !== "returned").length;
  const overdueLendings = lendings.filter((l) => getStatus(l) === "overdue").length;
  const totalStock = books.reduce((sum, b) => sum + (b.stock || 0), 0);

  return (
    <div className="max-w-6xl">
      {/* ヘッダー */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">書籍管理</h1>
        <p className="text-gray-500 mt-1">書籍の登録・貸出をまとめて管理</p>
      </div>

      {/* 統計カード */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <p className="text-sm text-gray-400 mb-1">総書籍数</p>
          <p className="text-4xl font-bold text-gray-900">{books.length}</p>
        </div>
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <p className="text-sm text-gray-400 mb-1">総在庫数</p>
          <p className="text-4xl font-bold text-gray-900">{totalStock}</p>
        </div>
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <p className="text-sm text-gray-400 mb-1">貸出中</p>
          <p className="text-4xl font-bold text-blue-600">{activeLendings}</p>
        </div>
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <p className="text-sm text-gray-400 mb-1">延滞中</p>
          <p className={`text-4xl font-bold ${overdueLendings > 0 ? "text-red-500" : "text-gray-900"}`}>
            {overdueLendings}
          </p>
        </div>
      </div>

      {/* タブ + アクションボタン */}
      <div className="flex items-center justify-between mb-10">
        <div className="flex gap-4">
          <button
            onClick={() => setTab("books")}
            className={`px-10 py-4 rounded-2xl text-base font-bold transition-all ${
              tab === "books" ? "bg-white text-gray-900 shadow-md" : "bg-gray-200 text-gray-500 hover:text-gray-700"
            }`}
          >
            📚 書籍一覧
          </button>
          <button
            onClick={() => setTab("lendings")}
            className={`px-10 py-4 rounded-2xl text-base font-bold transition-all ${
              tab === "lendings" ? "bg-white text-gray-900 shadow-md" : "bg-gray-200 text-gray-500 hover:text-gray-700"
            }`}
          >
            📋 貸出状況
          </button>
        </div>

        {tab === "books" && !showBookForm && (
          <button
            onClick={() => { setEditingBook(null); setShowBookForm(true); }}
            className="bg-blue-500 text-white px-8 py-4 rounded-2xl text-base font-bold hover:bg-blue-600 transition-colors shadow-sm"
          >
            ＋ 書籍を追加
          </button>
        )}
        {tab === "lendings" && !showLendForm && (
          <button
            onClick={() => { setShowLendForm(true); setLendForm(emptyLendForm); }}
            className="bg-blue-500 text-white px-8 py-4 rounded-2xl text-base font-bold hover:bg-blue-600 transition-colors shadow-sm"
          >
            ＋ 新規貸出
          </button>
        )}
      </div>

      {/* ===== 書籍一覧 ===== */}
      {tab === "books" && (
        <>

          {showBookForm && (
            <BookForm
              initialData={editingBook ? { title: editingBook.title, author: editingBook.author, stock: editingBook.stock } : null}
              onSubmit={handleBookSubmit}
              onCancel={() => { setShowBookForm(false); setEditingBook(null); }}
              isEditing={!!editingBook}
            />
          )}

          <BookTable books={books} onEdit={handleEdit} onDelete={handleDelete} />
          <p className="text-sm text-gray-400 mt-4">全 {books.length} 冊</p>
        </>
      )}

      {/* ===== 貸出状況 ===== */}
      {tab === "lendings" && (
        <>
          {showLendForm && (
            <div className="bg-white rounded-2xl shadow-sm p-8 mb-8">
              <h2 className="text-xl font-bold text-gray-900 mb-6">新規貸出</h2>
              <form onSubmit={handleLend} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-semibold text-gray-500 mb-2">利用者名</label>
                    <input
                      type="text"
                      required
                      value={lendForm.borrower}
                      onChange={(e) => setLendForm({ ...lendForm, borrower: e.target.value })}
                      className="w-full px-5 py-3.5 border border-gray-200 rounded-xl text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="山田太郎"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-500 mb-2">書籍タイトル</label>
                    <select
                      required
                      value={lendForm.bookTitle}
                      onChange={(e) => setLendForm({ ...lendForm, bookTitle: e.target.value })}
                      className="w-full px-5 py-3.5 border border-gray-200 rounded-xl text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">選択してください</option>
                      {books.map((book) => (
                        <option key={book.id} value={book.title}>{book.title}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-500 mb-2">貸出希望日</label>
                    <input
                      type="date"
                      required
                      value={lendForm.lendDate}
                      onChange={(e) => setLendForm({ ...lendForm, lendDate: e.target.value })}
                      className="w-full px-5 py-3.5 border border-gray-200 rounded-xl text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-500 mb-2">貸出期間（日）</label>
                    <input
                      type="number"
                      required
                      min="1"
                      value={lendForm.dueDays}
                      onChange={(e) => setLendForm({ ...lendForm, dueDays: e.target.value })}
                      className="w-full px-5 py-3.5 border border-gray-200 rounded-xl text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="14"
                    />
                  </div>
                </div>
                <div className="flex gap-4 pt-2">
                  <button type="submit" className="bg-blue-500 text-white px-8 py-3.5 rounded-xl text-base font-bold hover:bg-blue-600 transition-colors">
                    貸出する
                  </button>
                  <button type="button" onClick={() => setShowLendForm(false)} className="text-gray-500 px-8 py-3.5 rounded-xl text-base font-semibold hover:bg-gray-100 transition-colors">
                    キャンセル
                  </button>
                </div>
              </form>
            </div>
          )}

          <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="text-left px-6 py-4 text-sm font-semibold text-gray-400">ステータス</th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-gray-400">書籍</th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-gray-400">借主</th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-gray-400">返却期限</th>
                  <th className="text-right px-6 py-4 text-sm font-semibold text-gray-400">操作</th>
                </tr>
              </thead>
              <tbody>
                {lendings.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-16 text-center text-gray-300 text-base">
                      貸出記録がありません
                    </td>
                  </tr>
                ) : (
                  lendings.map((lending) => {
                    const status = getStatus(lending);
                    return (
                      <tr key={lending.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                        <td className="px-6 py-5">
                          <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${statusStyle[status]}`}>
                            {statusLabel[status]}
                          </span>
                        </td>
                        <td className="px-6 py-5 text-base font-semibold text-gray-800">{lending.bookTitle}</td>
                        <td className="px-6 py-5 text-base text-gray-500">{lending.borrower}</td>
                        <td className="px-6 py-5 text-base text-gray-500">
                          {lending.dueDate?.toDate().toLocaleDateString("ja-JP")}
                        </td>
                        <td className="px-6 py-5 text-right">
                          {status !== "returned" ? (
                            <button
                              onClick={() => handleReturn(lending.id)}
                              className="text-base text-emerald-600 hover:text-emerald-800 font-bold transition-colors"
                            >
                              返却する
                            </button>
                          ) : (
                            <span className="text-sm text-gray-300">
                              {lending.returnedAt?.toDate().toLocaleDateString("ja-JP")}
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </>
      )}

      {toast && <Toast message={toast.message} type={toast.type} onClose={closeToast} />}
    </div>
  );
}
