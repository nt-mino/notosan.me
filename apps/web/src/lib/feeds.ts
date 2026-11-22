import { getArticles } from '@/lib/microcms/api/articles'

export interface FeedArticle {
  source: 'Zenn' | 'note' | 'Flarely'
  title: string
  url: string
  date: string
  image?: string
}

export const feedSources = {
  zenn: 'https://zenn.dev/m_noto',
  note: '',
  flarely: 'https://www.flarely.co.jp/blog/',
}

const toSource = (url: string): FeedArticle['source'] => {
  const host = new URL(url).hostname
  if (host.endsWith('note.com')) return 'note'
  if (host.endsWith('flarely.co.jp')) return 'Flarely'
  return 'Zenn'
}

// 記事は microCMS の articles にまとめて登録し、新しい順に返す
export const getLatestArticles = async (limit?: number) => {
  const { contents } = await getArticles(limit)
  return contents.map((article): FeedArticle => ({
    source: toSource(article.url),
    title: article.title,
    url: article.url,
    date: article.date,
    image: article.thumbnail?.url,
  }))
}
