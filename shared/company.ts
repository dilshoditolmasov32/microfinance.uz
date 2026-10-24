import type { AppLocale, Localized } from './locales'

export const SITE_NAME = 'Microfinance.uz'

export interface CompanyLicense {
  number: string
  issuedAt: string
}

export interface CompanyInfo {
  brandName: string
  legalName: Localized
  phone: { e164: string; display: string }
  email: string
  address: {
    display: Localized
    street: Localized
    locality: Localized
    countryCode: 'UZ'
    mapQuery: string
    /** Office pin as [longitude, latitude]; when null the map searches by `mapQuery`. */
    coordinates: [number, number] | null
  }
  license: CompanyLicense | null
}


export const COMPANY: CompanyInfo = {
  brandName: SITE_NAME,
  legalName: {
    uz: '«Biznesni rivojlantiriş» mikromoliya taşkiloti',
    ru: 'Микрофинансовая организация «Biznesni rivojlantirish»',
  },
  phone: {
    e164: '+998712027575',
    display: '+998 71 202 75 75',
  },
  email: 'info@microfinance.uz',
  address: {
    display: {
      uz: 'Toşkent ş., Laylitöğon köçasi, 266-A-uy',
      ru: 'г. Ташкент, ул. Laylitoʻgʻon, дом 266-A',
    },
    street: {
      uz: 'Laylitöğon köçasi, 266-A-uy',
      ru: 'ул. Laylitoʻgʻon, дом 266-A',
    },
    locality: {
      uz: 'Toşkent',
      ru: 'Ташкент',
    },
    countryCode: 'UZ',
    mapQuery: "Laylitog'on ko'chasi 266-A, Toshkent",
    // From https://yandex.uz/maps/-/CXFXQO6X
    coordinates: [69.227407, 41.321427],
  },
  license: null,
}

/**
 * BRB marketplace (installment purchases), linked from the Islamic finance card.
 * Note: as of 2026-10-19 the marketplace itself does not describe its financing as Islamic or
 * Sharia-compliant; see docs/INTEGRATION.md.
 */
export const MARKETPLACE_URL: Localized = {
  uz: 'https://brb-marketplace.vercel.app/uz',
  ru: 'https://brb-marketplace.vercel.app/ru',
}

/** Office and trust-line hours, as shown in the footer design (2026-10-23). */
export const WORKING_HOURS: Localized = {
  uz: 'Duşanba – Juma, 09:00 – 18:00',
  ru: 'Понедельник – пятница, 09:00 – 18:00',
}

/** Telegram support chat, opened by the footer "Support" button. */
export const SUPPORT_URL = 'https://t.me/Biznes_mikromoliya'

export type SocialNetwork = 'instagram' | 'telegram' | 'youtube' | 'linkedin' | 'facebook'

export interface SocialLink {
  network: SocialNetwork
  /** Accessible name; brand names are not translated. */
  name: string
  url: string
}

/**
 * Footer social icons and JSON-LD `sameAs`. LinkedIn is in the footer design but its profile URL
 * is not known yet; add it here when it is.
 */
export const SOCIAL_LINKS: readonly SocialLink[] = [
  { network: 'instagram', name: 'Instagram', url: 'https://www.instagram.com/biznes.mikromoliya/' },
  { network: 'telegram', name: 'Telegram', url: SUPPORT_URL },
  { network: 'youtube', name: 'YouTube', url: 'https://www.youtube.com/@Biznes_Mikromoliya' },
  { network: 'facebook', name: 'Facebook', url: 'https://www.facebook.com/share/1BgukdEgQS/' },
]

export const telHref =(e164: string = COMPANY.phone.e164): string => `tel:${e164}`
export const mailtoHref = (email: string = COMPANY.email): string => `mailto:${email}`

/** Yandex Maps location params: a pin on the exact coordinates, or an address search. */
function yandexMapParams(zoom: number): URLSearchParams {
  const { coordinates, mapQuery } = COMPANY.address
  if (!coordinates) return new URLSearchParams({ text: mapQuery, z: String(zoom) })
  const ll = coordinates.join(',')
  return new URLSearchParams({ ll, pt: `${ll},pm2rdm`, z: String(zoom) })
}

/** `lang` parameter of the Yandex Maps JavaScript API. */
export const YANDEX_LANG: Record<AppLocale, string> = { uz: 'uz_UZ', ru: 'ru_RU' }

/** Full Yandex Maps page with the head office, opened from the footer. */
export const mapHref = (): string => `https://yandex.uz/maps/?${yandexMapParams(17)}`
