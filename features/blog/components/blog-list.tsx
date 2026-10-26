'use client'

import { useMemo } from 'react'
import Link from 'next/link'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import {
  ArrowDownUp,
  ArrowUpRight,
  ChevronRight,
  RefreshCw,
  Search,
  Sparkles,
  X,
} from 'lucide-react'
import type { BlogMeta } from '../lib/blog'
import { waveformFromReadingTime } from '@/lib/waveform-data'
import { formatDate } from '@/lib/date'
import { ViewCounter } from './view-counter'
import { ScriptWord } from '@/features/landing-page/studio/script-word'
import styles from '../sunnyside-blog.module.css'

type Sort = 'desc' | 'asc'

const GUIDES = [
  {
    href: '/guides/self-hosting-nextjs',
    title: 'Self-hosting a Next.js app on a VPS',
    description:
      'From an empty server to a monitored production app: Nginx, PM2, SSL, and the deployment pipeline.',
    steps: 4,
  },
  {
    href: '/guides/vps-vs-vercel',
    title: 'VPS vs Vercel vs Netlify',
    description:
      'Side by side, including the case for not self-hosting at all. Most projects should not.',
    steps: 3,
  },
] as const

const BLOG_FAQ = [
  {
    question: 'How much does it cost to self-host Next.js on a VPS?',
    answer:
      'A $5/month VPS with 1GB RAM and 1 vCPU comfortably serves a typical Next.js app and a few side services. Equivalent traffic on Vercel Pro starts around $20/month, and the gap widens with scale.',
  },
  {
    question: 'Is a VPS cheaper than Vercel?',
    answer:
      'At small scale, roughly comparable. A VPS wins when you need custom middleware, specific Node flags, background jobs, or when you want to avoid vendor lock-in. You trade the platform fee for being the operations team.',
  },
  {
    question: 'Should I self-host at all?',
    answer:
      'For most projects, no. Managed platforms are cheaper in time and the failure modes you take on are real. It is worth it when you need custom middleware, specific Node flags, or persistent background jobs. This site runs on a VPS, which is the exception rather than the rule.',
  },
  {
    question: 'Why write about DevOps on a frontend site?',
    answer:
      'Because the frontend is what breaks when the infrastructure is wrong, and because the alternative is pretending the deployment is someone else’s problem. Every post here is something that actually went wrong and got written down.',
  },
] as const

export function BlogList({ posts }: { posts: BlogMeta[] }) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const query = searchParams.get('q') ?? ''
  const tag = searchParams.get('tag')
  const sort: Sort = searchParams.get('sort') === 'asc' ? 'asc' : 'desc'

  function updateParam(key: string, value: string | null) {
    const next = new URLSearchParams(searchParams.toString())
    if (value) next.set(key, value)
    else next.delete(key)
    const search = next.toString()
    router.replace(search ? `${pathname}?${search}` : pathname, {
      scroll: false,
    })
  }

  const tagCounts = useMemo(() => {
    const counts = new Map<string, number>()
    for (const post of posts) {
      for (const t of post.tags) counts.set(t, (counts.get(t) ?? 0) + 1)
    }
    return [...counts.entries()].sort(
      (a, b) => b[1] - a[1] || a[0].localeCompare(b[0]),
    )
  }, [posts])

  const sorted = useMemo(() => {
    const list = [...posts]
    list.sort((a, b) => {
      const diff = new Date(b.date).getTime() - new Date(a.date).getTime()
      return sort === 'desc' ? diff : -diff
    })
    return list
  }, [posts, sort])

  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim()
    return sorted.filter((post) => {
      if (tag && !post.tags.includes(tag)) return false
      if (!q) return true
      return (
        post.title.toLowerCase().includes(q) ||
        post.description.toLowerCase().includes(q) ||
        post.tags.some((t) => t.toLowerCase().includes(q))
      )
    })
  }, [sorted, query, tag])

  const isFiltered = Boolean(query || tag)
  const leadPost = isFiltered ? null : filtered.find((post) => post.pinned)
  const remainingPosts = isFiltered
    ? filtered
    : filtered.filter((post) => post.slug !== leadPost?.slug)

  return (
    <main className={styles.page} id="main-content">
      <div className={styles.shell}>
        {/* Header */}
        <header className={styles.header}>
          <div className={styles.headerMeta}>
            <span className={styles.pill}>
              <span className={styles.pillDot} />
              02 / DISPATCHES
            </span>
            <span>Field Notes & Engineering Log</span>
            <span>·</span>
            <span>{posts.length} Documented Essays</span>
          </div>

          <div className={styles.headerTitleStack}>
            <ScriptWord text="field notes" className={styles.headerScript} />
            <h1 className={styles.headerTitle}>
              Notes from the build.
              <span className={styles.headerTitleTape}>DEV & OPS</span>
            </h1>
          </div>

          <p className={styles.headerIntro}>
            Frontend architecture, production incident postmortems, and
            deployment infrastructure. Every post here is something that
            actually failed, broke, or required a clean solution in production.
          </p>
        </header>

        {/* Asymmetric 4-column / 8-column grid */}
        <div className={styles.asymmetricGrid}>
          {/* Left Column: Guides & Topic Filters */}
          <aside className={styles.sidebarSticky}>
            {/* Curated Guides */}
            <div className={styles.sidebarCard}>
              <div className={styles.sidebarHead}>
                <span>FIELD GUIDES</span>
                <span>STEP-BY-STEP</span>
              </div>
              <p
                style={{
                  fontSize: '0.8rem',
                  lineHeight: 1.5,
                  color: 'var(--muted)',
                  marginBottom: '1rem',
                }}
              >
                Structured walk-throughs for production deployment and ops:
              </p>
              <div className={styles.guideList}>
                {GUIDES.map((guide) => (
                  <Link
                    key={guide.href}
                    href={guide.href}
                    className={styles.guideCard}
                  >
                    <span className={styles.guideMeta}>
                      {guide.steps} steps
                    </span>
                    <h3 className={styles.guideTitle}>{guide.title}</h3>
                    <p className={styles.guideDesc}>{guide.description}</p>
                  </Link>
                ))}
              </div>
            </div>

            {/* Topic Filter Matrix */}
            <div className={styles.sidebarCard}>
              <div className={styles.sidebarHead}>
                <span>TOPIC INDEX</span>
                <span>{tagCounts.length} TAGS</span>
              </div>
              <div className={styles.tagGrid}>
                <button
                  type="button"
                  className={`${styles.tagChip} ${
                    !tag ? styles.tagChipActive : ''
                  }`}
                  onClick={() => updateParam('tag', null)}
                >
                  <span>All Dispatches</span>
                  <span className={styles.tagChipCount}>({posts.length})</span>
                </button>
                {tagCounts.map(([tagName, count]) => (
                  <button
                    key={tagName}
                    type="button"
                    className={`${styles.tagChip} ${
                      tag === tagName ? styles.tagChipActive : ''
                    }`}
                    onClick={() =>
                      updateParam('tag', tag === tagName ? null : tagName)
                    }
                  >
                    <span>{tagName}</span>
                    <span className={styles.tagChipCount}>({count})</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Editorial Rule Note */}
            <div
              style={{
                padding: '1rem',
                borderRadius: '12px',
                border: '1.5px dashed var(--line)',
                background: 'var(--paper-lo)',
                fontFamily: 'var(--mono)',
                fontSize: '0.7rem',
                lineHeight: 1.5,
                color: 'var(--muted)',
              }}
            >
              <b style={{ color: 'var(--ink)' }}>EDITORIAL CONSTRAINT:</b>
              <br />
              If a post could sit on any generic engineering blog without
              shipped codebase evidence, it gets cut.
            </div>
          </aside>

          {/* Right Column: Search, Lead Story & Posts List */}
          <section className={styles.contentColumn} aria-label="Essays feed">
            {/* Search and Sort Toolbar */}
            <div className={styles.searchBar}>
              <Search size={16} style={{ color: 'var(--muted)' }} />
              <input
                type="search"
                value={query}
                onChange={(e) => updateParam('q', e.target.value || null)}
                placeholder="Search essays by title, keyword, or technology..."
                className={styles.searchInput}
                aria-label="Search articles"
              />
              {query && (
                <button
                  type="button"
                  onClick={() => updateParam('q', null)}
                  className={styles.searchBtn}
                >
                  <X size={12} />
                  Clear
                </button>
              )}
              <button
                type="button"
                onClick={() =>
                  updateParam('sort', sort === 'desc' ? 'asc' : 'desc')
                }
                className={styles.searchBtn}
              >
                <ArrowDownUp size={12} />
                {sort === 'desc' ? 'Newest First' : 'Oldest First'}
              </button>
            </div>

            {/* Lead Pinned Article (if not filtered and exists) */}
            {leadPost && (
              <article className={styles.leadCard}>
                <div className={styles.leadTape} />
                <div className={styles.leadStamp}>
                  <Sparkles size={11} />
                  FEATURED DISPATCH
                </div>

                <Link
                  href={`/blog/${leadPost.slug}`}
                  className={styles.leadTitle}
                >
                  {leadPost.title}
                </Link>

                <p className={styles.leadDesc}>{leadPost.description}</p>

                <div className={styles.leadFooter}>
                  <span>{formatDate(leadPost.date)}</span>
                  <span className={styles.waveform} aria-hidden>
                    {waveformFromReadingTime(leadPost.readingTime).map(
                      (h, i) => (
                        <span
                          key={i}
                          className={styles.waveBar}
                          style={{ height: `${h}%` }}
                        />
                      ),
                    )}
                  </span>
                  <span>{leadPost.readingTime}</span>
                  <ViewCounter slug={leadPost.slug} />
                  <Link
                    href={`/blog/${leadPost.slug}`}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.2rem',
                      color: 'var(--cobalt)',
                      fontWeight: 700,
                      textDecoration: 'none',
                    }}
                  >
                    Read article <ArrowUpRight size={13} />
                  </Link>
                </div>
              </article>
            )}

            {/* Chronological Posts Deck */}
            <div className={styles.postDeck}>
              {remainingPosts.map((post, idx) => (
                <Link
                  key={post.slug}
                  href={`/blog/${post.slug}`}
                  className={styles.postCard}
                >
                  <div className={styles.postCardTop}>
                    <span>
                      DISPATCH {String(idx + 1).padStart(2, '0')} ·{' '}
                      {post.tags.slice(0, 2).join(' / ')}
                    </span>
                    <span>{formatDate(post.date)}</span>
                  </div>

                  <h3 className={styles.postTitle}>{post.title}</h3>
                  <p className={styles.postDesc}>{post.description}</p>

                  <div className={styles.postFooter}>
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                      }}
                    >
                      <span className={styles.waveform} aria-hidden>
                        {waveformFromReadingTime(post.readingTime).map(
                          (h, i) => (
                            <span
                              key={i}
                              className={styles.waveBar}
                              style={{ height: `${h}%` }}
                            />
                          ),
                        )}
                      </span>
                      <span>{post.readingTime}</span>
                    </div>

                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '1rem',
                      }}
                    >
                      <ViewCounter slug={post.slug} />
                      <span
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.2rem',
                          color: 'var(--cobalt)',
                          fontWeight: 700,
                        }}
                      >
                        Read <ArrowUpRight size={12} />
                      </span>
                    </div>
                  </div>
                </Link>
              ))}

              {filtered.length === 0 && (
                <div
                  style={{
                    padding: '3rem 2rem',
                    textAlign: 'center',
                    background: 'var(--paper-hi)',
                    border: '2px dashed var(--ink)',
                    borderRadius: '14px',
                  }}
                >
                  <h3
                    style={{
                      fontFamily: 'var(--display)',
                      fontSize: '1.3rem',
                      fontWeight: 800,
                      marginBottom: '0.5rem',
                    }}
                  >
                    No dispatches match &quot;{query || tag}&quot;
                  </h3>
                  <p
                    style={{
                      fontSize: '0.9rem',
                      color: 'var(--muted)',
                      marginBottom: '1.25rem',
                    }}
                  >
                    Try searching for another topic or clear the active query.
                  </p>
                  <button
                    type="button"
                    onClick={() => router.replace(pathname, { scroll: false })}
                    className={styles.searchBtn}
                  >
                    <RefreshCw size={13} />
                    Reset filters
                  </button>
                </div>
              )}
            </div>

            {/* FAQ Dossier Section */}
            {!isFiltered && (
              <section className={styles.faqSection} aria-labelledby="faq-head">
                <h2 id="faq-head" className={styles.faqHead}>
                  Production Decisions & FAQ
                </h2>
                <div>
                  {BLOG_FAQ.map((faq) => (
                    <details key={faq.question} className={styles.faqItem}>
                      <summary className={styles.faqSummary}>
                        <span>{faq.question}</span>
                        <ChevronRight size={16} />
                      </summary>
                      <p className={styles.faqAnswer}>{faq.answer}</p>
                    </details>
                  ))}
                </div>
              </section>
            )}
          </section>
        </div>
      </div>
    </main>
  )
}
