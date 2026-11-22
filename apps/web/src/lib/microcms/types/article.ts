import type { MicroCMSContent, MicroCMSImage } from './common'

export type Article = MicroCMSContent & {
  title: string
  thumbnail?: MicroCMSImage
  date: string
  url: string
}
