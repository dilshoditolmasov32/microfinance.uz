<script setup lang="ts">
import { COMPANY } from '#shared/company'
import { LOAN_PRODUCTS } from '#shared/products'

const { t } = useI18n()
const locale = useAppLocale()
const siteUrl = useRuntimeConfig().public.siteUrl
const featured = LOAN_PRODUCTS[0]

usePageSeo(() => ({
  title: t('home.meta.title'),
  description: t('home.meta.description', {
    amount: featured.maxAmountMln,
    months: featured.maxTermMonths,
    phone: COMPANY.phone.display,
  }),
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
    <HomeCalculator />
    <HomeProducts />
    <LoanProcess />
    <HomeApplication />
    <HomeFaq />
    <HomeContact />
  </div>
</template>
