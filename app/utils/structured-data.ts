import { COMPANY, SITE_NAME } from '#shared/company'
import { LOCALE_LANGUAGE, type AppLocale } from '#shared/locales'

type JsonLdNode = Record<string, unknown>

const organizationId = (siteUrl: string) => absoluteUrl(siteUrl, '/#organization')
const websiteId = (siteUrl: string) => absoluteUrl(siteUrl, '/#website')

/**
 * schema.org Organization built only from verified company facts.
 * `logo` and `sameAs` are omitted until an official logo file and social profiles are provided.
 */
export function organizationSchema(siteUrl: string, locale: AppLocale): JsonLdNode {
  return {
    '@type': 'Organization',
    '@id': organizationId(siteUrl),
    'name': COMPANY.legalName[locale],
    'alternateName': COMPANY.brandName,
    'url': absoluteUrl(siteUrl),
    'email': COMPANY.email,
    'telephone': COMPANY.phone.e164,
    'address': {
      '@type': 'PostalAddress',
      'streetAddress': COMPANY.address.street[locale],
      'addressLocality': COMPANY.address.locality[locale],
      'addressCountry': COMPANY.address.countryCode,
    },
    'contactPoint': {
      '@type': 'ContactPoint',
      'telephone': COMPANY.phone.e164,
      'email': COMPANY.email,
      'contactType': 'customer service',
      'areaServed': COMPANY.address.countryCode,
    },
  }
}

export function websiteSchema(siteUrl: string, locale: AppLocale): JsonLdNode {
  return {
    '@type': 'WebSite',
    '@id': websiteId(siteUrl),
    'name': SITE_NAME,
    'url': absoluteUrl(siteUrl),
    'inLanguage': LOCALE_LANGUAGE[locale],
    'publisher': { '@id': organizationId(siteUrl) },
  }
}

export function breadcrumbSchema(items: ReadonlyArray<{ name: string; url: string }>): JsonLdNode {
  return {
    '@type': 'BreadcrumbList',
    'itemListElement': items.map((item, index) => ({
      '@type': 'ListItem',
      'position': index + 1,
      'name': item.name,
      'item': item.url,
    })),
  }
}
