/** Joins a site origin and a path without doubling or dropping slashes. */
export function absoluteUrl(origin: string, path = '/'): string {
  return `${origin.replace(/\/+$/, '')}/${path.replace(/^\/+/, '')}`
}
