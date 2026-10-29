import type { LoanApplication } from '#shared/application'
import type { CollateralType } from '#shared/products'
import uz from '../../i18n/locales/uz.json'

const DEAL_CATEGORY_ID = 0
const DEAL_STAGE_ID = 'NEW'
const UF_REGION = 'UF_CRM_1784787693457'
const UF_COLLATERAL = 'UF_CRM_1784789211337'
const UF_AMOUNT = 'UF_CRM_1784787471084'

const COLLATERAL_CODES: Partial<Record<CollateralType, string>> = {
  realEstate: 'ko\'chmas_mul',
  car: 'avtomobil',
  gold: 'tilla_buyumlari',
}

type BitrixResponse<T> = { result?: T, error?: string, error_description?: string }

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
      SOURCE_ID: 'WEB',
      SOURCE_DESCRIPTION: 'microfinance.uz ariza formasi',
      COMMENTS: rows.map(([label, value]) => `${label}: ${value}`).join('\n'),
      [UF_REGION]: uz.regions[application.region],
      [UF_COLLATERAL]: COLLATERAL_CODES[application.collateral] ?? uz.collateral[application.collateral].title,
      [UF_AMOUNT]: amount,
      ...(assignedById && { ASSIGNED_BY_ID: assignedById }),
    },
    params: { REGISTER_SONET_EVENT: 'Y' },
  })
}
