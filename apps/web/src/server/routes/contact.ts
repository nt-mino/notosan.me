import { vValidator } from '@hono/valibot-validator'
import { Hono } from 'hono'
import type { Bindings } from '../app'
import { escapeHtml, mailTable, sendMail } from '../lib/mail'
import { notifySlack } from '../lib/slack'
import { categoryLabels, contactSchema } from '../schemas/contact'

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
      await sendMail(c.env, {
        replyTo: body.email,
        subject: `【お問い合わせ】${category}`,
        html: `
          <h2>お問い合わせがありました</h2>
          ${mailTable([
            ['お名前', escapeHtml(body.name)],
            [
              'メールアドレス',
              `<a href="mailto:${escapeHtml(body.email)}">${escapeHtml(body.email)}</a>`,
            ],
            ['会社名', escapeHtml(body.company)],
            ['種別', escapeHtml(category)],
            ['お問い合わせ内容', escapeHtml(body.message)],
          ])}
        `,
      })

      await notifySlack(c.env, `お問い合わせ：${category}`, [
        ['お名前', body.name],
        ['メールアドレス', body.email],
        ['会社名', body.company],
        ['お問い合わせ内容', body.message],
      ])
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
