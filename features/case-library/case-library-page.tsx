import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, ArrowUpRight } from 'lucide-react'

import layout from '@/features/archive/archive.module.css'
import { Sparkle } from '@/features/landing-page/studio/doodles'
import { ScriptWord } from '@/features/landing-page/studio/script-word'

import { DESIGN_CASES } from './cases'
import styles from './case-library.module.css'

const METHOD = [
  {
    number: '01',
    title: 'Brief & explorations',
    line: 'Write the constraints down, then draw six marks on one grid. Keep the one that survives 16px, not the one that photographs best.',
  },
  {
    number: '02',
    title: 'Mark, board, tokens',
    line: 'Outline the wordmark, build the lockups and favicon, render a 3 × 3 board, and move the values into primitive → semantic → component tokens.',
  },
  {
    number: '03',
    title: 'Proof & audit',
    line: 'Build the page with real states and real copy. Check contrast, keyboard, reduced motion and the smallest width. Then name what is missing.',
  },
] as const

export function CaseLibraryPage() {
  return (
    <main className={`${layout.page} ${styles.page}`} id="main-content">
      <div className={layout.container}>
        <header className={styles.hero}>
          <div className={layout.kicker}>
            <span className={layout.kickerTag}>
              <Sparkle className="size-2.5" />
              Design engineering / Case library
            </span>
            <span className={layout.kickerText}>Eight systems, one method</span>
            <span className={layout.kickerText}>
              <span className={layout.num}>{DESIGN_CASES.length}</span> cases
            </span>
          </div>

          <ScriptWord
            text="case files"
            className={`${layout.hand} ${styles.hand}`}
            label="Case files"
          />

          <h1 className={layout.title}>Eight systems, one paper trail.</h1>
          <p className={layout.intro}>
            A case is not a moodboard. It is a brief, a mark, a system, a proof
            and a written decision. Sunnyside is paper and cobalt; Vitrine is
            glass and dither; Huginn is one cell and an ordered dither; Riso Co.
            is a pinned sheet torn from the pin; Hachure is survey stock and
            ordered dither; Cove is blue liquid glass and a solid reading plate;
            Strand is quartz sand and a coastal vista; Clearing is painted
            emerald light behind one pane of glass. Each case is documented with
            its files and gaps left on the table.
          </p>

          <div className={styles.heroActions}>
            <Link href="/design-engineering" className={styles.primaryLink}>
              Read the method
              <ArrowRight className="size-4" aria-hidden />
            </Link>
            <Link href="/projects" className={styles.secondaryLink}>
              The release shelf
              <ArrowUpRight className="size-4" aria-hidden />
            </Link>
          </div>
        </header>

        <section className={styles.cases} aria-label="Design-system cases">
          {DESIGN_CASES.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={`${styles.card} ${styles[`tone_${item.tone}`]}`}
              aria-label={`Open the ${item.name} case`}
            >
              <div className={styles.cardTop}>
                <span className={styles.caseNumber}>Case {item.number}</span>
                <span className={styles.status}>{item.status}</span>
              </div>

              <div className={styles.cover}>
                <Image
                  src={item.cover}
                  alt={item.coverAlt}
                  width={1500}
                  height={1125}
                  sizes="(max-width: 900px) 100vw, 50vw"
                />
              </div>

              <div className={styles.body}>
                <div className={styles.titleRow}>
                  <h2 className={styles.name}>{item.name}</h2>
                  <span className={styles.caseDot} aria-hidden />
                </div>
                <p className={styles.tagline}>{item.tagline}</p>
                <p className={styles.description}>{item.description}</p>

                <dl className={styles.meta}>
                  <div>
                    <dt>Material</dt>
                    <dd>{item.material}</dd>
                  </div>
                  <div>
                    <dt>Role</dt>
                    <dd>{item.role}</dd>
                  </div>
                </dl>

                <ul className={styles.tags} aria-label={`${item.name} themes`}>
                  {item.tags.map((tag) => (
                    <li key={tag}>{tag}</li>
                  ))}
                </ul>

                <span className={styles.open}>
                  Open the case
                  <ArrowUpRight className="size-3.5" aria-hidden />
                </span>
              </div>
            </Link>
          ))}
        </section>

        <section className={styles.method} aria-labelledby="method-title">
          <div className={layout.sectionHead}>
            <h2 id="method-title" className={layout.sectionTitle}>
              The method behind all eight
            </h2>
            <span className={layout.sectionNote}>
              Brief → explorations → mark → board → tokens → guide → audit
            </span>
          </div>

          <div className={styles.methodGrid}>
            {METHOD.map((step) => (
              <article key={step.number} className={styles.methodItem}>
                <span className={styles.methodNumber}>{step.number}</span>
                <h3>{step.title}</h3>
                <p>{step.line}</p>
              </article>
            ))}
          </div>

          <p className={styles.methodFoot}>
            The method is documented as a field manual, and packaged as the{' '}
            <Link href="/design-engineering#skill">sunnyside-brand-system</Link>{' '}
            agent skill. Vitrine, Huginn, Riso Co., Hachure, Cove, Strand and
            Clearing prove it travels beyond one material.
          </p>
        </section>
      </div>
    </main>
  )
}
