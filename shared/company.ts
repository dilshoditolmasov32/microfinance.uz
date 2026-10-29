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
  trustPhone: { e164: string; display: string }
  email: string
  supportEmail: string
  address: {
    display: Localized
    street: Localized
    locality: Localized
    countryCode: 'UZ'
    mapQuery: string
    coordinates: [number, number] | null
  }
  license: CompanyLicense | null
}

export const COMPANY: CompanyInfo = {
  brandName: SITE_NAME,
  legalName: {
    uz: '«Biznesni rivojlantiriş» mikromoliya taşkiloti',
    ru: 'Микрофинансовая организация «Развитие бизнеса»',
  },
  phone: {
    e164: '+998712027575',
    display: '+998 71 202 75 75',
  },
  trustPhone: {
    e164: '+998712025775',
    display: '+998 71 202 57 75',
  },
  email: 'info@microfinance.uz',
  supportEmail: 'support@microfinance.uz',
  address: {
    display: {
      uz: 'Toşkent ş., Laylitöğon köçasi, 266-A-uy',
      ru: 'г. Ташкент, ул. Лайлитугон, д. 266-А',
    },
    street: {
      uz: 'Laylitöğon köçasi, 266-A-uy',
      ru: 'ул. Лайлитугон, д. 266-А',
    },
    locality: {
      uz: 'Toşkent',
      ru: 'Ташкент',
    },
    countryCode: 'UZ',
    mapQuery: "Laylitog'on ko'chasi 266-A, Toshkent",
    coordinates: [69.227407, 41.321427],
  },
  license: null,
}

export const MARKETPLACE_URL: Localized = {
  uz: 'https://brb-marketplace.vercel.app/uz',
  ru: 'https://brb-marketplace.vercel.app/ru',
}

export const WORKING_HOURS: Localized = {
  uz: 'Duşanba – Juma, 09:00 – 18:00',
  ru: 'Понедельник – пятница, 09:00 – 18:00',
}

export const SUPPORT_URL = 'https://t.me/Biznes_mikromoliya'

export type SocialNetwork = 'instagram' | 'telegram' | 'youtube' | 'linkedin' | 'facebook'

export interface SocialLink {
  network: SocialNetwork
  name: string
  url: string
}

export const SOCIAL_LINKS: readonly SocialLink[] = [
  { network: 'instagram', name: 'Instagram', url: 'https://www.instagram.com/biznes.mikromoliya/' },
  { network: 'telegram', name: 'Telegram', url: SUPPORT_URL },
  { network: 'youtube', name: 'YouTube', url: 'https://www.youtube.com/@Biznes_Mikromoliya' },
  { network: 'facebook', name: 'Facebook', url: 'https://www.facebook.com/share/1BgukdEgQS/' },
]

export const telHref =(e164: string = COMPANY.phone.e164): string => `tel:${e164}`
export const mailtoHref = (email: string = COMPANY.email): string => `mailto:${email}`

function yandexMapParams(zoom: number): URLSearchParams {
  const { coordinates, mapQuery } = COMPANY.address
  if (!coordinates) return new URLSearchParams({ text: mapQuery, z: String(zoom) })
  const ll = coordinates.join(',')
  return new URLSearchParams({ ll, pt: `${ll},pm2rdm`, z: String(zoom) })
}

export const YANDEX_LANG: Record<AppLocale, string> = { uz: 'uz_UZ', ru: 'ru_RU' }

export const mapHref = (): string => `https://yandex.uz/maps/?${yandexMapParams(17)}`
