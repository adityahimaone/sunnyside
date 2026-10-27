import Link from 'next/link'
import { ArrowLeft, ArrowRight, ArrowUpRight } from 'lucide-react'

import layout from '@/features/archive/archive.module.css'

import { CodeText } from './code-text'
import { CopyCommand } from './copy-command'
import { DocsHeading } from './docs-heading'
import { DocsNav, type DocsNavItem } from './docs-nav'
import { LEARNING_TRACKS } from './learning-data'
import styles from './design-engineering.module.css'

const NAV: DocsNavItem[] = [
  {
    href: '#overview',
    label: 'Overview',
    number: '00',
    sectionId: 'overview',
  },
  { href: '#pen', label: 'Pen.dev', number: '01', sectionId: 'pen' },
  { href: '#figma', label: 'Figma', number: '02', sectionId: 'figma' },
  { href: '#craft', label: 'Craft', number: '03', sectionId: 'craft' },
  { href: '#prompts', label: 'Prompts', number: '04', sectionId: 'prompts' },
  { href: '#sources', label: 'Sources', number: '05', sectionId: 'sources' },
]

const SOURCES = Array.from(
  new Map(
    LEARNING_TRACKS.flatMap((track) =>
      track.sources.map((source) => [source.href, source] as const),
    ),
  ).values(),
)

export function DesignEngineeringLearningPage() {
  return (
    <main className={`${layout.page} ${styles.page}`} id="main-content">
      <div className={layout.container}>
        <div className={styles.docs}>
          <DocsNav
            title="Field notes"
            subtitle="Learning / v1.0"
            items={NAV}
            markdownHref="/design-engineering/learning/llms.txt"
            footerLabel="Back to the manual"
            footerHref="/design-engineering"
          />

          <article className={styles.doc}>
            <header className={styles.docHeader} id="overview">
              <p className={styles.breadcrumb}>
                <Link href="/">Home</Link>
                <span>/</span>
                <Link href="/design-engineering">Design engineering</Link>
                <span>/</span>
                Field notes
              </p>
              <p className={styles.kicker}>Learning · v1.0 · 2026</p>
              <h1>Field notes</h1>
              <p className={styles.lede}>
                What the tools taught me, written down before it evaporates.
              </p>
              <p className={styles.intro}>
                Pen.dev first, because the source can live in the repo. Figma
                for the import and the handoff. Craft for the second look.
                Prompts that survive either tool. The notes are ordered by how
                close they are to the build, not by how impressive the tool is.
              </p>

              <div className={styles.metaRow}>
                <span>Updated 2026</span>
                <span>~10 min read</span>
                <span>Four tracks</span>
                <a href="/design-engineering/learning/llms.txt">
                  Read as Markdown
                </a>
              </div>

              <Link href="/design-engineering" className={styles.backLink}>
                <ArrowLeft className={styles.linkIcon} aria-hidden />
                Back to the field manual
              </Link>
            </header>

            <section className={styles.docSection} aria-labelledby="how">
              <DocsHeading id="how" kicker="How to use this">
                Read it, break it, write it down
              </DocsHeading>
              <p className={styles.prose}>
                Each track is a working note: a rule, the reason it exists, and
                a starter you can try in a twenty-minute spike. If a note cannot
                be tried, it does not belong here.
              </p>
              <ol className={styles.learningLoop}>
                <li>
                  <span>01</span>
                  <b>Read</b>
                  <p>
                    One source, not twelve. Take the idea, not the screenshot.
                  </p>
                </li>
                <li>
                  <span>02</span>
                  <b>Spike</b>
                  <p>Build the smallest real version in the browser.</p>
                </li>
                <li>
                  <span>03</span>
                  <b>Write</b>
                  <p>Turn the spike into a rule with a “do” and a “why”.</p>
                </li>
                <li>
                  <span>04</span>
                  <b>Keep</b>
                  <p>
                    Add the rule to the review pass and use it on the next page.
                  </p>
                </li>
              </ol>
            </section>

            {LEARNING_TRACKS.map((track) => (
              <section key={track.id} className={styles.docSection}>
                <DocsHeading
                  id={track.id}
                  kicker={`${track.number} / ${track.label}`}
                >
                  {track.title}
                </DocsHeading>
                <p className={styles.prose}>
                  <CodeText>{track.intro}</CodeText>
                </p>

                <ol className={styles.notes}>
                  {track.tips.map((tip) => (
                    <li key={tip.number}>
                      <span className={styles.noteNumber}>{tip.number}</span>
                      <div>
                        <h3>{tip.title}</h3>
                        <p>
                          <b>Do</b>
                          <CodeText>{tip.do}</CodeText>
                        </p>
                        <p className={styles.noteWhy}>
                          <b>Why</b>
                          <CodeText>{tip.why}</CodeText>
                        </p>
                      </div>
                    </li>
                  ))}
                </ol>

                <div className={styles.codeBlock}>
                  <div className={styles.codeHead}>
                    <span>{track.starterLabel}</span>
                    <CopyCommand
                      text={track.starter}
                      label={`Copy ${track.label} starter`}
                    />
                  </div>
                  <pre tabIndex={0}>
                    <code>{track.starter}</code>
                  </pre>
                </div>

                <div className={styles.sourceRow}>
                  <span>Sources</span>
                  {track.sources.map((source) => (
                    <a
                      key={source.href}
                      href={source.href}
                      target="_blank"
                      rel="noreferrer"
                    >
                      {source.label}
                      <ArrowUpRight className={styles.linkIcon} aria-hidden />
                    </a>
                  ))}
                </div>
              </section>
            ))}

            <section className={styles.docSection}>
              <DocsHeading id="sources" kicker="05 / Sources">
                Where this comes from
              </DocsHeading>
              <p className={styles.prose}>
                The notes are a working summary, not a replacement for the
                source. Read the original before you take the rule.
              </p>
              <ul className={styles.sources}>
                {SOURCES.map((source) => (
                  <li key={source.href}>
                    <a href={source.href} target="_blank" rel="noreferrer">
                      {source.label}
                      <ArrowUpRight className={styles.linkIcon} aria-hidden />
                    </a>
                  </li>
                ))}
              </ul>
              <div className={styles.linkRow}>
                <Link href="/design-engineering" className={styles.textLink}>
                  Back to the manual
                  <ArrowRight className={styles.linkIcon} aria-hidden />
                </Link>
                <a
                  href="https://docs.pen.dev/core-concepts/pen-files"
                  className={styles.textLink}
                  target="_blank"
                  rel="noreferrer"
                >
                  Start with the .pen format
                  <ArrowUpRight className={styles.linkIcon} aria-hidden />
                </a>
              </div>
            </section>
          </article>
        </div>
      </div>
    </main>
  )
}
