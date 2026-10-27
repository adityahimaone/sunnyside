import { whfCoord, whfDissolve } from '@/components/ui/wild-hunt-footer'

describe('Wild Hunt footer raster helpers', () => {
  test('dissolve stays clear above the boundary and fully fills below it', () => {
    expect(whfDissolve(0.2, 0.4, 0.28)).toBe(0)
    expect(whfDissolve(0.8, 0.4, 0.28)).toBe(1)
  })

  test('dissolve eases through its transition', () => {
    const value = whfDissolve(0.54, 0.4, 0.28)
    expect(value).toBeGreaterThan(0)
    expect(value).toBeLessThan(1)
  })

  test('reticle coordinates clamp to the 16 by 9 grid', () => {
    expect(whfCoord(0, 0, 160, 90)).toBe('A1')
    expect(whfCoord(159, 89, 160, 90)).toBe('P9')
    expect(whfCoord(-10, -4, 160, 90)).toBe('A1')
    expect(whfCoord(240, 120, 160, 90)).toBe('P9')
  })
})
