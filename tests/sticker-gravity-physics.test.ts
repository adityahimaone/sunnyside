import {
  createBody,
  createWorld,
  pick,
  shake,
  stepWorld,
  wake,
} from '@/features/landing-page/studio/gravity/physics'

const run = (world: ReturnType<typeof createWorld>, seconds: number) => {
  for (let t = 0; t < seconds; t += 1 / 60) stepWorld(world, 1 / 60)
}

describe('sticker gravity world', () => {
  it('drops a body onto the floor and puts it to sleep', () => {
    const body = createBody({ id: 'a', x: 200, y: -300, r: 30 })
    const world = createWorld(400, 240, [body])
    run(world, 4)
    expect(body.y).toBeCloseTo(240 - 30, 0)
    expect(world.awake).toBe(false)
    expect(body.vy).toBe(0)
  })

  it('keeps every body inside the walls', () => {
    const bodies = [-50, 100, 500].map((x, i) =>
      createBody({
        id: `b${i}`,
        x,
        y: -100 - i * 80,
        r: 26,
        vx: x < 0 ? -900 : 900,
      }),
    )
    const world = createWorld(360, 220, bodies)
    run(world, 4)
    for (const b of bodies) {
      expect(b.x).toBeGreaterThanOrEqual(b.r - 0.01)
      expect(b.x).toBeLessThanOrEqual(360 - b.r + 0.01)
      expect(Number.isFinite(b.y)).toBe(true)
    }
  })

  it('stacks bodies without overlapping them once settled', () => {
    const bodies = Array.from({ length: 6 }, (_, i) =>
      createBody({ id: `s${i}`, x: 180 + (i % 2) * 6, y: -60 * i, r: 28 }),
    )
    const world = createWorld(360, 260, bodies)
    run(world, 6)
    for (let i = 0; i < bodies.length; i += 1) {
      for (let k = i + 1; k < bodies.length; k += 1) {
        const d = Math.hypot(
          bodies[i].x - bodies[k].x,
          bodies[i].y - bodies[k].y,
        )
        expect(d).toBeGreaterThan(56 * 0.9)
      }
    }
    expect(world.awake).toBe(false)
  })

  it('stays stable when two bodies spawn on the same point', () => {
    const a = createBody({ id: 'a', x: 100, y: 100, r: 20 })
    const b = createBody({ id: 'b', x: 100, y: 100, r: 20 })
    const world = createWorld(300, 300, [a, b])
    run(world, 2)
    for (const body of [a, b]) {
      expect(Number.isFinite(body.x) && Number.isFinite(body.y)).toBe(true)
    }
  })

  it('wakes on shake and settles again', () => {
    const body = createBody({ id: 'a', x: 100, y: 180, r: 30 })
    const world = createWorld(300, 240, [body])
    run(world, 3)
    expect(world.awake).toBe(false)
    shake(world)
    expect(world.awake).toBe(true)
    stepWorld(world, 1 / 60)
    expect(body.vy).toBeLessThan(0)
    run(world, 5)
    expect(world.awake).toBe(false)
  })

  it('carries a held body to its target and ignores gravity meanwhile', () => {
    const body = createBody({ id: 'a', x: 50, y: 50, r: 20 })
    const world = createWorld(400, 400, [body])
    body.held = true
    body.tx = 300
    body.ty = 120
    wake(world)
    run(world, 1)
    expect(body.x).toBeCloseTo(300, 0)
    expect(body.y).toBeCloseTo(120, 0)
  })

  it('picks the front-most body under a point', () => {
    const back = createBody({ id: 'back', x: 100, y: 100, r: 30 })
    const front = createBody({ id: 'front', x: 110, y: 100, r: 30 })
    const world = createWorld(300, 300, [back, front])
    expect(pick(world, 105, 100)?.id).toBe('front')
    expect(pick(world, 290, 290)).toBeNull()
  })
})
