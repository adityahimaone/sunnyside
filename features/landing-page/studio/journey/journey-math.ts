/**
 * The sticker journey, as arithmetic.
 *
 * A sticker lives in the page's document space and moves between "docks" —
 * resting places in the empty padding bands of successive sections. Between two
 * docks it flies, and the flight is written in *screen* space so that it is
 * always near the reader: it leaves dock A when A is a third of the way down the
 * screen and lands on dock B when B is two-thirds down, and in between it hovers
 * in the viewport while the page scrolls underneath it.
 *
 * Everything here is pure (no DOM, no motion library), so the guarantees that
 * make it feel right — it starts and ends exactly on its docks, it never jumps,
 * it stays on screen mid-flight — are unit-tested rather than eyeballed.
 */

export const clamp01 = (v: number) => Math.min(1, Math.max(0, v))
export const lerp = (a: number, b: number, t: number) => a + (b - a) * t
export const smooth = (t: number) => t * t * (3 - 2 * t)
export const easeOutBack = (t: number) => {
  const c1 = 1.70158
  const c3 = c1 + 1
  const x = clamp01(t) - 1
  return 1 + c3 * x * x * x + c1 * x * x
}

/** A resting place, in document px relative to the page root. */
export type Dock = { x: number; y: number; rot: number; size: number }

export type FlightParams = {
  /** Vertical offset from the straight line, in viewport heights, at mid-flight. */
  lane: number
  /** Sideways bow, in viewport widths, at mid-flight. */
  arc: number
  /** Extra lift, in viewport heights, at mid-flight (positive = up). */
  hop: number
  /** Full turns over the flight. */
  spin: number
  /** Degrees of wobble at mid-flight. */
  wobble: number
  /** 0..0.6 — how far into the scroll window the sticker waits before leaving. */
  delay: number
}

/** Where on screen (as a share of viewport height) a dock is when flight leaves it. */
export const SCREEN_OUT = 0.34
/** …and where it is when flight lands on it. */
export const SCREEN_IN = 0.64
/** The shortest scroll a leg may take, so two close docks cannot teleport. */
const MIN_LEG = 120

export type Leg = { start: number; end: number }

/**
 * The scroll window of one flight. `startsAtTop` is for the first leg out of
 * the hero, which departs from wherever the sticker already is rather than from
 * a dock that must scroll into place first.
 */
export function legWindow(
  from: Dock,
  to: Dock,
  vh: number,
  delay: number,
  startsAtTop: boolean,
): Leg {
  const rawStart = startsAtTop ? 0 : from.y - vh * SCREEN_OUT
  const end = Math.max(to.y - vh * SCREEN_IN, rawStart + MIN_LEG)
  const start = rawStart + clamp01(delay) * (end - rawStart)
  return { start, end }
}

export type Placement = {
  x: number
  y: number
  rot: number
  size: number
  flying: boolean
  /** Index of the dock the sticker is resting at, or the one it last left. */
  dock: number
  /** 0..1 along the current flight; 0 when docked. */
  u: number
}

const docked = (d: Dock, index: number): Placement => ({
  x: d.x,
  y: d.y,
  rot: d.rot,
  size: d.size,
  flying: false,
  dock: index,
  u: 0,
})

export function place(
  scrollY: number,
  docks: readonly Dock[],
  params: FlightParams,
  vh: number,
  vw: number,
  startsAtTop: boolean,
): Placement {
  if (docks.length === 0)
    return { x: 0, y: 0, rot: 0, size: 0, flying: false, dock: 0, u: 0 }
  if (docks.length === 1) return docked(docks[0], 0)

  for (let i = 0; i < docks.length - 1; i += 1) {
    const from = docks[i]
    const to = docks[i + 1]
    const { start, end } = legWindow(
      from,
      to,
      vh,
      params.delay,
      startsAtTop && i === 0,
    )
    if (scrollY >= end) continue
    if (scrollY <= start) return docked(from, i)

    const u = clamp01((scrollY - start) / (end - start))
    const e = smooth(u)
    const s = Math.sin(Math.PI * u)
    const screenFrom = from.y - start
    const screenTo = to.y - end
    const screenY =
      lerp(screenFrom, screenTo, u) + (params.lane - params.hop) * vh * s
    return {
      x: lerp(from.x, to.x, e) + params.arc * vw * s,
      y: screenY + scrollY,
      rot:
        lerp(from.rot, to.rot, e) +
        params.spin * 360 * e +
        params.wobble * Math.sin(u * Math.PI * 4) * s,
      size: lerp(from.size, to.size, e) * (1 + 0.32 * s),
      flying: true,
      dock: i,
      u,
    }
  }
  return docked(docks[docks.length - 1], docks.length - 1)
}
