<script setup lang="ts">
import type { RouteLocationRaw } from 'vue-router'

type Tone = 'green' | 'rose' | 'blue'

const props = defineProps<{
  tone: Tone
  /** Iconify name, e.g. i-lucide-user */
  icon: string
  title: string
  text: string
  ctaLabel: string
  /** Card illustration; the subject sits on the right. */
  image: string
  /** Intrinsic size of `image`, [width, height]. */
  imageSize: [number, number]
  /** Cutout illustration: shown whole on the right instead of filling the card. */
  cutout?: boolean
  /** Photo box size and offset from sm up; replaces the default. */
  photoClass?: string
  /** object-position of the photo; defaults to the bottom-right corner. */
  photoPosition?: string
  /** Shows the "Maksimal miqdor" box. */
  maxAmountMln?: number
  /** Internal destination */
  to?: RouteLocationRaw
  /** External destination, opened in a new tab */
  href?: string
}>()

const { t } = useI18n()

/** Static class strings per tone so Tailwind can see them. */
const TONES = {
  // White text stays on the green-700 side of the gradient (5:1).
  green: {
    card: 'border-green-700 bg-linear-to-br from-green-700 via-green-600 to-green-500 text-white',
    iconBox: 'bg-white text-green-700',
    text: 'text-white/90',
    accent: 'text-green-700',
    tile: 'bg-white/85 text-green-700',
    button: 'bg-white text-green-800 hover:bg-green-50 active:bg-green-100 focus-visible:outline-white',
  },
  rose: {
    card: 'border-brand-100 bg-linear-to-br from-brand-50 via-white to-brand-50 text-ink-950',
    iconBox: 'bg-white text-brand-600',
    text: 'text-ink-700',
    accent: 'text-brand-600',
    tile: 'bg-brand-50 text-brand-600',
    button: '',
  },
  blue: {
    card: 'border-blue-100 bg-linear-to-br from-blue-50 via-white to-blue-100 text-ink-950',
    iconBox: 'bg-white text-blue-700',
    text: 'text-ink-700',
    accent: 'text-blue-700',
    tile: 'bg-blue-50 text-blue-700',
    button: 'bg-blue-700 hover:bg-blue-800 active:bg-blue-900 focus-visible:outline-blue-700',
  },
} satisfies Record<Tone, Record<string, string>>

const tone = computed(() => TONES[props.tone])
</script>

<template>
  <article
    class="group/card relative isolate flex flex-col overflow-hidden rounded-xl border transition-[translate,box-shadow] duration-300 ease-smooth hover:-translate-y-1 hover:shadow-raised sm:min-h-104"
    :class="tone.card"
  >
    <!-- Visual: on top on phones, behind the content on the right from sm up -->
    <div
      class="relative h-56 sm:absolute sm:-z-10 sm:h-auto"
      :class="cutout
        ? 'sm:inset-y-0 sm:right-0 sm:w-[60%] xl:right-[-6%] xl:w-[70%]'
        : ['card-photo sm:inset-y-0', photoClass ?? 'sm:right-0 sm:w-[65%] xl:w-[72%]']"
    >
      <NuxtImg
        format="webp"
        :src="image"
        alt=""
        :width="imageSize[0]"
        :height="imageSize[1]"
        sizes="sm:100vw md:65vw lg:65vw xl:33vw 2xl:33vw"
        loading="lazy"
        class="size-full transition-transform duration-700 ease-smooth group-hover/card:scale-105"
        :class="cutout ? 'object-contain sm:object-[right_60%]' : ['object-cover', photoPosition ?? 'object-bottom-right']"
      />
    </div>

    <div class="relative flex flex-1 flex-col items-start p-6 sm:max-w-[60%] sm:p-8 xl:max-w-none xl:p-7">
      <span class="grid size-12 place-items-center rounded-lg shadow-sm" :class="tone.iconBox">
        <UIcon :name="icon" class="size-6" />
      </span>
      <h3 class="mt-5 text-[1.75rem] leading-[1.12] font-extrabold tracking-tight lg:text-[2rem]">
        {{ title }}
      </h3>
      <p class="mt-3 max-w-xs leading-relaxed xl:max-w-56" :class="tone.text">
        {{ text }}
      </p>

      <div v-if="maxAmountMln" class="mt-6 flex items-center gap-4 rounded-xl bg-white/70 p-3 pr-6 backdrop-blur-sm">
        <span class="grid size-16 shrink-0 place-items-center rounded-lg" :class="tone.tile">
          <UIcon name="i-lucide-database" class="size-8" />
        </span>
        <p class="flex flex-col">
          <span class="text-sm font-medium text-ink-600">{{ t('home.offers.stats.amount') }}</span>
          <span class="text-[1.75rem] leading-tight font-extrabold tracking-tight" :class="tone.accent">
            {{ t('home.offers.stats.amountValue', { value: maxAmountMln }) }}
          </span>
          <span class="text-sm text-ink-600">{{ t('home.offers.stats.amountUnit') }}</span>
        </p>
      </div>

      <div class="mt-auto pt-7">
        <UButton v-if="to" size="lg" :to="to" trailing-icon="i-lucide-arrow-right" :class="tone.button">
          {{ ctaLabel }}
          <span class="sr-only">— {{ title }}</span>
        </UButton>
        <UButton v-else-if="href" size="lg" :to="href" external target="_blank" rel="noopener" trailing-icon="i-lucide-arrow-right" :class="tone.button">
          {{ ctaLabel }}
          <span class="sr-only">— {{ title }} ({{ t('a11y.newTab') }})</span>
        </UButton>
      </div>
    </div>
  </article>
</template>

<style scoped>
/* Fade the photo into the card: towards the content below on phones, to the left from sm up. */
.card-photo {
  mask-image: linear-gradient(to bottom, #000 60%, transparent);
}

@media (min-width: 40rem) {
  .card-photo {
    mask-image: linear-gradient(to right, transparent, #000 40%);
  }
}
</style>
