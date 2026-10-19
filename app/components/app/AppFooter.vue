<script setup lang="ts">
import { COMPANY, mailtoHref, telHref } from '#shared/company'
import { LOAN_PRODUCTS, loanProductPath } from '#shared/products'

const { t } = useI18n()
const localePath = useLocalePath()
const locale = useAppLocale()
const sectionLink = useSectionLink()

const year = new Date().getFullYear()

const companyLinks = computed(() => [
  { id: 'process', label: t('nav.process') },
  { id: 'faq', label: t('nav.faq') },
  { id: 'contacts', label: t('nav.contacts') },
])

const linkClass = 'rounded-sm text-ink-300 transition-colors hover:text-white focus-visible:outline-white'
</script>

<template>
  <footer class="bg-ink-950 text-sm text-ink-300">
    <UContainer class="grid gap-12 py-14 sm:py-16 lg:grid-cols-12 lg:gap-8">
      <div class="lg:col-span-4">
        <AppLogo inverse :tagline="false" class="focus-visible:outline-white" />
        <p class="mt-5 max-w-xs leading-6">
          {{ COMPANY.legalName[locale] }}. {{ t('footer.tagline') }}
        </p>
      </div>

      <nav :aria-label="t('a11y.footerNav')" class="grid grid-cols-2 gap-8 lg:col-span-4 lg:col-start-6">
        <div>
          <h2 class="text-sm font-bold text-white">
            {{ t('footer.productsTitle') }}
          </h2>
          <ul class="mt-4 space-y-3">
            <li v-for="product in LOAN_PRODUCTS" :key="product.slug">
              <NuxtLink :to="localePath(loanProductPath(product.slug))" :class="linkClass">
                {{ t(`products.${product.key}.name`) }}
              </NuxtLink>
            </li>
          </ul>
        </div>
        <div>
          <h2 class="text-sm font-bold text-white">
            {{ t('footer.companyTitle') }}
          </h2>
          <ul class="mt-4 space-y-3">
            <li v-for="link in companyLinks" :key="link.id">
              <ULink :to="sectionLink(link.id)" raw :class="linkClass">
                {{ link.label }}
              </ULink>
            </li>
          </ul>
        </div>
      </nav>

      <div class="lg:col-span-3 lg:col-start-10">
        <h2 class="text-sm font-bold text-white">
          {{ t('footer.contactTitle') }}
        </h2>
        <ul class="mt-4 space-y-3">
          <li>
            <NuxtLink external :to="telHref()" class="rounded-sm text-base font-bold text-white underline-offset-4 hover:underline focus-visible:outline-white">
              <span class="sr-only">{{ t('contact.trustLine') }}:</span>
              {{ COMPANY.phone.display }}
            </NuxtLink>
          </li>
          <li>
            <NuxtLink external :to="mailtoHref()" :class="linkClass">{{ COMPANY.email }}</NuxtLink>
          </li>
          <li class="leading-6">
            {{ COMPANY.address.display[locale] }}
          </li>
        </ul>
      </div>
    </UContainer>

    <div class="border-t border-white/10">
      <UContainer class="flex flex-col gap-3 py-6 text-xs leading-5 text-ink-400 lg:flex-row lg:items-start lg:justify-between lg:gap-8">
        <p class="shrink-0">
          © {{ year }} {{ COMPANY.brandName }}. {{ t('footer.rights') }}
          <template v-if="COMPANY.license">
            {{ t('footer.license', { number: COMPANY.license.number }) }}
          </template>
        </p>
        <p class="max-w-xl lg:text-right">
          {{ t('footer.disclaimer') }}
        </p>
      </UContainer>
    </div>
  </footer>
</template>
