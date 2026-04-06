"use client";

import { useState } from "react";

export interface Book {
  id: string;
  title: string;
  author: string;
  stock: number;
}

interface BookTableProps {
  books: Book[];
  onEdit: (book: Book) => void;
  onDelete: (id: string) => Promise<void>;
}

export default function BookTable({ books, onEdit, onDelete }: BookTableProps) {
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    await onDelete(id);
    setDeletingId(null);
  };

  return (
    <div className="bg-white rounded-2xl shadow-md overflow-hidden">
      <table className="w-full">
        <thead>
          <tr className="bg-gray-50 border-b border-gray-200">
            <th className="text-left px-8 py-5 text-base font-semibold text-gray-500">タイトル</th>
            <th className="text-left px-8 py-5 text-base font-semibold text-gray-500">著者</th>
            <th className="text-right px-8 py-5 text-base font-semibold text-gray-500">在庫数</th>
            <th className="text-right px-8 py-5 text-base font-semibold text-gray-500">操作</th>
          </tr>
        </thead>
        <tbody>
          {books.length === 0 ? (
            <tr>
              <td colSpan={4} className="px-8 py-20 text-center text-gray-400 text-lg">
                書籍がまだ登録されていません
              </td>
            </tr>
          ) : (
            books.map((book) => (
              <tr
                key={book.id}
                className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
              >
                <td className="px-8 py-6 text-lg font-semibold text-gray-800">{book.title}</td>
                <td className="px-8 py-6 text-lg text-gray-600">{book.author}</td>
                <td className="px-8 py-6 text-right">
                  <span
                    className={`inline-block px-4 py-1.5 rounded-full text-base font-bold ${
                      book.stock > 0
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {book.stock}
                  </span>
                </td>
                <td className="px-8 py-6 text-right">
                  {deletingId === book.id ? (
                    <div className="flex items-center justify-end gap-3">
                      <span className="text-base text-red-500">削除しますか？</span>
                      <button
                        onClick={() => handleDelete(book.id)}
                        className="text-base text-white bg-red-500 px-5 py-2.5 rounded-lg font-semibold hover:bg-red-600 transition-colors"
                      >
                        はい
                      </button>
                      <button
                        onClick={() => setDeletingId(null)}
                        className="text-base text-gray-500 bg-gray-100 px-5 py-2.5 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
                      >
                        いいえ
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center justify-end gap-4">
                      <button
                        onClick={() => onEdit(book)}
                        className="text-base text-blue-500 hover:text-blue-700 font-bold px-5 py-2.5 rounded-xl hover:bg-blue-50 transition-colors"
                      >
                        編集
                      </button>
                      <button
                        onClick={() => setDeletingId(book.id)}
                        className="text-base text-red-500 hover:text-red-700 font-bold px-5 py-2.5 rounded-xl hover:bg-red-50 transition-colors"
                      >
                        削除
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
