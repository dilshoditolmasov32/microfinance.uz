<script setup lang="ts">
withDefaults(defineProps<{ size?: number }>(), { size: 44 })

const patternId = useId()
</script>

<template>
  <svg class="pointer-events-none" aria-hidden="true" focusable="false">
    <defs>
      <pattern :id="patternId" :width="size" :height="size" patternUnits="userSpaceOnUse">
        <g fill="none" stroke="currentColor" stroke-width="1" :transform="`scale(${size / 44})`">
          <rect x="12" y="12" width="20" height="20" />
          <path d="M22 7.9 36.1 22 22 36.1 7.9 22Z" />
        </g>
      </pattern>
    </defs>
    <rect width="100%" height="100%" :fill="`url(#${patternId})`" />
  </svg>
</template>
