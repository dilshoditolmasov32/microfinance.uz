export function annuityPayment(principal: number, annualRatePct: number, months: number): number {
  if (months <= 0) return 0
  const monthlyRate = annualRatePct / 100 / 12
  if (monthlyRate === 0) return principal / months
  return (principal * monthlyRate) / (1 - (1 + monthlyRate) ** -months)
}

export interface GraceSchedule {
  graceMonths: number
  gracePayment: number
  annuityMonths: number
  annuityPayment: number
  total: number
}

// Imtiyozli davr muddat ichida: birinchi graceMonths oyda faqat foiz,
// qolgan (months - graceMonths) oyda annuitet ("5 Yillik grafik (imtiyozli davr).xlsx" bilan bir xil).
export function graceSchedule(principal: number, annualRatePct: number, months: number, graceMonths: number): GraceSchedule {
  const grace = Math.max(0, Math.min(graceMonths, months - 1))
  const annuityMonths = months - grace
  const gracePayment = grace > 0 ? principal * annualRatePct / 100 / 12 : 0
  const payment = annuityPayment(principal, annualRatePct, annuityMonths)
  return {
    graceMonths: grace,
    gracePayment,
    annuityMonths,
    annuityPayment: payment,
    total: gracePayment * grace + payment * annuityMonths,
  }
}

export function formatAmount(value: number): string {
  return Math.round(value).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ')
}
