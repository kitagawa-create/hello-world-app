/**
 * ユニットテスト: getLoanBadge
 *
 * 自販機でいうと「お金を入れたら金額がカウントされる」レベル。
 * 1つの関数に1つの入力を渡して、正しい出力が返るかだけを見る。
 * 外部依存なし、Firestore不要、DOM不要。
 */
import { getLoanBadge } from "@/app/admin/page";
import type { Loan } from "@/lib/firestore";

function makeLoan(returned: boolean): Loan {
  return {
    id: "loan-1",
    userName: "テスト太郎",
    bookId: "book-1",
    bookTitle: "テスト書籍",
    loanDate: "2026-04-01",
    returnedProcessed: returned,
    createdAt: null,
    updatedAt: null,
  };
}

describe("getLoanBadge", () => {
  it("貸出中 → 「貸出中」ラベル + 青バッジ", () => {
    const badge = getLoanBadge(makeLoan(false));
    expect(badge.label).toBe("貸出中");
    expect(badge.bg).toBe("#dbeafe");
  });

  it("返却済み → 「返却済み」ラベル + グレーバッジ", () => {
    const badge = getLoanBadge(makeLoan(true));
    expect(badge.label).toBe("返却済み");
    expect(badge.bg).toBe("#f3f4f6");
  });
});
