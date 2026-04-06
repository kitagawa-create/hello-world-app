"use client";

import { useState, useEffect } from "react";

export interface BookFormData {
  title: string;
  author: string;
  price: number;
  stock: number;
}

interface BookFormProps {
  initialData?: BookFormData | null;
  onSubmit: (data: BookFormData) => Promise<void>;
  onCancel: () => void;
  isEditing: boolean;
}

export default function BookForm({ initialData, onSubmit, onCancel, isEditing }: BookFormProps) {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title);
      setAuthor(initialData.author);
      setPrice(String(initialData.price));
      setStock(String(initialData.stock));
    } else {
      setTitle("");
      setAuthor("");
      setPrice("");
      setStock("");
    }
  }, [initialData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await onSubmit({
        title: title.trim(),
        author: author.trim(),
        price: Number(price),
        stock: Number(stock),
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-md p-10 mb-10">
      <h2 className="text-2xl font-bold text-gray-800 mb-8">
        {isEditing ? "書籍を編集" : "書籍を追加"}
      </h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label className="block text-base font-semibold text-gray-600 mb-2">タイトル</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-6 py-4 border border-gray-300 rounded-xl text-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="書籍タイトル"
            />
          </div>
          <div>
            <label className="block text-base font-semibold text-gray-600 mb-2">著者</label>
            <input
              type="text"
              required
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              className="w-full px-6 py-4 border border-gray-300 rounded-xl text-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="著者名"
            />
          </div>
          <div>
            <label className="block text-base font-semibold text-gray-600 mb-2">価格（円）</label>
            <input
              type="number"
              required
              min="0"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="w-full px-6 py-4 border border-gray-300 rounded-xl text-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="2800"
            />
          </div>
          <div>
            <label className="block text-base font-semibold text-gray-600 mb-2">在庫数</label>
            <input
              type="number"
              required
              min="0"
              value={stock}
              onChange={(e) => setStock(e.target.value)}
              className="w-full px-6 py-4 border border-gray-300 rounded-xl text-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="10"
            />
          </div>
        </div>
        <div className="flex items-center gap-5 pt-4">
          <button
            type="submit"
            disabled={submitting}
            className="bg-blue-500 text-white px-10 py-4 rounded-xl text-lg font-bold hover:bg-blue-600 transition-colors disabled:opacity-50"
          >
            {submitting ? "保存中..." : isEditing ? "更新する" : "追加する"}
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="text-gray-500 px-10 py-4 rounded-xl text-lg font-semibold hover:bg-gray-100 transition-colors"
          >
            キャンセル
          </button>
        </div>
      </form>
    </div>
  );
}
