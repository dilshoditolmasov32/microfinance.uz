/**
 * Supported site languages. Every page is served under a locale prefix (/uz, /ru).
 * Imported by nuxt.config.ts, the app and the server (sitemap), so keep it dependency-free.
 */
export const LOCALES = ['uz', 'ru'] as const

export type AppLocale = (typeof LOCALES)[number]

export const DEFAULT_LOCALE: AppLocale = 'uz'

/** BCP 47 language tags used for `<html lang>`, hreflang and og:locale. */
export const LOCALE_LANGUAGE: Readonly<Record<AppLocale, string>> = {
  uz: 'uz-UZ',
  ru: 'ru-RU',
}

/** Native language names, shown in the language switcher. */
export const LOCALE_NAME: Readonly<Record<AppLocale, string>> = {
  uz: 'Özbekça',
  ru: 'Русский',
}

export function isAppLocale(value: unknown): value is AppLocale {
  return typeof value === 'string' && (LOCALES as readonly string[]).includes(value)
}

export type Localized = Readonly<Record<AppLocale, string>>
