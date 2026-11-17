export default defineNuxtPlugin(() => {
  // Local development must not count as site traffic.
  if (import.meta.dev) return

  // The standard Google tag. Navigation between pages needs no extra code: GA4's enhanced
  // measurement (on by default) counts a page view on every browser-history change.
  useHead({
    script: [
      { key: 'gtag-src', src: `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`, async: true },
      {
        key: 'gtag-init',
        innerHTML: `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${GA_MEASUREMENT_ID}');`,
      },
    ],
  })
})
