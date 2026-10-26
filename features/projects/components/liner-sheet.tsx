'use client'

import { useEffect } from 'react'
import Image from 'next/image'
import { AnimatePresence, motion } from 'motion/react'
import { ArrowUpRight, Github, X } from 'lucide-react'
import type { WorkProject } from '@/data/projects'
import { trackLabel } from '@/data/projects'
import styles from '../sunnyside-projects.module.css'

interface LinerSheetProps {
  project: WorkProject | null
  index: number
  onClose: () => void
}

/**
 * The back of the album: tracklist of highlights, personnel, and links.
 * Styled in the Sunnyside archival liner sheet specification.
 */
export function LinerSheet({ project, index, onClose }: LinerSheetProps) {
  useEffect(() => {
    if (!project) return
    function onKey(event: KeyboardEvent) {
      if (event.key === 'Escape') onClose()
    }
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = previous
      window.removeEventListener('keydown', onKey)
    }
  }, [project, onClose])

  return (
    <AnimatePresence>
      {project && (
        <motion.div
          className={styles.modalBackdrop}
          role="presentation"
          onClick={onClose}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className={styles.modalSheet}
            role="dialog"
            aria-modal="true"
            aria-labelledby="liner-title"
            onClick={(event) => event.stopPropagation()}
            initial={{ scale: 0.95, y: 16, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.96, opacity: 0 }}
            transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className={styles.modalTape} />

            <button
              type="button"
              onClick={onClose}
              className={styles.modalClose}
              aria-label="Close liner notes"
            >
              <X size={16} />
            </button>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1.5rem' }}>
              <div>
                <p
                  style={{
                    fontFamily: 'var(--mono)',
                    fontSize: '0.72rem',
                    textTransform: 'uppercase',
                    letterSpacing: '0.12em',
                    color: 'var(--muted)',
                    marginBottom: '0.25rem',
                  }}
                >
                  SIDE {trackLabel(index)[0]} · {trackLabel(index)} · {project.genre} · {project.year}
                </p>
                <h2
                  id="liner-title"
                  style={{
                    fontFamily: 'var(--display)',
                    fontWeight: 800,
                    fontSize: '1.8rem',
                    letterSpacing: '-0.03em',
                    color: 'var(--ink)',
                    marginBottom: '0.75rem',
                  }}
                >
                  {project.title}
                </h2>
                <p
                  style={{
                    fontSize: '0.95rem',
                    lineHeight: 1.6,
                    color: 'var(--muted)',
                    marginBottom: '1.5rem',
                  }}
                >
                  {project.description}
                </p>

                {/* Highlights / Tracklist */}
                <h3
                  style={{
                    fontFamily: 'var(--mono)',
                    fontSize: '0.75rem',
                    textTransform: 'uppercase',
                    letterSpacing: '0.14em',
                    color: 'var(--ink)',
                    borderBottom: '1.5px solid var(--ink)',
                    paddingBottom: '0.35rem',
                    marginBottom: '0.75rem',
                  }}
                >
                  Key Architectural Decisions
                </h3>
                <ol
                  style={{
                    paddingLeft: '1.25rem',
                    marginBottom: '1.5rem',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.5rem',
                    fontSize: '0.9rem',
                    lineHeight: 1.5,
                  }}
                >
                  {project.highlights.map((h) => (
                    <li key={h} style={{ color: 'var(--ink)' }}>
                      {h}
                    </li>
                  ))}
                </ol>

                {/* Role & Personnel */}
                <h3
                  style={{
                    fontFamily: 'var(--mono)',
                    fontSize: '0.75rem',
                    textTransform: 'uppercase',
                    letterSpacing: '0.14em',
                    color: 'var(--ink)',
                    borderBottom: '1.5px solid var(--ink)',
                    paddingBottom: '0.35rem',
                    marginBottom: '0.5rem',
                  }}
                >
                  Engineering Scope
                </h3>
                <p style={{ fontSize: '0.9rem', color: 'var(--muted)', marginBottom: '1rem' }}>
                  {project.role}
                </p>

                {/* Tech stack */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem', marginBottom: '1.5rem' }}>
                  {project.stack.map((t) => (
                    <span key={t} className={styles.stackTag}>
                      {t}
                    </span>
                  ))}
                </div>

                {/* Action buttons */}
                <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap' }}>
                  <a
                    href={project.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`${styles.tactileBtn} ${styles.tactileBtnPrimary}`}
                  >
                    Open live application
                    <ArrowUpRight size={13} />
                  </a>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
