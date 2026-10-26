<script setup lang="ts">
import { COMPANY, mailtoHref, telHref } from '#shared/company'
import { findLoanProduct, loanProductPath, rateRangePct, type LoanProduct } from '#shared/products'

// Re-run setup when navigating between products.
definePageMeta({ key: route => route.fullPath })

const route = useRoute()
const { t } = useI18n()
const localePath = useLocalePath()
const siteUrl = useRuntimeConfig().public.siteUrl

function resolveProduct(slug: unknown): LoanProduct {
  const product = typeof slug === 'string' ? findLoanProduct(slug) : undefined
  if (!product) {
    throw createError({ status: 404, statusText: 'Page Not Found', fatal: true })
  }
  return product
}

const product = resolveProduct(route.params.slug)
const msg = (field: string) => t(`products.${product.key}.${field}`)
const [rateMin, rateMax] = rateRangePct(product)

const terms = computed(() => [
  { key: 'purpose', label: t('loan.terms.purpose'), value: msg('purpose') },
  { key: 'segment', label: t('loan.terms.segment'), value: t(product.borrower === 'individual' ? 'loan.values.individuals' : 'loan.values.entrepreneurs') },
  { key: 'currency', label: t('loan.terms.currency'), value: t('loan.values.uzs') },
  { key: 'amount', label: t('loan.terms.amount'), value: t('loan.values.amountUpTo', { amount: product.maxAmountMln }) },
  { key: 'term', label: t('loan.terms.term'), value: t('loan.values.termUpTo', { months: product.maxTermMonths }) },
  {
    key: 'gracePeriod',
    label: t('loan.terms.gracePeriod'),
    value: product.gracePeriodMonths > 0
      ? t('loan.values.gracePeriodUpTo', { months: product.gracePeriodMonths })
      : t('loan.values.noGracePeriod'),
  },
  { key: 'rate', label: t('loan.terms.rate'), value: t('loan.values.rateRange', { min: rateMin, max: rateMax }) },
  { key: 'repayment', label: t('loan.terms.repayment'), value: t('loan.values.repayment') },
])

const breadcrumbs = computed(() => [
  { label: t('nav.home'), to: localePath('/') },
  // `active` makes UBreadcrumb mark the current page with aria-current="page".
  { label: msg('name'), active: true },
])

const metaParams = { amount: product.maxAmountMln, months: product.maxTermMonths, rateMin }

usePageSeo(() => ({
  title: t(`products.${product.key}.metaTitle`, metaParams),
  description: t(`products.${product.key}.metaDescription`, metaParams),
}))

useJsonLd('ld-breadcrumbs', () =>
  breadcrumbSchema([
    { name: t('nav.home'), url: absoluteUrl(siteUrl, localePath('/')) },
    { name: msg('name'), url: absoluteUrl(siteUrl, localePath(loanProductPath(product.slug))) },
  ]),
)
</script>

<template>
  <div>
    <section aria-labelledby="product-title" class="border-b border-ink-100">
      <UContainer class="py-10 sm:py-14 lg:py-16">
        <UBreadcrumb :items="breadcrumbs" :aria-label="t('a11y.breadcrumbs')" :ui="{ link: 'font-semibold' }" />

        <div class="mt-10 grid gap-10 lg:grid-cols-12 lg:items-end lg:gap-8">
          <div class="lg:col-span-7">
            <UBadge color="primary" variant="subtle" class="enter">{{ t(`loan.segment.${product.borrower}`) }}</UBadge>
            <h1 id="product-title" class="enter enter-delay-100 mt-5 text-display font-extrabold">
              {{ msg('name') }}
            </h1>
            <p class="enter enter-delay-200 mt-5 max-w-xl text-lead text-ink-600">
              {{ msg('summary') }}
            </p>
            <div class="enter enter-delay-300 mt-8 flex flex-col gap-3 sm:flex-row">
              <UButton :to="telHref()" external size="xl" leading-icon="i-lucide-phone">
                {{ t('actions.consult') }}
                <span class="sr-only">— {{ COMPANY.phone.display }}</span>
              </UButton>
              <UButton to="#process" size="xl" color="neutral" variant="outline">
                {{ t('nav.process') }}
              </UButton>
            </div>
          </div>

          <div class="enter enter-delay-300 overflow-hidden rounded-xl border border-ink-200 lg:col-span-5">
            <LoanKeyFigures :product="product" />
          </div>
        </div>
      </UContainer>
    </section>

    <section aria-labelledby="terms-title" class="py-16 sm:py-20">
      <UContainer class="grid gap-10 lg:grid-cols-12 lg:gap-8">
        <div v-reveal class="lg:col-span-7">
          <h2 id="terms-title" class="text-h2 font-extrabold">
            {{ t('loan.terms.title') }}
          </h2>
          <dl class="mt-8 divide-y divide-ink-100 border-y border-ink-100">
            <div v-for="row in terms" :key="row.key" class="grid gap-1 py-4 sm:grid-cols-5 sm:gap-6">
              <dt class="text-ink-500 sm:col-span-2">
                {{ row.label }}
              </dt>
              <dd class="font-bold text-ink-950 sm:col-span-3">
                {{ row.value }}
              </dd>
            </div>
            <div class="grid gap-1 py-4 sm:grid-cols-5 sm:gap-6">
              <dt class="text-ink-500 sm:col-span-2">
                {{ t('loan.terms.collateral') }}
              </dt>
              <dd class="sm:col-span-3">
                <ul class="flex flex-wrap gap-2">
                  <li
                    v-for="item in product.collateral"
                    :key="item"
                    class="rounded-md border border-ink-200 px-2.5 py-1 text-sm font-bold text-ink-900"
                  >
                    {{ t(`collateral.${item}.title`) }}
                  </li>
                </ul>
              </dd>
            </div>
          </dl>
          <p class="mt-6 text-sm text-ink-500">
            {{ t('loan.contractNote') }}
          </p>
        </div>

        <aside v-reveal="{ delay: 120, from: 'right' }" class="lg:col-span-4 lg:col-start-9">
          <div class="rounded-xl border border-ink-200 bg-ink-50 p-6 sm:p-8 lg:sticky lg:top-24">
            <h2 class="text-lg font-bold">
              {{ t('loan.consultTitle') }}
            </h2>
            <p class="mt-2 leading-relaxed text-ink-600">
              {{ t('loan.consultText') }}
            </p>
            <div class="mt-6 grid gap-3">
              <UButton size="lg" :to="telHref()" external block leading-icon="i-lucide-phone">
                {{ COMPANY.phone.display }}
              </UButton>
              <UButton size="lg" :to="mailtoHref()" external block color="neutral" variant="outline" leading-icon="i-lucide-mail">
                {{ COMPANY.email }}
              </UButton>
            </div>
          </div>
        </aside>
      </UContainer>
    </section>

    <section aria-labelledby="collateral-title" class="pb-20 sm:pb-24">
      <UContainer>
        <h2 id="collateral-title" v-reveal class="text-h2 font-extrabold">
          {{ t('loan.collateralTitle') }}
        </h2>
        <p v-reveal="80" class="mt-3 text-lead text-ink-600">
          {{ t(`products.${product.key}.collateralLead`) }}
        </p>
        <LoanCollateralList :items="product.collateral" layout="grid" class="mt-8" />
      </UContainer>
    </section>

    <LoanProcess />

  
  </div>
</template>
