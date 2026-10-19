<script setup lang="ts">
import type { CollateralType } from '#shared/products'
import { COLLATERAL_ICON } from '~/utils/collateral'

withDefaults(defineProps<{
  items: readonly CollateralType[]
  layout?: 'stack' | 'grid'
}>(), {
  layout: 'stack',
})

const { t } = useI18n()
</script>

<template>
  <ul :class="layout === 'grid' ? 'grid gap-4 sm:grid-cols-3' : 'grid gap-3'">
    <li
      v-for="(item, index) in items"
      :key="item"
      v-reveal="index * 90"
      class="group/item flex items-start gap-4 rounded-lg border border-ink-200 bg-white p-4 transition-[border-color,box-shadow,translate] duration-300 ease-smooth hover:-translate-y-0.5 hover:border-brand-200 hover:shadow-card"
      :class="layout === 'grid' && 'sm:flex-col sm:p-6'"
    >
      <span class="grid size-11 shrink-0 place-items-center rounded-md bg-brand-50 text-brand-700 transition-colors duration-300 group-hover/item:bg-brand-600 group-hover/item:text-white">
        <UIcon :name="COLLATERAL_ICON[item]" class="size-5.5" />
      </span>
      <div>
        <p class="font-bold text-ink-950">
          {{ t(`collateral.${item}.title`) }}
        </p>
        <p class="mt-0.5 text-sm text-ink-600">
          {{ t(`collateral.${item}.text`) }}
        </p>
      </div>
    </li>
  </ul>
</template>
