'use client'

import type { ReactNode } from 'react'
import Image from 'next/image'
import { ArrowUpRight } from 'lucide-react'
import { cn } from '@/lib/utils'

import { Squiggle } from './doodles'
import { Reveal } from './reveal'
import { Tilt } from './tilt'
import { StickerPit } from './gravity/sticker-pit'
import { SectionHead, SectionNext } from './section-head'
import { ABOUT_FACTS, JOBS, PRINCIPLES } from './studio-data'
import styles from './studio.module.css'

function FactDisclosure({
  value,
  children,
}: {
  value: string
  children: ReactNode
}) {
  return (
    <details className={styles.factJob}>
      <summary>
        <span className={styles.factJobValue}>{value}</span>
        <span className={styles.jobToggle} aria-hidden>
          +
        </span>
      </summary>
      {children}
    </details>
  )
}

export function About() {
  const dayJob = ABOUT_FACTS[0]
  const offScreen = ABOUT_FACTS[ABOUT_FACTS.length - 1]
  const restFacts = ABOUT_FACTS.slice(1, -1)

  return (
    <section
      id="about"
      className={`${styles.about} scroll-mt-24`}
      aria-labelledby="about-title"
    >
      <div className={styles.shell}>
        <SectionHead
          number="01"
          label="About"
          script="hello!"
          title={
            <span id="about-title">
              I make the interface
              <br />
              <span className="text-[var(--cobalt)]">
                and the thing behind it.
              </span>
            </span>
          }
          intro="Six years of product work, one habit: decide in the browser, then leave enough structure that the next person can disagree with me."
        />

        <StickerPit />

        <div className={styles.aboutGrid}>
          <div>
            <Reveal>
              <p className={styles.aboutBody}>
                I&apos;m Aditya Himawan, a design engineer based in Jakarta. For
                six years I&apos;ve built product interfaces for teams in
                manufacturing, developer tools and finance, usually the part
                where a design has to survive{' '}
                <strong>real data, real browsers and a real deadline.</strong>
              </p>
              <p className={styles.aboutBody}>
                I prototype in the browser, own the component API and the state
                behind it, and keep the motion honest. The handoff is a pull
                request, not a promise.
              </p>
            </Reveal>

            <Reveal delay={0.08}>
              <dl className={styles.aboutFacts}>
                <div className={styles.aboutFact}>
                  <dt>Day job</dt>
                  <dd>
                    <FactDisclosure value={dayJob.value}>
                      <ul className={styles.jobRoster}>
                        {JOBS.map((job) => (
                          <li key={job.company} className={styles.jobRow}>
                            <span className={styles.jobCompany}>
                              {job.company}
                            </span>
                            <span className={styles.jobRole}>{job.role}</span>
                            <span className={styles.jobPeriod}>
                              {job.period} · {job.place}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </FactDisclosure>
                  </dd>
                </div>
                {restFacts.map((fact) => (
                  <div key={fact.key} className={styles.aboutFact}>
                    <dt>{fact.key}</dt>
                    <dd>{fact.value}</dd>
                  </div>
                ))}
                <div className={styles.aboutFact}>
                  <dt>{offScreen.key}</dt>
                  <dd>
                    <FactDisclosure value={offScreen.value}>
                      <ul className={styles.jobRoster}>
                        <li className={styles.jobRow}>
                          <span className={styles.jobCompany}>Letterboxd</span>
                          <a
                            className={styles.factLink}
                            href="https://letterboxd.com/adityahimaone/"
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            Films I&apos;ve been through
                            <ArrowUpRight className="size-3" aria-hidden />
                          </a>
                        </li>
                        <li className={styles.jobRow}>
                          <span className={styles.jobCompany}>Spotify</span>
                          <a
                            className={styles.factLink}
                            href="https://open.spotify.com/user/212nmrqpklzmvpntgorzpavgq?si=EDxcJxPWTy63-7YI-tffuQ&utm_source=copy_link"
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            What&apos;s on repeat
                            <ArrowUpRight className="size-3" aria-hidden />
                          </a>
                        </li>
                      </ul>
                    </FactDisclosure>
                  </dd>
                </div>
              </dl>
            </Reveal>

            <Reveal delay={0.12}>
              <p className="mt-7 max-w-[46ch] font-[family-name:var(--font-syne)] text-[clamp(1.05rem,1.8vw,1.35rem)] leading-[1.3] font-semibold tracking-[-0.025em]">
                The detail is the interface.
                <Squiggle className="mt-1 h-2.5 w-40 text-[var(--tangerine)]" />
              </p>
            </Reveal>
          </div>

          <div className={styles.aboutSide}>
            <Reveal delay={0.06} y={32}>
              <div className={styles.photoStage} data-about-photo>
                <Tilt className={styles.photoTilt} max={3.5} lift={4}>
                  <div className={styles.photoCard} data-journey="photo">
                    <span
                      className={cn(
                        styles.tape,
                        'top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 -rotate-3',
                      )}
                      aria-hidden
                    />
                    <div className={styles.photoFrame}>
                      <Image
                        src="/memoji-1.png"
                        alt="Aditya's memoji, half hidden behind a laptop"
                        width={420}
                        height={420}
                        sizes="(min-width: 1024px) 22rem, 80vw"
                        priority={false}
                      />
                    </div>
                    <div className={styles.photoCaption}>
                      <span>
                        <b>that&apos;s me</b>
                        <br />
                        probably debugging
                      </span>
                      <span>JKT / 2026</span>
                    </div>
                  </div>
                </Tilt>
              </div>
            </Reveal>

            <Reveal delay={0.14} y={32}>
              <div data-about-now>
                <div className={styles.nowCard}>
                  <b>Now</b>
                  Latest release: <strong>Switchyard</strong>.
                  <br />
                  Next: a few small tools, then a break.
                </div>
              </div>
            </Reveal>
          </div>
        </div>

        <div className={styles.principles}>
          {PRINCIPLES.map((principle, index) => (
            <Reveal key={principle.number} delay={index * 0.06} y={18}>
              <div className={styles.principle}>
                <span className={styles.principleNumber}>
                  {principle.number}
                </span>
                <h3 className={styles.principleTitle}>{principle.title}</h3>
                <p className={styles.principleLine}>{principle.line}</p>
              </div>
            </Reveal>
          ))}
        </div>

        <SectionNext href="showcase" label="Show & tell" note="the wall" />
      </div>
    </section>
  )
}
