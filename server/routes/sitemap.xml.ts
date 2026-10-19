import { DEFAULT_LOCALE, LOCALE_LANGUAGE, LOCALES } from '#shared/locales'
import { LOAN_PRODUCTS, loanProductPath } from '#shared/products'

/** Locale-less paths of every indexable page. Add new pages here. */
const PAGE_PATHS = ['', ...LOAN_PRODUCTS.map(product => loanProductPath(product.slug))]

export default defineEventHandler((event) => {
  const origin = useRuntimeConfig(event).public.siteUrl.replace(/\/+$/, '')
  const url = (locale: string, path: string) => `${origin}/${locale}${path}`

  const entries = PAGE_PATHS.flatMap(path =>
    LOCALES.map((locale) => {
      const alternates = [
        ...LOCALES.map(alt => `<xhtml:link rel="alternate" hreflang="${LOCALE_LANGUAGE[alt]}" href="${url(alt, path)}"/>`),
        `<xhtml:link rel="alternate" hreflang="x-default" href="${url(DEFAULT_LOCALE, path)}"/>`,
      ]
      return `  <url>\n    <loc>${url(locale, path)}</loc>\n    ${alternates.join('\n    ')}\n  </url>`
    }),
  )

  setResponseHeader(event, 'content-type', 'application/xml; charset=utf-8')
  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">',
    ...entries,
    '</urlset>',
  ].join('\n')
})
