import type { MicroCMSQueries } from 'microcms-js-sdk'
import { client } from '../client'
import type { Work } from '../types/work'

const ENDPOINT = 'works'

export const getWorks = async (queries?: MicroCMSQueries) => {
  return await client.getList<Work>({
    endpoint: ENDPOINT,
    queries: {
      limit: 100,
      ...queries,
    },
  })
}
