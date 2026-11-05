'use client'

import { Pin, RotateCcw, Scissors } from 'lucide-react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import Image from 'next/image'
import Link from 'next/link'
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type KeyboardEvent,
  type PointerEvent,
} from 'react'

import type { WorkProject } from '@/data/projects'
import { DESIGN_CASES, type DesignCase } from '@/features/case-library'
import { useMediaQuery } from '@/hooks/use-media'
import { ArrowUpRight, Sparkle } from '../doodles'
import { PIT_STICKERS, type PitKind } from '../gravity/pit-config'
import { StickerArt } from '../gravity/sticker-art'
import { Reveal } from '../reveal'
import {
  ARCHIVE_LINKS,
  DEFAULT_YARN,
  FEATURED_SYSTEM_SLUGS,
  GALLERY_ITEMS,
  PROJECT_GALLERY_ITEMS,
  SYSTEM_GALLERY_ITEMS,
  YARN_HEX,
  YARN_SPOOLS,
  buildSystemGalleryItems,
  pinFor,
  PIECE_TAPE,
  PIECE_TILT,
  type GalleryItem,
  type PiecePin,
  type YarnLink,
  type YarnSpool,
} from './work-gallery-data'
import { ImagePlate, useDeveloped } from '@/components/ui/image-plate'

import styles from './work-gallery.module.css'

/**
 * The selected-work chapter is a cutting mat with paper taped to it.
 *
 * The board is curated. Everything shows the six releases and six featured
 * systems; Systems reveals thirteen (the featured six plus the newest case,
 * Wildflower, Cove and the recent cases). Pieces hang in a hand-placed wall: four
 * columns, each card dropped a little lower than the last so the board reads
 * pinned rather than gridded. Below the desktop split the same DOM becomes one
 * horizontal snap run instead, because four columns of paper on a phone is a
 * postage stamp; there the arrows step one tile at a time. Filters redraw the
 * wall, and a tap lifts the notes into a drawer.
 */

const TOTAL = GALLERY_ITEMS.length

/** The six that sit beside the releases on the Everything tab. */
const FEATURED_SYSTEMS = new Set<string>(FEATURED_SYSTEM_SLUGS)

const FILTERS = [
  { id: 'all', label: 'Everything' },
  { id: 'project', label: 'Releases' },
  { id: 'design-system', label: 'Systems' },
] as const

type Filter = (typeof FILTERS)[number]['id']

/** Hand-placed drop per piece, keyed off the id so a filter never re-deals it. */
const CELL_DROP = [0, 1.6, 0.5, 2.1, 0.9, 2.6]

const dropFor = (id: string) =>
  CELL_DROP[
    [...id].reduce((sum, char) => sum + char.charCodeAt(0), 0) %
      CELL_DROP.length
  ]

/**
 * The same seven die-cut shapes the About liner is peeled from, pinned to the
 * mat's edge band so the decoration never sits over a piece's copy. `x`/`y` are
 * shares of the board.
 */
const MAT_STICKERS: Record<PitKind, { label: string; x: number; y: number }> = {
  // Pinned to the mat's rim: a die-cut sitting on the board's edge band reads
  // as slapped on, and at most it laps ~14px over a card's border — never its
  // copy, which starts a gutter further in.
  smiley: { label: 'Smiley', x: 0.2, y: 2.1 },
  burst: { label: 'Wow', x: 97.4, y: 1.7 },
  daisy: { label: 'Daisy', x: 0.2, y: 33 },
  bolt: { label: 'Bolt', x: 97.4, y: 30 },
  atom: { label: 'Atom', x: 97.4, y: 65 },
  // The card in the first column leans into the rim, so the city stamp sits
  // lower than the others — there it only laps the card's paper edge.
  stampCity: { label: 'Jakarta · GMT+7', x: 0.2, y: 74 },
  stampRole: { label: 'Design engineer', x: 97.4, y: 94 },
}

/** A pin's centre, in mat-local pixels. */
type Point = { x: number; y: number }

/**
 * The strand's shape. A taut line between two pins looks printed; real yarn
 * hangs, so the control point drops below the midpoint by a share of the span,
 * clamped so a short hop does not sag like a long one. Pure geometry, no state.
 */
function yarnPath(a: Point, b: Point) {
  const span = Math.hypot(b.x - a.x, b.y - a.y)
  const sag = Math.min(64, Math.max(15, span * 0.16))
  const cx = (a.x + b.x) / 2
  const cy = (a.y + b.y) / 2 + sag

  return `M ${a.x.toFixed(1)} ${a.y.toFixed(1)} Q ${cx.toFixed(1)} ${cy.toFixed(
    1,
  )} ${b.x.toFixed(1)} ${b.y.toFixed(1)}`
}

/**
 * The strings themselves. Drawn in mat pixels over the paper, so the thread
 * crosses a card the way a thread does; the pin sits inside the card and the
 * strand ties over it. Decorative and non-interactive: the pins are the
 * controls, everything here is `aria-hidden` and takes no pointer events.
 */
function YarnLayer({
  links,
  pins,
  selected,
}: {
  links: readonly YarnLink[]
  pins: Record<string, Point>
  selected: string | null
}) {
  const drawn = links.flatMap((link) => {
    const a = pins[link.from]
    const b = pins[link.to]
    if (!a || !b) return []
    const hex = YARN_HEX[link.spool]
    const live = link.from === selected || link.to === selected

    return [{ key: `${link.from}:${link.to}:${link.spool}`, a, b, hex, live }]
  })

  if (!drawn.length) return null

  return (
    <svg className={styles.yarnLayer} aria-hidden focusable="false">
      {drawn.map(({ key, a, b, hex, live }) => {
        const d = yarnPath(a, b)

        return (
          <g key={key} opacity={live ? 1 : 0.92}>
            {/* A dark under-strand keeps a thin thread legible on cork. */}
            <path
              d={d}
              fill="none"
              stroke="#241505"
              strokeWidth={live ? 4.8 : 4.2}
              strokeLinecap="round"
              opacity="0.42"
            />
            <path
              d={d}
              fill="none"
              stroke={hex}
              strokeWidth={live ? 3 : 2.4}
              strokeLinecap="round"
            />
            {/* The twist: a dashed highlight reads as fibre, not as ink. */}
            <path
              d={d}
              fill="none"
              stroke="rgb(255 250 241 / 0.55)"
              strokeWidth={1}
              strokeDasharray="4 6"
              strokeLinecap="round"
            />
            {[a, b].map((point, index) => (
              <circle
                key={index}
                cx={point.x}
                cy={point.y}
                r={4.6}
                fill="none"
                stroke={hex}
                strokeWidth="2"
              />
            ))}
          </g>
        )
      })}
    </svg>
  )
}

// Filtering re-deals the board, so the set remounts instead of morphing: a
// remount can never fly a card across the mat, it just settles in by hand.
const GRID_VARIANTS = {
  hidden: {},
  show: { transition: { staggerChildren: 0.03 } },
}

// Never fades from nothing: the board stays legible while the new hand settles,
// it only rises a few pixels in reading order.
const CELL_VARIANTS = {
  hidden: { opacity: 0.45, y: 14 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.28, ease: [0.22, 1, 0.36, 1] as const },
  },
}

/** Hand-placed tape per piece, assigned by position so it never re-deals. */
const PIECE_AT = new Map(GALLERY_ITEMS.map((item, index) => [item.id, index]))

const PIECE_META = (item: GalleryItem) => {
  // Look up by id, not object identity: the live API builds fresh case objects.
  const at = PIECE_AT.get(item.id) ?? 0

  return {
    tilt: PIECE_TILT[at % PIECE_TILT.length],
    tape: PIECE_TAPE[at % PIECE_TAPE.length],
  }
}

export function GeneratedCover({ project }: { project: WorkProject }) {
  const lab = project.slug === 'labgrownbeasts'

  return (
    <div
      className={styles.generatedCover}
      data-variant={lab ? 'petri' : 'orbit'}
      aria-hidden
    >
      <div className={styles.genGrid} />
      <span className={styles.genCode}>
        AH—{String(project.id + 1).padStart(3, '0')} / generated sleeve
      </span>
      <span className={styles.genGhost}>{lab ? 'LAB' : 'P2P'}</span>
      <span className={styles.genRing} />
      {lab ? (
        <>
          <span className={styles.genCell} data-size="lg" />
          <span className={styles.genCell} data-size="sm" />
        </>
      ) : (
        <span className={styles.genOrbit} />
      )}
      <span className={styles.genNote}>
        {lab ? 'grown, not assembled' : 'peer to peer / settle'}
      </span>
    </div>
  )
}

function SwatchDeck({ swatches }: { swatches: readonly string[] }) {
  if (!swatches.length) return null

  return (
    <div className={styles.deck} aria-hidden>
      {swatches.map((hex) => (
        <span key={hex} className={styles.chip}>
          <span className={styles.chipFill} style={{ backgroundColor: hex }} />
          <span className={styles.chipHex}>{hex.replace('#', '')}</span>
        </span>
      ))}
    </div>
  )
}

/**
 * The cover art for one piece, shared by the tile and its drawer.
 *
 * A cover is a print being developed: paper and a thin grid hold the frame,
 * a slow sheen crosses it, and the photograph fades up underneath once it
 * decodes. The frame's aspect ratio reserves the space, so nothing jumps.
 */
function CoverPlate({
  item,
  sizes,
  eager,
}: {
  item: GalleryItem
  sizes: string
  eager?: boolean
}) {
  const { developed, onLoad, ref } = useDeveloped()
  const project = item.kind === 'project' ? item.project : undefined
  const src = item.kind === 'design-system' ? item.cover : project?.cover

  if (!src) return project ? <GeneratedCover project={project} /> : null

  return (
    <>
      <ImagePlate developed={developed} label={`${item.index} developing`} />
      <Image
        src={src}
        alt={
          item.kind === 'design-system'
            ? item.coverAlt
            : `${project?.title} interface`
        }
        fill
        sizes={sizes}
        preload={eager}
        className={styles.cover}
        style={{ objectPosition: item.position }}
        onLoad={onLoad}
        ref={ref}
      />
    </>
  )
}

type PieceProps = {
  item: GalleryItem
  stamped: boolean
  /** This pin is the first end of a string waiting for a second one. */
  armed: boolean
  /** The pin already carries at least one strand. */
  threaded: boolean
  /** Below the wall there is no gutter to string across, so the pin is
      hardware only: no tab stop, no promise it cannot keep. */
  pinnable: boolean
  pin: PiecePin
  pinRef: (element: HTMLElement | null) => void
  onPin: (id: string) => void
  onStamp: (id: string) => void
  onOpen: (item: GalleryItem) => void
  onPan: (event: PointerEvent<HTMLElement>, reset?: boolean) => void
  onPeek: (item: GalleryItem, element: HTMLElement) => void
  onPeekEnd: () => void
  drop: number
}

function PaperPiece({
  item,
  stamped,
  armed,
  threaded,
  pinnable,
  pin,
  pinRef,
  onPin,
  onStamp,
  onOpen,
  onPan,
  onPeek,
  onPeekEnd,
  drop,
}: PieceProps) {
  const reduced = useReducedMotion() ?? false
  const meta = PIECE_META(item)
  const tape = meta.tape
  /** The print only lifts off the artwork, not off the whole card. */
  const artRef = useRef<HTMLSpanElement>(null)

  const overArt = (event: PointerEvent<HTMLElement>) => {
    const box = artRef.current?.getBoundingClientRect()
    if (!box) return false
    return (
      event.clientX >= box.left &&
      event.clientX <= box.right &&
      event.clientY >= box.top &&
      event.clientY <= box.bottom
    )
  }

  return (
    <article
      className={styles.piece}
      data-kind={item.kind}
      data-tape={tape}
      data-stamped={stamped}
      data-pin={pin}
      data-piece
      style={
        {
          '--tilt': `${meta.tilt}deg`,
          '--cell-drop': `${drop}rem`,
        } as CSSProperties
      }
      onPointerMove={(event) => {
        onPan(event)
        if (event.pointerType === 'touch') return
        // The card is clickable edge to edge, so the pointer target is the
        // overlay button, not the artwork: hit-test the frame's box instead of
        // trusting `event.target`.
        if (overArt(event)) onPeek(item, event.currentTarget)
        else onPeekEnd()
      }}
      onPointerLeave={(event) => {
        onPan(event, true)
        onPeekEnd()
      }}
      aria-labelledby={`${item.id}-piece-title`}
    >
      <span className={styles.tape} aria-hidden />

      {/* The pin is the card's hardware and its one linking control: click it,
          then click a second pin, and a strand ties the two. */}
      <button
        type="button"
        ref={pinRef}
        className={styles.pin}
        data-armed={armed}
        data-threaded={threaded}
        disabled={!pinnable}
        tabIndex={pinnable ? 0 : -1}
        aria-hidden={pinnable ? undefined : true}
        aria-pressed={armed}
        aria-label={`Pin ${item.index}, ${item.title}${
          armed ? ' — click another pin to tie a strand' : ' — tie a strand'
        }`}
        title={
          armed
            ? 'Click another pin to tie a strand, or this one to cancel'
            : 'Click two pins to tie a strand'
        }
        onClick={(event) => {
          event.stopPropagation()
          onPin(item.id)
        }}
      >
        <span className={styles.pinShadow} aria-hidden />
        <span className={styles.pinNeedle} aria-hidden />
        <span className={styles.pinCap} aria-hidden>
          <span className={styles.pinCore} />
        </span>
        {armed ? <span className={styles.pinPulse} aria-hidden /> : null}
      </button>

      <span className={styles.pieceIndex} aria-hidden>
        {item.index}
      </span>

      <span className={styles.frame} data-frame ref={artRef}>
        <span className={styles.panTarget} data-pan-target>
          <CoverPlate
            item={item}
            sizes="(min-width: 1024px) 25vw, (min-width: 640px) 60vw, 78vw"
          />
        </span>
        <span className={styles.kindTag}>
          {item.kind === 'design-system' ? 'System' : 'Release'}
        </span>
      </span>

      <div className={styles.body}>
        <span className={styles.meta}>
          {item.categoryLabel} · {item.year}
        </span>
        <h3 id={`${item.id}-piece-title`} className={styles.title}>
          {item.title}
        </h3>
        <span className={styles.note}>{item.description}</span>

        {item.kind === 'design-system' ? (
          <SwatchDeck swatches={item.swatches} />
        ) : (
          <span className={styles.tags}>
            {item.tags.slice(0, 3).map((tag) => (
              <span key={tag}>{tag}</span>
            ))}
          </span>
        )}

        <span className={styles.cta}>
          {item.cta}
          <ArrowUpRight className={styles.ctaArrow} />
        </span>
      </div>

      <button
        type="button"
        className={styles.openButton}
        onClick={() => onOpen(item)}
        aria-label={`Open the notes for ${item.title}, ${item.categoryLabel}, ${item.year}`}
      />

      <button
        type="button"
        className={styles.stampButton}
        aria-pressed={stamped}
        aria-label={`${stamped ? 'Remove the stamp from' : 'Stamp'} ${item.title}`}
        onClick={() => onStamp(item.id)}
      >
        {stamped ? 'Stamped' : 'Stamp it'}
      </button>

      <AnimatePresence>
        {stamped ? (
          <motion.span
            initial={reduced ? false : { scale: 1.6, opacity: 0, rotate: -26 }}
            animate={{ scale: 1, opacity: 1, rotate: -13 }}
            exit={reduced ? undefined : { scale: 0.6, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 360, damping: 22 }}
            className={styles.stamp}
            aria-hidden
          >
            <span>Approved</span>
            <span className={styles.stampSmall}>craft</span>
          </motion.span>
        ) : null}
      </AnimatePresence>
    </article>
  )
}

type PeekState = {
  item: GalleryItem
  x: number
  y: number
  width: number
}

/**
 * Hovering a piece lifts a larger print of the same cover off the mat — the
 * card the visitor is already looking at, only big enough to read. Decoration
 * for the pointer: no focus trap, no controls, `aria-hidden`, and it never
 * takes pointer events so the card underneath stays clickable.
 */
function Peek({ peek, reduced }: { peek: PeekState; reduced: boolean }) {
  return (
    <motion.div
      className={styles.peek}
      style={{ left: peek.x, top: peek.y, width: peek.width }}
      initial={reduced ? { opacity: 0 } : { opacity: 0, scale: 0.86, y: 18 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={reduced ? { opacity: 0 } : { opacity: 0, scale: 0.9, y: 10 }}
      transition={{ type: 'spring', stiffness: 320, damping: 28 }}
      aria-hidden
    >
      <span className={styles.peekFrame}>
        <CoverPlate item={peek.item} sizes="(min-width: 1024px) 34rem, 70vw" />
      </span>
      <span className={styles.peekBar}>
        <span className={styles.peekIndex}>{peek.item.index}</span>
        <span className={styles.peekTitle}>{peek.item.title}</span>
        <span className={styles.peekKind}>
          {peek.item.kind === 'design-system' ? 'System' : 'Release'}
        </span>
      </span>
    </motion.div>
  )
}

/** Movable vinyl on the mat. Small on purpose: decoration, never a card. */
function MatStickers({
  peeled,
  onPeel,
  bounds,
}: {
  peeled: ReadonlySet<string>
  onPeel: (id: string) => void
  bounds: React.RefObject<HTMLDivElement | null>
}) {
  const down = useRef({ x: 0, y: 0 })

  return (
    <div className={styles.stickerZone}>
      {PIT_STICKERS.map((sticker) => {
        const meta = MAT_STICKERS[sticker.id]
        const done = peeled.has(sticker.id)
        const stamp = sticker.id === 'stampCity' || sticker.id === 'stampRole'

        return (
          <motion.button
            key={sticker.id}
            type="button"
            drag
            dragConstraints={bounds}
            dragMomentum={false}
            dragElastic={0.14}
            whileDrag={{
              scale: 1.18,
              rotate: 0,
              zIndex: 9,
              cursor: 'grabbing',
            }}
            initial={{ opacity: 0, scale: 0.7 }}
            animate={{ opacity: 1, scale: 1, rotate: sticker.rest.rot }}
            transition={{ type: 'spring', stiffness: 300, damping: 24 }}
            className={styles.sticker}
            data-kind={sticker.id}
            style={{
              left: `${meta.x}%`,
              top: `${meta.y}%`,
              width: stamp ? '2.4rem' : '1.9rem',
              height: stamp ? '2.4rem' : '1.9rem',
            }}
            aria-pressed={done}
            aria-label={`${meta.label} — ${done ? 'peeled' : 'peel me'}`}
            title={meta.label}
            onPointerDown={(event) => {
              down.current = { x: event.clientX, y: event.clientY }
            }}
            onClick={(event) => {
              // A drag that ends over the scrap is not a peel.
              const moved = Math.hypot(
                event.clientX - down.current.x,
                event.clientY - down.current.y,
              )
              if (moved > 6) return
              onPeel(sticker.id)
            }}
          >
            <StickerArt id={sticker.id} />
            {done ? (
              <span className={styles.stickerTick} aria-hidden>
                <Sparkle />
              </span>
            ) : null}
          </motion.button>
        )
      })}
    </div>
  )
}

export function WorkGallery({
  designCases,
}: {
  designCases?: readonly DesignCase[]
} = {}) {
  const reduced = useReducedMotion() ?? false
  const trackRef = useRef<HTMLDivElement>(null)
  const dialogRef = useRef<HTMLDialogElement>(null)
  const drag = useRef<{
    startX: number
    startLeft: number
    moved: boolean
    id: number
  } | null>(null)
  const [dragging, setDragging] = useState(false)
  const [filter, setFilter] = useState<Filter>('all')
  const [stamped, setStamped] = useState<ReadonlySet<string>>(new Set())
  const [active, setActive] = useState<GalleryItem | null>(null)
  const [progress, setProgress] = useState(0)
  const [edges, setEdges] = useState({ start: true, end: false })
  const [peeled, setPeeled] = useState<ReadonlySet<string>>(new Set())
  const [peek, setPeek] = useState<PeekState | null>(null)
  const boardRef = useRef<HTMLDivElement>(null)
  const peekTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const openPeekId = useRef<string | null>(null)
  const peekPending = useRef<string | null>(null)

  /* ── the corkboard's hardware ───────────────────────────────────────────
     Strings, the waiting pin, the spool in hand, and a remount counter that
     puts every card back where the wall dealt it. */
  const wall = useMediaQuery('(min-width: 1024px)')
  const [yarn, setYarn] = useState<readonly YarnLink[]>(DEFAULT_YARN)
  const [spool, setSpool] = useState<YarnSpool>('crimson')
  const [strings, setStrings] = useState(true)
  const [armed, setArmed] = useState<string | null>(null)
  const [pins, setPins] = useState<Record<string, Point>>({})
  const [redrawn, setRedrawn] = useState(0)
  const [moved, setMoved] = useState(false)
  const [notice, setNotice] = useState('')
  const pinEls = useRef<Record<string, HTMLElement | null>>({})
  const pinFrame = useRef(0)

  const systemItems = useMemo(
    () =>
      designCases ? buildSystemGalleryItems(designCases) : SYSTEM_GALLERY_ITEMS,
    [designCases],
  )

  const featuredSystemItems = useMemo(
    () => systemItems.filter((item) => FEATURED_SYSTEMS.has(item.id)),
    [systemItems],
  )

  /** The full catalogue, not just the thirteen the board shows. */
  const caseCount = designCases?.length ?? DESIGN_CASES.length

  const allItems = useMemo(
    () => [...PROJECT_GALLERY_ITEMS, ...featuredSystemItems],
    [featuredSystemItems],
  )

  const visible =
    filter === 'all'
      ? allItems
      : filter === 'design-system'
        ? systemItems
        : PROJECT_GALLERY_ITEMS

  const drawn = useMemo(
    () =>
      yarn.filter(
        (link) =>
          visible.some((piece) => piece.id === link.from) &&
          visible.some((piece) => piece.id === link.to),
      ),
    [yarn, visible],
  )

  const threaded = useMemo(() => {
    const ids = new Set<string>()
    for (const link of drawn) {
      ids.add(link.from)
      ids.add(link.to)
    }
    return ids
  }, [drawn])

  /**
   * Pin centres in mat pixels. The strands are geometry, not layout: they are
   * measured off the live buttons, so a dragged card, a filter or a resize
   * re-ties the same string to the same pin instead of holding a stale path.
   */
  const measurePins = useCallback(() => {
    const mat = boardRef.current
    if (!mat) return
    const base = mat.getBoundingClientRect()
    const next: Record<string, Point> = {}

    for (const [id, element] of Object.entries(pinEls.current)) {
      if (!element) continue
      const rect = element.getBoundingClientRect()
      next[id] = {
        x: rect.left - base.left + rect.width / 2,
        y: rect.top - base.top + rect.height / 2,
      }
    }

    setPins(next)
  }, [])

  /** A drag fires on every frame; measure once per frame at most. */
  const requeuePins = useCallback(() => {
    if (pinFrame.current) cancelAnimationFrame(pinFrame.current)
    pinFrame.current = requestAnimationFrame(() => {
      pinFrame.current = 0
      measurePins()
    })
  }, [measurePins])

  useLayoutEffect(() => {
    measurePins()
    // The wall settles in passes: cells stagger in, covers decode. A single
    // measure on mount reads half-placed paper, so take the late reading too.
    const settled = window.setTimeout(measurePins, 340)
    const observer = new ResizeObserver(requeuePins)
    if (boardRef.current) observer.observe(boardRef.current)
    window.addEventListener('resize', requeuePins)
    void document.fonts?.ready.then(measurePins)

    return () => {
      window.clearTimeout(settled)
      observer.disconnect()
      window.removeEventListener('resize', requeuePins)
      if (pinFrame.current) cancelAnimationFrame(pinFrame.current)
    }
  }, [measurePins, requeuePins, visible, filter, redrawn, wall])

  /** One pin, then a second: tie or cut the strand between them. */
  const tieYarn = useCallback(
    (id: string) => {
      const label = visible.find((piece) => piece.id === id)?.index ?? id

      if (!armed) {
        setArmed(id)
        setNotice(`Pin ${label} held. Choose a second pin to tie a strand.`)
        return
      }

      if (armed === id) {
        setArmed(null)
        setNotice(`Pin ${label} released.`)
        return
      }

      const fromLabel =
        visible.find((piece) => piece.id === armed)?.index ?? armed
      const existing = yarn.find(
        (link) =>
          (link.from === armed && link.to === id) ||
          (link.from === id && link.to === armed),
      )

      setYarn((current) =>
        existing
          ? current.filter((link) => link !== existing)
          : [...current, { from: armed, to: id, spool }],
      )
      setArmed(null)
      setNotice(
        existing
          ? `Strand cut between ${fromLabel} and ${label}.`
          : `Strand tied between ${fromLabel} and ${label}.`,
      )
    },
    [armed, spool, visible, yarn],
  )

  const resetBoard = () => {
    setYarn(DEFAULT_YARN)
    setArmed(null)
    setMoved(false)
    setRedrawn((round) => round + 1)
    setNotice('Board reset. Cards back on their pins, strings re-tied.')
  }

  /** Has the visitor re-drawn the board? Then the reset button earns its place. */
  const redrawnBoard =
    moved ||
    yarn.length !== DEFAULT_YARN.length ||
    yarn.some((link, index) => {
      const original = DEFAULT_YARN[index]
      return (
        !original ||
        original.from !== link.from ||
        original.to !== link.to ||
        original.spool !== link.spool
      )
    })

  const stringsOn = strings && wall

  const measure = useCallback(() => {
    const el = trackRef.current
    if (!el) return
    const max = el.scrollWidth - el.clientWidth
    const p = max > 0 ? el.scrollLeft / max : 0
    setProgress(Math.max(0, Math.min(1, p)))
    setEdges({ start: el.scrollLeft <= 4, end: el.scrollLeft >= max - 4 })
  }, [])

  useEffect(() => {
    const el = trackRef.current
    if (!el) return
    measure()
    el.addEventListener('scroll', measure, { passive: true })
    const ro = new ResizeObserver(measure)
    ro.observe(el)
    return () => {
      el.removeEventListener('scroll', measure)
      ro.disconnect()
    }
  }, [measure, visible.length])

  useEffect(() => {
    const el = trackRef.current
    if (!el) return
    el.scrollTo({ left: 0, behavior: 'auto' })
    measure()
  }, [filter, measure])

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return
    if (active && !dialog.open) {
      dialog.showModal()
      document.body.style.overflow = 'hidden'
    } else if (!active && dialog.open) {
      dialog.close()
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [active])

  /** One tile plus one gap, measured off the live card, not a constant. */
  const step = () => {
    const el = trackRef.current
    const card = el?.querySelector<HTMLElement>('[data-piece]')
    if (!el || !card) return 320
    const gap = Number.parseFloat(getComputedStyle(el).columnGap) || 0
    return card.offsetWidth + gap
  }

  const nudge = (direction: -1 | 1) => {
    trackRef.current?.scrollBy({
      left: direction * step(),
      behavior: reduced ? 'auto' : 'smooth',
    })
  }

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') {
      event.preventDefault()
      nudge(event.key === 'ArrowRight' ? 1 : -1)
      return
    }
    if (event.key !== 'Home' && event.key !== 'End') return
    event.preventDefault()
    const el = trackRef.current
    if (!el) return
    el.scrollTo({
      left: event.key === 'Home' ? 0 : el.scrollWidth,
      behavior: reduced ? 'auto' : 'smooth',
    })
  }

  const onPointerDown = (event: PointerEvent<HTMLDivElement>) => {
    if (event.pointerType !== 'mouse' || event.button !== 0) return
    const el = trackRef.current
    if (!el) return
    drag.current = {
      startX: event.clientX,
      startLeft: el.scrollLeft,
      moved: false,
      id: event.pointerId,
    }
    // Capture only once the gesture becomes a drag: capturing on pointerdown
    // takes the click away from the card underneath it.
  }

  const onPointerMove = (event: PointerEvent<HTMLDivElement>) => {
    const state = drag.current
    const el = trackRef.current
    if (!state || !el || state.id !== event.pointerId) return
    const dx = event.clientX - state.startX
    if (!state.moved && Math.abs(dx) < 6) return
    if (!state.moved) {
      state.moved = true
      el.setPointerCapture(event.pointerId)
      setDragging(true)
    }
    el.scrollLeft = state.startLeft - dx
  }

  const endDrag = (event: PointerEvent<HTMLDivElement>) => {
    const state = drag.current
    if (!state || state.id !== event.pointerId) return
    drag.current = null
    setDragging(false)
  }

  /** Mouse parallax on the print inside a tile. Decoration only. */
  const pan = (event: PointerEvent<HTMLElement>, reset = false) => {
    if (event.pointerType !== 'mouse') return
    const media =
      event.currentTarget.querySelector<HTMLElement>('[data-pan-target]')
    if (!media) return
    if (reset) {
      media.style.setProperty('--pan-x', '0px')
      media.style.setProperty('--pan-y', '0px')
      return
    }
    const rect = media.getBoundingClientRect()
    const x = ((event.clientX - rect.left) / rect.width - 0.5) * -10
    const y = ((event.clientY - rect.top) / rect.height - 0.5) * -8
    media.style.setProperty('--pan-x', `${x.toFixed(2)}px`)
    media.style.setProperty('--pan-y', `${y.toFixed(2)}px`)
  }

  const peel = useCallback(
    (id: string) =>
      setPeeled((current) => {
        const next = new Set(current)
        if (next.has(id)) next.delete(id)
        else next.add(id)
        return next
      }),
    [],
  )

  /** Place the peep over the piece it came from, clamped to the mat. */
  const openPeek = (item: GalleryItem, element: HTMLElement) => {
    const mat = boardRef.current
    if (!mat || reduced) return

    const surface = mat.getBoundingClientRect()
    const art = (
      element.querySelector<HTMLElement>('[data-frame]') ?? element
    ).getBoundingClientRect()
    const width = Math.min(surface.width * 0.44, 30 * 16)
    const height = width * 0.625 + 42
    const x = Math.min(
      Math.max(art.left - surface.left + art.width / 2 - width / 2, 12),
      surface.width - width - 12,
    )
    // The print hangs over the artwork it enlarges, a little past its lower
    // edge: it sits in front of the card's own thumbnail, not above it. The
    // toolbar is the ceiling, so a print that would climb over it drops below
    // its artwork instead and the controls stay readable.
    const toolbar = mat.querySelector<HTMLElement>('[data-toolbar]')
    const ceiling =
      (toolbar ? toolbar.getBoundingClientRect().bottom - surface.top : 0) + 12
    const overArt = art.bottom - surface.top - height + 18
    const y = Math.min(
      Math.max(
        overArt >= ceiling ? overArt : art.bottom - surface.top + 18,
        ceiling,
      ),
      surface.height - height - 12,
    )

    openPeekId.current = item.id
    setPeek({ item, x, y, width })
  }

  const closePeek = useCallback(() => {
    if (peekTimer.current) clearTimeout(peekTimer.current)
    peekTimer.current = null
    openPeekId.current = null
    peekPending.current = null
    setPeek(null)
  }, [])

  /**
   * Hover opens on a short delay, so crossing the board does not flicker.
   *
   * Called on every pointer move inside the artwork, so it must be idempotent:
   * re-arming the timer each move would mean the print never opens while the
   * pointer is still travelling.
   */
  const peekLater = useCallback(
    (item: GalleryItem, element: HTMLElement) => {
      if (openPeekId.current === item.id || peekPending.current === item.id) {
        return
      }
      if (peekTimer.current) clearTimeout(peekTimer.current)
      peekPending.current = item.id
      peekTimer.current = setTimeout(() => {
        peekPending.current = null
        openPeek(item, element)
      }, 110)
    },
    // openPeek reads only refs and `reduced`.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [reduced],
  )

  useEffect(
    () => () => {
      if (peekTimer.current) clearTimeout(peekTimer.current)
    },
    [],
  )

  const toggle = useCallback(
    (id: string) =>
      setStamped((current) => {
        const next = new Set(current)
        if (next.has(id)) next.delete(id)
        else next.add(id)
        return next
      }),
    [],
  )

  const inspected = stamped.size
  const complete = inspected >= TOTAL
  const position = Math.round(progress * Math.max(visible.length - 1, 0)) + 1
  const armedLabel = armed
    ? (visible.find((piece) => piece.id === armed)?.index ?? armed)
    : null

  return (
    <div className={styles.moodboard}>
      <Reveal y={20} delay={0.05} className={styles.deskReveal}>
        {/* The board is one surface: bezel, cork, toolbar, and paper all on it. */}
        <div className={styles.desk}>
          <div
            ref={boardRef}
            className={styles.mat}
            style={
              { '--mat-pad': 'clamp(0.85rem, 1.9vw, 1.5rem)' } as CSSProperties
            }
          >
            <span className={styles.grain} aria-hidden />

            {/* The label is not part of the controller: it is a scrap of
                notebook paper pinned straight to the cork, to the left of it. */}
            <div className={styles.boardTop}>
              <div className={styles.hud}>
                <span className={styles.hudPin} aria-hidden />
                <span className={styles.hudTape} aria-hidden />
                <span className={styles.hudHoles} aria-hidden>
                  <span />
                  <span />
                  <span />
                </span>
                <span className={styles.hudCount}>
                  {String(inspected).padStart(2, '0')}/{TOTAL}
                </span>
                <span className={styles.hudStack}>
                  <span className={styles.hudTitle}>
                    Moodboard / cutting mat
                  </span>
                  <span className={styles.hudNote}>
                    {complete
                      ? 'Master crafter. Every piece on the mat is stamped.'
                      : 'Releases & systems pinned to the cork — tap a card for the notes.'}
                  </span>
                </span>
              </div>

              <div className={styles.toolbar} data-toolbar>
                <div
                  className={styles.filters}
                  role="group"
                  aria-label="Filter the board"
                >
                  {FILTERS.map((option) => {
                    const count =
                      option.id === 'all'
                        ? PROJECT_GALLERY_ITEMS.length +
                          featuredSystemItems.length
                        : option.id === 'design-system'
                          ? systemItems.length
                          : PROJECT_GALLERY_ITEMS.length

                    return (
                      <button
                        key={option.id}
                        type="button"
                        className={styles.filter}
                        data-tab={option.id}
                        aria-pressed={filter === option.id}
                        onClick={() => {
                          setFilter(option.id)
                          setArmed(null)
                        }}
                      >
                        {option.label}
                        <span className={styles.filterCount}>{count}</span>
                      </button>
                    )
                  })}
                </div>

                <div className={styles.controls}>
                  <div className={styles.pager}>
                    <button
                      type="button"
                      className={styles.pagerBtn}
                      onClick={() => nudge(-1)}
                      disabled={edges.start}
                      aria-label="Previous piece"
                    >
                      <ArrowUpRight className={styles.pagerIcon} />
                    </button>
                    <button
                      type="button"
                      className={styles.pagerBtn}
                      onClick={() => nudge(1)}
                      disabled={edges.end}
                      aria-label="Next piece"
                    >
                      <ArrowUpRight className={styles.pagerIcon} />
                    </button>
                  </div>
                </div>

                {/* The spool drawer. Three inks, a pair of scissors, and the way
                  back to the way the wall was dealt. */}
                <div
                  className={styles.yarnBar}
                  role="group"
                  aria-label="Yarn strings"
                >
                  <span className={styles.yarnTitle}>
                    <Pin className={styles.yarnPin} aria-hidden />
                    Yarn:
                  </span>

                  <span className={styles.spools}>
                    {YARN_SPOOLS.map((option) => (
                      <button
                        key={option.id}
                        type="button"
                        className={styles.spool}
                        data-spool={option.id}
                        aria-pressed={strings && spool === option.id}
                        aria-label={`${option.label} yarn`}
                        title={`${option.label} yarn`}
                        onClick={() => {
                          setSpool(option.id)
                          setStrings(true)
                        }}
                      />
                    ))}
                  </span>

                  <span className={styles.yarnHint}>
                    {strings
                      ? `${drawn.length} strands · click two pins to tie`
                      : 'Strings cut'}
                  </span>

                  <button
                    type="button"
                    className={styles.yarnCut}
                    aria-pressed={!strings}
                    onClick={() => setStrings((on) => !on)}
                  >
                    <Scissors className={styles.yarnIcon} aria-hidden />
                    {strings ? 'Hide strings' : 'Show strings'}
                  </button>

                  {redrawnBoard ? (
                    <button
                      type="button"
                      className={styles.yarnReset}
                      onClick={resetBoard}
                    >
                      <RotateCcw className={styles.yarnIcon} aria-hidden />
                      Reset
                    </button>
                  ) : null}
                </div>

                <div className={styles.archiveLinks}>
                  {ARCHIVE_LINKS.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className={styles.archive}
                    >
                      <span className={styles.archiveNote}>{link.note}</span>
                      <span className={styles.archiveLabel}>
                        {link.label}
                        <span className={styles.archiveCount}>
                          {link.href === '/design-system'
                            ? caseCount
                            : link.count}
                        </span>
                        <ArrowUpRight className={styles.archiveArrow} />
                      </span>
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            <p className={styles.srOnly} role="status" aria-live="polite">
              {inspected} of {TOTAL} pieces stamped. Showing {visible.length} of{' '}
              {TOTAL} pieces.{' '}
              {armedLabel ? `Pin ${armedLabel} held, pick a second. ` : ''}
              {notice}
            </p>

            <motion.div
              key={`${filter}:${redrawn}`}
              ref={trackRef}
              variants={GRID_VARIANTS}
              initial={reduced ? false : 'hidden'}
              animate="show"
              className={`${styles.track} ${
                dragging ? styles.trackDragging : ''
              }`}
              role="region"
              aria-label={`Selected work. ${visible.length} pieces on the board.`}
              tabIndex={0}
              onKeyDown={onKeyDown}
              onPointerDown={onPointerDown}
              onPointerMove={onPointerMove}
              onPointerUp={endDrag}
              onPointerCancel={endDrag}
            >
              {visible.map((item) => (
                <motion.div
                  key={item.id}
                  className={styles.pieceCell}
                  variants={CELL_VARIANTS}
                  /* Drag is the wall's privilege: on the phone shelf a drag is
                     the scroll gesture, and reduced motion gets no free handout. */
                  drag={wall && !reduced}
                  dragMomentum={false}
                  dragElastic={0.06}
                  whileDrag={{ cursor: 'grabbing' }}
                  onDragStart={() => setArmed(null)}
                  onDrag={requeuePins}
                  onDragEnd={() => {
                    setMoved(true)
                    requeuePins()
                  }}
                  style={
                    {
                      '--cell-drop': `${dropFor(item.id)}rem`,
                    } as CSSProperties
                  }
                >
                  <PaperPiece
                    item={item}
                    stamped={stamped.has(item.id)}
                    armed={armed === item.id}
                    threaded={threaded.has(item.id)}
                    pinnable={wall}
                    pin={pinFor(item.id)}
                    pinRef={(element) => {
                      pinEls.current[item.id] = element
                    }}
                    onPin={tieYarn}
                    onStamp={toggle}
                    onOpen={setActive}
                    onPan={pan}
                    onPeek={peekLater}
                    onPeekEnd={closePeek}
                    drop={dropFor(item.id)}
                  />
                </motion.div>
              ))}
            </motion.div>

            {stringsOn ? (
              <YarnLayer links={drawn} pins={pins} selected={armed} />
            ) : null}

            <div className={styles.shelfBar} aria-hidden>
              <div
                className={styles.shelfBarFill}
                style={{ transform: `scaleX(${progress || 0.02})` }}
              />
            </div>

            <div className={styles.shelfFoot}>
              <p className={styles.shelfNote}>
                {visible.length} pieces
                <span className={styles.shelfHint}>
                  {' '}
                  · swipe or use the arrows
                </span>
              </p>
              <p className={styles.shelfCount}>
                {String(position).padStart(2, '0')}/{visible.length}
              </p>
            </div>

            <MatStickers peeled={peeled} onPeel={peel} bounds={boardRef} />

            <AnimatePresence></AnimatePresence>

            <AnimatePresence>
              {peek ? (
                <Peek key={peek.item.id} peek={peek} reduced={reduced} />
              ) : null}
            </AnimatePresence>
          </div>
        </div>
      </Reveal>

      {complete ? (
        <p className={styles.masterNote}>
          <Sparkle className={styles.masterMark} />
          Master crafter. The whole board is stamped — open a piece and read the
          notes.
        </p>
      ) : null}

      <dialog
        ref={dialogRef}
        className={styles.dialog}
        aria-labelledby="work-drawer-title"
        onClose={() => setActive(null)}
        onClick={(event) => {
          if (event.target === dialogRef.current) setActive(null)
        }}
      >
        {active ? (
          <div className={styles.dialogPanel}>
            <button
              type="button"
              className={styles.dialogClose}
              onClick={() => setActive(null)}
              aria-label="Close the notes"
            >
              ×
            </button>

            <div className={styles.dialogGrid}>
              <div className={styles.dialogPrint}>
                <span className={styles.dialogFrame}>
                  <CoverPlate
                    item={active}
                    sizes="(min-width: 900px) 42vw, 90vw"
                    eager
                  />
                </span>
                <span className={styles.dialogIndex} aria-hidden>
                  {active.index}
                </span>
              </div>

              <div className={styles.dialogNotes}>
                <p className={styles.dialogKicker}>
                  {active.categoryLabel} · {active.year}
                </p>
                <h3 id="work-drawer-title" className={styles.dialogTitle}>
                  {active.title}
                </h3>
                <p className={styles.dialogBody}>{active.description}</p>

                <p className={styles.dialogLabel}>
                  {active.kind === 'design-system' ? 'Palette' : 'Stack'}
                </p>
                {active.kind === 'design-system' ? (
                  <SwatchDeck swatches={active.swatches} />
                ) : (
                  <span className={styles.tags}>
                    {active.tags.map((tag) => (
                      <span key={tag}>{tag}</span>
                    ))}
                  </span>
                )}

                <Link
                  className={styles.dialogCta}
                  href={active.href}
                  {...(active.href.startsWith('http')
                    ? { target: '_blank', rel: 'noreferrer' }
                    : {})}
                >
                  {active.cta}
                  <ArrowUpRight className={styles.dialogCtaArrow} />
                </Link>
              </div>
            </div>
          </div>
        ) : null}
      </dialog>
    </div>
  )
}
