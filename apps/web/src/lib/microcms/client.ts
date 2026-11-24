import { createClient } from 'microcms-js-sdk'

if (!import.meta.env.MICROCMS_API_KEY) {
  throw new Error('MICROCMS_API_KEY is required')
}

export const client = createClient({
  serviceDomain: 'notosan',
  apiKey: import.meta.env.MICROCMS_API_KEY,
})
