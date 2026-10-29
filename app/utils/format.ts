export function absoluteUrl(origin: string, path = '/'): string {
  return `${origin.replace(/\/+$/, '')}/${path.replace(/^\/+/, '')}`
}
