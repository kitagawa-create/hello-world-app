"use client";

import { useEffect, ReactNode } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/lib/auth";

export default function AdminLayout({ children }: { children: ReactNode }) {
  const { user, loading, signOut } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

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
      <aside className="w-80 shrink-0 bg-gray-900 text-white flex flex-col justify-between p-8">
        <div>
          {/* ロゴ */}
          <div className="flex items-center gap-4 mb-12">
            <div className="w-14 h-14 bg-blue-500 rounded-2xl flex items-center justify-center text-white text-2xl font-bold">
              B
            </div>
            <div>
              <p className="text-2xl font-bold leading-tight">BookShelf</p>
              <p className="text-base text-gray-400">管理システム</p>
            </div>
          </div>

          {/* ナビゲーション */}
          <nav className="space-y-3">
            <a
              href="/admin/books"
              className={`flex items-center gap-4 px-6 py-4 rounded-xl text-lg font-semibold transition-colors ${
                pathname === "/admin/books"
                  ? "bg-blue-500 text-white"
                  : "text-gray-300 hover:bg-gray-800"
              }`}
            >
              <span className="text-2xl">📚</span>
              書籍管理
            </a>
            <a
              href="/admin/lendings"
              className={`flex items-center gap-4 px-6 py-4 rounded-xl text-lg font-semibold transition-colors ${
                pathname === "/admin/lendings"
                  ? "bg-blue-500 text-white"
                  : "text-gray-300 hover:bg-gray-800"
              }`}
            >
              <span className="text-2xl">📋</span>
              貸出管理
            </a>
          </nav>
        </div>

        {/* 下部 */}
        <div className="space-y-3">
          <p className="px-6 text-sm text-gray-500 truncate">{user.email}</p>
          <button
            onClick={async () => {
              await signOut();
              router.push("/login");
            }}
            className="flex items-center gap-4 px-6 py-4 rounded-xl text-lg text-gray-400 hover:text-white hover:bg-gray-800 transition-colors w-full"
          >
            <span className="text-2xl">🚪</span>
            ログアウト
          </button>
        </div>
      </aside>

      {/* メインコンテンツ */}
      <main className="flex-1 min-w-0 p-10">{children}</main>
    </div>
  );
}
