<script setup lang="ts">
import type { NuxtError } from '#app'
import { COMPANY, telHref } from '#shared/company'

const props = defineProps<{ error: NuxtError }>()

useAppHead()

const { t } = useI18n()
const localePath = useLocalePath()

const status = computed(() => props.error.status ?? 500)
const isNotFound = computed(() => status.value === 404)
const title = computed(() => (isNotFound.value ? t('error.notFoundTitle') : t('error.genericTitle')))

useSeoMeta({
  title: () => title.value,
  robots: 'noindex, follow',
})

const goHome = () => clearError({ redirect: localePath('/') })
</script>

<template>
  <UApp>
    <NuxtLayout>
      <section aria-labelledby="error-title" class="py-24 sm:py-32">
        <UContainer class="max-w-3xl text-center">
          <p class="text-sm font-extrabold text-brand-700 tabular-nums">
            <span class="sr-only">{{ t('error.code') }}:</span>
            {{ status }}
          </p>
          <h1 id="error-title" class="mt-3 text-h2 font-extrabold">
            {{ title }}
          </h1>
          <p class="mx-auto mt-4 max-w-xl text-lead text-ink-600">
            {{ isNotFound ? t('error.notFoundText') : t('error.genericText') }}
          </p>
          <div class="mt-10 flex flex-col justify-center gap-3 sm:flex-row">
            <UButton size="lg" trailing-icon="i-lucide-arrow-right" @click="goHome">
              {{ t('actions.backHome') }}
            </UButton>
            <UButton :to="telHref()" external size="lg" color="neutral" variant="outline" leading-icon="i-lucide-phone">
              {{ COMPANY.phone.display }}
            </UButton>
          </div>
        </UContainer>
      </section>
    </NuxtLayout>
  </UApp>
</template>
