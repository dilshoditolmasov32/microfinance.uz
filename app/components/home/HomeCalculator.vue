<script setup lang="ts">
import { CALCULATOR_OPTIONS } from '#shared/products'

const { t } = useI18n()
const sectionLink = useSectionLink()

const productSlug = ref(CALCULATOR_OPTIONS[0].value)
const limits = computed(() => CALCULATOR_OPTIONS.find(option => option.value === productSlug.value) ?? CALCULATOR_OPTIONS[0])

const amountMln = ref(limits.value.defaultAmountMln)
const months = ref(limits.value.maxTermMonths)

// Keep the values inside the selected option's limits.
const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value))
watch(limits, (l) => {
  amountMln.value = clamp(amountMln.value, l.minAmountMln, l.maxAmountMln)
  months.value = clamp(months.value, l.minTermMonths, l.maxTermMonths)
})

const principal = computed(() => amountMln.value * 1_000_000)
const monthly = computed(() => annuityPayment(principal.value, limits.value.annualRatePct, months.value))
const total = computed(() => monthly.value * months.value)
const overpayment = computed(() => total.value - principal.value)

// Shown values glide to the new result; screen readers get the exact one.
const monthlyShown = useTweenedNumber(monthly)
const totalShown = useTweenedNumber(total)
const overpaymentShown = useTweenedNumber(overpayment)

const productItems = computed(() =>
  CALCULATOR_OPTIONS.map(option => ({ label: t(option.labelKey), value: option.value })),
)
</script>

<template>
  <section id="calculator" aria-labelledby="calculator-title" class="anchor-20 sm:anchor-24 bg-ink-50 py-20 sm:py-24">
    <UContainer>
      <UiSectionHeading
        id="calculator-title"
        :title="t('home.calculator.title')"
        :lead="t('home.calculator.lead')"
      />

      <div class="mx-auto mt-12 grid max-w-6xl gap-6 lg:grid-cols-12 lg:gap-8">
        <!-- Inputs -->
        <div v-reveal="{ from: 'left' }" class="rounded-xl border border-ink-200 bg-white p-6 shadow-card sm:p-10 lg:col-span-7">
          <UFormField :label="t('home.calculator.product')" size="xl" :ui="{ label: 'font-semibold text-ink-700', container: 'mt-3' }">
            <USelect
              v-model="productSlug"
              :items="productItems"
              size="xl"
              class="w-full"
              :ui="{ base: 'h-13 rounded-lg font-semibold text-ink-950 ring-ink-200 hover:ring-ink-300', trailingIcon: 'text-ink-500' }"
            />
          </UFormField>

          <UiRangeSlider
            v-model="amountMln"
            class="mt-9"
            :label="t('home.calculator.amount')"
            :min="limits.minAmountMln"
            :max="limits.maxAmountMln"
            :display="t('home.calculator.mlnSum', { value: amountMln })"
            :min-label="t('home.calculator.mln', { value: limits.minAmountMln })"
            :max-label="t('home.calculator.mln', { value: limits.maxAmountMln })"
          />

          <UiRangeSlider
            v-model="months"
            class="mt-8"
            :label="t('home.calculator.term')"
            :min="limits.minTermMonths"
            :max="limits.maxTermMonths"
            :display="t('home.calculator.months', { value: months })"
            :min-label="String(limits.minTermMonths)"
            :max-label="String(limits.maxTermMonths)"
          />

          
        </div>

        <!-- Result -->
        <div v-reveal="{ delay: 120, from: 'right' }" class="flex flex-col rounded-xl bg-brand-600 p-6 text-white shadow-raised sm:p-10 lg:col-span-5">
          <p class="font-semibold">
            {{ t('home.calculator.monthly') }}
          </p>
          <p class="mt-2" aria-live="polite">
            <span class="text-[2.75rem] leading-none font-extrabold tracking-[-0.03em] tabular-nums sm:text-[3.25rem]" aria-hidden="true">{{ formatAmount(monthlyShown) }}</span>
            <span class="sr-only">{{ formatAmount(monthly) }}</span>
            <span class="ml-2 text-lg font-semibold">{{ t('home.calculator.sum') }}</span>
          </p>

          <dl class="mt-8 space-y-4 border-t border-white/25 pt-6">
            <div class="flex items-baseline justify-between gap-4">
              <dt class="font-medium">
                {{ t('home.calculator.total') }}
              </dt>
              <dd class="text-right">
                <span class="text-xl font-extrabold tabular-nums" aria-hidden="true">{{ formatAmount(totalShown) }}</span>
                <span class="sr-only">{{ formatAmount(total) }}</span>
                <span class="ml-1 text-sm font-semibold">{{ t('home.calculator.sum') }}</span>
              </dd>
            </div>
            <div class="flex items-baseline justify-between gap-4">
              <dt class="font-medium">
                {{ t(limits.markup ? 'home.calculator.markup' : 'home.calculator.overpayment') }}
              </dt>
              <dd class="text-right">
                <span class="text-xl font-extrabold tabular-nums" aria-hidden="true">{{ formatAmount(overpaymentShown) }}</span>
                <span class="sr-only">{{ formatAmount(overpayment) }}</span>
                <span class="ml-1 text-sm font-semibold">{{ t('home.calculator.sum') }}</span>
              </dd>
            </div>
          </dl>

          <div class="mt-auto pt-10">
            <UButton
              :to="sectionLink('application')"
              color="neutral"
              variant="solid"
              size="xl"
              block
              class="bg-white text-brand-700 hover:bg-brand-50 active:bg-brand-100 focus-visible:outline-white"
            >
              {{ t('home.calculator.cta') }}
            </UButton>
          </div>
        </div>
      </div>
    </UContainer>
  </section>
</template>
