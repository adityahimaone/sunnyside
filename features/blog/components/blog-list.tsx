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
import layout from '@/features/archive/archive.module.css'
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
    <main className={`${layout.page} ${styles.page}`} id="main-content">
      <div className={layout.container}>
        <header className={styles.hero}>
          <div className={styles.heroCopy}>
            <p className={styles.kicker}>
              <span className={styles.kickerTag}>
                <span className={styles.kickerMark} aria-hidden />
                02 / Field notes
              </span>
              <span className={styles.kickerText}>
                <span className={layout.num}>{posts.length}</span> documented
                essays
              </span>
            </p>

            <ScriptWord text="field notes" className={layout.hand} />

            <h1 className={layout.title}>Notes from the build.</h1>
            <p className={layout.intro}>
              Postmortems, deployment notes and the things that broke in
              production.
            </p>

            <div className={layout.actions}>
              <a href="#dispatches" className={layout.primary}>
                Read the dispatches
                <ArrowUpRight className="size-4" aria-hidden />
              </a>
              <a href="#guides" className={layout.ghost}>
                Field guides
                <ChevronRight className="size-4" aria-hidden />
              </a>
            </div>
          </div>

          {leadPost ? (
            <article className={styles.lead}>
              <span className={styles.leadTape} aria-hidden />
              <p className={styles.leadStamp}>
                <Sparkles size={12} aria-hidden />
                Featured dispatch
              </p>
              <Link
                href={`/blog/${leadPost.slug}`}
                className={styles.leadTitle}
              >
                {leadPost.title}
              </Link>
              <p className={styles.leadDesc}>{leadPost.description}</p>
              <span className={styles.waveform} aria-hidden data-tone="butter">
                {waveformFromReadingTime(leadPost.readingTime).map((h, i) => (
                  <span
                    key={i}
                    className={styles.waveBar}
                    style={{ height: `${h}%` }}
                  />
                ))}
              </span>
              <div className={styles.leadMeta}>
                <span>{formatDate(leadPost.date)}</span>
                <span>{leadPost.readingTime}</span>
                <ViewCounter slug={leadPost.slug} />
              </div>
              <Link href={`/blog/${leadPost.slug}`} className={styles.leadLink}>
                Read the dispatch
                <ArrowUpRight size={13} aria-hidden />
              </Link>
            </article>
          ) : (
            <aside className={styles.filteredCard}>
              <p className={styles.filteredLabel}>Filtered view</p>
              <p className={styles.filteredValue}>
                {query ? `“${query}”` : null}
                {query && tag ? ' in ' : null}
                {tag ? tag : null}
              </p>
              <button
                type="button"
                onClick={() => router.replace(pathname, { scroll: false })}
                className={layout.ghost}
              >
                <RefreshCw size={13} aria-hidden />
                Clear the filters
              </button>
            </aside>
          )}
        </header>

        <section id="dispatches" className={styles.dispatches}>
          <div className={styles.toolbar}>
            <div className={styles.searchBar}>
              <Search size={16} className={styles.searchIcon} aria-hidden />
              <input
                type="search"
                value={query}
                onChange={(e) => updateParam('q', e.target.value || null)}
                placeholder="Search title, keyword or technology"
                className={styles.searchInput}
                aria-label="Search articles"
              />
              {query ? (
                <button
                  type="button"
                  onClick={() => updateParam('q', null)}
                  className={styles.searchClear}
                  aria-label="Clear search"
                >
                  <X size={14} aria-hidden />
                </button>
              ) : null}
            </div>

            <button
              type="button"
              onClick={() =>
                updateParam('sort', sort === 'desc' ? 'asc' : 'desc')
              }
              className={styles.sortButton}
            >
              <ArrowDownUp size={14} aria-hidden />
              {sort === 'desc' ? 'Newest first' : 'Oldest first'}
            </button>
          </div>

          <div
            className={styles.tagRail}
            role="group"
            aria-label="Filter dispatches by topic"
          >
            <button
              type="button"
              className={styles.tagChip}
              data-active={!tag}
              onClick={() => updateParam('tag', null)}
            >
              <span>All dispatches</span>
              <span className={styles.tagCount}>({posts.length})</span>
            </button>
            {tagCounts.map(([tagName, count]) => (
              <button
                key={tagName}
                type="button"
                className={styles.tagChip}
                data-active={tag === tagName}
                onClick={() =>
                  updateParam('tag', tag === tagName ? null : tagName)
                }
              >
                <span>{tagName}</span>
                <span className={styles.tagCount}>({count})</span>
              </button>
            ))}
          </div>

          <p className={styles.editorNote}>
            If a post could sit on any generic engineering blog without shipped
            codebase evidence, it gets cut.
          </p>

          <div className={styles.listHead}>
            <h2 className={styles.listTitle}>The dispatches</h2>
            <p className={styles.listCount}>
              <span className={layout.num}>{filtered.length}</span> shown
              {isFiltered ? ' after filters' : ''}
            </p>
          </div>

          <div className={styles.postList}>
            {remainingPosts.map((post, idx) => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className={styles.postRow}
              >
                <span className={styles.postIndex}>
                  {String(idx + 1).padStart(2, '0')}
                </span>

                <span className={styles.postBody}>
                  <span className={styles.postTopics}>
                    {post.tags.slice(0, 2).map((t) => (
                      <span key={t} className={styles.postTopic}>
                        {t}
                      </span>
                    ))}
                  </span>

                  <span className={styles.postTitle}>{post.title}</span>
                  <span className={styles.postDesc}>{post.description}</span>

                  <span className={styles.postMeta}>
                    <span>{formatDate(post.date)}</span>
                    <span>{post.readingTime}</span>
                    <ViewCounter slug={post.slug} />
                  </span>
                </span>

                <span className={styles.postWave} aria-hidden>
                  {waveformFromReadingTime(post.readingTime).map((h, i) => (
                    <span
                      key={i}
                      className={styles.waveBar}
                      style={{ height: `${h}%` }}
                    />
                  ))}
                </span>
              </Link>
            ))}
          </div>

          {filtered.length === 0 ? (
            <div className={styles.empty}>
              <h3 className={styles.emptyTitle}>
                No dispatches match “{query || tag}”
              </h3>
              <p className={styles.emptyNote}>
                Try another topic, or clear the active query.
              </p>
              <button
                type="button"
                onClick={() => router.replace(pathname, { scroll: false })}
                className={layout.ghost}
              >
                <RefreshCw size={13} aria-hidden />
                Reset the filters
              </button>
            </div>
          ) : null}
        </section>

        <section
          id="guides"
          className={styles.guides}
          aria-labelledby="guides-title"
        >
          <div className={layout.sectionHead}>
            <h2 id="guides-title" className={layout.sectionTitle}>
              Field guides
            </h2>
            <p className={layout.sectionNote}>Step-by-step walkthroughs</p>
          </div>

          <div className={styles.guideGrid}>
            {GUIDES.map((guide) => (
              <Link
                key={guide.href}
                href={guide.href}
                className={styles.guideCard}
              >
                <span className={styles.guideMeta}>
                  <span className={layout.num}>{guide.steps}</span> steps
                </span>
                <h3 className={styles.guideTitle}>{guide.title}</h3>
                <p className={styles.guideDesc}>{guide.description}</p>
                <span className={styles.guideLink}>
                  Open the guide
                  <ArrowUpRight size={13} aria-hidden />
                </span>
              </Link>
            ))}
          </div>
        </section>

        {!isFiltered ? (
          <section className={styles.faq} aria-labelledby="faq-head">
            <h2 id="faq-head" className={styles.faqHead}>
              Production decisions and FAQ
            </h2>
            <div className={styles.faqList}>
              {BLOG_FAQ.map((faq) => (
                <details key={faq.question} className={styles.faqItem}>
                  <summary className={styles.faqSummary}>
                    <span>{faq.question}</span>
                    <ChevronRight size={16} aria-hidden />
                  </summary>
                  <p className={styles.faqAnswer}>{faq.answer}</p>
                </details>
              ))}
            </div>
          </section>
        ) : null}
      </div>
    </main>
  )
}
