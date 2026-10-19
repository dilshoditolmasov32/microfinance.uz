/**
 * `v-reveal`: fades an element in as it scrolls into view.
 *
 *   v-reveal                       fade up
 *   v-reveal="120"                 fade up after 120 ms (stagger lists with index * step)
 *   v-reveal="{ from: 'left' }"    'up' | 'left' | 'right' | 'scale' (left/right slide on desktop only)
 *
 * Progressive enhancement: the server renders everything visible. On the client only elements that are
 * still off screen get hidden, so nothing that is already in view flashes. Skipped for reduced motion.
 * Styles: `[data-reveal]` in app/assets/css/main.css.
 */
type RevealFrom = 'up' | 'left' | 'right' | 'scale'
type RevealValue = number | { delay?: number, from?: RevealFrom } | undefined

/** Matches the transition duration in main.css. */
const DURATION_MS = 700

export default defineNuxtPlugin((nuxtApp) => {
  let observer: IntersectionObserver | undefined

  const finish = (el: HTMLElement) => {
    el.dataset.revealed = ''
    // Hand the element back to its own classes (hover transforms, transitions) once it has arrived.
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
