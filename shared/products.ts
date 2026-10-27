export type CollateralType = 'realEstate' | 'car' | 'gold' | 'salary' | 'pledge'

/** Message key under `documents.*` in i18n/locales. */
export type DocumentType = 'identity' | 'income' | 'collateral' | 'selfEmployed'

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
  /** Documents the borrower brings, in the order they are listed. */
  documents: readonly DocumentType[]
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
      const columnFrom = column === 0 ? 0 : RATE_SHEET.amountTiersMln[column - 1]! + 1
      const columnTo = RATE_SHEET.amountTiersMln[column]!
      // Only columns that overlap the product's amount range.
      if (rate != null && columnFrom <= product.maxAmountMln && columnTo >= product.minAmountMln)
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
    maxAmountMln: 50,
    minTermMonths: 3,
    maxTermMonths: 36,
    gracePeriodMonths: 0,
    collateral: ['salary'],
    documents: ['identity', 'income'],
    defaultAmountMln: 10,
  },
  {
    slug: 'garov-asosida-mikroqarz',
    key: 'garovMikroqarz',
    borrower: 'individual',
    currency: 'UZS',
    minAmountMln: 1,
    maxAmountMln: 100,
    minTermMonths: 3,
    // Loans up to 100 mln are not issued for longer than 36 months (rate sheet).
    maxTermMonths: 36,
    gracePeriodMonths: 0,
    collateral: ['realEstate', 'car', 'gold'],
    documents: ['identity', 'collateral'],
    defaultAmountMln: 30,
  },
  {
    slug: 'mikrokredit',
    key: 'mikrokredit',
    borrower: 'entrepreneur',
    currency: 'UZS',
    // Above 100 mln only: 100 mln itself is a mikroqarz.
    minAmountMln: 101,
    maxAmountMln: 300,
    minTermMonths: 3,
    maxTermMonths: 60,
    gracePeriodMonths: 0,
    collateral: ['realEstate', 'car', 'gold'],
    documents: ['identity', 'collateral', 'selfEmployed'],
    defaultAmountMln: 150,
  },
]

/**
 * One entry of the "Kredit turi" select in the calculator and the application form.
 * Both mikroqarz products (with and without collateral) share one entry.
 */
export interface LoanChoice {
  /** Sent with the application as `product`. */
  value: string
  /** Message key under `products.*` for the label. */
  key: string
  minAmountMln: number
  maxAmountMln: number
  defaultAmountMln: number
  minTermMonths: number
  maxTermMonths: number
  collateral: readonly CollateralType[]
}

function loanChoice(products: readonly [LoanProduct, ...LoanProduct[]]): LoanChoice {
  const [first] = products
  return {
    value: first.slug,
    key: first.key,
    minAmountMln: Math.min(...products.map(p => p.minAmountMln)),
    maxAmountMln: Math.max(...products.map(p => p.maxAmountMln)),
    defaultAmountMln: first.defaultAmountMln,
    minTermMonths: Math.min(...products.map(p => p.minTermMonths)),
    maxTermMonths: Math.max(...products.map(p => p.maxTermMonths)),
    collateral: [...new Set(products.flatMap(p => p.collateral))],
  }
}

const bySlug = (slug: string): LoanProduct => {
  const product = findLoanProduct(slug)
  if (!product)
    throw new Error(`Unknown loan product: ${slug}`)
  return product
}

export const LOAN_CHOICES: readonly [LoanChoice, ...LoanChoice[]] = [
  loanChoice([bySlug('mikroqarz'), bySlug('garov-asosida-mikroqarz')]),
  loanChoice([bySlug('mikrokredit')]),
]

export function findLoanChoice(value: string): LoanChoice | undefined {
  return LOAN_CHOICES.find(choice => choice.value === value)
}

export function findLoanProduct(slug: string): LoanProduct | undefined {
  return LOAN_PRODUCTS.find(product => product.slug === slug)
}

/** Locale-less path; wrap with useLocalePath() in the app. */
export const loanProductPath = (slug: string): string => `/kredit/${slug}`
