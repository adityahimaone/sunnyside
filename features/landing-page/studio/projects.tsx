'use client'

import Link from 'next/link'

import { WORK_PROJECTS } from '@/data/projects'
import { DESIGN_CASES, type DesignCase } from '@/features/case-library/cases'

import { ArrowUpRight, Sun } from './doodles'
import { Reveal } from './reveal'
import { SectionHead, SectionNext } from './section-head'
import { WorkGallery } from './work-gallery'
import styles from './studio.module.css'

/**
 * 03 — Selected work.
 *
 * The section is still the cobalt room and the same chapter opener. What
 * changed is the shelf itself: the releases and the documented design systems
 * share one filterable bento, with the details living in a drawer instead of
 * under every cover. `WorkGallery` owns the data, the filter state and the
 * drawings; this file only owns the chapter around it.
 *
 * The counts in the copy are read from the data rather than typed, so adding a
 * release or a case never leaves a stale "six systems" line behind.
 */
export function Projects({
  designCases,
}: {
  designCases?: readonly DesignCase[]
} = {}) {
  const releases = WORK_PROJECTS.length
  const systems = designCases?.length ?? DESIGN_CASES.length

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
          intro={`${releases} releases and ${systems} documented systems in the catalogue. The wall is a curated dozen; filter it, then open a card for the notes.`}
        />

        <WorkGallery designCases={designCases} />

        <Reveal delay={0.1}>
          <div className={styles.archiveBand}>
            <p>
              {releases} releases · {systems} systems · 2022–26
            </p>
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
