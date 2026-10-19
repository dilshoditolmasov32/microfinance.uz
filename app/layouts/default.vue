<script setup lang="ts">
const { t } = useI18n()
</script>

<template>
  <div class="flex min-h-dvh flex-col">
    <!-- Native anchor on purpose: it moves keyboard focus to <main>, which router navigation does not. -->
    <a
      href="#main"
      class="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:rounded-lg focus:bg-ink-950 focus:px-4 focus:py-3 focus:text-sm focus:font-bold focus:text-white"
    >
      {{ t('a11y.skipToContent') }}
    </a>

    <AppHeader />

    <main id="main" tabindex="-1" class="flex-1 outline-none">
      <slot />
    </main>

    <AppFooter />
  </div>
</template>
