import { SITE_NAME } from '#shared/company'

export function useAppHead() {
  const i18nHead = useLocaleHead({ dir: true, lang: true, seo: true })

  useHead(() => ({
    htmlAttrs: { ...i18nHead.value.htmlAttrs },
    link: [...i18nHead.value.link],
    meta: [...i18nHead.value.meta],
    titleTemplate: (title?: string) => (title ? `${title} — ${SITE_NAME}` : SITE_NAME),
  }))

  const { t } = useI18n()
  const ogImage = absoluteUrl(useRuntimeConfig().public.siteUrl, '/og-image.jpg')
  useSeoMeta({
    ogSiteName: SITE_NAME,
    ogType: 'website',
    ogImage,
    ogImageWidth: 1200,
    ogImageHeight: 630,
    ogImageAlt: () => t('home.hero.imageAlt'),
    twitterCard: 'summary_large_image',
    twitterImage: ogImage,
  })
}

interface PageSeo {
  title: string
  description: string
  keywords?: string
  fullTitle?: boolean
}

export function usePageSeo(input: () => PageSeo) {
  useHead(() => (input().fullTitle ? { titleTemplate: '%s' } : {}))

  useSeoMeta({
    title: () => input().title,
    description: () => input().description,
    keywords: () => input().keywords,
    ogTitle: () => input().title,
    ogDescription: () => input().description,
    twitterTitle: () => input().title,
    twitterDescription: () => input().description,
  })
}

export function useJsonLd(key: string, data: () => Record<string, unknown>) {
  useHead(() => ({
    script: [
      {
        key,
        type: 'application/ld+json',
        innerHTML: JSON.stringify({ '@context': 'https://schema.org', ...data() }).replace(/</g, '\\u003c'),
      },
    ],
  }))
}
