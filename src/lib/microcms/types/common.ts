import type { MicroCMSDate, MicroCMSImage } from 'microcms-js-sdk'

// 共通のmicroCMSフィールド
export type MicroCMSContent = MicroCMSDate & {
  id: string
}

// 画像の型を再エクスポート
export type { MicroCMSImage }
