import type { CollateralType } from '#shared/products'

/** Lucide icon per collateral type. */
export const COLLATERAL_ICON: Readonly<Record<CollateralType, string>> = {
  realEstate: 'i-lucide-house',
  car: 'i-lucide-car',
  gold: 'i-lucide-gem',
  guarantor: 'i-lucide-user-check',
  salary: 'i-lucide-wallet',
  pledge: 'i-lucide-shield-check',
}
