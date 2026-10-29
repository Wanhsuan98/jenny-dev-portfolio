import { defineNuxtConfig } from 'nuxt/config'

export default defineNuxtConfig({
  future: {
    compatibilityVersion: 4,
  },
  compatibilityDate: '2026-06-02',
  // 正式網址由 Vercel 環境變數 NUXT_SITE_URL 覆寫
  site: {
    url: 'https://jenny-dev-portfolio.vercel.app',
    name: 'Jenny Dev Portfolio',
    description:
      'Jenny 的前端工程作品集：Vue 3 / Nuxt 與 React / Next.js 專案、技術研究報告與工程規範。',
    defaultLocale: 'zh-TW',
  },
  app: {
    head: {
      htmlAttrs: { lang: 'zh-TW' },
      titleTemplate: '%s | Jenny Dev Portfolio',
      link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }],
      meta: [
        { property: 'og:type', content: 'website' },
        { property: 'og:locale', content: 'zh_TW' },
        { property: 'og:site_name', content: 'Jenny Dev Portfolio' },
      ],
    },
  },
  // 簽到頁只用 noindex，不在 robots.txt disallow，否則爬蟲讀不到 noindex
  routeRules: {
    '/liff': { ssr: false, robots: false },
    '/activity/checkin': { ssr: false, robots: false },
  },
  sitemap: {
    sources: ['/api/__sitemap__/urls'],
    exclude: ['/liff', '/activity/**', '/about'],
  },
  components: [
    {
      path: '~/components',
      pathPrefix: false,
    },
  ],
  modules: ['@pinia/nuxt', '@nuxtjs/tailwindcss', '@nuxtjs/robots', '@nuxtjs/sitemap'],
  css: ['~/assets/main.css'],
  nitro: {
    compressPublicAssets: {
      gzip: true,
      brotli: true,
    },
  },
  runtimeConfig: {
    public: {
      firebaseApiKey: '',
      firebaseAuthDomain: '',
      firebaseProjectId: '',
      firebaseStorageBucket: '',
      firebaseMessagingSenderId: '',
      firebaseAppId: '',
      liffId: '',
    },
  },
})
