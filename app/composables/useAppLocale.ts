import { DEFAULT_LOCALE, isAppLocale, type AppLocale } from '#shared/locales'

export function useAppLocale() {
  const { locale } = useI18n()
  return computed<AppLocale>(() => (isAppLocale(locale.value) ? locale.value : DEFAULT_LOCALE))
}
