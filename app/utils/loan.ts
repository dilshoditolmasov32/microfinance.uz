export function annuityPayment(principal: number, annualRatePct: number, months: number): number {
  if (months <= 0) return 0
  const monthlyRate = annualRatePct / 100 / 12
  if (monthlyRate === 0) return principal / months
  return (principal * monthlyRate) / (1 - (1 + monthlyRate) ** -months)
}

export function formatAmount(value: number): string {
  return Math.round(value).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ')
}
