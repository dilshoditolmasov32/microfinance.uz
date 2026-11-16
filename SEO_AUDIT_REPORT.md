# SEO Audit Report — Microfinance.uz

- **Audit date:** 2026-11-16
- **Scope:** Nuxt source code at commit `28c500f`, the Google Search Console export in `microfinance.uz-Performance-on-Search-2026-11-16/`, and the live site as fetched on 2026-11-16.
- **Phase:** audit only. No source file, configuration, route, CSV or financial value was changed. The only file created is this report.

How to read the labels used throughout:

| Label | Meaning |
| --- | --- |
| **Verified** | Read directly from a CSV, a source file, or a live HTTP response on 2026-11-16 |
| **Potential** | Consistent with the evidence, but not proven by it |
| **Recommendation** | A proposed action; nothing has been implemented |
| **Missing data** | Needed to answer the question, but not in the export or the repository |

---

## 1. Executive Summary

Microfinance.uz is not ranking for "mikromoliya tashkiloti" for five reasons that the data and the code both show. The Search Console export itself is very small (286 impressions, 53 clicks, 20 days), so it describes a site with almost no non-brand visibility. It is too small to rank individual keyword opportunities with confidence.

1. **The site declares one host and serves another.** Every canonical tag, `og:url`, sitemap entry, `robots.txt` sitemap line and JSON-LD URL says `https://microfinance.uz`. That host answers `308` and redirects to `https://www.microfinance.uz`. Google is told that the canonical version of every page is a URL that redirects.
2. **The Russian version cannot be indexed.** Since commit `4e1c893` (2026-11-10) both languages share one URL and the language comes from a cookie or `Accept-Language`. Googlebot receives Uzbek. The old `/ru/...` URLs, which had 97 page impressions at an average position of 4.59, now redirect to Uzbek pages.
3. **The primary keyword is not on the site in the spelling people search.** "mikromoliya tashkiloti" occurs 0 times in the server-rendered text of any page. The visible text says "Mikromoliya Taşkiloti". The homepage title is the brand and legal name only, and the H1 is a slogan with no keyword. All 28 Latin-script queries in the export use the `sh`/`ch` spelling; none uses `ş`/`ç`.
4. **There is very little to rank.** The site has four indexable URLs. Product pages carry 268–277 words including navigation and footer. There is no page about the organization, its licence, its branches or Murobaha.
5. **Trust signals expected of a financial site are missing.** No licence number, legal form, tax ID, privacy policy, terms or company page is published, and the application form collects a name and phone number with no consent text.

Two further findings need attention before anything else:

- **Visibility collapsed on 2026-11-06.** Impressions fell from 22.2 per day (10-25 to 11-05) to 2.5 per day (11-06 to 11-13), a drop of 88.7%. The export cannot say why. The remaining impressions are at position 1–2, which fits brand-only searches.
- **Uzbek product pages show a raw translation key.** The button under the H1 reads `products.mikroqarz.processButton` on the live site, because the key exists only in `ru.json`.

**Recommended order of work:** fix the host and URL architecture first (sections 10, 13), then the visible bug and on-page targeting (section 11), then trust content (section 12), then new pages (section 8). The full roadmap is in section 15.

---

## 2. CSV Files Inventory

**Verified.** One export folder was found, untracked in git, containing seven files. No spreadsheets, archives or other exports exist in the project (searched recursively, excluding `node_modules`, `.git`, `.nuxt`, `.output`).

Folder: `microfinance.uz-Performance-on-Search-2026-11-16/`

| File | Size | Rows (excl. header) | Report | Columns |
| --- | --- | --- | --- | --- |
| `Chart.csv` | 522 B | 20 | Performance by date | Date, Clicks, Impressions, CTR, Position |
| `Queries.csv` | 1,470 B | 36 | Top queries | Top queries, Clicks, Impressions, CTR, Position |
| `Pages.csv` | 1,077 B | 19 | Top pages | Top pages, Clicks, Impressions, CTR, Position |
| `Countries.csv` | 162 B | 6 | Countries | Country, Clicks, Impressions, CTR, Position |
| `Devices.csv` | 108 B | 3 | Devices | Device, Clicks, Impressions, CTR, Position |
| `Search appearance.csv` | 49 B | 0 | Search appearance | Header only, no data |
| `Filters.csv` | 60 B | 2 | Export filters | Search type = Web; Date = Last 3 months |

Data quality checks (all **verified**):

| Check | Result |
| --- | --- |
| Encoding | UTF-8, no BOM; Cyrillic queries read correctly |
| Duplicate keys | None in any file |
| CTR consistency | Every CTR equals clicks ÷ impressions (0 mismatches) |
| Missing values | One row: `2026-11-07` has 0 impressions, so CTR and Position are blank (expected) |
| Formats | CTR is a string with `%`; positions are decimals with `.`; consistent across files |
| Property type | Pages include `http://`, `https://`, `www.` and `mail.` hosts, so this is a Domain property |

Reporting period: the filter says "Last 3 months", but the first dated row is **2026-10-25** and the last is **2026-11-13**. The data covers 20 days, not three months.

Overlap between reports:

| Report | Clicks | Impressions | Note |
| --- | --- | --- | --- |
| Chart, Countries, Devices | 53 | 286 | These three agree exactly; this is the property total |
| Pages (sum of rows) | 60 | 423 | Higher than the total because one search can show several of the site's URLs, and each is counted |
| Queries (sum of rows) | 3 | 91 | Lower because Google hides rare queries |

**Limitation that shapes the whole audit:** the visible queries account for 3 of 53 clicks (5.7%) and 91 of 286 impressions (31.8%). 94.3% of clicks come from queries Google did not disclose.

**Missing data:** the export has no query-by-page pairing, no query-by-date breakdown, and no rich-result data. Why the data starts on 2026-10-25 is not recorded; either the property was added then or the domain had no impressions before.

---

## 3. Google Search Console Data Analysis

### 3.1 Totals (verified)

| Metric | Value |
| --- | --- |
| Period with data | 2026-10-25 to 2026-11-13 (20 days) |
| Clicks | 53 |
| Impressions | 286 |
| CTR | 18.53% |
| Average position (impression-weighted) | 8.50 |

A CTR of 18.5% at an average position of 8.5 is unusual for generic queries. Together with 51 of 60 page-clicks landing on homepage URLs, it is consistent with most clicks coming from people searching for the organization by name. **Potential**, because the queries behind 50 of the 53 clicks are hidden.

### 3.2 Trend (verified)

| Date | Day | Clicks | Impressions | CTR | Position |
| --- | --- | --- | --- | --- | --- |
| 2026-10-25 | Sun | 2 | 13 | 15.38% | 8.8 |
| 2026-10-26 | Mon | 14 | 37 | 37.84% | 3.3 |
| 2026-10-27 | Tue | 7 | 22 | 31.82% | 3.0 |
| 2026-10-28 | Wed | 1 | 31 | 3.23% | 7.2 |
| 2026-10-29 | Thu | 4 | 37 | 10.81% | 10.4 |
| 2026-10-30 | Fri | 3 | 15 | 20.00% | 5.7 |
| 2026-10-31 | Sat | 3 | 19 | 15.79% | 23.4 |
| 2026-11-01 | Sun | 2 | 12 | 16.67% | 26.0 |
| 2026-11-02 | Mon | 8 | 33 | 24.24% | 4.8 |
| 2026-11-03 | Tue | 2 | 9 | 22.22% | 4.7 |
| 2026-11-04 | Wed | 2 | 20 | 10.00% | 8.6 |
| 2026-11-05 | Thu | 1 | 18 | 5.56% | 11.1 |
| 2026-11-06 | Fri | 1 | 2 | 50.00% | 3.5 |
| 2026-11-07 | Sat | 0 | 0 | — | — |
| 2026-11-08 | Sun | 1 | 2 | 50.00% | 37.5 |
| 2026-11-09 | Mon | 1 | 2 | 50.00% | 1.0 |
| 2026-11-10 | Tue | 0 | 1 | 0% | 1.0 |
| 2026-11-11 | Wed | 0 | 5 | 0% | 1.6 |
| 2026-11-12 | Thu | 0 | 3 | 0% | 1.0 |
| 2026-11-13 | Fri | 1 | 5 | 20.00% | 1.8 |

| Period | Days | Clicks | Impressions | Impressions/day | Clicks/day | Position |
| --- | --- | --- | --- | --- | --- | --- |
| A: 10-25 to 11-05 | 12 | 49 | 266 | 22.2 | 4.08 | 8.74 |
| B: 11-06 to 11-13 | 8 | 4 | 20 | 2.5 | 0.50 | 5.25 |
| Change | | | | **−88.7%** | −87.8% | |

**Verified:** 93% of all impressions in the export (266 of 286) happened before 2026-11-06. From 11-09 onward the average position is 1.0–1.8 on 1–5 impressions a day.

**Potential:** the site stopped appearing for non-brand queries on 11-06 and is now shown only for navigational searches. The positions support this, but the export has no query-by-date data to confirm it.

**What the repository says about timing (verified):**

| Date | Event | Source |
| --- | --- | --- |
| 2026-10-20 | First commit; i18n strategy `prefix` (`/uz/...`, `/ru/...`) | `git log` |
| 2026-10-24 | Uzbek copy switched to the new alphabet (ş, ç, ö, ğ) | `docs/INTEGRATION.md:19` |
| 2026-10-25 | First day of Search Console data | `Chart.csv` |
| 2026-11-03 | Sitemap module added | commit `d8b8dd8` |
| 2026-11-05 | Last commit before the drop (footer only) | commit `e0f410f` |
| **2026-11-06** | **Impressions collapse** | `Chart.csv` |
| 2026-11-10 | Strategy changed to `no_prefix`; `/uz` and `/ru` URLs 301 to unprefixed | commit `4e1c893` |

The `no_prefix` commit is four days after the drop began, so the commit alone does not explain the start. A hosting or domain change is one candidate: the README describes a Node server behind nginx, while the live site is on Vercel with `www` as the primary host. The repository does not record when that changed.

**Missing data needed to explain the drop:** the Search Console *Page indexing* report, URL Inspection for `/` and the three product pages, the Vercel deployment and domain history for 11-04 to 11-07, and Search Console *Crawl stats* for the same days.

No seasonal pattern can be read from 20 days of data.

---

## 4. Query Performance Analysis

### 4.1 All visible queries (verified, complete list)

| # | Query | Clicks | Impr. | CTR | Pos. | Class |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | microfinance bank | 1 | 3 | 33.33% | 3.67 | Brand-like |
| 2 | garovsiz mikromoliya tashkiloti | 1 | 1 | 100% | 18 | Generic MFO |
| 3 | mikromoliya | 1 | 1 | 100% | 18 | Generic MFO |
| 4 | community microfinance mikromoliya tashkiloti | 0 | 24 | 0% | 7.04 | Competitor brand |
| 5 | site:facebook.com микрофинансирование | 0 | 6 | 0% | 1 | Irrelevant |
| 6 | biznesni rivojlantirish mikromoliya tashkiloti | 0 | 6 | 0% | 4.83 | Own brand |
| 7 | norasmiy daromad bilan kredit | 0 | 5 | 0% | 26.8 | Microloan |
| 8 | mikrokreditni rasmiylashtirmoq | 0 | 3 | 0% | 16 | Microcredit |
| 9 | mikrokredit rasmiylashtirmoq | 0 | 3 | 0% | 20 | Microcredit |
| 10 | микрозайм для свадьбы | 0 | 3 | 0% | 28.33 | Microloan (RU) |
| 11 | mikrokreditlar | 0 | 3 | 0% | 47.67 | Microcredit |
| 12 | mikrofinance | 0 | 2 | 0% | 1 | Own brand |
| 13 | site:instagram.com микрофинансирование | 0 | 2 | 0% | 1 | Irrelevant |
| 14 | микрокредит | 0 | 2 | 0% | 6.5 | Microcredit (RU) |
| 15 | микрофинансирование | 0 | 2 | 0% | 7 | Generic MFO (RU) |
| 16 | zaymly mikromoliya | 0 | 2 | 0% | 9 | Competitor brand |
| 17 | mikromoliya tashkiloti | 0 | 2 | 0% | 10 | **Primary keyword** |
| 18 | asr mikromoliya tashkiloti | 0 | 2 | 0% | 13 | Competitor brand |
| 19 | mikrozaym rasmiylashtirish | 0 | 2 | 0% | 82 | Microloan |
| 20 | microfinance service | 0 | 1 | 0% | 1 | Brand-like |
| 21 | shu emasmi | 0 | 1 | 0% | 1 | Irrelevant |
| 22 | community microfinance | 0 | 1 | 0% | 4 | Competitor brand |
| 23 | mikro moliya tashkiloti | 0 | 1 | 0% | 4 | Generic MFO |
| 24 | mikrafin | 0 | 1 | 0% | 6 | Own brand (misspelling) |
| 25 | microfin | 0 | 1 | 0% | 8 | Own brand (partial) |
| 26 | микромолия банк | 0 | 1 | 0% | 8 | Generic MFO (Cyrillic UZ) |
| 27 | dengi vpered mikromoliya tashkiloti | 0 | 1 | 0% | 10 | Competitor brand |
| 28 | микрокредит юр лиц | 0 | 1 | 0% | 10 | Microcredit (RU) |
| 29 | микрозайм до 20 миллионов сумов | 0 | 1 | 0% | 11 | Microloan (RU) |
| 30 | mikromoliya tashkiloti online | 0 | 1 | 0% | 20 | Generic MFO |
| 31 | sayohatlar uchun kredit | 0 | 1 | 0% | 23 | Microloan |
| 32 | mikroqarzni rasmiylashtirmoq | 0 | 1 | 0% | 25 | Microloan |
| 33 | tezda qarzga mikroqarz olish | 0 | 1 | 0% | 25 | Microloan |
| 34 | sayohatlar uchun mikroqarz | 0 | 1 | 0% | 26 | Microloan |
| 35 | iste’mol mikroqarzlari | 0 | 1 | 0% | 31 | Microloan |
| 36 | biznes uchun kredit olish uchun ariza topshirish | 0 | 1 | 0% | 70 | Informational |

### 4.2 By class (verified)

| Class | Queries | Clicks | Impr. | CTR | Weighted pos. |
| --- | --- | --- | --- | --- | --- |
| Own brand and brand-like | 6 | 1 | 14 | 7.14% | 4.07 |
| Non-brand, relevant | 22 | 2 | 38 | 5.26% | 25.53 |
| Competitor brand | 5 | 0 | 30 | 0% | 7.57 |
| Irrelevant (`site:` operators, "shu emasmi") | 3 | 0 | 9 | 0% | 1.00 |

| Position band | Queries | Clicks | Impr. |
| --- | --- | --- | --- |
| 1–3 | 5 | 0 | 12 |
| 4–10 | 14 | 1 | 48 |
| 10–20 | 7 | 2 | 12 |
| Over 20 | 10 | 0 | 19 |

| Script | Queries | Clicks | Impr. | Weighted pos. |
| --- | --- | --- | --- | --- |
| Latin | 28 | 3 | 73 | 15.26 |
| Cyrillic | 8 | 0 | 18 | 8.28 |

### 4.3 Findings

1. **The largest visible query belongs to a competitor (verified).** "community microfinance mikromoliya tashkiloti" has 24 impressions at position 7.04 and no clicks. With "asr", "dengi vpered" and "zaymly", competitor names account for 30 of the 91 visible impressions. These are people looking for another organization. They are not ranking opportunities.
2. **The organization does not rank first for its own name (verified).** "biznesni rivojlantirish mikromoliya tashkiloti" averages position 4.83 over 6 impressions with 0 clicks. The string "Biznesni rivojlantirish" appears 0 times in the rendered text of the homepage; the page says "Biznesni Rivojlantiriş".
3. **Non-brand relevant queries rank on page three (verified).** Weighted position 25.53 across 22 queries. Microloan terms average 36.70 (7 queries, 10 impressions) and microcredit terms 22.83 (5 queries, 12 impressions).
4. **Murobaha has no data (verified).** No query contains "murobaha", "мурабаха" or "islom". The site has no Murobaha page.
5. **Every Latin query uses the `sh`/`ch` spelling (verified).** "tashkiloti", "rasmiylashtirmoq", "uchun", "iste’mol". No query in the export contains ş, ç, ö or ğ.
6. **Several queries match content the current site does not have (verified against the source).** "sayohatlar uchun kredit", "микрозайм для свадьбы", "iste’mol mikroqarzlari" and "norasmiy daromad bilan kredit" have no matching text in `i18n/locales/uz.json` or `ru.json` outside the keywords meta tag. **Potential:** these impressions come from the previous site's content still held in Google's index; the export cannot tell.
7. **The "rasmiylashtirmoq" queries match only new-alphabet text (verified).** Rows 8, 9, 19 and 32 use "rasmiylashtir…". The homepage contains "rasmiylaşt…" three times and "rasmiylasht…" zero times; product pages contain neither. The site was still shown for these queries at positions 16–25. This is a hint that Google can connect the two spellings, but four low-volume queries do not settle it (see 11.3).

### 4.4 The requested lists

| Request | Result |
| --- | --- |
| High impressions, low CTR | Only one visible query has more than 6 impressions: the competitor query in row 4. No own-keyword query qualifies. |
| Good impressions, poor position | None with meaningful volume. Largest: "norasmiy daromad bilan kredit" (5 impr., pos. 26.8), "mikrokreditlar" (3, 47.67), "микрозайм для свадьбы" (3, 28.33). |
| Position 4–20, relevant, not a competitor | Rows 2, 3, 6, 8, 9, 14, 15, 17, 23–26, 28, 29, 30. Combined: 2 clicks, 27 impressions. |
| Clicks but low impressions | Rows 1–3: 3 clicks on 5 impressions. |
| Visible, no clicks | 33 of 36 queries, 86 impressions. |
| Irrelevant | Rows 5, 13, 21, plus the five competitor-brand queries. |

**Caution:** every relevant query has between 1 and 6 impressions. These numbers show which topics Google associates with the site. They do not measure demand, and a position averaged over one or two impressions is not stable.

---

## 5. Page Performance Analysis

### 5.1 All pages, with today's HTTP behaviour (verified)

"Today" was measured with `curl` on 2026-11-16 using a Googlebot user agent.

| # | URL in Search Console | Clicks | Impr. | CTR | Pos. | Today |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | `https://microfinance.uz/` | 26 | 109 | 23.85% | 5.40 | 308 → `www` (1 hop) |
| 2 | `https://microfinance.uz/uz` | 20 | 124 | 16.13% | 9.60 | 308 → 301 → `www/` (2 hops) |
| 3 | `http://www.microfinance.uz/kredit/istemol` | 7 | 30 | 23.33% | 5.47 | 308 → 301 → `/kredit/mikroqarz` (2 hops) |
| 4 | `https://www.microfinance.uz/` | 3 | 24 | 12.50% | 3.88 | **200** |
| 5 | `https://www.microfinance.uz/ru` | 2 | 32 | 6.25% | 2.53 | 301 → `/`, served in Uzbek |
| 6 | `https://microfinance.uz/uz/kredit/mikrokredit` | 1 | 17 | 5.88% | 16.12 | 2 hops |
| 7 | `https://microfinance.uz/ru/kredit/mikroqarz` | 1 | 14 | 7.14% | 3.57 | 2 hops, served in Uzbek |
| 8 | `https://www.microfinance.uz/ru/kredit/mikrokredit` | 0 | 26 | 0% | 4.58 | 301, served in Uzbek |
| 9 | `https://www.microfinance.uz/ru/kredit/mikroqarz` | 0 | 9 | 0% | 12.11 | 301, served in Uzbek |
| 10 | `https://microfinance.uz/ru/kredit/garov-asosida-mikroqarz` | 0 | 8 | 0% | 6.00 | 2 hops, served in Uzbek |
| 11 | `https://www.microfinance.uz/ru/kredit/garov-asosida-mikroqarz` | 0 | 6 | 0% | 5.33 | 301, served in Uzbek |
| 12 | `https://www.microfinance.uz/uz/kredit/mikrokredit` | 0 | 6 | 0% | 23.67 | 301 |
| 13 | `https://microfinance.uz/uz/kredit/garov-asosida-mikroqarz` | 0 | 5 | 0% | 8.20 | 2 hops |
| 14 | `http://microfinance.uz/` | 0 | 4 | 0% | 1.50 | 2 hops |
| 15 | `https://microfinance.uz/uz/kredit/mikroqarz` | 0 | 3 | 0% | 5.67 | 2 hops |
| 16 | `http://mail.microfinance.uz/` | 0 | 2 | 0% | 1.00 | 301 → webmail login (not this project) |
| 17 | `https://microfinance.uz/ru` | 0 | 2 | 0% | 3.00 | 2 hops, served in Uzbek |
| 18 | `https://www.microfinance.uz/uz/kredit/garov-asosida-mikroqarz` | 0 | 1 | 0% | 1.00 | 301 |
| 19 | `https://www.microfinance.uz/uz` | 0 | 1 | 0% | 48.00 | 301 |

**Verified:** only row 4 is a URL that returns `200` today. It has 24 of the 423 page impressions. The other 18 rows, with 399 impressions (94.3%) and 57 of 60 clicks, are URLs that now redirect.

### 5.2 The same data grouped by real page (verified)

| Logical page | URL variants | Clicks | Impr. | CTR | Weighted pos. | Source file |
| --- | --- | --- | --- | --- | --- | --- |
| Homepage `/` | 7 | 51 | 296 | 17.23% | 6.80 | `app/pages/index.vue` |
| `/kredit/mikrokredit` | 3 | 1 | 49 | 2.04% | 10.92 | `app/pages/kredit/[slug].vue` |
| `/kredit/istemol` (old) | 1 | 7 | 30 | 23.33% | 5.47 | Redirect rule, `nuxt.config.ts:80` |
| `/kredit/mikroqarz` | 3 | 1 | 26 | 3.85% | 6.77 | `app/pages/kredit/[slug].vue` |
| `/kredit/garov-asosida-mikroqarz` | 4 | 0 | 20 | 0% | 6.10 | `app/pages/kredit/[slug].vue` |
| `mail.microfinance.uz` | 1 | 0 | 2 | 0% | 1.00 | **Not in this repository** |

| Host | Rows | Clicks | Impr. | CTR | Weighted pos. |
| --- | --- | --- | --- | --- | --- |
| `microfinance.uz` | 9 | 48 | 286 | 16.78% | 7.77 |
| `www.microfinance.uz` | 9 | 12 | 135 | 8.89% | 5.85 |
| `mail.microfinance.uz` | 1 | 0 | 2 | 0% | 1.00 |

| Language prefix in URL | Rows | Clicks | Impr. | CTR | Weighted pos. |
| --- | --- | --- | --- | --- | --- |
| None (includes the old `/kredit/istemol` URL and the mail host) | 5 | 36 | 169 | 21.30% | 5.05 |
| `/uz` | 7 | 21 | 157 | 13.38% | 10.91 |
| `/ru` | 7 | 3 | 97 | 3.09% | 4.59 |

### 5.3 Findings

- **Best-performing page (verified):** the homepage, with 51 of 60 page-clicks across seven URL variants.
- **High impressions, low CTR (verified):** the Russian URLs. 97 impressions at position 4.59, CTR 3.09%. `/ru/kredit/mikrokredit` on `www` had 26 impressions at position 4.58 and no clicks.
- **Poor position (verified):** Uzbek microcredit URLs, weighted position 18.09 across 23 impressions. The Russian version of the same page averaged 4.58.
- **No organic clicks (verified):** `/kredit/garov-asosida-mikroqarz` in every variant: 20 impressions, 0 clicks.
- **Old consumer-loan URL still earned clicks (verified):** `http://www.microfinance.uz/kredit/istemol` had 7 clicks. It redirects correctly to `/kredit/mikroqarz`.
- **Competing URLs (verified):** see section 9. Each real page was indexed under three to seven URLs.
- **Pages needing internal links and content:** see sections 10.7 and 11.

**Missing data:** the export does not say which queries led to which page, so query-level diagnosis per URL is not possible.

---

## 6. Device and Country Analysis

### 6.1 Devices (verified)

| Device | Clicks | Share of clicks | Impr. | Share of impr. | CTR | Pos. |
| --- | --- | --- | --- | --- | --- | --- |
| Desktop | 32 | 60.4% | 130 | 45.5% | 24.62% | 8.82 |
| Mobile | 20 | 37.7% | 155 | 54.2% | 12.90% | 8.28 |
| Tablet | 1 | 1.9% | 1 | 0.3% | 100% | 2.00 |

Mobile has the larger share of impressions and a slightly better position, yet about half the CTR of desktop. The sample is small (20 mobile clicks). **Potential causes:** a different query mix on mobile, or a long title that truncates. The homepage title is 64 characters. **Missing data:** a device-by-query export, and Core Web Vitals. No page-speed or Core Web Vitals figures are claimed in this report.

### 6.2 Countries (verified)

| Country | Clicks | Impr. | CTR | Pos. |
| --- | --- | --- | --- | --- |
| Uzbekistan | 52 | 277 | 18.77% | 8.56 |
| Poland | 1 | 3 | 33.33% | 5 |
| Russia | 0 | 3 | 0% | 9 |
| Azerbaijan | 0 | 1 | 0% | 2 |
| Montenegro | 0 | 1 | 0% | 8 |
| Vietnam | 0 | 1 | 0% | 9 |

Uzbekistan accounts for 96.9% of impressions and 98.1% of clicks. The audience is domestic; no international targeting is needed.

---

## 7. Primary Keyword Analysis — "Mikromoliya tashkiloti"

### 7.1 Search Console (verified)

| Query | Clicks | Impr. | CTR | Pos. |
| --- | --- | --- | --- | --- |
| **mikromoliya tashkiloti** | **0** | **2** | **0%** | **10** |
| mikro moliya tashkiloti | 0 | 1 | 0% | 4 |
| garovsiz mikromoliya tashkiloti | 1 | 1 | 100% | 18 |
| mikromoliya tashkiloti online | 0 | 1 | 0% | 20 |
| mikromoliya | 1 | 1 | 100% | 18 |
| микромолия банк | 0 | 1 | 0% | 8 |
| biznesni rivojlantirish mikromoliya tashkiloti (own name) | 0 | 6 | 0% | 4.83 |
| "mikromoliya tashkilotlari" (plural) | — | — | — | Not in the export |

Eight visible queries contain "mikromoliya tashkilot…", with 38 impressions in total. 27 of those are competitor names, 6 are the organization's own name, and 5 are generic. For the exact primary keyword the site was shown twice in 20 days, at the bottom of page one, with no click.

### 7.2 Where the keyword appears on the site (verified on the live HTML)

| Location | Content | "mikromoliya tashkiloti" present? |
| --- | --- | --- |
| `<title>` of `/` | Microfinance.uz — «Biznesni Rivojlantiriş Mikromoliya Taşkiloti» | No (`ş` spelling, inside the legal name) |
| Meta description of `/` | Garov asosida mikroqarz va mikrokreditlar: 300 mln sömgaça… | No |
| H1 of `/` | Biz bilan biznesingizni rivojlantiring | No |
| Any H2 or H3 of `/` | — | No |
| Body text of `/` (611 words) | "Mikromoliya Taşkiloti" twice, both in the logo tagline | No |
| Meta keywords of `/` | 130 phrases | Yes, the only occurrence |
| Product pages | Logo tagline only | No |

Source: `i18n/locales/uz.json:155-166` (title, description, hero), `app/components/home/HomeHero.vue:42-46` (H1), `app/components/app/AppLogo.vue:32` (tagline).

### 7.3 Why the site does not rank for it

1. **No page targets it (verified).** No title, H1, heading or paragraph is written around "mikromoliya tashkiloti". The phrase exists only as part of the legal name, and only in a spelling nobody typed in this export.
2. **No content answers it (verified).** Someone searching "mikromoliya tashkiloti" wants to know who the organization is, whether it is licensed, where it is and what it offers. The homepage has no text about the organization. There is no company page.
3. **Signals are split across hosts and URL schemes (verified).** See sections 9 and 10.
4. **The domain's search history is three weeks long (verified from the export; cause unknown).**
5. **Spelling (potential).** `docs/SEO-KALIT-SOZLAR.md:11` states that Google connects the new alphabet with the old one. Nothing in the export proves or disproves that. What is verified is that the searched spelling is absent from the rendered text, and that the site does not rank first for its own name in that spelling.

**Missing data:** who ranks above the site for this keyword, and with what kind of page. That needs a live results check from Uzbekistan, which this audit did not perform.

---

## 8. Keyword-to-URL Mapping

The export has no query-by-page pairing, so "Target URL" is the page that **should** rank, chosen from the page's content. Paths marked *(new)* do not exist. All metrics are from `Queries.csv`.

### 8.1 Mapping table

| Search query | Target URL | Clicks | Impr. | CTR | Pos. | Current SEO problem | Recommended action |
| --- | --- | --- | --- | --- | --- | --- | --- |
| mikromoliya tashkiloti | `/` | 0 | 2 | 0% | 10 | Phrase absent from title, H1 and body | Rewrite title and H1 around the phrase; add an "about the organization" block |
| mikro moliya tashkiloti | `/` | 0 | 1 | 0% | 4 | Same | Same page; no separate targeting |
| mikromoliya tashkiloti online | `/` | 0 | 1 | 0% | 20 | Online application exists but is not described in text | Mention the online application in the intro and link `#application` |
| garovsiz mikromoliya tashkiloti | `/kredit/mikroqarz` | 1 | 1 | 100% | 18 | Page is thin; H1 is one word | Expand content; put "garovsiz" in the H1 or first paragraph |
| mikromoliya | `/` | 1 | 1 | 100% | 18 | Same as primary | Covered by the homepage work |
| biznesni rivojlantirish mikromoliya tashkiloti | `/` and `/tashkilot-haqida` *(new)* | 0 | 6 | 0% | 4.83 | Name never appears in the searched spelling; no company page | Company page with legal details; name in searched spelling in title and JSON-LD |
| mikrofinance / mikrafin / microfin | `/` | 0 | 4 | 0% | 1–8 | None significant | No action; brand spelling variants |
| microfinance bank / microfinance service | `/` | 1 | 4 | 25% | 1–3.67 | Ambiguous intent | No action |
| mikrokreditni rasmiylashtirmoq | `/kredit/mikrokredit` | 0 | 3 | 0% | 16 | No text on how the microcredit is arranged; the process block is generic | Add a product-specific "how to apply" section |
| mikrokredit rasmiylashtirmoq | `/kredit/mikrokredit` | 0 | 3 | 0% | 20 | Same | Same |
| mikrokreditlar | `/kredit/mikrokredit` | 0 | 3 | 0% | 47.67 | Thin page; weak internal links | Expand; link from header navigation |
| biznes uchun kredit olish uchun ariza topshirish | `/kredit/mikrokredit` | 0 | 1 | 0% | 70 | No apply call-to-action in the page body | Add a link to the application form |
| mikroqarzni rasmiylashtirmoq | `/kredit/mikroqarz` | 0 | 1 | 0% | 25 | Same as microcredit | Product-specific "how to apply" section |
| mikrozaym rasmiylashtirish | `/kredit/mikroqarz` | 0 | 2 | 0% | 82 | Same | Same |
| tezda qarzga mikroqarz olish | `/kredit/mikroqarz` | 0 | 1 | 0% | 25 | Processing time is stated only in the homepage FAQ | State the confirmed processing time on the page |
| iste’mol mikroqarzlari | `/kredit/mikroqarz` | 0 | 1 | 0% | 31 | "isteʼmol" appears only in meta keywords | Mention consumer purposes in body text, once confirmed |
| sayohatlar uchun kredit / mikroqarz | `/kredit/mikroqarz` | 0 | 2 | 0% | 23–26 | No content about loan purposes | Add only if the organization confirms these purposes |
| norasmiy daromad bilan kredit | `/kredit/garov-asosida-mikroqarz` | 0 | 5 | 0% | 26.8 | Page does not say whether income proof is needed | **Confirm with the organization first**; the documents list for this product has no income document (`shared/products.ts:88`) |
| микрокредит | `/ru/kredit/mikrokredit` *(removed 11-10)* | 0 | 2 | 0% | 6.5 | Russian page no longer reachable by Google | Restore Russian URLs |
| микрокредит юр лиц | `/ru/kredit/mikrokredit` *(removed)* | 0 | 1 | 0% | 10 | Product is described for self-employed individuals, not legal entities | Restore Russian URL; state eligibility clearly |
| микрозайм до 20 миллионов сумов | `/ru/kredit/mikroqarz` *(removed)* | 0 | 1 | 0% | 11 | Russian page not reachable | Restore Russian URLs |
| микрозайм для свадьбы | `/ru/kredit/mikroqarz` *(removed)* | 0 | 3 | 0% | 28.33 | Not reachable; no purpose content | Restore; add purposes only if confirmed |
| микрофинансирование | `/ru/` *(removed)* | 0 | 2 | 0% | 7 | Russian homepage not reachable | Restore Russian URLs |
| микромолия банк | `/` | 0 | 1 | 0% | 8 | Uzbek Cyrillic; no Cyrillic Uzbek content | No action now |
| community microfinance…, asr…, dengi vpered…, zaymly… | none | 0 | 30 | 0% | 4–13 | Competitor names | **Do not target** |
| site:facebook.com…, site:instagram.com…, shu emasmi | none | 0 | 9 | 0% | 1 | Irrelevant | Ignore |

### 8.2 Keyword groups and owning pages

Queries from the export come first. Phrases marked † are from `docs/SEO-KALIT-SOZLAR.md` and have no Search Console data; no volume is claimed for them.

| Group | Keywords | Owning page | Status |
| --- | --- | --- | --- |
| Brand | biznesni rivojlantirish mikromoliya tashkiloti, mikrofinance, microfin, mikrafin | `/` and company page *(new)* | Homepage exists; company page missing |
| General microfinance | **mikromoliya tashkiloti**, mikro moliya tashkiloti, mikromoliya, mikromoliya tashkiloti online, mikromoliya tashkilotlari † | `/` | Exists; not optimized |
| Microloan | garovsiz mikromoliya tashkiloti, mikroqarzni rasmiylashtirmoq, mikrozaym rasmiylashtirish, tezda qarzga mikroqarz olish, iste’mol mikroqarzlari, mikroqarz † | `/kredit/mikroqarz` | Exists; thin |
| Secured microloan | norasmiy daromad bilan kredit, garov asosida kredit †, mashina / tilla / uy garoviga kredit † | `/kredit/garov-asosida-mikroqarz` | Exists; thin; 0 clicks |
| Microcredit | mikrokreditlar, mikrokredit(ni) rasmiylashtirmoq, biznes uchun kredit…, mikrokredit † | `/kredit/mikrokredit` | Exists; thin |
| Islamic financing | murobaha †, islomiy moliya † | `/murobaha` *(new, only when the product launches)* | No page; no data |
| Local | Toshkentda kredit †, Samarqandda kredit † and the other branch cities | Branch pages *(new)* | Missing; branch data exists in `shared/branches.ts` |
| Informational | kredit olish uchun hujjatlar †, kredit kalkulyatori †, "rasmiylashtirmoq" queries | FAQ or guide pages *(new)* | Only four FAQ items on the homepage |
| Russian (all groups) | микрокредит, микрофинансирование, микрозайм… | `/ru/…` | Removed on 11-10 |

### 8.3 Answers to the five questions

1. **Page for the primary keyword:** the homepage. No separate landing page; a second page for the same phrase would compete with it.
2. **Secondary keywords:** one product page per product, as in the table above.
3. **Competition between pages:** yes, at URL level (section 9).
4. **New landing pages needed:** a company and licence page, branch pages, and a Murobaha page once the product is live. Collateral-type pages (car, gold, property) are optional and should follow, not precede, the fixes above.
5. **Existing pages to optimize:** all four, the homepage first.

---

## 9. Keyword Cannibalization

### 9.1 URL-level duplication (verified)

This is the cannibalization the data shows. The same page competed with copies of itself.

| Real page | URLs indexed for it | Variants seen |
| --- | --- | --- |
| Homepage | 7 | `https://` apex, `http://` apex, `https://www`, apex `/uz`, `www` `/uz`, apex `/ru`, `www` `/ru` |
| `/kredit/garov-asosida-mikroqarz` | 4 | apex and `www`, each with `/uz` and `/ru` |
| `/kredit/mikrokredit` | 3 | apex `/uz`, `www` `/uz`, `www` `/ru` |
| `/kredit/mikroqarz` | 3 | apex `/uz`, apex `/ru`, `www` `/ru` |

Page rows sum to 423 impressions against a property total of 286. The difference of 137 means Google often showed two or more of the site's URLs for the same search.

The Uzbek/Russian pairs under the old `prefix` strategy were legitimate translations. The host duplicates (`www` against apex, `http` against `https`) were not: each split one page's signals in two.

### 9.2 Three URL schemes in three weeks (verified)

| Scheme | Example | In use |
| --- | --- | --- |
| Previous site | `/kredit/istemol` | Before the rebuild |
| `prefix` | `/uz/kredit/mikroqarz`, `/ru/kredit/mikroqarz` | 2026-10-20 to 2026-11-10 |
| `no_prefix` | `/kredit/mikroqarz` | Since 2026-11-10 |

Each change asks Google to re-evaluate every URL. On a three-week-old search history this delays stable rankings.

### 9.3 Keyword-level overlap in the code (potential)

No query-by-page data exists to confirm any of these. They are risks visible in the source.

| Overlap | Evidence |
| --- | --- |
| `/kredit/mikroqarz` and `/kredit/garov-asosida-mikroqarz` both target "mikroqarz" | Shared keyword phrases in `uz.json:115` and `uz.json:122`; the H1 of the first is the bare word "Mikroqarz" |
| `/kredit/garov-asosida-mikroqarz` and `/kredit/mikrokredit` both target collateral phrases | Same collateral phrases in `uz.json:122` and `uz.json:129`; identical collateral list in `products.ts:87,101` |
| Homepage keywords tag lists every product and city phrase | `uz.json:157`, 130 phrases |
| Two homepage sections have the same H2, "Kreditni hisoblang" | `uz.json:169` and `uz.json:193` |

**Recommendation:** give the two microloan pages distinct H1s and intros ("garovsiz" against "garov asosida"), and keep collateral detail on the secured-microloan page.

---

## 10. Nuxt.js Technical SEO Audit

### 10.1 Stack (verified)

| Item | Value |
| --- | --- |
| Nuxt | 4.6.2, SSR (no prerendering, no ISR) |
| Vue | 3.5.44 |
| `@nuxtjs/i18n` | 10.6.0, strategy `no_prefix` |
| `@nuxtjs/sitemap` | 9.1.0 |
| `@nuxt/image` | 2.1.0 (Vercel image optimizer in production) |
| `@nuxt/ui` | 4.12.0 |
| Hosting | Vercel (`Server: Vercel`); `www.microfinance.uz` is the primary host |
| Routes | `/` (`app/pages/index.vue`) and `/kredit/:slug` (`app/pages/kredit/[slug].vue`) with three slugs |

### 10.2 Server-rendered HTML (verified)

The initial HTML response contains the title, meta tags, H1–H3, product terms, calculator values, all four FAQ answers and all eight branch cards. Lazy hydration (`index.vue:35-39`) does not remove content from the HTML. The FAQ keeps collapsed answers in the DOM (`HomeFaq.vue:31`).

Two things are **not** in the HTML:

- The map (`<ClientOnly>`, `HomeContact.vue:125`). This is correct.
- The two microloan cards inside the "Mikroqarz" modal (`HomeOffers.vue:71-82`). As a result the homepage body has no link to `/kredit/mikroqarz` or `/kredit/garov-asosida-mikroqarz`; only the footer links to them.

### 10.3 Host and canonical — CRITICAL (verified)

| Signal | Value on the live site | Problem |
| --- | --- | --- |
| Serving host | `https://www.microfinance.uz/` returns 200 | — |
| Apex | `https://microfinance.uz/*` returns 308 → `www` | — |
| `<link rel="canonical">` | `https://microfinance.uz` and `https://microfinance.uz/kredit/…` | Points at a redirecting URL |
| `og:url` | Same as canonical | Same |
| `sitemap.xml` | All four `<loc>` values on the apex host | Every submitted URL is a redirect |
| `robots.txt` | `Sitemap: https://microfinance.uz/sitemap.xml` | Redirects |
| JSON-LD `url`, `@id`, breadcrumb `item` | Apex host | Redirect |

Source: `nuxt.config.ts:4` (`SITE_URL`), `:89` (`site.url`), `:99` (`i18n.baseUrl`), `public/robots.txt:4`, `.env.example:1-2`.

A canonical that points to a redirect which points back to the page is a contradictory signal. Google may ignore the canonical and choose its own. Search Console will report the sitemap URLs as "Page with redirect".

**Recommendation:** choose one host and make every layer agree. Making the apex primary in Vercel (so `www` redirects to it) needs no code change and matches the brand name, the code, and the host with more impressions in the export (286 against 135). The alternative is to change `SITE_URL`, `i18n.baseUrl`, `robots.txt` and the environment variables to `www`. This is the owner's decision.

### 10.4 Redirects (verified)

| Start URL | Hops | Final URL |
| --- | --- | --- |
| `https://microfinance.uz/` | 1 | `https://www.microfinance.uz/` |
| `http://microfinance.uz/` | 2 | same |
| `https://microfinance.uz/uz` | 2 | `https://www.microfinance.uz/` |
| `https://microfinance.uz/ru/kredit/mikroqarz` | 2 | `https://www.microfinance.uz/kredit/mikroqarz` |
| `http://microfinance.uz/ru/kredit/mikroqarz` | 3 | same |
| `http://www.microfinance.uz/kredit/istemol` | 2 | `https://www.microfinance.uz/kredit/mikroqarz` |

There are no loops and every chain ends in `200`. The chains are longer than needed because the host redirect and the path redirect are separate steps. Fixing the host (10.3) removes one hop from most of them.

### 10.5 Language handling — CRITICAL (verified)

See section 13 for the full assessment. In short: one URL serves two languages, Googlebot gets Uzbek, there are no `hreflang` tags, and the language switcher is a pair of `<button>` elements (`AppLanguageSwitcher.vue:16-24`) with no crawlable link.

### 10.6 Head tags

| Element | Finding | Status |
| --- | --- | --- |
| `useSeoMeta` / `useHead` | Centralised in `app/composables/seo.ts`; used by both pages and `error.vue` | Verified, sound |
| Titles | Unique per page. Homepage: brand and legal name only (64 characters). Products: 55, 70 and 73 characters in Uzbek, for example "Mikroqarz — 50 mln sömgaça, 36 oygaça — Microfinance.uz" | Verified; homepage title carries no keyword; the two longest product titles may be cut short in results |
| Descriptions | Unique per page, 136–155 characters in Uzbek and 121–141 in the Russian pages checked, built from product data | Verified, sound |
| Meta keywords | Homepage: 130 phrases, 2,723 characters. Products: 16–19 phrases | Verified. Google ignores the tag; the project's own guide says 15–25 phrases and warns that stuffing can be treated as spam by Yandex (`docs/SEO-KALIT-SOZLAR.md:9`) |
| Open Graph | Complete; one shared image (`/og-image.jpg`, 200 OK) | Verified; URLs on the wrong host |
| Twitter | `summary_large_image`, title, description, image | Verified, sound |
| `<html lang>` | `uz-UZ` or `ru-RU`, matches the served language | Verified, sound |
| `hreflang` | None | Verified, missing |
| Robots meta | Absent on normal pages (indexable); `noindex, follow` on error pages | Verified, sound |
| Duplicate metadata | None between pages | Verified |

### 10.7 Internal linking (verified from the live HTML)

| Page | Links to `/kredit/mikroqarz` | to `/kredit/garov-…` | to `/kredit/mikrokredit` |
| --- | --- | --- | --- |
| Homepage | 1 (footer) | 1 (footer) | 2 (offer card, footer) |
| Each product page | 1 (footer) | 1 (footer) | 1 (footer) |

- The header navigation has no link to any product page; all five items are homepage anchors (`AppHeader.vue:12-17`).
- Product pages do not link to each other in the body, and their main button is a `tel:` link (`[slug].vue:78-84`). No body link leads to the application form or the calculator.
- The Murobaha card is a button that shows a "coming soon" toast (`HomeOffers.vue:13-21`). It leads nowhere.
- Every page footer has a followed link labelled "Islomiy moliyalaştiriş" to `https://brb-marketplace.vercel.app/uz`, a `vercel.app` domain (`shared/company.ts:64-67`).
- No broken internal links were found.

### 10.8 Other checks

| Check | Result | Status |
| --- | --- | --- |
| `robots.txt` | Allows everything; sitemap line on the wrong host | Verified |
| `sitemap.xml` | 4 URLs, all redirecting; no `lastmod`; no language alternates | Verified |
| 404 handling | Unknown paths return a real `404` with `noindex` (`error.vue:16-19`, `[slug].vue:16-18`) | Verified, sound |
| 404 page canonical | Canonical and `og:url` point at the non-existent URL | Verified, minor |
| Trailing slash | `/kredit/mikroqarz/` returns 200 with a canonical to the non-slash URL | Verified, acceptable |
| Query strings | `/?utm_source=test` canonicalises to the clean URL | Verified, sound |
| Case | `/Kredit/Mikroqarz` returns 404 | Verified, acceptable |
| Compression | Brotli | Verified |
| Caching | `Cache-Control: public, max-age=0, must-revalidate`; `X-Vercel-Cache: MISS`; every request is rendered | Verified |
| Response varies by language without `Vary` | No `Vary: Accept-Language` or `Vary: Cookie`; `Set-Cookie: i18n_locale` on every response | Verified |
| Server response time | 0.56–0.86 s to first byte in six requests from one location | Indicative only; not a Core Web Vitals measurement |
| Images | Hero preloaded with `fetchpriority="high"`, explicit sizes, WebP; other images lazy | Verified, sound |
| Image `alt` | Hero has descriptive alt text. Product card images, the form background and the branch photo have empty `alt` (decorative) | Verified; acceptable for accessibility, no image-search value |
| Third-party scripts | Jivo chat only. No analytics of any kind | Verified |
| Verification tags | Yandex only | Verified |
| `mail.microfinance.uz` | Webmail login on a separate nginx server, sends `X-Robots-Tag: none` | Verified; will leave the index by itself |
| Security headers | HSTS, `nosniff`, frame and referrer policies present | Verified, sound |

---

## 11. On-page SEO Audit

### 11.1 Homepage — `app/pages/index.vue` (verified on the live HTML)

| Element | Current | Problem |
| --- | --- | --- |
| Title | Microfinance.uz — «Biznesni Rivojlantiriş Mikromoliya Taşkiloti» | No service keyword; searched spelling absent |
| Description | Garov asosida mikroqarz va mikrokreditlar: 300 mln sömgaça, 60 oygaça. Yillik foiz stavkasi 45% dan. Toşkent, işonç telefoni +998 71 202 75 75. | Omits the unsecured microloan; does not say what the organization is |
| H1 | Biz bilan biznesingizni rivojlantiring | Slogan; no keyword; speaks only to businesses though two of three products are for individuals |
| H2 | Kreditni hisoblang (twice), Murojaatdan şartnomagaça — tört bosqiç, Moliyaviy maqsadlaringizga bir qadam yaqinroq, Köp söraladigan savollar, Biz bilan boğlaning (screen-reader only), then three footer headings | Duplicate H2; no H2 names a service or the organization |
| Text | 611 words, mostly labels, form fields and eight repeated branch cards | No paragraph describes the organization |
| FAQ | Four questions; two answers are a single short sentence | Too little to match informational searches |
| Structured data | `Organization`, `WebSite` | See section 14 |

### 11.2 Product pages — `app/pages/kredit/[slug].vue` (verified)

| Page | Title | H1 | Words | Structured data |
| --- | --- | --- | --- | --- |
| `/kredit/mikroqarz` | Mikroqarz — 50 mln sömgaça, 36 oygaça — Microfinance.uz | Mikroqarz | 268 | `BreadcrumbList` |
| `/kredit/garov-asosida-mikroqarz` | Garov asosida mikroqarz — 100 mln sömgaça, 36 oygaça — Microfinance.uz | Garov asosida mikroqarz | 275 | `BreadcrumbList` |
| `/kredit/mikrokredit` | Mikrokredit — 100 mln sömdan 300 mln sömgaça, 60 oygaça — Microfinance.uz | Mikrokredit | 277 | `BreadcrumbList` |

Word counts include the header, the footer and the four-step process block, which are identical on all three pages. The content unique to each page is the one-sentence summary, the terms table and the documents list.

**Bug, verified on the live site:** the secondary button under the H1 displays the raw key `products.mikroqarz.processButton` (and the equivalent on the other two pages). `processButton` is defined in `ru.json:113,121,129` and is missing from `uz.json:110-130`. It is used at `[slug].vue:83`. Uzbek is the default language and the version Google indexes.

Other gaps on product pages: no FAQ, no calculator, no link to the application form, no eligibility requirements, no explanation of how the rate is determined beyond the range, no product-specific process.

### 11.3 Spelling of Uzbek text (verified fact, potential impact)

All Uzbek copy uses the new alphabet (`docs/INTEGRATION.md:19-22`). Counts in the rendered homepage text:

| Searched form | Occurrences | Form on the page | Occurrences |
| --- | --- | --- | --- |
| mikromoliya tashkiloti | 0 | mikromoliya taşkiloti | 2 |
| Biznesni rivojlantirish | 0 | Biznesni Rivojlantiriş | 2 |
| Toshkent | 0 | Toşkent | 6 |

Words without the affected letters are unaffected: "mikroqarz" (10), "mikrokredit" (6), "kredit", "garov". The impact falls on "tashkiloti", "Toshkent", "uchun", "olish", "so'm", "ko'chmas", which are parts of most of the target phrases.

The evidence points both ways. The site was shown for "rasmiylashtirmoq" queries while containing only "rasmiylaşt…" (section 4.3, item 7), which suggests Google can connect the spellings. It also ranks 4.83 for its own name and 10 for the primary keyword, where an exact match would normally help. The export is too small to decide.

**Recommendation — owner's decision.** In order of expected benefit:

1. Write public copy in the current official Latin spelling that people type.
2. Keep the new alphabet in body text but use the searched spelling in titles, descriptions, H1s and the first paragraph of each page.
3. Keep everything as it is and measure. This leaves the question open and is not recommended for the primary keyword.

### 11.4 Draft wording (recommendation; nothing changed)

These drafts use only facts already published on the site, and the searched spelling. They need approval and the spelling decision above.

| Element | Draft |
| --- | --- |
| Homepage title | Mikromoliya tashkiloti — mikroqarz va mikrokredit \| Microfinance.uz |
| Homepage H1 | «Biznesni Rivojlantirish» mikromoliya tashkiloti |
| Homepage sub-heading | The current slogan can move here |
| `/kredit/mikroqarz` H1 | Garovsiz mikroqarz |
| `/kredit/mikrokredit` H1 | Garov asosida mikrokredit |

---

## 12. YMYL and Trust Assessment

A lender's website is judged on whether the organization is identifiable, licensed and transparent. Each row was checked in the source and on the live site.

| Item | Status | Evidence |
| --- | --- | --- |
| Full legal name | **Partial.** Name shown without legal form (MChJ, AJ) or tax ID | `shared/company.ts:30-33` |
| Russian legal name | **Unverified.** `docs/INTEGRATION.md:57-58` lists the official Russian spelling as still required, yet a translated name is used in the title, image alt and JSON-LD | `company.ts:32`, `ru.json:3,158` |
| Licence | **Missing.** `license: null`; the footer line is hidden; "litsenziya" appears 0 times on the live site | `company.ts:61`, `AppFooter.vue:129-131` |
| Phone, email, address | Present and consistent across pages | `company.ts:34-60` |
| Working hours | Present | `company.ts:69-72` |
| Branches | **Partial.** Eight listed; seven have no street address; all eight show the head-office phone | `shared/branches.ts`, `docs/INTEGRATION.md:78-84` |
| Product conditions | Present: amount, term, rate range, repayment types, collateral, documents | `shared/products.ts` |
| Fees and total cost | **Missing.** No effective annual rate, total cost of credit, fees, penalties or insurance | `docs/INTEGRATION.md:46-50` lists these as unconfirmed |
| Early repayment and late payment terms | **Thin.** One FAQ answer: "Ha, albatta." | `uz.json:259-262` |
| Privacy policy | **Missing.** No page | `app/pages/` has two files |
| Terms and conditions | **Missing** | Same |
| Consent on the application form | **Missing.** The form collects name and phone with no consent text | `HomeApplication.vue:146-258`; flagged in `docs/INTEGRATION.md:146-148` |
| Company background | **Missing.** No "about" page or section | — |
| Customer support | Phone, email, Telegram and Jivo chat | `company.ts`, `nuxt.config.ts:48` |
| Responsible-lending notice | Text exists in both locales but the component is not used on any page | `uz.json:81-84`, `LoanResponsibleNote.vue` |

### Inconsistencies in published financial information

None of these was changed. Each needs a decision from the organization.

| # | Finding | Evidence | Status |
| --- | --- | --- | --- |
| 1 | The homepage card titled "Mikroqarz" shows a maximum of **100 mln**, while the page titled "Mikroqarz" says **50 mln**. The card takes the maximum across both microloan products | `HomeOffers.vue:8-9`, `products.ts:69,83`; live text | Verified |
| 2 | The number labelled "işonç telefoni" is `+998 71 202 75 75`, but a different number is stored as the trust line: `+998 71 202 57 75`, which is used nowhere | `company.ts:34-41`, `uz.json:156`, `index.vue:20` | Verified in code; which number is correct is unknown |
| 3 | Microcredit minimum: data says 101 mln; Uzbek text says "100 mln dan" (from 100); Russian says "свыше 100" (over 100) | `products.ts:96`, `loanAmount.ts:6`, `uz.json:60,127`, `ru.json:60,130` | Verified; wording differs between languages |
| 4 | Microcredit is described as for self-employed citizens, while the H1, footer tagline and keywords address businesses and entrepreneurs | `uz.json:64,126,161,285` | Verified; the intended audience needs confirmation |
| 5 | FAQ commitments ("24 soat içida", early repayment "Ha, albatta") are published although the integration notes say they must be confirmed first | `uz.json:251-262`, `docs/INTEGRATION.md:74-77` | Verified in code; confirmation status unknown |
| 6 | Murobaha is presented as a product card; the footer link "Islomiy moliyalaştiriş" goes to a marketplace that, per the project notes, does not describe itself as Islamic finance | `HomeOffers.vue:30-41`, `AppFooter.vue:13`, `docs/INTEGRATION.md:64-69` | Verified in code; the marketplace content was not re-checked |
| 7 | Homepage description names secured microloans and microcredits only, though an unsecured microloan is offered | `uz.json:156` | Verified |

Interest rates are consistent everywhere: all figures derive from one table (`products.ts:20-30`), and the calculator's example was recomputed and matches.

**Recommendation:** publish a company page with the legal name, legal form, tax ID, licence number and date, and a link to the regulator's register; add a privacy policy, terms, and a consent line on the form; resolve rows 1–7. All of it depends on documents only the organization can supply.

---

## 13. Multilingual SEO Assessment

### 13.1 Current behaviour (verified on the live site)

| Request to `https://www.microfinance.uz/` | Language returned |
| --- | --- |
| Googlebot user agent, no language header | Uzbek |
| `Accept-Language: en-US` | Uzbek |
| `Accept-Language: uz-UZ` | Uzbek |
| `Accept-Language: ru-RU` | Russian |
| Cookie `i18n_locale=ru` | Russian |

| Check | Result |
| --- | --- |
| URL architecture | One URL per page for both languages (`strategy: 'no_prefix'`, `nuxt.config.ts:97`) |
| `hreflang` annotations | None. `useLocaleHead` is called with `seo: true` (`seo.ts:4`) but cannot emit alternates when the languages share a URL |
| Reciprocal `hreflang` | Not applicable; there are none |
| `x-default` | None |
| Self-referencing canonical | Present, but on the wrong host, and identical for both languages |
| Language-specific metadata | Both languages have their own title, description, keywords and JSON-LD; only the Uzbek set is reachable by a crawler |
| `og:locale` and alternate | Present |
| Crawlable language switch | No; `<button>` elements calling `setLocale` |
| Old `/ru/*` URLs | 301 to the unprefixed URL, which a crawler receives in Uzbek |

### 13.2 What this cost (verified from `Pages.csv`)

| Old Russian URLs | Clicks | Impr. | CTR | Weighted pos. |
| --- | --- | --- | --- | --- |
| Seven `/ru` URLs | 3 | 97 | 3.09% | 4.59 |

That is 22.9% of all page impressions in the export, at the best average position of any group. Eight of the 36 visible queries are Cyrillic. These pages now redirect to content in a different language, so Google has no reason to keep ranking them for Russian queries.

Under the current setup Uzbek and Russian do not compete with each other. Russian is simply absent from search.

### 13.3 Recommendation

Give each language its own URL again. `prefix_except_default` is the better fit:

| Aspect | Result |
| --- | --- |
| Uzbek | Stays at `/` and `/kredit/…`, the URLs live today |
| Russian | Returns to `/ru/` and `/ru/kredit/…`, the URLs that had impressions |
| `/uz/*` | Keeps redirecting to the unprefixed URL |
| `hreflang` | `uz` and `ru` on every page, reciprocal, plus `x-default` pointing to the Uzbek URL |
| Canonical | Self-referencing per language |
| Language switch | Real links |
| Automatic language redirect | Off, or limited to a suggestion, so a crawler always gets the language of the URL it asked for |
| Sitemap | Both languages with alternates |

The `/ru/*` → `/*` redirect rule (`nuxt.config.ts:82-86`) has been live since about 2026-11-10. The sooner it is removed, the more of the Russian rankings can be recovered.

---

## 14. Structured Data Assessment

### 14.1 What exists (verified on the live HTML)

| Page | Types | Source |
| --- | --- | --- |
| `/` | `Organization`, `WebSite` in one `@graph` | `app/utils/structured-data.ts:9-45`, `index.vue:26-28` |
| `/kredit/*` | `BreadcrumbList` | `structured-data.ts:47-57`, `[slug].vue:55-60` |

The JSON-LD is valid JSON, escaped safely (`seo.ts:54`), and appears once per page with no duplicates.

### 14.2 Problems

| # | Problem | Evidence | Status |
| --- | --- | --- | --- |
| 1 | Every URL and `@id` is on the redirecting host | Live HTML | Verified |
| 2 | `name` includes the guillemets «…» and uses the new-alphabet spelling | `company.ts:31` | Verified |
| 3 | `name` changes with the visitor's language; the Russian value is an unconfirmed translation | `structured-data.ts:13` | Verified |
| 4 | `logo` is `/favicon-512.png`, described in the notes as an interim mark | `structured-data.ts:16`, `docs/INTEGRATION.md:54-56` | Verified |
| 5 | `sameAs` includes a Facebook share link rather than the page's address | `company.ts:88` | Verified |
| 6 | No `legalName`, tax ID, opening hours or coordinates, though hours and coordinates exist in `company.ts` | `structured-data.ts` | Verified |
| 7 | The eight branches are not marked up | — | Verified |
| 8 | `docs/INTEGRATION.md:178-179` says `logo` and `sameAs` are left out; the code includes them | — | Verified; documentation out of date |

### 14.3 Applicability

| Type | Applicable? | Note |
| --- | --- | --- |
| `Organization` | Yes, keep | Fix rows 1–6 |
| `WebSite` | Yes, keep | Fix host |
| `BreadcrumbList` | Yes, keep | Fix host |
| `FinancialService` | Yes, once the licence and legal details are confirmed | Head office and each branch, with address, coordinates, phone and hours. Seven branches have no street address yet |
| `LoanOrCredit` | Possible on product pages | Amount, term and rate are already confirmed in `products.ts`. Gives no rich result in Google; modest value |
| `FAQPage` | Low priority | Google shows FAQ rich results only for a narrow set of sites; may still help other engines. Only worth adding after the FAQ is expanded |
| `Article` | Not applicable | The site has no articles |
| `Review`, `AggregateRating` | **Do not add** | No verified reviews exist |

No licence number, rating or review should enter structured data until the organization supplies verified values.

---

## 15. Prioritized SEO Roadmap

### 15.1 Findings by priority

Each row is a finding with its evidence, location, impact and proposed fix. Nothing has been implemented.

#### CRITICAL

| ID | Issue | Evidence | Affected URLs | Source | Impact | Recommended solution |
| --- | --- | --- | --- | --- | --- | --- |
| C1 | Canonical host mismatch | Apex returns 308 to `www`; canonical, `og:url`, sitemap, robots and JSON-LD all name the apex | All | `nuxt.config.ts:4,89,99`; `public/robots.txt:4`; Vercel domain settings | Contradictory canonical signals; all sitemap URLs are redirects; signals split (286 against 135 impressions by host) | Pick one host and align the Vercel primary domain, `SITE_URL`, `i18n.baseUrl`, robots and environment variables |
| C2 | Russian version not indexable | Googlebot receives Uzbek; no `hreflang`; `/ru/*` redirects to Uzbek; 97 impressions at position 4.59 were on `/ru` URLs | All | `nuxt.config.ts:82-86,97,106-110`; `AppLanguageSwitcher.vue:16-24` | Loss of all Russian-language search visibility | Per-language URLs with `hreflang` (section 13.3) |
| C3 | Impressions fell 88.7% from 2026-11-06 | 22.2 → 2.5 impressions a day; later positions 1.0–1.8 | Unknown | Unknown | The site may have dropped out of non-brand results | Check Page indexing, URL Inspection, Crawl stats, and Vercel deployment and domain history for 11-04 to 11-07 before further URL changes |
| C4 | Licence, legal identity and legal pages not published | `license: null`; no policy, terms or company page; no consent on the form | All | `shared/company.ts:61`; `app/pages/`; `HomeApplication.vue:146-258` | Weak trust signals for a financial site; legal exposure on personal data | Company and licence page, privacy policy, terms, consent line. Needs the organization's documents |

#### HIGH

| ID | Issue | Evidence | Affected URLs | Source | Impact | Recommended solution |
| --- | --- | --- | --- | --- | --- | --- |
| H1 | Primary keyword not targeted and absent in searched spelling | 0 occurrences of "mikromoliya tashkiloti" in rendered text; query at position 10 with 2 impressions | `/` | `uz.json:155-166`; `HomeHero.vue:42-46` | No relevance signal for the main keyword | New title, H1 and an introductory block (section 11.4); spelling decision (11.3) |
| H2 | Raw translation key shown on Uzbek product pages | Live text `products.mikroqarz.processButton` | 3 product pages | `uz.json:110-130` (key missing); `[slug].vue:83` | Visible defect on the indexed language; harms trust and click-through | Add the three Uzbek strings |
| H3 | Own brand name not ranking first | "biznesni rivojlantirish mikromoliya tashkiloti": position 4.83, 6 impressions, 0 clicks | `/` | `company.ts:31`; `structured-data.ts:13` | Lost navigational traffic | Name in searched spelling in title, body and JSON-LD; company page; business profiles |
| H4 | Thin content, four URLs | Product pages 268–277 words with shared boilerplate; no company, branch or Murobaha page | All | `app/pages/` | Little for Google to rank; non-brand position 25.53 | Expand product pages; add pages listed in section 8.2 |
| H5 | 94.3% of historic impressions were on URLs that now redirect; three URL schemes in three weeks | 399 of 423 page impressions | All | `nuxt.config.ts:80-86`; commit `4e1c893` | Rankings must be re-earned on new URLs | Settle the URL scheme once (C1, C2) and then stop changing it |
| H6 | Inconsistent financial and contact information | Seven rows in section 12 | `/`, `/kredit/*` | `HomeOffers.vue:8-9`; `company.ts:34-41`; `uz.json` | Trust risk on a financial site | Organization to confirm each row; then correct |

#### MEDIUM

| ID | Issue | Evidence | Source | Recommended solution |
| --- | --- | --- | --- | --- |
| M1 | Weak internal linking | Header has no product links; two product pages linked only from the footer; no cross-links or apply links in product bodies | `AppHeader.vue:12-17`; `HomeOffers.vue:71-82`; `[slug].vue:78-84` | Product links in the header; render the microloan cards in the page; cross-links and an apply link on product pages |
| M2 | Structured data gaps | Section 14.2 | `app/utils/structured-data.ts` | Fix host, name and logo; add `FinancialService` when details are confirmed |
| M3 | Heading structure | Duplicate H2; contact H2 hidden; footer column titles are H2; one-word product H1s | `uz.json:169,193`; `HomeContact.vue:73`; `AppFooter.vue:68,83,97` | Distinct H2s naming services; descriptive H1s |
| M4 | Keywords tag stuffed | 130 phrases on the homepage; contradicts the project's own guide | `uz.json:157`; `ru.json:160` | Reduce to the guide's 15–25 or remove |
| M5 | Language varies on one URL without `Vary`; nothing cached | Headers in section 10.8 | `nuxt.config.ts:106-110` | Resolved by C2; then consider caching for the HTML |
| M6 | Followed sitewide link to a `vercel.app` domain; Murobaha card leads nowhere | Live HTML; `company.ts:64-67` | `AppFooter.vue:13`; `HomeOffers.vue:30-41` | Link to a production domain or remove until the product is confirmed |
| M7 | No analytics | Only the Jivo script loads | `nuxt.config.ts:46-49` | Add an analytics tool and track form submissions and calls |
| M8 | Mobile CTR about half of desktop | 12.90% against 24.62% | — | Re-check after the title change; needs a device-by-query export |
| M9 | Sitemap has no `lastmod` or language alternates | Live `sitemap.xml` | `nuxt.config.ts:91-94` | Add both after C1 and C2 |

#### LOW

| ID | Issue | Source |
| --- | --- | --- |
| L1 | 404 page canonical and `og:url` point at the missing URL | `app/composables/seo.ts:4-11`, `app/error.vue:7` |
| L2 | Decorative images have empty `alt`; no image-search value | `HomeOfferCard.vue:70`, `HomeBranchCard.vue:25` |
| L3 | Facebook `sameAs` is a share link | `shared/company.ts:88` |
| L4 | One Open Graph image for every page | `app/composables/seo.ts:14` |
| L5 | `docs/INTEGRATION.md` section 4 no longer matches the code | `docs/INTEGRATION.md:173-182` |
| L6 | `public/site-logo.png` (1.4 MB) is not referenced anywhere | `public/` |
| L7 | `mail.microfinance.uz` appeared in search; it already sends `X-Robots-Tag: none` | Outside this repository |
| L8 | The hero badge says different things in Uzbek and Russian | `uz.json:160`, `ru.json:163` |
| L9 | The responsible-lending notice is written but not shown | `LoanResponsibleNote.vue` |
| L10 | `X-Powered-By: Nuxt` header exposed | Response headers |

### 15.2 Proposed sequence

| Phase | Goal | Items | Depends on |
| --- | --- | --- | --- |
| 0. Diagnose | Explain the 11-06 drop | C3 | Search Console and Vercel access |
| 1. Stabilise URLs | One host, one URL per language, then no more URL changes | C1, C2, H5, M5, M9 | Decision on host and language URLs |
| 2. Fix what is visible | Remove the defect; target the primary keyword | H2, H1, H3, M3, M4 | Decision on spelling |
| 3. Trust | Publish who the organization is | C4, H6, M2, M6 | Licence, legal details, policies, confirmed figures from the organization |
| 4. Content | Give Google pages to rank | H4, M1, branch pages, expanded FAQ | Branch addresses and phones; confirmed product details |
| 5. Measure | Know what works | M7, M8, and a fresh export four weeks after phase 1 | — |

After phase 1, in Search Console: resubmit the sitemap, request indexing of the four Uzbek and four Russian URLs, and watch the Page indexing report for "Page with redirect" and "Duplicate, Google chose different canonical".

### 15.3 Additional data needed

| Data | Why |
| --- | --- |
| Search Console export with Query and Page together | Confirm which page ranks for which query; confirm or rule out cannibalization |
| Search Console export of queries by date | See which queries disappeared on 11-06 |
| Page indexing report and URL Inspection results | Know what Google has indexed and which canonical it chose |
| Crawl stats | See whether Google met errors or redirects around 11-06 |
| Vercel deployment and domain history | Date the host change |
| Core Web Vitals report or PageSpeed measurements | No performance claims were made without them |
| Yandex Webmaster data | Yandex verification is installed; its data was not provided |
| When the Search Console property was created | Explain why data begins on 2026-10-25 |
| Licence, legal form, tax ID, official Russian name, branch addresses, confirmed FAQ answers | Required for phases 3 and 4 |
| A results-page check for the primary keyword from Uzbekistan | See which pages currently rank and what they contain |

---

*Method: CSV figures were computed with a read-only script over the original files. Live-site observations come from HTTP requests made on 2026-11-16 with a Googlebot user agent. The helper scripts and downloaded pages are stored outside the project and were not added to the repository.*
