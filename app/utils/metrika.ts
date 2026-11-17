export const METRIKA_COUNTER_ID = 114296582

declare global {
  interface Window {
    ym?: (id: number, method: string, ...args: unknown[]) => void
  }
}

/** Reports a Yandex Metrika goal; does nothing when the counter is not loaded (dev, ad blockers). */
export function reachMetrikaGoal(goal: string) {
  if (import.meta.client)
    window.ym?.(METRIKA_COUNTER_ID, 'reachGoal', goal)
}
