import type { MicroCMSContent, MicroCMSImage } from './common'

// カテゴリーの選択肢
export const NEWS_CATEGORIES = {
  CAREER: 'キャリア',
  CERTIFICATION: '資格・認定',
  EVENT: 'イベント',
  RELEASE: '制作・リリース',
  MEDIA: 'メディア',
  ANNOUNCEMENT: 'お知らせ',
} as const

export type NewsCategory =
  (typeof NEWS_CATEGORIES)[keyof typeof NEWS_CATEGORIES]

// ニュースコンテンツの型
export type News = MicroCMSContent & {
  title: string
  thumbnail?: MicroCMSImage
  body: string
  category: NewsCategory
  date: string
}
