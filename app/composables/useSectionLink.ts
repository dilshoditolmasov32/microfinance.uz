import type { RouteLocationRaw } from 'vue-router'

export function useSectionLink() {
  const localePath = useLocalePath()
  return (section: string): RouteLocationRaw => ({ path: localePath('/'), hash: `#${section}` })
}
