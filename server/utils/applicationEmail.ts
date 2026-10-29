import type { LoanApplication } from '#shared/application'
import { findLoanChoice } from '#shared/products'
import uz from '../../i18n/locales/uz.json'

const escapeHtml = (value: string) =>
  value.replace(/[&<>"']/g, char => `&#${char.charCodeAt(0)};`)

export function applicationRows(application: LoanApplication, submittedAt: Date) {
  const product = findLoanChoice(application.product)
  const name = application.name.replace(/\s+/g, ' ')
  const amount = `${application.amountMln} mln söm`
  const time = submittedAt.toLocaleString('uz-UZ', { timeZone: 'Asia/Tashkent' })

  const rows: [string, string][] = [
    ['Ism', name],
    ['Telefon', application.phone],
    ['Kredit turi', product ? uz.products[product.key as keyof typeof uz.products].name : application.product],
    ['Summa', amount],
    ['Taʼminot', uz.collateral[application.collateral].title],
    ['Hudud', uz.regions[application.region]],
    ['Sayt tili', application.locale],
    ['Vaqt (Toşkent)', time],
  ]
  return { name, amount, rows }
}

export function applicationEmail(application: LoanApplication, submittedAt: Date) {
  const { name, amount, rows } = applicationRows(application, submittedAt)

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
