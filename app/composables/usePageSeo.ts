/**
 * 頁面 SEO: 統一設定 title / description / OG / canonical。
 * canonical 需明確傳入主網址路徑，避免 alias 路由（如 /about、/project/:id）產生重複內容。
 */
import { computed, toValue, type MaybeRefOrGetter } from 'vue'

interface PageSeoOptions {
  title: MaybeRefOrGetter<string | undefined>
  description: MaybeRefOrGetter<string | undefined>
  path: MaybeRefOrGetter<string>
  image?: MaybeRefOrGetter<string | undefined>
}

// 1200x630，符合 summary_large_image 的橫幅比例
const DEFAULT_IMAGE = '/og-default.png'

export function usePageSeo(options: PageSeoOptions) {
  const site = useSiteConfig()

  const toAbsolute = (path: string) =>
    path.startsWith('http') ? path : `${site.url.replace(/\/$/, '')}${path}`

  const canonical = computed(() => toAbsolute(toValue(options.path)))
  const image = computed(() => toAbsolute(toValue(options.image) || DEFAULT_IMAGE))

  useSeoMeta({
    title: () => toValue(options.title),
    description: () => toValue(options.description),
    ogTitle: () => toValue(options.title),
    ogDescription: () => toValue(options.description),
    ogUrl: canonical,
    ogImage: image,
    twitterCard: 'summary_large_image',
  })

  useHead({
    link: [{ rel: 'canonical', href: canonical }],
  })
}
