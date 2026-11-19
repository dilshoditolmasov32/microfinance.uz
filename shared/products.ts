export type CollateralType = 'realEstate' | 'car' | 'gold' | 'salary' | 'pledge'

export type DocumentType = 'identity' | 'income' | 'collateral' | 'selfEmployed'

export interface LoanProduct {
  slug: string
  key: string
  borrower: 'individual' | 'entrepreneur'
  currency: 'UZS'
  minAmountMln: number
  maxAmountMln: number
  minTermMonths: number
  maxTermMonths: number
  gracePeriodMonths: number
  collateral: readonly CollateralType[]
  documents: readonly DocumentType[]
  defaultAmountMln: number
}

// "Yangi yil" aksiyasi: barcha garovli kreditlar uchun yillik foiz stavkalari.
// gracePeriodMonths — har bir muddat qatori uchun imtiyozli davr (muddat ichiga kiradi,
// imtiyozli davrda faqat foiz to'lanadi, asosiy qarz qolgan oylarda annuitet bilan so'ndiriladi).
export const RATE_SHEET = {
  amountTiersMln: [100, 200, 300],
  termTiersMonths: [12, 24, 36, 48],
  ratesPct: [
    [43, 43, 43],
    [46, 46, 46],
    [48, 48, 48],
    [null, 55, 55],
  ] as const satisfies readonly (readonly (number | null)[])[],
  gracePeriodMonths: [2, 3, 6, 6] as const,
}

const tierIndex = (tiers: readonly number[], value: number) => {
  const index = tiers.findIndex(limit => value <= limit)
  return index === -1 ? tiers.length - 1 : index
}

export function annualRatePct(amountMln: number, months: number): number | null {
  const row = RATE_SHEET.ratesPct[tierIndex(RATE_SHEET.termTiersMonths, months)]!
  return row[tierIndex(RATE_SHEET.amountTiersMln, amountMln)] ?? null
}

export function gracePeriodForTerm(months: number): number {
  return RATE_SHEET.gracePeriodMonths[tierIndex(RATE_SHEET.termTiersMonths, months)]!
}

export function maxTermForAmount(amountMln: number, productMaxTermMonths: number): number {
  const column = tierIndex(RATE_SHEET.amountTiersMln, amountMln)
  const lastRow = RATE_SHEET.ratesPct.findLastIndex(row => row[column] != null)
  return Math.min(productMaxTermMonths, RATE_SHEET.termTiersMonths[lastRow]!)
}

export function rateRangePct(product: LoanProduct): [number, number] {
  const rates: number[] = []
  RATE_SHEET.termTiersMonths.forEach((_, row) => {
    RATE_SHEET.amountTiersMln.forEach((_, column) => {
      const rate = RATE_SHEET.ratesPct[row]![column]
      const columnFrom = column === 0 ? 0 : RATE_SHEET.amountTiersMln[column - 1]! + 1
      const columnTo = RATE_SHEET.amountTiersMln[column]!
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
    gracePeriodMonths: 6,
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
    maxTermMonths: 36,
    gracePeriodMonths: 6,
    collateral: ['realEstate', 'car', 'gold'],
    documents: ['identity', 'collateral'],
    defaultAmountMln: 30,
  },
  {
    slug: 'mikrokredit',
    key: 'mikrokredit',
    borrower: 'entrepreneur',
    currency: 'UZS',
    minAmountMln: 101,
    maxAmountMln: 300,
    minTermMonths: 3,
    maxTermMonths: 48,
    gracePeriodMonths: 6,
    collateral: ['realEstate', 'car', 'gold'],
    documents: ['identity', 'collateral', 'selfEmployed'],
    defaultAmountMln: 150,
  },
]

export interface LoanChoice {
  value: string
  key: string
  minAmountMln: number
  maxAmountMln: number
  defaultAmountMln: number
  minTermMonths: number
  maxTermMonths: number
  collateral: readonly CollateralType[]
}

const loanChoice = (product: LoanProduct): LoanChoice => ({
  value: product.slug,
  key: product.key,
  minAmountMln: product.minAmountMln,
  maxAmountMln: product.maxAmountMln,
  defaultAmountMln: product.defaultAmountMln,
  minTermMonths: product.minTermMonths,
  maxTermMonths: product.maxTermMonths,
  collateral: product.collateral,
})

export const LOAN_CHOICES = LOAN_PRODUCTS.map(loanChoice) as unknown as readonly [LoanChoice, ...LoanChoice[]]

export function findLoanChoice(value: string): LoanChoice | undefined {
  return LOAN_CHOICES.find(choice => choice.value === value)
}

export function findLoanProduct(slug: string): LoanProduct | undefined {
  return LOAN_PRODUCTS.find(product => product.slug === slug)
}

export const loanProductPath = (slug: string): string => `/kredit/${slug}`
