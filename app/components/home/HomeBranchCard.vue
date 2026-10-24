<script setup lang="ts">
import { branchMapHref, type Branch } from '#shared/branches'
import { COMPANY, telHref } from '#shared/company'

const props = defineProps<{
  branch: Branch
  selected?: boolean
}>()
const emit = defineEmits<{ show: [] }>()

const { t } = useI18n()
const locale = useAppLocale()

const name = computed(() => t('home.contact.branchName', { city: props.branch.city[locale.value] }))
</script>

<template>
  <article
    class="flex gap-4 rounded-xl border bg-white p-3 transition-colors duration-200"
    :class="selected ? 'border-brand-300 bg-brand-50/60 ring-1 ring-brand-300' : 'border-ink-200 hover:border-ink-300'"
  >
    <NuxtImg
      v-if="branch.photo"
      :src="branch.photo"
      alt=""
      format="webp"
      width="96"
      height="96"
      fit="cover"
      densities="x1 x2"
      loading="lazy"
      class="size-20 shrink-0 self-start rounded-lg object-cover sm:size-24"
    />
    <!-- Placeholder until the branch has a photo. -->
    <span v-else class="grid size-20 shrink-0 place-items-center self-start rounded-lg bg-linear-to-br from-brand-50 to-brand-100 text-brand-600 sm:size-24">
      <UIcon name="i-lucide-building-2" class="size-8" />
    </span>

    <div class="min-w-0 flex-1">
      <div class="flex items-start justify-between gap-2">
        <h3 class="text-base leading-tight font-extrabold text-ink-950">
          {{ name }}
        </h3>
        <ULink
          :to="branchMapHref(branch)"
          external
          target="_blank"
          rel="noopener"
          raw
          class="-m-1 shrink-0 rounded-md p-1 text-ink-400 transition-colors hover:text-ink-700"
        >
          <UIcon name="i-lucide-chevron-right" class="block size-5" />
          <span class="sr-only">{{ t('home.contact.openInYandex', { name }) }} ({{ t('a11y.newTab') }})</span>
        </ULink>
      </div>

      <ul class="mt-2 space-y-1 text-sm text-ink-600">
        <li class="flex items-center gap-2">
          <UIcon name="i-lucide-map-pin" class="size-4 shrink-0 text-brand-600" />
          {{ t(`regions.${branch.region}`) }}
        </li>
        <li v-if="branch.address" class="flex items-center gap-2">
          <UIcon name="i-lucide-map" class="size-4 shrink-0 text-ink-400" />
          <span class="min-w-0">{{ branch.address[locale] }}</span>
        </li>
      </ul>

      <div class="mt-2 flex flex-wrap items-center justify-between gap-x-4 gap-y-1">
        <ULink :to="telHref()" external raw class="inline-flex items-center gap-2 rounded-sm text-sm font-bold text-ink-950 tabular-nums hover:text-brand-700">
          <UIcon name="i-lucide-phone" class="size-4 shrink-0" />
          {{ COMPANY.phone.display }}
        </ULink>
        <UButton
          variant="link"
          size="md"
          trailing-icon="i-lucide-arrow-right"
          class="px-0 font-bold text-brand-700 hover:text-brand-800"
          @click="emit('show')"
        >
          {{ t('home.contact.showOnMap') }}
          <span class="sr-only">— {{ name }}</span>
        </UButton>
      </div>
    </div>
  </article>
</template>
