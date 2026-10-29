<script setup lang="ts">
import type { FormError } from '@nuxt/ui'
import { formatUzPhone, invalidApplicationFields, toUzE164, type ApplicationField } from '#shared/application'
import { COMPANY, telHref } from '#shared/company'
import { type CollateralType, LOAN_CHOICES, findLoanChoice } from '#shared/products'
import { REGIONS, type Region } from '#shared/regions'
import { COLLATERAL_ICON } from '~/utils/collateral'

const ILLUSTRATION = '/images/forma-image.webp' as string | null

const { t } = useI18n()
const locale = useAppLocale()

const initialProduct = LOAN_CHOICES[0]

const state = reactive({
  product: initialProduct.value,
  name: '',
  phone: '',
  amountMln: initialProduct.defaultAmountMln,
  collateral: undefined as CollateralType | undefined,
  region: undefined as Region | undefined,
})
const website = ref('')
const status = ref<'idle' | 'pending' | 'success' | 'error'>('idle')
const successTitle = useTemplateRef<HTMLElement>('successTitle')
const phoneInput = useTemplateRef<{ inputRef: HTMLInputElement | null }>('phoneInput')

function onPhoneInput(value: unknown) {
  state.phone = formatUzPhone(String(value ?? ''))
  const el = phoneInput.value?.inputRef
  if (el && el.value !== state.phone)
    el.value = state.phone
}

const product = computed(() => findLoanChoice(state.product) ?? initialProduct)
const productItems = computed(() =>
  LOAN_CHOICES.map(item => ({ label: t(`products.${item.key}.name`), value: item.value })),
)
watch(product, (p) => {
  state.amountMln = Math.min(p.maxAmountMln, Math.max(p.minAmountMln, state.amountMln))
  if (p.collateral.length === 1)
    state.collateral = p.collateral[0]
  else if (state.collateral && !p.collateral.includes(state.collateral))
    state.collateral = undefined
}, { immediate: true })

const regionItems = computed(() => REGIONS.map(region => ({ label: t(`regions.${region}`), value: region })))

const collateralItems = computed(() =>
  product.value.collateral.map(type => ({ label: t(`collateral.${type}.title`), value: type, icon: COLLATERAL_ICON[type] })),
)

const payload = () => ({
  product: state.product,
  name: state.name.trim(),
  phone: toUzE164(state.phone),
  amountMln: state.amountMln,
  collateral: state.collateral,
  region: state.region,
  locale: locale.value,
})

const FIELD_ERRORS: Partial<Record<ApplicationField, string>> = {
  name: 'home.application.errors.name',
  phone: 'home.application.errors.phone',
  collateral: 'home.application.errors.collateral',
  region: 'home.application.errors.region',
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
    <NuxtImg
      v-if="ILLUSTRATION"
      :src="ILLUSTRATION"
      alt=""
      format="webp"
      width="1536"
      height="1024"
      sizes="lg:100vw xl:100vw 2xl:100vw"
      loading="lazy"
      class="pointer-events-none absolute inset-0 -z-10 hidden size-full object-cover object-[0%_70%] lg:block"
    />

    <UContainer class="grid w-full gap-12 lg:grid-cols-12 lg:items-center lg:gap-8">
      <div v-reveal="{ from: 'left' }" class="lg:col-span-5 lg:self-start lg:rounded-2xl lg:bg-white/80 lg:p-8 lg:shadow-card lg:backdrop-blur-sm">
        <h2 id="application-title" class="text-h2 font-extrabold lg:text-[clamp(2.25rem,2.9vw,2.875rem)] lg:leading-[1.08]">
          {{ t('home.application.titleLead') }}
          <span class="block text-brand-600">{{ t('home.application.titleAccent') }}</span>
        </h2>
        <p class="mt-4 max-w-md text-lead text-ink-600">
          {{ t('home.application.lead') }}
        </p>
      </div>

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
                  ref="phoneInput"
                  :model-value="state.phone"
                  type="tel"
                  inputmode="tel"
                  autocomplete="tel"
                  leading-icon="i-lucide-phone"
                  placeholder="+998 90 000 00 00"
                  size="lg"
                  class="w-full"
                  :ui="inputUi"
                  @update:model-value="onPhoneInput"
                />
              </UFormField>
            </div>

            <div class="grid gap-4 sm:grid-cols-2">
              <UFormField name="product" :label="t('home.application.form.product')" :ui="fieldUi">
                <USelect
                  v-model="state.product"
                  :items="productItems"
                  leading-icon="i-lucide-wallet"
                  size="lg"
                  class="w-full"
                  :ui="{ ...inputUi, base: `${inputUi.base} font-semibold`, trailingIcon: 'text-ink-500' }"
                />
              </UFormField>

              <UFormField name="region" :label="t('home.application.form.region')" :ui="fieldUi">
                <USelect
                  v-model="state.region"
                  :items="regionItems"
                  :placeholder="t('home.application.form.regionPlaceholder')"
                  leading-icon="i-lucide-map-pin"
                  size="lg"
                  class="w-full"
                  :ui="{ ...inputUi, base: `${inputUi.base} font-semibold`, trailingIcon: 'text-ink-500' }"
                />
              </UFormField>
            </div>

            <UiRangeSlider
              v-model="state.amountMln"
              dense
              :label="t('home.application.form.amount')"
              :min="product.minAmountMln"
              :max="product.maxAmountMln"
              :display="t('home.calculator.mlnSum', { value: state.amountMln })"
              :min-label="t('home.calculator.mlnSum', { value: product.minAmountMln })"
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
