'use client'

import { useEffect } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { ArrowUpRight, X } from 'lucide-react'

import type { WorkProject } from '@/data/projects'
import { trackLabel } from '@/data/projects'
import layout from '@/features/archive/archive.module.css'
import styles from '../sunnyside-projects.module.css'

interface LinerSheetProps {
  project: WorkProject | null
  index: number
  onClose: () => void
}

/**
 * The back of the sleeve: the tracklist, the personnel and the one link out.
 * Same paper, same catalogue number and same hard edge as the card that opened
 * it, so the modal reads as the sleeve turned over rather than a new surface.
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
      {project ? (
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
            initial={{ y: 16, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 10, opacity: 0 }}
            transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
          >
            <span className={styles.modalTape} aria-hidden />

            <button
              type="button"
              onClick={onClose}
              className={styles.modalClose}
              aria-label="Close liner notes"
            >
              <X size={16} aria-hidden />
            </button>

            <p className={styles.modalMeta}>
              Side A, track {trackLabel(index)} / {project.genre} /{' '}
              {project.year}
            </p>
            <h2 id="liner-title" className={styles.modalTitle}>
              {project.title}
            </h2>
            <p className={styles.modalDesc}>{project.description}</p>

            <h3 className={styles.modalSection}>What it does</h3>
            <ol className={styles.modalList}>
              {project.highlights.map((highlight) => (
                <li key={highlight}>{highlight}</li>
              ))}
            </ol>

            <h3 className={styles.modalSection}>Role</h3>
            <p className={styles.modalRole}>{project.role}</p>

            <div className={styles.modalChips} aria-label="Stack">
              {project.stack.map((tech) => (
                <span key={tech} className={styles.stackTag}>
                  {tech}
                </span>
              ))}
            </div>

            <div className={styles.modalActions}>
              <a
                href={project.url}
                target="_blank"
                rel="noopener noreferrer"
                className={layout.primary}
              >
                Open the live app
                <ArrowUpRight className="size-4" aria-hidden />
              </a>
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  )
}
