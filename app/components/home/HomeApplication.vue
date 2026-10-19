<script setup lang="ts">
import type { FormError } from '@nuxt/ui'
import { formatUzPhone, invalidApplicationFields, toUzE164, type ApplicationField } from '#shared/application'
import { COMPANY, telHref } from '#shared/company'
import { type CollateralType, LOAN_PRODUCTS } from '#shared/products'
import { COLLATERAL_ICON } from '~/utils/collateral'

/**
 * Full-section background on desktop (1536×1024; the artwork fills the left ~58 %, light waves
 * the rest). Set to null to drop it.
 */
const ILLUSTRATION = '/logo/forma-image.png' as string | null

const { t } = useI18n()
const locale = useAppLocale()

const product = LOAN_PRODUCTS[0]

const state = reactive({
  name: '',
  phone: '',
  amountMln: product.calculator.defaultAmountMln,
  collateral: undefined as CollateralType | undefined,
})
/** Honeypot, hidden from people. */
const website = ref('')
const status = ref<'idle' | 'pending' | 'success' | 'error'>('idle')
/** Receives focus after sending, since the submit button it was on disappears. */
const successTitle = useTemplateRef<HTMLElement>('successTitle')

const collateralItems = computed(() =>
  product.collateral.map(type => ({ label: t(`collateral.${type}.title`), value: type, icon: COLLATERAL_ICON[type] })),
)

const payload = () => ({
  product: product.slug,
  name: state.name.trim(),
  phone: toUzE164(state.phone),
  amountMln: state.amountMln,
  collateral: state.collateral,
  locale: locale.value,
})

const FIELD_ERRORS: Partial<Record<ApplicationField, string>> = {
  name: 'home.application.errors.name',
  phone: 'home.application.errors.phone',
  collateral: 'home.application.errors.collateral',
}

function validate(): FormError[] {
  return invalidApplicationFields(payload()).flatMap((field) => {
    const key = FIELD_ERRORS[field]
    return key ? [{ name: field, message: t(key) }] : []
  })
}

async function onSubmit() {
  status.value = 'pending'
  try {
    await $fetch('/api/applications', { method: 'POST', body: { ...payload(), website: website.value } })
    status.value = 'success'
    await nextTick()
    successTitle.value?.focus()
  }
  catch {
    status.value = 'error'
  }
}

function reset() {
  Object.assign(state, { name: '', phone: '', amountMln: product.calculator.defaultAmountMln, collateral: undefined })
  status.value = 'idle'
}

const inputUi = {
  base: 'h-11 rounded-lg bg-ink-50 text-ink-950 ring-ink-100 placeholder:text-ink-500 hover:ring-ink-200',
  leadingIcon: 'text-ink-500',
}
const fieldUi = { label: 'text-sm font-semibold text-ink-700', container: 'mt-1.5' }
</script>

<template>
  <section
    id="application"
    aria-labelledby="application-title"
    class="anchor-16 sm:anchor-20 relative isolate overflow-hidden border-t border-ink-100 bg-linear-to-br from-white via-white to-brand-50 py-16 sm:py-20 lg:flex lg:min-h-[calc(100dvh-var(--header-height))] lg:scroll-mt-(--header-height) lg:items-center lg:py-8"
  >
    <span class="application-glow absolute -top-40 -left-40 -z-10 size-160 rounded-full" aria-hidden="true" />
    <!-- Full-bleed background on desktop; the artwork is on the left, so keep the left edge in view. -->
    <NuxtImg
      v-if="ILLUSTRATION"
      :src="ILLUSTRATION"
      alt=""
      format="webp"
      width="1536"
      height="1024"
      sizes="lg:100vw"
      loading="lazy"
      class="pointer-events-none absolute inset-0 -z-10 hidden size-full object-cover object-[0%_70%] lg:block"
    />

    <!-- On desktop the section fills the viewport below the sticky header. -->
    <UContainer class="grid w-full gap-12 lg:grid-cols-12 lg:items-center lg:gap-8">
      <!-- Copy: pinned to the top on desktop, on a translucent panel so it reads over the artwork. -->
      <div v-reveal="{ from: 'left' }" class="lg:col-span-5 lg:self-start lg:rounded-2xl lg:bg-white/80 lg:p-8 lg:shadow-card lg:backdrop-blur-sm">
        <h2 id="application-title" class="text-h2 font-extrabold lg:text-[clamp(2.25rem,2.9vw,2.875rem)] lg:leading-[1.08]">
          {{ t('home.application.titleLead') }}
          <span class="block text-brand-600">{{ t('home.application.titleAccent') }}</span>
        </h2>
        <p class="mt-4 max-w-md text-lead text-ink-600">
          {{ t('home.application.lead') }}
        </p>
      </div>

      <!-- Form card -->
      <div v-reveal="{ delay: 120, from: 'right' }" class="rounded-2xl border border-ink-100 bg-white p-6 shadow-raised sm:p-8 lg:col-span-7 lg:col-start-6 xl:col-span-6 xl:col-start-7">
        <div v-if="status === 'success'" class="py-10 text-center" role="status">
          <span class="mx-auto grid size-16 place-items-center rounded-full bg-brand-50 text-brand-600">
            <UIcon name="i-lucide-circle-check" class="size-8" />
          </span>
          <h3 ref="successTitle" tabindex="-1" class="mt-6 text-h3 font-extrabold outline-none">
            {{ t('home.application.success.title') }}
          </h3>
          <p class="mx-auto mt-2 max-w-xs text-ink-600">
            {{ t('home.application.success.text') }}
          </p>
          <UButton color="neutral" variant="outline" size="lg" class="mt-8" @click="reset">
            {{ t('home.application.success.again') }}
          </UButton>
        </div>

        <template v-else>
          <h3 class="text-center text-2xl leading-tight font-extrabold tracking-tight">
            {{ t('home.application.form.title') }}
          </h3>

          <UForm :state="state" :validate="validate" class="mt-5 grid gap-4" @submit="onSubmit">
            <div class="grid gap-4 sm:grid-cols-2">
              <UFormField name="name" :label="t('home.application.form.name')" :ui="fieldUi">
                <UInput
                  v-model="state.name"
                  leading-icon="i-lucide-user"
                  :placeholder="t('home.application.form.namePlaceholder')"
                  autocomplete="name"
                  :maxlength="100"
                  size="lg"
                  class="w-full"
                  :ui="inputUi"
                />
              </UFormField>

              <UFormField name="phone" :label="t('home.application.form.phone')" :ui="fieldUi">
                <UInput
                  :model-value="state.phone"
                  type="tel"
                  inputmode="tel"
                  autocomplete="tel"
                  leading-icon="i-lucide-phone"
                  placeholder="+998 90 000 00 00"
                  size="lg"
                  class="w-full"
                  :ui="inputUi"
                  @update:model-value="state.phone = formatUzPhone(String($event ?? ''))"
                />
              </UFormField>
            </div>

            <UiRangeSlider
              v-model="state.amountMln"
              dense
              :label="t('home.application.form.amount')"
              :min="product.calculator.minAmountMln"
              :max="product.maxAmountMln"
              :display="t('home.calculator.mlnSum', { value: state.amountMln })"
              :min-label="t('home.calculator.mlnSum', { value: product.calculator.minAmountMln })"
              :max-label="t('home.calculator.mlnSum', { value: product.maxAmountMln })"
              :step-labels="{ decrease: t('home.application.form.decrease'), increase: t('home.application.form.increase') }"
            />

            <UFormField name="collateral" :label="t('home.application.form.collateral')" :ui="fieldUi">
              <USelect
                v-model="state.collateral"
                :items="collateralItems"
                :placeholder="t('home.application.form.collateralPlaceholder')"
                leading-icon="i-lucide-layers"
                size="lg"
                class="w-full"
                :ui="{ ...inputUi, base: `${inputUi.base} font-semibold`, trailingIcon: 'text-ink-500' }"
              />
            </UFormField>

            <!-- Honeypot -->
            <div class="hidden" aria-hidden="true">
              <label>Website <input v-model="website" type="text" name="website" tabindex="-1" autocomplete="off"></label>
            </div>

            <UAlert
              v-if="status === 'error'"
              color="error"
              variant="subtle"
              icon="i-lucide-circle-alert"
              :title="t('home.application.failed.title')"
              role="alert"
            >
              <template #description>
                {{ t('home.application.failed.text') }}
                <NuxtLink external :to="telHref()" class="font-bold whitespace-nowrap underline underline-offset-2">
                  {{ COMPANY.phone.display }}
                </NuxtLink>
              </template>
            </UAlert>

            <UButton
              type="submit"
              size="lg"
              class="h-12"
              block
              trailing-icon="i-lucide-arrow-right"
              :ui="{ trailingIcon: 'ms-0' }"
              :loading="status === 'pending'"
            >
              {{ t('home.application.form.submit') }}
            </UButton>
          </UForm>
        </template>
      </div>
    </UContainer>
  </section>
</template>

<style scoped>
.application-glow {
  background: radial-gradient(circle, rgb(254 226 226 / 0.55), transparent 65%);
}
</style>
