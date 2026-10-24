/**
 * The Yandex Maps JavaScript API 2.1 global. Typed loosely: the site uses a handful of calls
 * (Map, Placemark, Polygon, GeoObject, templateLayoutFactory, util.bounds).
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Ymaps = any

let loading: Promise<Ymaps> | null = null

/**
 * Loads the API once per page. The language is fixed by the first load (the API cannot switch it),
 * which is fine because changing the site language reloads the page's route.
 */
export function loadYandexMaps(apiKey: string, lang: string): Promise<Ymaps> {
  if (loading) return loading
  loading = new Promise((resolve, reject) => {
    const params = new URLSearchParams({ lang })
    if (apiKey) params.set('apikey', apiKey)
    const script = document.createElement('script')
    script.src = `https://api-maps.yandex.ru/2.1/?${params}`
    script.async = true
    script.onload = () => {
      const ymaps = (window as unknown as { ymaps: Ymaps }).ymaps
      ymaps.ready(() => resolve(ymaps), reject)
    }
    script.onerror = () => {
      loading = null
      script.remove()
      reject(new Error('Yandex Maps failed to load'))
    }
    document.head.append(script)
  })
  return loading
}

/** Resolves once the element comes within `margin` of the viewport. */
export function whenNearViewport(element: Element, margin = '300px'): Promise<void> {
  return new Promise((resolve) => {
    const observer = new IntersectionObserver((entries) => {
      if (entries.some(entry => entry.isIntersecting)) {
        observer.disconnect()
        resolve()
      }
    }, { rootMargin: margin })
    observer.observe(element)
  })
}
