# Integration and content notes

This file covers three things: which content on the site has been verified, what the
organization still has to provide, and how to connect a backend when one exists.

## 1. Content sources

All company and product facts live in two typed files:

| File | Contents |
| --- | --- |
| `shared/company.ts` | Name, phone, email, address, licence (`null` until confirmed) |
| `shared/products.ts` | Loan products: amount, term, currency, repayment, collateral |
| `i18n/locales/{uz,ru}.json` | All visible text in Uzbek and Russian |

The data comes from the current microfinance.uz site (reviewed 2026-10-19). Only facts that the
site states consistently were used.

Uzbek text uses the new Latin alphabet (since 2026-10-24): `sh → ş`, `ch → ç`, `gʻ → ğ`,
`oʻ → ö`; the glottal stop `ʼ` (taʼminot) stays. Write new Uzbek copy the same way. i18n keys,
slugs, URLs and the Yandex search string `COMPANY.address.mapQuery` stay in plain old spelling.
The branch search accepts both alphabets.

### Deliberately not published

The current site contradicts itself on these points, or they look like placeholders. Each needs
a confirmed value from the organization before it goes on the site:

| Item | What the current site shows | Problem |
| --- | --- | --- |
| Central Bank licence | "№ 12345" | Looks like a placeholder |
| Interest rate (consumer loan) | "45%" in one place, "48% dan" in another | Two different rates for one product. The old calculator reproduces exactly with 48%, which the new calculator uses as an indicative rate (see item 2) |
| Founding year / experience | "Established 2025" and "15+ years of experience" | Contradictory |
| Copyright / charter dates | © 2024, charter 2023 | Earlier than the stated 2025 founding |
| Client statistics | 1000+ clients, 98% approval, 2-hour review | No source |
| Branch network | "9 branches and representative offices" | No addresses |
| Affiliation | "Opened under Biznesni Rivojlantirish Banki" | Not confirmed from an independent source |
| Decision and payout times, early repayment, documents | FAQ answers | Needs confirmation before it is presented as a commitment |
| Documents (licence, certificates, charter) | View/download buttons | No files available |

### Required from the organization

1. **Legal details:** full registered name and legal form (e.g. MChJ), Central Bank licence number
   and date, STIR/INN. Set `COMPANY.license` in `shared/company.ts`. The licence line in
   the footer appears automatically once it is set.
2. **Interest rates and disclosures:** the rate sheet in force from 2026-06-01 (45–51 % a year by
   amount and term, loans up to 100 mln for at most 36 months) is `RATE_SHEET` in `shared/products.ts`;
   the calculator, product pages and meta descriptions read it. Murobaha uses a 30 % annual markup
   with equal instalments (`MUROBAHA_MARKUP_PCT`). Still to confirm: whether the murobaha markup is
   annual or for the whole term, and any disclosure that consumer-credit rules require (for example
   the annual effective rate and total cost of credit, fees or insurance).
3. **Required documents and borrower requirements** for each product. The "documents" and
   "requirements" tabs on the current site are empty.
4. **Working hours** of the office and the trust line.
5. **Official logo** as SVG (horizontal lockup and a square mark). The header uses
   `public/images/logo-mark.png`, cleaned up from a PNG with a baked-in checkerboard, and the
   favicons in `public/` are an interim mark.
6. **The official Russian spelling** of the organization name and street address. Both are
   currently kept in their Uzbek form in `ru.json` and `shared/company.ts`.
7. **LinkedIn profile**, if any. Instagram, Telegram, YouTube and Facebook are in `SOCIAL_LINKS` (`shared/company.ts`), which feeds the footer and JSON-LD `sameAs`.
8. **Other products.** The current site's meta tags list women's, business, agricultural,
   education and mortgage loans, but only the consumer loan has a page. Add products to
   `shared/products.ts` and the locale files only once their terms are confirmed.
9. **Open Graph image.** `public/og-image.jpg` (1200×630) is cut from the hero photo of the head office; replace it with a designed one (logo, slogan) if the organization has one.
10. **Islamic finance.** The hero card "Islomiy moliyalashtirish" says "Shariat tamoyillariga
    mos" and links to the BRB marketplace (`MARKETPLACE_URL` in `shared/company.ts`). As of
    2026-10-19 the marketplace describes installment purchases ("nasiya") with a sample 24%
    annual rate and never calls them Islamic or Sharia-compliant. Before launch, confirm the
    product structure (e.g. murabaha), its Sharia review and the regulatory basis, or soften the
    wording. Then replace `vercel.app` with the production domain.
11. **Photos.** The hero uses `public/images/hero-image.webp` (1672×941); the offer cards use
    `public/images/islomiy-moliya.webp` and `public/images/istemol-credit.webp`; the application section
    background is `public/images/forma-image.webp` (1536×1024), which a 2400px+ version would make
    sharper on wide screens. Use only images the organization has rights to.
12. **FAQ answers.** The "Koʻp soʻraladigan savollar" section reuses the answers from the current
    site. Several are commitments that must be confirmed before launch: required documents
    ("passport and STIR are enough up to 5 mln"), processing times (24–48 h, same day, 4 h express)
    and early repayment "without any penalty". Texts: `home.faq` in `i18n/locales/{uz,ru}.json`.
13. **Branches.** The "Biz bilan bogʻlaning" map (`shared/branches.ts`) has the eight branch pins
    decoded from the Plus Codes the organization gave on 2026-10-24. Still needed per branch: street
    address (only Tashkent, the head office, has one), phone number (every card shows the trust
    line for now), opening hours and a photo (Tashkent uses the hero photo of the head office; the
    others show a placeholder icon). The country outline that sets Uzbekistan apart on the map
    (`public/geo/uzbekistan.json`) and the coloured regions (`public/geo/uzbekistan-regions.json`)
    come from Natural Earth 1:10m (public domain).

## 2. Backend integration

No backend or API is known yet. The only form is the loan application, which is not delivered
anywhere until an endpoint is configured (see below).

### Pattern

Browser code calls only the site's own server routes under `server/api/`. Those routes call
upstream services from the server, so credentials never reach the client.

```
Browser ──> /api/<name> (Nitro, server/api/<name>.ts) ──> upstream CMS / API
```

Server-only configuration goes in `runtimeConfig` in `nuxt.config.ts`, **not** under `public`.
Set it with environment variables:

```ts
runtimeConfig: {
  backendApiUrl: '',   // NUXT_BACKEND_API_URL
  backendApiToken: '', // NUXT_BACKEND_API_TOKEN
  public: { siteUrl: 'https://microfinance.uz' },
}
```

### Loan applications

The homepage section `#application` (`app/components/home/HomeApplication.vue`) collects name,
phone, loan product, region, amount and collateral type. The browser posts to `/api/applications`
(`server/api/applications.post.ts`), which validates with the same rules as the form
(`shared/application.ts`) and delivers it to every configured channel:

- **Email via [Resend](https://resend.com):** set `NUXT_RESEND_API_KEY` and
  `NUXT_APPLICATIONS_EMAIL_TO` (comma-separated). The message is in Uzbek
  (`server/utils/applicationEmail.ts`). Until a sending domain is verified in Resend, the default
  sender `onboarding@resend.dev` only delivers to the Resend account's own address; afterwards set
  `NUXT_APPLICATIONS_EMAIL_FROM`, e.g. `Microfinance.uz <ariza@microfinance.uz>`.
- **Endpoint:** the JSON goes to `NUXT_APPLICATIONS_ENDPOINT` with an optional
  `Authorization: Bearer <NUXT_APPLICATIONS_TOKEN>` header. Body:
  `{ product, name, phone (E.164), amountMln, collateral, region, locale, submittedAt }`;
  `region` is a key from `shared/regions.ts`, e.g. `tashkentCity` or `samarkand`.

The form reports success once any channel accepted the application; failed channels are logged.
With no channel configured the route answers 503, and if every channel fails it answers 502. In
both cases the form shows an error with the phone number, so it never reports a success that
nobody receives. Before launch:

- **Where submissions go** (CRM, email, core banking system) and who processes them.
- **Personal data:** a consent line on the form (currently none) and a privacy notice under
  the Law of the Republic of Uzbekistan "On Personal Data", the storage location and the retention
  period.
- **Abuse protection:** the route has server-side validation and a honeypot field only. Add rate
  limiting and bot protection (for example a CAPTCHA).

Collect the minimum until security requirements are agreed. Do not collect passport, STIR,
income or card data through the website.

## 3. Environment variables

| Variable | Default | Purpose |
| --- | --- | --- |
| `NUXT_PUBLIC_SITE_URL` | `https://microfinance.uz` | Origin for JSON-LD and the sitemap |
| `NUXT_PUBLIC_I18N_BASE_URL` | `https://microfinance.uz` | Origin for canonical and hreflang links |
| `NUXT_APPLICATIONS_ENDPOINT` | (empty) | Server-only URL that receives loan applications |
| `NUXT_APPLICATIONS_TOKEN` | (empty) | Optional bearer token for that URL |
| `NUXT_RESEND_API_KEY` | (empty) | Server-only Resend API key for application emails |
| `NUXT_APPLICATIONS_EMAIL_TO` | (empty) | Comma-separated recipients of application emails |
| `NUXT_APPLICATIONS_EMAIL_FROM` | `Microfinance.uz <onboarding@resend.dev>` | Sender; must be on a domain verified in Resend |
| `NUXT_PUBLIC_YANDEX_MAPS_API_KEY` | (empty) | Yandex Maps JavaScript API 2.1 key for the branches map. Public by design: restrict it to the site domain (HTTP Referer) in the Yandex developer console. The country and region outlines are local files, so they do not depend on the key |

Set both to the same value on staging. Staging should also send `noindex`, which is not
configured yet.

## 4. SEO behaviour

- URLs: `/uz/...` and `/ru/...`. `/` redirects to the visitor's language (cookie, then
  `Accept-Language`, then Uzbek).
- Every page has a self-referencing canonical, hreflang alternates for `uz`, `ru` and
  `x-default`, plus `og:locale` and `og:url`.
- JSON-LD: `Organization` and `WebSite` on the homepage, `BreadcrumbList` on product pages.
  `logo` and `sameAs` are left out until official assets are available.
- `/sitemap.xml` lists every page with its alternates. When you add a page, also add it to
  `PAGE_PATHS` in `server/routes/sitemap.xml.ts`.
- The legacy consumer-loan URLs `/kredit/istemol` and `/{uz,ru}/kredit/istemol` return a 301 to `/{locale}/kredit/mikroqarz` (the product was renamed Mikroqarz on 2026-10-23).
