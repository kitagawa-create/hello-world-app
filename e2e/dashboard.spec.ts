/**
 * E2Eテスト: ログイン → 各画面の操作 → ログアウト
 *
 * 自販機でいうと「お客さんが来て→お金を入れて→商品を選んで→
 * おつりを受け取って帰るまで」の全体フロー。
 *
 * 実際のブラウザで以下の一連の行動を再現する:
 *   1. ログインする
 *   2. ダッシュボードの統計情報を確認する
 *   3. 書籍管理ページに移動してフォームを操作する
 *   4. 貸出管理ページに移動してフォームを操作する
 *   5. ログアウトしてログイン画面に戻る
 */
import { test, expect } from "@playwright/test";

test.describe("書籍貸出管理アプリ: 一連の業務フロー", () => {

  test("ログイン → 画面遷移 → 各画面の確認 → ログアウト", async ({ page }) => {
    // ========== 1. ログイン ==========
    await page.goto("/login");
    await expect(page.getByRole("button", { name: "ログイン" })).toBeVisible({ timeout: 15000 });

    const email = process.env.E2E_EMAIL;
    const password = process.env.E2E_PASSWORD;
    if (!email || !password) throw new Error("環境変数 E2E_EMAIL / E2E_PASSWORD を設定してください");

    await page.getByPlaceholder("user@example.com").fill(email);
    await page.getByPlaceholder("6文字以上").fill(password);
    await page.getByRole("button", { name: "ログイン" }).click();

    // 書籍管理ページに遷移する（ログイン成功）
    await expect(page.locator("h1", { hasText: "書籍管理" })).toBeVisible({ timeout: 15000 });

    // ========== 2. サイドバーから「ダッシュボード」に移動 ==========
    await page.getByRole("link", { name: "ダッシュボード" }).click();
    await expect(page.locator("h1", { hasText: "ダッシュボード" })).toBeVisible();

    // 統計カードが表示されている
    await expect(page.getByText("総書籍数")).toBeVisible();
    await expect(page.getByText("利用者数")).toBeVisible();

    // セクションが表示されている
    await expect(page.locator("h2", { hasText: "最近の貸出" })).toBeVisible();
    await expect(page.locator("h2", { hasText: "人気書籍ランキング" })).toBeVisible();

    // ========== 3. サイドバーから「書籍管理」に移動 ==========
    await page.getByRole("link", { name: "書籍管理" }).click();
    await expect(page.locator("h1", { hasText: "書籍管理" })).toBeVisible();

    // 新規書籍登録フォームが表示されている
    await expect(page.locator("h2", { hasText: "新規書籍登録" })).toBeVisible();
    await expect(page.getByPlaceholder("書籍タイトルを入力")).toBeVisible();
    await expect(page.getByPlaceholder("著者名を入力")).toBeVisible();

    // フォームに入力できる（実際には送信しない）
    await page.getByPlaceholder("書籍タイトルを入力").fill("E2Eテスト書籍");
    await page.getByPlaceholder("著者名を入力").fill("テスト著者");
    // 入力値が反映されていることを確認
    await expect(page.getByPlaceholder("書籍タイトルを入力")).toHaveValue("E2Eテスト書籍");

    // 書籍一覧テーブルが表示されている
    await expect(page.locator("h2", { hasText: "書籍一覧" })).toBeVisible();

    // ========== 4. サイドバーから「貸出管理」に移動 ==========
    await page.getByRole("link", { name: "貸出管理" }).click();
    await expect(page.locator("h1", { hasText: "貸出管理" })).toBeVisible();

    // 貸出登録フォームが表示されている
    await expect(page.locator("h2", { hasText: "新規貸出申請" })).toBeVisible();
    await expect(page.getByPlaceholder("利用者名を入力")).toBeVisible();

    // 貸出一覧テーブルが表示されている
    await expect(page.locator("h2", { hasText: "貸出一覧" })).toBeVisible();

    // ========== 5. ログアウト ==========
    await page.getByRole("button", { name: "ログアウト" }).click();

    // ログインページに戻る
    await expect(page.locator("h1", { hasText: "BookShelf" })).toBeVisible({ timeout: 10000 });
    await expect(page.getByRole("button", { name: "ログイン" })).toBeVisible();
  });
});
