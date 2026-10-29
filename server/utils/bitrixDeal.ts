import type { LoanApplication } from '#shared/application'
import type { CollateralType } from '#shared/products'
import uz from '../../i18n/locales/uz.json'

/**
 * The organization's Bitrix24 (brm.icorp.uz) runs CRM without leads, so an application becomes a
 * contact plus a deal, placed where the organization's own CRM forms put theirs.
 * Pipeline, stage and custom field ids belong to that portal (read on 2026-10-29).
 */
const DEAL_CATEGORY_ID = 0 // "Общая воронка"
const DEAL_STAGE_ID = 'NEW' // "Первичный контакт"
const UF_REGION = 'UF_CRM_1784787693457' // "Худуди", text
const UF_COLLATERAL = 'UF_CRM_1784789211337' // "Гаров тури", text
const UF_AMOUNT = 'UF_CRM_1784787471084' // "Кредит микдори", text

/** Values the CRM forms already write into "Гаров тури"; other types fall back to their Uzbek title. */
const COLLATERAL_CODES: Partial<Record<CollateralType, string>> = {
  realEstate: 'ko\'chmas_mul',
  car: 'avtomobil',
  gold: 'tilla_buyumlari',
}

type BitrixResponse<T> = { result?: T, error?: string, error_description?: string }

/**
 * Creates the deal through an inbound webhook with the "crm" scope
 * (https://<portal>/rest/<user id>/<secret>/). Reuses the contact with the same phone if there is one.
 * `assignees` are Bitrix24 user ids; one is picked at random. Empty = the webhook's owner.
 * Resolves to the new deal id; throws when Bitrix24 refuses.
 */
export async function createBitrixDeal(
  webhookUrl: string,
  assignees: number[],
  application: LoanApplication,
  submittedAt: Date,
) {
  const base = webhookUrl.replace(/\/+$/, '')
  async function call<T>(method: string, body: object): Promise<T> {
    const response = await $fetch<BitrixResponse<T>>(`${base}/${method}.json`, { method: 'POST', body, timeout: 10_000 })
    if (response?.result === undefined || response.result === null || response.result === false)
      throw new Error(`Bitrix24 ${method} failed: ${response?.error ?? 'no result'} ${response?.error_description ?? ''}`)
    return response.result
  }

  const { name, amount, rows } = applicationRows(application, submittedAt)
  const assignedById = assignees.length ? assignees[Math.floor(Math.random() * assignees.length)] : undefined

  const duplicates = await call<{ CONTACT?: number[] } | []>('crm.duplicate.findbycomm', {
    type: 'PHONE',
    values: [application.phone],
    entity_type: 'CONTACT',
  })
  const contactId = (!Array.isArray(duplicates) && duplicates.CONTACT?.[0]) || await call<number>('crm.contact.add', {
    fields: {
      NAME: name,
      PHONE: [{ VALUE: application.phone, VALUE_TYPE: 'MOBILE' }],
      SOURCE_ID: 'WEB',
      ...(assignedById && { ASSIGNED_BY_ID: assignedById }),
    },
  })

  return call<number>('crm.deal.add', {
    fields: {
      TITLE: `Sayt arizasi: ${name}, ${amount}`,
      CATEGORY_ID: DEAL_CATEGORY_ID,
      STAGE_ID: DEAL_STAGE_ID,
      CONTACT_ID: contactId,
      OPPORTUNITY: application.amountMln * 1_000_000,
      CURRENCY_ID: 'UZS',
      // "WEB" is "Веб-сайт", which keeps site applications apart from the CRM forms ("WEBFORM").
      SOURCE_ID: 'WEB',
      SOURCE_DESCRIPTION: 'microfinance.uz ariza formasi',
      COMMENTS: rows.map(([label, value]) => `${label}: ${value}`).join('\n'),
      [UF_REGION]: uz.regions[application.region],
      [UF_COLLATERAL]: COLLATERAL_CODES[application.collateral] ?? uz.collateral[application.collateral].title,
      [UF_AMOUNT]: amount,
      ...(assignedById && { ASSIGNED_BY_ID: assignedById }),
    },
    // Notifies the responsible employee.
    params: { REGISTER_SONET_EVENT: 'Y' },
  })
}
