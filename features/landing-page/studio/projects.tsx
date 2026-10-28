'use client'

import Link from 'next/link'

import { ArrowUpRight, Sun } from './doodles'
import { Reveal } from './reveal'
import { SectionHead, SectionNext } from './section-head'
import { WorkGallery } from './work-gallery'
import styles from './studio.module.css'

/**
 * 03 — Selected work.
 *
 * The section is still the cobalt room and the same chapter opener. What
 * changed is the shelf itself: six releases and five design-system parts now
 * share one filterable bento, with the details living in a drawer instead of
 * under every cover. `WorkGallery` owns the data, the filter state and the
 * drawings; this file only owns the chapter around it.
 */
export function Projects() {
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
              Work that
              <br />
              shipped.
            </span>
          }
          intro="Six releases from the catalogue and the five documented systems behind them. Filter the wall, then open a card for the notes."
        />

        <WorkGallery />

        <Reveal delay={0.1}>
          <div className={styles.archiveBand}>
            <p>Six releases · six systems · 2022–26</p>
            <Link className={styles.archiveLink} href="/projects">
              The full discography
              <ArrowUpRight className="size-5" />
            </Link>
          </div>
        </Reveal>

        <SectionNext onDark href="skills" label="Skills" note="the toolbox" />
      </div>
    </section>
  )
}
