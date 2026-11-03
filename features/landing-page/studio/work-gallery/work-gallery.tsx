'use client'

import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import Image from 'next/image'
import Link from 'next/link'
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type KeyboardEvent,
  type PointerEvent,
} from 'react'

import type { WorkProject } from '@/data/projects'
import { DESIGN_CASES, type DesignCase } from '@/features/case-library'
import { ArrowUpRight, Sparkle } from '../doodles'
import { PIT_STICKERS, type PitKind } from '../gravity/pit-config'
import { StickerArt } from '../gravity/sticker-art'
import { Reveal } from '../reveal'
import {
  ARCHIVE_LINKS,
  FEATURED_SYSTEM_SLUGS,
  GALLERY_ITEMS,
  PROJECT_GALLERY_ITEMS,
  SYSTEM_GALLERY_ITEMS,
  buildSystemGalleryItems,
  PIECE_TAPE,
  PIECE_TILT,
  type GalleryItem,
} from './work-gallery-data'
import styles from './work-gallery.module.css'

/**
 * The selected-work chapter is a cutting mat with paper taped to it.
 *
 * The board is curated. Everything shows the six releases and six featured
 * systems; Systems reveals twelve (the featured six plus Wildflower, Cove and
 * the four newest remaining cases). Pieces hang in a hand-placed wall: four
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

/** The cover art for one piece, shared by the tile and its drawer. */
function PieceMedia({ item, sizes }: { item: GalleryItem; sizes: string }) {
  const project = item.kind === 'project' ? item.project : undefined

  if (item.kind === 'design-system') {
    return (
      <Image
        src={item.cover}
        alt={item.coverAlt}
        fill
        sizes={sizes}
        className={styles.cover}
        style={{ objectPosition: item.position }}
      />
    )
  }

  if (project?.cover) {
    return (
      <Image
        src={project.cover}
        alt={`${project.title} interface`}
        fill
        sizes={sizes}
        className={styles.cover}
        style={{ objectPosition: item.position }}
      />
    )
  }

  return project ? <GeneratedCover project={project} /> : null
}

type PieceProps = {
  item: GalleryItem
  stamped: boolean
  picked: boolean
  onStamp: (id: string) => void
  onOpen: (item: GalleryItem) => void
  onPan: (event: PointerEvent<HTMLElement>, reset?: boolean) => void
  onPeek: (item: GalleryItem, element: HTMLElement) => void
  onPeekEnd: () => void
  /** Angle the party re-deals; `undefined` keeps the hand-placed one. */
  tilt?: number
  drop: number
}

function PaperPiece({
  item,
  stamped,
  picked,
  onStamp,
  onOpen,
  onPan,
  onPeek,
  onPeekEnd,
  tilt,
  drop,
}: PieceProps) {
  const reduced = useReducedMotion() ?? false
  const meta = PIECE_META(item)
  const tape = meta.tape
  const angle = tilt ?? meta.tilt

  return (
    <article
      className={styles.piece}
      data-kind={item.kind}
      data-tape={tape}
      data-stamped={stamped}
      data-picked={picked}
      data-piece
      style={
        {
          '--tilt': `${angle}deg`,
          '--cell-drop': `${drop}rem`,
        } as CSSProperties
      }
      onPointerMove={(event) => onPan(event)}
      onPointerEnter={(event) => onPeek(item, event.currentTarget)}
      onPointerLeave={(event) => {
        onPan(event, true)
        onPeekEnd()
      }}
      aria-labelledby={`${item.id}-piece-title`}
    >
      <span className={styles.tape} aria-hidden />

      <span className={styles.pieceIndex} aria-hidden>
        {item.index}
      </span>

      <span className={styles.frame} data-frame>
        <span className={styles.panTarget} data-pan-target>
          <PieceMedia
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

/** Small deterministic PRNG so a confetti round renders the same twice. */
function seeded(seed: number) {
  let state = seed * 0x9e3779b9 + 0x6d2b79f5

  return () => {
    state = (state + 0x6d2b79f5) | 0
    let t = Math.imul(state ^ (state >>> 15), 1 | state)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

/** Paper confetti. Pure decoration, and absent under reduced motion. */
function PaperParty({ round }: { round: number }) {
  const scraps = useMemo(() => {
    const random = seeded(round)

    return Array.from({ length: 18 }, (_, index) => ({
      id: `${round}-${index}`,
      left: 4 + random() * 92,
      drift: -60 + random() * 120,
      delay: random() * 0.18,
      tilt: -220 + random() * 440,
      tone: ['amber', 'pink', 'sky', 'mint', 'butter', 'rose'][index % 6],
      size: 6 + random() * 8,
    }))
  }, [round])

  return (
    <div className={styles.confetti} aria-hidden>
      {scraps.map((scrap) => (
        <motion.span
          key={scrap.id}
          className={styles.scrap}
          data-tone={scrap.tone}
          style={{
            left: `${scrap.left}%`,
            width: scrap.size,
            height: scrap.size * 0.62,
          }}
          initial={{ y: -30, opacity: 0, rotate: 0 }}
          animate={{
            y: 620,
            x: scrap.drift,
            opacity: [0, 1, 1, 0],
            rotate: scrap.tilt,
          }}
          transition={{ duration: 1.5, delay: scrap.delay, ease: 'easeIn' }}
        />
      ))}
    </div>
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
        <PieceMedia item={peek.item} sizes="(min-width: 1024px) 34rem, 70vw" />
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
  const [picked, setPicked] = useState<string | null>(null)
  const [active, setActive] = useState<GalleryItem | null>(null)
  const [progress, setProgress] = useState(0)
  const [edges, setEdges] = useState({ start: true, end: false })
  const [peeled, setPeeled] = useState<ReadonlySet<string>>(new Set())
  const [party, setParty] = useState(0)
  const [tilts, setTilts] = useState<Record<string, number>>({})
  const [peek, setPeek] = useState<PeekState | null>(null)
  const boardRef = useRef<HTMLDivElement>(null)
  const peekTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const systemItems = useMemo(
    () =>
      designCases ? buildSystemGalleryItems(designCases) : SYSTEM_GALLERY_ITEMS,
    [designCases],
  )

  const featuredSystemItems = useMemo(
    () => systemItems.filter((item) => FEATURED_SYSTEMS.has(item.id)),
    [systemItems],
  )

  /** The full catalogue, not just the twelve the board shows. */
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

  /** Put one card flush to the track's start edge, snapping on release. */
  const scrollToCard = (index: number) => {
    const el = trackRef.current
    const card = el?.querySelectorAll<HTMLElement>('[data-piece]')[index]
    if (!el || !card) return
    const left =
      card.getBoundingClientRect().left -
      el.getBoundingClientRect().left +
      el.scrollLeft
    el.scrollTo({ left, behavior: reduced ? 'auto' : 'smooth' })
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

    setPeek({ item, x, y, width })
  }

  const closePeek = useCallback(() => {
    if (peekTimer.current) clearTimeout(peekTimer.current)
    peekTimer.current = null
    setPeek(null)
  }, [])

  /** Hover opens on a short delay, so crossing the board does not flicker. */
  const peekLater = useCallback(
    (item: GalleryItem, element: HTMLElement) => {
      if (peekTimer.current) clearTimeout(peekTimer.current)
      peekTimer.current = setTimeout(() => openPeek(item, element), 110)
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

  /** Paper party: confetti plus a fresh set of angles. */
  const throwParty = () => {
    if (reduced) return
    setPeek(null)
    setParty((round) => round + 1)
    setTilts(
      Object.fromEntries(
        GALLERY_ITEMS.map((item) => [item.id, -3.2 + Math.random() * 6.4]),
      ),
    )
  }

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

  /** Lucky dip: step the shelf to one piece and ring it. No motion, always on. */
  const luckyDip = () => {
    if (!visible.length) return
    const index = Math.floor(Math.random() * visible.length)
    setPicked(visible[index].id)
    scrollToCard(index)
  }

  const inspected = stamped.size
  const complete = inspected >= TOTAL
  const position = Math.round(progress * Math.max(visible.length - 1, 0)) + 1

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

            <div className={styles.toolbar} data-toolbar>
              <div className={styles.hud}>
                <span className={styles.hudCount} aria-hidden>
                  {String(inspected).padStart(2, '0')}/{TOTAL}
                </span>
                <span className={styles.hudStack}>
                  <span className={styles.hudTitle}>
                    Moodboard / cutting mat
                  </span>
                  <span className={styles.hudNote}>
                    {complete ? (
                      'Master crafter. Every piece on the mat is stamped.'
                    ) : (
                      <>
                        <span className={styles.hintWide}>
                          Releases and systems taped to the mat. Tap one for its
                          notes.
                        </span>
                        <span className={styles.hintNarrow}>
                          Swipe the shelf, or use the arrows. Tap a piece for
                          its notes.
                        </span>
                      </>
                    )}
                  </span>
                </span>
              </div>

              <div className={styles.controls}>
                <button
                  type="button"
                  className={styles.chunky}
                  onClick={luckyDip}
                >
                  Lucky dip
                </button>
                <button
                  type="button"
                  className={styles.chunky}
                  onClick={throwParty}
                  disabled={reduced}
                  title={
                    reduced
                      ? 'Paper party is off while reduced motion is on'
                      : undefined
                  }
                >
                  Paper party
                </button>
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
                      aria-pressed={filter === option.id}
                      onClick={() => {
                        setFilter(option.id)
                        setPicked(null)
                      }}
                    >
                      {option.label}
                      <span className={styles.filterCount}>{count}</span>
                    </button>
                  )
                })}
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

            <p className={styles.srOnly} role="status" aria-live="polite">
              {inspected} of {TOTAL} pieces stamped. Showing {visible.length} of{' '}
              {TOTAL} pieces.
            </p>

            <motion.div
              key={filter}
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
                  style={
                    {
                      '--cell-drop': `${dropFor(item.id)}rem`,
                    } as CSSProperties
                  }
                >
                  <PaperPiece
                    item={item}
                    stamped={stamped.has(item.id)}
                    picked={picked === item.id}
                    onStamp={toggle}
                    onOpen={setActive}
                    onPan={pan}
                    onPeek={peekLater}
                    onPeekEnd={closePeek}
                    drop={dropFor(item.id)}
                    tilt={tilts[item.id]}
                  />
                </motion.div>
              ))}
            </motion.div>

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
                  · drag, swipe or use the arrows
                </span>
              </p>
              <p className={styles.shelfCount}>
                {String(position).padStart(2, '0')}/{visible.length}
              </p>
            </div>

            <MatStickers peeled={peeled} onPeel={peel} bounds={boardRef} />

            <AnimatePresence>
              {party > 0 && !reduced ? (
                <PaperParty key={party} round={party} />
              ) : null}
            </AnimatePresence>

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
                  <PieceMedia
                    item={active}
                    sizes="(min-width: 900px) 42vw, 90vw"
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
