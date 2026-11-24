import { Hono } from 'hono'
import type { Bindings } from '../app'

type ContentState = {
  status?: string[]
  publishValue?: unknown
}

type Payload = {
  api?: string
  contents?: { old?: ContentState | null; new?: ContentState | null } | null
}

const SITE_APIS = ['articles', 'careers', 'projects']
const MAX_BYTES = 5 * 1024 * 1024

const isPublished = (state?: ContentState | null) =>
  state?.status?.includes('PUBLISH') ?? false

// 公開版の中身が変わったときだけ作り直す。下書きの保存や破棄では公開版が変わらない
const changesPublishedSite = (payload: Payload) => {
  if (!payload.api || !SITE_APIS.includes(payload.api)) return false
  const before = payload.contents?.old
  const after = payload.contents?.new
  if (!isPublished(before) && !isPublished(after)) return false
  if (isPublished(before) !== isPublished(after)) return true
  return (
    JSON.stringify(before?.publishValue) !== JSON.stringify(after?.publishValue)
  )
}

const hexToBytes = (hex: string) => {
  if (!/^(?:[0-9a-f]{2})+$/i.test(hex)) return undefined
  return Uint8Array.from(hex.match(/../g) ?? [], (h) => Number.parseInt(h, 16))
}

// microCMS は本文の HMAC-SHA256 を 16 進で送る。verify は比べる時間が一定になる
const verifySignature = async (
  secret: string,
  body: string,
  signature: string,
) => {
  const sig = hexToBytes(signature)
  if (!sig) return false
  const encoder = new TextEncoder()
  const key = await crypto.subtle.importKey(
    'raw',
    encoder.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['verify'],
  )
  return crypto.subtle.verify('HMAC', key, sig, encoder.encode(body))
}

// 公開版が変わったら Workers Builds の Deploy Hook を呼び、サイトを作り直す
export const microcmsWebhookRoute = new Hono<{ Bindings: Bindings }>().post(
  '/',
  async (c) => {
    const secret = c.env.MICROCMS_WEBHOOK_SECRET
    const hookUrl = c.env.DEPLOY_HOOK_URL
    if (!secret || !hookUrl) {
      console.error('MICROCMS_WEBHOOK_SECRET か DEPLOY_HOOK_URL が未設定です')
      return c.json({ ok: false as const, error: 'server error' }, 500)
    }
    if (Number(c.req.header('Content-Length')) > MAX_BYTES) {
      return c.json({ ok: false as const, error: 'payload too large' }, 413)
    }
    const body = await c.req.text()
    if (body.length > MAX_BYTES) {
      return c.json({ ok: false as const, error: 'payload too large' }, 413)
    }
    const signature = c.req.header('x-microcms-signature') ?? ''
    if (!(await verifySignature(secret, body, signature))) {
      return c.json({ ok: false as const, error: 'invalid signature' }, 401)
    }

    let payload: Payload
    try {
      payload = JSON.parse(body) as Payload
    } catch {
      return c.json({ ok: false as const, error: 'invalid json' }, 400)
    }
    if (!changesPublishedSite(payload)) {
      return c.json({ ok: true as const, deployed: false })
    }

    try {
      const res = await fetch(hookUrl, { method: 'POST' })
      if (!res.ok) throw new Error(`deploy hook returned ${res.status}`)
    } catch (error) {
      console.error('deploy hook failed:', error)
      return c.json({ ok: false as const, error: 'deploy failed' }, 502)
    }
    return c.json({ ok: true as const, deployed: true })
  },
)
