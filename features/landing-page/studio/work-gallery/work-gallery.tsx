'use client'

import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import Image from 'next/image'
import Link from 'next/link'
import { useRef, useState, type KeyboardEvent, type PointerEvent } from 'react'

import type { WorkProject } from '@/data/projects'
import { cn } from '@/lib/utils'

import { ArrowUpRight } from '../doodles'
import { Reveal } from '../reveal'
import {
  GALLERY_FILTERS,
  galleryCount,
  visibleGalleryItems,
  type GalleryFilter,
  type GalleryItem,
} from './work-gallery-data'
import styles from './work-gallery.module.css'

function GeneratedCover({ project }: { project: WorkProject }) {
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

function GalleryCard({ item }: { item: GalleryItem }) {
  const mediaRef = useRef<HTMLDivElement>(null)
  const project = item.kind === 'project' ? item.project : undefined
  const butterTape = item.kind === 'design-system' || item.featured

  const onPointerMove = (event: PointerEvent<HTMLAnchorElement>) => {
    if (event.pointerType !== 'mouse' || !mediaRef.current) return

    const rect = mediaRef.current.getBoundingClientRect()
    const x = ((event.clientX - rect.left) / rect.width - 0.5) * -12
    const y = ((event.clientY - rect.top) / rect.height - 0.5) * -9
    mediaRef.current.style.setProperty('--pan-x', `${x.toFixed(2)}px`)
    mediaRef.current.style.setProperty('--pan-y', `${y.toFixed(2)}px`)
  }

  const resetParallax = () => {
    mediaRef.current?.style.setProperty('--pan-x', '0px')
    mediaRef.current?.style.setProperty('--pan-y', '0px')
  }

  const sizes =
    item.kind === 'project' && item.featured
      ? '(min-width: 1024px) 66vw, (min-width: 768px) 100vw, 100vw'
      : '(min-width: 1024px) 34vw, (min-width: 768px) 50vw, 100vw'

  return (
    <article
      className={styles.card}
      data-kind={item.kind}
      data-project-card={project ? '' : undefined}
      aria-labelledby={`${item.id}-title`}
    >
      <span
        className={cn(
          styles.tape,
          butterTape ? styles.tapeButter : styles.tapePink,
        )}
        aria-hidden
      />
      {item.kind === 'design-system' ? (
        <span className={styles.systemBadge} aria-hidden>
          System
        </span>
      ) : null}

      <Link
        href={item.href}
        className={styles.cardLink}
        onPointerMove={onPointerMove}
        onPointerLeave={resetParallax}
        onPointerCancel={resetParallax}
      >
        <div className={styles.mediaShell}>
          <div
            ref={mediaRef}
            className={styles.media}
            data-project-media={project ? '' : undefined}
          >
            <div className={styles.mediaInner}>
              {item.kind === 'design-system' ? (
                <Image
                  src={item.cover}
                  alt={item.coverAlt}
                  fill
                  sizes={sizes}
                  className={styles.coverImage}
                  style={{ objectPosition: item.position }}
                />
              ) : item.project.cover ? (
                <Image
                  src={item.project.cover}
                  alt={`${item.project.title} interface`}
                  fill
                  sizes={sizes}
                  className={styles.coverImage}
                  style={{ objectPosition: item.position }}
                />
              ) : (
                <GeneratedCover project={item.project} />
              )}
            </div>
          </div>

          <div className={styles.drawer}>
            <p className={styles.drawerDescription}>{item.description}</p>
            <ul className={styles.tagList} aria-label="Stack">
              {item.tags.map((tag) => (
                <li key={tag}>{tag}</li>
              ))}
            </ul>
            <span className={styles.cta}>
              {item.cta}
              <ArrowUpRight className={styles.ctaArrow} />
            </span>
          </div>
        </div>

        <div className={styles.foot}>
          <div className={styles.metaRow}>
            <span className={styles.cardIndex}>{item.index}</span>
            <span className={styles.cardCategory}>{item.categoryLabel}</span>
            <span className={styles.cardYear}>{item.year}</span>
          </div>
          <div className={styles.titleRow}>
            <h3 id={`${item.id}-title`} className={styles.cardTitle}>
              {item.title}
            </h3>
            <span className={styles.cardArrow} aria-hidden>
              <ArrowUpRight className={styles.cardArrowIcon} />
            </span>
          </div>
        </div>
      </Link>
    </article>
  )
}

function GalleryFilters({
  active,
  counts,
  onChange,
}: {
  active: GalleryFilter
  counts: Record<GalleryFilter, number>
  onChange: (filter: GalleryFilter) => void
}) {
  const reduced = useReducedMotion() ?? false
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([])

  const select = (index: number) => {
    const next = GALLERY_FILTERS[index]
    if (!next) return
    onChange(next.id)
    tabRefs.current[index]?.focus()
  }

  const onKeyDown = (
    event: KeyboardEvent<HTMLButtonElement>,
    index: number,
  ) => {
    const last = GALLERY_FILTERS.length - 1
    if (event.key === 'ArrowRight') {
      event.preventDefault()
      select(index === last ? 0 : index + 1)
    } else if (event.key === 'ArrowLeft') {
      event.preventDefault()
      select(index === 0 ? last : index - 1)
    } else if (event.key === 'Home') {
      event.preventDefault()
      select(0)
    } else if (event.key === 'End') {
      event.preventDefault()
      select(last)
    }
  }

  return (
    <div
      className={styles.filters}
      role="tablist"
      aria-label="Filter selected work by category"
    >
      {GALLERY_FILTERS.map((filter, index) => {
        const selected = active === filter.id
        const count = counts[filter.id]

        return (
          <button
            key={filter.id}
            ref={(node) => {
              tabRefs.current[index] = node
            }}
            id={`work-filter-${filter.id}`}
            type="button"
            role="tab"
            aria-selected={selected}
            aria-controls="work-gallery-panel"
            aria-label={`${filter.label}, ${count} ${count === 1 ? 'item' : 'items'}`}
            tabIndex={selected ? 0 : -1}
            className={styles.filterButton}
            data-active={selected}
            onClick={() => onChange(filter.id)}
            onKeyDown={(event) => onKeyDown(event, index)}
          >
            {selected ? (
              <motion.span
                aria-hidden
                layoutId="work-filter-pill"
                className={styles.filterPill}
                transition={
                  reduced
                    ? { duration: 0 }
                    : {
                        type: 'spring',
                        stiffness: 520,
                        damping: 38,
                        mass: 0.7,
                      }
                }
              />
            ) : null}
            <span className={styles.filterLabel}>{filter.label}</span>
            <span className={styles.filterCount}>{count}</span>
          </button>
        )
      })}
    </div>
  )
}

export function WorkGallery() {
  const reduced = useReducedMotion() ?? false
  const [filter, setFilter] = useState<GalleryFilter>('all')
  const [hasInteracted, setHasInteracted] = useState(false)
  const items = visibleGalleryItems(filter)
  const counts: Record<GalleryFilter, number> = {
    all: galleryCount('all'),
    project: galleryCount('project'),
    'design-system': galleryCount('design-system'),
  }
  const activeLabel =
    GALLERY_FILTERS.find((entry) => entry.id === filter)?.label ?? 'All'

  const layoutTransition = reduced
    ? { duration: 0 }
    : {
        type: 'spring' as const,
        stiffness: 250,
        damping: 30,
        mass: 0.9,
      }
  const enterEase = [0.22, 1, 0.36, 1] as const

  /**
   * Changing the filter changes the cast, not just the positions. A card that
   * is new to the cast enters with the same rise-and-fade whether the reader
   * came from All or straight from Project, so no switch pops.
   */
  const changeFilter = (next: GalleryFilter) => {
    setHasInteracted(true)
    setFilter(next)
  }

  return (
    <div className={styles.gallery}>
      <Reveal y={20} delay={0.06}>
        <GalleryFilters
          active={filter}
          counts={counts}
          onChange={changeFilter}
        />
      </Reveal>

      <p className={styles.srOnly} role="status" aria-live="polite">
        {items.length} {items.length === 1 ? 'piece' : 'pieces'} in{' '}
        {activeLabel}
      </p>

      <div
        id="work-gallery-panel"
        role="tabpanel"
        aria-labelledby={`work-filter-${filter}`}
        className={styles.grid}
        data-filter={filter}
      >
        <AnimatePresence mode="popLayout" initial={false}>
          {items.map((item, index) => {
            const enterDelay = reduced ? 0 : Math.min(index * 0.025, 0.15)

            return (
              <motion.div
                key={item.id}
                layout
                custom={index}
                initial={
                  hasInteracted ? { opacity: 0, y: 14, scale: 0.985 } : false
                }
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit="exit"
                variants={{
                  exit: (order: number) => ({
                    opacity: 0,
                    scale: 0.9,
                    transition: {
                      duration: reduced ? 0 : 0.2,
                      delay: reduced ? 0 : order * 0.015,
                    },
                  }),
                }}
                transition={{
                  layout: layoutTransition,
                  opacity: {
                    duration: reduced ? 0 : 0.24,
                    delay: enterDelay,
                  },
                  y: {
                    duration: reduced ? 0 : 0.36,
                    ease: enterEase,
                    delay: enterDelay,
                  },
                  scale: {
                    duration: reduced ? 0 : 0.32,
                    delay: enterDelay,
                  },
                }}
                className={styles.cell}
              >
                <Reveal
                  delay={Math.min(index * 0.055, 0.34)}
                  y={26}
                  className={styles.cellReveal}
                >
                  <GalleryCard item={item} />
                </Reveal>
              </motion.div>
            )
          })}
        </AnimatePresence>
      </div>
    </div>
  )
}
