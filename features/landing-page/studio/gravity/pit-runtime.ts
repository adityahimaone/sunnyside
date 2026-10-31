import { HIT, PIT_STICKERS, type PitSpec } from './pit-config'
import {
  createBody,
  createWorld,
  pick,
  shake,
  stepWorld,
  wake,
  type Body,
  type World,
} from './physics'

type Item = {
  spec: PitSpec
  el: HTMLElement
  body: Body
  size: number
}

export type PitRuntime = { stop: () => void; shake: () => void }

/** A stable shuffle, so the drop order is the same on every visit. */
const ORDER = [3, 0, 5, 2, 6, 1, 4]

/**
 * Drives the sticker tray.
 *
 * Nothing is simulated until the tray is on screen; then the stickers are
 * released above it and fall in under gravity. The loop runs only while
 * something is moving, sleeps once the pile settles, and wakes again when
 * someone picks a sticker up, shakes the tray, or resizes the page. Every
 * frame is arithmetic written straight to `transform`: no React state.
 *
 * Plain function rather than a hook so mutating DOM it owns is not mistaken
 * for mutating render data.
 */
export function runPit(pit: HTMLElement): PitRuntime {
  const world: World = createWorld(pit.clientWidth, pit.clientHeight)
  const items: Item[] = []
  for (const el of Array.from(
    pit.querySelectorAll<HTMLElement>('[data-pit-sticker]'),
  )) {
    const spec = PIT_STICKERS.find((s) => s.id === el.dataset.pitSticker)
    if (!spec) continue
    const body = createBody({ id: spec.id, x: 0, y: -999, r: 24 })
    world.bodies.push(body)
    items.push({ spec, el, body, size: 0 })
  }

  let released = false
  let visible = false
  let frame = 0
  let last = 0
  let disposed = false
  let z = 10
  let drag: {
    item: Item
    pointerId: number
    dx: number
    dy: number
    trail: Array<{ x: number; y: number; t: number }>
  } | null = null

  const fit = () => {
    world.width = pit.clientWidth
    world.height = pit.clientHeight
    const scale = Math.min(1, Math.max(0.58, world.width / 880))
    for (const item of items) {
      item.size = item.spec.size * scale
      item.body.r = item.size * HIT
      item.body.mass = item.body.r * item.body.r * 0.01
      item.el.style.width = `${item.size}px`
      item.el.style.height = `${item.size}px`
    }
  }

  const draw = () => {
    for (const { el, body, size } of items) {
      el.style.transform = `translate3d(${body.x - size / 2}px, ${body.y - size / 2}px, 0) rotate(${body.a}rad)`
    }
  }

  const tick = (now: number) => {
    frame = 0
    if (disposed) return
    const dt = Math.min(0.05, (now - last) / 1000 || 1 / 60)
    last = now
    stepWorld(world, dt)
    draw()
    if (world.awake && visible && !document.hidden) schedule()
  }

  function schedule() {
    if (frame || disposed) return
    last = performance.now()
    frame = requestAnimationFrame(tick)
  }

  /** The hero's own copies stay behind as outlines: they have been peeled. */
  const peelHero = (on: boolean) => {
    document
      .querySelectorAll<HTMLElement>('[data-hero-sticker]')
      .forEach((el) => {
        if (on) el.dataset.peeled = 'true'
        else delete el.dataset.peeled
      })
  }

  const release = () => {
    if (released || disposed) return
    released = true
    fit()
    const lift = Math.max(window.innerHeight * 0.5, 260)
    items.forEach((item, i) => {
      const slot = ORDER[i % ORDER.length]
      const b = item.body
      // Dropped over the middle so they land on each other and heap up,
      // rather than spreading into a single row on the floor.
      b.x = world.width * (0.32 + (0.36 * (slot + 0.5)) / items.length)
      b.y = -lift - i * 84
      b.vx = (slot - 3) * 34
      b.vy = 120
      b.w = ((i % 2 ? 1 : -1) * (1.2 + (slot % 3))) / 1.6
      b.a = ((slot * 53) % 360) * (Math.PI / 180)
      item.el.style.visibility = 'visible'
    })
    wake(world)
    draw()
    peelHero(true)
    schedule()
  }

  // ── Pointer: pick up, carry, fling ────────────────────────────────────────
  const local = (event: PointerEvent) => {
    const rect = pit.getBoundingClientRect()
    return { x: event.clientX - rect.left, y: event.clientY - rect.top }
  }

  const onDown = (event: PointerEvent) => {
    if (!released || event.button > 0) return
    const p = local(event)
    const body = pick(world, p.x, p.y)
    const item = body && items.find((it) => it.body === body)
    if (!item || !body) return
    event.preventDefault()
    item.el.setPointerCapture(event.pointerId)
    item.el.style.zIndex = String(++z)
    item.el.dataset.held = 'true'
    body.held = true
    body.tx = p.x
    body.ty = p.y
    drag = {
      item,
      pointerId: event.pointerId,
      dx: body.x - p.x,
      dy: body.y - p.y,
      trail: [{ ...p, t: event.timeStamp }],
    }
    wake(world)
    schedule()
  }

  const onMove = (event: PointerEvent) => {
    if (!drag || event.pointerId !== drag.pointerId) return
    const p = local(event)
    const { body } = drag.item
    const r = body.r
    body.tx = Math.min(world.width - r, Math.max(r, p.x + drag.dx))
    body.ty = Math.min(world.height - r, Math.max(-world.height, p.y + drag.dy))
    drag.trail.push({ ...p, t: event.timeStamp })
    if (drag.trail.length > 6) drag.trail.shift()
  }

  const onUp = (event: PointerEvent) => {
    if (!drag || event.pointerId !== drag.pointerId) return
    const { item, trail } = drag
    const { body } = item
    drag = null
    delete item.el.dataset.held
    body.held = false
    const first = trail[0]
    const lastPoint = trail[trail.length - 1]
    const span = Math.max(16, lastPoint.t - first.t)
    const cap = 2400
    body.vx = Math.max(
      -cap,
      Math.min(cap, ((lastPoint.x - first.x) / span) * 1000),
    )
    body.vy = Math.max(
      -cap,
      Math.min(cap, ((lastPoint.y - first.y) / span) * 1000),
    )
    body.w += body.vx / 260
    wake(world)
    schedule()
  }

  pit.addEventListener('pointerdown', onDown)
  pit.addEventListener('pointermove', onMove)
  pit.addEventListener('pointerup', onUp)
  pit.addEventListener('pointercancel', onUp)

  // ── Visibility and size ──────────────────────────────────────────────────
  const observer =
    typeof IntersectionObserver === 'undefined'
      ? null
      : new IntersectionObserver(
          (entries) => {
            visible = entries.some((e) => e.isIntersecting)
            if (visible && !released) release()
            else if (visible && world.awake) schedule()
          },
          { threshold: 0.3 },
        )
  observer?.observe(pit)
  if (!observer) {
    visible = true
    release()
  }

  const resize = new ResizeObserver(() => {
    if (!released) return
    fit()
    for (const { body } of items) {
      body.x = Math.min(world.width - body.r, Math.max(body.r, body.x))
      body.y = Math.min(world.height - body.r, body.y)
    }
    wake(world)
    schedule()
  })
  resize.observe(pit)

  const onVisibility = () => {
    if (!document.hidden && world.awake) schedule()
  }
  document.addEventListener('visibilitychange', onVisibility)

  return {
    shake: () => {
      if (!released) return
      shake(world)
      schedule()
    },
    stop: () => {
      disposed = true
      if (frame) cancelAnimationFrame(frame)
      observer?.disconnect()
      resize.disconnect()
      pit.removeEventListener('pointerdown', onDown)
      pit.removeEventListener('pointermove', onMove)
      pit.removeEventListener('pointerup', onUp)
      pit.removeEventListener('pointercancel', onUp)
      document.removeEventListener('visibilitychange', onVisibility)
      peelHero(false)
    },
  }
}
