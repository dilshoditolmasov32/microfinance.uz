<script setup lang="ts">
import type { RouteLocationRaw } from 'vue-router'

withDefaults(defineProps<{
  /** Iconify name, e.g. i-lucide-shopping-cart */
  icon: string
  title: string
  text: string
  ctaLabel: string
  /** Internal destination */
  to?: RouteLocationRaw
  /** External destination, opened in a new tab */
  href?: string
  tone?: 'sand' | 'rose'
}>(), {
  tone: 'rose',
})

const { t } = useI18n()
</script>

<template>
  <article
    class="group/card relative isolate flex flex-col overflow-hidden rounded-xl border transition-[translate,box-shadow] duration-300 ease-smooth hover:-translate-y-1 hover:shadow-raised lg:min-h-84"
    :class="tone === 'sand'
      ? 'border-sand-200 bg-sand-50'
      : 'border-brand-100 bg-linear-to-br from-brand-50 to-white'"
  >
    <UiGirihPattern v-if="tone === 'sand'" class="absolute inset-0 -z-10 size-full text-sand-200" />

    <!-- Visual: on top on small screens, on the right on large screens -->
    <div class="relative h-52 sm:h-60 lg:absolute lg:inset-y-0 lg:right-0 lg:h-auto lg:w-[47%]">
      <slot name="visual" />
    </div>

    <div class="relative flex flex-1 flex-col items-start p-6 sm:p-8 lg:max-w-[56%]">
      <span
        class="grid size-12 place-items-center rounded-lg border bg-white/80 text-brand-700 shadow-sm transition-colors duration-300 group-hover/card:border-brand-600 group-hover/card:bg-brand-600 group-hover/card:text-white"
        :class="tone === 'sand' ? 'border-sand-200' : 'border-brand-100'"
      >
        <UIcon :name="icon" class="size-6" />
      </span>
      <h3 class="mt-5 text-[1.75rem] leading-[1.12] font-extrabold tracking-tight lg:text-[2rem]">
        {{ title }}
      </h3>
      <p class="mt-3 max-w-xs leading-relaxed text-ink-700">
        {{ text }}
      </p>
      <div class="mt-auto pt-7">
        <UButton size="lg" v-if="to" :to="to" trailing-icon="i-lucide-arrow-right">
          {{ ctaLabel }}
          <span class="sr-only">— {{ title }}</span>
        </UButton>
        <UButton size="lg" v-else-if="href" :to="href" external target="_blank" rel="noopener" trailing-icon="i-lucide-arrow-right">
          {{ ctaLabel }}
          <span class="sr-only">— {{ title }} ({{ t('a11y.newTab') }})</span>
        </UButton>
      </div>
    </div>
  </article>
</template>
