export const GA_MEASUREMENT_ID = 'G-590T6XXDL3'

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void
  }
}

/** Reports a Google Analytics event; does nothing when the tag is not loaded (dev, ad blockers). */
export function sendGtagEvent(name: string) {
  if (import.meta.client)
    window.gtag?.('event', name)
}
