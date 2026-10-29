<script setup lang="ts">
const BUILDING_PHOTO = '/images/hero-image.webp'

const { t, te } = useI18n()
const sectionLink = useSectionLink()
const hasTitleTail = computed(() => te('home.hero.titleTail') && t('home.hero.titleTail') !== '')
</script>

<template>
  <section aria-labelledby="hero-title" class="relative isolate overflow-hidden border-b border-ink-100 bg-white">
    <UiGirihPattern class="hero-pattern absolute top-0 left-0 -z-10 h-112 w-xl text-sand-200" />

    <div class="relative h-64 sm:h-80 lg:absolute lg:inset-y-0 lg:right-0 lg:h-auto lg:w-[60%]">
      <div class="hero-photo absolute inset-0 overflow-hidden">
        <NuxtImg
          format="webp"
          :src="BUILDING_PHOTO"
          :alt="t('home.hero.imageAlt')"
          width="1672"
          height="941"
          sizes="sm:100vw md:100vw lg:60vw xl:60vw 2xl:60vw"
          :preload="{ fetchPriority: 'high' }"
          fetchpriority="high"
          class="enter-photo size-full object-cover object-[55%_22%]"
        />
        <span class="absolute inset-y-0 left-0 hidden w-1/3 bg-linear-to-r from-white/60 to-transparent lg:block" aria-hidden="true" />
      </div>
      <svg class="pointer-events-none absolute inset-0 size-full overflow-visible lg:hidden" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true" focusable="false">
        <ellipse cx="50" cy="0" rx="96" ry="102" fill="none" class="stroke-brand-600/60" stroke-width="1.5" vector-effect="non-scaling-stroke" />
      </svg>
      <svg class="pointer-events-none absolute inset-0 hidden size-full overflow-visible lg:block" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true" focusable="false">
        <ellipse cx="94" cy="36" rx="83.5" ry="106" fill="none" class="stroke-brand-600/60" stroke-width="1.5" vector-effect="non-scaling-stroke" />
      </svg>
    </div>

    <UContainer class="relative py-12 sm:py-16 lg:flex lg:min-h-[min(46rem,calc(100dvh-5rem))] lg:items-center lg:py-20">
      <div class="max-w-xl lg:max-w-[38%]">
        <p class="enter inline-flex items-center gap-2.5 rounded-full border border-ink-100 bg-white/85 px-4 py-1.5 text-sm font-semibold text-ink-700 shadow-sm backdrop-blur-sm">
          <span class="h-0.5 w-4 rounded-full bg-brand-600" aria-hidden="true" />
          {{ t('home.hero.badge') }}
        </p>
        <h1 id="hero-title" class="enter enter-delay-100 mt-7 text-display font-extrabold lg:text-[clamp(2.75rem,4.1vw,4rem)]">
          {{ t('home.hero.titleLead') }}
          <UiTypewriter :text="t('home.hero.titleAccent')" :delay="600" class="text-brand-600" />
          <span v-if="hasTitleTail" class="block">{{ t('home.hero.titleTail') }}</span>
        </h1>
        <p class="enter enter-delay-200 mt-6 max-w-md text-lead text-ink-600">
          {{ t('home.hero.lead') }}
        </p>
        <UButton :to="sectionLink('application')" size="xl" trailing-icon="i-lucide-arrow-right" class="enter enter-delay-300 mt-9">
          {{ t('home.hero.cta') }}
        </UButton>
      </div>
    </UContainer>
  </section>
</template>

<style scoped>
.hero-pattern {
  mask-image: radial-gradient(ellipse at top left, #000 10%, transparent 70%);
}

.hero-photo {
  clip-path: ellipse(95% 100% at 50% 0%);
}

@media (min-width: 64rem) {
  .hero-photo {
    clip-path: ellipse(82% 104% at 94% 36%);
  }
}
</style>
