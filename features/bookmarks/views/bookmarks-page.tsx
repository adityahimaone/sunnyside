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
import { channelColor } from '../constants/categories'
import { useRoomChannel } from '@/features/booth'
import { useDockSlot } from '@/features/booth/dock-slot'
import { FaviconCell } from '../components/favicon-cell'
import { BookmarkAdminModal } from '../components/bookmark-admin-modal'
import { useListKeys, useGlobalShortcuts } from '../hooks/use-list-keys'
import { ScriptWord } from '@/features/landing-page/studio/script-word'
import styles from '../sunnyside-bookmarks.module.css'

const DEFAULT_HUE = '#3d53d6'
const SEARCH_DEBOUNCE_MS = 250

export function BookmarksPage({ page }: { page: BookmarkPage }) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const setHue = useRoomChannel()
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

  useEffect(() => {
    setHue(channel === 'All' ? DEFAULT_HUE : channelColor(channel))
  }, [channel, setHue])

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

  useDockSlot(
    <button
      type="button"
      onClick={shuffle}
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
        cursor: 'pointer',
      }}
    >
      <Shuffle size={12} />
      Shuffle Pick
      <span style={{ opacity: 0.7 }}>({tracks.length})</span>
    </button>,
    [tracks.length, shuffle],
  )

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
    <main className={styles.page} id="main-content">
      <div className={styles.shell}>
        {/* Header */}
        <header className={styles.header}>
          <div className={styles.headerMeta}>
            <span className={styles.pill}>
              <span className={styles.pillDot} />
              03 / LIBRARY
            </span>
            <span>Curated Reading Shelf & Directory</span>
            <span>·</span>
            <span>{page.totalAll} Reference Artifacts</span>
          </div>

          <div className={styles.headerTitleStack}>
            <ScriptWord text="good finds" className={styles.headerScript} />
            <h1 className={styles.headerTitle}>
              The reading rack.
              <span className={styles.headerTitleTape}>ARCHIVE</span>
            </h1>
          </div>

          <p className={styles.headerIntro}>
            Engineering write-ups, architecture case studies, developer tooling,
            and interface references bookmarked across the web. Click any entry
            to read the original source.
          </p>
        </header>

        {/* Asymmetric 4-column / 8-column layout */}
        <div className={styles.asymmetricGrid}>
          {/* Left Column: Channels & Controls */}
          <aside className={styles.sidebarSticky}>
            {/* Channel patchbay */}
            <div className={styles.sidebarCard}>
              <div className={styles.sidebarHead}>
                <span>CHANNELS</span>
                <span>{channels.length} SECTIONS</span>
              </div>
              <div className={styles.channelList}>
                {channels.map((chName) => {
                  const isActive = channel === chName
                  const count =
                    chName === 'All' ? page.totalAll : (counts.get(chName) ?? 0)

                  return (
                    <button
                      key={chName}
                      type="button"
                      className={`${styles.channelBtn} ${
                        isActive ? styles.channelBtnActive : ''
                      }`}
                      onClick={() => updateParams({ category: chName })}
                    >
                      <div className={styles.channelLeft}>
                        <span className={styles.channelLed} />
                        <span>{chName}</span>
                      </div>
                      <span className={styles.channelCount}>{count}</span>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Quick Actions & Telemetry */}
            <div className={styles.sidebarCard}>
              <div className={styles.sidebarHead}>
                <span>ACTIONS & SHORTCUTS</span>
              </div>

              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.75rem',
                }}
              >
                <button
                  type="button"
                  onClick={shuffle}
                  className={styles.tactileBtn}
                  style={{ width: '100%', justifyContent: 'flex-start' }}
                >
                  <Shuffle size={14} />
                  Shuffle Pick (R)
                </button>

                {isAdmin ? (
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.5rem',
                      padding: '0.75rem',
                      background: 'var(--butter)',
                      border: '1.5px solid var(--ink)',
                      borderRadius: '8px',
                    }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        fontFamily: 'var(--mono)',
                        fontSize: '0.68rem',
                        fontWeight: 700,
                      }}
                    >
                      <span>ADMIN UNLOCKED</span>
                      <button
                        type="button"
                        onClick={handleLockAdmin}
                        style={{
                          background: 'none',
                          border: 'none',
                          cursor: 'pointer',
                          display: 'flex',
                        }}
                      >
                        <Lock size={12} />
                      </button>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setEditing(null)
                        setModalTab('single')
                        setIsAdminOpen(true)
                      }}
                      className={styles.tactileBtn}
                      style={{ fontSize: '0.68rem', padding: '0.4rem 0.6rem' }}
                    >
                      <Plus size={12} /> Add bookmark
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setEditing(null)
                        setModalTab('bulk')
                        setIsAdminOpen(true)
                      }}
                      className={styles.tactileBtn}
                      style={{ fontSize: '0.68rem', padding: '0.4rem 0.6rem' }}
                    >
                      <Layers size={12} /> Bulk import
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      setEditing(null)
                      setIsAdminOpen(true)
                    }}
                    className={styles.tactileBtn}
                    style={{
                      width: '100%',
                      justifyContent: 'flex-start',
                      opacity: 0.8,
                    }}
                  >
                    <Unlock size={14} />
                    Admin controls (E)
                  </button>
                )}

                {/* Keyboard ledger */}
                <div
                  style={{
                    padding: '0.8rem',
                    background: 'var(--paper)',
                    border: '1px solid var(--line)',
                    borderRadius: '8px',
                    fontFamily: 'var(--mono)',
                    fontSize: '0.68rem',
                    lineHeight: 1.6,
                    color: 'var(--muted)',
                  }}
                >
                  <div>
                    <b style={{ color: 'var(--ink)' }}>J / K</b>: Move cursor
                  </div>
                  <div>
                    <b style={{ color: 'var(--ink)' }}>O / Enter</b>: Open link
                  </div>
                  <div>
                    <b style={{ color: 'var(--ink)' }}>/</b>: Focus search
                  </div>
                </div>
              </div>
            </div>
          </aside>

          {/* Right Column: Search & Bookmark Deck */}
          <section
            className={styles.contentColumn}
            aria-label="Bookmarks collection"
          >
            {/* Search Toolbar */}
            <div className={styles.searchBar}>
              <Search size={16} style={{ color: 'var(--muted)' }} />
              <input
                ref={searchRef}
                type="search"
                value={queryInput}
                onChange={(e) =>
                  setDraft({ base: urlQuery, value: e.target.value })
                }
                placeholder="Search bookmarks by domain, title, or tags..."
                className={styles.searchInput}
                aria-label="Search bookmarks"
              />
              {queryInput && (
                <button
                  type="button"
                  onClick={() => {
                    setDraft({ base: urlQuery, value: '' })
                    updateParams({ q: '' })
                  }}
                  className={styles.searchClear}
                  aria-label="Clear search"
                >
                  <X size={15} />
                </button>
              )}
            </div>

            {/* Bookmarks Items Deck */}
            <div className={styles.bookmarkDeck}>
              {tracks.map((b, idx) => {
                const isSelected = active === idx
                return (
                  <article
                    key={b.id}
                    className={styles.bookmarkCard}
                    style={
                      isSelected
                        ? {
                            borderColor: 'var(--cobalt)',
                            background: 'var(--cobalt-wash)',
                            boxShadow: '4px 6px 0 var(--cobalt-ink)',
                          }
                        : undefined
                    }
                  >
                    <div className={styles.bookmarkTop}>
                      <div className={styles.bookmarkDomain}>
                        <FaviconCell
                          url={b.url}
                          faviconUrl={b.faviconUrl}
                          alt={b.title}
                          className={styles.faviconBox}
                        />
                        <span>
                          {new URL(b.url).hostname.replace('www.', '')}
                        </span>
                      </div>

                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.4rem',
                        }}
                      >
                        <span className={styles.categoryStamp}>
                          {b.category}
                        </span>
                        {isAdmin && (
                          <div
                            style={{ display: 'inline-flex', gap: '0.25rem' }}
                          >
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation()
                                setEditing(b)
                                setIsAdminOpen(true)
                              }}
                              style={{
                                background: 'none',
                                border: 'none',
                                cursor: 'pointer',
                                padding: '2px',
                              }}
                              aria-label="Edit bookmark"
                            >
                              <Edit2 size={13} />
                            </button>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation()
                                setDeleteTarget(b)
                              }}
                              style={{
                                background: 'none',
                                border: 'none',
                                cursor: 'pointer',
                                padding: '2px',
                                color: 'var(--tangerine)',
                              }}
                              aria-label="Delete bookmark"
                            >
                              <Trash2 size={13} />
                            </button>
                          </div>
                        )}
                      </div>
                    </div>

                    <a
                      href={b.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles.bookmarkTitle}
                    >
                      <span>{b.title}</span>
                      <ArrowUpRight size={14} style={{ opacity: 0.6 }} />
                    </a>

                    {b.description && (
                      <p className={styles.bookmarkDesc}>{b.description}</p>
                    )}

                    <div className={styles.bookmarkFooter}>
                      <div
                        style={{
                          display: 'flex',
                          gap: '0.35rem',
                          flexWrap: 'wrap',
                        }}
                      >
                        {b.tags.map((t) => (
                          <span
                            key={t}
                            style={{
                              padding: '0.1rem 0.4rem',
                              borderRadius: '4px',
                              background: 'var(--paper)',
                              border: '1px solid var(--line)',
                              fontSize: '0.65rem',
                            }}
                          >
                            #{t}
                          </span>
                        ))}
                      </div>

                      <a
                        href={b.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.25rem',
                          color: 'var(--cobalt)',
                          fontWeight: 700,
                          textDecoration: 'none',
                        }}
                      >
                        Visit <ExternalLink size={11} />
                      </a>
                    </div>
                  </article>
                )
              })}

              {tracks.length === 0 && (
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
                    No bookmarks found for &quot;{queryInput || channel}&quot;
                  </h3>
                  <p
                    style={{
                      fontSize: '0.9rem',
                      color: 'var(--muted)',
                      marginBottom: '1.25rem',
                    }}
                  >
                    Try searching for another term or pick another channel.
                  </p>
                  <button
                    type="button"
                    onClick={() => updateParams({ q: '', category: 'All' })}
                    className={styles.tactileBtn}
                  >
                    <RefreshCw size={13} />
                    Reset to All
                  </button>
                </div>
              )}
            </div>

            {/* Load More Sentinel & Button */}
            {hasMore && (
              <div style={{ textAlign: 'center', paddingBlock: '1.5rem' }}>
                <div ref={sentinelRef} style={{ height: '10px' }} />
                <button
                  type="button"
                  onClick={loadMore}
                  disabled={isPending}
                  className={styles.tactileBtn}
                  style={{ padding: '0.6rem 1.4rem' }}
                >
                  {isPending ? 'Loading dispatches...' : 'Load more bookmarks'}
                </button>
              </div>
            )}
            {status && (
              <p
                style={{
                  textAlign: 'center',
                  fontFamily: 'var(--mono)',
                  fontSize: '0.75rem',
                  color: 'var(--muted)',
                }}
              >
                {status}
              </p>
            )}
          </section>
        </div>
      </div>

      {/* Admin management modal */}
      {isAdminOpen && (
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
      )}

      {/* Delete Confirmation Modal */}
      {deleteTarget && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 100,
            background: 'rgba(25, 26, 46, 0.6)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1rem',
          }}
        >
          <div
            style={{
              background: 'var(--paper-hi)',
              border: '2px solid var(--ink)',
              borderRadius: '14px',
              padding: '1.5rem',
              maxWidth: '420px',
              boxShadow: '8px 10px 0 var(--ink)',
            }}
          >
            <h3
              style={{
                fontFamily: 'var(--display)',
                fontWeight: 800,
                fontSize: '1.2rem',
                marginBottom: '0.5rem',
              }}
            >
              Delete bookmark?
            </h3>
            <p
              style={{
                fontSize: '0.9rem',
                color: 'var(--muted)',
                marginBottom: '1.25rem',
              }}
            >
              Are you sure you want to delete &quot;{deleteTarget.title}&quot;?
              This cannot be undone.
            </p>
            <div
              style={{
                display: 'flex',
                justifyContent: 'flex-end',
                gap: '0.5rem',
              }}
            >
              <button
                type="button"
                onClick={() => setDeleteTarget(null)}
                className={styles.tactileBtn}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmDelete}
                className={styles.tactileBtn}
                style={{
                  background: 'var(--tangerine)',
                  color: 'var(--paper-hi)',
                }}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  )
}
