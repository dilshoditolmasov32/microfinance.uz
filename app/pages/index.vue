<script setup lang="ts">
import { COMPANY } from '#shared/company'
import { LOAN_PRODUCTS, RATE_SHEET } from '#shared/products'

/** Lazy sections hydrate this far before they scroll into view. */
const NEAR_VIEWPORT = { rootMargin: '400px 0px' }

const { t } = useI18n()
const locale = useAppLocale()
const siteUrl = useRuntimeConfig().public.siteUrl
/** Widest limits across the products, for the meta description. */
const maxAmountMln = Math.max(...LOAN_PRODUCTS.map(product => product.maxAmountMln))
const maxTermMonths = Math.max(...LOAN_PRODUCTS.map(product => product.maxTermMonths))
const rateMin = Math.min(...RATE_SHEET.ratesPct.flat().filter(rate => rate != null))

usePageSeo(() => ({
  title: t('home.meta.title'),
  description: t('home.meta.description', {
    amount: maxAmountMln,
    months: maxTermMonths,
    rateMin,
    phone: COMPANY.phone.display,
  }),
  keywords: t('home.meta.keywords'),
  fullTitle: true,
}))

useJsonLd('ld-site', () => ({
  '@graph': [organizationSchema(siteUrl, locale.value), websiteSchema(siteUrl, locale.value)],
}))
</script>

<template>
  <div>
    <HomeHero />
    <HomeOffers />
    <!--
      Server-rendered as usual (full HTML for visitors and search engines), but their JavaScript
      wakes up only as they near the viewport: hydrating every section at once blocked phones for ~2 s.
      The 400px margin hydrates them while still off screen, so v-reveal can still fade them in.
    -->
    <LazyHomeCalculator :hydrate-on-visible="NEAR_VIEWPORT" />
    <LazyLoanProcess :hydrate-on-visible="NEAR_VIEWPORT" />
    <LazyHomeApplication :hydrate-on-visible="NEAR_VIEWPORT" />
    <LazyHomeFaq :hydrate-on-visible="NEAR_VIEWPORT" />
    <LazyHomeContact :hydrate-on-visible="NEAR_VIEWPORT" />
  </div>
</template>
