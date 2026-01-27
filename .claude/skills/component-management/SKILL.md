---
name: component-management
description: Astroプロジェクトにおけるコンポーネントの配置・管理ルール。新しいコンポーネントを作成する際や、既存コンポーネントの整理を行う際に参照する。
---

このプロジェクトでは、コンポーネントを以下のディレクトリ構造で管理します。

## ディレクトリ構造

```
src/
├── components/
│   ├── ui/        # shadcn/ui コンポーネント
│   ├── common/    # 共通コンポーネント
│   └── pages/     # ページ固有コンポーネント
├── layouts/       # レイアウト
├── pages/         # ルーティング（Astro）
└── styles/        # グローバルスタイル
```

## 各ディレクトリの役割

### `components/ui/`
- shadcn/ui からインストールしたコンポーネント
- `bunx shadcn@latest add <component>` で追加
- 直接編集しない（カスタマイズが必要な場合は common/ にラッパーを作成）

### `components/common/`
- プロジェクト全体で再利用する共通コンポーネント
- 例: header, footer, navigation, card, modal など
- 2つ以上のページで使用するコンポーネントはここに配置

### `components/pages/`
- 特定のページでのみ使用するコンポーネント
- ページ名でサブディレクトリを作成
- 例:
  - `pages/home/` - ホームページ用（hero, features など）
  - `pages/about/` - Aboutページ用（team, history など）
  - `pages/blog/` - ブログページ用（post-card, tag-list など）

### `layouts/`
- ページレイアウト（HTML構造、head要素など）
- 例: layout.astro, blog-layout.astro

## 命名規則

- **ファイル名**: kebab-case（例: `hero-section.astro`, `user-card.tsx`）
- **Astroコンポーネント**: `.astro` 拡張子
- **Reactコンポーネント**: `.tsx` 拡張子（インタラクティブな場合）

## インポートパス

`@/` エイリアスを使用:

```astro
---
import { Button } from '@/components/ui/button'
import Header from '@/components/common/header.astro'
import Hero from '@/components/pages/home/hero.astro'
---
```

## Reactコンポーネントの使用

Reactコンポーネントには `client:*` ディレクティブが必要:

```astro
<Button client:load>クリック</Button>
<Counter client:visible />
```

- `client:load` - ページ読み込み時に即座にハイドレート
- `client:visible` - ビューポートに入った時にハイドレート
- `client:idle` - ブラウザがアイドル状態になった時にハイドレート

## コンポーネント作成の判断基準

1. **shadcn/ui にあるか？** → `bunx shadcn@latest add` で追加
2. **複数ページで使う？** → `components/common/` に作成
3. **特定ページのみ？** → `components/pages/<page-name>/` に作成
