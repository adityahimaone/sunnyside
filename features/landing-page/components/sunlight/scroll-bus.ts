/**
 * One scroll listener for every sun effect.
 *
 * The overlay, the section beams and the golden-hour seam all need the same
 * three numbers once per frame: where the page is, how far it can go, and how
 * fast it is moving. Each adding its own `scroll` listener would triple the
 * work on the one thing that must stay cheap, so they subscribe here and a
 * single rAF-throttled listener feeds them all.
 *
 * Lenis writes the real scroll position and fires native `scroll` events, so
 * this follows the smoothed scroll without knowing Lenis exists.
 */

export type ScrollSample = {
  /** Current scrollTop in px. */
  y: number
  /** Viewport height in px. */
  vh: number
  /** 0 → 1 across the whole document. */
  progress: number
  /** Signed px per second, lightly smoothed. */
  velocity: number
}

type Listener = (sample: ScrollSample) => void

const listeners = new Set<Listener>()
let attached = false
let frame = 0
let lastY = 0
let lastT = 0
let velocity = 0

const read = (now: number): ScrollSample => {
  const doc = document.documentElement
  const y = window.scrollY
  const vh = window.innerHeight
  const range = Math.max(1, doc.scrollHeight - vh)
  const dt = Math.max(1, now - lastT)
  const instant = ((y - lastY) / dt) * 1000
  // Exponential smoothing: a single large Lenis step should bloom, not spike.
  velocity += (instant - velocity) * 0.18
  lastY = y
  lastT = now
  return { y, vh, progress: Math.min(1, Math.max(0, y / range)), velocity }
}

const tick = (now: number) => {
  frame = 0
  const sample = read(now)
  listeners.forEach((listener) => listener(sample))
  // Keep ticking until the smoothed velocity has decayed, otherwise a flick
  // would leave the flare stuck on: no scroll event arrives to bring it down.
  if (Math.abs(velocity) > 6) schedule()
}

const schedule = () => {
  if (!frame) frame = requestAnimationFrame(tick)
}

const attach = () => {
  if (attached) return
  attached = true
  lastY = window.scrollY
  lastT = performance.now()
  window.addEventListener('scroll', schedule, { passive: true })
  window.addEventListener('resize', schedule, { passive: true })
}

const detach = () => {
  if (!attached) return
  attached = false
  window.removeEventListener('scroll', schedule)
  window.removeEventListener('resize', schedule)
  if (frame) cancelAnimationFrame(frame)
  frame = 0
  velocity = 0
}

/** Subscribe to scroll samples. Returns the unsubscribe. Fires once immediately. */
export function subscribeScroll(listener: Listener): () => void {
  listeners.add(listener)
  attach()
  listener(read(performance.now()))
  return () => {
    listeners.delete(listener)
    if (listeners.size === 0) detach()
  }
}
