<script setup lang="ts">
import { telHref } from '#shared/company'
import { LOAN_PRODUCTS, loanProductPath, rateRangePct } from '#shared/products'

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

      <div class="mt-12 grid gap-6 lg:grid-cols-3">
        <article
          v-for="(product, index) in LOAN_PRODUCTS"
          :key="product.slug"
          v-reveal="index * 120"
          class="flex flex-col rounded-xl border border-ink-200 bg-white p-6 transition-shadow duration-300 ease-smooth hover:shadow-raised sm:p-8"
        >
          <UBadge color="primary" variant="subtle" class="self-start">
            {{ t(`loan.segment.${product.borrower}`) }}
          </UBadge>
          <h3 class="mt-4 text-h3 font-extrabold">
            {{ t(`products.${product.key}.name`) }}
          </h3>
          <p class="mt-3 text-ink-600">
            {{ t(`products.${product.key}.summary`) }}
          </p>

          <dl class="mt-6 grid grid-cols-2 gap-x-6 gap-y-5 border-t border-ink-100 pt-6">
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
            <div class="col-span-2">
              <dt class="text-sm text-ink-500">
                {{ t('loan.terms.rate') }}
              </dt>
              <dd class="mt-1 font-bold text-ink-950">
                {{ t('loan.values.rateRange', { min: rateRangePct(product)[0], max: rateRangePct(product)[1] }) }}
              </dd>
            </div>
          </dl>

          <div class="mt-auto grid gap-3 pt-8">
            <!-- Keep the arrow next to the label; `block` pushes it to the far edge by default. -->
            <UButton size="lg" block :to="localePath(loanProductPath(product.slug))" trailing-icon="i-lucide-arrow-right" :ui="{ trailingIcon: 'ms-0' }">
              {{ t('actions.details') }}
              <span class="sr-only">— {{ t(`products.${product.key}.name`) }}</span>
            </UButton>
            <UButton size="lg" block :to="telHref()" external color="neutral" variant="outline" leading-icon="i-lucide-phone">
              {{ t('actions.consult') }}
            </UButton>
          </div>
        </article>
      </div>
    </UContainer>
  </section>
</template>
