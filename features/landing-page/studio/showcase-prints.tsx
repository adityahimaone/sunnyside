'use client'

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
} from 'react'

import { cn } from '@/lib/utils'

import { Bolt, Burst, Daisy, Heart, Smiley, Sparkle, Sun } from './doodles'
import printStyles from './showcase-prints.module.css'
import styles from './studio.module.css'

export type StudyAccent = 'cobalt' | 'tangerine' | 'butter' | 'pink' | 'mint'

export const STUDY_SWATCHES: readonly {
  id: StudyAccent
  label: string
  color: string
}[] = [
  { id: 'cobalt', label: 'Cobalt', color: 'var(--cobalt)' },
  { id: 'tangerine', label: 'Tangerine', color: 'var(--tangerine)' },
  { id: 'butter', label: 'Butter', color: 'var(--butter)' },
  { id: 'pink', label: 'Pink', color: 'var(--pink)' },
  { id: 'mint', label: 'Mint', color: 'var(--mint)' },
]

export type StudyPrintProps = {
  id: string
  interactive?: boolean
  reduced?: boolean
  accent?: StudyAccent | null
  hoverPulse?: number
}

const SUN_THEMES: Record<
  StudyAccent,
  { bg: string; rays: string; disc: string; fg: string; discFg: string }
> = {
  cobalt: {
    bg: 'var(--cobalt)',
    rays: 'var(--butter)',
    disc: 'var(--tangerine)',
    fg: 'var(--paper)',
    discFg: 'var(--ink)',
  },
  tangerine: {
    bg: 'var(--tangerine)',
    rays: 'var(--butter)',
    disc: 'var(--cobalt)',
    fg: 'var(--ink)',
    discFg: 'var(--paper)',
  },
  butter: {
    bg: 'var(--butter)',
    rays: 'var(--pink)',
    disc: 'var(--cobalt)',
    fg: 'var(--ink)',
    discFg: 'var(--paper)',
  },
  pink: {
    bg: 'var(--pink)',
    rays: 'var(--butter)',
    disc: 'var(--tangerine)',
    fg: 'var(--ink)',
    discFg: 'var(--ink)',
  },
  mint: {
    bg: 'var(--mint)',
    rays: 'var(--butter)',
    disc: 'var(--cobalt)',
    fg: 'var(--ink)',
    discFg: 'var(--paper)',
  },
}

function SunClubPrint({
  interactive,
  reduced,
  accent,
}: {
  interactive: boolean
  reduced: boolean
  accent: StudyAccent | null
}) {
  const [angle, setAngle] = useState(0)
  const [hasInteracted, setHasInteracted] = useState(false)
  const [pulsing, setPulsing] = useState(false)
  const dragRef = useRef<{
    id: number
    startX: number
    startAngle: number
    moved: boolean
  } | null>(null)
  const pulseTimerRef = useRef<number | null>(null)

  useEffect(() => {
    return () => {
      if (pulseTimerRef.current !== null) {
        window.clearTimeout(pulseTimerRef.current)
      }
    }
  }, [])

  const triggerPulse = useCallback(() => {
    if (reduced) return
    setPulsing(true)
    if (pulseTimerRef.current !== null) {
      window.clearTimeout(pulseTimerRef.current)
    }
    pulseTimerRef.current = window.setTimeout(() => {
      setPulsing(false)
    }, 220)
  }, [reduced])

  const spinStep = useCallback(() => {
    setHasInteracted(true)
    setAngle((prev) => prev + 36)
    triggerPulse()
  }, [triggerPulse])

  const onPointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!interactive || event.button !== 0) return
    dragRef.current = {
      id: event.pointerId,
      startX: event.clientX,
      startAngle: angle,
      moved: false,
    }
  }

  const onPointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    const state = dragRef.current
    if (!interactive || !state || state.id !== event.pointerId) return
    const dx = event.clientX - state.startX
    if (!state.moved && Math.abs(dx) < 5) return
    if (!state.moved) {
      state.moved = true
      event.currentTarget.setPointerCapture(event.pointerId)
    }
    setHasInteracted(true)
    setAngle(state.startAngle + dx * 0.55)
  }

  const onPointerUp = (event: React.PointerEvent<HTMLDivElement>) => {
    const state = dragRef.current
    if (!interactive || !state || state.id !== event.pointerId) return
    dragRef.current = null
    if (!state.moved) {
      spinStep()
    }
  }

  const theme = SUN_THEMES[accent ?? 'cobalt']
  const displayDeg = ((Math.round(angle) % 360) + 360) % 360

  return (
    <div
      className={cn(
        styles.printSun,
        printStyles.sunRoot,
        interactive && printStyles.sunInteractive,
      )}
      style={
        {
          '--sun-bg': theme.bg,
          '--sun-rays': theme.rays,
          '--sun-disc': theme.disc,
          '--sun-fg': theme.fg,
          '--sun-disc-fg': theme.discFg,
          '--ray-angle': `${angle.toFixed(1)}deg`,
        } as CSSProperties
      }
      onPointerDown={interactive ? onPointerDown : undefined}
      onPointerMove={interactive ? onPointerMove : undefined}
      onPointerUp={interactive ? onPointerUp : undefined}
      onPointerCancel={
        interactive
          ? () => {
              dragRef.current = null
            }
          : undefined
      }
    >
      <div
        className={cn(styles.printSunRays, printStyles.sunRays)}
        aria-hidden
      />
      {interactive ? (
        <button
          type="button"
          className={cn(
            styles.printSunDisc,
            printStyles.sunDisc,
            printStyles.sunDiscBtn,
          )}
          data-pulsing={pulsing ? 'true' : 'false'}
          onClick={(event) => {
            event.stopPropagation()
            spinStep()
          }}
          aria-label={`Rotate sun rays, currently ${displayDeg} degrees`}
        />
      ) : (
        <div
          className={cn(styles.printSunDisc, printStyles.sunDisc)}
          aria-hidden
        />
      )}
      <div className={styles.printSunTop}>
        <span>Sun Club / est. 2026</span>
        <span>
          {interactive && hasInteracted ? `${displayDeg}°` : 'No. 001'}
        </span>
      </div>
      <p className={styles.printSunTitle} aria-hidden>
        Sun
        <br />
        Club
      </p>
      <div className={styles.printSunFoot}>
        <span>{interactive ? 'Drag or tap sun' : 'Members only'}</span>
        <span className={cn(styles.barcode, printStyles.barcode)} aria-hidden>
          {Array.from({ length: 18 }, (_, i) => (
            <i key={i} style={{ '--i': i } as CSSProperties} />
          ))}
        </span>
      </div>
    </div>
  )
}

const PEEL_STICKERS = [
  {
    name: 'Smiley',
    tilt: '-6deg',
    render: () => <Smiley className="w-[78%]" />,
  },
  {
    name: 'Daisy',
    tilt: '5deg',
    render: () => <Daisy className="w-[80%]" />,
  },
  {
    name: 'Heart',
    tilt: '-4deg',
    render: () => <Heart className="w-[78%]" />,
  },
  {
    name: 'Bolt',
    tilt: '6deg',
    render: () => <Bolt className="w-[76%]" />,
  },
  {
    name: 'Wow burst',
    tilt: '-5deg',
    render: () => <Burst text="wow" className="w-[92%]" />,
  },
  {
    name: 'Hi burst',
    tilt: '4deg',
    render: () => <Burst text="hi!" className="w-[92%]" />,
  },
  {
    name: 'Sun',
    tilt: '-6deg',
    render: () => <Sun className="w-[86%]" />,
  },
  {
    name: 'Sparkle',
    tilt: '5deg',
    render: () => <Sparkle className="w-[52%] text-[var(--tangerine)]" />,
  },
  {
    name: 'Smiley grin',
    tilt: '-4deg',
    render: () => <Smiley className="w-[78%]" />,
  },
] as const

const PEEL_ACCENTS: Record<StudyAccent, string> = {
  cobalt: 'var(--cobalt)',
  tangerine: 'var(--tangerine)',
  butter: 'var(--butter)',
  pink: 'var(--pink)',
  mint: 'var(--mint)',
}

function PeelPrint({
  interactive,
  accent,
}: {
  interactive: boolean
  accent: StudyAccent | null
}) {
  const [peeled, setPeeled] = useState<Set<number>>(() => new Set())

  const toggleSticker = (index: number) => {
    setPeeled((prev) => {
      const next = new Set(prev)
      if (next.has(index)) next.delete(index)
      else next.add(index)
      return next
    })
  }

  return (
    <div
      className={cn(styles.printPeel, printStyles.peelRoot)}
      style={
        accent
          ? ({ '--peel-accent': PEEL_ACCENTS[accent] } as CSSProperties)
          : undefined
      }
    >
      <div className={styles.printPeelTop}>
        <b>Peel here</b>
        <span className={printStyles.peelStatus}>
          {interactive && peeled.size > 0 ? (
            <>
              <span>{peeled.size}/9 peeled</span>
              <button
                type="button"
                className={printStyles.peelReset}
                onClick={() => setPeeled(new Set())}
              >
                Stick all back
              </button>
            </>
          ) : (
            <span>9 die-cuts</span>
          )}
        </span>
      </div>
      <div
        className={cn(styles.peelGrid, printStyles.peelGrid)}
        aria-hidden={!interactive || undefined}
      >
        {PEEL_STICKERS.map((sticker, index) => {
          const isPeeled = peeled.has(index)
          const cellStyle = {
            '--i': index,
            '--sticker-tilt': sticker.tilt,
          } as CSSProperties

          if (!interactive) {
            return (
              <span
                key={sticker.name + index}
                className={cn(styles.peelCell, printStyles.peelCellPreview)}
                style={cellStyle}
              >
                <span className={printStyles.peelSticker}>
                  {sticker.render()}
                </span>
              </span>
            )
          }

          return (
            <button
              key={sticker.name + index}
              type="button"
              className={cn(styles.peelCell, printStyles.peelCellBtn)}
              style={cellStyle}
              data-peeled={isPeeled ? 'true' : 'false'}
              aria-pressed={isPeeled}
              aria-label={
                isPeeled
                  ? `Stick ${sticker.name} back`
                  : `Peel ${sticker.name} sticker`
              }
              onClick={() => toggleSticker(index)}
            >
              <span className={printStyles.peelSlot} aria-hidden>
                peeled
              </span>
              <span className={printStyles.peelSticker} aria-hidden>
                {sticker.render()}
              </span>
            </button>
          )
        })}
      </div>
      <p className={styles.peelCaption}>
        {interactive
          ? 'Tap any die-cut to peel or stick it back'
          : "Drawn in code · cut, don't tear"}
      </p>
    </div>
  )
}

const TYPE_VOICES = [
  {
    id: 'syne',
    label: 'Syne · display',
    weights: '700 / 800',
    family: 'var(--font-syne), sans-serif',
    weight: 800,
    tracking: '-0.08em',
  },
  {
    id: 'geist',
    label: 'Geist · reading',
    weights: '400 / 500',
    family: 'var(--font-geist), sans-serif',
    weight: 600,
    tracking: '-0.045em',
  },
  {
    id: 'mono',
    label: 'Geist Mono · labels',
    weights: '500',
    family: 'var(--font-geist-mono), monospace',
    weight: 500,
    tracking: '-0.04em',
  },
] as const

const TYPE_GLYPHS = ['Aa', 'Gg', '01', '&?'] as const

const TYPE_THEMES: Record<
  StudyAccent,
  { bg: string; fg: string; line: string }
> = {
  butter: {
    bg: 'var(--butter)',
    fg: 'var(--ink)',
    line: 'rgb(25 26 46 / 0.35)',
  },
  pink: { bg: 'var(--pink)', fg: 'var(--ink)', line: 'rgb(25 26 46 / 0.35)' },
  mint: { bg: 'var(--mint)', fg: 'var(--ink)', line: 'rgb(25 26 46 / 0.35)' },
  tangerine: {
    bg: 'var(--tangerine)',
    fg: 'var(--ink)',
    line: 'rgb(25 26 46 / 0.35)',
  },
  cobalt: {
    bg: 'var(--cobalt)',
    fg: 'var(--paper)',
    line: 'rgb(255 250 241 / 0.32)',
  },
}

function TypePrint({
  interactive,
  reduced,
  accent,
}: {
  interactive: boolean
  reduced: boolean
  accent: StudyAccent | null
}) {
  const [voiceIndex, setVoiceIndex] = useState(0)
  const [glyphIndex, setGlyphIndex] = useState(0)

  const voice = TYPE_VOICES[voiceIndex]
  const glyph = TYPE_GLYPHS[glyphIndex]
  const theme = TYPE_THEMES[accent ?? 'butter']

  const specimenStyle: CSSProperties = {
    fontFamily: voice.family,
    fontWeight: voice.weight,
    letterSpacing: voice.tracking,
  }

  return (
    <div
      className={cn(styles.printType, printStyles.typeRoot)}
      style={
        {
          '--type-bg': theme.bg,
          '--type-fg': theme.fg,
          '--type-line': theme.line,
        } as CSSProperties
      }
    >
      <div className={styles.printTypeTop}>
        <span>Type tray / 2025</span>
        <span>{interactive ? `${voice.id} · ${glyph}` : '3 voices'}</span>
      </div>

      {interactive ? (
        <button
          key={`${voice.id}-${glyph}`}
          type="button"
          className={cn(
            styles.typeBig,
            printStyles.typeBigBtn,
            !reduced && printStyles.typeSnapIn,
          )}
          style={specimenStyle}
          onClick={() => setGlyphIndex((i) => (i + 1) % TYPE_GLYPHS.length)}
          aria-label={`Cycle specimen glyphs, showing ${glyph} in ${voice.label}`}
        >
          {glyph}
        </button>
      ) : (
        <p
          className={cn(styles.typeBig, printStyles.typeBigPreview)}
          aria-hidden
        >
          Aa
        </p>
      )}

      <div className={cn(styles.typeRows, printStyles.typeRows)}>
        {TYPE_VOICES.map((item, idx) => {
          const selected = voiceIndex === idx
          if (!interactive) {
            return (
              <div key={item.id} className={styles.typeRow}>
                <span
                  style={{
                    fontFamily: item.family,
                    fontWeight: item.id === 'syne' ? 700 : undefined,
                  }}
                >
                  {item.label}
                </span>
                <span>{item.weights}</span>
              </div>
            )
          }

          return (
            <button
              key={item.id}
              type="button"
              className={cn(styles.typeRow, printStyles.typeRowBtn)}
              data-selected={selected ? 'true' : 'false'}
              aria-pressed={selected}
              onClick={() => setVoiceIndex(idx)}
            >
              <span
                style={{
                  fontFamily: item.family,
                  fontWeight: item.id === 'syne' ? 700 : undefined,
                }}
              >
                {item.label}
              </span>
              <span className={printStyles.typeRowMeta}>
                {selected ? 'Active' : item.weights}
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}

type CurveKey = 'soft' | 'snap' | 'loose'

const SPRING_THEMES: Record<
  StudyAccent,
  { bg: string; fg: string; grid: string; softStroke: string }
> = {
  mint: {
    bg: 'var(--mint)',
    fg: 'var(--ink)',
    grid: 'rgb(25 26 46 / 0.18)',
    softStroke: 'var(--ink)',
  },
  butter: {
    bg: 'var(--butter)',
    fg: 'var(--ink)',
    grid: 'rgb(25 26 46 / 0.18)',
    softStroke: 'var(--ink)',
  },
  pink: {
    bg: 'var(--pink)',
    fg: 'var(--ink)',
    grid: 'rgb(25 26 46 / 0.18)',
    softStroke: 'var(--ink)',
  },
  tangerine: {
    bg: 'var(--tangerine)',
    fg: 'var(--ink)',
    grid: 'rgb(25 26 46 / 0.22)',
    softStroke: 'var(--ink)',
  },
  cobalt: {
    bg: 'var(--cobalt)',
    fg: 'var(--paper)',
    grid: 'rgb(255 250 241 / 0.2)',
    softStroke: 'var(--paper)',
  },
}

const easeInOutCubic = (t: number) =>
  t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2
const easeOutExpo = (t: number) => (t >= 1 ? 1 : 1 - Math.pow(2, -10 * t))
const easeOutQuad = (t: number) => 1 - (1 - t) * (1 - t)

function SpringPrint({
  interactive,
  reduced,
  accent,
  hoverPulse,
}: {
  interactive: boolean
  reduced: boolean
  accent: StudyAccent | null
  hoverPulse: number
}) {
  const [selectedCurve, setSelectedCurve] = useState<'all' | CurveKey>('all')
  const softPathRef = useRef<SVGPathElement>(null)
  const snapPathRef = useRef<SVGPathElement>(null)
  const loosePathRef = useRef<SVGPathElement>(null)
  const softDotRef = useRef<SVGCircleElement>(null)
  const snapDotRef = useRef<SVGCircleElement>(null)
  const looseDotRef = useRef<SVGCircleElement>(null)
  const rafRef = useRef<number | null>(null)

  const stopRace = useCallback(() => {
    if (rafRef.current !== null) {
      window.cancelAnimationFrame(rafRef.current)
      rafRef.current = null
    }
  }, [])

  const runRace = useCallback(() => {
    stopRace()
    const specs: {
      path: SVGPathElement | null
      dot: SVGCircleElement | null
      duration: number
      ease: (t: number) => number
    }[] = [
      {
        path: softPathRef.current,
        dot: softDotRef.current,
        duration: 820,
        ease: easeInOutCubic,
      },
      {
        path: snapPathRef.current,
        dot: snapDotRef.current,
        duration: 560,
        ease: easeOutExpo,
      },
      {
        path: loosePathRef.current,
        dot: looseDotRef.current,
        duration: 1020,
        ease: easeOutQuad,
      },
    ]

    if (reduced) {
      for (const spec of specs) {
        spec.dot?.setAttribute('cx', '190')
        spec.dot?.setAttribute('cy', '20')
      }
      return
    }

    const prepared = specs.flatMap((spec) => {
      if (!spec.path || !spec.dot) return []
      return [
        {
          ...spec,
          path: spec.path,
          dot: spec.dot,
          length: spec.path.getTotalLength(),
        },
      ]
    })

    if (!prepared.length) return

    const start = performance.now()
    const totalDuration = 1050

    const tick = (now: number) => {
      const elapsed = now - start
      for (const item of prepared) {
        const raw = Math.max(0, Math.min(1, elapsed / item.duration))
        const progress = Math.max(0, Math.min(1, item.ease(raw)))
        const pt = item.path.getPointAtLength(progress * item.length)
        item.dot.setAttribute('cx', pt.x.toFixed(2))
        item.dot.setAttribute('cy', pt.y.toFixed(2))
      }

      if (elapsed < totalDuration) {
        rafRef.current = window.requestAnimationFrame(tick)
      } else {
        rafRef.current = null
      }
    }

    rafRef.current = window.requestAnimationFrame(tick)
  }, [reduced, stopRace])

  useEffect(() => {
    return stopRace
  }, [stopRace])

  useEffect(() => {
    if (!interactive || reduced) return
    const id = window.requestAnimationFrame(() => runRace())
    return () => {
      window.cancelAnimationFrame(id)
      stopRace()
    }
  }, [interactive, reduced, runRace, stopRace])

  useEffect(() => {
    if (interactive || reduced || hoverPulse <= 0) return
    runRace()
  }, [hoverPulse, interactive, reduced, runRace])

  const theme = SPRING_THEMES[accent ?? 'mint']
  const curveOpacity = (key: CurveKey) =>
    selectedCurve === 'all' || selectedCurve === key ? 1 : 0.22

  const svgGraphic = (
    <svg className={styles.springSvg} viewBox="0 0 200 130" aria-hidden>
      <g className={styles.grid} style={{ stroke: theme.grid }}>
        <path d="M10 20H190M10 65H190M10 110H190" />
        <path d="M10 14V116M60 14V116M110 14V116M160 14V116" />
      </g>
      <path
        ref={softPathRef}
        className={styles.curveSoft}
        style={{
          stroke: theme.softStroke,
          opacity: curveOpacity('soft'),
          transition: 'opacity 0.2s ease',
        }}
        d="M10 110C70 110 130 20 190 20"
      />
      <path
        ref={snapPathRef}
        className={styles.curveSnap}
        style={{
          opacity: curveOpacity('snap'),
          transition: 'opacity 0.2s ease',
        }}
        d="M10 110C38 110 62 20 190 20"
      />
      <path
        ref={loosePathRef}
        className={styles.curveLoose}
        style={{
          opacity: curveOpacity('loose'),
          transition: 'opacity 0.2s ease',
        }}
        d="M10 110C105 110 94 -2 190 20"
      />
      <circle
        ref={softDotRef}
        cx="190"
        cy="20"
        r="3.8"
        fill={theme.softStroke}
        opacity={curveOpacity('soft')}
      />
      <circle
        ref={snapDotRef}
        cx="190"
        cy="20"
        r="4"
        fill="var(--cobalt)"
        opacity={curveOpacity('snap')}
      />
      <circle
        ref={looseDotRef}
        cx="190"
        cy="20"
        r="4.2"
        fill="var(--tangerine)"
        opacity={curveOpacity('loose')}
      />
    </svg>
  )

  return (
    <div
      className={cn(styles.printSpring, printStyles.springRoot)}
      style={
        {
          '--spring-bg': theme.bg,
          '--spring-fg': theme.fg,
        } as CSSProperties
      }
    >
      <div className={styles.printSpringTop}>
        <span>Spring study / 2025</span>
        {interactive ? (
          <button
            type="button"
            className={printStyles.springReplay}
            onClick={runRace}
          >
            Replay
          </button>
        ) : (
          <span>Same distance</span>
        )}
      </div>

      {interactive ? (
        <button
          type="button"
          className={printStyles.springStageBtn}
          onClick={runRace}
          aria-label="Replay spring curve race"
        >
          {svgGraphic}
        </button>
      ) : (
        svgGraphic
      )}

      <div className={styles.printSpringFoot}>
        {(
          [
            { key: 'soft', dot: theme.softStroke },
            { key: 'snap', dot: 'var(--cobalt)' },
            { key: 'loose', dot: 'var(--tangerine)' },
          ] as const
        ).map((item) => {
          if (!interactive) {
            return <span key={item.key}>{item.key}</span>
          }
          const active = selectedCurve === item.key
          return (
            <button
              key={item.key}
              type="button"
              className={printStyles.springPill}
              data-active={active ? 'true' : 'false'}
              aria-pressed={active}
              onClick={() => {
                setSelectedCurve((curr) =>
                  curr === item.key ? 'all' : item.key,
                )
                runRace()
              }}
            >
              <i
                className={printStyles.springDotLegend}
                style={{ background: item.dot }}
                aria-hidden
              />
              {item.key}
            </button>
          )
        })}
      </div>
    </div>
  )
}

export function StudyPrint({
  id,
  interactive = false,
  reduced = false,
  accent = null,
  hoverPulse = 0,
}: StudyPrintProps) {
  switch (id) {
    case 'sun-club':
      return (
        <SunClubPrint
          interactive={interactive}
          reduced={reduced}
          accent={accent}
        />
      )
    case 'peel-here':
      return <PeelPrint interactive={interactive} accent={accent} />
    case 'type-tray':
      return (
        <TypePrint
          interactive={interactive}
          reduced={reduced}
          accent={accent}
        />
      )
    default:
      return (
        <SpringPrint
          interactive={interactive}
          reduced={reduced}
          accent={accent}
          hoverPulse={hoverPulse}
        />
      )
  }
}
