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
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { trackBookAdded, trackBookUpdated, trackBookDeleted } from "@/lib/analytics";
import BookForm, { BookFormData } from "@/components/BookForm";
import BookTable, { Book } from "@/components/BookTable";
import Toast from "@/components/Toast";

interface ToastState {
  message: string;
  type: "success" | "error";
}

export default function BooksPage() {
  const [books, setBooks] = useState<Book[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingBook, setEditingBook] = useState<Book | null>(null);
  const [toast, setToast] = useState<ToastState | null>(null);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "books"), (snapshot) => {
      const data = snapshot.docs.map(
        (d) => ({ id: d.id, ...d.data() } as Book)
      );
      setBooks(data);
    });
    return unsubscribe;
  }, []);

  const handleSubmit = async (data: BookFormData) => {
    try {
      if (editingBook) {
        await updateDoc(doc(db, "books", editingBook.id), {
          ...data,
          updatedAt: serverTimestamp(),
        });
        trackBookUpdated(editingBook.id, data.title);
        setToast({ message: "書籍を更新しました", type: "success" });
      } else {
        await addDoc(collection(db, "books"), {
          ...data,
          createdAt: serverTimestamp(),
        });
        trackBookAdded(data.title, data.author, data.price, data.stock);
        setToast({ message: "書籍を追加しました", type: "success" });
      }
      setShowForm(false);
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
    setShowForm(true);
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingBook(null);
  };

  const closeToast = useCallback(() => setToast(null), []);

  return (
    <div>
      {/* ヘッダー */}
      <div className="flex items-center justify-between mb-10">
        <div>
          <h1 className="text-4xl font-bold text-gray-800">書籍管理</h1>
          <p className="text-lg text-gray-500 mt-2">
            登録された書籍を管理できます
          </p>
        </div>
        {!showForm && (
          <button
            onClick={() => {
              setEditingBook(null);
              setShowForm(true);
            }}
            className="bg-blue-500 text-white px-8 py-4 rounded-xl text-lg font-bold hover:bg-blue-600 transition-colors"
          >
            ＋ 追加
          </button>
        )}
      </div>

      {/* フォーム */}
      {showForm && (
        <BookForm
          initialData={
            editingBook
              ? {
                  title: editingBook.title,
                  author: editingBook.author,
                  price: editingBook.price,
                  stock: editingBook.stock,
                }
              : null
          }
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          isEditing={!!editingBook}
        />
      )}

      {/* テーブル */}
      <BookTable books={books} onEdit={handleEdit} onDelete={handleDelete} />

      {/* フッター */}
      <p className="text-sm text-gray-400 mt-4">全 {books.length} 冊</p>

      {/* トースト */}
      {toast && (
        <Toast message={toast.message} type={toast.type} onClose={closeToast} />
      )}
    </div>
  );
}
