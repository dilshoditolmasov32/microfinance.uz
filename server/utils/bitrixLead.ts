import type { LoanApplication } from '#shared/application'
import uz from '../../i18n/locales/uz.json'

/**
 * Creates a lead in Bitrix24 CRM through an inbound webhook (crm.lead.add).
 * `webhookUrl` looks like https://<portal>.bitrix24.uz/rest/<user id>/<secret>/ and must have the "crm" scope.
 * Resolves to the new lead id; throws when Bitrix24 refuses the lead.
 */
export async function createBitrixLead(webhookUrl: string, application: LoanApplication, submittedAt: Date) {
  const { name, amount, rows } = applicationRows(application, submittedAt)

  const response = await $fetch<{ result?: number, error?: string, error_description?: string }>(
    `${webhookUrl.replace(/\/+$/, '')}/crm.lead.add.json`,
    {
      method: 'POST',
      body: {
        fields: {
          TITLE: `Sayt arizasi: ${name}, ${amount}`,
          NAME: name,
          PHONE: [{ VALUE: application.phone, VALUE_TYPE: 'MOBILE' }],
          OPPORTUNITY: application.amountMln * 1_000_000,
          CURRENCY_ID: 'UZS',
          // "WEB" is the built-in "Web site" source.
          SOURCE_ID: 'WEB',
          SOURCE_DESCRIPTION: 'microfinance.uz ariza formasi',
          ADDRESS_PROVINCE: uz.regions[application.region],
          COMMENTS: rows.map(([label, value]) => `${label}: ${value}`).join('\n'),
        },
        // Notifies the responsible employee in Bitrix24.
        params: { REGISTER_SONET_EVENT: 'Y' },
      },
      timeout: 10_000,
    },
  )

  if (!response?.result)
    throw new Error(`Bitrix24 crm.lead.add failed: ${response?.error ?? 'no result'} ${response?.error_description ?? ''}`)
  return response.result
}
