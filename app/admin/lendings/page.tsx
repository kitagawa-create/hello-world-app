"use client";

import { useEffect, useState } from "react";
import {
  collection,
  addDoc,
  updateDoc,
  doc,
  onSnapshot,
  serverTimestamp,
  Timestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { trackBookLent, trackBookReturned } from "@/lib/analytics";

interface Book {
  id: string;
  title: string;
}

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

const statusConfig: Record<Status, { label: string; bg: string; text: string }> = {
  lending: { label: "貸出中", bg: "bg-blue-50", text: "text-blue-700" },
  "due-soon": { label: "返却期限間近", bg: "bg-yellow-50", text: "text-yellow-700" },
  overdue: { label: "延滞中", bg: "bg-red-50", text: "text-red-700" },
  returned: { label: "返却済み", bg: "bg-green-50", text: "text-green-700" },
};

const emptyForm = { bookTitle: "", borrower: "", lendDate: new Date().toISOString().split("T")[0], dueDays: "14" };

export default function LendingsPage() {
  const [books, setBooks] = useState<Book[]>([]);
  const [lendings, setLendings] = useState<Lending[]>([]);
  const [form, setForm] = useState(emptyForm);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    const unsubBooks = onSnapshot(collection(db, "books"), (snapshot) => {
      setBooks(snapshot.docs.map((d) => ({ id: d.id, title: d.data().title } as Book)));
    });
    return unsubBooks;
  }, []);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "lendings"), (snapshot) => {
      const data = snapshot.docs.map((d) => ({ id: d.id, ...d.data() } as Lending));
      data.sort((a, b) => {
        const sa = getStatus(a) === "returned" ? 1 : 0;
        const sb = getStatus(b) === "returned" ? 1 : 0;
        return sa - sb;
      });
      setLendings(data);
    });
    return unsubscribe;
  }, []);

  const handleLend = async (e: React.FormEvent) => {
    e.preventDefault();
    const lendDate = new Date(form.lendDate);
    const due = new Date(lendDate.getTime() + Number(form.dueDays) * 24 * 60 * 60 * 1000);
    await addDoc(collection(db, "lendings"), {
      bookTitle: form.bookTitle.trim(),
      borrower: form.borrower.trim(),
      lendDate: Timestamp.fromDate(lendDate),
      lentAt: serverTimestamp(),
      dueDate: Timestamp.fromDate(due),
      returnedAt: null,
    });
    trackBookLent(form.bookTitle.trim(), form.borrower.trim(), Number(form.dueDays));
    setForm(emptyForm);
    setShowForm(false);
  };

  const handleReturn = async (id: string) => {
    const lending = lendings.find((l) => l.id === id);
    await updateDoc(doc(db, "lendings", id), { returnedAt: serverTimestamp() });
    if (lending) {
      const isOverdue = getStatus(lending) === "overdue";
      trackBookReturned(lending.bookTitle, lending.borrower, isOverdue);
    }
  };

  const counts = lendings.reduce(
    (acc, l) => {
      const s = getStatus(l);
      acc[s] = (acc[s] || 0) + 1;
      return acc;
    },
    {} as Record<Status, number>
  );

  return (
    <div className="p-8">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">貸出管理</h2>
            <p className="text-sm text-gray-500 mt-1">書籍の貸出状況を管理できます</p>
          </div>
          <button
            onClick={() => { setShowForm(true); setForm(emptyForm); }}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            + 新規貸出
          </button>
        </div>
        {/* 統計カード */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          {(["lending", "due-soon", "overdue", "returned"] as Status[]).map((s) => (
            <div
              key={s}
              className={`rounded-xl p-5 shadow-sm border border-gray-100 ${statusConfig[s].bg}`}
            >
              <p className={`text-sm ${statusConfig[s].text}`}>{statusConfig[s].label}</p>
              <p className={`text-3xl font-bold mt-1 ${statusConfig[s].text}`}>
                {counts[s] || 0}
              </p>
            </div>
          ))}
        </div>

        {/* 新規貸出フォーム */}
        {showForm && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8">
            <h2 className="text-lg font-bold text-gray-900 mb-4">新規貸出</h2>
            <form onSubmit={handleLend} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">利用者名</label>
                <input
                  type="text"
                  required
                  value={form.borrower}
                  onChange={(e) => setForm({ ...form, borrower: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-gray-900"
                  placeholder="山田太郎"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">書籍タイトル</label>
                <select
                  required
                  value={form.bookTitle}
                  onChange={(e) => setForm({ ...form, bookTitle: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-gray-900"
                >
                  <option value="">選択してください</option>
                  {books.map((book) => (
                    <option key={book.id} value={book.title}>{book.title}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">貸出希望日</label>
                <input
                  type="date"
                  required
                  value={form.lendDate}
                  onChange={(e) => setForm({ ...form, lendDate: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-gray-900"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">貸出期間（日）</label>
                <input
                  type="number"
                  required
                  min="1"
                  value={form.dueDays}
                  onChange={(e) => setForm({ ...form, dueDays: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-gray-900"
                  placeholder="14"
                />
              </div>
              <div className="sm:col-span-2 flex gap-3 pt-2">
                <button
                  type="submit"
                  className="bg-indigo-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-indigo-700 transition-colors"
                >
                  貸出する
                </button>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="bg-gray-100 text-gray-700 px-6 py-2 rounded-lg font-medium hover:bg-gray-200 transition-colors"
                >
                  キャンセル
                </button>
              </div>
            </form>
          </div>
        )}

        {/* 貸出一覧 */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="text-left px-6 py-3 text-sm font-semibold text-gray-600">ステータス</th>
                <th className="text-left px-6 py-3 text-sm font-semibold text-gray-600">書籍</th>
                <th className="text-left px-6 py-3 text-sm font-semibold text-gray-600">借主</th>
                <th className="text-left px-6 py-3 text-sm font-semibold text-gray-600">返却期限</th>
                <th className="text-right px-6 py-3 text-sm font-semibold text-gray-600">操作</th>
              </tr>
            </thead>
            <tbody>
              {lendings.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-gray-400">
                    貸出記録がありません
                  </td>
                </tr>
              ) : (
                lendings.map((lending) => {
                  const status = getStatus(lending);
                  const cfg = statusConfig[status];
                  return (
                    <tr key={lending.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${cfg.bg} ${cfg.text}`}>
                          {cfg.label}
                        </span>
                      </td>
                      <td className="px-6 py-4 font-medium text-gray-900">{lending.bookTitle}</td>
                      <td className="px-6 py-4 text-gray-600">{lending.borrower}</td>
                      <td className="px-6 py-4 text-gray-600">
                        {lending.dueDate?.toDate().toLocaleDateString("ja-JP")}
                      </td>
                      <td className="px-6 py-4 text-right">
                        {status !== "returned" ? (
                          <button
                            onClick={() => handleReturn(lending.id)}
                            className="text-sm text-green-600 hover:text-green-800 font-medium"
                          >
                            返却する
                          </button>
                        ) : (
                          <span className="text-sm text-gray-400">
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
    </div>
  );
}
