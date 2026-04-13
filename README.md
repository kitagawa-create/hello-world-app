# BookShelf — 書籍貸出管理アプリ

書籍の登録・貸出・返却を管理する Web アプリケーション。ダッシュボードで統計情報を確認し、書籍管理と貸出管理を行える。

## 技術スタック

| カテゴリ | 技術 |
|---|---|
| フレームワーク | Next.js 16 (App Router) |
| 言語 | TypeScript |
| スタイリング | Tailwind CSS 4 |
| 認証 | Firebase Authentication |
| データベース | Cloud Firestore |
| アナリティクス | Firebase Analytics |
| ホスティング | Firebase App Hosting |
| テスト | Jest / React Testing Library / Playwright |
| CI | GitHub Actions |

## 前提条件

- **Node.js 20 以上**（`node -v` で確認）
- **Firebase プロジェクト**が作成済みであること
  - [Firebase コンソール](https://console.firebase.google.com/) でプロジェクトを作成
  - **Authentication** → 「メール/パスワード」プロバイダを有効化
  - **Cloud Firestore** → データベースを作成（本番モードまたはテストモード）
  - **プロジェクトの設定** → 「マイアプリ」からウェブアプリを追加し、設定値を控える

## セットアップ手順

```bash
# 1. リポジトリをクローン
git clone git@github.com:kitagawa-create/hello-world-app.git
cd hello-world-app

# 2. 依存パッケージをインストール
npm install

# 3. 環境変数を設定
cp .env.local.example .env.local
```

`.env.local` を開き、Firebase コンソールで控えた設定値を入力する。

### 環境変数一覧

| 変数名 | 説明 | 取得場所 | 例 |
|---|---|---|---|
| `NEXT_PUBLIC_FIREBASE_API_KEY` | Firebase API キー。クライアントから Firebase サービスにアクセスするための認証キー | プロジェクトの設定 → 全般 → マイアプリ → `apiKey` | `AIzaSyD...` |
| `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` | Firebase Authentication のドメイン。ログイン画面のリダイレクト先として使用 | 同上 → `authDomain` | `my-app.firebaseapp.com` |
| `NEXT_PUBLIC_FIREBASE_PROJECT_ID` | Firebase プロジェクトの一意な ID。Firestore やその他サービスの接続先を特定する | 同上 → `projectId` | `my-app-12345` |
| `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` | Cloud Storage のバケット URL。ファイルアップロード先（現在は未使用だが初期化に必要） | 同上 → `storageBucket` | `my-app-12345.firebasestorage.app` |
| `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` | Cloud Messaging の送信者 ID。プッシュ通知の識別に使用（現在は未使用だが初期化に必要） | 同上 → `messagingSenderId` | `123456789012` |
| `NEXT_PUBLIC_FIREBASE_APP_ID` | Firebase アプリの一意な ID。アナリティクス等でどのアプリからのアクセスか識別する | 同上 → `appId` | `1:123456789:web:abc123def456` |
| `NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID` | Google Analytics の測定 ID。ユーザー行動（書籍追加・貸出等）のトラッキングに使用 | 同上 → `measurementId` | `G-XXXXXXXXXX` |

> **取得手順**: [Firebase コンソール](https://console.firebase.google.com/) → プロジェクトを選択 → 歯車アイコン（プロジェクトの設定） → 「全般」タブ → 「マイアプリ」セクション → `firebaseConfig` オブジェクトの各値をコピー
>
> **注意**: `NEXT_PUBLIC_` プレフィックスが付いた変数はブラウザに公開される。秘密鍵やサービスアカウント情報は絶対にここに入れないこと。

```bash
# 4. 開発サーバーを起動
npm run dev
```

http://localhost:3000 でアクセス可能。初回は `/login` でアカウントを新規作成する。

## npm スクリプト

| コマンド | 説明 |
|---|---|
| `npm run dev` | 開発サーバーを起動 |
| `npm run build` | 本番ビルド |
| `npm start` | 本番サーバーを起動 |
| `npm test` | ユニット/結合テストを実行 (Jest) |
| `npm run test:e2e` | E2E テストを実行 (Playwright) |

## ディレクトリ構成

```
hello-world-app/
├── app/                    # Next.js App Router
│   ├── about/              #   About ページ
│   ├── admin/              #   管理画面
│   │   ├── page.tsx        #     ダッシュボード
│   │   ├── books/          #     書籍管理（CRUD）
│   │   ├── loans/          #     貸出管理（貸出/返却）
│   │   └── layout.tsx      #     認証ガード + サイドバー + ヘッダー
│   ├── login/              #   ログインページ
│   └── layout.tsx          #   ルートレイアウト
├── components/
│   ├── admin/              #   管理画面用コンポーネント
│   │   ├── Sidebar.tsx     #     サイドバーナビゲーション
│   │   ├── Header.tsx      #     ヘッダー
│   │   ├── Toast.tsx       #     トースト通知
│   │   └── ConfirmDialog.tsx #   確認ダイアログ
│   └── AppName.tsx         #   アプリ名表示
├── lib/
│   ├── firebase.ts         #   Firebase 初期化
│   ├── firestore.ts        #   Firestore CRUD 関数
│   ├── auth.tsx            #   認証コンテキスト (AuthProvider)
│   └── analytics.ts        #   アナリティクスイベント送信
├── __tests__/              # ユニット/結合テスト (Jest)
├── e2e/                    # E2E テスト (Playwright)
├── docs/                   # ドキュメント（テスト計画書等）
├── .github/workflows/      # GitHub Actions CI
└── public/                 # 静的ファイル
```
