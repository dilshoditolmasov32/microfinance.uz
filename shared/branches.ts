import { COMPANY } from './company'
import type { Localized } from './locales'
import type { Region } from './regions'

export interface Branch {
  id: string
  city: Localized
  region: Region
  /** [longitude, latitude], decoded from `plusCode`. */
  coordinates: [number, number]
  /** Google Plus Code the organization gave for the branch. */
  plusCode: string
  /** Street address, once the organization confirms it. */
  address?: Localized
  /** Building photo in public/. */
  photo?: string
}

/**
 * Branches per the organization (2026-10-24), given as Plus Codes. Street addresses, branch phone
 * numbers and photos are not known yet, except Tashkent, whose pin is the head office.
 */
export const BRANCHES: readonly Branch[] = [
  {
    id: 'toshkent',
    city: { uz: 'Toşkent', ru: 'Ташкент' },
    region: 'tashkentCity',
    coordinates: [69.228391, 41.322137],
    plusCode: '8JHF86CH+V92',
    address: COMPANY.address.display,
    // The head office building, as in the hero.
    photo: '/images/hero-image.webp',
  },
  {
    id: 'samarqand',
    city: { uz: 'Samarqand', ru: 'Самарканд' },
    region: 'samarkand',
    coordinates: [66.924297, 39.649313],
    plusCode: '8JF8JWXF+PPF',
  },
  {
    id: 'andijon',
    city: { uz: 'Andijon', ru: 'Андижан' },
    region: 'andijan',
    coordinates: [72.332453, 40.793112],
    plusCode: '8JGJQ8VJ+6XW',
  },
  {
    id: 'namangan',
    city: { uz: 'Namangan', ru: 'Наманган' },
    region: 'namangan',
    coordinates: [71.664922, 40.992787],
    plusCode: '8JHHXMV7+4X7',
  },
  {
    id: 'chortoq',
    city: { uz: 'Çortoq', ru: 'Чартак' },
    region: 'namangan',
    coordinates: [71.808266, 41.076487],
    plusCode: '8JHH3RG5+H8R',
  },
  {
    id: 'guliston',
    city: { uz: 'Guliston', ru: 'Гулистан' },
    region: 'syrdarya',
    coordinates: [68.766828, 40.507687],
    plusCode: '8JGCGQ58+3PG',
  },
  {
    id: 'urganch',
    city: { uz: 'Urganç', ru: 'Ургенч' },
    region: 'khorezm',
    coordinates: [60.629016, 41.551812],
    plusCode: '8JH2HJ2H+PJC',
  },
  {
    id: 'termiz',
    city: { uz: 'Termiz', ru: 'Термез' },
    region: 'surkhandarya',
    coordinates: [67.290563, 37.235937],
    plusCode: '8J9967PR+96',
  },
]

/** Yandex Maps page with a pin on the branch. */
export const branchMapHref = (branch: Branch): string => {
  const ll = branch.coordinates.join(',')
  return `https://yandex.uz/maps/?${new URLSearchParams({ ll, pt: `${ll},pm2rdm`, z: '16' })}`
}
