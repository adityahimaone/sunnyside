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
import { useRoomChannel } from '@/features/booth'
import { useDockSlot } from '@/features/booth/dock-slot'
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
  const setHue = useRoomChannel()
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
    setHue(project.palette.a)
  }, [project, setHue])

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

  // Mount transport indicator into bottom dock slot
  useDockSlot(
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.4rem',
        padding: '0.35rem 0.75rem',
        background: 'var(--paper-hi)',
        border: '1.5px solid var(--ink)',
        borderRadius: '999px',
        boxShadow: '2px 2px 0 var(--ink)',
        fontFamily: 'var(--mono)',
        fontSize: '0.7rem',
        color: 'var(--ink)',
      }}
      role="group"
      aria-label="Crate transport"
    >
      <button
        type="button"
        onClick={() => go(-1)}
        style={{ cursor: 'pointer', background: 'none', border: 'none' }}
        aria-label="Previous release"
      >
        <SkipBack size={12} />
      </button>
      <button
        type="button"
        onClick={() => setPlaying((v) => !v)}
        style={{ cursor: 'pointer', background: 'none', border: 'none' }}
        aria-label={playing ? 'Pause' : 'Play'}
      >
        {playing ? <Pause size={12} /> : <Play size={12} fill="currentColor" />}
      </button>
      <span>
        {project.title} · {formatProjectTime(elapsed)} /{' '}
        {formatProjectTime(PROJECT_PREVIEW_DURATION)}
      </span>
      <button
        type="button"
        onClick={() => go(1)}
        style={{ cursor: 'pointer', background: 'none', border: 'none' }}
        aria-label="Next release"
      >
        <SkipForward size={12} />
      </button>
    </div>,
    [project.id, elapsed, playing],
  )

  const progressPercent = Math.min(
    100,
    (elapsed / PROJECT_PREVIEW_DURATION) * 100,
  )

  return (
    <main className={styles.page} id="main-content">
      <div className={styles.shell}>
        {/* Header */}
        <header className={styles.header}>
          <div className={styles.headerMeta}>
            <span className={styles.pill}>
              <span className={styles.pillDot} />
              01 / ARCHIVE
            </span>
            <span>Selected Work · 2022–2026</span>
            <span>·</span>
            <span>{WORK_PROJECTS.length} Shipped Releases</span>
          </div>

          <div className={styles.headerTitleStack}>
            <ScriptWord
              text="the discography"
              className={styles.headerScript}
            />
            <h1 className={styles.headerTitle}>
              Proof in the product.
              <span className={styles.headerTitleTape}>SIDE A</span>
            </h1>
          </div>

          <p className={styles.headerIntro}>
            Six production frontend systems, interfaces and experiments built
            with Next.js, React and TypeScript. Pick a release on the shelf to
            cue it into the console, inspect its architectural breakdown, and
            read the field notes.
          </p>

          {/* Problem filter chips */}
          <div className={styles.filterRow}>
            <span className={styles.filterLabel}>Problem Shape:</span>
            <button
              type="button"
              className={`${styles.filterChip} ${
                problem === 'All' ? styles.filterChipActive : ''
              }`}
              onClick={() => setProblem('All')}
            >
              <span>All Releases</span>
              <span className={styles.filterChipCount}>
                {WORK_PROJECTS.length}
              </span>
            </button>
            {problems.map(([pName, count]) => (
              <button
                key={pName}
                type="button"
                className={`${styles.filterChip} ${
                  problem === pName ? styles.filterChipActive : ''
                }`}
                onClick={() => setProblem(pName)}
              >
                <span>{pName}</span>
                <span className={styles.filterChipCount}>{count}</span>
              </button>
            ))}
          </div>
        </header>

        {/* Asymmetric 5-column / 7-column layout */}
        <div className={styles.asymmetricGrid}>
          {/* Left Column: Master Console (Sticky) */}
          <aside className={styles.consoleSticky}>
            <section
              className={styles.consoleBox}
              aria-label="Mastering console"
            >
              <div className={`${styles.screw} ${styles.screwTL}`} />
              <div className={`${styles.screw} ${styles.screwTR}`} />
              <div className={`${styles.screw} ${styles.screwBL}`} />
              <div className={`${styles.screw} ${styles.screwBR}`} />

              <div className={styles.consoleTopBar}>
                <div className={styles.consoleLed}>
                  <span className={styles.ledDot} />
                  <span>NOW CUED · TRACK {trackLabel(index)}</span>
                </div>
                <span>REV {project.year}</span>
              </div>

              {/* Turntable / Disc Preview */}
              <div className={styles.turntableStage}>
                <div
                  className={`${styles.vinylDisc} ${
                    playing ? styles.vinylSpin : ''
                  }`}
                >
                  <div className={styles.vinylGrooves} />
                  <div className={styles.vinylCenter}>
                    <span>AH-{trackLabel(index)}</span>
                    <span style={{ fontSize: '0.45rem', opacity: 0.8 }}>
                      33 RPM
                    </span>
                  </div>
                </div>

                <div className={styles.turntableSleeve}>
                  {project.cover ? (
                    <Image
                      src={project.cover}
                      alt={project.title}
                      fill
                      className="object-cover"
                      sizes="180px"
                      priority
                    />
                  ) : (
                    <div
                      style={{
                        width: '100%',
                        height: '100%',
                        background: project.palette.a,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'var(--ink)',
                        fontFamily: 'var(--display)',
                        fontWeight: 800,
                        fontSize: '1.2rem',
                        padding: '1rem',
                        textAlign: 'center',
                      }}
                    >
                      {project.title}
                    </div>
                  )}
                </div>
              </div>

              {/* Scrubber Tape Ribbon */}
              <div className={styles.scrubberRibbon}>
                <span>{formatProjectTime(elapsed)}</span>
                <div className={styles.scrubberTrack}>
                  <div
                    className={styles.scrubberFill}
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
                <span>{formatProjectTime(PROJECT_PREVIEW_DURATION)}</span>
              </div>

              {/* Console Info Body */}
              <div className={styles.consoleBody} style={{ marginTop: '1rem' }}>
                <div className={styles.consoleKicker}>
                  <span>
                    {project.problem} · {project.genre}
                  </span>
                  {repo && repo.stargazers_count > 0 && (
                    <span
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.25rem',
                      }}
                    >
                      <Star size={11} fill="currentColor" />
                      {repo.stargazers_count}
                    </span>
                  )}
                </div>

                <h2 className={styles.consoleTitle}>{project.title}</h2>
                <p className={styles.consoleDesc}>{project.description}</p>

                <div className={styles.consoleStack}>
                  {project.stack.map((t) => (
                    <span key={t} className={styles.stackTag}>
                      {t}
                    </span>
                  ))}
                </div>

                {/* Direct Action Buttons */}
                <div
                  style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: '0.5rem',
                    marginTop: '0.75rem',
                  }}
                >
                  <Link
                    href={`/projects/${project.slug}`}
                    className={`${styles.tactileBtn} ${styles.tactileBtnPrimary}`}
                  >
                    Read case study
                    <ArrowUpRight size={14} />
                  </Link>

                  <a
                    href={project.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`${styles.tactileBtn} ${styles.tactileBtnSecondary}`}
                  >
                    Open live app
                    <ExternalLink size={13} />
                  </a>

                  <button
                    type="button"
                    onClick={() => setLinerId(project.id)}
                    className={styles.tactileBtn}
                  >
                    <Info size={13} />
                    Liner notes
                  </button>
                </div>
              </div>

              {/* Transport Buttons */}
              <div className={styles.transportRow}>
                <div className={styles.transportBtnGroup}>
                  <button
                    type="button"
                    onClick={() => go(-1)}
                    className={styles.tactileBtn}
                    aria-label="Previous release"
                  >
                    <SkipBack size={13} />
                  </button>
                  <button
                    type="button"
                    onClick={() => setPlaying((v) => !v)}
                    className={`${styles.tactileBtn} ${
                      playing ? styles.tactileBtnSecondary : ''
                    }`}
                    aria-label={playing ? 'Pause' : 'Play'}
                  >
                    {playing ? (
                      <Pause size={14} />
                    ) : (
                      <Play size={14} fill="currentColor" />
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={() => go(1)}
                    className={styles.tactileBtn}
                    aria-label="Next release"
                  >
                    <SkipForward size={13} />
                  </button>
                </div>
                <span
                  style={{
                    fontFamily: 'var(--mono)',
                    fontSize: '0.68rem',
                    color: 'var(--muted)',
                  }}
                >
                  {index + 1} OF {WORK_PROJECTS.length}
                </span>
              </div>
            </section>
          </aside>

          {/* Right Column: Release Crate Shelf */}
          <section className={styles.shelfColumn} aria-label="Release crate">
            <div className={styles.shelfHeader}>
              <h2 className={styles.shelfTitle}>Release Shelf</h2>
              <span className={styles.shelfCount}>
                Showing {visible.length} of {WORK_PROJECTS.length}
              </span>
            </div>

            <div className={styles.shelfDeck}>
              {visible.map((item, itemIdx) => {
                const isSelected = item.id === project.id
                return (
                  <article
                    key={item.slug}
                    onClick={() => select(item.id)}
                    className={`${styles.deckCard} ${
                      isSelected ? styles.deckCardActive : ''
                    }`}
                  >
                    <div className={styles.cardTape} />

                    <div className={styles.cardThumb}>
                      {item.cover ? (
                        <Image
                          src={item.cover}
                          alt={item.title}
                          fill
                          className="object-cover"
                          sizes="(min-width: 640px) 140px, 100vw"
                        />
                      ) : (
                        <div
                          style={{
                            width: '100%',
                            height: '100%',
                            background: item.palette.a,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: 'var(--ink)',
                            fontFamily: 'var(--mono)',
                            fontSize: '0.75rem',
                            fontWeight: 700,
                          }}
                        >
                          AH-{trackLabel(itemIdx)}
                        </div>
                      )}
                    </div>

                    <div className={styles.cardBody}>
                      <div className={styles.cardKicker}>
                        <span>
                          SIDE {trackLabel(itemIdx)[0]} · {trackLabel(itemIdx)}
                        </span>
                        <span>{item.year}</span>
                      </div>

                      <h3 className={styles.cardTitle}>{item.title}</h3>
                      <p className={styles.cardDesc}>{item.description}</p>

                      <div className={styles.consoleStack}>
                        {item.stack.slice(0, 4).map((tech) => (
                          <span key={tech} className={styles.stackTag}>
                            {tech}
                          </span>
                        ))}
                      </div>

                      <div className={styles.cardActions}>
                        <Link
                          href={`/projects/${item.slug}`}
                          onClick={(e) => e.stopPropagation()}
                          className={styles.cardActionLink}
                        >
                          Case study
                          <ArrowUpRight size={13} />
                        </Link>
                        <span style={{ color: 'var(--line)' }}>·</span>
                        <a
                          href={item.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className={styles.cardActionLink}
                        >
                          Live app
                          <ExternalLink size={12} />
                        </a>
                      </div>
                    </div>
                  </article>
                )
              })}
            </div>
          </section>
        </div>

        {/* Bottom Engineering Telemetry Section */}
        <section
          className={styles.telemetrySection}
          aria-label="Engineering activity"
        >
          <div className={styles.telemetryHead}>
            <div>
              <div
                className={styles.headerMeta}
                style={{ marginBottom: '0.4rem' }}
              >
                <span className={styles.pill}>
                  <Sparkle className="size-2.5" />
                  02 / TELEMETRY
                </span>
                <span>GitHub Production Signals</span>
              </div>
              <h2 className={styles.telemetryTitle}>
                Engineering cadence & public repositories.
              </h2>
            </div>
            <a
              href="https://github.com/adityahimaone"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.tactileBtn}
            >
              <Github size={13} />
              adityahimaone on GitHub
              <ArrowUpRight size={13} />
            </a>
          </div>

          {/* Skyline */}
          <div className={styles.telemetryCard}>
            <div
              style={{
                fontFamily: 'var(--mono)',
                fontSize: '0.72rem',
                textTransform: 'uppercase',
                letterSpacing: '0.12em',
                marginBottom: '1rem',
                color: 'var(--muted)',
                display: 'flex',
                justifyContent: 'space-between',
              }}
            >
              <span>ANNUAL COMMIT FREQUENCY</span>
              <span>{contributions.length} DAYS RECORDED</span>
            </div>
            <ContributionSkyline data={contributions} />
          </div>

          {/* Repos Grid */}
          {repos.length > 0 && (
            <div>
              <h3
                style={{
                  fontFamily: 'var(--display)',
                  fontSize: '1.25rem',
                  fontWeight: 750,
                  marginBottom: '1rem',
                  color: 'var(--ink)',
                }}
              >
                Selected Open-Source Repositories
              </h3>
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
                      <div className={styles.repoName}>{r.name}</div>
                      <p className={styles.repoDesc}>
                        {r.description || 'Open source engineering release.'}
                      </p>
                    </div>
                    <div className={styles.repoMeta}>
                      <span className={styles.repoLang}>
                        <span className={styles.langDot} />
                        {r.language || 'TypeScript'}
                      </span>
                      <span
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.2rem',
                        }}
                      >
                        <Star size={11} /> {r.stargazers_count}
                      </span>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          )}
        </section>
      </div>

      {/* Liner Notes Modal */}
      {linerId !== null && (
        <LinerSheet
          project={
            WORK_PROJECTS.find((p) => p.id === linerId) ?? WORK_PROJECTS[0]
          }
          index={WORK_PROJECTS.findIndex((p) => p.id === linerId)}
          onClose={() => setLinerId(null)}
        />
      )}
    </main>
  )
}
