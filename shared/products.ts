export type CollateralType = 'realEstate' | 'car' | 'gold'

export interface LoanProduct {
  /** URL segment: /{locale}/kredit/{slug}. Matches the legacy path /kredit/istemol. */
  slug: string
  /** Message key under `products.*` in i18n/locales. */
  key: string
  borrower: 'individual'
  currency: 'UZS'
  maxAmountMln: number
  maxTermMonths: number
  /** 0 means no grace period. */
  gracePeriodMonths: number
  repayment: 'equalMonthly'
  collateral: readonly CollateralType[]
  /** Settings for the website loan calculator. */
  calculator: {
    minAmountMln: number
    minTermMonths: number
    defaultAmountMln: number
    /**
     * Indicative annual rate used only for the example calculation; always shown next to the result.
     * The actual rate is set individually and stated in the contract.
     */
    indicativeAnnualRatePct: number
  }
}

/**
 * Loan products as published on microfinance.uz/kredit/istemol (reviewed 2026-10-19).
 *
 * Interest rate: the current site says "45%" in the product summary but "48% dan" in the terms
 * table, and its calculator reproduces exactly with 48% annual (annuity): 10 mln / 60 months →
 * 442 018 so'm per month. 48% is used as the indicative calculator rate until the organization
 * confirms it. See docs/INTEGRATION.md.
 */
export const LOAN_PRODUCTS: readonly [LoanProduct, ...LoanProduct[]] = [
  {
    slug: 'istemol',
    key: 'istemol',
    borrower: 'individual',
    currency: 'UZS',
    maxAmountMln: 300,
    maxTermMonths: 60,
    gracePeriodMonths: 0,
    repayment: 'equalMonthly',
    collateral: ['realEstate', 'car', 'gold'],
    // Ranges and default match the current site's calculator (1–300 mln, 3–60 months, 10 mln).
    calculator: {
      minAmountMln: 1,
      minTermMonths: 3,
      defaultAmountMln: 10,
      indicativeAnnualRatePct: 48,
    },
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
  /** Indicative annual rate (interest, or markup for murobaha); annuity payments. */
  annualRatePct: number
  /** Murobaha charges a markup, not interest: the result says "Ustama" instead of "Ortiqcha toʻlov". */
  markup: boolean
}

const consumerLoan = LOAN_PRODUCTS[0]

/**
 * Calculator options: the loan products plus murobaha, which has no product page yet.
 * Murobaha terms per the organization (2026-10-19): 20 % annual markup, other limits as the consumer loan.
 */
export const CALCULATOR_OPTIONS: readonly [CalculatorOption, ...CalculatorOption[]] = [
  ...LOAN_PRODUCTS.map(product => ({
    value: product.slug,
    labelKey: `products.${product.key}.name`,
    minAmountMln: product.calculator.minAmountMln,
    maxAmountMln: product.maxAmountMln,
    defaultAmountMln: product.calculator.defaultAmountMln,
    minTermMonths: product.calculator.minTermMonths,
    maxTermMonths: product.maxTermMonths,
    annualRatePct: product.calculator.indicativeAnnualRatePct,
    markup: false,
  })) as [CalculatorOption, ...CalculatorOption[]],
  {
    value: 'murobaha',
    labelKey: 'home.calculator.murobaha',
    minAmountMln: consumerLoan.calculator.minAmountMln,
    maxAmountMln: consumerLoan.maxAmountMln,
    defaultAmountMln: consumerLoan.calculator.defaultAmountMln,
    minTermMonths: consumerLoan.calculator.minTermMonths,
    maxTermMonths: consumerLoan.maxTermMonths,
    annualRatePct: 20,
    markup: true,
  },
]

export function findLoanProduct(slug: string): LoanProduct | undefined {
  return LOAN_PRODUCTS.find(product => product.slug === slug)
}

/** Locale-less path; wrap with useLocalePath() in the app. */
export const loanProductPath = (slug: string): string => `/kredit/${slug}`
