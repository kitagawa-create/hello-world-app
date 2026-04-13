@AGENTS.md

# CLAUDE.md — Next.js + Firebase プロジェクト

## プロジェクト概要

- **アプリ名**: BookShelf
- **概要**: 書籍の登録・貸出・返却を管理する Web アプリ。ダッシュボードで統計情報を確認し、書籍管理と貸出管理を行える
- **技術スタック**: Next.js 16 (App Router) / Firebase (Auth, Firestore, Analytics) / TypeScript / Tailwind CSS 4

## ディレクトリ構成

```
app/
├── login/page.tsx              # ログインページ
├── about/page.tsx              # About ページ
├── admin/
│   ├── layout.tsx              # 認証ガード + サイドバー + ヘッダー（要ログイン）
│   ├── page.tsx                # ダッシュボード（統計・ランキング）
│   ├── books/page.tsx          # 書籍管理（CRUD）
│   └── loans/page.tsx          # 貸出管理（貸出/返却/削除）
└── layout.tsx                  # ルートレイアウト（AuthProvider ラップ）
components/
├── admin/                      # Sidebar, Header, Toast, ConfirmDialog
└── AppName.tsx                 # 環境変数からアプリ名を表示
lib/
├── firebase.ts                 # Firebase 初期化（app, db, analytics）
├── auth.tsx                    # AuthProvider + useAuth フック
├── firestore.ts                # Firestore CRUD 関数（subscribeBooks, addLoan 等）
└── analytics.ts                # アナリティクスイベント送信
__tests__/                      # ユニット/結合テスト (Jest)
e2e/                            # E2E テスト (Playwright)
docs/                           # ドキュメント（テスト計画書等）
.github/workflows/              # GitHub Actions CI
```

## 開発コマンド

```bash
npm run dev          # 開発サーバー起動 (http://localhost:3000)
npm run build        # プロダクションビルド
npm start            # 本番サーバー起動
npm test             # ユニット/結合テスト (Jest)
npm run test:e2e     # E2E テスト (Playwright、要環境変数)
npx tsc --noEmit     # TypeScript 型チェック
```

## Firebase関連コマンド

```bash
# デプロイは Firebase App Hosting が GitHub 連携で自動実行
# 手動デプロイが必要な場合:
firebase deploy --only firestore:rules  # セキュリティルールのみデプロイ
```

## コーディング規約

- **言語**: TypeScript を必ず使用する。`any` は原則禁止
- **コンポーネント**: 関数コンポーネント + hooks で記述。クラスコンポーネントは使わない
- **Server/Client**: デフォルトは Server Component。状態・イベント・ブラウザAPIを使う場合のみ `"use client"` を付ける
- **インポート**: `@/` エイリアスを使う（例: `@/lib/firebase`）
- **UI言語**: 日本語。ラベル・エラーメッセージ・コメントは日本語で書く
- **命名規則**:
  - コンポーネント・型: PascalCase (`AppName`, `ConfirmDialog`)
  - 関数・変数: camelCase (`addLoan`, `isLoading`)
  - ファイル: コンポーネントは PascalCase、それ以外は camelCase
  - Firestore コレクション名: 複数形 (`books`, `loans`)
- **スタイリング**:
  - 管理画面（`app/admin/`）はインラインスタイル中心。既存ページを編集する場合は周囲に合わせる
  - ログインページ（`app/login/`）は Tailwind CSS クラスを使用
  - 1 ファイル内でインラインスタイルと Tailwind を混在させない

## Firebase ルール

- **認証**: Firebase Authentication（メール/パスワード）を使用。認証状態は `useAuth()` フックで取得する
- **認証ガード**: `app/admin/layout.tsx` が担当。未ログインなら `/login` にリダイレクト
- **Firestore 操作**: 貸出と在庫の整合性は必ず `writeBatch` で保証する（貸出作成時に在庫-1、返却時に+1）
- **リアルタイム購読**: `onSnapshot` を使用し、`useEffect` の cleanup で `unsubscribe` を呼ぶ
- **環境変数**: Firebase設定値は `.env.local` に格納（`.env*` は絶対にコミットしない）

```
NEXT_PUBLIC_FIREBASE_API_KEY=...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...
NEXT_PUBLIC_FIREBASE_PROJECT_ID=...
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=...
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...
NEXT_PUBLIC_FIREBASE_APP_ID=...
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=...
```

## セキュリティ注意事項

- `.env*`, `firebase-adminsdk-*.json`, サービスアカウントキーは **絶対にコミット・共有しない**
- `apphosting.yaml` に API キーが含まれているため、今後シークレットを追加する場合は GitHub Secrets を使う
- E2E テストのログイン情報はソースコードにハードコードしない。環境変数 `E2E_EMAIL` / `E2E_PASSWORD` で渡す
- クライアントサイドで機密データを露出させない

## Firestore 設計

| コレクション | ドキュメント構造 | 備考 |
|---|---|---|
| `books` | `{ title, author, price, stock, category, createdAt, updatedAt }` | 書籍マスタ。`stock` は貸出/返却時に自動増減 |
| `loans` | `{ userName, bookId, bookTitle, loanDate, returnedProcessed, createdAt, updatedAt }` | 貸出記録。`returnedProcessed: true` で返却済み |

## 既知の注意点・制約

- `apphosting.yaml` と `scripts/seed.mjs` に Firebase API キーがハードコードされて Git 履歴に残っている。公開リポジトリにする場合はキーのローテーションが必要
- `writeBatch` を使わずに貸出と在庫を別々に更新すると整合性が壊れる。貸出関連の処理は必ず `lib/firestore.ts` の関数を経由すること
- `node_modules/next/dist/docs/` に独自の Next.js ガイドがある（AGENTS.md 参照）。Next.js の API やファイル構成が通常版と異なる場合があるため、コードを書く前に該当ガイドを確認すること
