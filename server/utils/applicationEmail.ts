import type { LoanApplication } from '#shared/application'
import { findLoanProduct } from '#shared/products'
import uz from '../../i18n/locales/uz.json'

const escapeHtml = (value: string) =>
  value.replace(/[&<>"']/g, char => `&#${char.charCodeAt(0)};`)

/** Notification email for the loan team, in Uzbek. */
export function applicationEmail(application: LoanApplication, submittedAt: Date) {
  const product = findLoanProduct(application.product)
  // Keeps a pasted multi-line name on one line in the subject.
  const name = application.name.replace(/\s+/g, ' ')
  const amount = `${application.amountMln} mln soʻm`
  const time = submittedAt.toLocaleString('uz-UZ', { timeZone: 'Asia/Tashkent' })

  const rows: [string, string][] = [
    ['Ism', name],
    ['Telefon', application.phone],
    ['Kredit turi', product ? uz.products[product.key as keyof typeof uz.products].name : application.product],
    ['Summa', amount],
    ['Garov', uz.collateral[application.collateral].title],
    ['Sayt tili', application.locale],
    ['Vaqt (Toshkent)', time],
  ]

  const html = `<h2 style="margin:0 0 16px">Yangi kredit arizasi</h2>
<table cellpadding="6" style="border-collapse:collapse;font:15px/1.4 sans-serif">
${rows.map(([label, value]) => `<tr><td style="color:#666">${label}</td><td><b>${
  label === 'Telefon' ? `<a href="tel:${value}">${value}</a>` : escapeHtml(value)
}</b></td></tr>`).join('\n')}
</table>`

  return {
    subject: `Yangi ariza: ${name}, ${amount}`,
    html,
    text: rows.map(([label, value]) => `${label}: ${value}`).join('\n'),
  }
}
