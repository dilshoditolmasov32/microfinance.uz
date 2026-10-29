<script setup lang="ts">
import { LOAN_PRODUCTS } from '#shared/products'

const QUESTIONS = ['documents', 'timing', 'collateral', 'earlyRepayment'] as const

const { t } = useI18n()
const amountLabel = useLoanAmountLabel()

const items = computed(() =>
  QUESTIONS.map(key => ({
    value: key,
    label: t(`home.faq.items.${key}.q`),
    slot: key,
    content: key === 'documents' ? '' : t(`home.faq.items.${key}.a`),
  })),
)
</script>

<template>
  <section id="faq" aria-labelledby="faq-title" class="anchor-20 sm:anchor-24 py-20 sm:py-24">
    <UContainer>
      <UiSectionHeading
        id="faq-title"
        :title="t('home.faq.title')"
        :lead="t('home.faq.lead')"
      />

      <UAccordion
        v-reveal
        :items="items"
        :unmount-on-hide="false"
        class="mx-auto mt-12 max-w-4xl"
        :ui="{
          root: 'flex flex-col gap-4',
          item: 'rounded-xl border border-ink-200 bg-white shadow-card transition-[border-color,box-shadow] duration-300 ease-smooth last:border-b hover:border-ink-300 hover:shadow-raised',
          trigger: 'gap-4 px-6 py-5 sm:px-7 sm:py-6',
          label: 'text-start',
          body: 'px-6 pb-6 text-[0.9375rem] leading-relaxed text-ink-600 sm:px-7',
        }"
      >
        <template #documents-body>
          <ul class="grid gap-4">
            <li v-for="product in LOAN_PRODUCTS" :key="product.slug">
              <p class="font-bold text-ink-950">
                {{ t(`products.${product.key}.name`) }} ({{ amountLabel(product) }})
              </p>
              <ul class="mt-1 list-disc ps-5">
                <li v-for="doc in product.documents" :key="doc">
                  {{ t(`documents.${doc}`) }}
                </li>
              </ul>
            </li>
          </ul>
        </template>

        <template #trailing="{ open }">
          <span
            class="ms-auto grid size-9 shrink-0 place-items-center rounded-full transition-colors"
            :class="open ? 'bg-brand-50 text-brand-700' : 'bg-ink-100 text-ink-600'"
            aria-hidden="true"
          >
            <UIcon
              name="i-lucide-plus"
              class="size-5 transition-transform duration-200 motion-reduce:transition-none"
              :class="open && 'rotate-45'"
            />
          </span>
        </template>
      </UAccordion>
    </UContainer>
  </section>
</template>
