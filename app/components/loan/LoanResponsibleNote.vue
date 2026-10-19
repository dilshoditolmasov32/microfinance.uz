<script setup lang="ts">
const { t } = useI18n()
</script>

<template>
  <aside class="flex gap-4 rounded-xl border border-ink-200 border-l-4 border-l-brand-600 bg-white p-6 sm:gap-5 sm:p-8">
    <UIcon name="i-lucide-scale" class="mt-0.5 size-6 shrink-0 text-brand-700" />
    <div>
      <h3 class="text-lg font-bold">
        {{ t('loan.responsible.title') }}
      </h3>
      <p class="mt-2 max-w-3xl leading-relaxed text-ink-600">
        {{ t('loan.responsible.text') }}
      </p>
    </div>
  </aside>
</template>
