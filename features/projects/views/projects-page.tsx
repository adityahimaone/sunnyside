'use client'

import { useEffect, useMemo, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import {
  ArrowUpRight,
  ExternalLink,
  Github,
  Info,
  Pause,
  Play,
  SkipBack,
  SkipForward,
  Star,
} from 'lucide-react'

import {
  PROJECT_PREVIEW_DURATION,
  WORK_PROJECTS,
  formatProjectTime,
  trackLabel,
} from '@/data/projects'
import type { ContributionDay, FeaturedProject, GitHubRepo } from '../index'
import { LinerSheet } from '../components/liner-sheet'
import ContributionSkyline from '@/components/ui/contribution-skyline'
import { ScriptWord } from '@/features/landing-page/studio/script-word'
import { Sparkle } from '@/features/landing-page/studio/doodles'
import { Reveal } from '@/features/landing-page/studio/reveal'
import layout from '@/features/archive/archive.module.css'
import styles from '../sunnyside-projects.module.css'

const ELAPSED = new Map<number, number>()

export function ProjectsPage({
  repos = [],
  featuredProjects = [],
  contributions = [],
}: {
  repos: GitHubRepo[]
  featuredProjects: FeaturedProject[]
  contributions?: ContributionDay[]
  contributionsFailed?: boolean
  feedFailed?: boolean
}) {
  const [activeId, setActiveId] = useState(WORK_PROJECTS[0].id)
  const [playing, setPlaying] = useState(true)
  const [problem, setProblem] = useState('All')
  const [elapsed, setElapsed] = useState(0)
  const [linerId, setLinerId] = useState<number | null>(null)

  const visible = useMemo(
    () =>
      problem === 'All'
        ? WORK_PROJECTS
        : WORK_PROJECTS.filter((p) => p.problem === problem),
    [problem],
  )

  const problems = useMemo(() => {
    const counts = new Map<string, number>()
    for (const p of WORK_PROJECTS) {
      counts.set(p.problem, (counts.get(p.problem) ?? 0) + 1)
    }
    return [...counts.entries()].sort(
      (a, b) => b[1] - a[1] || a[0].localeCompare(b[0]),
    )
  }, [])

  const selectedId = visible.some((p) => p.id === activeId)
    ? activeId
    : (visible[0]?.id ?? WORK_PROJECTS[0].id)

  const project =
    WORK_PROJECTS.find((p) => p.id === selectedId) ?? WORK_PROJECTS[0]
  const index = WORK_PROJECTS.indexOf(project)
  const repo = repos.find((r) => r.name === featuredProjects[index]?.githubSlug)

  useEffect(() => {
    if (!playing) return
    const id = window.setInterval(() => {
      setElapsed((prev) => {
        const next = prev + 1
        if (next >= PROJECT_PREVIEW_DURATION) {
          ELAPSED.set(project.id, 0)
          return 0
        }
        return next
      })
    }, 1000)
    return () => window.clearInterval(id)
  }, [playing, project.id])

  function select(id: number) {
    ELAPSED.set(activeId, elapsed)
    setActiveId(id)
    setElapsed(ELAPSED.get(id) ?? 0)
  }

  function go(delta: number) {
    const next = (index + delta + WORK_PROJECTS.length) % WORK_PROJECTS.length
    select(WORK_PROJECTS[next].id)
  }

  const progressPercent = Math.min(
    100,
    (elapsed / PROJECT_PREVIEW_DURATION) * 100,
  )

  return (
    <main className={`${layout.page} ${styles.page}`} id="main-content">
      <div className={layout.container}>
        <header className={styles.hero}>
          <div className={styles.heroCopy}>
            <div className={`${layout.kicker} ${layout.rise}`}>
              <span className={layout.kickerTag}>
                <Sparkle className="size-2.5" />
                01 / The shelf
              </span>
              <span className={layout.kickerText}>
                Selected work, 2022 to 2026
              </span>
              <span className={layout.kickerText}>
                <span className={layout.num}>{WORK_PROJECTS.length}</span>{' '}
                shipped releases
              </span>
            </div>

            <ScriptWord
              text="the shelf"
              className={`${layout.hand} ${layout.rise}`}
              delay={0.05}
            />

            <h1 className={`${layout.title} ${layout.rise}`}>
              Proof in the product.
            </h1>

            <p
              className={`${layout.intro} ${layout.rise}`}
              style={{ '--rise-delay': '120ms' } as React.CSSProperties}
            >
              Seven production systems. Pick one on the shelf to cue it.
            </p>

            <div
              className={`${layout.actions} ${layout.rise}`}
              style={{ '--rise-delay': '180ms' } as React.CSSProperties}
            >
              <a href="#shelf" className={layout.primary}>
                Browse the shelf
                <ArrowUpRight className="size-4" aria-hidden />
              </a>
              <a
                href="https://github.com/adityahimaone"
                target="_blank"
                rel="noopener noreferrer"
                className={layout.ghost}
              >
                <Github className="size-4" aria-hidden />
                GitHub
              </a>
            </div>
          </div>

          <div
            className={`${styles.heroArt} ${layout.rise}`}
            style={{ '--rise-delay': '140ms' } as React.CSSProperties}
            aria-hidden
          >
            <div className={styles.sleeve}>
              <span className={`${layout.tape} ${styles.sleeveTape}`} />
              <div className={styles.sleeveArt}>
                {project.cover ? (
                  <Image
                    src={project.cover}
                    alt=""
                    fill
                    sizes="(min-width: 960px) 34vw, 90vw"
                    className="object-cover"
                    priority
                  />
                ) : (
                  <span
                    className={styles.sleeveGenerated}
                    style={
                      {
                        '--sleeve-a': project.palette.a,
                        '--sleeve-b': project.palette.b,
                      } as React.CSSProperties
                    }
                  >
                    <span>{project.title}</span>
                    <span className={styles.sleeveCode}>
                      AH {trackLabel(index)}
                    </span>
                  </span>
                )}
              </div>
              <div className={styles.sleeveFoot}>
                <span className={styles.sleeveLabel}>Now cueing</span>
                <span className={layout.num}>
                  {trackLabel(index)} / {project.year}
                </span>
              </div>
            </div>
          </div>
        </header>

        <section className={styles.deck} aria-label="Cued release">
          <div className={styles.deckMain}>
            <div className={styles.deckCover}>
              {project.cover ? (
                <Image
                  src={project.cover}
                  alt=""
                  fill
                  sizes="132px"
                  className="object-cover"
                />
              ) : (
                <span
                  className={styles.deckGenerated}
                  style={
                    {
                      '--sleeve-a': project.palette.a,
                      '--sleeve-b': project.palette.b,
                    } as React.CSSProperties
                  }
                  aria-hidden
                />
              )}
            </div>

            <div className={styles.deckBody}>
              <p className={styles.deckKicker}>
                <span className={styles.deckLive}>
                  <span className={styles.led} data-on={playing} aria-hidden />
                  {playing ? 'Playing' : 'Paused'}
                </span>
                <span>{project.problem}</span>
                <span>{project.genre}</span>
                <span className={layout.num}>{project.year}</span>
              </p>

              <h2 className={styles.deckTitle} aria-live="polite">
                {project.title}
              </h2>
              <p className={styles.deckDesc}>{project.description}</p>

              <ul className={styles.stack} aria-label="Stack">
                {project.stack.map((tech) => (
                  <li key={tech} className={styles.stackTag}>
                    {tech}
                  </li>
                ))}
              </ul>

              <div className={styles.deckActions}>
                <Link
                  href={`/projects/${project.slug}`}
                  className={`${layout.primary} ${layout.onLoud}`}
                >
                  Read the case study
                  <ArrowUpRight className="size-4" aria-hidden />
                </Link>
                <a
                  href={project.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.deckGhost}
                >
                  Open the live app
                  <ExternalLink className="size-3.5" aria-hidden />
                </a>
                <button
                  type="button"
                  onClick={() => setLinerId(project.id)}
                  className={styles.deckButton}
                >
                  <Info className="size-3.5" aria-hidden />
                  Liner notes
                </button>
              </div>
            </div>
          </div>

          <div className={styles.transport}>
            <div className={styles.transportButtons}>
              <button
                type="button"
                onClick={() => go(-1)}
                className={styles.transportButton}
                aria-label="Previous release"
              >
                <SkipBack className="size-4" aria-hidden />
              </button>
              <button
                type="button"
                onClick={() => setPlaying((v) => !v)}
                className={styles.transportPlay}
                aria-label={playing ? 'Pause the preview' : 'Play the preview'}
              >
                {playing ? (
                  <Pause className="size-4" aria-hidden />
                ) : (
                  <Play className="size-4" fill="currentColor" aria-hidden />
                )}
              </button>
              <button
                type="button"
                onClick={() => go(1)}
                className={styles.transportButton}
                aria-label="Next release"
              >
                <SkipForward className="size-4" aria-hidden />
              </button>
            </div>

            <div className={styles.transportTime}>
              <span className={layout.num}>{formatProjectTime(elapsed)}</span>
              <span className={styles.transportTrack}>
                <span
                  className={styles.transportFill}
                  style={{ width: `${progressPercent}%` }}
                  role="progressbar"
                  aria-label="Release preview progress"
                  aria-valuemin={0}
                  aria-valuemax={PROJECT_PREVIEW_DURATION}
                  aria-valuenow={elapsed}
                />
              </span>
              <span className={layout.num}>
                {formatProjectTime(PROJECT_PREVIEW_DURATION)}
              </span>
            </div>

            <p className={styles.transportMeta}>
              <span className={layout.num}>
                {index + 1} of {WORK_PROJECTS.length}
              </span>
              {repo && repo.stargazers_count > 0 ? (
                <span className={styles.stars}>
                  <Star className="size-3" fill="currentColor" aria-hidden />
                  <span className={layout.num}>{repo.stargazers_count}</span>
                  <span className="sr-only"> stars on GitHub</span>
                </span>
              ) : null}
            </p>
          </div>
        </section>

        <section
          id="shelf"
          className={styles.shelf}
          aria-labelledby="shelf-title"
        >
          <div className={layout.sectionHead}>
            <h2 id="shelf-title" className={layout.sectionTitle}>
              The release shelf
            </h2>
            <p className={layout.sectionNote}>
              Showing <span className={layout.num}>{visible.length}</span> of{' '}
              <span className={layout.num}>{WORK_PROJECTS.length}</span>
            </p>
          </div>

          <div
            className={styles.filters}
            role="group"
            aria-label="Filter releases by the problem they solved"
          >
            <span className={styles.filterLabel}>Problem shape</span>
            <button
              type="button"
              className={styles.filterChip}
              data-active={problem === 'All'}
              onClick={() => setProblem('All')}
            >
              All releases
              <span className={styles.filterCount}>{WORK_PROJECTS.length}</span>
            </button>
            {problems.map(([name, count]) => (
              <button
                key={name}
                type="button"
                className={styles.filterChip}
                data-active={problem === name}
                onClick={() => setProblem(name)}
              >
                {name}
                <span className={styles.filterCount}>{count}</span>
              </button>
            ))}
          </div>

          <div className={styles.shelfGrid}>
            {visible.map((item) => {
              const catalogue = WORK_PROJECTS.indexOf(item)
              const isSelected = item.id === project.id
              return (
                <Reveal
                  key={item.slug}
                  className={styles.shelfCell}
                  delay={0.04}
                  y={22}
                >
                  <article
                    className={styles.card}
                    data-active={isSelected}
                    onClick={() => select(item.id)}
                  >
                    <div className={styles.cardArt}>
                      <span className={`${layout.tape} ${styles.cardTape}`} />
                      {item.cover ? (
                        <Image
                          src={item.cover}
                          alt={`${item.title} interface`}
                          fill
                          sizes="(min-width: 900px) 40vw, 92vw"
                          className="object-cover"
                        />
                      ) : (
                        <span
                          className={styles.cardGenerated}
                          style={
                            {
                              '--sleeve-a': item.palette.a,
                              '--sleeve-b': item.palette.b,
                            } as React.CSSProperties
                          }
                          aria-hidden
                        >
                          <span>{item.title}</span>
                          <span className={styles.sleeveCode}>
                            AH {trackLabel(catalogue)}
                          </span>
                        </span>
                      )}
                      <span className={styles.cardNumber}>
                        {trackLabel(catalogue)}
                      </span>
                    </div>

                    <div className={styles.cardBody}>
                      <p className={styles.cardMeta}>
                        <span className={layout.num}>{item.year}</span>
                        <span>{item.problem}</span>
                        <span>{item.genre}</span>
                      </p>
                      <h3 className={styles.cardTitle}>{item.title}</h3>
                      <p className={styles.cardDesc}>{item.description}</p>

                      <ul className={styles.stack} aria-label="Stack">
                        {item.stack.slice(0, 4).map((tech) => (
                          <li key={tech} className={styles.stackTag}>
                            {tech}
                          </li>
                        ))}
                      </ul>

                      <div className={styles.cardFoot}>
                        <div className={styles.cardLinks}>
                          <Link
                            href={`/projects/${item.slug}`}
                            className={styles.cardLink}
                            onClick={(event) => event.stopPropagation()}
                          >
                            Case study
                          </Link>
                          <a
                            href={item.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={styles.cardLink}
                            onClick={(event) => event.stopPropagation()}
                          >
                            Live app
                          </a>
                        </div>
                        <button
                          type="button"
                          className={styles.cue}
                          aria-pressed={isSelected}
                          onClick={(event) => {
                            event.stopPropagation()
                            select(item.id)
                          }}
                        >
                          {isSelected ? 'Cued' : 'Cue'}
                        </button>
                      </div>
                    </div>
                  </article>
                </Reveal>
              )
            })}
          </div>
        </section>

        <section className={styles.telemetry} aria-labelledby="telemetry-title">
          <div className={styles.telemetryHead}>
            <div>
              <p className={`${layout.kicker} ${styles.telemetryKicker}`}>
                <span className={layout.kickerTag}>Outside the shelf</span>
                <span className={layout.kickerText}>GitHub, the last year</span>
              </p>
              <h2 id="telemetry-title" className={styles.telemetryTitle}>
                Engineering cadence and public repositories.
              </h2>
            </div>
            <a
              href="https://github.com/adityahimaone"
              target="_blank"
              rel="noopener noreferrer"
              className={layout.ghost}
            >
              <Github className="size-4" aria-hidden />
              adityahimaone
            </a>
          </div>

          <div className={styles.skyline}>
            <div className={styles.skylineHead}>
              <span>Contribution calendar</span>
              <span className={layout.num}>
                {contributions.length} days recorded
              </span>
            </div>
            <ContributionSkyline data={contributions} />
          </div>

          {repos.length > 0 ? (
            <div className={styles.repos}>
              <h3 className={styles.reposTitle}>Public repositories</h3>
              <div className={styles.repoGrid}>
                {repos.slice(0, 6).map((r) => (
                  <a
                    key={r.name}
                    href={r.html_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.repoCard}
                  >
                    <div>
                      <span className={styles.repoName}>{r.name}</span>
                      <p className={styles.repoDesc}>
                        {r.description || 'Open source engineering release.'}
                      </p>
                    </div>
                    <span className={styles.repoMeta}>
                      <span className={styles.repoLang}>
                        <span className={styles.langDot} aria-hidden />
                        {r.language || 'TypeScript'}
                      </span>
                      <span className={styles.repoStars}>
                        <Star className="size-3" aria-hidden />{' '}
                        <span className={layout.num}>{r.stargazers_count}</span>
                        <span className="sr-only"> stars</span>
                      </span>
                    </span>
                  </a>
                ))}
              </div>
            </div>
          ) : null}
        </section>
      </div>

      {linerId !== null ? (
        <LinerSheet
          project={
            WORK_PROJECTS.find((p) => p.id === linerId) ?? WORK_PROJECTS[0]
          }
          index={WORK_PROJECTS.findIndex((p) => p.id === linerId)}
          onClose={() => setLinerId(null)}
        />
      ) : null}
    </main>
  )
}
