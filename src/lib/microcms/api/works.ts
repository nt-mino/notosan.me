import type { MicroCMSQueries } from 'microcms-js-sdk'
import { client } from '../client'
import type { Work } from '../types/work'

const ENDPOINT = 'works'

// 実績一覧を取得
export const getWorks = async (queries?: MicroCMSQueries) => {
  return await client.getList<Work>({
    endpoint: ENDPOINT,
    queries: {
      orders: 'createdAt',
      ...queries,
    },
  })
}

// 実績詳細を取得
export const getWork = async (contentId: string, queries?: MicroCMSQueries) => {
  return await client.getListDetail<Work>({
    endpoint: ENDPOINT,
    contentId,
    queries,
  })
}

// トップページ用の実績を取得
export const getTopWorks = async (queries?: MicroCMSQueries) => {
  return await client.getList<Work>({
    endpoint: ENDPOINT,
    queries: {
      filters: 'isTop[equals]true',
      orders: 'createdAt',
      ...queries,
    },
  })
}

// 全実績IDを取得（静的生成用）
export const getAllWorkIds = async () => {
  const response = await client.getList<Work>({
    endpoint: ENDPOINT,
    queries: {
      fields: 'id',
      limit: 100,
    },
  })
  return response.contents.map((content) => content.id)
}
