export interface Project {
  slug: string
  name: string
  tagline: string
  kind: string
  status: string
  summary: string
  stack: string[]
  points: string[]
}

export const projects: Project[] = [
  {
    slug: 'agentidraw',
    name: 'agentidraw',
    tagline: 'AI が図を描き込めるホワイトボード',
    kind: 'Web アプリ',
    status: '開発中',
    summary:
      'AI エージェントが Mermaid で構成図やフローを描き込めるホワイトボード。',
    stack: ['Cloudflare Workers', 'MCP'],
    points: [
      'AI エージェントが MCP 経由でボードに図を追加します。',
      'Mermaid で書いた構成図やフロー図をそのまま描画します。',
      'URL を渡すだけで、同じボードを一緒に見られます。',
    ],
  },
  {
    slug: 'memory-os',
    name: 'Memory OS',
    tagline: '技術ドキュメントをまとめて読む棚',
    kind: 'ローカルツール',
    status: '個人用',
    summary:
      '技術ドキュメントの HTML を種類ごとに一覧で読めるローカルのドキュメント棚。',
    stack: ['Bun', 'HTML'],
    points: [
      'HTML で書いた技術ドキュメントを種類ごとに並べます。',
      'ローカルのサーバーで動き、外には公開しません。',
      '開いているページを PDF に書き出せます。',
    ],
  },
  {
    slug: 'noto',
    name: 'noto.',
    tagline: 'このサイト',
    kind: 'Web サイト',
    status: '運用中',
    summary:
      'このサイト。Astro と microCMS で作り、Cloudflare で配信しています。',
    stack: ['Astro', 'microCMS', 'Cloudflare'],
    points: [
      '実績と記事を microCMS で管理しています。',
      'Astro で静的に書き出し、Cloudflare で配信しています。',
      'お問い合わせは Hono の API から Resend で送ります。',
    ],
  },
]
