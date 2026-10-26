'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import Link from 'next/link'
import { AnimatePresence, motion, useScroll, useSpring } from 'motion/react'
import { ArrowLeft, List, X } from 'lucide-react'
import type { BlogMeta } from '../lib/blog'
import { Cover, useRoomChannel } from '@/features/booth'
import { formatDate } from '@/lib/date'
import { ViewCounter } from './view-counter'
import { Markdown } from './markdown'
import styles from '../releases.module.css'

interface Chapter {
  id: string
  title: string
  top: number
}

const COVER_HUES = [
  '#ff5a1f',
  '#5cd6a3',
  '#c9a574',
  '#9b6cff',
  '#d9895b',
  '#2e3f5c',
]

export function BlogPost({
  meta,
  content,
  relatedPosts = [],
}: {
  meta: BlogMeta
  content: string
  relatedPosts?: BlogMeta[]
  prevPost?: BlogMeta
  nextPost?: BlogMeta
}) {
  const setHue = useRoomChannel()
  const articleRef = useRef<HTMLElement>(null)
  const [paper, setPaper] = useState(false)
  const [chapters, setChapters] = useState<Chapter[]>([])
  const [progress, setProgress] = useState(0)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    setHue(COVER_HUES[(meta.tags.length || 1) % COVER_HUES.length])
  }, [meta.tags.length, setHue])

  const { scrollYProgress } = useScroll()
  const smooth = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 30,
    restDelta: 0.001,
  })

  // Chapter ticks are measured once the headings exist and ids are assigned.
  useEffect(() => {
    const timer = setTimeout(() => {
      const el = articleRef.current
      if (!el) return

      let h2 = 0
      let h3 = 0
      let lastH2 = 0
      const next: Chapter[] = []

      el.querySelectorAll('h2').forEach((node) => {
        h2 += 1
        h3 = 0
        lastH2 = h2
        const id = `chapter-${h2}`
        node.id = id
        next.push({
          id,
          title: node.textContent ?? '',
          top: node.getBoundingClientRect().top + window.scrollY,
        })
      })

      el.querySelectorAll('h3').forEach((node) => {
        h3 += 1
        const id = `chapter-${lastH2}-${h3}`
        node.id = id
        next.push({
          id,
          title: node.textContent ?? '',
          top: node.getBoundingClientRect().top + window.scrollY,
        })
      })

      setChapters(next)
    }, 120)

    return () => clearTimeout(timer)
  }, [content])

  // The readouts update a few times a second, not on every scroll frame.
  useEffect(() => {
    let last = 0
    return smooth.on('change', (value) => {
      const now = Date.now()
      if (now - last < 220) return
      last = now
      setProgress(value)
    })
  }, [smooth])

  useEffect(() => {
    if (!open) return
    function onKey(event: KeyboardEvent) {
      if (event.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  const jumpTo = useCallback((top: number) => {
    window.scrollTo({ top, behavior: 'smooth' })
    setOpen(false)
  }, [])

  const current = useMemo(() => {
    void progress
    let found: Chapter | null = null
    for (const chapter of chapters) {
      if (chapter.top - 120 <= window.scrollY + 200) found = chapter
    }
    return found
  }, [chapters, progress])

  return (
    <>
      <main className={styles.page} id="main-content">
        <nav className={styles.crumbs} aria-label="Breadcrumb">
          <Link href="/blog" className={styles.crumbBack}>
            <ArrowLeft size={14} aria-hidden="true" />
            All notes
          </Link>
          <span className={styles.crumbSep} aria-hidden="true">
            /
          </span>
          <span className={styles.crumbHere} aria-current="page">
            {meta.title}
          </span>
        </nav>

        <div className={styles.reader}>
          <article
            ref={articleRef}
            className={`${styles.article} ${paper ? styles.paper : ''}`}
          >
            <div className={styles.headlineCover}>
              <Cover
                seed={meta.slug}
                title={meta.title}
                sizes="84px"
                priority
              />
            </div>

            <p className={styles.headlineMeta}>
              {/*
                The byline was missing entirely: a post showed date, reading
                time and view count, but nothing identifying who wrote it. The
                Person JSON-LD said "Aditya Himawan" and the page never did, so
                the on-page authorship signal and the structured one disagreed.
                Links to the contact page, which gives the name an internal link
                of its own.
              */}
              <Link href="/#contact" className={styles.tag}>
                Aditya Himawan
              </Link>
              <span>·</span>
              {formatDate(meta.date, 'long')}
              <span>·</span>
              <span>{meta.readingTime}</span>
              <span>·</span>
              <ViewCounter slug={meta.slug} />
            </p>

            <h1 className={styles.headlineTitle}>{meta.title}</h1>
            <p className={styles.headlineDesc}>{meta.description}</p>

            <div className={styles.body}>
              <Markdown content={content} />
            </div>

            <div className={styles.leadMeta} style={{ marginTop: '1.5rem' }}>
              <button
                type="button"
                onClick={() => setPaper((v) => !v)}
                aria-pressed={paper}
                className={styles.tag}
              >
                Paper mode
              </button>
              {meta.tags.map((tag) => (
                <Link
                  key={tag}
                  href={`/blog?tag=${encodeURIComponent(tag)}`}
                  className={styles.tag}
                  style={{ textDecoration: 'none' }}
                >
                  {tag}
                </Link>
              ))}
            </div>

            {relatedPosts.length > 0 && (
              <section className={styles.related}>
                <h2 className={styles.sideTitle}>Next in the crate</h2>
                <ul
                  className={styles.trackList}
                  style={{ marginTop: '0.75rem' }}
                >
                  {relatedPosts.map((post) => (
                    <li key={post.slug}>
                      <Link
                        href={`/blog/${post.slug}`}
                        className={styles.track}
                      >
                        <span className={styles.trackIndex}>→</span>
                        <span className={styles.trackArt}>
                          <Cover
                            seed={post.slug}
                            title={post.title}
                            sizes="44px"
                          />
                        </span>
                        <span className={styles.trackBody}>
                          <span className={styles.trackTitle}>
                            {post.title}
                          </span>
                          <span className={styles.trackMeta}>
                            {formatDate(post.date)} · {post.readingTime}
                          </span>
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </section>
            )}
          </article>

          {chapters.length > 0 && (
            <nav className={`${styles.chapters} glass`} aria-label="Chapters">
              <p className={styles.chapterTitle}>Chapters</p>
              <ul className={styles.chapterList}>
                {chapters.map((chapter) => (
                  <li key={chapter.id}>
                    <button
                      type="button"
                      onClick={() => jumpTo(chapter.top)}
                      aria-current={current?.id === chapter.id || undefined}
                      className={`${styles.chapter} ${chapter.id.includes('-') && !chapter.id.match(/^chapter-\d+$/) ? styles.chapterSub : ''}`}
                    >
                      {chapter.title}
                    </button>
                  </li>
                ))}
              </ul>
              <p className={styles.chapterFoot}>{chapters.length} chapters</p>
            </nav>
          )}

          {chapters.length > 0 && (
            <button
              type="button"
              onClick={() => setOpen(true)}
              className={styles.chapterFab}
              aria-label="Open chapters"
            >
              <List size={15} aria-hidden="true" />
              {chapters.length}
            </button>
          )}
        </div>
      </main>

      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
              style={{
                position: 'fixed',
                inset: 0,
                zIndex: 70,
                background: 'rgba(0,0,0,0.55)',
              }}
            />
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-label="Chapters"
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 26, stiffness: 300 }}
              className={`${styles.chapterDrawer} glass`}
            >
              <div className={styles.chapterDrawerHead}>
                <p className={styles.chapterTitle}>Chapters</p>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className={styles.drawerClose}
                  aria-label="Close chapters"
                >
                  <X size={18} />
                </button>
              </div>
              <ul className={styles.chapterList}>
                {chapters.map((chapter) => (
                  <li key={chapter.id}>
                    <button
                      type="button"
                      onClick={() => jumpTo(chapter.top)}
                      className={styles.chapter}
                    >
                      {chapter.title}
                    </button>
                  </li>
                ))}
              </ul>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
