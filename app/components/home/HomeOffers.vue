<script setup lang="ts">
import { LOAN_PRODUCTS, findLoanProduct, loanProductPath } from '#shared/products'

const { t } = useI18n()
const localePath = useLocalePath()
const toast = useToast()

const microloans = LOAN_PRODUCTS.filter(p => p.borrower === 'individual')
const microloanMaxMln = Math.max(...microloans.map(p => p.maxAmountMln))
const microloanChooserOpen = ref(false)
const microcredit = findLoanProduct('mikrokredit')!

function notifyMurobahaSoon() {
  toast.add({
    id: 'murobaha-soon',
    title: t('home.offers.murobaha.soonTitle'),
    description: t('home.offers.murobaha.soonText'),
    icon: 'i-lucide-clock',
    color: 'primary',
  })
}
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
          @select="notifyMurobahaSoon"
        />

        <HomeOfferCard
          v-reveal="120"
          tone="rose"
          icon="i-lucide-user-round"
          image="/images/microqarz.webp"
          :image-size="[1536, 1024]"
          :title="t('home.offers.microloan.title')"
          :text="t('home.offers.microloan.text')"
          :max-amount-mln="microloanMaxMln"
          :cta-label="t('home.offers.cta')"
          @select="microloanChooserOpen = true"
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
          :max-amount-mln="microcredit.maxAmountMln"
          :cta-label="t('home.offers.cta')"
          :to="localePath(loanProductPath(microcredit.slug))"
        />
      </div>

      <UModal
        v-model:open="microloanChooserOpen"
        :title="t('home.offers.microloan.title')"
        :description="t('home.offers.microloan.chooseText')"
        :ui="{ content: 'sm:max-w-4xl' }"
      >
        <template #body>
          <div class="grid gap-4 sm:grid-cols-2">
            <LoanProductCard v-for="product in microloans" :key="product.slug" :product="product" />
          </div>
        </template>
      </UModal>
    </UContainer>
  </section>
</template>
