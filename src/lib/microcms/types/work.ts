import type { MicroCMSContent, MicroCMSImage } from './common'

// 実績コンテンツの型
export type Work = MicroCMSContent & {
  title: string
  description: string
  thumbnail: MicroCMSImage
  position: string
  business: string
  phase: string
  tech: string
  company: string
  body: string
  isTop: boolean
  index?: number
}
