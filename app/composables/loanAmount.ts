import type { LoanProduct } from '#shared/products'

export function useLoanAmountLabel() {
  const { t } = useI18n()
  return (product: LoanProduct) => product.minAmountMln > 1
    ? t('loan.values.amountRange', { min: product.minAmountMln - 1, max: product.maxAmountMln })
    : t('loan.values.amountUpTo', { amount: product.maxAmountMln })
}
