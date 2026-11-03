import { WORK_PROJECTS, type WorkProject } from '@/data/projects'
import { DESIGN_CASES, type DesignCase } from '@/features/case-library/cases'

type BaseGalleryItem = {
  id: string
  /** The catalogue number printed on the piece's corner stamp. */
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
  /** Switchyard leads the board; its yellow tape distinguishes it. */
  featured: boolean
}

export type SystemGalleryItem = BaseGalleryItem & {
  kind: 'design-system'
  cover: string
  coverAlt: string
  /** Four paint chips lifted from the system's own token file. */
  swatches: readonly string[]
}

export type GalleryItem = ProjectGalleryItem | SystemGalleryItem

/**
 * The board is curated, not derived from the year. Switchyard leads because it
 * is the strongest release; the six systems that follow are the six most
 * recent documented cases, so the moodboard is "what I made lately" rather
 * than the whole catalogue — `/projects` and `/design-system` hold the rest.
 */
const PROJECT_ORDER = [
  'switchyard',
  'primarindo-asia',
  'habit-tracker',
  'fullstack-wannabe',
  'seaphantom',
  'labgrownbeasts',
] as const

const MOODBOARD_LIMIT = 6

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
  'fullstack-wannabe': 'top center',
  labgrownbeasts: 'center',
}

/**
 * The paint chips are each system's own token values, four per deck. A deck
 * that is missing here simply prints no chips rather than inventing a palette.
 */
const SYSTEM_SWATCHES: Record<string, readonly string[]> = {
  tavola: ['#faf6ee', '#221a15', '#d85a38', '#2a62b6'],
  halation: ['#fdf1ec', '#160912', '#f26857', '#9e344d'],
  sunnyside: ['#f3ecdf', '#191a2e', '#3d53d6', '#ffd23f'],
  vesper: ['#0d131f', '#2342c0', '#5470d6', '#fbf8f1'],
  'wildflower-wind': ['#e7e3ee', '#2a1e33', '#8f2a90', '#f4d9e8'],
  bluewater: ['#040b14', '#0d1d2c', '#8fb6d6', '#f4f9fd'],
  jakarta: ['#f7f4ee', '#1b2126', '#2830d0', '#dad4c9'],
  porphyry: ['#160a0f', '#7a1f3d', '#c9a45c', '#e3c98e'],
  ledger: ['#f3f5fb', '#0a1024', '#6a8dd8', '#dce2f0'],
  clearing: ['#0e211c', '#2f7a5e', '#cbdd82', '#f3edde'],
  strand: ['#f3f0e8', '#13232a', '#a85a22', '#2f5f6b'],
  cove: ['#060b18', '#111d36', '#3fe3c6', '#e9f0ff'],
  hachure: ['#121612', '#2f4133', '#8fa87a', '#f5f3e9'],
  riso: ['#141926', '#e85d3f', '#2d5ba6', '#fbf7ed'],
  huginn: ['#1a0505', '#c8382d', '#eae4d9', '#f8f5ee'],
  vitrine: ['#0b0d12', '#1c2230', '#4e6d94', '#d8e4f0'],
}

const slugify = (value: string) =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')

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
      index: `P${String(order + 1).padStart(2, '0')}`,
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
 * The six most recent documented systems, in `DESIGN_CASES` order — the same
 * source of truth `/design-system` renders, so a case can never appear on the
 * board with a name, path or cover the case page does not have.
 */
export function buildSystemGalleryItems(
  cases: readonly DesignCase[] = DESIGN_CASES,
): readonly SystemGalleryItem[] {
  return cases.slice(0, MOODBOARD_LIMIT).map((item, order) => {
    const id = slugify(item.slug || item.name)

    return {
      id,
      kind: 'design-system',
      index: `S${String(order + 1).padStart(2, '0')}`,
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
      swatches: SYSTEM_SWATCHES[id] ?? [],
    }
  })
}

export const SYSTEM_GALLERY_ITEMS: readonly SystemGalleryItem[] =
  buildSystemGalleryItems(DESIGN_CASES)

export const GALLERY_ITEMS: readonly GalleryItem[] = [
  ...PROJECT_GALLERY_ITEMS,
  ...SYSTEM_GALLERY_ITEMS,
]

/** Where the archive links lead, and what the toolbar calls them. */
export const ARCHIVE_LINKS = [
  {
    href: '/projects',
    label: 'All projects',
    count: WORK_PROJECTS.length,
    note: 'the catalogue',
  },
  {
    href: '/design-system',
    label: 'All systems',
    count: DESIGN_CASES.length,
    note: 'every case',
  },
] as const

/**
 * Tape and tilt are assigned by position, not stored per item: the board has
 * to look hand-assembled while staying deterministic, so the same piece never
 * jumps tape colour between renders.
 */
export const PIECE_TAPE = [
  'amber',
  'pink',
  'sky',
  'mint',
  'butter',
  'rose',
] as const

export type PieceTape = (typeof PIECE_TAPE)[number]

export const PIECE_TILT = [
  -2.6, 1.9, -1.2, 2.8, -3.1, 1.4, 2.2, -1.8, 3.2, -2.2, 1.1, -2.9,
] as const
