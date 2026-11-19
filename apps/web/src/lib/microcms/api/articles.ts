import type { MicroCMSQueries } from 'microcms-js-sdk'
import { client } from '../client'
import type { Article } from '../types/article'

const ENDPOINT = 'articles'

export const getArticles = async (queries?: MicroCMSQueries) => {
  return await client.getList<Article>({
    endpoint: ENDPOINT,
    queries: {
      orders: '-date',
      ...queries,
    },
  })
}
