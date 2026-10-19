import { isAppLocale, type AppLocale } from './locales'
import { type CollateralType, findLoanProduct } from './products'

/** Loan application sent from the homepage form to /api/applications. */
export interface LoanApplication {
  /** Loan product slug from shared/products.ts. */
  product: string
  name: string
  /** E.164, e.g. +998901234567. */
  phone: string
  amountMln: number
  collateral: CollateralType
  locale: AppLocale
}

export type ApplicationField = keyof LoanApplication

export const APPLICATION_NAME_MAX = 100

/** National part (9 digits) of an Uzbek phone number typed with or without the +998 prefix. */
export function uzPhoneNational(value: string): string {
  let digits = value.replace(/\D/g, '')
  if ((value.trim().startsWith('+') || digits.length > 9) && digits.startsWith('998'))
    digits = digits.slice(3)
  return digits.slice(0, 9)
}

/** Formats input as "+998 90 123 45 67" while typing. */
export function formatUzPhone(value: string): string {
  const n = uzPhoneNational(value)
  if (!n)
    return ''
  return ['+998', n.slice(0, 2), n.slice(2, 5), n.slice(5, 7), n.slice(7, 9)].filter(Boolean).join(' ')
}

export const toUzE164 = (value: string): string => `+998${uzPhoneNational(value)}`

/** Fields that fail validation. Shared by the form and the server route. */
export function invalidApplicationFields(input: Partial<Record<ApplicationField, unknown>>): ApplicationField[] {
  const invalid: ApplicationField[] = []
  const product = typeof input.product === 'string' ? findLoanProduct(input.product) : undefined
  const name = typeof input.name === 'string' ? input.name.trim() : ''
  const amount = input.amountMln

  if (!product)
    invalid.push('product')
  if (name.length < 2 || name.length > APPLICATION_NAME_MAX)
    invalid.push('name')
  if (typeof input.phone !== 'string' || !/^\+998\d{9}$/.test(input.phone))
    invalid.push('phone')
  if (
    typeof amount !== 'number' || !Number.isInteger(amount)
    || (product && (amount < product.calculator.minAmountMln || amount > product.maxAmountMln))
  )
    invalid.push('amountMln')
  if (!product?.collateral.includes(input.collateral as CollateralType))
    invalid.push('collateral')
  if (!isAppLocale(input.locale))
    invalid.push('locale')

  return invalid
}
