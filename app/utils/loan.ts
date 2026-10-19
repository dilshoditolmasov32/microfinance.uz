/**
 * Monthly payment of an annuity loan (equal monthly payments).
 * @param principal loan amount in so'm
 * @param annualRatePct nominal annual rate, e.g. 48 for 48%
 * @param months number of monthly payments
 */
export function annuityPayment(principal: number, annualRatePct: number, months: number): number {
  if (months <= 0) return 0
  const monthlyRate = annualRatePct / 100 / 12
  if (monthlyRate === 0) return principal / months
  return (principal * monthlyRate) / (1 - (1 + monthlyRate) ** -months)
}

/** Formats so'm amounts as "26 521 107" (no-break spaces, no Intl, so SSR and client match). */
export function formatAmount(value: number): string {
  return Math.round(value).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ')
}
