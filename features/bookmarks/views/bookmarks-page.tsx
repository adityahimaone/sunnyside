'use client'

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  useTransition,
} from 'react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import {
  ArrowUpRight,
  Edit2,
  ExternalLink,
  Layers,
  Lock,
  Plus,
  RefreshCw,
  Search,
  Shuffle,
  Trash2,
  Unlock,
  X,
} from 'lucide-react'
import type { Bookmark, BookmarkFormData } from '../types'
import type { BookmarkPage } from '../lib/bookmarks'
import { FaviconCell } from '../components/favicon-cell'
import { BookmarkAdminModal } from '../components/bookmark-admin-modal'
import { useListKeys, useGlobalShortcuts } from '../hooks/use-list-keys'
import { ScriptWord } from '@/features/landing-page/studio/script-word'
import layout from '@/features/archive/archive.module.css'
import styles from '../sunnyside-bookmarks.module.css'

const SEARCH_DEBOUNCE_MS = 250

export function BookmarksPage({ page }: { page: BookmarkPage }) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [isPending, startTransition] = useTransition()

  const [isAdmin, setIsAdmin] = useState(false)
  const [isAdminOpen, setIsAdminOpen] = useState(false)
  const [modalTab, setModalTab] = useState<'single' | 'bulk'>('single')
  const [editing, setEditing] = useState<Bookmark | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<Bookmark | null>(null)
  const [status, setStatus] = useState('')

  useEffect(() => {
    fetch('/api/bookmarks?check_auth=1')
      .then((r) => r.json())
      .then((data) => {
        if (data.authenticated) setIsAdmin(true)
      })
      .catch(() => {})
  }, [])

  useEffect(() => {
    const isAdminQuery =
      searchParams.get('admin') === '1' ||
      (typeof window !== 'undefined' &&
        new URLSearchParams(window.location.search).get('admin') === '1')

    if (isAdminQuery) {
      queueMicrotask(() => setIsAdmin(true))
      fetch('/api/bookmarks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'activate_admin' }),
      }).catch(() => {})
    }
  }, [searchParams])

  const channel = searchParams.get('category') ?? 'All'
  const urlQuery = searchParams.get('q') ?? ''
  const searchRef = useRef<HTMLInputElement>(null)

  const filterKey = `${channel}::${urlQuery}`

  const [accumulated, setAccumulated] = useState<{
    key: string
    pages: Bookmark[][]
  }>({ key: filterKey, pages: [page.items] })

  const loaded = useMemo(
    () =>
      accumulated.key === filterKey
        ? accumulated
        : { key: filterKey, pages: [page.items] },
    [accumulated, filterKey, page.items],
  )

  const tracks = useMemo(() => loaded.pages.flat(), [loaded])

  const highestPage = Math.max(loaded.pages.length, page.page)
  const hasMore = highestPage < page.pageCount
  const nextPage = highestPage + 1

  const [draft, setDraft] = useState({ base: urlQuery, value: urlQuery })
  const queryInput = draft.base === urlQuery ? draft.value : urlQuery

  function updateParams(next: { q?: string; category?: string }) {
    const params = new URLSearchParams(searchParams.toString())
    if (next.q !== undefined) {
      if (next.q) params.set('q', next.q)
      else params.delete('q')
    }
    if (next.category !== undefined) {
      if (next.category && next.category !== 'All') {
        params.set('category', next.category)
      } else {
        params.delete('category')
      }
    }
    params.delete('page')
    const search = params.toString()
    startTransition(() => {
      router.push(search ? `${pathname}?${search}` : pathname, {
        scroll: false,
      })
    })
  }

  useEffect(() => {
    if (queryInput === urlQuery) return
    const timer = setTimeout(
      () => updateParams({ q: queryInput }),
      SEARCH_DEBOUNCE_MS,
    )
    return () => clearTimeout(timer)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [queryInput])

  const channels = useMemo(
    () => ['All', ...page.facets.map((facet) => facet.name)],
    [page.facets],
  )

  const counts = useMemo(() => {
    const map = new Map<string, number>()
    for (const facet of page.facets) map.set(facet.name, facet.count)
    return map
  }, [page.facets])

  const { active } = useListKeys(
    tracks.length,
    (index) => {
      const target = tracks[index]
      if (target) window.open(target.url, '_blank', 'noopener,noreferrer')
    },
    filterKey,
  )

  const loadingRef = useRef<{ key: string } | null>(null)

  const loadMore = useCallback(() => {
    if (loadingRef.current || !hasMore) return
    loadingRef.current = { key: filterKey }

    const params = new URLSearchParams()
    if (urlQuery) params.set('q', urlQuery)
    if (channel !== 'All') params.set('category', channel)
    params.set('page', String(nextPage))

    setStatus('')
    startTransition(async () => {
      try {
        const res = await fetch(`/api/bookmarks?${params.toString()}`)
        const data = await res.json()
        if (!data.success || !Array.isArray(data.bookmarks)) {
          setStatus('Could not load more links. Try again in a moment.')
          return
        }
        if (data.bookmarks.length === 0) {
          setStatus('That is the whole library.')
          return
        }
        setAccumulated((prev) =>
          prev.key === filterKey
            ? { key: filterKey, pages: [...prev.pages, data.bookmarks] }
            : { key: filterKey, pages: [page.items, data.bookmarks] },
        )
      } catch {
        setStatus('Could not reach the bookmarks API.')
      } finally {
        if (loadingRef.current?.key === filterKey) loadingRef.current = null
      }
    })
  }, [hasMore, filterKey, nextPage, urlQuery, channel, page.items])

  const sentinelRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const sentinel = sentinelRef.current
    if (!sentinel || !hasMore) return

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) loadMore()
      },
      { rootMargin: '600px 0px' },
    )

    observer.observe(sentinel)
    return () => observer.disconnect()
  }, [hasMore, loadMore])

  useEffect(() => {
    loadingRef.current = null
  }, [filterKey])

  const shuffle = useCallback(() => {
    if (tracks.length === 0) return
    const pick = tracks[Math.floor(Math.random() * tracks.length)]
    window.open(pick.url, '_blank', 'noopener,noreferrer')
  }, [tracks])

  useGlobalShortcuts(
    useMemo(
      () => (key: string) => {
        if (key === '/') searchRef.current?.focus()
        else if (key === 'r') shuffle()
        else if (key === 'e') {
          setEditing(null)
          setIsAdminOpen(true)
        }
      },
      [shuffle],
    ),
  )

  function patchRow(id: string, update: (row: Bookmark) => Bookmark) {
    setAccumulated((prev) =>
      prev.key === filterKey
        ? {
            key: prev.key,
            pages: prev.pages.map((rows) =>
              rows.map((row) => (row.id === id ? update(row) : row)),
            ),
          }
        : prev,
    )
  }

  function removeRow(id: string) {
    setAccumulated((prev) =>
      prev.key === filterKey
        ? {
            key: prev.key,
            pages: prev.pages
              .map((rows) => rows.filter((row) => row.id !== id))
              .filter((rows) => rows.length > 0),
          }
        : prev,
    )
  }

  async function confirmDelete() {
    if (!deleteTarget) return
    try {
      const res = await fetch(`/api/bookmarks?id=${deleteTarget.id}`, {
        method: 'DELETE',
        headers: { 'x-admin-param': '1' },
      })
      const data = await res.json()
      if (data.success) {
        removeRow(deleteTarget.id)
        setDeleteTarget(null)
        startTransition(() => {
          router.refresh()
        })
      } else {
        setStatus(data.message || 'Could not delete that bookmark')
      }
    } catch {
      setStatus('Could not reach the bookmarks API')
    }
  }

  async function handleLockAdmin() {
    try {
      await fetch('/api/bookmarks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'logout' }),
      })
    } catch {}
    setIsAdmin(false)
    setIsAdminOpen(false)
  }

  async function saveBookmark(
    formData: BookmarkFormData,
    id?: string,
  ): Promise<boolean> {
    try {
      const res = await fetch('/api/bookmarks', {
        method: id ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-param': '1',
        },
        body: JSON.stringify(id ? { ...formData, id } : formData),
      })
      const data = await res.json()
      if (data.success && data.bookmark) {
        if (id) {
          patchRow(id, () => data.bookmark)
        } else {
          setAccumulated((prev) => ({
            ...prev,
            pages: [[data.bookmark, ...prev.pages[0]], ...prev.pages.slice(1)],
          }))
        }
        startTransition(() => {
          router.refresh()
        })
        return true
      }
      return false
    } catch {
      return false
    }
  }

  return (
    <main className={`${layout.page} ${styles.page}`} id="main-content">
      <div className={layout.container}>
        <header className={styles.hero}>
          <div className={styles.heroCopy}>
            <p className={styles.kicker}>
              <span className={styles.kickerTag}>
                <span className={styles.kickerMark} aria-hidden />
                03 / The crate
              </span>
              <span className={styles.kickerText}>
                <span className={layout.num}>{page.totalAll}</span> links,{' '}
                <span className={layout.num}>{channels.length - 1}</span>{' '}
                categories
              </span>
            </p>

            <ScriptWord text="good finds" className={layout.hand} />

            <h1 className={layout.title}>The reading rack.</h1>
            <p className={layout.intro}>
              Engineering write-ups, tools and interface references, kept in one
              crate.
            </p>
          </div>

          <div className={styles.heroTools}>
            <label htmlFor="crate-search" className={styles.searchLabel}>
              Search the crate
            </label>
            <div className={styles.searchBar}>
              <Search size={17} className={styles.searchIcon} aria-hidden />
              <input
                ref={searchRef}
                id="crate-search"
                type="search"
                value={queryInput}
                onChange={(e) =>
                  setDraft({ base: urlQuery, value: e.target.value })
                }
                placeholder="Title, domain, tag"
                className={styles.searchInput}
                aria-label="Search bookmarks"
              />
              {queryInput ? (
                <button
                  type="button"
                  onClick={() => {
                    setDraft({ base: urlQuery, value: '' })
                    updateParams({ q: '' })
                  }}
                  className={styles.searchClear}
                  aria-label="Clear search"
                >
                  <X size={15} aria-hidden />
                </button>
              ) : null}
            </div>

            <div className={styles.heroActions}>
              <button
                type="button"
                onClick={shuffle}
                className={styles.shuffleButton}
              >
                <Shuffle size={15} aria-hidden />
                Shuffle a pick
                <kbd className={styles.kbd}>R</kbd>
              </button>
              <span className={styles.heroHint}>
                <kbd className={styles.kbd}>/</kbd> to search
              </span>
            </div>
          </div>
        </header>

        <div className={styles.layout}>
          <aside className={styles.index} aria-label="Crate filters">
            <div className={styles.indexCard}>
              <p className={styles.indexTitle}>Categories</p>
              <div className={styles.channelList}>
                {channels.map((chName) => {
                  const isActive = channel === chName
                  const count =
                    chName === 'All' ? page.totalAll : (counts.get(chName) ?? 0)
                  return (
                    <button
                      key={chName}
                      type="button"
                      className={styles.channel}
                      data-active={isActive}
                      onClick={() => updateParams({ category: chName })}
                    >
                      <span>{chName}</span>
                      <span className={styles.channelCount}>{count}</span>
                    </button>
                  )
                })}
              </div>
            </div>

            <div className={styles.indexCard}>
              <p className={styles.indexTitle}>Admin</p>
              {isAdmin ? (
                <div className={styles.adminBox}>
                  <p className={styles.adminHead}>
                    <span>Admin is on</span>
                    <button
                      type="button"
                      onClick={handleLockAdmin}
                      className={styles.lockButton}
                      aria-label="Lock admin controls"
                    >
                      <Lock size={13} aria-hidden />
                    </button>
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setEditing(null)
                      setModalTab('single')
                      setIsAdminOpen(true)
                    }}
                    className={styles.adminAction}
                  >
                    <Plus size={13} aria-hidden />
                    Add a bookmark
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setEditing(null)
                      setModalTab('bulk')
                      setIsAdminOpen(true)
                    }}
                    className={styles.adminAction}
                  >
                    <Layers size={13} aria-hidden />
                    Bulk import
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    setEditing(null)
                    setIsAdminOpen(true)
                  }}
                  className={styles.adminOpen}
                >
                  <Unlock size={14} aria-hidden />
                  Admin controls
                  <kbd className={styles.kbd}>E</kbd>
                </button>
              )}
            </div>

            <div className={styles.shortcuts}>
              <p className={styles.indexTitle}>Keys</p>
              <ul className={styles.shortcutList}>
                <li>
                  <kbd className={styles.kbd}>J</kbd>
                  <kbd className={styles.kbd}>K</kbd>
                  <span>move</span>
                </li>
                <li>
                  <kbd className={styles.kbd}>O</kbd>
                  <span>open</span>
                </li>
                <li>
                  <kbd className={styles.kbd}>/</kbd>
                  <span>search</span>
                </li>
              </ul>
            </div>
          </aside>

          <section className={styles.list} aria-label="Bookmarks">
            <div className={styles.listHead}>
              <h2 className={styles.listTitle}>The crate</h2>
              <p className={styles.listCount}>
                <span className={layout.num}>{tracks.length}</span> of{' '}
                <span className={layout.num}>{page.total}</span> shown
              </p>
            </div>

            <div className={styles.deck}>
              {tracks.map((b, idx) => {
                const isSelected = active === idx
                return (
                  <article
                    key={b.id}
                    className={styles.row}
                    data-active={isSelected}
                  >
                    <div className={styles.rowMain}>
                      <FaviconCell
                        url={b.url}
                        faviconUrl={b.faviconUrl}
                        alt={b.title}
                        className={styles.faviconBox}
                      />

                      <div className={styles.rowBody}>
                        <div className={styles.rowTop}>
                          <a
                            href={b.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={styles.rowTitle}
                          >
                            {b.title}
                            <ArrowUpRight size={14} aria-hidden />
                          </a>
                          <span className={styles.rowDomain}>
                            {new URL(b.url).hostname.replace('www.', '')}
                          </span>
                        </div>

                        {b.description ? (
                          <p className={styles.rowDesc}>{b.description}</p>
                        ) : null}

                        {b.tags.length > 0 ? (
                          <p className={styles.rowTags}>
                            {[...new Set(b.tags)].map((t) => (
                              <span key={t} className={styles.tag}>
                                {t}
                              </span>
                            ))}
                          </p>
                        ) : null}
                      </div>
                    </div>

                    <div className={styles.rowSide}>
                      <span className={styles.category}>{b.category}</span>

                      <a
                        href={b.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={styles.visit}
                      >
                        Visit
                        <ExternalLink size={11} aria-hidden />
                      </a>

                      {isAdmin ? (
                        <span className={styles.rowAdmin}>
                          <button
                            type="button"
                            onClick={() => {
                              setEditing(b)
                              setIsAdminOpen(true)
                            }}
                            className={styles.iconButton}
                            aria-label={`Edit ${b.title}`}
                          >
                            <Edit2 size={13} aria-hidden />
                          </button>
                          <button
                            type="button"
                            onClick={() => setDeleteTarget(b)}
                            className={`${styles.iconButton} ${styles.iconDanger}`}
                            aria-label={`Delete ${b.title}`}
                          >
                            <Trash2 size={13} aria-hidden />
                          </button>
                        </span>
                      ) : null}
                    </div>
                  </article>
                )
              })}

              {tracks.length === 0 ? (
                <div className={styles.empty}>
                  <h3 className={styles.emptyTitle}>
                    No bookmarks for “{queryInput || channel}”
                  </h3>
                  <p className={styles.emptyNote}>
                    Try another word, or go back to every category.
                  </p>
                  <button
                    type="button"
                    onClick={() => updateParams({ q: '', category: 'All' })}
                    className={layout.ghost}
                  >
                    <RefreshCw size={13} aria-hidden />
                    Reset the filters
                  </button>
                </div>
              ) : null}
            </div>

            {hasMore ? (
              <div className={styles.loadMoreWrap}>
                <div ref={sentinelRef} className={styles.sentinel} />
                <button
                  type="button"
                  onClick={loadMore}
                  disabled={isPending}
                  className={styles.loadMore}
                >
                  {isPending ? 'Loading the next drawer…' : 'Load more links'}
                </button>
              </div>
            ) : null}
            {status ? (
              <p className={styles.status} role="status">
                {status}
              </p>
            ) : null}
          </section>
        </div>
      </div>

      {isAdminOpen ? (
        <BookmarkAdminModal
          isOpen={isAdminOpen}
          onClose={() => setIsAdminOpen(false)}
          isAdmin={isAdmin}
          onLoginSuccess={() => setIsAdmin(true)}
          initialTab={modalTab}
          editingBookmark={editing}
          onSaveBookmark={saveBookmark}
          onSaveBulkBookmarks={async (items) => {
            try {
              const res = await fetch('/api/bookmarks', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  'x-admin-param': '1',
                },
                body: JSON.stringify({ action: 'bulk', bookmarks: items }),
              })
              const data = await res.json()
              if (data.success) {
                startTransition(() => router.refresh())
                return { success: true, count: data.count || items.length }
              }
              return { success: false, count: 0, error: data.error }
            } catch {
              return { success: false, count: 0, error: 'Network error' }
            }
          }}
        />
      ) : null}

      {deleteTarget ? (
        <div className={styles.modalBackdrop} role="presentation">
          <div
            className={styles.modalCard}
            role="dialog"
            aria-modal="true"
            aria-labelledby="delete-bookmark-title"
          >
            <h3 id="delete-bookmark-title" className={styles.modalTitle}>
              Delete bookmark?
            </h3>
            <p className={styles.modalNote}>
              “{deleteTarget.title}” will leave the crate. This cannot be
              undone.
            </p>
            <div className={styles.modalActions}>
              <button
                type="button"
                onClick={() => setDeleteTarget(null)}
                className={layout.ghost}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmDelete}
                className={styles.dangerButton}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </main>
  )
}
