export const REGIONS = [
  'tashkentCity',
  'tashkent',
  'andijan',
  'bukhara',
  'fergana',
  'jizzakh',
  'namangan',
  'navoi',
  'kashkadarya',
  'karakalpakstan',
  'samarkand',
  'syrdarya',
  'surkhandarya',
  'khorezm',
] as const

export type Region = typeof REGIONS[number]

export const isRegion = (value: unknown): value is Region =>
  typeof value === 'string' && (REGIONS as readonly string[]).includes(value)
