<script setup lang="ts">
import { COMPANY, mailtoHref, mapEmbedSrc, mapHref, telHref } from '#shared/company'

const { t } = useI18n()
const locale = useAppLocale()
</script>

<template>
  <section id="contacts" aria-labelledby="contacts-title" class="anchor-20 sm:anchor-24 border-t border-ink-100 bg-ink-50 py-20 sm:py-24">
    <UContainer>
      <UiSectionHeading
        id="contacts-title"
        :title="t('home.contact.title')"
        :lead="t('home.contact.lead')"
      />

      <!-- Map on the left, contact cards on the right; on phones the cards come first. -->
      <div class="mt-10 grid gap-6 lg:mt-12 lg:grid-cols-12 lg:gap-8">
        <ul class="grid gap-4 lg:order-2 lg:col-span-5">
          <li v-reveal="{ delay: 0, from: 'right' }" class="group/contact flex gap-5 rounded-xl border border-ink-200 bg-white p-6 transition-[border-color,box-shadow,translate] duration-300 ease-smooth hover:-translate-y-0.5 hover:border-brand-200 hover:shadow-card">
            <span class="grid size-11 shrink-0 place-items-center rounded-md bg-brand-50 text-brand-700 transition-colors duration-300 group-hover/contact:bg-brand-600 group-hover/contact:text-white">
              <UIcon name="i-lucide-phone" class="size-5" />
            </span>
            <div>
              <p class="text-sm text-ink-500">
                {{ t('contact.trustLine') }}
              </p>
              <NuxtLink external :to="telHref()" class="mt-1 inline-block rounded-sm text-xl font-extrabold tracking-tight text-ink-950 tabular-nums underline-offset-4 hover:text-brand-700 hover:underline">
                {{ COMPANY.phone.display }}
              </NuxtLink>
            </div>
          </li>
          <li v-reveal="{ delay: 100, from: 'right' }" class="group/contact flex gap-5 rounded-xl border border-ink-200 bg-white p-6 transition-[border-color,box-shadow,translate] duration-300 ease-smooth hover:-translate-y-0.5 hover:border-brand-200 hover:shadow-card">
            <span class="grid size-11 shrink-0 place-items-center rounded-md bg-brand-50 text-brand-700 transition-colors duration-300 group-hover/contact:bg-brand-600 group-hover/contact:text-white">
              <UIcon name="i-lucide-mail" class="size-5" />
            </span>
            <div class="min-w-0">
              <p class="text-sm text-ink-500">
                {{ t('contact.email') }}
              </p>
              <NuxtLink external :to="mailtoHref()" class="mt-1 inline-block rounded-sm text-lg font-bold break-all text-ink-950 underline-offset-4 hover:text-brand-700 hover:underline">
                {{ COMPANY.email }}
              </NuxtLink>
            </div>
          </li>
          <li v-reveal="{ delay: 200, from: 'right' }" class="group/contact flex gap-5 rounded-xl border border-ink-200 bg-white p-6 transition-[border-color,box-shadow,translate] duration-300 ease-smooth hover:-translate-y-0.5 hover:border-brand-200 hover:shadow-card">
            <span class="grid size-11 shrink-0 place-items-center rounded-md bg-brand-50 text-brand-700 transition-colors duration-300 group-hover/contact:bg-brand-600 group-hover/contact:text-white">
              <UIcon name="i-lucide-map-pin" class="size-5" />
            </span>
            <div>
              <p class="text-sm text-ink-500">
                {{ t('contact.address') }}
              </p>
              <p class="mt-1 text-lg font-bold text-ink-950">
                {{ COMPANY.address.display[locale] }}
              </p>
              <NuxtLink
                external
                :to="mapHref()"
                target="_blank"
                rel="noopener noreferrer"
                class="mt-3 inline-flex items-center gap-1.5 rounded-sm text-sm font-bold text-brand-700 underline-offset-4 hover:underline"
              >
                {{ t('actions.openMap') }}
                <UIcon name="i-lucide-arrow-up-right" class="size-4" />
                <span class="sr-only">({{ t('a11y.newTab') }})</span>
              </NuxtLink>
            </div>
          </li>
        </ul>

        <!-- Yandex Maps widget, loaded only when the section scrolls near; on desktop it matches the cards' height. -->
        <div v-reveal="{ from: 'left' }" class="h-80 overflow-hidden rounded-xl border border-ink-200 bg-ink-100 sm:h-96 lg:order-1 lg:col-span-7 lg:h-auto lg:min-h-96">
          <iframe
            :src="mapEmbedSrc(locale)"
            :title="t('contact.mapTitle')"
            loading="lazy"
            referrerpolicy="strict-origin-when-cross-origin"
            allowfullscreen
            class="size-full border-0"
          />
        </div>
      </div>
    </UContainer>
  </section>
</template>
