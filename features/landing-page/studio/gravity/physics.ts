/**
 * A deliberately small rigid-circle world for the About sticker tray.
 *
 * Stickers are die-cut and close to round, so each one is a circle with a
 * spin. That is enough for stacking, rolling, bouncing off the tray walls and
 * being flung by hand, in about two hundred lines and no dependency. The
 * world is plain data stepped by `stepWorld`, so it runs (and is tested)
 * without a DOM.
 *
 * Units are CSS px and seconds. +y is down. There is no ceiling: stickers
 * start above the tray and fall in.
 */

export type Body = {
  id: string
  x: number
  y: number
  vx: number
  vy: number
  /** Collision radius. */
  r: number
  /** Heavier bodies shove lighter ones. */
  mass: number
  /** Rotation in radians, and angular velocity in rad/s. */
  a: number
  w: number
  /** Seconds spent nearly still; a body this settled stops being simulated. */
  calm: number
  /** Held by the pointer: driven toward `target`, ignores gravity. */
  held: boolean
  tx: number
  ty: number
}

export type World = {
  width: number
  height: number
  gravity: number
  bounce: number
  bodies: Body[]
  /** True while anything can still move. The render loop sleeps when false. */
  awake: boolean
  /** Fixed-step remainder. */
  carry: number
}

export const STEP = 1 / 120
const MAX_STEPS = 6
const AIR = 0.12
const FLOOR_FRICTION = 0.9
const SLEEP_SPEED = 10
const SLEEP_SPIN = 0.35
const SLEEP_AFTER = 0.6
const MAX_SPEED = 3200

export function createBody(
  init: Pick<Body, 'id' | 'x' | 'y' | 'r'> & Partial<Body>,
): Body {
  return {
    vx: 0,
    vy: 0,
    mass: init.r * init.r * 0.01,
    a: 0,
    w: 0,
    calm: 0,
    held: false,
    tx: init.x,
    ty: init.y,
    ...init,
  }
}

export function createWorld(
  width: number,
  height: number,
  bodies: Body[] = [],
): World {
  return {
    width,
    height,
    gravity: 2600,
    bounce: 0.42,
    bodies,
    awake: bodies.length > 0,
    carry: 0,
  }
}

export function wake(world: World) {
  world.awake = true
  for (const body of world.bodies) body.calm = 0
}

const clamp = (v: number, lo: number, hi: number) =>
  Math.min(hi, Math.max(lo, v))

function collideBounds(world: World, body: Body) {
  const { width, height, bounce } = world
  if (body.x < body.r) {
    body.x = body.r
    if (body.vx < 0) body.vx *= -bounce
  } else if (body.x > width - body.r) {
    body.x = width - body.r
    if (body.vx > 0) body.vx *= -bounce
  }
  const floor = height - body.r
  if (body.y > floor) {
    body.y = floor
    if (body.vy > 0) body.vy = body.vy > 140 ? -body.vy * bounce * 0.7 : 0
    // Rolling: friction nudges spin toward the speed it is travelling at.
    body.vx *= FLOOR_FRICTION ** (STEP * 60)
    body.w += (body.vx / body.r - body.w) * 0.25
  }
}

function collidePair(world: World, p: Body, q: Body) {
  const dx = q.x - p.x
  const dy = q.y - p.y
  const min = p.r + q.r
  const d2 = dx * dx + dy * dy
  if (d2 >= min * min) return
  const d = Math.sqrt(d2) || 0.0001
  const nx = d2 === 0 ? 0 : dx / d
  const ny = d2 === 0 ? -1 : dy / d
  const overlap = min - d

  const pInv = p.held ? 0 : 1 / p.mass
  const qInv = q.held ? 0 : 1 / q.mass
  const total = pInv + qInv
  if (total === 0) return

  // Push apart in proportion to how easily each one moves.
  p.x -= nx * overlap * (pInv / total)
  p.y -= ny * overlap * (pInv / total)
  q.x += nx * overlap * (qInv / total)
  q.y += ny * overlap * (qInv / total)

  const rvx = q.vx - p.vx
  const rvy = q.vy - p.vy
  const along = rvx * nx + rvy * ny
  if (along > 0) return
  // Paper on paper does not bounce much: soak up most of the impact so a
  // dropped handful lands as a heap rather than skittering apart.
  const j = (-(1 + world.bounce * 0.35) * along) / total
  p.vx -= j * nx * pInv
  p.vy -= j * ny * pInv
  q.vx += j * nx * qInv
  q.vy += j * ny * qInv

  // Grip: friction along the contact tangent, capped at a share of the normal
  // impulse. This is what lets circles rest on each other instead of sliding
  // off, and it turns glancing hits into spin.
  const tx = -ny
  const ty = nx
  const slip = rvx * tx + rvy * ty
  const grip = Math.max(-0.55 * j, Math.min(0.55 * j, -slip / total))
  p.vx -= grip * tx * pInv
  p.vy -= grip * ty * pInv
  q.vx += grip * tx * qInv
  q.vy += grip * ty * qInv
  p.w -= (grip * pInv) / p.r
  q.w -= (grip * qInv) / q.r
}

function substep(world: World, dt: number) {
  const { bodies } = world
  for (const body of bodies) {
    if (body.held) {
      // A spring to the pointer: stiff enough to feel held, loose enough to swing.
      body.vx = clamp((body.tx - body.x) * 28, -MAX_SPEED, MAX_SPEED)
      body.vy = clamp((body.ty - body.y) * 28, -MAX_SPEED, MAX_SPEED)
      body.w *= 0.96
    } else {
      body.vy += world.gravity * dt
      const drag = 1 - AIR * dt
      body.vx *= drag
      body.vy *= drag
      body.w *= 1 - 0.4 * dt
    }
    body.x += body.vx * dt
    body.y += body.vy * dt
    body.a += body.w * dt
  }

  // Two relaxation passes keep small piles from sinking into each other.
  for (let pass = 0; pass < 2; pass += 1) {
    for (let i = 0; i < bodies.length; i += 1) {
      for (let k = i + 1; k < bodies.length; k += 1) {
        collidePair(world, bodies[i], bodies[k])
      }
    }
    for (const body of bodies) collideBounds(world, body)
  }
}

/** Advance by `dt` seconds of real time using fixed internal steps. */
export function stepWorld(world: World, dt: number) {
  if (!world.awake) return
  world.carry += Math.min(dt, STEP * MAX_STEPS)
  while (world.carry >= STEP) {
    substep(world, STEP)
    world.carry -= STEP
  }

  let moving = false
  for (const body of world.bodies) {
    const calm =
      !body.held &&
      Math.hypot(body.vx, body.vy) < SLEEP_SPEED &&
      Math.abs(body.w) < SLEEP_SPIN
    body.calm = calm ? body.calm + dt : 0
    if (body.calm < SLEEP_AFTER) moving = true
  }
  if (!moving) {
    world.awake = false
    for (const body of world.bodies) {
      body.vx = body.vy = body.w = 0
    }
  }
}

/** Give everything a kick, for the "shake the tray" button. */
export function shake(world: World, strength = 1) {
  for (const body of world.bodies) {
    if (body.held) continue
    body.vy -= (900 + body.r * 8) * strength * (0.7 + ((body.r * 7) % 5) / 10)
    body.vx += (((body.r * 13) % 11) - 5) * 90 * strength
    body.w += (((body.r * 17) % 7) - 3) * 1.4 * strength
  }
  wake(world)
}

/** The body under a point, front-most (last drawn) first. */
export function pick(world: World, x: number, y: number, slop = 6) {
  for (let i = world.bodies.length - 1; i >= 0; i -= 1) {
    const body = world.bodies[i]
    if (Math.hypot(x - body.x, y - body.y) <= body.r + slop) return body
  }
  return null
}
