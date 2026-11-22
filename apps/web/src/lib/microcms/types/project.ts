import type { MicroCMSContent, MicroCMSImage } from './common'

export type Project = MicroCMSContent & {
  name: string
  icon?: MicroCMSImage
  screenshots?: MicroCMSImage[]
  description?: string
  summary?: string
  background?: string
  kind?: string
  color?: string
}
