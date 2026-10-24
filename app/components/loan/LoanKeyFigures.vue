<script setup lang="ts">
import { rateRangePct, type LoanProduct } from '#shared/products'

const props = defineProps<{ product: LoanProduct }>()
const rateRange = computed(() => rateRangePct(props.product))

const { t } = useI18n()
</script>

<template>
  <dl class="grid grid-cols-2 gap-px bg-ink-100">
    <div class="bg-white px-5 py-5 sm:px-6">
      <dt class="text-sm text-ink-500">
        {{ t('loan.figures.maxAmount') }}
      </dt>
      <dd class="mt-1.5 text-[1.75rem] leading-tight font-extrabold tracking-tight text-ink-950 tabular-nums">
        {{ product.maxAmountMln }}
        <span class="text-base font-bold tracking-normal text-ink-600">{{ t('loan.figures.mlnSum') }}</span>
      </dd>
    </div>
    <div class="bg-white px-5 py-5 sm:px-6">
      <dt class="text-sm text-ink-500">
        {{ t('loan.figures.maxTerm') }}
      </dt>
      <dd class="mt-1.5 text-[1.75rem] leading-tight font-extrabold tracking-tight text-ink-950 tabular-nums">
        {{ product.maxTermMonths }}
        <span class="text-base font-bold tracking-normal text-ink-600">{{ t('loan.figures.months') }}</span>
      </dd>
    </div>
    <div class="col-span-2 bg-white px-5 py-5 sm:px-6">
      <dt class="text-sm text-ink-500">
        {{ t('loan.figures.rate') }}
      </dt>
      <dd class="mt-1.5 flex flex-wrap items-baseline gap-x-2">
        <span class="text-[1.75rem] leading-tight font-extrabold tracking-tight text-ink-950">{{ t('loan.figures.rateValue', { min: rateRange[0], max: rateRange[1] }) }}</span>
        <span class="text-sm text-ink-600">— {{ t('loan.figures.rateNote') }}</span>
      </dd>
    </div>
  </dl>
</template>
