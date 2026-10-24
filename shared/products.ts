export type CollateralType = 'realEstate' | 'car' | 'gold'

export interface LoanProduct {
  /** URL segment: /{locale}/kredit/{slug}. */
  slug: string
  /** Message key under `products.*` in i18n/locales. */
  key: string
  borrower: 'individual' | 'entrepreneur'
  currency: 'UZS'
  minAmountMln: number
  maxAmountMln: number
  minTermMonths: number
  maxTermMonths: number
  /** 0 means no grace period. */
  gracePeriodMonths: number
  collateral: readonly CollateralType[]
  /** Starting amount of the calculator and the application form. */
  defaultAmountMln: number
}

/**
 * Annual interest rates for all collateral loans, in force from 2026-06-01 (the organization's
 * rate sheet). Rows are term tiers, columns are amount tiers; null means the loan is not issued.
 */
export const RATE_SHEET = {
  effectiveFrom: '2026-06-01',
  /** Upper bound of each amount column, mln so'm, inclusive. */
  amountTiersMln: [100, 200, 300],
  /** Upper bound of each term row, months, inclusive. */
  termTiersMonths: [12, 24, 36, 60],
  ratesPct: [
    [45, 47, 48],
    [47, 48, 49],
    [48, 49, 50],
    [null, 50, 51],
  ] as const satisfies readonly (readonly (number | null)[])[],
}

const tierIndex = (tiers: readonly number[], value: number) => {
  const index = tiers.findIndex(limit => value <= limit)
  return index === -1 ? tiers.length - 1 : index
}

/** Annual rate for the amount and term, or null when that combination is not issued. */
export function annualRatePct(amountMln: number, months: number): number | null {
  const row = RATE_SHEET.ratesPct[tierIndex(RATE_SHEET.termTiersMonths, months)]!
  return row[tierIndex(RATE_SHEET.amountTiersMln, amountMln)] ?? null
}

/** Longest term issued for the amount: loans up to 100 mln run at most 36 months. */
export function maxTermForAmount(amountMln: number, productMaxTermMonths: number): number {
  const column = tierIndex(RATE_SHEET.amountTiersMln, amountMln)
  const lastRow = RATE_SHEET.ratesPct.findLastIndex(row => row[column] != null)
  return Math.min(productMaxTermMonths, RATE_SHEET.termTiersMonths[lastRow]!)
}

/** Lowest and highest rate a product can carry, for "45–48%" labels. */
export function rateRangePct(product: LoanProduct): [number, number] {
  const rates: number[] = []
  RATE_SHEET.termTiersMonths.forEach((_, row) => {
    RATE_SHEET.amountTiersMln.forEach((_, column) => {
      const rate = RATE_SHEET.ratesPct[row]![column]
      const lowestAmount = column === 0 ? product.minAmountMln : RATE_SHEET.amountTiersMln[column - 1]! + 1
      if (rate != null && lowestAmount <= product.maxAmountMln)
        rates.push(rate)
    })
  })
  return [Math.min(...rates), Math.max(...rates)]
}

export const LOAN_PRODUCTS: readonly [LoanProduct, ...LoanProduct[]] = [
  {
    slug: 'mikroqarz',
    key: 'mikroqarz',
    borrower: 'individual',
    currency: 'UZS',
    minAmountMln: 1,
    maxAmountMln: 100,
    minTermMonths: 3,
    // Loans up to 100 mln are not issued for longer than 36 months (rate sheet).
    maxTermMonths: 36,
    gracePeriodMonths: 0,
    collateral: ['realEstate', 'car', 'gold'],
    defaultAmountMln: 10,
  },
  {
    slug: 'mikrokredit',
    key: 'mikrokredit',
    borrower: 'entrepreneur',
    currency: 'UZS',
    minAmountMln: 1,
    maxAmountMln: 300,
    minTermMonths: 3,
    maxTermMonths: 60,
    gracePeriodMonths: 0,
    collateral: ['realEstate', 'car', 'gold'],
    defaultAmountMln: 50,
  },
]

/** One entry of the "Kredit turi" select in the home calculator. */
export interface CalculatorOption {
  value: string
  /** i18n key of the select label. */
  labelKey: string
  minAmountMln: number
  maxAmountMln: number
  defaultAmountMln: number
  minTermMonths: number
  maxTermMonths: number
  /** Murobaha charges a fixed annual markup instead of interest; loans use the rate sheet. */
  markupPct: number | null
}

/** Murobaha terms per the organization (2026-10-23): 30 % annual markup, 1–300 mln, 3–24 months. */
const MUROBAHA_MARKUP_PCT = 30

export const CALCULATOR_OPTIONS: readonly [CalculatorOption, ...CalculatorOption[]] = [
  ...LOAN_PRODUCTS.map(product => ({
    value: product.slug,
    labelKey: `products.${product.key}.name`,
    minAmountMln: product.minAmountMln,
    maxAmountMln: product.maxAmountMln,
    defaultAmountMln: product.defaultAmountMln,
    minTermMonths: product.minTermMonths,
    maxTermMonths: product.maxTermMonths,
    markupPct: null,
  })) as [CalculatorOption, ...CalculatorOption[]],
  {
    value: 'murobaha',
    labelKey: 'home.calculator.murobaha',
    minAmountMln: 1,
    maxAmountMln: 300,
    defaultAmountMln: 50,
    minTermMonths: 3,
    maxTermMonths: 24,
    markupPct: MUROBAHA_MARKUP_PCT,
  },
]

export function findLoanProduct(slug: string): LoanProduct | undefined {
  return LOAN_PRODUCTS.find(product => product.slug === slug)
}

/** Locale-less path; wrap with useLocalePath() in the app. */
export const loanProductPath = (slug: string): string => `/kredit/${slug}`
