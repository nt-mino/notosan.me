import type { MicroCMSContent, MicroCMSImage } from './common'

export type CareerWork = {
  fieldId: 'work'
  title: string
  description?: string
  thumbnail?: MicroCMSImage
  link?: string
}

export type Career = MicroCMSContent & {
  company: string
  companyUrl?: string
  role?: string
  employment?: string
  startDate: string
  endDate?: string
  description?: string
  works: CareerWork[]
}
