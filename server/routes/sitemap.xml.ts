import { LOAN_PRODUCTS, loanProductPath } from '#shared/products'

const PAGE_PATHS = ['/', ...LOAN_PRODUCTS.map(product => loanProductPath(product.slug))]

export default defineEventHandler((event) => {
  const origin = useRuntimeConfig(event).public.siteUrl.replace(/\/+$/, '')

  const entries = PAGE_PATHS.map(path => `  <url>\n    <loc>${origin}${path}</loc>\n  </url>`)

  setResponseHeader(event, 'content-type', 'application/xml; charset=utf-8')
  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...entries,
    '</urlset>',
  ].join('\n')
})
