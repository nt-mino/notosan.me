import type { MicroCMSQueries } from 'microcms-js-sdk'
import { client } from '../client'
import type { News } from '../types/news'

const ENDPOINT = 'news'

// ニュース一覧を取得
export const getNewsList = async (queries?: MicroCMSQueries) => {
  return await client.getList<News>({
    endpoint: ENDPOINT,
    queries: {
      orders: '-date',
      ...queries,
    },
  })
}

// ニュース詳細を取得
export const getNews = async (contentId: string, queries?: MicroCMSQueries) => {
  return await client.getListDetail<News>({
    endpoint: ENDPOINT,
    contentId,
    queries,
  })
}

// 全ニュースIDを取得（静的生成用）
export const getAllNewsIds = async () => {
  const response = await client.getList<News>({
    endpoint: ENDPOINT,
    queries: {
      fields: 'id',
      limit: 100,
    },
  })
  return response.contents.map((content) => content.id)
}
