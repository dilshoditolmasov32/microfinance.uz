<script setup lang="ts">
import { COMPANY } from '#shared/company'
import { LOAN_PRODUCTS, RATE_SHEET } from '#shared/products'

const NEAR_VIEWPORT = { rootMargin: '400px 0px' }

const { t } = useI18n()
const locale = useAppLocale()
const siteUrl = useRuntimeConfig().public.siteUrl
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
    <LazyHomeCalculator :hydrate-on-visible="NEAR_VIEWPORT" />
    <LazyLoanProcess :hydrate-on-visible="NEAR_VIEWPORT" />
    <LazyHomeApplication :hydrate-on-visible="NEAR_VIEWPORT" />
    <LazyHomeFaq :hydrate-on-visible="NEAR_VIEWPORT" />
    <LazyHomeContact :hydrate-on-visible="NEAR_VIEWPORT" />
  </div>
</template>
