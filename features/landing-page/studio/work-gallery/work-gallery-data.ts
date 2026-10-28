import { WORK_PROJECTS, type WorkProject } from '@/data/projects'
import { DESIGN_CASES } from '@/features/case-library/cases'

export type GalleryFilter = 'all' | 'project' | 'design-system'

type BaseGalleryItem = {
  id: string
  /** The catalogue number shown on the card's bottom bar. */
  index: string
  title: string
  /** The sleeve label. Project genres and the system share this field. */
  categoryLabel: string
  year: string
  description: string
  tags: readonly string[]
  href: string
  cta: string
  /** Focal point for the project 16:10 / system 4:3 thumbnail frame. */
  position: string
}

export type ProjectGalleryItem = BaseGalleryItem & {
  kind: 'project'
  project: WorkProject
  /** Switchyard leads the shelf; its yellow tape distinguishes it. */
  featured: boolean
}

export type SystemGalleryItem = BaseGalleryItem & {
  kind: 'design-system'
  cover: string
  coverAlt: string
}

export type GalleryItem = ProjectGalleryItem | SystemGalleryItem

export const GALLERY_FILTERS = [
  { id: 'all', label: 'All' },
  { id: 'project', label: 'Project' },
  { id: 'design-system', label: 'Design System' },
] as const satisfies readonly { id: GalleryFilter; label: string }[]

/**
 * The shelf order is curated, not derived from the year. Switchyard leads
 * because it is the strongest release; the design systems follow the six
 * releases so the filter reads as "work, then the systems behind it".
 */
const PROJECT_ORDER = [
  'switchyard',
  'primarindo-asia',
  'habit-tracker',
  'seaphantom',
  'seaphantom-p2p',
  'labgrownbeasts',
] as const

/**
 * Each image gets its own focal point inside the native 16:10 project frame,
 * so a portrait phone, a wide building shot and a full board each show the
 * part worth seeing instead of a blind centre crop.
 */
const PROJECT_POSITION: Record<string, string> = {
  switchyard: 'top center',
  'primarindo-asia': 'center',
  'habit-tracker': 'left center',
  seaphantom: 'center',
  'seaphantom-p2p': 'center',
  labgrownbeasts: 'center',
}

export const PROJECT_GALLERY_ITEMS: readonly ProjectGalleryItem[] =
  PROJECT_ORDER.map((slug, order) => {
    const project = WORK_PROJECTS.find((candidate) => candidate.slug === slug)

    if (!project) {
      throw new Error(
        `The work gallery lists "${slug}", which is not in WORK_PROJECTS`,
      )
    }

    return {
      id: project.slug,
      kind: 'project',
      index: String(order + 1).padStart(2, '0'),
      title: project.title,
      categoryLabel: project.genre,
      year: String(project.year),
      description: project.description,
      // The lead gets one more pill; the rest keep the bottom drawer compact.
      tags: project.stack.slice(0, order === 0 ? 4 : 3),
      href: `/projects/${project.slug}`,
      cta: 'Read the notes',
      project,
      featured: order === 0,
      position: PROJECT_POSITION[project.slug] ?? 'center',
    }
  })

/**
 * The design-system shelf is the same six documented cases as
 * `/design-system`, in the same order and with the same covers. This is the
 * single source of truth for the case names, paths and brand-kit thumbnails.
 */
export const SYSTEM_GALLERY_ITEMS: readonly SystemGalleryItem[] =
  DESIGN_CASES.map((item, order) => ({
    id: item.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, ''),
    kind: 'design-system',
    index: `S${order + 1}`,
    title: item.name,
    categoryLabel: 'Design system',
    year: item.status.match(/\d{4}/)?.[0] ?? '2026',
    description: item.description,
    tags: item.tags,
    href: item.href,
    cta: 'Open the case',
    cover: item.cover,
    coverAlt: item.coverAlt,
    position: 'top center',
  }))

export const GALLERY_ITEMS: readonly GalleryItem[] = [
  ...PROJECT_GALLERY_ITEMS,
  ...SYSTEM_GALLERY_ITEMS,
]

export function galleryCount(filter: GalleryFilter) {
  if (filter === 'all') return GALLERY_ITEMS.length
  return GALLERY_ITEMS.filter((item) => item.kind === filter).length
}

export function visibleGalleryItems(filter: GalleryFilter): GalleryItem[] {
  if (filter === 'all') return [...GALLERY_ITEMS]
  return GALLERY_ITEMS.filter((item) => item.kind === filter)
}
