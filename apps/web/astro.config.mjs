// @ts-check
import cloudflare from '@astrojs/cloudflare'
import react from '@astrojs/react'
import sitemap from '@astrojs/sitemap'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'astro/config'

export default defineConfig({
  site: 'https://notosan.me',
  output: 'static',
  adapter: cloudflare({
    // ページはすべてビルド時に作るので、画像もビルド時に変換して配る
    imageService: 'compile',
  }),
  session: false,
  vite: {
    plugins: [tailwindcss()],
  },
  integrations: [react(), sitemap()],
  image: {
    domains: ['images.microcms-assets.io'],
  },
})
