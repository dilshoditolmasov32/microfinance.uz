export const LOCALES = ['uz', 'ru'] as const

export type AppLocale = (typeof LOCALES)[number]

export const DEFAULT_LOCALE: AppLocale = 'uz'

export const LOCALE_LANGUAGE: Readonly<Record<AppLocale, string>> = {
  uz: 'uz-UZ',
  ru: 'ru-RU',
}

export const LOCALE_NAME: Readonly<Record<AppLocale, string>> = {
  uz: 'Özbekça',
  ru: 'Русский',
}

export function isAppLocale(value: unknown): value is AppLocale {
  return typeof value === 'string' && (LOCALES as readonly string[]).includes(value)
}

export type Localized = Readonly<Record<AppLocale, string>>
