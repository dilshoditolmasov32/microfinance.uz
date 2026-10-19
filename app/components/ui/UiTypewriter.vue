<script setup lang="ts">
/**
 * Types its text out once, with a blinking caret.
 *
 * The text exists once in the DOM (search engines and screen readers read it as is): it is only made
 * transparent while an aria-hidden overlay types it, and keeps its place so nothing below moves.
 * Before hydration it is transparent too (html.js, set in nuxt.config.ts) so it does not flash; it
 * shows anyway after 3 s if the script never runs, and immediately for reduced motion.
 * Styles: `.typewriter` in main.css.
 */
const props = withDefaults(defineProps<{
  text: string
  /** Pause before the first letter, ms. */
  delay?: number
  /** Time per letter, ms. */
  speed?: number
}>(), {
  delay: 350,
  speed: 45,
})

const state = ref<'idle' | 'typing' | 'done'>('idle')
const shown = ref('')
let timer: number | undefined

function type() {
  window.clearTimeout(timer)
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    state.value = 'done'
    return
  }
  state.value = 'typing'
  shown.value = ''
  const letters = Array.from(props.text)
  const step = (index: number) => {
    shown.value = letters.slice(0, index).join('')
    if (index < letters.length) {
      timer = window.setTimeout(() => step(index + 1), props.speed)
      return
    }
    // Let the caret blink a little, then drop the overlay and show the real text.
    timer = window.setTimeout(() => (state.value = 'done'), 1600)
  }
  timer = window.setTimeout(() => step(1), props.delay)
}

onMounted(type)
watch(() => props.text, type)
onBeforeUnmount(() => window.clearTimeout(timer))
</script>

<template>
  <span class="typewriter" :class="`is-${state}`">
    <span class="typewriter-text">{{ text }}</span>
    <span v-if="state === 'typing'" class="typewriter-live" aria-hidden="true">{{ shown }}<span class="typewriter-caret" /></span>
  </span>
</template>
