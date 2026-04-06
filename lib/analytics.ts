import { logEvent } from "firebase/analytics";
import { getAnalyticsInstance } from "./firebase";

async function track(eventName: string, params: Record<string, unknown>) {
  try {
    const analytics = await getAnalyticsInstance();
    if (analytics) {
      logEvent(analytics, eventName, params);
      console.log(`[Analytics] イベント送信: ${eventName}`, params);
    } else {
      console.warn("[Analytics] インスタンスが取得できません");
    }
  } catch (err) {
    console.error("[Analytics] エラー:", err);
  }
}

export function trackBookAdded(title: string, author: string, stock: number) {
  track("book_added", { title, author, stock });
}

export function trackBookUpdated(bookId: string, title: string) {
  track("book_updated", { book_id: bookId, title });
}

export function trackBookDeleted(bookId: string, title: string) {
  track("book_deleted", { book_id: bookId, title });
}

export function trackBookSearched(query: string, resultsCount: number) {
  track("book_searched", { query, results_count: resultsCount });
}

export function trackBookLent(bookTitle: string, borrower: string, dueDays: number) {
  track("book_lent", { book_title: bookTitle, borrower, due_days: dueDays });
}

export function trackBookReturned(bookTitle: string, borrower: string, isOverdue: boolean) {
  track("book_returned", { book_title: bookTitle, borrower, is_overdue: isOverdue });
}
