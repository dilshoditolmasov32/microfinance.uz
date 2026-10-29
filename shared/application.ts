import { isAppLocale, type AppLocale } from './locales'
import { type CollateralType, findLoanChoice } from './products'
import { isRegion, type Region } from './regions'

export interface LoanApplication {
  product: string
  name: string
  phone: string
  amountMln: number
  collateral: CollateralType
  region: Region
  locale: AppLocale
}

export type ApplicationField = keyof LoanApplication

export const APPLICATION_NAME_MAX = 100

export function uzPhoneNational(value: string): string {
  let digits = value.replace(/\D/g, '')
  if ((value.trim().startsWith('+') || digits.length > 9) && digits.startsWith('998'))
    digits = digits.slice(3)
  return digits.slice(0, 9)
}

export function formatUzPhone(value: string): string {
  const n = uzPhoneNational(value)
  if (!n)
    return ''
  return ['+998', n.slice(0, 2), n.slice(2, 5), n.slice(5, 7), n.slice(7, 9)].filter(Boolean).join(' ')
}

export const toUzE164 = (value: string): string => `+998${uzPhoneNational(value)}`

export function invalidApplicationFields(input: Partial<Record<ApplicationField, unknown>>): ApplicationField[] {
  const invalid: ApplicationField[] = []
  const product = typeof input.product === 'string' ? findLoanChoice(input.product) : undefined
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
    || (product && (amount < product.minAmountMln || amount > product.maxAmountMln))
  )
    invalid.push('amountMln')
  if (!product?.collateral.includes(input.collateral as CollateralType))
    invalid.push('collateral')
  if (!isRegion(input.region))
    invalid.push('region')
  if (!isAppLocale(input.locale))
    invalid.push('locale')

  return invalid
}
