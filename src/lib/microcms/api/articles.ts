import type { MicroCMSQueries } from 'microcms-js-sdk'
import { client } from '../client'
import type { Article } from '../types/article'

const ENDPOINT = 'articles'

// 記事一覧を取得
export const getArticles = async (queries?: MicroCMSQueries) => {
  return await client.getList<Article>({
    endpoint: ENDPOINT,
    queries,
  })
}

// 記事詳細を取得
export const getArticle = async (
  contentId: string,
  queries?: MicroCMSQueries,
) => {
  return await client.getListDetail<Article>({
    endpoint: ENDPOINT,
    contentId,
    queries,
  })
}

// 全記事IDを取得（静的生成用）
export const getAllArticleIds = async () => {
  const response = await client.getList<Article>({
    endpoint: ENDPOINT,
    queries: {
      fields: 'id',
      limit: 100,
    },
  })
  return response.contents.map((content) => content.id)
}
