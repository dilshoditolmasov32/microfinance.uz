<script setup lang="ts">
import { MARKETPLACE_URL } from '#shared/company'
import { LOAN_PRODUCTS, loanProductPath } from '#shared/products'

const { t } = useI18n()
const localePath = useLocalePath()
const locale = useAppLocale()

const [microloan, microcredit] = LOAN_PRODUCTS
</script>

<template>
  <section id="offers" aria-labelledby="offers-title" class="anchor-16 sm:anchor-20 lg:anchor-24 py-16 sm:py-20 lg:py-24">
    <UContainer>
      <UiSectionHeading id="offers-title" :title="t('home.offers.title')" />

      <div class="mt-10 grid gap-5 lg:mt-12 lg:gap-6 xl:grid-cols-3">
        <HomeOfferCard
          v-reveal
          tone="green"
          icon="i-mf-mihrab"
          image="/images/murobaha-card.webp"
          :image-size="[820, 1280]"
          photo-position="object-[50%_45%]"
          :title="t('home.offers.murobaha.title')"
          :text="t('home.offers.murobaha.text')"
          :cta-label="t('home.offers.cta')"
          :href="MARKETPLACE_URL[locale]"
        />

        <HomeOfferCard
          v-reveal="120"
          tone="rose"
          icon="i-lucide-user-round"
          image="/images/microqarz.webp"
          :image-size="[1536, 1024]"
          :title="t('home.offers.microloan.title')"
          :text="t('home.offers.microloan.text')"
          :max-amount-mln="microloan.maxAmountMln"
          :cta-label="t('home.offers.cta')"
          :to="localePath(loanProductPath(microloan.slug))"
        />

        <HomeOfferCard
          v-reveal="240"
          tone="blue"
          icon="i-lucide-briefcase-business"
          image="/images/microcredit.webp"
          :image-size="[1311, 1200]"
          photo-class="sm:right-0 sm:w-[65%] xl:right-[-18%] xl:w-full"
          :title="t('home.offers.microcredit.title')"
          :text="t('home.offers.microcredit.text')"
          :max-amount-mln="microcredit!.maxAmountMln"
          :cta-label="t('home.offers.cta')"
          :to="localePath(loanProductPath(microcredit!.slug))"
        />
      </div>
    </UContainer>
  </section>
</template>
