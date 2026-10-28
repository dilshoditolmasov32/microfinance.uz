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
    // `sizes` in @nuxt/image 2: every value needs a breakpoint (`sm:100vw md:100vw lg:60vw`); the
    // candidate width is computed from that breakpoint. A bare `100vw` counts as a 1px screen and
    // produces useless 1w/2w candidates, so phones fall back to the largest image.
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
    // Loan applications are also emailed through Resend (NUXT_RESEND_API_KEY, NUXT_APPLICATIONS_EMAIL_TO
    // as a comma-separated list, NUXT_APPLICATIONS_EMAIL_FROM on a domain verified in Resend).
    resendApiKey: '',
    applicationsEmailTo: '',
    applicationsEmailFrom: 'Microfinance.uz <onboarding@resend.dev>',
    // Loan applications become Bitrix24 CRM leads (NUXT_BITRIX_WEBHOOK_URL): an inbound webhook with the
    // "crm" scope, e.g. https://<portal>.bitrix24.uz/rest/1/<secret>/. It is a credential: server-only.
    bitrixWebhookUrl: '',
    public: {
      // Override per environment with NUXT_PUBLIC_SITE_URL.
      siteUrl: SITE_URL,
      // Yandex Maps JavaScript API key for the branches map (NUXT_PUBLIC_YANDEX_MAPS_API_KEY). It is
      // public by design; restrict it to the site domain in the Yandex developer console.
      yandexMapsApiKey: '',
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
        // geolocation=(self): the branches map has a 'my location' button.
        'Permissions-Policy': 'camera=(), microphone=(), geolocation=(self), payment=()',
      },
    },
    // The consumer loan became Mikroqarz (2026-10-23); keep the legacy, already-indexed URLs working.
    '/kredit/istemol': { redirect: { to: `/${DEFAULT_LOCALE}/kredit/mikroqarz`, statusCode: 301 } },
    ...Object.fromEntries(LOCALES.map(code => [`/${code}/kredit/istemol`, { redirect: { to: `/${code}/kredit/mikroqarz`, statusCode: 301 } }])),
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
