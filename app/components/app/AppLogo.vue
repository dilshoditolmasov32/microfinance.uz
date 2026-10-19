<script setup lang="ts">
withDefaults(defineProps<{
  inverse?: boolean
  /** Show the organization name under the wordmark. */
  tagline?: boolean
}>(), { inverse: false, tagline: true })

const { t } = useI18n()
const localePath = useLocalePath()
</script>

<template>
  <NuxtLink :to="localePath('/')" class="inline-flex items-center gap-2 rounded-md sm:gap-3" :aria-label="t('a11y.homeLink')">
    <!-- Logo mark cleaned from the organization's header logo: checkerboard removed, cropped, resized. -->
    <NuxtImg
      format="webp"
      src="/logo/logo-mark.png"
      alt=""
      width="70"
      height="32"
      densities="x1 x2"
      decoding="async"
      class="h-6 w-auto shrink-0 sm:h-8"
    />
    <span class="flex min-w-0 flex-col">
      <span
        class="text-base leading-tight font-extrabold tracking-[-0.02em] sm:text-xl"
        :class="inverse ? 'text-white' : 'text-ink-950'"
      >Microfinance<span :class="inverse ? 'text-brand-400' : 'text-brand-600'">.uz</span></span>
      <span
        v-if="tagline"
        class="mt-0.5 hidden text-xs leading-tight font-medium text-balance sm:block"
        :class="inverse ? 'text-ink-400' : 'text-ink-500'"
      >{{ t('brand.descriptor') }}</span>
    </span>
  </NuxtLink>
</template>
