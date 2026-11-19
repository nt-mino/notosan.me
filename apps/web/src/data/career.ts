export interface Career {
  start: string
  org: string
  type: string
  role: string
  note: string
  works: string[]
}

// works には microCMS の works のコンテンツ ID を並べる
export const career: Career[] = [
  {
    start: '2026.08',
    org: '合同会社Flarely',
    type: '共同創業',
    role: '共同創業者',
    note: 'システム開発・モバイル開発・AI 開発を手がける会社を共同で立ち上げました。',
    works: [],
  },
  {
    start: '2026.02',
    org: '株式会社ジパンク',
    type: '業務委託',
    role: '',
    note: '',
    works: [],
  },
  {
    start: '2024.11',
    org: '株式会社Dokosore',
    type: '業務委託',
    role: 'Developer / EM',
    note: '',
    works: ['sokkin-academy', 'botchan-aicall'],
  },
  {
    start: '2023.05',
    org: '株式会社Galirage',
    type: '業務委託',
    role: 'Developer',
    note: '',
    works: ['ai-writer-kun', 'raggle'],
  },
  {
    start: '2023.04',
    org: '株式会社Funda',
    type: '正社員',
    role: 'Tech Lead / EM',
    note: '',
    works: ['funda-boki', 'slide-academy', 'funda-enterprise'],
  },
  {
    start: '2021.07',
    org: 'ダイアモンドヘッド株式会社',
    type: '学生インターン',
    role: '',
    note: '',
    works: [],
  },
]
