import type { LoanProduct } from '#shared/products'

/**
 * Amount limit label: "100 mln dan ortiq, 300 mln sömgaça" when the product has a real lower
 * limit (minAmountMln 101 reads as "above 100"), otherwise just "50 mln sömgaça"
 * (1 mln is the general floor and not worth showing).
 */
export function useLoanAmountLabel() {
  const { t } = useI18n()
  return (product: LoanProduct) => product.minAmountMln > 1
    ? t('loan.values.amountRange', { min: product.minAmountMln - 1, max: product.maxAmountMln })
    : t('loan.values.amountUpTo', { amount: product.maxAmountMln })
}
