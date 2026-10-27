/**
 * The sun's day, as arithmetic.
 *
 * The whole landing page is one trip across the sky: the hero is first light
 * (the sun is still low and off to the right, behind the DAW), About and Skills
 * lift it toward noon, Experience and Work carry it west as it warms, and the
 * golden-hour seam before Contact leaves it sitting on the horizon.
 *
 * Everything here is a pure function of page scroll progress (0 → 1), with no
 * `three` import and no DOM, so the path can be unit-tested the way the pad
 * sea's maths is: do the endpoints land, does the sun stay on screen, does the
 * colour stay inside the warm range.
 *
 * Positions are in UV space with the origin at the bottom-left, which is what
 * the fragment shader reads directly.
 */

export type Rgb = readonly [number, number, number]

export type SunFrame = {
  /** 0 = left edge, 1 = right edge. */
  x: number
  /** 0 = bottom edge, 1 = top edge. */
  y: number
  /** Disc radius as a fraction of the viewport height. */
  radius: number
  /** Overall glow strength, 0 → 1. */
  intensity: number
  /** The light's colour temperature. */
  color: Rgb
}

type SunKey = SunFrame & { at: number }

/**
 * First light, morning, noon, late afternoon, golden hour. Colours are the
 * deck theme's own peach / amber / orange pushed toward daylight, never toward
 * a cold white: a cold sun on a cream chassis reads as a screen glare.
 */
export const SUN_KEYS: readonly SunKey[] = [
  {
    at: 0,
    x: 0.84,
    y: 0.2,
    radius: 0.05,
    intensity: 0.55,
    color: [1, 0.6, 0.42],
  },
  {
    at: 0.18,
    x: 0.7,
    y: 0.52,
    radius: 0.058,
    intensity: 0.7,
    color: [1, 0.78, 0.5],
  },
  {
    at: 0.42,
    x: 0.5,
    y: 0.84,
    radius: 0.066,
    intensity: 0.82,
    color: [1, 0.9, 0.62],
  },
  {
    at: 0.68,
    x: 0.3,
    y: 0.62,
    radius: 0.062,
    intensity: 0.74,
    color: [1, 0.74, 0.38],
  },
  {
    at: 0.88,
    x: 0.16,
    y: 0.3,
    radius: 0.07,
    intensity: 0.66,
    color: [1, 0.55, 0.3],
  },
  {
    at: 1,
    x: 0.12,
    y: 0.16,
    radius: 0.074,
    intensity: 0.5,
    color: [1, 0.48, 0.34],
  },
]

const clamp01 = (value: number) => Math.min(1, Math.max(0, value))
const smooth = (t: number) => t * t * (3 - 2 * t)
const mix = (a: number, b: number, t: number) => a + (b - a) * t

/** Where the sun is, and what colour it is, at this page progress. */
export function sunFrame(progress: number): SunFrame {
  const p = clamp01(Number.isFinite(progress) ? progress : 0)
  let index = 0
  while (index < SUN_KEYS.length - 2 && p > SUN_KEYS[index + 1].at) index += 1
  const from = SUN_KEYS[index]
  const to = SUN_KEYS[index + 1]
  const t = smooth(clamp01((p - from.at) / (to.at - from.at)))
  return {
    x: mix(from.x, to.x, t),
    y: mix(from.y, to.y, t),
    radius: mix(from.radius, to.radius, t),
    intensity: mix(from.intensity, to.intensity, t),
    color: [
      mix(from.color[0], to.color[0], t),
      mix(from.color[1], to.color[1], t),
      mix(from.color[2], to.color[2], t),
    ],
  }
}

/**
 * Lens ghosts sit on the line from the sun through the middle of the frame.
 * Returned in UV space so the shader and the tests agree on where they are.
 */
export function ghostPoints(
  sun: Pick<SunFrame, 'x' | 'y'>,
  offsets: readonly number[] = [0.35, 0.7, 1.25],
): Array<{ x: number; y: number }> {
  return offsets.map((k) => ({
    x: 0.5 + (0.5 - sun.x) * k,
    y: 0.5 + (0.5 - sun.y) * k,
  }))
}

/** Scroll speed (px/s) → extra flare, eased so a flick blooms and a drift does not. */
export function flareFromVelocity(velocityPxPerSecond: number): number {
  return smooth(clamp01(Math.abs(velocityPxPerSecond) / 3200))
}
