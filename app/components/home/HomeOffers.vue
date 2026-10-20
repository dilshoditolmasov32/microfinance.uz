<script setup lang="ts">
import { MARKETPLACE_URL } from '#shared/company'
import { LOAN_PRODUCTS, loanProductPath } from '#shared/products'

/** Islamic finance card illustration (1024×1024, dark background). */
const ISLAMIC_PHOTO = '/images/islomiy-moliya.webp'
/** Consumer-loan card illustration (887×1774, portrait). Set to null to show the terms graphic instead. */
const CONSUMER_PHOTO = '/images/istemol-credit.webp' as string | null
/** The card visual is full width on phones, half the card on desktop. */
const PHOTO_SIZES = '100vw md:50vw lg:25vw'

const { t } = useI18n()
const localePath = useLocalePath()
const locale = useAppLocale()

const consumerLoan = LOAN_PRODUCTS[0]
</script>

<template>
  <section id="offers" aria-labelledby="offers-title" class="anchor-16 sm:anchor-20 lg:anchor-24 py-16 sm:py-20 lg:py-24">
    <UContainer>
      <UiSectionHeading id="offers-title" :title="t('home.offers.title')" />

      <div class="mt-10 grid gap-5 md:grid-cols-2 lg:mt-12 lg:gap-6">
        <HomeOfferCard
          v-reveal
          tone="sand"
          icon="i-mf-mihrab"
          :title="t('home.offers.islamic.title')"
          :text="t('home.offers.islamic.text')"
          :cta-label="t('home.offers.cta')"
          :href="MARKETPLACE_URL[locale]"
        >
          <template #visual>
            <div class="card-photo absolute inset-0">
              <!-- Keep the house and the handshake in view when cropped. -->
              <NuxtImg
                format="webp"
                :src="ISLAMIC_PHOTO"
                alt=""
                width="1024"
                height="1024"
                :sizes="PHOTO_SIZES"
                loading="lazy"
                class="size-full object-cover object-[50%_55%] transition-transform duration-700 ease-smooth group-hover/card:scale-105"
              />
            </div>
          </template>
        </HomeOfferCard>

        <HomeOfferCard
          v-reveal="120"
          icon="i-lucide-shopping-cart"
          :title="t('home.offers.consumer.title')"
          :text="t('home.offers.consumer.text')"
          :cta-label="t('home.offers.cta')"
          :to="localePath(loanProductPath(consumerLoan.slug))"
        >
          <template #visual>
            <div v-if="CONSUMER_PHOTO" class="card-photo absolute inset-0">
              <NuxtImg
                format="webp"
                :src="CONSUMER_PHOTO"
                alt=""
                width="887"
                height="1774"
                :sizes="PHOTO_SIZES"
                loading="lazy"
                class="size-full object-cover object-[55%_48%] transition-transform duration-700 ease-smooth group-hover/card:scale-105"
              />
            </div>

            <!-- Fallback graphic built from the published loan terms -->
            <div v-else class="absolute inset-0 overflow-hidden" aria-hidden="true">
              <span class="absolute -right-20 -bottom-24 size-80 rounded-full bg-brand-100/70" />
              <span class="absolute top-8 right-12 size-36 rounded-full border border-brand-100 bg-brand-50" />
              <div class="absolute inset-0 grid place-items-center lg:pl-6">
                <div class="w-52 -rotate-3 rounded-lg border border-ink-100 bg-white p-4 shadow-raised">
                  <div class="flex items-center gap-3">
                    <span class="grid size-9 place-items-center rounded-md bg-brand-50 text-brand-700">
                      <UIcon name="i-lucide-shopping-cart" class="size-5" />
                    </span>
                    <p class="text-sm font-bold text-ink-950">
                      {{ t('loan.figures.label') }}
                    </p>
                  </div>
                  <dl class="mt-4 space-y-3 border-t border-ink-100 pt-3">
                    <div>
                      <dt class="text-xs text-ink-500">
                        {{ t('loan.terms.amount') }}
                      </dt>
                      <dd class="mt-0.5 font-bold text-ink-950">
                        {{ t('loan.values.amountUpTo', { amount: consumerLoan.maxAmountMln }) }}
                      </dd>
                    </div>
                    <div>
                      <dt class="text-xs text-ink-500">
                        {{ t('loan.terms.term') }}
                      </dt>
                      <dd class="mt-0.5 font-bold text-ink-950">
                        {{ t('loan.values.termUpTo', { months: consumerLoan.maxTermMonths }) }}
                      </dd>
                    </div>
                  </dl>
                </div>
              </div>
            </div>
          </template>
        </HomeOfferCard>
      </div>

    </UContainer>
  </section>
</template>

<style scoped>
.card-photo {
  mask-image: linear-gradient(to bottom, #000 55%, transparent);
}

@media (min-width: 64rem) {
  .card-photo {
    mask-image: linear-gradient(to right, transparent, #000 30%);
  }
}
</style>
