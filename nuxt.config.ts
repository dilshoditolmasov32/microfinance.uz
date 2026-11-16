import { LOAN_PRODUCTS, loanProductPath } from './shared/products'
import { DEFAULT_LOCALE, LOCALE_LANGUAGE, LOCALE_NAME, LOCALES } from './shared/locales'

const SITE_URL = 'https://microfinance.uz'

export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },

  modules: ['@nuxt/ui', '@nuxtjs/i18n', '@nuxt/image',  '@nuxtjs/sitemap'],

  ui: {
    fonts: false,
    colorMode: false,
    theme: {
      colors: ['primary', 'error'],
    },
  },

  icon: {
    serverBundle: 'local',
    clientBundle: { scan: true },
    customCollections: [{ prefix: 'mf', dir: './app/assets/icons' }],
  },

  image: {
    quality: 80,
    ipx: { maxAge: 60 * 60 * 24 * 7 },
    providers: { none: { provider: 'none' } },
  },

  css: ['@fontsource-variable/manrope', '~/assets/css/main.css'],

  app: {
    head: {
      meta: [
        { name: 'theme-color', content: '#ffffff' },
        { name: 'yandex-verification', content: '3977ba09b43d7352' },
      ],
      link: [
        { rel: 'icon', href: '/favicon.ico', sizes: '48x48' },
        { rel: 'icon', href: '/favicon-48.png', type: 'image/png', sizes: '48x48' },
        { rel: 'icon', href: '/favicon-192.png', type: 'image/png', sizes: '192x192' },
        { rel: 'apple-touch-icon', href: '/apple-touch-icon.png' },
      ],
      script: [
        { innerHTML: 'document.documentElement.classList.add(\'js\')' },
        { src: '//code.jivosite.com/widget/BbPIdJChLA', async: true },
      ],
    },
  },

  runtimeConfig: {
    applicationsEndpoint: '',
    applicationsToken: '',
    resendApiKey: '',
    applicationsEmailTo: '',
    applicationsEmailFrom: 'Microfinance.uz <onboarding@resend.dev>',
    bitrixWebhookUrl: '',
    bitrixAssignedByIds: '',
    public: {
      siteUrl: SITE_URL,
      yandexMapsApiKey: '',
    },
  },

  nitro: {
    compressPublicAssets: true,
  },

  routeRules: {
    '/**': {
      headers: {
        'X-Content-Type-Options': 'nosniff',
        'X-Frame-Options': 'SAMEORIGIN',
        'Referrer-Policy': 'strict-origin-when-cross-origin',
        'Permissions-Policy': 'camera=(), microphone=(), geolocation=(self), payment=()',
      },
    },
    // The default locale has no URL prefix, so old /uz/... URLs permanently redirect to the unprefixed ones.
    [`/${DEFAULT_LOCALE}`]: { redirect: { to: '/', statusCode: 301 } },
    [`/${DEFAULT_LOCALE}/**`]: { redirect: { to: '/**', statusCode: 301 } },
    // The consumer loan was renamed Mikroqarz; each language keeps its own prefix.
    '/kredit/istemol': { redirect: { to: '/kredit/mikroqarz', statusCode: 301 } },
    [`/${DEFAULT_LOCALE}/kredit/istemol`]: { redirect: { to: '/kredit/mikroqarz', statusCode: 301 } },
    ...Object.fromEntries(LOCALES.filter(code => code !== DEFAULT_LOCALE).map(code => [
      `/${code}/kredit/istemol`,
      { redirect: { to: `/${code}/kredit/mikroqarz`, statusCode: 301 } },
    ])),
  },

  site: { url: SITE_URL },

  sitemap: {
    xsl: false,
    // One /sitemap.xml for both languages instead of an index with a file per language.
    sitemaps: false,
    // _i18nTransform lists each product once per language, with hreflang alternates.
    urls: LOAN_PRODUCTS.map(product => ({ loc: loanProductPath(product.slug), _i18nTransform: true })),
  },

  i18n: {
    strategy: 'prefix_except_default',
    defaultLocale: DEFAULT_LOCALE,
    baseUrl: SITE_URL,
    locales: LOCALES.map(code => ({
      code,
      language: LOCALE_LANGUAGE[code],
      name: LOCALE_NAME[code],
      file: `${code}.json`,
    })),
    // The URL alone decides the language, so crawlers and visitors always get the page they asked for.
    detectBrowserLanguage: false,
  },
})
