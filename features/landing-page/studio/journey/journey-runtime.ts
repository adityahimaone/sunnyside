import {
  FLYERS,
  SPARK_COLOURS,
  type DockSpec,
  type FlyerSpec,
} from './journey-config'
import {
  clamp01,
  easeOutBack,
  lerp,
  place,
  legWindow,
  type Dock,
  type Placement,
} from './journey-math'

/** A flyer's wrapper is drawn 100px wide; `size` scales it from there. */
const BASE = 100
const MOBILE = '(max-width: 768px)'

type Item = {
  spec: FlyerSpec
  el: HTMLElement
  inner: HTMLElement
  sparks: HTMLElement[]
  orig: HTMLElement | null
  docks: Dock[]
  tints: Array<string | undefined>
  active: boolean
  wasFlying: boolean
  dock: number
  seeded: boolean
  spawned: boolean
}

const animate = (
  el: Element,
  keyframes: Keyframe[],
  options: KeyframeAnimationOptions,
) => (typeof el.animate === 'function' ? el.animate(keyframes, options) : null)

/**
 * Drives the sticker journey and the small scroll scenes that go with it.
 *
 * One scroll listener (rAF-throttled, with a decay tail so velocity can settle),
 * one measurement pass on resize / font load / content growth, and then every
 * frame is arithmetic written straight to `style` — no React state, no
 * re-render. Plain function rather than a hook so that mutating DOM it owns is
 * not mistaken for mutating render data.
 *
 * What it does:
 *  - stickers peel off the hero's artwork and fly dock to dock down the page,
 *    landing with a squash and a puff of sparks;
 *  - the sun throws a tinted shockwave each time it lands, which is the
 *    transition between sections;
 *  - the hero card lifts away, the About photo tilts as it passes, and the
 *    marquee swings and speeds up with scroll velocity.
 */
export function runJourney(layer: HTMLElement): () => void {
  const root = layer.parentElement
  if (!root) return () => {}

  const mobileQuery = window.matchMedia(MOBILE)
  const ring = layer.querySelector<HTMLElement>('[data-journey-ring]')
  const items: Item[] = Array.from(
    layer.querySelectorAll<HTMLElement>('[data-flyer]'),
  ).flatMap((el) => {
    const spec = FLYERS.find((f) => f.id === el.dataset.flyer)
    const inner = el.querySelector<HTMLElement>('[data-flyer-inner]')
    if (!spec || !inner) return []
    return [
      {
        spec,
        el,
        inner,
        sparks: Array.from(el.querySelectorAll<HTMLElement>('[data-spark]')),
        orig: spec.from
          ? root.querySelector<HTMLElement>(
              `[data-journey-from="${spec.from}"]`,
            )
          : null,
        docks: [],
        tints: [],
        active: true,
        wasFlying: false,
        dock: -1,
        seeded: false,
        spawned: false,
      },
    ]
  })

  const heroArt = root.querySelector<HTMLElement>('[data-journey="hero-art"]')
  const photo = root.querySelector<HTMLElement>('[data-journey="photo"]')
  const marquee = root.querySelector<HTMLElement>('[data-journey="marquee"]')

  let vw = window.innerWidth
  let vh = window.innerHeight
  let originX = 0
  let originY = 0
  let velocity = 0
  let swing = 0
  let lastY = window.scrollY
  let lastT = performance.now()
  let frame = 0
  let measureTimer = 0
  let disposed = false

  const docOf = (rect: DOMRect, fx: number, fy: number) => ({
    x: rect.left + rect.width * fx + window.scrollX - originX,
    y: rect.top + rect.height * fy + window.scrollY - originY,
  })

  const heroDock = (orig: HTMLElement, spec: FlyerSpec): Dock => {
    const rect = orig.getBoundingClientRect()
    const c = docOf(rect, 0.5, 0.5)
    return { x: c.x, y: c.y, rot: 0, size: rect.width || spec.docks[0].size }
  }

  const sectionDock = (spec: DockSpec): Dock | null => {
    const section = document.querySelector<HTMLElement>(spec.at)
    if (!section) return null
    const rect = section.getBoundingClientRect()
    const edge = spec.edge ?? 'top'
    const oy = spec.oy ?? 46
    const base = docOf(rect, spec.x, edge === 'top' ? 0 : 1)
    return {
      x: base.x,
      y: base.y + (edge === 'top' ? oy : -oy),
      rot: spec.rot,
      size: spec.size,
    }
  }

  const measure = () => {
    if (disposed) return
    vw = window.innerWidth
    vh = window.innerHeight
    const rootRect = root.getBoundingClientRect()
    originX = rootRect.left + window.scrollX
    originY = rootRect.top + window.scrollY
    const mobile = mobileQuery.matches

    for (const item of items) {
      item.active = !mobile || item.spec.mobile
      item.el.style.display = item.active ? '' : 'none'
      if (!item.active) {
        // Not flying at this width: the hero keeps its own sticker.
        if (item.orig) item.orig.style.visibility = ''
        continue
      }

      const docks: Dock[] = []
      const tints: Array<string | undefined> = []
      if (item.orig) {
        docks.push(heroDock(item.orig, item.spec))
        tints.push(undefined)
      }
      for (const spec of item.spec.docks) {
        const dock = sectionDock(spec)
        if (!dock) continue
        docks.push(mobile ? { ...dock, size: dock.size * 0.74 } : dock)
        tints.push(spec.tint)
      }
      // Keep a sticker that is mid-peel pinned to the hero position it left.
      item.docks = docks
      item.tints = tints
    }
    schedule()
  }

  const queueMeasure = () => {
    window.clearTimeout(measureTimer)
    measureTimer = window.setTimeout(measure, 120)
  }

  const burst = (item: Item, count: number, distance: number) => {
    item.sparks.slice(0, count).forEach((spark, i) => {
      const angle = (i / count) * Math.PI * 2 + item.docks.length
      const d = distance * (0.7 + ((i * 37) % 10) / 20)
      spark.style.background = SPARK_COLOURS[i % SPARK_COLOURS.length]
      animate(
        spark,
        [
          { transform: 'translate(0,0) scale(0.4) rotate(0deg)', opacity: 1 },
          {
            transform: `translate(${Math.cos(angle) * d}px, ${Math.sin(angle) * d}px) scale(1) rotate(${i * 90}deg)`,
            opacity: 1,
            offset: 0.55,
          },
          {
            transform: `translate(${Math.cos(angle) * d * 1.25}px, ${Math.sin(angle) * d * 1.25 + 14}px) scale(0.2) rotate(${i * 180}deg)`,
            opacity: 0,
          },
        ],
        { duration: 760, easing: 'cubic-bezier(0.22, 1, 0.36, 1)' },
      )
    })
  }

  const shockwave = (x: number, y: number, tint: string) => {
    if (!ring) return
    ring.style.setProperty('--cx', `${x}px`)
    ring.style.setProperty('--cy', `${y}px`)
    ring.style.setProperty('--ring', tint)
    const reach = Math.hypot(Math.max(x, vw - x), Math.max(y, vh - y)) + 40
    animate(
      ring,
      [
        { '--journey-r': '0px', opacity: 0.95 },
        { '--journey-r': `${reach}px`, opacity: 0 },
      ] as unknown as Keyframe[],
      { duration: 1150, easing: 'cubic-bezier(0.16, 0.8, 0.3, 1)' },
    )
  }

  const onLand = (item: Item, placement: Placement, scrollY: number) => {
    animate(
      item.inner,
      [
        { transform: 'scale(1.42, 0.62) rotate(-9deg)' },
        { transform: 'scale(0.86, 1.18) rotate(4deg)', offset: 0.45 },
        { transform: 'scale(1.06, 0.95) rotate(-1deg)', offset: 0.75 },
        { transform: 'none' },
      ],
      { duration: 620, easing: 'cubic-bezier(0.22, 1, 0.36, 1)' },
    )
    const last = placement.dock === item.docks.length - 1
    burst(
      item,
      last && item.spec.confetti ? item.sparks.length : 6,
      last ? 74 : 44,
    )
    const tint = item.tints[placement.dock]
    if (item.spec.shockwave && tint) {
      shockwave(
        placement.x + originX - window.scrollX,
        placement.y + originY - scrollY,
        tint,
      )
    }
  }

  const onTakeOff = (item: Item) => {
    animate(
      item.inner,
      [{ transform: 'scale(0.8, 1.28) rotate(6deg)' }, { transform: 'none' }],
      { duration: 420, easing: 'cubic-bezier(0.34, 1.56, 0.64, 1)' },
    )
  }

  const scenes = (scrollY: number) => {
    if (heroArt) {
      const p = clamp01(scrollY / (vh * 0.95))
      heroArt.style.translate = `0 ${-p * 70}px`
      heroArt.style.rotate = `${-p * 7}deg`
      heroArt.style.scale = `${1 - p * 0.12}`
    }
    if (photo) {
      const rect = photo.getBoundingClientRect()
      const q = clamp01((vh - rect.top) / (vh + rect.height))
      // Small drift only: the thunder sticker is docked to the photo's edge,
      // so a large rotation would visibly peel it off the frame.
      photo.style.translate = `0 ${(0.5 - q) * 20}px`
    }
    if (marquee) {
      const target = Math.max(-2.4, Math.min(2.4, velocity / 700))
      swing = lerp(swing, target, 0.14)
      marquee.style.rotate = `${swing}deg`
      const track = marquee.firstElementChild
      const anim =
        track && typeof track.getAnimations === 'function'
          ? track.getAnimations()[0]
          : undefined
      if (anim) anim.playbackRate = 1 + Math.min(5, Math.abs(velocity) / 450)
    }
  }

  const apply = () => {
    frame = 0
    const now = performance.now()
    const scrollY = window.scrollY
    const instant = ((scrollY - lastY) / Math.max(1, now - lastT)) * 1000
    velocity += (instant - velocity) * 0.18
    lastY = scrollY
    lastT = now

    for (const item of items) {
      if (!item.active || item.docks.length === 0) continue
      const { spec } = item
      const startsAtTop = Boolean(item.orig)

      // While a hero sticker is still home, follow the real one exactly (it
      // floats and leans with the pointer), so the hand-off has no jump.
      if (item.orig && item.docks.length > 1) {
        const leg = legWindow(
          item.docks[0],
          item.docks[1],
          vh,
          spec.params.delay,
          true,
        )
        if (scrollY <= leg.start) item.docks[0] = heroDock(item.orig, spec)
      }

      const p = place(scrollY, item.docks, spec.params, vh, vw, startsAtTop)
      const resting = !p.flying && p.dock === 0

      let visible = true
      let scale = p.size / BASE
      if (item.orig && resting) visible = false
      if (spec.spawn && resting) {
        const first = item.docks[0]
        const appear = clamp01((scrollY - (first.y - vh * 0.95)) / (vh * 0.22))
        if (appear <= 0) visible = false
        scale *= easeOutBack(appear)
        if (appear > 0.35 && !item.spawned) {
          item.spawned = true
          onLand(item, p, scrollY)
        }
      }

      item.el.style.visibility = visible ? 'visible' : 'hidden'
      if (item.orig) item.orig.style.visibility = visible ? 'hidden' : ''
      if (visible) {
        item.el.style.transform = `translate3d(${p.x}px, ${p.y}px, 0) rotate(${p.rot}deg) scale(${scale})`
      }

      if (item.seeded && visible) {
        if (p.flying && !item.wasFlying) onTakeOff(item)
        if (!p.flying && item.wasFlying) onLand(item, p, scrollY)
      }
      item.seeded = true
      item.wasFlying = p.flying
      item.dock = p.dock
    }

    scenes(scrollY)
    // Keep ticking until velocity has decayed, or the swing would freeze mid-tilt.
    if (Math.abs(velocity) > 6 || Math.abs(swing) > 0.02) schedule()
  }

  function schedule() {
    if (!frame && !disposed) frame = requestAnimationFrame(apply)
  }

  const resizeObserver =
    typeof ResizeObserver === 'undefined'
      ? null
      : new ResizeObserver(queueMeasure)
  resizeObserver?.observe(document.body)

  window.addEventListener('scroll', schedule, { passive: true })
  window.addEventListener('resize', queueMeasure)
  window.addEventListener('load', queueMeasure)
  mobileQuery.addEventListener('change', queueMeasure)
  void document.fonts?.ready.then(queueMeasure)

  measure()
  // The sections hydrate and lay out after this mounts; measure once more when
  // the page has settled so the docks sit on final positions.
  const settle = window.setTimeout(measure, 700)

  return () => {
    disposed = true
    window.clearTimeout(settle)
    window.clearTimeout(measureTimer)
    if (frame) cancelAnimationFrame(frame)
    resizeObserver?.disconnect()
    window.removeEventListener('scroll', schedule)
    window.removeEventListener('resize', queueMeasure)
    window.removeEventListener('load', queueMeasure)
    mobileQuery.removeEventListener('change', queueMeasure)
    for (const item of items) if (item.orig) item.orig.style.visibility = ''
    for (const el of [heroArt, photo, marquee]) {
      if (!el) continue
      el.style.translate = ''
      el.style.rotate = ''
      el.style.scale = ''
    }
    const track = marquee?.firstElementChild
    const anim =
      track && typeof track.getAnimations === 'function'
        ? track.getAnimations()[0]
        : undefined
    if (anim) anim.playbackRate = 1
  }
}
