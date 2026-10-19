// https://nuxt.com/docs/api/configuration/nuxt-config
import { DEFAULT_LOCALE, LOCALE_LANGUAGE, LOCALE_NAME, LOCALES } from './shared/locales'

/** Production origin used for canonical URLs, hreflang, JSON-LD and the sitemap. */
const SITE_URL = 'https://microfinance.uz'

export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },

  // Nuxt UI also registers Tailwind CSS 4 (through its Vite plugin) and @nuxt/icon.
  modules: ['@nuxt/ui', '@nuxtjs/i18n', '@nuxt/image'],

  ui: {
    // Manrope is self-hosted via @fontsource; no font downloads.
    fonts: false,
    // The site has a light theme only.
    colorMode: false,
    theme: {
      // `primary` = brand red, `neutral` = ink (mapped in app.config.ts).
      colors: ['primary', 'error'],
    },
  },

  icon: {
    // Bundle icons on the server from the installed @iconify-json packages (no Iconify API calls).
    serverBundle: 'local',
    // Icons referenced in components are bundled into the client too, so nothing is fetched at runtime.
    clientBundle: { scan: true },
    customCollections: [{ prefix: 'mf', dir: './app/assets/icons' }],
  },

  image: {
    // Local images in public/ are resized and converted on the fly by IPX (sharp).
    // Output format is set per <NuxtImg format="webp">.
    quality: 80,
    // Cache processed images for 7 days (IPX default is 60 s). Image URLs carry no content hash,
    // so rename a file in public/ when replacing it to bust caches immediately.
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
      // Lets CSS tell "script will run" apart from no-JS before hydration (UiTypewriter).
      script: [
        { innerHTML: 'document.documentElement.classList.add(\'js\')' },
      ],
    },
  },

  runtimeConfig: {
    // Server-only keys for a future backend go here (e.g. `apiBaseUrl`), set via NUXT_* env vars.
    // Never put credentials under `public`. See docs/INTEGRATION.md.
    // Loan applications are forwarded here (NUXT_APPLICATIONS_ENDPOINT / NUXT_APPLICATIONS_TOKEN).
    applicationsEndpoint: '',
    applicationsToken: '',
    public: {
      // Override per environment with NUXT_PUBLIC_SITE_URL.
      siteUrl: SITE_URL,
    },
  },

  nitro: {
    // Serve pre-built gzip/brotli copies of CSS, JS and other public files.
    compressPublicAssets: true,
  },

  routeRules: {
    // Baseline security headers. HSTS and HTML compression belong to the HTTPS proxy in front of the app;
    // a Content-Security-Policy needs testing against Nuxt's inline scripts first (docs/INTEGRATION.md).
    '/**': {
      headers: {
        'X-Content-Type-Options': 'nosniff',
        'X-Frame-Options': 'SAMEORIGIN',
        'Referrer-Policy': 'strict-origin-when-cross-origin',
        'Permissions-Policy': 'camera=(), microphone=(), geolocation=(), payment=()',
      },
    },
    // Keep the legacy, already-indexed product URL working.
    '/kredit/istemol': { redirect: { to: `/${DEFAULT_LOCALE}/kredit/istemol`, statusCode: 301 } },
  },

  i18n: {
    strategy: 'prefix',
    defaultLocale: DEFAULT_LOCALE,
    // Override per environment with NUXT_PUBLIC_I18N_BASE_URL.
    baseUrl: SITE_URL,
    locales: LOCALES.map(code => ({
      code,
      language: LOCALE_LANGUAGE[code],
      name: LOCALE_NAME[code],
      file: `${code}.json`,
    })),
    detectBrowserLanguage: {
      // Only "/" redirects to the visitor's language; prefixed URLs are never rewritten.
      redirectOn: 'root',
      useCookie: true,
      cookieKey: 'i18n_locale',
      fallbackLocale: DEFAULT_LOCALE,
    },
  },
})
