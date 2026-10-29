export type Ymaps = any

let loading: Promise<Ymaps> | null = null

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
