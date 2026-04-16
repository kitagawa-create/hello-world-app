/**
 * 結合テスト: addLoan
 *
 * 自販機でいうと「お金を入れて商品ボタンを押すと、
 * 金額が足りていれば商品が出てくる。足りなければエラー」レベル。
 *
 * 複数の処理が連携して正しく動くかを見る:
 *   1. 書籍の存在チェック (getDoc)
 *   2. 在庫チェック (stock > 0)
 *   3. 貸出レコード作成 + 在庫-1 をバッチ処理 (writeBatch)
 *
 * Firestore 本体は使わず、firebase/firestore のモジュールをモックして
 * 各関数が正しい順序・引数で呼ばれることを検証する。
 */

// --- モック定義 ---
const mockCommit = jest.fn().mockResolvedValue(undefined);
const mockSet = jest.fn();
const mockUpdate = jest.fn();
const mockBatch = { set: mockSet, update: mockUpdate, commit: mockCommit };

jest.mock("firebase/firestore", () => ({
  collection: jest.fn((_db: unknown, path: string) => `col:${path}`),
  doc: jest.fn((...args: unknown[]) => {
    // doc(db, "books", id) → ref として文字列を返す
    if (args.length === 3) return `doc:${args[1]}/${args[2]}`;
    // doc(collection) → 新規 loan ref
    return "doc:loans/new-loan-id";
  }),
  getDoc: jest.fn(),
  writeBatch: jest.fn(() => mockBatch),
  serverTimestamp: jest.fn(() => "TIMESTAMP"),
}));

jest.mock("@/lib/firebase", () => ({ db: "mock-db" }));

import { addLoan } from "@/lib/firestore";
import { getDoc } from "firebase/firestore";

const mockedGetDoc = getDoc as jest.MockedFunction<typeof getDoc>;

beforeEach(() => {
  jest.clearAllMocks();
});

const loanData = {
  userName: "田中太郎",
  bookId: "book-123",
  bookTitle: "JavaScript入門",
  loanDate: "2026-04-13",
};

describe("addLoan（貸出作成）", () => {
  it("在庫あり → 貸出レコード作成 + 在庫が1減る", async () => {
    // 書籍が存在し、在庫が3冊ある状態をシミュレート
    mockedGetDoc.mockResolvedValue({
      exists: () => true,
      data: () => ({ stock: 3 }),
    } as never);

    await addLoan(loanData);

    // バッチに貸出レコードがセットされた
    expect(mockSet).toHaveBeenCalledWith(
      "doc:loans/new-loan-id",
      expect.objectContaining({
        userName: "田中太郎",
        bookTitle: "JavaScript入門",
        returnedProcessed: false,
      })
    );

    // バッチで在庫が 3→2 に更新された
    expect(mockUpdate).toHaveBeenCalledWith(
      "doc:books/book-123",
      expect.objectContaining({ stock: 2 })
    );

    // バッチがコミットされた
    expect(mockCommit).toHaveBeenCalledTimes(1);
  });

  it("書籍が存在しない → エラー「書籍が見つかりません」", async () => {
    mockedGetDoc.mockResolvedValue({
      exists: () => false,
      data: () => null,
    } as never);

    await expect(addLoan(loanData)).rejects.toThrow("書籍が見つかりません");
    expect(mockCommit).not.toHaveBeenCalled();
  });

  it("在庫0 → エラー「在庫がありません」", async () => {
    mockedGetDoc.mockResolvedValue({
      exists: () => true,
      data: () => ({ stock: 0 }),
    } as never);

    await expect(addLoan(loanData)).rejects.toThrow("在庫がありません");
    expect(mockCommit).not.toHaveBeenCalled();
  });
});
