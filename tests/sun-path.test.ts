import {
  SUN_KEYS,
  flareFromVelocity,
  ghostPoints,
  sunFrame,
} from '@/features/landing-page/components/sunlight/sun-path'

describe('sunFrame', () => {
  it('lands exactly on the first and last keys', () => {
    const first = sunFrame(0)
    const last = sunFrame(1)
    expect(first.x).toBeCloseTo(SUN_KEYS[0].x)
    expect(first.y).toBeCloseTo(SUN_KEYS[0].y)
    expect(last.x).toBeCloseTo(SUN_KEYS[SUN_KEYS.length - 1].x)
    expect(last.y).toBeCloseTo(SUN_KEYS[SUN_KEYS.length - 1].y)
  })

  it('stays on screen and inside the warm range for every progress', () => {
    for (let i = 0; i <= 200; i += 1) {
      const f = sunFrame(i / 200)
      expect(f.x).toBeGreaterThanOrEqual(0)
      expect(f.x).toBeLessThanOrEqual(1)
      expect(f.y).toBeGreaterThanOrEqual(0)
      expect(f.y).toBeLessThanOrEqual(1)
      // Warm light: red always leads, blue always trails.
      expect(f.color[0]).toBeGreaterThanOrEqual(f.color[2])
      expect(f.intensity).toBeGreaterThan(0)
      expect(f.intensity).toBeLessThanOrEqual(1)
    }
  })

  it('peaks near noon: the highest sun is mid-page', () => {
    const ys = Array.from({ length: 101 }, (_, i) => sunFrame(i / 100).y)
    const peak = ys.indexOf(Math.max(...ys))
    expect(peak).toBeGreaterThan(30)
    expect(peak).toBeLessThan(55)
  })

  it('clamps out-of-range and non-finite progress', () => {
    expect(sunFrame(-4)).toEqual(sunFrame(0))
    expect(sunFrame(9)).toEqual(sunFrame(1))
    expect(sunFrame(Number.NaN)).toEqual(sunFrame(0))
  })

  it('keys are strictly ascending', () => {
    for (let i = 1; i < SUN_KEYS.length; i += 1)
      expect(SUN_KEYS[i].at).toBeGreaterThan(SUN_KEYS[i - 1].at)
  })
})

describe('ghostPoints', () => {
  it('puts every ghost on the line through the sun and the centre', () => {
    const sun = { x: 0.8, y: 0.2 }
    const points = ghostPoints(sun)
    const dx = 0.5 - sun.x
    const dy = 0.5 - sun.y
    points.forEach((p) => {
      const cross = (p.x - 0.5) * dy - (p.y - 0.5) * dx
      expect(Math.abs(cross)).toBeLessThan(1e-9)
    })
  })
})

describe('flareFromVelocity', () => {
  it('is 0 at rest, 1 at a hard flick, and symmetric', () => {
    expect(flareFromVelocity(0)).toBe(0)
    expect(flareFromVelocity(10000)).toBe(1)
    expect(flareFromVelocity(-1600)).toBeCloseTo(flareFromVelocity(1600))
  })
})
