import { DEFAULT_LOCALE, LOCALE_LANGUAGE, LOCALE_NAME, LOCALES } from './shared/locales'

const SITE_URL = 'https://microfinance.uz'

export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },

  modules: ['@nuxt/ui', '@nuxtjs/i18n', '@nuxt/image'],

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
  },

  css: ['@fontsource-variable/manrope', '~/assets/css/main.css'],

  app: {
    head: {
      meta: [
        { name: 'theme-color', content: '#ffffff' },
      ],
      link: [
        { rel: 'icon', href: '/favicon.ico', sizes: '48x48' },
        { rel: 'icon', href: '/favicon.svg', type: 'image/svg+xml' },
        { rel: 'apple-touch-icon', href: '/apple-touch-icon.png' },
      ],
      script: [
        { innerHTML: 'document.documentElement.classList.add(\'js\')' },
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
    '/kredit/istemol': { redirect: { to: `/${DEFAULT_LOCALE}/kredit/mikroqarz`, statusCode: 301 } },
    ...Object.fromEntries(LOCALES.map(code => [`/${code}/kredit/istemol`, { redirect: { to: `/${code}/kredit/mikroqarz`, statusCode: 301 } }])),
  },

  i18n: {
    strategy: 'prefix',
    defaultLocale: DEFAULT_LOCALE,
    baseUrl: SITE_URL,
    locales: LOCALES.map(code => ({
      code,
      language: LOCALE_LANGUAGE[code],
      name: LOCALE_NAME[code],
      file: `${code}.json`,
    })),
    detectBrowserLanguage: {
      redirectOn: 'root',
      useCookie: true,
      cookieKey: 'i18n_locale',
      fallbackLocale: DEFAULT_LOCALE,
    },
  },
})
