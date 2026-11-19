# noto.

能戸成琉のポートフォリオサイト（https://notosan.me）。Astro 7 で作り、Cloudflare Workers で配信しています。

## 構成

bun workspaces のモノレポで、アプリは `apps/web/` にあります。ページはすべてビルド時に作り、お問い合わせ API（`/api/*`）だけを Worker がその場で処理します。

## はじめかた

Node 22.23.4 以上と bun が必要です。

```sh
bun install
cp apps/web/.env.example apps/web/.env.local        # microCMS のキーを入れる
cp apps/web/.dev.vars.example apps/web/.dev.vars    # Resend の設定を入れる（お問い合わせを試すときだけ）
bun dev
```

## コマンド

| コマンド | 内容 |
| :-- | :-- |
| `bun dev` | 開発サーバーを起動します |
| `bun run build` | `apps/web/dist/` にビルドします |
| `bun preview` | ビルド結果を Workers のローカル実行で確かめます |
| `bun check` | `astro check` で型を確かめます |
| `bun lint` | Biome でリポジトリ全体を確かめます |
| `bun run deploy` | ビルドして `wrangler deploy` します |

## デプロイ

Cloudflare Workers の `noto` に `wrangler deploy` で出します。本番の `RESEND_API_KEY` / `CONTACT_EMAIL` / `FROM_EMAIL` は `wrangler secret put` で登録します。
