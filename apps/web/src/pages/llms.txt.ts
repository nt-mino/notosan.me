import type { APIRoute } from 'astro'
import { flarely } from '@/data/flarely'
import { site } from '@/data/site'
import { getLatestArticles } from '@/lib/feeds'
import { getCareers } from '@/lib/microcms/api/careers'
import { getProjects } from '@/lib/microcms/api/projects'
import { formatDate } from '@/utils/format'
import { toPlainText } from '@/utils/rich-text'

const link = (name: string, href: string, note?: string) =>
  `- [${name}](${href})${note ? `: ${note}` : ''}`

// llmstxt.org の形式。文はすべてページと同じデータから組み立てる
export const GET: APIRoute = async ({ site: origin }) => {
  const url = (path: string) => new URL(path, origin).href
  const [{ contents: careers }, projects, articles] = await Promise.all([
    getCareers(),
    getProjects(),
    getLatestArticles(),
  ])

  const body = [
    `# ${site.name}（${site.nameEn}）`,
    '',
    `> ${site.title}。経歴、個人開発、記事を載せたポートフォリオサイトです。`,
    '',
    ...site.bio,
    '',
    `- 拠点: ${site.location}`,
    `- 運営会社: [${flarely.name}](${flarely.url})`,
    `- ご相談: ${site.contactLead}[お問い合わせフォーム](${url('/contact')})から受け付けています。`,
    '',
    '## ページ',
    '',
    link(
      'トップ',
      url('/'),
      '自己紹介、経歴、個人開発、記事、お問い合わせへの案内です。',
    ),
    link(
      '記事一覧',
      url('/articles'),
      'Zenn・note・Flarely のメディアに書いた記事の一覧です。',
    ),
    link(
      'お問い合わせ',
      url('/contact'),
      '新規開発・技術支援・技術顧問など、お仕事のご相談はこちらからどうぞ。',
    ),
    '',
    '## 経歴',
    '',
    ...careers.map((career) =>
      [
        `- ${career.company}（${[career.role, career.employment].filter(Boolean).join('・')}）: ${formatDate(career.startDate).slice(0, 7)} 〜 ${career.endDate ? formatDate(career.endDate).slice(0, 7) : ''}。${career.description ? toPlainText(career.description) : ''}`,
        ...career.works.map(
          (work) =>
            `  - ${work.title}${work.description ? `: ${toPlainText(work.description)}` : ''}`,
        ),
      ].join('\n'),
    ),
    '',
    '## 個人開発',
    '',
    ...projects.map((project) =>
      link(
        project.name,
        url(`/projects/${project.id}`),
        [project.summary, project.background]
          .filter((text): text is string => !!text)
          .map(toPlainText)
          .join(' '),
      ),
    ),
    '',
    ...(articles.length
      ? [
          '## 記事',
          '',
          ...articles.map((article) =>
            link(
              article.title,
              article.url,
              `${article.source}、${formatDate(article.date)}`,
            ),
          ),
          '',
        ]
      : []),
  ].join('\n')

  return new Response(body, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  })
}
