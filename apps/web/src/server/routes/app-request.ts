import { vValidator } from '@hono/valibot-validator'
import { Hono } from 'hono'
import type { Bindings } from '../app'
import { escapeHtml, mailTable, sendMail } from '../lib/mail'
import { notifySlack } from '../lib/slack'
import { appLabels, appRequestSchema } from '../schemas/app-request'

export const appRequestRoute = new Hono<{ Bindings: Bindings }>().post(
  '/',
  vValidator('json', appRequestSchema, (result, c) => {
    if (!result.success) {
      return c.json(
        {
          success: false as const,
          error: result.issues[0]?.message || 'バリデーションエラー',
        },
        400,
      )
    }
  }),
  async (c) => {
    const body = c.req.valid('json')
    const appName = appLabels[body.app]

    try {
      await sendMail(c.env, {
        replyTo: body.email,
        subject: `【利用申し込み】${appName}`,
        html: `
          <h2>${escapeHtml(appName)} の利用申し込みがありました</h2>
          ${mailTable([
            ['アプリ', escapeHtml(appName)],
            ['お名前', escapeHtml(body.name)],
            [
              '登録用のメールアドレス',
              `<a href="mailto:${escapeHtml(body.email)}">${escapeHtml(body.email)}</a>`,
            ],
          ])}
        `,
      })
      await notifySlack(c.env, `利用申し込み：${appName}`, [
        ['お名前', body.name],
        ['登録用のメールアドレス', body.email],
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
