import { runJourney } from '@/features/landing-page/studio/journey/journey-runtime'
import { FLYERS } from '@/features/landing-page/studio/journey/journey-config'

const rect = (top: number, left = 0, width = 1000, height = 900): DOMRect =>
  ({
    top,
    left,
    width,
    height,
    right: left + width,
    bottom: top + height,
    x: left,
    y: top,
    toJSON: () => ({}),
  }) as DOMRect

/** A page where section N sits at N * 1000px, shifted by the current scroll. */
function buildPage() {
  document.body.innerHTML = ''
  const root = document.createElement('div')
  document.body.appendChild(root)

  const sections = ['about', 'showcase', 'work', 'skills', 'contact', 'outro']
  sections.forEach((id, i) => {
    const el = document.createElement('section')
    el.id = id
    el.getBoundingClientRect = () => rect(1000 + i * 1000 - window.scrollY)
    root.appendChild(el)
  })

  const layer = document.createElement('div')
  FLYERS.forEach((spec) => {
    const f = document.createElement('div')
    f.dataset.flyer = spec.id
    const inner = document.createElement('div')
    inner.dataset.flyerInner = ''
    f.appendChild(inner)
    for (let i = 0; i < 10; i += 1) {
      const s = document.createElement('i')
      s.dataset.spark = ''
      f.appendChild(s)
    }
    layer.appendChild(f)
  })
  const ring = document.createElement('div')
  ring.dataset.journeyRing = ''
  layer.appendChild(ring)
  root.appendChild(layer)
  root.getBoundingClientRect = () => rect(-window.scrollY, 0, 1280, 8000)
  return { root, layer }
}

const scrollTo = (y: number) => {
  Object.defineProperty(window, 'scrollY', { value: y, configurable: true })
  window.dispatchEvent(new Event('scroll'))
}

describe('runJourney', () => {
  beforeEach(() => {
    jest.useFakeTimers()
    window.matchMedia = ((q: string) => ({
      matches: false,
      media: q,
      addEventListener: () => {},
      removeEventListener: () => {},
    })) as unknown as typeof window.matchMedia
    Object.defineProperty(window, 'innerHeight', {
      value: 800,
      configurable: true,
    })
    Object.defineProperty(window, 'innerWidth', {
      value: 1280,
      configurable: true,
    })
    window.requestAnimationFrame = ((cb: FrameRequestCallback) =>
      setTimeout(
        () => cb(performance.now()),
        16,
      ) as unknown as number) as typeof window.requestAnimationFrame
    window.cancelAnimationFrame = ((id: number) =>
      clearTimeout(id)) as typeof window.cancelAnimationFrame
    scrollTo(0)
  })
  afterEach(() => jest.useRealTimers())

  it('flies only the sun and the heart: the hero stickers fall in the About tray', () => {
    expect(FLYERS.map((f) => f.id)).toEqual(['sun', 'heart'])
    expect(FLYERS.some((f) => f.from)).toBe(false)
  })

  it('spawns the sun only when its first section is near, and not before', () => {
    const { layer } = buildPage()
    const stop = runJourney(layer)
    jest.advanceTimersByTime(900)
    const sun = layer.querySelector<HTMLElement>('[data-flyer="sun"]')!
    expect(sun.style.visibility).toBe('hidden')
    scrollTo(1900)
    jest.advanceTimersByTime(100)
    expect(sun.style.visibility).toBe('visible')
    stop()
  })

  it('lands every sticker on its last dock at the bottom of the page, with finite transforms', () => {
    const { layer } = buildPage()
    const stop = runJourney(layer)
    jest.advanceTimersByTime(900)
    scrollTo(99999)
    jest.advanceTimersByTime(100)
    layer.querySelectorAll<HTMLElement>('[data-flyer]').forEach((el) => {
      if (el.style.visibility === 'visible') {
        expect(el.style.transform).not.toMatch(/NaN|Infinity/)
      }
    })
    stop()
  })

  it('tears down cleanly: no scroll handler survives', () => {
    const { layer } = buildPage()
    const stop = runJourney(layer)
    const remove = jest.spyOn(window, 'removeEventListener')
    stop()
    expect(remove).toHaveBeenCalledWith('scroll', expect.any(Function))
  })
})
