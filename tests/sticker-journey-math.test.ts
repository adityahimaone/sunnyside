import {
  SCREEN_IN,
  SCREEN_OUT,
  legWindow,
  place,
  type Dock,
  type FlightParams,
} from '@/features/landing-page/studio/journey/journey-math'
import { FLYERS } from '@/features/landing-page/studio/journey/journey-config'

const VH = 800
const VW = 1280
const docks: Dock[] = [
  { x: 1000, y: 600, rot: 0, size: 70 },
  { x: 120, y: 2200, rot: 10, size: 72 },
  { x: 900, y: 3800, rot: -8, size: 80 },
]
const params: FlightParams = {
  lane: -0.1,
  arc: 0.1,
  hop: 0.12,
  spin: 1,
  wobble: 6,
  delay: 0,
}

describe('legWindow', () => {
  it('leaves when the dock is a third down and lands when the next is two-thirds down', () => {
    const { start, end } = legWindow(docks[0], docks[1], VH, 0, false)
    expect(docks[0].y - start).toBeCloseTo(VH * SCREEN_OUT)
    expect(docks[1].y - end).toBeCloseTo(VH * SCREEN_IN)
  })

  it('never makes a leg shorter than the minimum, even for docks on top of each other', () => {
    const { start, end } = legWindow(docks[0], { ...docks[0] }, VH, 0, false)
    expect(end - start).toBeGreaterThanOrEqual(120)
  })

  it('a delay pushes the departure later but never past the landing', () => {
    const base = legWindow(docks[0], docks[1], VH, 0, false)
    const late = legWindow(docks[0], docks[1], VH, 0.4, false)
    expect(late.start).toBeGreaterThan(base.start)
    expect(late.end).toBe(base.end)
    expect(late.start).toBeLessThan(late.end)
  })
})

describe('place', () => {
  it('rests exactly on the first dock before the first leg', () => {
    const p = place(0, docks, params, VH, VW, false)
    expect(p).toMatchObject({ x: 1000, y: 600, flying: false, dock: 0 })
  })

  it('rests exactly on the last dock after the last leg', () => {
    const p = place(99999, docks, params, VH, VW, false)
    expect(p).toMatchObject({ x: 900, y: 3800, flying: false, dock: 2 })
  })

  it('is continuous at both ends of every flight (no jump on take-off or landing)', () => {
    for (let i = 0; i < docks.length - 1; i += 1) {
      const { start, end } = legWindow(
        docks[i],
        docks[i + 1],
        VH,
        params.delay,
        false,
      )
      const before = place(start - 0.01, docks, params, VH, VW, false)
      const takeoff = place(start + 0.01, docks, params, VH, VW, false)
      const landing = place(end - 0.01, docks, params, VH, VW, false)
      const after = place(end + 0.01, docks, params, VH, VW, false)
      expect(Math.abs(takeoff.x - before.x)).toBeLessThan(2)
      expect(Math.abs(takeoff.y - before.y)).toBeLessThan(2)
      expect(Math.abs(landing.x - after.x)).toBeLessThan(2)
      expect(Math.abs(landing.y - after.y)).toBeLessThan(2)
    }
  })

  it('stays near the reader mid-flight: on screen, whatever the distance between docks', () => {
    const { start, end } = legWindow(docks[0], docks[1], VH, 0, false)
    for (let s = start; s <= end; s += (end - start) / 40) {
      const p = place(s, docks, params, VH, VW, false)
      const screenY = p.y - s
      expect(screenY).toBeGreaterThan(-VH * 0.25)
      expect(screenY).toBeLessThan(VH * 1.1)
    }
  })

  it('reports a gap between legs as resting at the dock it arrived on', () => {
    const first = legWindow(docks[0], docks[1], VH, 0, false)
    const second = legWindow(docks[1], docks[2], VH, 0, false)
    const mid = (first.end + second.start) / 2
    const p = place(mid, docks, params, VH, VW, false)
    expect(p.flying).toBe(false)
    expect(p.dock).toBe(1)
    expect(p.y).toBe(docks[1].y)
  })

  it('handles a sticker with a single dock and with none', () => {
    expect(place(500, [docks[0]], params, VH, VW, false).flying).toBe(false)
    expect(place(500, [], params, VH, VW, false).size).toBe(0)
  })
})

describe('FLYERS config', () => {
  it('has unique ids', () => {
    const ids = FLYERS.map((f) => f.id)
    expect(new Set(ids).size).toBe(ids.length)
  })

  it('keeps every dock in a padding band: shallow offset from the section edge', () => {
    FLYERS.forEach((f) =>
      f.docks.forEach((d) => {
        expect(d.x).toBeGreaterThanOrEqual(0)
        expect(d.x).toBeLessThanOrEqual(1)
        expect(d.oy ?? 0).toBeLessThanOrEqual(60)
      }),
    )
  })

  it('never stacks two stickers on the same spot of the same section edge', () => {
    const seen = new Map<string, number[]>()
    FLYERS.forEach((f) =>
      f.docks.forEach((d) => {
        const key = `${d.at}:${d.edge ?? 'top'}`
        const xs = seen.get(key) ?? []
        xs.forEach((x) =>
          expect(Math.abs(x - d.x)).toBeGreaterThanOrEqual(0.12),
        )
        xs.push(d.x)
        seen.set(key, xs)
      }),
    )
  })
})
