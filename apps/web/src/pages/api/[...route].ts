import { env } from 'cloudflare:workers'
import { app } from '@/server/app'
import type { APIRoute } from 'astro'

export const prerender = false

export const ALL: APIRoute = ({ request }) => app.fetch(request, env)
