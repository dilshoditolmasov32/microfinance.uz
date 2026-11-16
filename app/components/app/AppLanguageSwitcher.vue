<script setup lang="ts">
const { locale, locales, t } = useI18n()
const switchLocalePath = useSwitchLocalePath()

const items = computed(() =>
  locales.value.map(item => ({
    code: item.code,
    name: item.name ?? item.code,
    language: item.language,
    active: item.code === locale.value,
    to: switchLocalePath(item.code),
  })),
)
</script>

<template>
  <nav :aria-label="t('a11y.language')" class="flex items-center gap-0.5 rounded-lg bg-ink-100 p-1">
    <NuxtLink
      v-for="item in items"
      :key="item.code"
      :to="item.to"
      :lang="item.language"
      :hreflang="item.language"
      :aria-current="item.active ? 'true' : undefined"
      class="min-w-9 cursor-pointer rounded-md px-2.5 py-1.5 text-center text-xs font-bold tracking-wide uppercase transition-colors sm:min-w-10 sm:px-3 sm:text-sm"
      :class="item.active ? 'bg-brand-600 text-white shadow-sm' : 'text-ink-600 hover:bg-white hover:text-ink-950'"
    >
      <span aria-hidden="true">{{ item.code }}</span>
      <span class="sr-only">{{ item.name }}</span>
    </NuxtLink>
  </nav>
</template>
