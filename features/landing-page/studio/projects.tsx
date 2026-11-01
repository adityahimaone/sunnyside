'use client'

import { DESIGN_CASES } from '@/features/case-library/cases'

import { Sun } from './doodles'
import { SectionHead, SectionNext } from './section-head'
import { WorkGallery } from './work-gallery'
import styles from './studio.module.css'

/**
 * 03 — Selected work.
 *
 * The section is still the cobalt room and the same chapter opener. What
 * changed is the shelf itself: the six latest releases and the six latest
 * systems are taped to a papercraft cutting mat instead of sitting in a
 * filterable bento. `WorkGallery` owns the mat, the stamps and the stickers;
 * this file only owns the chapter around it.
 *
 * The counts in the copy are read from `DESIGN_CASES` rather than typed, so
 * adding a case never leaves a stale "six systems" line behind.
 */
export function Projects() {
  const systems = DESIGN_CASES.length

  return (
    <section
      id="work"
      className={`${styles.work} scroll-mt-24`}
      aria-labelledby="work-title"
    >
      <span className={styles.workSun} aria-hidden data-work-sun>
        <Sun className="w-full" />
      </span>
      <div className={styles.shell}>
        <SectionHead
          onDark
          number="03"
          label="Selected work"
          script="the good stuff"
          title={
            <span id="work-title">
              Pinned to
              <br />
              the board.
            </span>
          }
          intro={`The six latest releases and the six latest systems, taped to a cutting mat. Stamp what you like, peel a sticker, then open a piece — the ${systems} cases behind them live in the archive.`}
        />

        <WorkGallery />

        <SectionNext onDark href="skills" label="Skills" note="the toolbox" />
      </div>
    </section>
  )
}
