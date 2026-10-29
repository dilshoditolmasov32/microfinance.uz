<script setup lang="ts">
const props = withDefaults(defineProps<{
  text: string
  delay?: number
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
