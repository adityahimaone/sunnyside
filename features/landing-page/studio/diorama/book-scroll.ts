import { useEffect, type RefObject } from 'react'

/**
 * Scroll drives a pop-up book. The section is a tall rail with a sticky stage;
 * how far the rail has scrolled is `p`, 0 to 1, and everything on the stage is
 * a pure function of it:
 *
 *   0.00 – 0.04  the closed book sits still, so the page has a beat to arrive
 *   0.04 – 0.40  the cover swings open about the spine, the book glides to centre
 *   0.40 – 0.92  the four panels fold up off the pages, one after another
 *
 * The pure part is exported on its own so it can be tested without a browser.
 */

export type BookStage = readonly [start: number, end: number]

export const BOOK_STAGES = {
  open: [0.04, 0.4],
  build: [0.4, 0.66],
  motion: [0.47, 0.73],
  rest: [0.54, 0.8],
  systems: [0.62, 0.92],
} as const satisfies Record<string, BookStage>

export type PopId = 'build' | 'motion' | 'rest' | 'systems'
export const POP_IDS: readonly PopId[] = ['build', 'motion', 'rest', 'systems']

/** Fraction of the way through [start, end], held at 0 before and 1 after. */
export function progressWithin(p: number, [start, end]: BookStage) {
  return Math.min(1, Math.max(0, (p - start) / (end - start)))
}

/** Slow out of the closed book, slow into the open one. */
export const easeInOutCubic = (t: number) =>
  t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2

/** Overshoots a little and settles, like paper snapping upright. */
export const easeOutBack = (t: number, overshoot = 1.5) =>
  1 + (overshoot + 1) * (t - 1) ** 3 + overshoot * (t - 1) ** 2

export type BookState = {
  /** 0 closed, 1 fully open. Eased. */
  open: number
  /** Peaks mid-turn: drives the shadow the turning cover throws. */
  hump: number
  pops: Record<PopId, number>
  /** Per panel: standing up, so its controls can be used. */
  ready: Record<PopId, boolean>
}

/**
 * A panel this far up is upright to the eye: what is left of the fold is a few
 * degrees. Gating on the scroll window instead left the controls dead while a
 * panel already looked finished, so a reader who stopped on the standing
 * picture found nothing clickable.
 */
export const PANEL_UPRIGHT = 0.9

export function bookState(p: number): BookState {
  const open = easeInOutCubic(progressWithin(p, BOOK_STAGES.open))
  const pops = Object.fromEntries(
    POP_IDS.map((id) => [id, easeOutBack(progressWithin(p, BOOK_STAGES[id]))]),
  ) as Record<PopId, number>

  return {
    open,
    hump: Math.sin(Math.PI * open),
    pops,
    ready: Object.fromEntries(
      POP_IDS.map((id) => [id, pops[id] >= PANEL_UPRIGHT]),
    ) as Record<PopId, boolean>,
  }
}

const QUERY = '(min-width: 861px) and (prefers-reduced-motion: no-preference)'
const VARS = [
  '--open',
  '--hump',
  '--pop-build',
  '--pop-motion',
  '--pop-rest',
  '--pop-systems',
] as const

/**
 * Writes the book's state to CSS custom properties on `stage` as the rail
 * scrolls. No React state: nothing re-renders per frame.
 *
 * The target is the scroll position; the value actually shown chases it with an
 * exponential ease that depends on elapsed time, not on frames, so a fast wheel
 * flick glides to rest and a slow drag is followed closely. On phones and with
 * reduced motion it does nothing, and the stylesheet's own defaults apply.
 */
export function useBookScroll(
  rail: RefObject<HTMLElement | null>,
  stage: RefObject<HTMLElement | null>,
) {
  useEffect(() => {
    const railEl = rail.current
    const stageEl = stage.current
    if (!railEl || !stageEl) return

    const query = window.matchMedia(QUERY)
    let target = 0
    let current = 0
    let frame = 0
    let last = 0
    let listening = false

    const apply = (p: number) => {
      const state = bookState(p)
      stageEl.style.setProperty('--open', state.open.toFixed(4))
      stageEl.style.setProperty('--hump', state.hump.toFixed(4))
      for (const id of POP_IDS) {
        stageEl.style.setProperty(`--pop-${id}`, state.pops[id].toFixed(4))
        // Each panel answers for itself: the stylesheet takes its controls out
        // of reach while its own flag says it is still folded down.
        const flag = `up${id[0].toUpperCase()}${id.slice(1)}`
        const next = String(state.ready[id])
        if (stageEl.dataset[flag] !== next) stageEl.dataset[flag] = next
      }
    }

    const measure = () => {
      const box = railEl.getBoundingClientRect()
      const run = box.height - window.innerHeight
      target = run > 0 ? Math.min(1, Math.max(0, -box.top / run)) : 1
    }

    const tick = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000 || 1 / 60)
      last = now
      current += (target - current) * (1 - Math.exp(-dt * 9))
      if (Math.abs(target - current) < 0.0004) current = target
      apply(current)
      frame = current === target ? 0 : requestAnimationFrame(tick)
    }

    const kick = () => {
      measure()
      if (!frame) {
        last = performance.now()
        frame = requestAnimationFrame(tick)
      }
    }

    const stop = () => {
      cancelAnimationFrame(frame)
      frame = 0
      if (listening) {
        window.removeEventListener('scroll', kick)
        window.removeEventListener('resize', kick)
        listening = false
      }
      for (const name of VARS) stageEl.style.removeProperty(name)
      for (const id of POP_IDS) {
        delete stageEl.dataset[`up${id[0].toUpperCase()}${id.slice(1)}`]
      }
    }

    const start = () => {
      stop()
      measure()
      // Arriving mid-page (a reload, a #skills link) shows the right page at once.
      current = target
      apply(current)
      window.addEventListener('scroll', kick, { passive: true })
      window.addEventListener('resize', kick)
      listening = true
    }

    const sync = () => (query.matches ? start() : stop())
    sync()
    query.addEventListener('change', sync)

    return () => {
      query.removeEventListener('change', sync)
      stop()
    }
  }, [rail, stage])
}
