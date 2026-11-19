import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { contactRoute } from './routes/contact'

export type Bindings = {
  RESEND_API_KEY: string
  CONTACT_EMAIL: string
  FROM_EMAIL: string
}

export const app = new Hono<{ Bindings: Bindings }>()
  .basePath('/api')
  .use('*', cors())
  .route('/contact', contactRoute)
  .get('/health', (c) => c.json({ status: 'ok' as const }))

export type AppType = typeof app
