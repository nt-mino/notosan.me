import { client } from '../client'
import type { Article } from '../types/article'

export const getArticles = async (limit = 100) => {
  return await client.getList<Article>({
    endpoint: 'articles',
    queries: { limit, orders: '-date' },
  })
}
