import type { Bindings } from '../app'

const escapeSlack = (value: string) =>
  value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

// Slack に届かなくてもメールは送れているので、失敗はログに残すだけにする
export const notifySlack = async (
  env: Bindings,
  title: string,
  rows: [string, string][],
) => {
  if (!env.SLACK_WEBHOOK_URL) return
  const text = [
    `*${escapeSlack(title)}*（notosan.me）`,
    ...rows.map(([label, value]) => `*${label}*\n${escapeSlack(value)}`),
  ].join('\n\n')
  try {
    const response = await fetch(env.SLACK_WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text }),
    })
    if (!response.ok) console.error('Slack error:', await response.text())
  } catch (error) {
    console.error('Slack error:', error)
  }
}
