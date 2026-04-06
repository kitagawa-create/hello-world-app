"use client";

import { useEffect, ReactNode } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth";

export default function AdminLayout({ children }: { children: ReactNode }) {
  const { user, loading, signOut } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <p className="text-gray-400">読み込み中...</p>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen flex bg-gray-100">
      {/* サイドバー */}
      <aside className="w-72 shrink-0 bg-slate-900 text-white flex flex-col justify-between px-6 py-8">
        <div>
          <a href="/admin/books" className="flex items-center gap-3 mb-12">
            <div className="w-12 h-12 bg-blue-500 rounded-2xl flex items-center justify-center">
              <span className="text-2xl">📚</span>
            </div>
            <div>
              <p className="text-xl font-bold leading-tight">BookShelf</p>
              <p className="text-xs text-slate-400 mt-0.5">書籍管理システム</p>
            </div>
          </a>
        </div>

        <div className="border-t border-slate-700 pt-6">
          <p className="text-xs text-slate-500 truncate mb-3 px-1">{user.email}</p>
          <button
            onClick={async () => {
              await signOut();
              router.push("/login");
            }}
            className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-base text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            🚪 ログアウト
          </button>
        </div>
      </aside>

      {/* メインコンテンツ */}
      <main className="flex-1 min-w-0 p-10 overflow-y-auto">{children}</main>
    </div>
  );
}
