'use client'

import { useState, useEffect, useMemo, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import {
  ArrowUpRight,
  Check,
  Copy,
  Edit2,
  ExternalLink,
  Layers,
  Lock,
  Plus,
  RefreshCw,
  Search,
  Terminal,
  Trash2,
  Unlock,
  X,
} from 'lucide-react'
import {
  SKILLS_SOURCE,
  installCommand,
  skillUrl,
  type RecommendedSkill,
  type SkillTag,
  type SkillsCatalog,
} from '../constants/catalogue'
import { SkillAdminModal } from '../components/skill-admin-modal'
import type { BulkSkillInput } from '../utils/bulk-parser'
import { ScriptWord } from '@/features/landing-page/studio/script-word'
import styles from '../sunnyside-skills.module.css'

interface SkillsPageProps {
  initialCatalog: SkillsCatalog
}

function SkillsPageContent({ initialCatalog }: SkillsPageProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [catalog, setCatalog] = useState<SkillsCatalog>(initialCatalog)
  const [query, setQuery] = useState('')
  const [activeTags, setActiveTags] = useState<string[]>([])

  const [isAdmin, setIsAdmin] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [modalTab, setModalTab] = useState<'single' | 'bulk'>('single')
  const [editingSkill, setEditingSkill] = useState<RecommendedSkill | null>(
    null,
  )
  const [deleteTarget, setDeleteTarget] = useState<RecommendedSkill | null>(
    null,
  )
  const [isDeleting, setIsDeleting] = useState(false)
  const [copiedSkill, setCopiedSkill] = useState<string | null>(null)

  const tagsBySlug = useMemo(() => {
    const map = new Map<string, SkillTag>()
    for (const tag of catalog.tags) map.set(tag.slug, tag)
    return map
  }, [catalog.tags])

  const tagCounts = useMemo(() => {
    const counts = new Map<string, number>()
    for (const skill of catalog.skills) {
      for (const tag of skill.tags) {
        counts.set(tag, (counts.get(tag) ?? 0) + 1)
      }
    }
    return counts
  }, [catalog.skills])

  const totalSkills = catalog.skills.length
  const totalInstalled = useMemo(
    () => catalog.skills.filter((skill) => skill.installed).length,
    [catalog.skills],
  )

  const visibleSkills = useMemo(() => {
    const needle = query.trim().toLowerCase()
    return catalog.skills.filter((skill) => {
      if (activeTags.some((tag) => !skill.tags.includes(tag))) return false
      if (!needle) return true
      return (
        skill.name.toLowerCase().includes(needle) ||
        skill.repo.toLowerCase().includes(needle) ||
        skill.description.toLowerCase().includes(needle)
      )
    })
  }, [catalog.skills, activeTags, query])

  useEffect(() => {
    const adminParam =
      searchParams.get('admin') === '1' ||
      (typeof window !== 'undefined' &&
        new URLSearchParams(window.location.search).get('admin') === '1')

    if (adminParam) {
      queueMicrotask(() => setIsAdmin(true))
      if (typeof fetch === 'function') {
        fetch('/api/skills', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'activate_admin' }),
        }).catch(() => {})
      }
      return
    }

    if (typeof fetch === 'function') {
      fetch('/api/skills?check_auth=1')
        .then((res) => res.json())
        .then((data) => {
          if (data.authenticated) {
            queueMicrotask(() => setIsAdmin(true))
          }
        })
        .catch(() => {})
    }
  }, [searchParams])

  const toggleTag = (slug: string) => {
    setActiveTags((current) =>
      current.includes(slug)
        ? current.filter((tag) => tag !== slug)
        : [...current, slug],
    )
  }

  const clearFilters = () => {
    setActiveTags([])
    setQuery('')
  }

  const refreshCatalog = async () => {
    const refreshed = await fetch('/api/skills').then((r) => r.json())
    if (refreshed.catalog) setCatalog(refreshed.catalog)
  }

  const handleLockAdmin = async () => {
    try {
      await fetch('/api/skills', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'logout' }),
      })
    } catch {}
    setIsAdmin(false)
    setIsModalOpen(false)
    const url = new URL(window.location.href)
    url.searchParams.delete('admin')
    router.replace(url.pathname)
  }

  const handleSaveSkill = async (
    skillData: RecommendedSkill & { owner?: string },
    oldKey?: { name: string; repo: string },
  ) => {
    try {
      const isEditing = Boolean(oldKey)
      const res = await fetch('/api/skills', {
        method: isEditing ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(
          isEditing
            ? {
                oldName: oldKey?.name,
                oldRepo: oldKey?.repo,
                ...skillData,
              }
            : skillData,
        ),
      })
      const data = await res.json()
      if (data.success) {
        await refreshCatalog()
        return true
      }
      return false
    } catch {
      return false
    }
  }

  const handleSaveBulkSkills = async (skillsToIngest: BulkSkillInput[]) => {
    try {
      const res = await fetch('/api/skills', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'bulk',
          skills: skillsToIngest,
        }),
      })
      const data = await res.json()
      if (data.success) {
        await refreshCatalog()
        return { success: true, count: data.count || skillsToIngest.length }
      }
      return { success: false, count: 0, error: data.message }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to ingest skills'
      return { success: false, count: 0, error: msg }
    }
  }

  const handleDeleteSkill = async () => {
    if (!deleteTarget) return
    setIsDeleting(true)
    try {
      const res = await fetch('/api/skills', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: deleteTarget.name,
          repo: deleteTarget.repo,
        }),
      })
      const data = await res.json()
      if (data.success) {
        await refreshCatalog()
        setDeleteTarget(null)
      }
    } catch {}
    setIsDeleting(false)
  }

  const copyCommand = (cmd: string, name: string) => {
    navigator.clipboard.writeText(cmd)
    setCopiedSkill(name)
    setTimeout(() => setCopiedSkill(null), 2000)
  }

  const progressPercent = Math.round(
    (totalInstalled / (totalSkills || 1)) * 100,
  )

  return (
    <main className={styles.page} id="main-content">
      <div className={styles.shell}>
        {/* Header */}
        <header className={styles.header}>
          <div className={styles.headerMeta}>
            <span className={styles.pill}>
              <span className={styles.pillDot} />
              04 / TOOLBOX
            </span>
            <span>Agent Skills & Extensions</span>
            <span>·</span>
            <span>{totalSkills} Evaluated Packages</span>
          </div>

          <div className={styles.headerTitleStack}>
            <ScriptWord text="the bag" className={styles.headerScript} />
            <h1 className={styles.headerTitle}>
              Skills worth installing.
              <span className={styles.headerTitleTape}>
                {totalInstalled} / {totalSkills} IN USE
              </span>
            </h1>
          </div>

          <p className={styles.headerIntro}>
            Extensible agent skills, coding hooks, and workflow plugins from the
            ui-skills directory. Filter by capability, inspect the installation
            command, or copy the npx script directly.
          </p>
        </header>

        {/* Asymmetric 4-column / 8-column layout */}
        <div className={styles.asymmetricGrid}>
          {/* Left Column: Gauge, Categories & Admin */}
          <aside className={styles.sidebarSticky}>
            {/* Agent Telemetry Card */}
            <div className={styles.sidebarCard}>
              <div className={`${styles.screw} ${styles.screwTL}`} />
              <div className={`${styles.screw} ${styles.screwTR}`} />
              <div className={`${styles.screw} ${styles.screwBL}`} />
              <div className={`${styles.screw} ${styles.screwBR}`} />

              <div className={styles.sidebarHead}>
                <span>AGENT READINESS</span>
                <span>{progressPercent}%</span>
              </div>

              <div className={styles.telemetryReadout}>
                <span className={styles.telemetryBigNumber}>
                  {totalInstalled}
                </span>
                <span className={styles.telemetryTotal}>
                  / {totalSkills} installed
                </span>
              </div>

              <div className={styles.telemetryProgressTrack}>
                <div
                  className={styles.telemetryProgressFill}
                  style={{ width: `${progressPercent}%` }}
                />
              </div>

              <p
                style={{
                  fontSize: '0.8rem',
                  lineHeight: 1.5,
                  color: 'var(--muted)',
                  marginBottom: '1rem',
                }}
              >
                Skills configured for Claude Code and Cursor agents across this
                development workstation.
              </p>

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
                    <span>ADMIN BUS UNLOCKED</span>
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
                      setEditingSkill(null)
                      setModalTab('single')
                      setIsModalOpen(true)
                    }}
                    className={styles.tactileBtn}
                    style={{ fontSize: '0.68rem', padding: '0.4rem 0.6rem' }}
                  >
                    <Plus size={12} /> Add new skill
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setEditingSkill(null)
                      setModalTab('bulk')
                      setIsModalOpen(true)
                    }}
                    className={styles.tactileBtn}
                    style={{ fontSize: '0.68rem', padding: '0.4rem 0.6rem' }}
                  >
                    <Layers size={12} /> Bulk ingest
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    setEditingSkill(null)
                    setIsModalOpen(true)
                  }}
                  className={styles.tactileBtn}
                  style={{
                    width: '100%',
                    justifyContent: 'flex-start',
                    opacity: 0.8,
                  }}
                >
                  <Unlock size={14} />
                  Admin unlock
                </button>
              )}
            </div>

            {/* Tag Filter Bench */}
            <div className={styles.sidebarCard}>
              <div className={styles.sidebarHead}>
                <span>CAPABILITY TAGS</span>
                <span>{catalog.tags.length} TAGS</span>
              </div>

              <div className={styles.tagGrid}>
                <button
                  type="button"
                  className={`${styles.tagChip} ${
                    activeTags.length === 0 ? styles.tagChipActive : ''
                  }`}
                  onClick={clearFilters}
                >
                  <span>All Skills</span>
                  <span className={styles.tagChipCount}>({totalSkills})</span>
                </button>
                {catalog.tags.map((tag) => {
                  const isActive = activeTags.includes(tag.slug)
                  const count = tagCounts.get(tag.slug) ?? 0
                  return (
                    <button
                      key={tag.slug}
                      type="button"
                      className={`${styles.tagChip} ${
                        isActive ? styles.tagChipActive : ''
                      }`}
                      onClick={() => toggleTag(tag.slug)}
                    >
                      <span>{tag.label}</span>
                      <span className={styles.tagChipCount}>({count})</span>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Source card */}
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
              <b style={{ color: 'var(--ink)' }}>INDEXED REPOSITORY:</b>
              <br />
              Catalog synced against{' '}
              <a
                href={SKILLS_SOURCE}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  color: 'var(--cobalt)',
                  fontWeight: 700,
                  textDecoration: 'underline',
                }}
              >
                ui-skills.com{' '}
                <ArrowUpRight size={11} style={{ display: 'inline' }} />
              </a>
            </div>
          </aside>

          {/* Right Column: Search & Cartridges Deck */}
          <section
            className={styles.contentColumn}
            aria-label="Skills collection"
          >
            {/* Search Toolbar */}
            <div className={styles.searchBar}>
              <Search size={16} style={{ color: 'var(--muted)' }} />
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search skills by name, repository, or capability..."
                className={styles.searchInput}
                aria-label="Search skills"
              />
              {(query || activeTags.length > 0) && (
                <button
                  type="button"
                  onClick={clearFilters}
                  className={styles.searchClear}
                  aria-label="Clear search filters"
                >
                  <X size={15} />
                </button>
              )}
            </div>

            {/* Status ribbon */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                fontFamily: 'var(--mono)',
                fontSize: '0.72rem',
                color: 'var(--muted)',
                textTransform: 'uppercase',
                paddingInline: '0.25rem',
              }}
            >
              <span>
                Showing <b>{visibleSkills.length}</b> of {totalSkills} skills
              </span>
              {activeTags.length > 0 && (
                <span>Filtering by {activeTags.length} tags</span>
              )}
            </div>

            {/* Skills Deck */}
            <div className={styles.skillDeck}>
              {visibleSkills.map((skill, idx) => {
                const cmd = installCommand(skill)
                const isCopied = copiedSkill === skill.name

                return (
                  <article
                    key={`${skill.repo}/${skill.name}`}
                    className={styles.skillCard}
                  >
                    <div className={styles.cardWashi} />

                    <div className={styles.skillTop}>
                      <span>
                        MOD {String(idx + 1).padStart(2, '0')} · {skill.repo}
                      </span>
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.5rem',
                        }}
                      >
                        <span
                          className={`${styles.skillStatusPill} ${
                            skill.installed
                              ? styles.statusInstalled
                              : styles.statusAvailable
                          }`}
                        >
                          <span className={styles.statusLed} />
                          {skill.installed ? 'IN USE' : 'AVAILABLE'}
                        </span>

                        {isAdmin && (
                          <div
                            style={{ display: 'inline-flex', gap: '0.2rem' }}
                          >
                            <button
                              type="button"
                              onClick={() => {
                                setEditingSkill(skill)
                                setIsModalOpen(true)
                              }}
                              style={{
                                background: 'none',
                                border: 'none',
                                cursor: 'pointer',
                                padding: '2px',
                              }}
                              aria-label="Edit skill"
                            >
                              <Edit2 size={13} />
                            </button>
                            <button
                              type="button"
                              onClick={() => setDeleteTarget(skill)}
                              style={{
                                background: 'none',
                                border: 'none',
                                cursor: 'pointer',
                                padding: '2px',
                                color: 'var(--tangerine)',
                              }}
                              aria-label="Delete skill"
                            >
                              <Trash2 size={13} />
                            </button>
                          </div>
                        )}
                      </div>
                    </div>

                    <a
                      href={skillUrl(skill)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles.skillTitle}
                    >
                      <span>{skill.name}</span>
                      <ArrowUpRight size={14} style={{ opacity: 0.5 }} />
                    </a>

                    <p className={styles.skillDesc}>{skill.description}</p>

                    {/* Terminal install command snippet */}
                    <div className={styles.installStrip}>
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.4rem',
                          minWidth: 0,
                        }}
                      >
                        <Terminal
                          size={13}
                          style={{ opacity: 0.7, flexShrink: 0 }}
                        />
                        <code className={styles.installCode}>{cmd}</code>
                      </div>
                      <button
                        type="button"
                        onClick={() => copyCommand(cmd, skill.name)}
                        className={styles.copyBtn}
                        aria-label="Copy install command"
                      >
                        {isCopied ? (
                          <>
                            <Check size={11} />
                            Copied!
                          </>
                        ) : (
                          <>
                            <Copy size={11} />
                            Copy
                          </>
                        )}
                      </button>
                    </div>

                    <div className={styles.skillFooter}>
                      <div className={styles.skillTags}>
                        {skill.tags.map((tagSlug) => {
                          const tag = tagsBySlug.get(tagSlug)
                          return (
                            <span key={tagSlug} className={styles.tagPill}>
                              {tag ? tag.label : tagSlug}
                            </span>
                          )
                        })}
                      </div>

                      <a
                        href={skillUrl(skill)}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.2rem',
                          fontFamily: 'var(--mono)',
                          fontSize: '0.7rem',
                          fontWeight: 700,
                          color: 'var(--cobalt)',
                          textDecoration: 'none',
                        }}
                      >
                        Source repo <ExternalLink size={11} />
                      </a>
                    </div>
                  </article>
                )
              })}

              {visibleSkills.length === 0 && (
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
                    No skills match the active filter
                  </h3>
                  <p
                    style={{
                      fontSize: '0.9rem',
                      color: 'var(--muted)',
                      marginBottom: '1.25rem',
                    }}
                  >
                    Try searching for another keyword or clear the selected
                    tags.
                  </p>
                  <button
                    type="button"
                    onClick={clearFilters}
                    className={styles.tactileBtn}
                  >
                    <RefreshCw size={13} />
                    Reset all filters
                  </button>
                </div>
              )}
            </div>
          </section>
        </div>
      </div>

      {/* Admin Management Modal */}
      {isModalOpen && (
        <SkillAdminModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          isAdmin={isAdmin}
          onLoginSuccess={() => setIsAdmin(true)}
          editingSkill={editingSkill}
          tags={catalog.tags}
          onSaveSkill={handleSaveSkill}
          onSaveBulkSkills={handleSaveBulkSkills}
          initialTab={modalTab}
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
              Delete skill?
            </h3>
            <p
              style={{
                fontSize: '0.9rem',
                color: 'var(--muted)',
                marginBottom: '1.25rem',
              }}
            >
              Are you sure you want to remove &quot;{deleteTarget.name}&quot;
              from the catalogue?
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
                disabled={isDeleting}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeleteSkill}
                className={styles.tactileBtn}
                style={{
                  background: 'var(--tangerine)',
                  color: 'var(--paper-hi)',
                }}
                disabled={isDeleting}
              >
                {isDeleting ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  )
}

export function SkillsPage({ initialCatalog }: SkillsPageProps) {
  return (
    <Suspense fallback={null}>
      <SkillsPageContent initialCatalog={initialCatalog} />
    </Suspense>
  )
}
