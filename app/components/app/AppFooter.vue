<script setup lang="ts">
import { COMPANY, MARKETPLACE_URL, SOCIAL_LINKS, SUPPORT_URL, WORKING_HOURS, mailtoHref, mapHref, telHref, type SocialNetwork } from '#shared/company'
import { LOAN_PRODUCTS, loanProductPath } from '#shared/products'

const { t } = useI18n()
const localePath = useLocalePath()
const locale = useAppLocale()
const sectionLink = useSectionLink()

const year = new Date().getFullYear()

/** Same destinations as the offer cards on the homepage. */
const productLinks = computed<{ label: string, to?: string, href?: string }[]>(() => [
  { label: t('footer.islamic'), href: MARKETPLACE_URL[locale.value] },
  ...LOAN_PRODUCTS.map(product => ({ label: t(`products.${product.key}.name`), to: localePath(loanProductPath(product.slug)) })),
])

const companyLinks = computed(() => [
  { id: 'process', label: t('nav.process') },
  { id: 'faq', label: t('nav.faq') },
  { id: 'contacts', label: t('nav.contacts') },
])

const contacts = computed(() => [
  { icon: 'i-lucide-phone', label: COMPANY.phone.display, note: WORKING_HOURS[locale.value], to: telHref() },
  { icon: 'i-lucide-mail', label: COMPANY.email, note: t('footer.emailNote'), to: mailtoHref() },
  { icon: 'i-lucide-map-pin', label: COMPANY.address.display[locale.value], note: t('footer.addressNote'), to: mapHref(), newTab: true },
])

/** Icon and brand colour per network; white on the red hover background. */
const SOCIAL_ICONS: Record<SocialNetwork, { icon: string, color: string }> = {
  instagram: { icon: 'i-lucide-instagram', color: 'text-pink-500' },
  telegram: { icon: 'i-lucide-send', color: 'text-sky-400' },
  youtube: { icon: 'i-lucide-youtube', color: 'text-red-500' },
  linkedin: { icon: 'i-lucide-linkedin', color: 'text-sky-500' },
  facebook: { icon: 'i-lucide-facebook', color: 'text-blue-500' },
}

const headingClass = 'text-base font-bold text-white'
const linkClass = 'rounded-sm text-[0.9375rem] text-ink-300 transition-colors hover:text-white focus-visible:outline-white'
</script>

<template>
  <footer class="bg-ink-950 text-sm text-ink-300">
    <UContainer class="grid gap-12 py-14 sm:py-16 md:grid-cols-2 xl:grid-cols-[minmax(0,1fr)_auto_auto_14rem] xl:gap-10">
      <div>
        <AppLogo inverse :tagline="false" class="focus-visible:outline-white" />
        <p class="mt-5 max-w-sm text-[0.9375rem] leading-6">
          {{ COMPANY.legalName[locale] }}. {{ t('footer.tagline') }}
        </p>
        <ul v-if="SOCIAL_LINKS.length" class="mt-6 flex flex-wrap gap-3" :aria-label="t('a11y.social')">
          <li v-for="link in SOCIAL_LINKS" :key="link.name">
            <ULink
              :to="link.url"
              external
              target="_blank"
              rel="noopener"
              raw
              class="group/social grid size-12 place-items-center rounded-full bg-white/5 ring-1 ring-white/10 transition-colors hover:bg-brand-600 hover:ring-brand-600 focus-visible:outline-white"
            >
              <UIcon :name="SOCIAL_ICONS[link.network].icon" class="size-5.5 transition-colors group-hover/social:text-white" :class="SOCIAL_ICONS[link.network].color" />
              <span class="sr-only">{{ link.name }} ({{ t('a11y.newTab') }})</span>
            </ULink>
          </li>
        </ul>
      </div>

      <nav :aria-label="t('a11y.footerNav')" class="grid grid-cols-2 gap-8 xl:grid-cols-[auto_auto] xl:gap-10">
        <div>
          <h2 :class="headingClass">
            {{ t('footer.productsTitle') }}
          </h2>
          <ul class="mt-5 space-y-3.5">
            <li v-for="link in productLinks" :key="link.label">
              <ULink v-if="link.href" :to="link.href" external target="_blank" rel="noopener" raw :class="linkClass">
                {{ link.label }}<span class="sr-only"> ({{ t('a11y.newTab') }})</span>
              </ULink>
              <ULink v-else :to="link.to" raw :class="linkClass">
                {{ link.label }}
              </ULink>
            </li>
          </ul>
        </div>
        <div>
          <h2 :class="headingClass">
            {{ t('footer.companyTitle') }}
          </h2>
          <ul class="mt-5 space-y-3.5">
            <li v-for="link in companyLinks" :key="link.id">
              <ULink :to="sectionLink(link.id)" raw :class="linkClass">
                {{ link.label }}
              </ULink>
            </li>
          </ul>
        </div>
      </nav>

      <div>
        <h2 :class="headingClass">
          {{ t('footer.contactTitle') }}
        </h2>
        <ul class="mt-5 space-y-5">
          <li v-for="item in contacts" :key="item.icon" class="flex items-center gap-4">
            <span class="grid size-11 shrink-0 place-items-center rounded-full bg-brand-600 text-white">
              <UIcon :name="item.icon" class="size-5" />
            </span>
            <div class="min-w-0">
              <ULink
                :to="item.to"
                external
                :target="item.newTab ? '_blank' : undefined"
                :rel="item.newTab ? 'noopener' : undefined"
                raw
                class="rounded-sm text-[0.9375rem] font-bold wrap-break-word text-white underline-offset-4 hover:underline focus-visible:outline-white"
              >
                {{ item.label }}<span v-if="item.newTab" class="sr-only"> ({{ t('a11y.newTab') }})</span>
              </ULink>
              <p class="mt-0.5 text-ink-400">
                {{ item.note }}
              </p>
            </div>
          </li>
        </ul>
      </div>

      <div>
        <h2 :class="headingClass">
          {{ t('footer.trustTitle') }}
        </h2>
        <div class="mt-5 flex items-center gap-3">
          <UIcon name="i-lucide-shield-check" class="size-10 shrink-0 text-brand-500" />
          <p class="text-xs leading-5 text-ink-300">
            {{ t('footer.trustText') }}
          </p>
        </div>
        <ULink
          :to="telHref()"
          external
          raw
          class="mt-5 inline-block rounded-sm text-2xl font-extrabold tracking-tight whitespace-nowrap text-white underline-offset-4 hover:underline focus-visible:outline-white"
        >
          {{ COMPANY.phone.display }}
        </ULink>
        <UButton
          :to="SUPPORT_URL"
          external
          target="_blank"
          rel="noopener"
          size="xl"
          variant="outline"
          leading-icon="i-lucide-headset"
          trailing-icon="i-lucide-arrow-right"
          class="mt-5 w-full justify-between rounded-xl bg-transparent text-white ring-brand-600 hover:bg-brand-600/15 focus-visible:outline-white"
          :ui="{ leadingIcon: 'text-brand-500', trailingIcon: 'text-brand-500' }"
        >
          {{ t('footer.support') }}
          <span class="sr-only">({{ t('a11y.newTab') }})</span>
        </UButton>
      </div>
    </UContainer>

    <div class="border-t border-white/10">
      <UContainer class="flex flex-col gap-3 py-6 text-sm leading-6 text-ink-400 lg:flex-row lg:items-center lg:justify-between lg:gap-8 lg:pr-24">
        <p class="shrink-0">
          © {{ year }} {{ COMPANY.brandName }}. {{ t('footer.rights') }}
          <template v-if="COMPANY.license">
            {{ t('footer.license', { number: COMPANY.license.number }) }}
          </template>
        </p>
        <p class="max-w-md lg:text-right">
          {{ t('footer.disclaimer') }}
        </p>
      </UContainer>
    </div>
  </footer>
</template>
