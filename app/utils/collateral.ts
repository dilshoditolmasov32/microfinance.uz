import type { CollateralType, DocumentType } from '#shared/products'

/** Lucide icon per collateral type. */
export const COLLATERAL_ICON: Readonly<Record<CollateralType, string>> = {
  realEstate: 'i-lucide-house',
  car: 'i-lucide-car',
  gold: 'i-lucide-gem',
  salary: 'i-lucide-wallet',
  pledge: 'i-lucide-shield-check',
}

/** Lucide icon per required document. */
export const DOCUMENT_ICON: Readonly<Record<DocumentType, string>> = {
  identity: 'i-lucide-id-card',
  income: 'i-lucide-wallet',
  collateral: 'i-lucide-file-text',
  selfEmployed: 'i-lucide-badge-check',
}
