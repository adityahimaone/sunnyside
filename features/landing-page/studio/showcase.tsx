'use client'

import { useReducedMotion } from 'motion/react'
import { ArrowLeft, ArrowRight, X } from 'lucide-react'
import { useCallback, useEffect, useRef, useState } from 'react'

import { cn } from '@/lib/utils'

import { Reveal } from './reveal'
import { SectionHead } from './section-head'
import { STUDY_SWATCHES, StudyPrint, type StudyAccent } from './showcase-prints'
import { SHOWCASE_STUDIES, type ShowcaseStudy } from './studio-data'
import styles from './studio.module.css'

export function Showcase() {
  const reduced = useReducedMotion() ?? false
  const trackRef = useRef<HTMLDivElement>(null)
  const dialogRef = useRef<HTMLDialogElement>(null)
  const drag = useRef<{
    startX: number
    startLeft: number
    lastX: number
    lastTime: number
    moved: boolean
    id: number
  } | null>(null)
  const skewTimer = useRef<number | null>(null)
  const moved = useRef(false)
  const [dragging, setDragging] = useState(false)
  const [active, setActive] = useState<ShowcaseStudy | null>(null)
  const [swatch, setSwatch] = useState<StudyAccent | null>(null)
  const [springHoverCount, setSpringHoverCount] = useState(0)
  const [progress, setProgress] = useState(0)
  const [edges, setEdges] = useState({ start: true, end: false })

  const selectStudy = useCallback((study: ShowcaseStudy | null) => {
    setActive(study)
    setSwatch(null)
  }, [])

  const stepModal = useCallback(
    (direction: -1 | 1) => {
      if (!active) return
      const index = SHOWCASE_STUDIES.findIndex((item) => item.id === active.id)
      if (index === -1) return
      const nextIndex =
        (index + direction + SHOWCASE_STUDIES.length) % SHOWCASE_STUDIES.length
      selectStudy(SHOWCASE_STUDIES[nextIndex])
    },
    [active, selectStudy],
  )

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
  }, [measure])

  useEffect(() => {
    return () => {
      if (skewTimer.current !== null) {
        window.clearTimeout(skewTimer.current)
      }
    }
  }, [])

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

  useEffect(() => {
    if (!active) return
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'ArrowLeft') {
        event.preventDefault()
        stepModal(-1)
      } else if (event.key === 'ArrowRight') {
        event.preventDefault()
        stepModal(1)
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [active, stepModal])

  const step = () => {
    const el = trackRef.current
    const card = el?.querySelector<HTMLElement>('[data-study]')
    return (card?.offsetWidth ?? 320) + 22
  }

  const nudge = (direction: -1 | 1) => {
    trackRef.current?.scrollBy({
      left: direction * step(),
      behavior: reduced ? 'auto' : 'smooth',
    })
  }

  const resetSkew = useCallback(() => {
    if (skewTimer.current !== null) {
      window.clearTimeout(skewTimer.current)
      skewTimer.current = null
    }
    trackRef.current?.style.setProperty('--drag-skew', '0deg')
  }, [])

  const onPointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    if (event.pointerType !== 'mouse' || event.button !== 0) return
    const el = trackRef.current
    if (!el) return
    drag.current = {
      startX: event.clientX,
      startLeft: el.scrollLeft,
      lastX: event.clientX,
      lastTime: performance.now(),
      moved: false,
      id: event.pointerId,
    }
    // Capture only once the gesture becomes a drag. Capturing on pointerdown
    // takes the click away from the study button underneath it, which is how
    // the whole gallery ended up looking unclickable.
  }

  const onPointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
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

    if (!reduced) {
      const now = performance.now()
      const dt = Math.max(8, now - state.lastTime)
      const vx = (event.clientX - state.lastX) / dt
      const skew = Math.max(-4.5, Math.min(4.5, -vx * 14))
      el.style.setProperty('--drag-skew', `${skew.toFixed(2)}deg`)
      state.lastX = event.clientX
      state.lastTime = now

      if (skewTimer.current !== null) {
        window.clearTimeout(skewTimer.current)
      }
      skewTimer.current = window.setTimeout(() => {
        el.style.setProperty('--drag-skew', '0deg')
      }, 90)
    }
  }

  const endDrag = (event: React.PointerEvent<HTMLDivElement>) => {
    const state = drag.current
    if (!state || state.id !== event.pointerId) return
    drag.current = null
    setDragging(false)
    resetSkew()
    if (state.moved) {
      moved.current = true
      window.setTimeout(() => {
        moved.current = false
      }, 0)
    }
  }

  const onCardPointerMove = (event: React.PointerEvent<HTMLElement>) => {
    if (reduced || event.pointerType !== 'mouse' || drag.current?.moved) return
    const card = event.currentTarget
    const rect = card.getBoundingClientRect()
    if (!rect.width || !rect.height) return
    const nx = (event.clientX - rect.left) / rect.width - 0.5
    const ny = (event.clientY - rect.top) / rect.height - 0.5
    const rx = (-ny * 7).toFixed(2)
    const ry = (nx * 7).toFixed(2)
    const sx = ((nx + 0.5) * 100).toFixed(1)
    const sy = ((ny + 0.5) * 100).toFixed(1)
    const pointerAngle = (nx * 24).toFixed(2)

    card.dataset.tilting = 'true'
    card.style.setProperty('--tilt-rx', `${rx}deg`)
    card.style.setProperty('--tilt-ry', `${ry}deg`)
    card.style.setProperty('--sheen-x', `${sx}%`)
    card.style.setProperty('--sheen-y', `${sy}%`)
    card.style.setProperty('--pointer-angle', `${pointerAngle}deg`)
  }

  const onCardPointerLeave = (event: React.PointerEvent<HTMLElement>) => {
    const card = event.currentTarget
    delete card.dataset.tilting
    card.style.setProperty('--tilt-rx', '0deg')
    card.style.setProperty('--tilt-ry', '0deg')
    card.style.setProperty('--pointer-angle', '0deg')
  }

  const activeIndex = active
    ? SHOWCASE_STUDIES.findIndex((item) => item.id === active.id)
    : -1

  return (
    <section
      id="showcase"
      className={`${styles.showcase} scroll-mt-24`}
      aria-labelledby="showcase-title"
    >
      <div className={styles.shell}>
        <SectionHead
          number="02"
          label="Show & tell"
          script="look at this"
          title={
            <span id="showcase-title">
              Small studies,
              <br />
              made after hours.
            </span>
          }
          intro="Posters, sticker sheets and motion sketches. Some became products. Most are just proof that an hour in the browser is never wasted."
        />

        <Reveal delay={0.08}>
          <div className={styles.showcaseTop}>
            <p className="font-[family-name:var(--font-geist-mono)] text-[9px] tracking-[0.16em] text-[var(--muted)] uppercase">
              {SHOWCASE_STUDIES.length} studies · 2025–26 · drag or scroll
            </p>
            <div className={styles.showcaseControls}>
              <button
                type="button"
                className={styles.showcaseBtn}
                onClick={() => nudge(-1)}
                disabled={edges.start}
                aria-label="Previous study"
              >
                <ArrowLeft size={16} />
              </button>
              <button
                type="button"
                className={styles.showcaseBtn}
                onClick={() => nudge(1)}
                disabled={edges.end}
                aria-label="Next study"
              >
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
        </Reveal>
      </div>

      <div
        ref={trackRef}
        className={cn(
          styles.showcaseTrack,
          dragging && styles.showcaseTrackDragging,
        )}
        role="region"
        aria-label="Design studies. Scroll horizontally to see all four."
        tabIndex={0}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
      >
        {SHOWCASE_STUDIES.map((study) => (
          <article
            key={study.id}
            className={styles.studyCard}
            data-study
            onPointerEnter={
              study.id === 'spring-study'
                ? (event) => {
                    if (!reduced && event.pointerType === 'mouse') {
                      setSpringHoverCount((c) => c + 1)
                    }
                  }
                : undefined
            }
            onPointerMove={onCardPointerMove}
            onPointerLeave={onCardPointerLeave}
            onPointerCancel={onCardPointerLeave}
          >
            <div className={styles.studyPrint} aria-hidden>
              <StudyPrint
                id={study.id}
                reduced={reduced}
                hoverPulse={study.id === 'spring-study' ? springHoverCount : 0}
              />
            </div>
            <div className={styles.studyMeta}>
              <div>
                <h3 className={styles.studyTitle}>{study.title}</h3>
                <span className={styles.studyTags}>
                  {study.tags.join(' · ')}
                </span>
              </div>
              <span className={styles.studyYear}>{study.year}</span>
            </div>
            <button
              type="button"
              className={styles.studyButton}
              onClick={() => {
                if (moved.current) return
                selectStudy(study)
              }}
              aria-label={`Open ${study.title}, ${study.year}. ${study.tags.join(', ')}.`}
            />
          </article>
        ))}
      </div>

      <div className={styles.shell}>
        <div className={styles.studyProgress} aria-hidden>
          <div
            className={styles.studyProgressBar}
            style={{ transform: `scaleX(${progress || 0.02})` }}
          />
        </div>

        <div className="mt-6 flex items-center justify-between gap-6">
          <p className="font-[family-name:var(--font-geist-mono)] text-[9px] tracking-[0.16em] text-[var(--muted)] uppercase">
            Tap a print for the notes
          </p>
          <p className="hidden font-[family-name:var(--font-geist-mono)] text-[9px] tracking-[0.16em] text-[var(--muted)] uppercase sm:block">
            {String(Math.round(progress * 100)).padStart(2, '0')}%
          </p>
        </div>
      </div>

      <dialog
        ref={dialogRef}
        className={styles.dialog}
        aria-labelledby="study-title"
        onClose={() => selectStudy(null)}
        onClick={(event) => {
          if (event.target === dialogRef.current) selectStudy(null)
        }}
      >
        {active ? (
          <div className={styles.dialogPanel}>
            <button
              type="button"
              className={styles.dialogClose}
              onClick={() => selectStudy(null)}
              aria-label="Close study"
            >
              <X size={18} />
            </button>
            <div className={styles.dialogGrid}>
              <div className={styles.dialogPrint}>
                <StudyPrint
                  key={active.id}
                  id={active.id}
                  interactive
                  reduced={reduced}
                  accent={swatch}
                />
              </div>
              <div className={styles.dialogNotes}>
                <p className={styles.dialogKicker}>
                  {active.year} · {active.tags.join(' / ')}
                </p>
                <h3 id="study-title" className={styles.dialogTitle}>
                  {active.title}
                </h3>
                <p className={styles.dialogBody}>{active.blurb}</p>
                <p className={styles.dialogNote}>
                  <b>Made with</b>
                  {active.madeWith}
                </p>
                <p className={styles.dialogNote}>
                  <b>The bit I like</b>
                  {active.favourite}
                </p>
                <div
                  className={styles.dialogSwatches}
                  role="group"
                  aria-label="Try palette on print"
                >
                  {STUDY_SWATCHES.map((item) => {
                    const isSelected = swatch === item.id
                    return (
                      <button
                        key={item.id}
                        type="button"
                        className={styles.dialogSwatchBtn}
                        style={{ background: item.color }}
                        data-active={isSelected ? 'true' : 'false'}
                        aria-pressed={isSelected}
                        aria-label={`Preview ${item.label} palette`}
                        onClick={() =>
                          setSwatch((curr) =>
                            curr === item.id ? null : item.id,
                          )
                        }
                      />
                    )
                  })}
                </div>
                <div className={styles.dialogNav}>
                  <span className={styles.dialogNavCount}>
                    {String(activeIndex + 1).padStart(2, '0')} /{' '}
                    {String(SHOWCASE_STUDIES.length).padStart(2, '0')}
                  </span>
                  <div className={styles.dialogNavBtns}>
                    <button
                      type="button"
                      className={styles.dialogNavBtn}
                      onClick={() => stepModal(-1)}
                      aria-label="Previous study"
                    >
                      <ArrowLeft size={15} />
                    </button>
                    <button
                      type="button"
                      className={styles.dialogNavBtn}
                      onClick={() => stepModal(1)}
                      aria-label="Next study"
                    >
                      <ArrowRight size={15} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : null}
      </dialog>
    </section>
  )
}
