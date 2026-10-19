import type { RouteLocationRaw } from 'vue-router'

/**
 * Route to a homepage section (e.g. "contacts") that works from any page.
 * Use with ULink / UButton `to`; without the `exact` prop they don't add aria-current,
 * so same-page section links are not announced as the current page.
 */
export function useSectionLink() {
  const localePath = useLocalePath()
  return (section: string): RouteLocationRaw => ({ path: localePath('/'), hash: `#${section}` })
}
