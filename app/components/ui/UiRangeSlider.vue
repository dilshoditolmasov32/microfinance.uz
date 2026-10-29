<script setup lang="ts">
const model = defineModel<number>({ required: true })

const props = withDefaults(defineProps<{
  label: string
  min: number
  max: number
  step?: number
  display: string
  minLabel: string
  maxLabel: string
  stepLabels?: { decrease: string, increase: string }
  dense?: boolean
}>(), {
  step: 1,
})

const labelId = useId()
const nudge = (direction: 1 | -1) => {
  model.value = Math.min(props.max, Math.max(props.min, model.value + direction * props.step))
}
const stepButtonUi = computed(() => ({
  base: `${props.dense ? 'size-9' : 'size-10'} p-0 rounded-full text-ink-700 ring-ink-200 disabled:opacity-40`,
}))
</script>

<template>
  <div>
    <div class="flex items-baseline justify-between gap-4">
      <span :id="labelId" class="font-semibold text-ink-700" :class="dense && 'text-sm'">{{ label }}</span>
      <output
        class="font-extrabold tracking-tight text-ink-950 tabular-nums"
        :class="dense ? 'text-base' : 'text-2xl'"
      >{{ display }}</output>
    </div>
    <div class="flex items-center gap-3" :class="dense ? 'mt-2' : 'mt-4'">
      <UButton
        v-if="stepLabels"
        icon="i-lucide-minus"
        color="neutral"
        variant="outline"
        size="md"
        square
        :ui="stepButtonUi"
        :aria-label="stepLabels.decrease"
        :disabled="model <= min"
        @click="nudge(-1)"
      />
      <USlider
        v-model="model"
        :min="min"
        :max="max"
        :step="step"
        size="lg"
        class="flex-1"
        :aria-labelledby="labelId"
        :aria-valuetext="display"
        :ui="{ thumb: 'size-6 ring-3 bg-white shadow-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600' }"
      />
      <UButton
        v-if="stepLabels"
        icon="i-lucide-plus"
        color="neutral"
        variant="outline"
        size="md"
        square
        :ui="stepButtonUi"
        :aria-label="stepLabels.increase"
        :disabled="model >= max"
        @click="nudge(1)"
      />
    </div>
    <div
      class="flex justify-between text-ink-500 tabular-nums"
      :class="[dense ? 'mt-1 text-xs' : 'mt-2 text-sm', stepLabels && (dense ? 'px-12' : 'px-13')]"
      aria-hidden="true"
    >
      <span>{{ minLabel }}</span>
      <span>{{ maxLabel }}</span>
    </div>
  </div>
</template>
