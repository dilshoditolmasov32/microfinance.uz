<script setup lang="ts">
withDefaults(defineProps<{
  /** Applied to the heading so sections can use aria-labelledby. */
  id?: string
  title: string
  lead?: string
  level?: 1 | 2
}>(), {
  level: 2,
})
</script>

<template>
  <div v-reveal class="mx-auto max-w-2xl text-center">
    <component :is="`h${level}`" :id="id" class="text-h2 font-extrabold">
      {{ title }}
    </component>
   
  </div>
</template>
