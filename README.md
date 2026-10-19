# microfinance.uz

Corporate website for «Biznesni rivojlantirish» mikromoliya tashkiloti (Microfinance.uz).
Built with Nuxt 4 (SSR), Vue 3, TypeScript, Nuxt UI 4 (components, Tailwind CSS 4, icons),
`@nuxtjs/i18n` and `@nuxt/image`. The site is in Uzbek (`/uz`) and Russian (`/ru`).

## Commands

```bash
npm install         # install dependencies
npm run dev         # dev server on http://localhost:3000
npm run typecheck   # vue-tsc in strict mode
npm run build       # production build in .output/
npm run preview     # serve the production build
```

`nuxt build` and `nuxt dev` both use `.nuxt/`. Stop the dev server before you build in the
same folder.

## Structure

```
app/
  app.config.ts          Nuxt UI theme: brand colours, button sizes, focus ring
  assets/css/main.css    Design tokens (@theme), Nuxt UI overrides, base styles
  assets/icons/          Custom icons (i-mf-*), e.g. mihrab
  components/
    app/                 Header, footer, logo, language switcher
    ui/                  Section heading, calculator slider (USlider), decorative pattern
    loan/                Loan figures, collateral, process steps, responsible-borrowing note
    home/                Homepage sections
  composables/           SEO/head helpers, locale, homepage section links
  layouts/default.vue    Skip link, header, main, footer
  pages/                 index.vue, kredit/[slug].vue
  error.vue              Localized 404/500 page
  utils/                 Icons, URL and amount formatting, loan maths, JSON-LD builders
i18n/locales/            uz.json, ru.json (all visible text)
shared/                  Company facts, loan products, locales (app + server)
server/
  routes/sitemap.xml.ts  Sitemap with hreflang alternates
docs/INTEGRATION.md      Content status, data needed from the organization, backend plan
```

## Content rules

- Company and product facts live only in `shared/company.ts` and `shared/products.ts`.
  Publish only figures the organization has confirmed.
- Every visible string goes in both locale files.
- The colour palette is limited to the `brand` and `ink` scales in `main.css`. Use
  `ink-500` or darker for text on white.

See [docs/INTEGRATION.md](docs/INTEGRATION.md) for the items still waiting on the
organization (licence, rates, documents, logo) and for how to connect a backend.
