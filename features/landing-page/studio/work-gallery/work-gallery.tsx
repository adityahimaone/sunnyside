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
  type PointerEvent,
} from 'react'

import type { WorkProject } from '@/data/projects'
import { ArrowUpRight, Sparkle } from '../doodles'
import { PIT_STICKERS, type PitKind } from '../gravity/pit-config'
import { StickerArt } from '../gravity/sticker-art'
import { Reveal } from '../reveal'
import {
  ARCHIVE_LINKS,
  GALLERY_ITEMS,
  PIECE_TAPE,
  PIECE_TILT,
  type GalleryItem,
} from './work-gallery-data'
import styles from './work-gallery.module.css'

/**
 * The selected-work chapter is a cutting mat, not a shelf.
 *
 * Twelve pieces — six releases and the six most recent systems behind them —
 * are taped to the board at their own angle, each stamped by hand. The chapter
 * around it still does the reading; this file only owns the paper.
 */

const TOTAL = GALLERY_ITEMS.length

const FILTERS = [
  { id: 'all', label: 'Everything' },
  { id: 'project', label: 'Releases' },
  { id: 'design-system', label: 'Systems' },
] as const

type Filter = (typeof FILTERS)[number]['id']

/**
 * The same seven die-cut shapes the About release liner is peeled from, moved
 * onto the mat. Each one is small and pinned to the mat's edge band, so the
 * decoration never sits over a piece's copy. `x`/`y` are shares of the board.
 */
const MAT_STICKERS: Record<PitKind, { label: string; x: number; y: number }> = {
  smiley: { label: 'Smiley', x: 1.5, y: 2.2 },
  burst: { label: 'Wow', x: 94.4, y: 1.8 },
  daisy: { label: 'Daisy', x: 0.9, y: 35 },
  bolt: { label: 'Bolt', x: 95.4, y: 32 },
  atom: { label: 'Atom', x: 95, y: 68 },
  stampCity: { label: 'Jakarta · GMT+7', x: 1.1, y: 64 },
  stampRole: { label: 'Design engineer', x: 88.6, y: 95 },
}

const STICKER_COUNT = PIT_STICKERS.length

/** Hand-placed vertical offsets, one per piece, stable across filters. */
const CELL_DROP = [0, 1.6, 0.5, 2.1, 0.9, 2.6]

// Filtering re-deals the board, so the set remounts instead of morphing. Motion
// layout cannot project this filtered grid honestly (it snapped survivors
// hundreds of px out of the mat), and a remount can never fly a card anywhere:
// the new hand just settles in with a short stagger.
const GRID_VARIANTS = {
  hidden: {},
  show: { transition: { staggerChildren: 0.03 } },
}

// Never fades from nothing: the board stays legible while the new hand settles,
// it just rises a few pixels in reading order.
const CELL_VARIANTS = {
  hidden: { opacity: 0.45, y: 14 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.28, ease: [0.22, 1, 0.36, 1] as const },
  },
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

/** The cover art for one piece, shared by the card and its hover peep. */
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
  tilt: number
  tape: string
  stamped: boolean
  picked: boolean
  onStamp: (id: string) => void
  onPeek: (item: GalleryItem, element: HTMLElement) => void
  onPeekEnd: () => void
}

function PaperPiece({
  item,
  tilt,
  tape,
  stamped,
  picked,
  onStamp,
  onPeek,
  onPeekEnd,
}: PieceProps) {
  const reduced = useReducedMotion() ?? false
  // A tap focuses a link too; only a keyboard should get the print.
  const touched = useRef(false)

  const onPointerMove = (event: PointerEvent<HTMLAnchorElement>) => {
    if (reduced || event.pointerType !== 'mouse') return

    const media =
      event.currentTarget.querySelector<HTMLElement>('[data-pan-target]')
    if (!media) return

    const rect = media.getBoundingClientRect()
    const x = ((event.clientX - rect.left) / rect.width - 0.5) * -10
    const y = ((event.clientY - rect.top) / rect.height - 0.5) * -8
    media.style.setProperty('--pan-x', `${x.toFixed(2)}px`)
    media.style.setProperty('--pan-y', `${y.toFixed(2)}px`)
  }

  const resetParallax = (event: PointerEvent<HTMLAnchorElement>) => {
    const media =
      event.currentTarget.querySelector<HTMLElement>('[data-pan-target]')
    media?.style.setProperty('--pan-x', '0px')
    media?.style.setProperty('--pan-y', '0px')
  }

  return (
    <motion.article
      className={styles.piece}
      data-kind={item.kind}
      data-tape={tape}
      data-stamped={stamped}
      data-picked={picked}
      style={
        {
          '--tilt': reduced ? '0deg' : `${tilt}deg`,
        } as React.CSSProperties
      }
      whileHover={reduced ? undefined : { y: -6, rotate: 0, zIndex: 6 }}
      aria-labelledby={`${item.id}-piece-title`}
    >
      <span className={styles.tape} aria-hidden />

      <Link
        href={item.href}
        className={styles.pieceLink}
        onPointerMove={onPointerMove}
        onPointerLeave={(event) => {
          resetParallax(event)
          onPeekEnd()
        }}
        onPointerCancel={resetParallax}
        onPointerDown={(event) => {
          touched.current = event.pointerType !== 'mouse'
        }}
        onPointerEnter={(event) => {
          touched.current = false
          if (event.pointerType !== 'mouse') return
          onPeek(item, event.currentTarget)
        }}
        onFocus={(event) => {
          if (touched.current) return
          if (!event.currentTarget.matches(':focus-visible')) return
          onPeek(item, event.currentTarget)
        }}
        onBlur={onPeekEnd}
      >
        <span className={styles.pieceIndex} aria-hidden>
          {item.index}
        </span>

        <span className={styles.frame} data-frame>
          <span className={styles.panTarget} data-pan-target>
            <PieceMedia
              item={item}
              sizes="(min-width: 1024px) 24vw, (min-width: 768px) 32vw, 50vw"
            />
          </span>
          <span className={styles.kindTag}>
            {item.kind === 'design-system' ? 'System' : 'Release'}
          </span>
        </span>

        <span className={styles.body}>
          <span className={styles.meta}>
            {item.categoryLabel} · {item.year}
          </span>
          <span id={`${item.id}-piece-title`} className={styles.title}>
            {item.title}
          </span>
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
        </span>
      </Link>

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
    </motion.article>
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
              width: stamp ? '3rem' : '2.4rem',
              height: stamp ? '3rem' : '2.4rem',
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
            y: 420,
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
 * card the visitor is already looking at, only big enough to read. It is
 * decoration for the pointer: no focus trap, no controls, `aria-hidden`, and
 * it never takes pointer events so the card underneath stays clickable.
 */
function Peek({ peek, reduced }: { peek: PeekState; reduced: boolean }) {
  return (
    <motion.div
      className={styles.peek}
      style={{ left: peek.x, top: peek.y, width: peek.width }}
      initial={
        reduced
          ? { opacity: 0 }
          : { opacity: 0, scale: 0.9, y: 16, rotate: -2.6 }
      }
      animate={
        reduced ? { opacity: 1 } : { opacity: 1, scale: 1, y: 0, rotate: -1 }
      }
      exit={reduced ? { opacity: 0 } : { opacity: 0, scale: 0.96, y: 10 }}
      transition={{ type: 'spring', stiffness: 340, damping: 30 }}
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

export function WorkGallery() {
  const reduced = useReducedMotion() ?? false
  const boardRef = useRef<HTMLDivElement | null>(null)
  const [filter, setFilter] = useState<Filter>('all')
  const [stamped, setStamped] = useState<ReadonlySet<string>>(new Set())
  const [peeled, setPeeled] = useState<ReadonlySet<string>>(new Set())
  const [tilts, setTilts] = useState<Record<string, number>>(() =>
    Object.fromEntries(
      GALLERY_ITEMS.map((item, index) => [item.id, PIECE_TILT[index] ?? 0]),
    ),
  )
  const [picked, setPicked] = useState<string | null>(null)
  const [party, setParty] = useState(0)
  const [peek, setPeek] = useState<PeekState | null>(null)
  const peekTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const visible = useMemo(
    () =>
      filter === 'all'
        ? GALLERY_ITEMS
        : GALLERY_ITEMS.filter((item) => item.kind === filter),
    [filter],
  )

  const inspected = stamped.size + peeled.size
  const complete = inspected >= TOTAL + STICKER_COUNT

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

  /** Place the peep above the piece it came from, clamped to the mat. */
  const openPeek = (item: GalleryItem, element: HTMLElement) => {
    const mat = boardRef.current
    if (!mat) return

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
    // It sits over the artwork it enlarges, hanging a little past its lower
    // edge: the print is in front of the card's own thumbnail, not above it.
    // The toolbar is the ceiling: a print that would climb over it drops below
    // its own artwork instead, so the controls stay readable.
    const toolbar = element
      .closest('[class*="__mat"]')
      ?.querySelector<HTMLElement>('[data-toolbar]')
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
  const peekLater = useCallback((item: GalleryItem, element: HTMLElement) => {
    if (peekTimer.current) clearTimeout(peekTimer.current)
    peekTimer.current = setTimeout(() => openPeek(item, element), 110)
  }, [])

  useEffect(
    () => () => {
      if (peekTimer.current) clearTimeout(peekTimer.current)
    },
    [],
  )

  /** Lucky dip: one random piece gets the spotlight. No motion, so always on. */
  const luckyDip = () => {
    const pool = visible.length ? visible : GALLERY_ITEMS
    const choice = pool[Math.floor(Math.random() * pool.length)]
    setPicked(choice.id)
  }

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

  const pickedTitle = picked
    ? (GALLERY_ITEMS.find((item) => item.id === picked)?.title ?? null)
    : null

  return (
    <div className={styles.moodboard}>
      <Reveal y={20} delay={0.05} className={styles.deskReveal}>
        {/* The board is one surface: bezel, cork, toolbar, and paper all on it. */}
        <div className={styles.desk}>
          <div className={styles.mat} ref={boardRef}>
            <span className={styles.grain} aria-hidden />

            <div className={styles.toolbar} data-toolbar>
              <div className={styles.hud}>
                <span className={styles.hudCount} aria-hidden>
                  {String(inspected).padStart(2, '0')}/{TOTAL + STICKER_COUNT}
                </span>
                <span className={styles.hudStack}>
                  <span className={styles.hudTitle}>
                    Moodboard / cutting mat
                  </span>
                  <span className={styles.hudNote}>
                    {pickedTitle
                      ? `Lucky dip: ${pickedTitle}. Stamp it or open it.`
                      : complete
                        ? 'Master crafter — every piece inspected.'
                        : 'Stamp what you like, peel a sticker, drag the vinyl around.'}
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
                  className={styles.plainer}
                  onClick={throwParty}
                  disabled={reduced}
                  title={
                    reduced
                      ? 'Paper party is off while reduced motion is on'
                      : 'Confetti, and a new angle for every piece'
                  }
                >
                  Paper party
                </button>
              </div>

              <div
                className={styles.filters}
                role="group"
                aria-label="Filter the board"
              >
                {FILTERS.map((option) => {
                  const count =
                    option.id === 'all'
                      ? TOTAL
                      : GALLERY_ITEMS.filter((item) => item.kind === option.id)
                          .length

                  return (
                    <button
                      key={option.id}
                      type="button"
                      className={styles.filter}
                      aria-pressed={filter === option.id}
                      onClick={() => {
                        setFilter(option.id)
                        setPeek(null)
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
                      <span className={styles.archiveCount}>{link.count}</span>
                      <ArrowUpRight className={styles.archiveArrow} />
                    </span>
                  </Link>
                ))}
              </div>
            </div>

            <p className={styles.srOnly} role="status" aria-live="polite">
              {inspected} of {TOTAL + STICKER_COUNT} pieces inspected. Showing{' '}
              {visible.length} of {TOTAL} pieces.
            </p>

            <motion.div
              key={filter}
              className={styles.pieceGrid}
              variants={GRID_VARIANTS}
              initial={reduced ? false : 'hidden'}
              animate="show"
            >
              {visible.map((item) => (
                <motion.div
                  key={item.id}
                  className={styles.pieceCell}
                  variants={CELL_VARIANTS}
                  style={
                    {
                      // Fixed to the piece, never to its DOM position: a filter
                      // change must not re-deal the hand-placed heights.
                      '--cell-drop': `${
                        CELL_DROP[
                          GALLERY_ITEMS.indexOf(item) % CELL_DROP.length
                        ]
                      }rem`,
                    } as React.CSSProperties
                  }
                >
                  <PaperPiece
                    item={item}
                    tilt={tilts[item.id] ?? 0}
                    tape={
                      PIECE_TAPE[
                        GALLERY_ITEMS.indexOf(item) % PIECE_TAPE.length
                      ]
                    }
                    stamped={stamped.has(item.id)}
                    picked={picked === item.id}
                    onStamp={toggle}
                    onPeek={peekLater}
                    onPeekEnd={closePeek}
                  />
                </motion.div>
              ))}
            </motion.div>

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
          Master crafter. The whole board is inspected — open a piece and read
          the notes.
        </p>
      ) : null}
    </div>
  )
}
