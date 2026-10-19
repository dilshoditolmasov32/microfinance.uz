import { invalidApplicationFields, type LoanApplication } from '#shared/application'

/**
 * Receives a loan application from the homepage form and forwards it to the processing system
 * (NUXT_APPLICATIONS_ENDPOINT). Without an endpoint it answers 503, so the form never reports a
 * success that nobody receives. See docs/INTEGRATION.md.
 */
/** A real application is ~300 bytes; refuse anything far larger before reading it. */
const MAX_BODY_BYTES = 8 * 1024

export default defineEventHandler(async (event) => {
  const declaredLength = Number(getRequestHeader(event, 'content-length') ?? 0)
  if (declaredLength > MAX_BODY_BYTES)
    throw createError({ statusCode: 413, statusMessage: 'Payload too large' })

  const raw = await readRawBody(event)
  if (raw && new TextEncoder().encode(raw).length > MAX_BODY_BYTES)
    throw createError({ statusCode: 413, statusMessage: 'Payload too large' })

  const body = await readBody<Partial<LoanApplication> & { website?: unknown }>(event)

  // Honeypot: the hidden "website" field is filled only by bots.
  if (body?.website)
    return { ok: true }

  const invalid = invalidApplicationFields(body ?? {})
  if (invalid.length)
    throw createError({ statusCode: 422, statusMessage: 'Invalid application', data: { invalid } })

  const { applicationsEndpoint, applicationsToken } = useRuntimeConfig(event)
  if (!applicationsEndpoint)
    throw createError({ statusCode: 503, statusMessage: 'Applications are not configured' })

  const application: LoanApplication = {
    product: body.product!,
    name: body.name!.trim(),
    phone: body.phone!,
    amountMln: body.amountMln!,
    collateral: body.collateral!,
    locale: body.locale!,
  }

  try {
    await $fetch(applicationsEndpoint, {
      method: 'POST',
      body: { ...application, submittedAt: new Date().toISOString() },
      headers: applicationsToken ? { Authorization: `Bearer ${applicationsToken}` } : undefined,
      timeout: 10_000,
    })
  }
  catch {
    throw createError({ statusCode: 502, statusMessage: 'Application was not delivered' })
  }

  return { ok: true }
})
