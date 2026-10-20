import { invalidApplicationFields, type LoanApplication } from '#shared/application'

/**
 * Receives a loan application from the homepage form, emails it through Resend
 * (NUXT_RESEND_API_KEY + NUXT_APPLICATIONS_EMAIL_TO) and/or forwards it to the processing system
 * (NUXT_APPLICATIONS_ENDPOINT). With neither configured it answers 503, so the form never reports a
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

  const config = useRuntimeConfig(event)
  const emailTo = config.applicationsEmailTo.split(',').map(address => address.trim()).filter(Boolean)

  const application: LoanApplication = {
    product: body.product!,
    name: body.name!.trim(),
    phone: body.phone!,
    amountMln: body.amountMln!,
    collateral: body.collateral!,
    locale: body.locale!,
  }
  const submittedAt = new Date()

  const deliveries: Promise<unknown>[] = []
  if (config.resendApiKey && emailTo.length) {
    deliveries.push($fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${config.resendApiKey}` },
      body: { from: config.applicationsEmailFrom, to: emailTo, ...applicationEmail(application, submittedAt) },
      timeout: 10_000,
    }))
  }
  if (config.applicationsEndpoint) {
    deliveries.push($fetch(config.applicationsEndpoint, {
      method: 'POST',
      body: { ...application, submittedAt: submittedAt.toISOString() },
      headers: config.applicationsToken ? { Authorization: `Bearer ${config.applicationsToken}` } : undefined,
      timeout: 10_000,
    }))
  }
  if (!deliveries.length)
    throw createError({ statusCode: 503, statusMessage: 'Applications are not configured' })

  // Delivered once any channel accepted it; failures are logged for the operator.
  const results = await Promise.allSettled(deliveries)
  for (const result of results) {
    if (result.status === 'rejected')
      console.error('[applications] delivery failed:', result.reason)
  }
  if (!results.some(result => result.status === 'fulfilled'))
    throw createError({ statusCode: 502, statusMessage: 'Application was not delivered' })

  return { ok: true }
})
