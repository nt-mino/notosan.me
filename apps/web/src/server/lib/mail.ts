import type { Bindings } from '../app'

export const escapeHtml = (value: string) =>
  value.replace(
    /[&<>"']/g,
    (c) =>
      ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[
        c
      ] ?? c,
  )

export const mailTable = (rows: [string, string][]) => `
  <table style="border-collapse: collapse; width: 100%; max-width: 600px;">
    ${rows
      .map(
        ([label, value]) => `
      <tr>
        <td style="padding: 12px; border: 1px solid #ddd; background: #f9f9f9; width: 30%;"><strong>${label}</strong></td>
        <td style="padding: 12px; border: 1px solid #ddd; white-space: pre-wrap;">${value}</td>
      </tr>`,
      )
      .join('')}
  </table>
`

// Resend で自分宛てにメールを送り、返信先を送ってきた人にする
export const sendMail = async (
  env: Bindings,
  mail: { replyTo: string; subject: string; html: string },
) => {
  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${env.RESEND_API_KEY}`,
    },
    body: JSON.stringify({
      from: env.FROM_EMAIL,
      to: env.CONTACT_EMAIL,
      reply_to: mail.replyTo,
      subject: mail.subject,
      html: mail.html,
    }),
  })
  if (!response.ok) {
    console.error('Resend error:', await response.text())
    throw new Error('メール送信に失敗しました')
  }
}
