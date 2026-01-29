# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## プロジェクト概要

能戸成琉のポートフォリオサイト。Astro + React + Tailwind CSS v4で構築し、Cloudflareにデプロイ。コンテンツはmicroCMSで管理。

## コマンド

```bash
bun dev          # 開発サーバー起動
bun build        # プロダクションビルド
bun preview      # ビルド後のプレビュー
bun lint         # Biomeでチェック
bun lint:fix     # チェック + 自動修正（unsafe含む）
bun format       # Biomeでフォーマット

bunx shadcn@latest add <component>  # shadcn/uiコンポーネント追加
```

## アーキテクチャ

### ディレクトリ構造

```
src/
├── components/
│   ├── ui/        # shadcn/ui コンポーネント（直接編集しない）
│   ├── common/    # 共通コンポーネント（header, footer等）
│   └── pages/     # ページ固有コンポーネント（pages/<page-name>/）
├── layouts/       # レイアウト
├── pages/         # ルーティング
├── lib/
│   ├── utils.ts   # shadcn/ui用ユーティリティ
│   └── microcms/  # microCMSクライアント・型定義
├── scripts/       # DOM操作系スクリプト（scroll, theme等）
└── styles/        # global.css（Tailwind v4設定含む）
```

### 技術スタック

- **フレームワーク**: Astro 5 (静的ビルド) + React 19
- **スタイリング**: Tailwind CSS v4 (@tailwindcss/vite)
- **UIライブラリ**: shadcn/ui (new-york スタイル)
- **リンター/フォーマッター**: Biome
- **CMS**: microCMS
- **デプロイ**: Cloudflare Pages

### Astro + Reactの使い分け

- **Astroコンポーネント** (`.astro`): 静的なUI、レイアウト
- **Reactコンポーネント** (`.tsx`): インタラクティブなUI
- Reactには`client:*`ディレクティブが必要（`client:load`, `client:visible`, `client:idle`）

## コーディング規約

- **Props**: Astroコンポーネントでは`export interface Props`を使用
- **イベントハンドラ**: `onXXX`命名規則（onClick, onSubmit等）
- **インポート**: `@/`エイリアスを使用（例: `@/components/ui/button`）
- **ファイル名**: kebab-case（例: `hero-section.astro`）
- **クォート**: シングルクォート
- **セミコロン**: 不要

## 環境変数

```
MICROCMS_SERVICE_DOMAIN  # microCMSサービスドメイン
MICROCMS_API_KEY         # microCMS APIキー
```

## デザイントークン

ブランドカラーは`src/styles/global.css`で定義:
- `noto-accent`: #3d5a80（メインアクセント）
- `noto-text`: #171717
- `noto-text-muted`: #737373
- `noto-bg`: #fafafa
