import { vValidator } from '@hono/valibot-validator'
import { Hono } from 'hono'
import type { Bindings } from '../app'
import { categoryLabels, contactSchema } from '../schemas/contact'

const escapeHtml = (value: string) =>
  value.replace(
    /[&<>"']/g,
    (c) =>
      ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[
        c
      ] ?? c,
  )

export const contactRoute = new Hono<{ Bindings: Bindings }>().post(
  '/',
  vValidator('json', contactSchema, (result, c) => {
    if (!result.success) {
      const firstError = result.issues[0]
      return c.json(
        {
          success: false as const,
          error: firstError?.message || 'バリデーションエラー',
        },
        400,
      )
    }
  }),
  async (c) => {
    const body = c.req.valid('json')
    const category = categoryLabels[body.category] || body.category

    try {
      const response = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${c.env.RESEND_API_KEY}`,
        },
        body: JSON.stringify({
          from: c.env.FROM_EMAIL,
          to: c.env.CONTACT_EMAIL,
          reply_to: body.email,
          subject: `【お問い合わせ】${category}`,
          html: `
            <h2>お問い合わせがありました</h2>
            <table style="border-collapse: collapse; width: 100%; max-width: 600px;">
              <tr>
                <td style="padding: 12px; border: 1px solid #ddd; background: #f9f9f9; width: 30%;"><strong>お名前</strong></td>
                <td style="padding: 12px; border: 1px solid #ddd;">${escapeHtml(body.name)}</td>
              </tr>
              <tr>
                <td style="padding: 12px; border: 1px solid #ddd; background: #f9f9f9;"><strong>メールアドレス</strong></td>
                <td style="padding: 12px; border: 1px solid #ddd;"><a href="mailto:${escapeHtml(body.email)}">${escapeHtml(body.email)}</a></td>
              </tr>
              <tr>
                <td style="padding: 12px; border: 1px solid #ddd; background: #f9f9f9;"><strong>会社名</strong></td>
                <td style="padding: 12px; border: 1px solid #ddd;">${escapeHtml(body.company)}</td>
              </tr>
              <tr>
                <td style="padding: 12px; border: 1px solid #ddd; background: #f9f9f9;"><strong>種別</strong></td>
                <td style="padding: 12px; border: 1px solid #ddd;">${escapeHtml(category)}</td>
              </tr>
              <tr>
                <td style="padding: 12px; border: 1px solid #ddd; background: #f9f9f9;"><strong>お問い合わせ内容</strong></td>
                <td style="padding: 12px; border: 1px solid #ddd; white-space: pre-wrap;">${escapeHtml(body.message)}</td>
              </tr>
            </table>
          `,
        }),
      })

      if (!response.ok) {
        const error = await response.text()
        console.error('Resend error:', error)
        throw new Error('メール送信に失敗しました')
      }

      return c.json({ success: true as const })
    } catch (error) {
      console.error('Email send error:', error)
      return c.json(
        { success: false as const, error: 'メール送信に失敗しました' },
        500,
      )
    }
  },
)
