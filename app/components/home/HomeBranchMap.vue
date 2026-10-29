<script setup lang="ts">
import { BRANCHES, type Branch } from '#shared/branches'
import { YANDEX_LANG } from '#shared/company'
import type { Region } from '#shared/regions'
import type { Ymaps } from '~/utils/yandexMaps'

const props = defineProps<{
  visibleIds: readonly string[]
  selectedId: string | null
  region: Region | 'all'
}>()
const emit = defineEmits<{ select: [id: string] }>()

const { t } = useI18n()
const locale = useAppLocale()
const apiKey = useRuntimeConfig().public.yandexMapsApiKey

const container = useTemplateRef<HTMLElement>('container')
const status = ref<'loading' | 'ready' | 'error'>('loading')

const REGION_COLORS: Record<Region, string> = {
  karakalpakstan: '#38bdf8',
  khorezm: '#f9a8d4',
  navoi: '#4ade80',
  bukhara: '#fdba74',
  kashkadarya: '#fca5a5',
  surkhandarya: '#c084fc',
  samarkand: '#fde047',
  jizzakh: '#86efac',
  syrdarya: '#fb923c',
  tashkent: '#bef264',
  tashkentCity: '#facc15',
  namangan: '#a5b4fc',
  andijan: '#f472b6',
  fergana: '#2dd4bf',
}
const REGION_OPACITY = { normal: 0.5, chosen: 0.6, other: 0.15 }
const STREET_ZOOM = 9

let ymaps: Ymaps
let map: Ymaps
const placemarks = new Map<string, Ymaps>()
const regionShapes = new Map<Region, Ymaps[]>()
let resizeObserver: ResizeObserver | undefined

const LABEL_PLACEMENT: Record<string, 'left' | 'top'> = { toshkent: 'top', namangan: 'left', chortoq: 'top' }
const LABELS_MIN_ZOOM = 5.5
const ICON_SHAPE = {
  right: [[-14, -38], [120, 0]],
  left: [[-120, -38], [14, 0]],
  top: [[-60, -66], [60, 0]],
}

const toLatLng = (branch: Branch) => [branch.coordinates[1], branch.coordinates[0]]

const FIT_MARGIN = [70, 40, 110, 72]

function fitVisible() {
  const regionParts = props.region === 'all' ? undefined : regionShapes.get(props.region)
  if (regionParts?.length) {
    const ring = regionParts.flatMap(part => part.geometry.getCoordinates()[0])
    map.setBounds(ymaps.util.bounds.fromPoints(ring), { checkZoomRange: true, preciseZoom: true, zoomMargin: FIT_MARGIN, duration: 300 })
    return
  }
  const points = BRANCHES.filter(branch => props.visibleIds.includes(branch.id)).map(toLatLng)
  if (!points.length) return
  if (points.length === 1) {
    map.setCenter(points[0], 12, { duration: 300 })
    return
  }
  map.setBounds(ymaps.util.bounds.fromPoints(points), { checkZoomRange: true, preciseZoom: true, zoomMargin: FIT_MARGIN, duration: 300 })
}

function syncVisibility() {
  for (const [id, placemark] of placemarks)
    placemark.options.set('visible', props.visibleIds.includes(id))
}

function syncSelection(focus: boolean) {
  for (const [id, placemark] of placemarks) {
    const active = id === props.selectedId
    placemark.properties.set('active', active)
    placemark.options.set('zIndex', active ? 1000 : 0)
  }
  const branch = BRANCHES.find(item => item.id === props.selectedId)
  if (focus && branch) map.setCenter(toLatLng(branch), 15, { duration: 500 })
}

const MASK_AREA: [[number, number], [number, number]] = [[-10, 0], [80, 140]]
const VIEW_LIMIT = [[15, 25], [65, 105]]

async function highlightUzbekistan() {
  try {
    const { rings } = await $fetch<{ rings: [number, number][][] }>('/geo/uzbekistan.json')
    const latLngRings = rings.map(ring => ring.map(([lng, lat]) => [lat, lng]))
    const [[south, west], [north, east]] = MASK_AREA
    const outer = [[south, west], [north, west], [north, east], [south, east], [south, west]]
    map.geoObjects.add(new ymaps.Polygon([outer, ...latLngRings], {}, {
      fillColor: '#f7f7f8',
      fillOpacity: 0.72,
      strokeWidth: 0,
      interactivityModel: 'default#transparent',
      zIndex: 1,
    }))
    for (const ring of latLngRings) {
      map.geoObjects.add(new ymaps.Polygon([ring], {}, {
        fillOpacity: 0,
        strokeColor: '#dc2626',
        strokeOpacity: 0.85,
        strokeWidth: 2.5,
        interactivityModel: 'default#transparent',
        zIndex: 4,
      }))
    }
  }
  catch (error) {
    console.warn('[branches map] Uzbekistan outline unavailable:', error)
  }
}

interface RegionShape {
  id: Region
  polygons: [number, number][][][]
}

async function colorRegions() {
  try {
    const { regions } = await $fetch<{ regions: RegionShape[] }>('/geo/uzbekistan-regions.json')
    for (const region of regions) {
      const parts = region.polygons.map(polygon => new ymaps.Polygon(
        polygon.map(ring => ring.map(([lng, lat]) => [lat, lng])),
        { hintContent: t(`regions.${region.id}`) },
        {
          fillColor: REGION_COLORS[region.id],
          strokeColor: '#ffffff',
          strokeWidth: 1.5,
          interactivityModel: 'default#transparent',
          zIndex: region.id === 'tashkentCity' ? 3 : 2,
        },
      ))
      regionShapes.set(region.id, parts)
      for (const part of parts) map.geoObjects.add(part)
    }
    syncRegion()
  }
  catch (error) {
    console.warn('[branches map] region outlines unavailable:', error)
  }
}

function syncRegion() {
  for (const [id, parts] of regionShapes) {
    const base = props.region === 'all' ? REGION_OPACITY.normal : id === props.region ? REGION_OPACITY.chosen : REGION_OPACITY.other
    const opacity = map.getZoom() >= STREET_ZOOM ? base * 0.3 : base
    for (const part of parts) part.options.set('fillOpacity', opacity)
  }
}

onMounted(async () => {
  const element = container.value
  if (!element) return
  await whenNearViewport(element)
  try {
    ymaps = await loadYandexMaps(apiKey, YANDEX_LANG[locale.value])
  }
  catch {
    status.value = 'error'
    return
  }

  map = new ymaps.Map(element, { center: [41.4, 64.6], zoom: 5, controls: [] }, {
    suppressMapOpenBlock: true,
    yandexMapDisablePoiInteractivity: true,
    minZoom: 4,
    restrictMapArea: VIEW_LIMIT,
  })
  map.controls.add('zoomControl', { size: 'small', position: { left: 16, top: 16 } })
  map.controls.add('geolocationControl', { position: { left: 16, top: 96 } })
  map.behaviors.disable('scrollZoom')

  const PinLayout = ymaps.templateLayoutFactory.createClass(
    '<div class="mf-pin mf-pin--{{ properties.placement }}{% if properties.active %} mf-pin--active{% endif %}">'
    + '<svg class="mf-pin__icon" viewBox="0 0 28 36" aria-hidden="true"><path d="M14 0C6.3 0 0 6.2 0 13.9 0 24.3 14 36 14 36s14-11.7 14-22.1C28 6.2 21.7 0 14 0Z"/><circle cx="14" cy="13.5" r="5.5" fill="#fff"/></svg>'
    + '<span class="mf-pin__label">{{ properties.label }}</span></div>',
  )

  for (const branch of BRANCHES) {
    const placement = LABEL_PLACEMENT[branch.id] ?? 'right'
    const placemark = new ymaps.Placemark(toLatLng(branch), {
      label: branch.city[locale.value],
      placement,
      hintContent: t('home.contact.branchName', { city: branch.city[locale.value] }),
    }, {
      iconLayout: PinLayout,
      iconShape: { type: 'Rectangle', coordinates: ICON_SHAPE[placement] },
    })
    placemark.events.add('click', () => emit('select', branch.id))
    placemarks.set(branch.id, placemark)
    map.geoObjects.add(placemark)
  }

  const syncLabels = () => element.classList.toggle('mf-map--compact', map.getZoom() < LABELS_MIN_ZOOM)
  map.events.add('boundschange', () => {
    syncLabels()
    syncRegion()
  })

  resizeObserver = new ResizeObserver(() => {
    map.container.fitToViewport()
    if (!props.selectedId) fitVisible()
  })
  resizeObserver.observe(element)

  status.value = 'ready'
  syncVisibility()
  syncSelection(false)
  fitVisible()
  syncLabels()
  highlightUzbekistan()
  colorRegions()
})

watch(() => props.visibleIds, () => {
  if (status.value !== 'ready') return
  syncVisibility()
  fitVisible()
})
watch(() => props.region, () => {
  if (status.value === 'ready') syncRegion()
})
watch(() => props.selectedId, () => {
  if (status.value === 'ready') syncSelection(true)
})

onBeforeUnmount(() => {
  resizeObserver?.disconnect()
  map?.destroy()
})
</script>

<template>
  <div class="relative size-full bg-ink-100">
    <div ref="container" class="absolute inset-0" />

    <div v-if="status !== 'ready'" class="absolute inset-0 grid place-items-center p-6 text-center">
      <p v-if="status === 'loading'" class="flex items-center gap-2 text-sm font-medium text-ink-600">
        <UIcon name="i-lucide-loader-circle" class="size-5 animate-spin" />
        {{ t('a11y.loading') }}
      </p>
      <p v-else class="max-w-xs text-sm text-ink-600">
        <UIcon name="i-lucide-map-pin-off" class="mx-auto mb-2 block size-8 text-ink-400" />
        {{ t('home.contact.mapError') }}
      </p>
    </div>
  </div>
</template>

<style>
.mf-pin {
  position: absolute;
  bottom: 0;
  left: -14px;
  display: flex;
  align-items: flex-start;
  white-space: nowrap;
  cursor: pointer;
  transform-origin: 14px 100%;
  transition: transform 0.2s cubic-bezier(0.22, 1, 0.36, 1);
}

.mf-pin__icon {
  width: 28px;
  height: 36px;
  flex-shrink: 0;
  fill: #dc2626;
  filter: drop-shadow(0 2px 3px rgb(12 13 16 / 0.3));
}

.mf-pin__label {
  margin: 4px 0 0 -2px;
  padding: 4px 10px;
  border-radius: 8px;
  background: #dc2626;
  color: #fff;
  font: 700 13px/1.3 var(--font-sans);
  box-shadow: 0 2px 6px rgb(12 13 16 / 0.25);
}

.mf-pin--left {
  left: auto;
  right: -14px;
  flex-direction: row-reverse;
  transform-origin: calc(100% - 14px) 100%;
}

.mf-pin--left .mf-pin__label {
  margin: 4px -2px 0 0;
}

.mf-pin--top {
  left: 0;
  flex-direction: column-reverse;
  align-items: center;
  translate: -50% 0;
  transform-origin: 50% 100%;
}

.mf-pin--top .mf-pin__label {
  margin: 0 0 2px;
}

.mf-pin:hover,
.mf-pin--active {
  transform: scale(1.12);
}

.mf-map--compact .mf-pin:not(.mf-pin--active) .mf-pin__label {
  display: none;
}

.mf-pin--active .mf-pin__icon {
  fill: #991b1b;
}

.mf-pin--active .mf-pin__label {
  background: #991b1b;
}
</style>
