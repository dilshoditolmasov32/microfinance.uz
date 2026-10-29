type RevealFrom = 'up' | 'left' | 'right' | 'scale'
type RevealValue = number | { delay?: number, from?: RevealFrom } | undefined

const DURATION_MS = 700

export default defineNuxtPlugin((nuxtApp) => {
  let observer: IntersectionObserver | undefined

  const finish = (el: HTMLElement) => {
    el.dataset.revealed = ''
    const delay = Number.parseInt(el.style.getPropertyValue('--reveal-delay')) || 0
    window.setTimeout(() => {
      delete el.dataset.reveal
      delete el.dataset.revealed
      el.style.removeProperty('--reveal-delay')
    }, delay + DURATION_MS + 50)
  }

  const getObserver = () => observer ??= new IntersectionObserver((entries) => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue
      observer!.unobserve(entry.target)
      finish(entry.target as HTMLElement)
    }
  }, { rootMargin: '0px 0px -8% 0px' })

  nuxtApp.vueApp.directive<HTMLElement, RevealValue>('reveal', {
    getSSRProps: () => ({}),
    mounted(el, { value }) {
      if (!('IntersectionObserver' in window) || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

      const rect = el.getBoundingClientRect()
      if (rect.top < window.innerHeight && rect.bottom > 0) return

      const { delay = 0, from = 'up' } = typeof value === 'number' ? { delay: value } : value ?? {}
      el.dataset.reveal = from
      if (delay) el.style.setProperty('--reveal-delay', `${delay}ms`)
      getObserver().observe(el)
    },
    beforeUnmount(el) {
      observer?.unobserve(el)
    },
  })
})
