'use client'

import { useReducedMotion } from 'motion/react'
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
import type { DesignCase } from '@/features/case-library'
import { ArrowUpRight, Sparkle } from '../doodles'
import { Reveal } from '../reveal'
import {
  ARCHIVE_LINKS,
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
 * Twelve pieces — six releases and the six most recent systems — hang in a
 * hand-placed wall: four columns, each card dropped a little lower than the
 * last so the board reads pinned rather than gridded. Below the desktop split
 * the same DOM becomes one horizontal snap run instead, because four columns of
 * paper on a phone is a postage stamp; there the arrows step one tile at a time.
 * Filters redraw the wall, and a tap lifts the notes into a drawer.
 */

const TOTAL = GALLERY_ITEMS.length

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

/** Hand-placed tape per piece, assigned by position so it never re-deals. */
const PIECE_META = (item: GalleryItem) => {
  const at = GALLERY_ITEMS.indexOf(item)

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
  drop: number
}

function PaperPiece({
  item,
  stamped,
  picked,
  onStamp,
  onOpen,
  onPan,
  drop,
}: PieceProps) {
  const { tilt, tape } = PIECE_META(item)

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
          '--tilt': `${tilt}deg`,
          '--cell-drop': `${drop}rem`,
        } as CSSProperties
      }
      onPointerMove={(event) => onPan(event)}
      onPointerLeave={(event) => onPan(event, true)}
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

        <div className={styles.foot}>
          <span className={styles.cta}>
            {item.cta}
            <ArrowUpRight className={styles.ctaArrow} />
          </span>
          <button
            type="button"
            className={styles.stampButton}
            aria-pressed={stamped}
            aria-label={`${stamped ? 'Remove the stamp from' : 'Stamp'} ${item.title}`}
            onClick={() => onStamp(item.id)}
          >
            {stamped ? 'Stamped' : 'Stamp it'}
          </button>
        </div>
      </div>

      <button
        type="button"
        className={styles.openButton}
        onClick={() => onOpen(item)}
        aria-label={`Open the notes for ${item.title}, ${item.categoryLabel}, ${item.year}`}
      />

      {stamped ? (
        <span className={styles.stamp} aria-hidden>
          <span>Approved</span>
          <span className={styles.stampSmall}>craft</span>
        </span>
      ) : null}
    </article>
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

  const systemItems = useMemo(
    () =>
      designCases ? buildSystemGalleryItems(designCases) : SYSTEM_GALLERY_ITEMS,
    [designCases],
  )

  const allItems = useMemo(
    () => [...PROJECT_GALLERY_ITEMS, ...systemItems],
    [systemItems],
  )

  const visible =
    filter === 'all'
      ? allItems
      : allItems.filter((item) => item.kind === filter)

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
            className={styles.mat}
            style={
              { '--mat-pad': 'clamp(0.85rem, 1.9vw, 1.5rem)' } as CSSProperties
            }
          >
            <span className={styles.grain} aria-hidden />

            <div className={styles.toolbar}>
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
                          Twelve pieces taped to the mat. Tap one for its notes.
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
                      <span className={styles.archiveCount}>{link.count}</span>
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

            <div
              ref={trackRef}
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
                <PaperPiece
                  key={item.id}
                  item={item}
                  stamped={stamped.has(item.id)}
                  picked={picked === item.id}
                  onStamp={toggle}
                  onOpen={setActive}
                  onPan={pan}
                  drop={dropFor(item.id)}
                />
              ))}
            </div>

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
