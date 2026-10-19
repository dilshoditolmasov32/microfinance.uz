<script setup lang="ts">
const STEPS = [
  { key: 'contact', icon: 'i-lucide-phone-call' },
  { key: 'consult', icon: 'i-lucide-messages-square' },
  { key: 'review', icon: 'i-lucide-file-search' },
  { key: 'contract', icon: 'i-lucide-file-pen-line' },
] as const

const { t } = useI18n()
</script>

<template>
  <section id="process" aria-labelledby="process-title" class="anchor-20 sm:anchor-24 bg-ink-50 py-20 sm:py-24">
    <UContainer>
      <UiSectionHeading id="process-title" :title="t('process.title')" />

      <ol class="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
        <li
          v-for="(step, index) in STEPS"
          :key="step.key"
          v-reveal="index * 100"
          class="group/step rounded-xl border border-ink-200 bg-white p-6 shadow-card transition-[translate,box-shadow,border-color] duration-300 ease-smooth hover:-translate-y-1 hover:border-brand-200 hover:shadow-raised sm:p-8"
        >
          <div class="flex items-center justify-between gap-4">
            <span class="grid size-14 shrink-0 place-items-center rounded-lg bg-brand-50 text-brand-700 transition-colors duration-300 group-hover/step:bg-brand-600 group-hover/step:text-white">
              <UIcon :name="step.icon" class="size-7 transition-transform duration-300 ease-smooth group-hover/step:scale-110" />
            </span>
            <span class="text-3xl leading-none font-extrabold tracking-tight text-brand-600 tabular-nums" aria-hidden="true">
              {{ String(index + 1).padStart(2, '0') }}
            </span>
          </div>
          <h3 class="mt-6 text-lg font-bold">
            {{ t(`process.steps.${step.key}.title`) }}
          </h3>
          <p class="mt-2 leading-relaxed text-ink-600">
            {{ t(`process.steps.${step.key}.text`) }}
          </p>
        </li>
      </ol>

    
    </UContainer>
  </section>
</template>
