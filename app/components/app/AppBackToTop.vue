<script setup lang="ts">
const { t } = useI18n()

/** Shown once the visitor has scrolled past the first screen. */
const visible = ref(false)
const update = () => {
  visible.value = window.scrollY > window.innerHeight
}

onMounted(() => {
  update()
  window.addEventListener('scroll', update, { passive: true })
})
onBeforeUnmount(() => window.removeEventListener('scroll', update))

function toTop() {
  // Smooth unless the visitor prefers reduced motion (`scroll-behavior` in main.css).
  window.scrollTo({ top: 0 })
  // The button hides at the top, so hand keyboard focus to the start of the page.
  document.getElementById('main')?.focus({ preventScroll: true })
}
</script>

<template>
  <Transition
    enter-from-class="translate-y-4 opacity-0"
    leave-to-class="translate-y-4 opacity-0"
    enter-active-class="transition duration-300 ease-out"
    leave-active-class="transition duration-200 ease-in"
  >
    <UButton
      v-if="visible"
      icon="i-lucide-arrow-up"
      size="xl"
      square
      :aria-label="t('a11y.backToTop')"
      :title="t('a11y.backToTop')"
      class="fixed right-4 bottom-4 z-40 rounded-full shadow-raised sm:right-6 sm:bottom-6"
      @click="toTop"
    />
  </Transition>
</template>
