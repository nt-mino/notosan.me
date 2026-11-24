import { Hono } from 'hono'
import { appRequestRoute } from './routes/app-request'
import { contactRoute } from './routes/contact'
import { microcmsWebhookRoute } from './routes/microcms-webhook'

export type Bindings = {
  RESEND_API_KEY: string
  CONTACT_EMAIL: string
  FROM_EMAIL: string
  SLACK_WEBHOOK_URL?: string
  MICROCMS_WEBHOOK_SECRET?: string
  DEPLOY_HOOK_URL?: string
}

export const app = new Hono<{ Bindings: Bindings }>()
  .basePath('/api')
  .route('/contact', contactRoute)
  .route('/app-request', appRequestRoute)
  .route('/webhooks/microcms', microcmsWebhookRoute)
  .get('/health', (c) => c.json({ status: 'ok' as const }))

export type AppType = typeof app
