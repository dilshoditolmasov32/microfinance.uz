<script setup lang="ts">
import { telHref } from '#shared/company'
import { LOAN_PRODUCTS, loanProductPath } from '#shared/products'

const { t } = useI18n()
const localePath = useLocalePath()
</script>

<template>
  <section id="products" aria-labelledby="products-title" class="anchor-20 sm:anchor-24 lg:anchor-28 py-20 sm:py-24 lg:py-28">
    <UContainer>
      <UiSectionHeading
        id="products-title"
        :title="t('home.products.title')"
        :lead="t('home.products.lead')"
      />

      <div class="mt-12 grid gap-6">
        <article
          v-for="product in LOAN_PRODUCTS"
          :key="product.slug"
          v-reveal
          class="grid overflow-hidden rounded-xl border border-ink-200 bg-white transition-shadow duration-300 ease-smooth hover:shadow-raised lg:grid-cols-12"
        >
          <div class="p-6 sm:p-8 lg:col-span-7 lg:p-10">
            <UBadge color="primary" variant="subtle">{{ t('loan.segment.individual') }}</UBadge>
            <h3 class="mt-4 text-h3 font-extrabold">
              {{ t(`products.${product.key}.name`) }}
            </h3>
            <p class="mt-3 max-w-lg text-ink-600">
              {{ t(`products.${product.key}.summary`) }}
            </p>

            <dl class="mt-8 grid gap-x-8 gap-y-5 border-t border-ink-100 pt-6 sm:grid-cols-2">
              <div>
                <dt class="text-sm text-ink-500">
                  {{ t('loan.terms.amount') }}
                </dt>
                <dd class="mt-1 font-bold text-ink-950">
                  {{ t('loan.values.amountUpTo', { amount: product.maxAmountMln }) }}
                </dd>
              </div>
              <div>
                <dt class="text-sm text-ink-500">
                  {{ t('loan.terms.term') }}
                </dt>
                <dd class="mt-1 font-bold text-ink-950">
                  {{ t('loan.values.termUpTo', { months: product.maxTermMonths }) }}
                </dd>
              </div>
              <div>
                <dt class="text-sm text-ink-500">
                  {{ t('loan.terms.repayment') }}
                </dt>
                <dd class="mt-1 font-bold text-ink-950">
                  {{ t('loan.values.equalMonthly') }}
                </dd>
              </div>
              <div>
                <dt class="text-sm text-ink-500">
                  {{ t('loan.terms.rate') }}
                </dt>
                <dd class="mt-1 font-bold text-ink-950">
                  {{ t('loan.values.rateIndividual') }}
                </dd>
              </div>
            </dl>

            <div class="mt-8 flex flex-col gap-3 sm:flex-row">
              <UButton size="lg" :to="localePath(loanProductPath(product.slug))" trailing-icon="i-lucide-arrow-right">
                {{ t('actions.details') }}
                <span class="sr-only">— {{ t(`products.${product.key}.name`) }}</span>
              </UButton>
              <UButton size="lg" :to="telHref()" external color="neutral" variant="outline" leading-icon="i-lucide-phone">
                {{ t('actions.consult') }}
              </UButton>
            </div>
          </div>

          <div class="border-t border-ink-100 bg-ink-50 p-6 sm:p-8 lg:col-span-5 lg:border-t-0 lg:border-l lg:p-10">
            <h4 class="text-base font-bold">
              {{ t('loan.collateralTitle') }}
            </h4>
            <p class="mt-1 text-sm text-ink-600">
              {{ t('loan.collateralLead') }}
            </p>
            <LoanCollateralList :items="product.collateral" class="mt-5" />
          </div>
        </article>
      </div>
    </UContainer>
  </section>
</template>
