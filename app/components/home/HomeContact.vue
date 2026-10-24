<script setup lang="ts">
import { BRANCHES } from '#shared/branches'
import { REGIONS, type Region } from '#shared/regions'

const { t } = useI18n()
const locale = useAppLocale()

const query = ref('')
const region = ref<Region | 'all'>('all')
const view = ref<'map' | 'list'>('map')
const selectedId = ref<string | null>(null)

const mapPanel = useTemplateRef<HTMLElement>('mapPanel')

/**
 * Case-, apostrophe- and alphabet-insensitive: the site writes the new Uzbek alphabet, but visitors
 * may type the old one, so "toshkent", "Toşkent" and "fargona" all match.
 */
const normalize = (value: string) => value.toLocaleLowerCase()
  .replace(/ş/g, 'sh')
  .replace(/ç/g, 'ch')
  .replace(/ğ/g, 'g')
  .replace(/ö/g, 'o')
  .replace(/[ʻʼ'‘’`]/g, '')

const branches = computed(() => {
  const needle = normalize(query.value.trim())
  return BRANCHES.filter((branch) => {
    if (region.value !== 'all' && branch.region !== region.value) return false
    const haystack = [
      t('home.contact.branchName', { city: branch.city[locale.value] }),
      branch.city.uz,
      branch.city.ru,
      t(`regions.${branch.region}`),
      branch.address?.[locale.value] ?? '',
    ].join(' ')
    return normalize(haystack).includes(needle)
  })
})
const visibleIds = computed(() => branches.value.map(branch => branch.id))

const regionItems = computed(() => [
  { label: t('home.contact.allRegions'), value: 'all' as const },
  ...REGIONS.filter(item => BRANCHES.some(branch => branch.region === item))
    .map(item => ({ label: t(`regions.${item}`), value: item })),
])

const countLabel = computed(() => t('home.contact.count', { count: branches.value.length }))
const scopeLabel = computed(() => (region.value === 'all' ? t('home.contact.acrossCountry') : t(`regions.${region.value}`)))

function showOnMap(id: string) {
  selectedId.value = id
  view.value = 'map'
  // On phones the list sits under the map: bring the map back into view.
  nextTick(() => {
    const panel = mapPanel.value
    if (panel && panel.getBoundingClientRect().top < 0)
      panel.scrollIntoView({ block: 'start' })
  })
}

const listItem = (id: string) => document.getElementById(`branch-${id}`)

/** A pin click highlights its card and scrolls the side list to it. */
function selectFromMap(id: string) {
  selectedId.value = id
  nextTick(() => listItem(id)?.scrollIntoView({ block: 'nearest' }))
}

const toolbarInputUi = {
  base: 'h-12 rounded-xl bg-white text-ink-950 ring-ink-200 placeholder:text-ink-500 hover:ring-ink-300',
  leadingIcon: 'text-ink-500',
}
</script>

<template>
  <!-- On desktop the section fills the viewport below the sticky header. -->
  <section id="contacts" aria-labelledby="contacts-title" class="anchor-12 lg:anchor-8 border-t border-ink-100 bg-ink-50 py-12 lg:py-8">
    <UContainer>
      <!-- The design has no visible heading; keep one for screen readers and the section landmark. -->
      <h2 id="contacts-title" class="sr-only">
        {{ t('home.contact.title') }}
      </h2>

      <!-- Toolbar: search, region filter, map/list switch -->
      <div class="grid gap-3 rounded-2xl border border-ink-100 bg-white p-3 shadow-card sm:grid-cols-2 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_auto]">
        <UInput
          v-model="query"
          type="search"
          icon="i-lucide-search"
          size="xl"
          :placeholder="t('home.contact.searchPlaceholder')"
          :aria-label="t('home.contact.searchPlaceholder')"
          class="w-full"
          :ui="toolbarInputUi"
        />
        <USelect
          v-model="region"
          :items="regionItems"
          leading-icon="i-lucide-map-pin"
          size="xl"
          :aria-label="t('home.contact.regionFilter')"
          class="w-full"
          :ui="{ ...toolbarInputUi, base: `${toolbarInputUi.base} font-semibold`, leadingIcon: 'text-brand-600', trailingIcon: 'text-ink-500' }"
        />
        <div class="grid grid-cols-2 gap-3 sm:col-span-2 lg:col-span-1" role="group" :aria-label="t('home.contact.viewSwitch')">
          <UButton
            size="xl"
            icon="i-lucide-map"
            :color="view === 'map' ? 'primary' : 'neutral'"
            :variant="view === 'map' ? 'solid' : 'soft'"
            :aria-pressed="view === 'map'"
            class="h-12 justify-center rounded-xl px-7"
            @click="view = 'map'"
          >
            {{ t('home.contact.mapView') }}
          </UButton>
          <UButton
            size="xl"
            icon="i-lucide-list"
            :color="view === 'list' ? 'primary' : 'neutral'"
            :variant="view === 'list' ? 'solid' : 'soft'"
            :aria-pressed="view === 'list'"
            class="h-12 justify-center rounded-xl px-7"
            @click="view = 'list'"
          >
            {{ t('home.contact.listView') }}
          </UButton>
        </div>
      </div>

      <!--
        Map with the branch list beside it. The map stays mounted in list view, so it loads once.
        Desktop height: viewport minus header, section padding (4rem), toolbar (~4.6rem) and gap (1rem).
      -->
      <div v-show="view === 'map'" class="mt-4 grid gap-4 lg:h-[calc(100dvh-var(--header-height)-9.75rem)] lg:min-h-120 lg:grid-cols-12">
        <div ref="mapPanel" class="relative h-104 scroll-mt-24 overflow-hidden rounded-2xl border border-ink-200 sm:h-128 lg:col-span-8 lg:h-full">
          <ClientOnly>
            <HomeBranchMap :visible-ids="visibleIds" :selected-id="selectedId" :region="region" @select="selectFromMap" />
          </ClientOnly>

          <div class="pointer-events-none absolute bottom-12 left-4 flex items-center gap-3 rounded-xl bg-white/95 p-3 pr-5 shadow-raised backdrop-blur-sm">
            <span class="grid size-11 place-items-center rounded-lg bg-brand-600 text-white">
              <UIcon name="i-lucide-map-pin" class="size-6" />
            </span>
            <p class="leading-tight">
              <span class="block text-lg font-extrabold text-ink-950">{{ countLabel }}</span>
              <span class="text-sm text-ink-600">{{ scopeLabel }}</span>
            </p>
          </div>
        </div>

        <div class="flex flex-col rounded-2xl border border-ink-200 bg-white p-4 lg:col-span-4 lg:h-full lg:min-h-0">
          <div class="flex items-baseline justify-between gap-3 px-1 pb-3">
            <h3 class="text-xl font-extrabold text-ink-950">
              {{ t('home.contact.listTitle') }}
            </h3>
            <p class="text-sm font-medium text-ink-500" aria-live="polite">
              {{ countLabel }}
            </p>
          </div>

          <ul v-if="branches.length" class="relative -mx-1 grid min-h-0 flex-1 content-start gap-3 overflow-y-auto px-1 pb-1 max-lg:max-h-120">
            <li v-for="branch in branches" :id="`branch-${branch.id}`" :key="branch.id" class="scroll-my-2">
              <HomeBranchCard :branch="branch" :selected="branch.id === selectedId" @show="showOnMap(branch.id)" />
            </li>
          </ul>
          <p v-else class="grid flex-1 place-items-center py-10 text-center text-ink-500">
            {{ t('home.contact.noResults') }}
          </p>

          <UButton
            color="primary"
            variant="soft"
            size="lg"
            block
            trailing-icon="i-lucide-arrow-right"
            class="mt-3 rounded-xl text-brand-700"
            @click="view = 'list'"
          >
            {{ t('home.contact.allBranches') }}
          </UButton>
        </div>
      </div>

      <!-- List view -->
      <div v-if="view === 'list'" class="mt-4">
        <ul v-if="branches.length" class="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          <li v-for="branch in branches" :key="branch.id">
            <HomeBranchCard :branch="branch" :selected="branch.id === selectedId" @show="showOnMap(branch.id)" />
          </li>
        </ul>
        <p v-else class="rounded-2xl border border-ink-200 bg-white py-16 text-center text-ink-500">
          {{ t('home.contact.noResults') }}
        </p>
      </div>
    </UContainer>
  </section>
</template>
