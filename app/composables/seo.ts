import { SITE_NAME } from '#shared/company'

/**
 * Site-wide head: <html lang>, canonical, hreflang alternates and og:locale (from @nuxtjs/i18n),
 * plus the title template. Called from app.vue and error.vue (the error page replaces app.vue).
 */
export function useAppHead() {
  const i18nHead = useLocaleHead({ dir: true, lang: true, seo: true })

  useHead(() => ({
    htmlAttrs: { ...i18nHead.value.htmlAttrs },
    link: [...i18nHead.value.link],
    meta: [...i18nHead.value.meta],
    titleTemplate: (title?: string) => (title ? `${title} — ${SITE_NAME}` : SITE_NAME),
  }))

  useSeoMeta({
    ogSiteName: SITE_NAME,
    ogType: 'website',
    twitterCard: 'summary',
  })
}

interface PageSeo {
  title: string
  description: string
  /** Use the title as-is instead of appending the site name. */
  fullTitle?: boolean
}

export function usePageSeo(input: () => PageSeo) {
  useHead(() => (input().fullTitle ? { titleTemplate: '%s' } : {}))

  useSeoMeta({
    title: () => input().title,
    description: () => input().description,
    ogTitle: () => input().title,
    ogDescription: () => input().description,
    twitterTitle: () => input().title,
    twitterDescription: () => input().description,
  })
}

/** Adds a JSON-LD script. `<` is escaped so the payload can never close the script tag. */
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
