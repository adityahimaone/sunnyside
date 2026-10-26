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
import { Daisy } from '@/features/landing-page/studio/doodles'
import layout from '@/features/archive/archive.module.css'
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
    <main className={`${layout.page} ${styles.page}`} id="main-content">
      <div className={layout.container}>
        <header className={styles.hero}>
          <div className={styles.heroCopy}>
            <p className={styles.kicker}>
              <span className={styles.kickerTag}>
                <span className={styles.kickerMark} aria-hidden />
                04 / The toolbox
              </span>
              <span className={styles.kickerText}>
                <span className={layout.num}>{totalSkills}</span> evaluated
                packages
              </span>
            </p>

            <ScriptWord text="the bag" className={layout.hand} />

            <h1 className={layout.title}>Skills worth installing.</h1>
            <p className={layout.intro}>
              <span className={layout.num}>{totalSkills}</span> agent skills
              from ui-skills, tagged by what each one is for.
            </p>

            <div className={layout.actions}>
              <a href="#tray" className={layout.primary}>
                Browse the tray
                <ArrowUpRight className="size-4" aria-hidden />
              </a>
              <a
                href={SKILLS_SOURCE}
                target="_blank"
                rel="noopener noreferrer"
                className={layout.ghost}
              >
                ui-skills.com
                <ArrowUpRight className="size-3.5" aria-hidden />
              </a>
            </div>
          </div>

          <aside className={styles.meter} aria-label="Skills in use">
            <div className={styles.meterTop}>
              <span>Installed</span>
              <span className={styles.meterCount}>
                {totalInstalled} of {totalSkills}
              </span>
            </div>
            <p className={styles.meterBig}>
              {totalInstalled}
              <span>/{totalSkills}</span>
            </p>
            <div className={styles.meterTrack} aria-hidden>
              {Array.from({ length: 12 }).map((_, index) => (
                <span
                  key={index}
                  data-on={
                    index < Math.round((progressPercent / 100) * 12)
                      ? 'true'
                      : 'false'
                  }
                />
              ))}
            </div>
            <p className={styles.meterNote}>
              Skills configured for Claude Code and Cursor agents across this
              development workstation.
            </p>
            <Daisy className={styles.meterDaisy} title="Daisy sticker" />
          </aside>
        </header>

        <section id="tray" className={styles.tray} aria-labelledby="tray-title">
          <div className={styles.toolbar}>
            <div className={styles.searchBar}>
              <Search size={16} className={styles.searchIcon} aria-hidden />
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search name, repository or capability"
                className={styles.searchInput}
                aria-label="Search skills"
              />
              {query || activeTags.length > 0 ? (
                <button
                  type="button"
                  onClick={clearFilters}
                  className={styles.searchClear}
                  aria-label="Clear search filters"
                >
                  <X size={15} aria-hidden />
                </button>
              ) : null}
            </div>

            <div className={styles.adminArea}>
              {isAdmin ? (
                <>
                  <span className={styles.adminTag}>
                    Admin
                    <button
                      type="button"
                      onClick={handleLockAdmin}
                      className={styles.lockButton}
                      aria-label="Lock admin controls"
                    >
                      <Lock size={12} aria-hidden />
                    </button>
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      setEditingSkill(null)
                      setModalTab('single')
                      setIsModalOpen(true)
                    }}
                    className={styles.adminButton}
                  >
                    <Plus size={13} aria-hidden />
                    Add
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setEditingSkill(null)
                      setModalTab('bulk')
                      setIsModalOpen(true)
                    }}
                    className={styles.adminButton}
                  >
                    <Layers size={13} aria-hidden />
                    Bulk
                  </button>
                </>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    setEditingSkill(null)
                    setIsModalOpen(true)
                  }}
                  className={styles.adminOpen}
                >
                  <Unlock size={14} aria-hidden />
                  Admin controls
                </button>
              )}
            </div>
          </div>

          <div
            className={styles.tagRail}
            role="group"
            aria-label="Filter skills by capability"
          >
            <button
              type="button"
              className={styles.tagChip}
              data-active={activeTags.length === 0}
              onClick={clearFilters}
            >
              <span>All skills</span>
              <span className={styles.tagCount}>({totalSkills})</span>
            </button>
            {catalog.tags.map((tag) => (
              <button
                key={tag.slug}
                type="button"
                className={styles.tagChip}
                data-active={activeTags.includes(tag.slug)}
                onClick={() => toggleTag(tag.slug)}
              >
                <span>{tag.label}</span>
                <span className={styles.tagCount}>
                  ({tagCounts.get(tag.slug) ?? 0})
                </span>
              </button>
            ))}
          </div>

          <div className={styles.resultRow}>
            <h2 id="tray-title" className={styles.resultTitle}>
              The tray
            </h2>
            <p className={styles.resultCount}>
              Showing <span className={layout.num}>{visibleSkills.length}</span>{' '}
              of <span className={layout.num}>{totalSkills}</span>
              {activeTags.length > 0 ? `, ${activeTags.length} filters on` : ''}
            </p>
          </div>

          <div className={styles.grid}>
            {visibleSkills.map((skill, idx) => {
              const cmd = installCommand(skill)
              const isCopied = copiedSkill === skill.name
              return (
                <article
                  key={`${skill.repo}/${skill.name}`}
                  className={styles.card}
                  data-installed={skill.installed ? 'true' : 'false'}
                >
                  <div className={styles.cardTop}>
                    <span className={styles.cardIndex}>
                      <span className={layout.num}>
                        {String(idx + 1).padStart(3, '0')}
                      </span>{' '}
                      {skill.repo}
                    </span>

                    <span className={styles.cardBits}>
                      <span className={styles.status}>
                        {skill.installed ? 'In use' : 'Available'}
                      </span>

                      {isAdmin ? (
                        <span className={styles.cardAdmin}>
                          <button
                            type="button"
                            onClick={() => {
                              setEditingSkill(skill)
                              setIsModalOpen(true)
                            }}
                            className={styles.iconButton}
                            aria-label="Edit skill"
                          >
                            <Edit2 size={13} aria-hidden />
                          </button>
                          <button
                            type="button"
                            onClick={() => setDeleteTarget(skill)}
                            className={`${styles.iconButton} ${styles.iconDanger}`}
                            aria-label="Delete skill"
                          >
                            <Trash2 size={13} aria-hidden />
                          </button>
                        </span>
                      ) : null}
                    </span>
                  </div>

                  <a
                    href={skillUrl(skill)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.skillTitle}
                    title={cmd}
                  >
                    <span>{skill.name}</span>
                    <ArrowUpRight size={14} aria-hidden />
                  </a>

                  <p className={styles.skillDesc}>{skill.description}</p>

                  <div className={styles.installStrip}>
                    <Terminal size={13} aria-hidden />
                    <code className={styles.installCode}>{cmd}</code>
                    <button
                      type="button"
                      onClick={() => copyCommand(cmd, skill.name)}
                      className={styles.copyButton}
                      aria-label="Copy install command"
                    >
                      {isCopied ? (
                        <>
                          <Check size={11} aria-hidden />
                          Copied
                        </>
                      ) : (
                        <>
                          <Copy size={11} aria-hidden />
                          Copy
                        </>
                      )}
                    </button>
                  </div>

                  <div className={styles.cardFoot}>
                    <div className={styles.skillTags}>
                      {skill.tags.map((tagSlug) => {
                        const tag = tagsBySlug.get(tagSlug)
                        return (
                          <span key={tagSlug} className={styles.tag}>
                            {tag ? tag.label : tagSlug}
                          </span>
                        )
                      })}
                    </div>

                    <a
                      href={
                        skill.repo.startsWith('http')
                          ? skill.repo
                          : `https://github.com/${skill.repo}`
                      }
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles.sourceLink}
                    >
                      Source
                      <ExternalLink size={11} aria-hidden />
                    </a>
                  </div>
                </article>
              )
            })}
          </div>

          {visibleSkills.length === 0 ? (
            <div className={styles.empty}>
              <h3 className={styles.emptyTitle}>
                No skills match the active filter
              </h3>
              <p className={styles.emptyNote}>
                Try another keyword, or clear the selected tags.
              </p>
              <button
                type="button"
                onClick={clearFilters}
                className={layout.ghost}
              >
                <RefreshCw size={13} aria-hidden />
                Reset the filters
              </button>
            </div>
          ) : null}
        </section>

        <section className={styles.sourceBand} aria-labelledby="source-title">
          <div>
            <h2 id="source-title" className={styles.sourceTitle}>
              Where the tray comes from
            </h2>
            <p className={styles.sourceNote}>
              The list is synced against ui-skills.com. Each card carries the
              exact install command the directory publishes.
            </p>
          </div>
          <a
            href={SKILLS_SOURCE}
            target="_blank"
            rel="noopener noreferrer"
            className={layout.textLink}
          >
            ui-skills.com
            <ArrowUpRight className="size-3.5" aria-hidden />
          </a>
        </section>
      </div>

      {isModalOpen ? (
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
      ) : null}

      {deleteTarget ? (
        <div className={styles.modalBackdrop} role="presentation">
          <div
            className={styles.modalCard}
            role="dialog"
            aria-modal="true"
            aria-labelledby="delete-skill-title"
          >
            <h3 id="delete-skill-title" className={styles.modalTitle}>
              Remove this skill?
            </h3>
            <p className={styles.modalNote}>
              “{deleteTarget.name}” will leave the tray. This cannot be undone.
            </p>
            <div className={styles.modalActions}>
              <button
                type="button"
                onClick={() => setDeleteTarget(null)}
                className={layout.ghost}
                disabled={isDeleting}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeleteSkill}
                className={styles.dangerButton}
                disabled={isDeleting}
              >
                {isDeleting ? 'Removing…' : 'Remove'}
              </button>
            </div>
          </div>
        </div>
      ) : null}
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
