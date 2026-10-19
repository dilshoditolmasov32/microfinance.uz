/**
 * A number that glides to its new value instead of jumping (ease-out, `duration` ms).
 * The server and the first client render use the exact value; reduced motion skips the animation.
 */
export function useTweenedNumber(source: MaybeRefOrGetter<number>, duration = 450) {
  const value = ref(toValue(source))
  let frame = 0

  watch(() => toValue(source), (to) => {
    cancelAnimationFrame(frame)
    const from = value.value
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || from === to) {
      value.value = to
      return
    }
    const start = performance.now()
    const tick = (now: number) => {
      const progress = Math.min(1, (now - start) / duration)
      value.value = from + (to - from) * (1 - (1 - progress) ** 3)
      if (progress < 1) frame = requestAnimationFrame(tick)
    }
    frame = requestAnimationFrame(tick)
  })

  if (getCurrentInstance()) onBeforeUnmount(() => cancelAnimationFrame(frame))

  return value
}
