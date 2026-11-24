# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## プロジェクト概要

能戸成琉のポートフォリオサイト（notosan.me）。Astro 7 + React + Tailwind CSS v4 で構築し、Cloudflare Workers にデプロイ。実績と記事は microCMS、経歴・個人開発・運営会社はリポジトリ内のデータで管理。

bun workspaces のモノレポで、アプリ本体は `apps/web/` にある。

## コマンド

ルートで実行する（dev / build / preview / check / deploy は `apps/web` に委ねる）。

```bash
bun dev          # 開発サーバー起動（workerd 上で動く）
bun run build    # プロダクションビルド（dist/client と dist/server）
bun preview      # ビルド結果を Workers のローカル実行で確認
bun check        # astro check（型チェック）
bun run deploy   # ビルドして wrangler deploy
bun lint         # oxlint でチェック（リポジトリ全体）
bun lint:fix     # チェック + 自動修正
bun format       # oxfmt でフォーマット（.astro は対象外）
bun format:check # 整形ずれの確認だけ

# apps/web で実行
bun run cf-typegen                 # wrangler.jsonc から worker-configuration.d.ts を作り直す
bunx shadcn@latest add <component> # shadcn/ui コンポーネント追加
```

## アーキテクチャ

### ディレクトリ構造

```
apps/web/
├── astro.config.mjs
├── wrangler.jsonc            # Worker の設定（名前は noto）
├── worker-configuration.d.ts # wrangler types の生成物（直接編集しない）
├── public/                   # _redirects、PWA（manifest、sw.js、アイコン）
└── src/
    ├── components/
    │   ├── ui/        # shadcn/ui コンポーネント（直接編集しない）
    │   ├── common/    # 共通コンポーネント（site-header, site-footer 等）
    │   └── pages/     # ページ固有コンポーネント（pages/<page-name>/）
    ├── data/          # 経歴・個人開発・運営会社・サイト共通の文言
    ├── layouts/       # レイアウト
    ├── pages/         # ルーティング（api/[...route].ts だけがその場で動く）
    ├── lib/
    │   ├── utils.ts   # shadcn/ui 用ユーティリティ
    │   ├── rpc.ts     # Hono RPC クライアント
    │   └── microcms/  # microCMS クライアント・型定義・スキーマ
    ├── server/        # お問い合わせ API（Hono アプリ、ルート、valibot スキーマ）
    ├── styles/        # globals.css（Tailwind v4 と @theme）、ink.css（39 Ink の見た目）
    └── utils/         # 日付の整形など
```

### 技術スタック

- **フレームワーク**: Astro 7 + React 19
- **実行環境**: Cloudflare Workers（`@astrojs/cloudflare` アダプター）
- **スタイリング**: Tailwind CSS v4 (@tailwindcss/vite)
- **UIライブラリ**: shadcn/ui (new-york スタイル)
- **API**: Hono + valibot、メール送信は Resend
- **リンター/フォーマッター**: oxlint + oxfmt（設定はルートの .oxlintrc.json と .oxfmtrc.json）
- **CI**: GitHub Actions（`.github/workflows/ci.yml`）。PR と `main` への push で lint・型チェック・ビルドを確かめるだけで、デプロイはしない
- **デプロイ**: Cloudflare Workers Builds。`main` への push と、microCMS の Webhook を受けた Worker（`/api/webhooks/microcms`）が呼ぶ Deploy Hook でビルドしてデプロイする。ビルド時の環境変数は Workers Builds の設定に入れる
- **CMS**: microCMS

### レンダリングと API

- ページはすべてビルド時に作る（`output: 'static'`、`build.format: 'file'`）。microCMS の取得と画像の変換（`astro:assets`、`imageService: 'compile'`）もビルド時に済む。
- その場で動くのは `src/pages/api/[...route].ts`（`prerender = false`）だけ。ここから `src/server/app.ts` の Hono アプリを呼ぶ。
- Worker の環境変数は `import { env } from 'cloudflare:workers'` で受けて Hono に渡す。
- 古い URL（/works, /articles, /news）のリダイレクトは `public/_redirects` に書く。

### Astro + Reactの使い分け

- **Astroコンポーネント** (`.astro`): 静的なUI、レイアウト
- **Reactコンポーネント** (`.tsx`): インタラクティブなUI（今はお問い合わせフォームだけ）
- Reactには`client:*`ディレクティブが必要（`client:load`, `client:visible`, `client:idle`）

## コーディング規約

- **Props**: Astroコンポーネントでは`export interface Props`を使用
- **イベントハンドラ**: `onXXX`命名規則（onClick, onSubmit等）
- **インポート**: `@/`エイリアスを使用（例: `@/components/ui/button`）
- **ファイル名**: kebab-case（例: `site-header.astro`）
- **クォート**: シングルクォート
- **セミコロン**: 不要

## 環境変数

ビルド時（`apps/web/.env.local`。見本は `apps/web/.env.example`）:

```
MICROCMS_SERVICE_DOMAIN   # microCMSサービスドメイン
MICROCMS_API_KEY          # microCMS APIキー
PUBLIC_GA_MEASUREMENT_ID  # GA4 の測定 ID（任意）
```

Worker の実行時（本番は `wrangler secret put`、ローカルは `apps/web/.dev.vars`。見本は `apps/web/.dev.vars.example`）:

```
RESEND_API_KEY  # Resend の API キー
CONTACT_EMAIL   # お問い合わせの送り先
FROM_EMAIL      # 送信元アドレス
MICROCMS_WEBHOOK_SECRET  # microCMS の Webhook の署名を確かめるシークレット
DEPLOY_HOOK_URL          # Workers Builds の Deploy Hook の URL
```

## デザイントークン

39 Ink の色とフォントは `apps/web/src/styles/globals.css` の `@theme` で定義:
- `--color-ink-fg` / `--color-ink-band`: #15171c（文字と濃い帯）
- `--color-ink-bg`: #fff
- `--color-ink-muted`: #5b5f68
- `--color-ink-line`: #e1e3e8
- フォント: `--font-mincho`（Shippori Mincho）、`--font-garamond`（Cormorant Garamond）、`--font-gothic`（Zen Kaku Gothic New）
