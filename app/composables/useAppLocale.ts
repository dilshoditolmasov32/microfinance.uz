import { DEFAULT_LOCALE, isAppLocale, type AppLocale } from '#shared/locales'

/** The active locale narrowed to the app's own union, for indexing localized data. */
export function useAppLocale() {
  const { locale } = useI18n()
  return computed<AppLocale>(() => (isAppLocale(locale.value) ? locale.value : DEFAULT_LOCALE))
}
