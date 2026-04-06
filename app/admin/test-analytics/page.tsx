"use client";

import { useState } from "react";
import { logEvent } from "firebase/analytics";
import { getAnalyticsInstance } from "@/lib/firebase";

export default function TestAnalyticsPage() {
  const [count, setCount] = useState(0);
  const [status, setStatus] = useState("");

  const handleClick = async () => {
    try {
      const analytics = await getAnalyticsInstance();
      if (analytics) {
        logEvent(analytics, "test_button_click", {
          click_count: count + 1,
          timestamp: new Date().toISOString(),
        });
        setCount((c) => c + 1);
        setStatus("送信成功");
        console.log("[Analytics] test_button_click 送信済み", { click_count: count + 1 });
      } else {
        setStatus("Analyticsが初期化されていません");
      }
    } catch (err) {
      setStatus("送信失敗");
      console.error("[Analytics] エラー:", err);
    }

    setTimeout(() => setStatus(""), 3000);
  };

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-4">Analytics テスト</h1>
      <p className="text-lg text-gray-500 mb-8">ボタンを押すと test_button_click イベントが送信されます</p>

      <button
        onClick={handleClick}
        className="bg-blue-500 text-white px-10 py-4 rounded-xl text-lg font-bold hover:bg-blue-600 transition-colors"
      >
        テスト送信（{count}回）
      </button>

      {status && (
        <p className={`mt-4 text-lg font-semibold ${status === "送信成功" ? "text-green-600" : "text-red-500"}`}>
          {status}
        </p>
      )}
    </div>
  );
}
