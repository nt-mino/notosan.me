import type { MicroCMSContent, MicroCMSImage } from './common'

// カテゴリーの選択肢
export const ARTICLE_CATEGORIES = {
  TECH_SELECTION: '技術選定・比較',
  TECH_ANALYSIS: '技術分析',
  DEV_STORY: '開発ストーリー',
} as const

export type ArticleCategory =
  (typeof ARTICLE_CATEGORIES)[keyof typeof ARTICLE_CATEGORIES]

// 記事コンテンツの型
export type Article = MicroCMSContent & {
  title: string
  description: string
  thumbnail: MicroCMSImage
  category: ArticleCategory
  date: string
  zennUrl: string
  tags?: string
  isTop: boolean
}
