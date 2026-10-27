<script setup lang="ts">
import { COMPANY, mailtoHref, telHref } from '#shared/company'

const { t } = useI18n()
const route = useRoute()
const localePath = useLocalePath()
const locale = useAppLocale()
const sectionLink = useSectionLink()

const menuOpen = ref(false)

/** Homepage sections linked from the navigation. */
const sections = computed(() => [
  { id: 'offers', label: t('nav.packages') },
  { id: 'calculator', label: t('nav.calculator') },
  { id: 'application', label: t('nav.application') },
  { id: 'contacts', label: t('nav.contacts') },
])

const mobileSections = computed(() => [
  sections.value[0]!,
  { id: 'process', label: t('nav.process') },
  ...sections.value.slice(1),
])

watch(() => route.fullPath, () => {
  menuOpen.value = false
})

// Border appears once the page scrolls under the sticky header.
const isScrolled = ref(false)
const onScroll = () => {
  isScrolled.value = window.scrollY > 4
}
onMounted(() => {
  onScroll()
  window.addEventListener('scroll', onScroll, { passive: true })
})
onBeforeUnmount(() => window.removeEventListener('scroll', onScroll))

// Underline draws in from the left on hover.
const navLinkClass = 'relative rounded-md px-3 py-2 text-[0.9375rem] font-semibold text-ink-700 transition-colors duration-200 hover:text-brand-700 after:absolute after:inset-x-3 after:bottom-1 after:h-0.5 after:origin-left after:scale-x-0 after:rounded-full after:bg-brand-600 after:transition-transform after:duration-300 after:ease-smooth hover:after:scale-x-100'
const mobileLinkClass = 'group/link flex items-center justify-between py-4 text-lg font-bold text-ink-950 transition-colors duration-200 hover:text-brand-700'
</script>

<template>
  <header
    class="sticky top-0 z-40 border-b bg-white/95 backdrop-blur-sm transition-[border-color,box-shadow] duration-300 ease-smooth"
    :class="isScrolled ? 'border-ink-200 shadow-[0_6px_24px_-12px_rgb(12_13_16/0.18)]' : 'border-ink-100'"
  >
    <!-- Three parts: brand · navigation · language and call to action -->
    <UContainer class="flex h-16 items-center justify-between gap-3 sm:gap-5 lg:h-20">
      <AppLogo class="min-w-0" />

      <nav :aria-label="t('a11y.mainNav')" class="hidden shrink-0 xl:block">
        <ul class="flex items-center gap-0.5">
          <li>
            <ULink :to="localePath('/')" exact raw :class="navLinkClass" active-class="text-brand-700">
              {{ t('nav.home') }}
            </ULink>
          </li>
          <li v-for="item in sections" :key="item.id">
            <ULink :to="sectionLink(item.id)" raw :class="navLinkClass">
              {{ item.label }}
            </ULink>
          </li>
        </ul>
      </nav>

      <div class="flex shrink-0 items-center justify-end gap-2 sm:gap-3">
        <AppLanguageSwitcher />

        <UButton :to="sectionLink('application')" size="md" class="hidden md:inline-flex">
          {{ t('actions.apply') }}
        </UButton>

        <!-- Mobile and tablet menu: Nuxt UI handles focus trap, Escape, scroll lock and aria. -->
        <USlideover
          v-model:open="menuOpen"
          :title="t('a11y.mobileNav')"
          :description="t('brand.descriptor')"
          class="xl:hidden"
          :close="{ size: 'xl', color: 'neutral', variant: 'soft', square: true, class: '-mr-1 rounded-full bg-ink-100 text-ink-950 hover:bg-ink-200 active:bg-ink-200' }"
          :ui="{
            content: 'max-w-sm',
            // Same height as the site header; title and description stay for screen readers only.
            header: 'h-16 min-h-0 justify-between gap-3 border-b border-ink-100 px-4 py-0 sm:px-6',
            wrapper: 'sr-only',
            close: 'static',
            body: 'flex flex-col p-0 sm:p-0',
          }"
        >
          <UButton
            color="neutral"
            variant="ghost"
            icon="i-lucide-menu"
            size="lg"
            square
            class="-mr-2 xl:hidden"
            :aria-label="t('a11y.openMenu')"
          />

          <template #actions>
            <AppLogo class="min-w-0" @click="menuOpen = false" />
          </template>

          <template #body>
            <nav :aria-label="t('a11y.mobileNav')" class="px-4 sm:px-6">
              <ul class="divide-y divide-ink-100">
                <li>
                  <ULink :to="localePath('/')" exact raw :class="mobileLinkClass" active-class="text-brand-700" @click="menuOpen = false">
                    {{ t('nav.home') }}
                    <UIcon name="i-lucide-chevron-right" class="size-5 text-ink-400 transition-transform duration-200 ease-smooth group-hover/link:translate-x-1" />
                  </ULink>
                </li>
                <li v-for="item in mobileSections" :key="item.id">
                  <ULink :to="sectionLink(item.id)" raw :class="mobileLinkClass" @click="menuOpen = false">
                    {{ item.label }}
                    <UIcon name="i-lucide-chevron-right" class="size-5 text-ink-400 transition-transform duration-200 ease-smooth group-hover/link:translate-x-1" />
                  </ULink>
                </li>
              </ul>
            </nav>

            <div class="mt-auto space-y-3 px-4 pt-8 pb-6 sm:px-6">
              <UButton :to="sectionLink('application')" size="xl" block trailing-icon="i-lucide-arrow-right" :ui="{ trailingIcon: 'ms-0' }" @click="menuOpen = false">
                {{ t('actions.apply') }}
              </UButton>
              <UButton :to="telHref()" external size="xl" color="neutral" variant="outline" block leading-icon="i-lucide-phone">
                {{ COMPANY.phone.display }}
              </UButton>
              <UButton :to="mailtoHref()" external size="xl" color="neutral" variant="outline" block leading-icon="i-lucide-mail">
                {{ COMPANY.email }}
              </UButton>
              <p class="pt-2 text-sm text-ink-500">
                {{ COMPANY.address.display[locale] }}
              </p>
            </div>
          </template>
        </USlideover>
      </div>
    </UContainer>
  </header>
</template>
