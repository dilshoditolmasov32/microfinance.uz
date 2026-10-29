<script setup lang="ts">
import { telHref } from '#shared/company'
import { loanProductPath, rateRangePct, type LoanProduct } from '#shared/products'

const props = defineProps<{ product: LoanProduct }>()
const rateRange = computed(() => rateRangePct(props.product))

const { t } = useI18n()
const localePath = useLocalePath()
const amountLabel = useLoanAmountLabel()
</script>

<template>
  <article class="flex flex-col rounded-xl border border-ink-200 bg-white p-6 transition-shadow duration-300 ease-smooth hover:shadow-raised sm:p-8">
    <h3 class="text-h3 font-extrabold">
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
          {{ amountLabel(product) }}
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
          {{ t('loan.values.rateRange', { min: rateRange[0], max: rateRange[1] }) }}
        </dd>
      </div>
    </dl>

    <div class="mt-auto grid gap-3 pt-8">
      <UButton size="lg" block :to="localePath(loanProductPath(product.slug))" trailing-icon="i-lucide-arrow-right" :ui="{ trailingIcon: 'ms-0' }">
        {{ t('actions.details') }}
        <span class="sr-only">— {{ t(`products.${product.key}.name`) }}</span>
      </UButton>
      <UButton size="lg" block :to="telHref()" external color="neutral" variant="outline" leading-icon="i-lucide-phone">
        {{ t('actions.consult') }}
      </UButton>
    </div>
  </article>
</template>
