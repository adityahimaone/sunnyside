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
 * The board is curated, not derived strictly from the year. Switchyard leads
 * because it is the strongest release. Each tab is capped at a maximum of 12:
 * - Everything: 6 pinned releases + 6 pinned design systems (12 items)
 * - Releases: 6 pinned releases + max 6 latest projects (max 12 items)
 * - Systems: 6 pinned design systems + max 6 latest design systems (max 12 items)
 */
export const FEATURED_PROJECT_SLUGS = [
  'switchyard',
  'primarindo-asia',
  'habit-tracker',
  'fullstack-wannabe',
  'seaphantom',
  'kanon',
] as const

/** The six systems shown on the Everything tab, in board order. */
export const FEATURED_SYSTEM_SLUGS = [
  'sunnyside',
  'jakarta',
  'clearing',
  'ledger',
  'huginn',
  'vesper',
] as const

/**
 * The six more the Systems tab adds: the latest design systems outside the
 * featured six (Arête, Tavola, Wildflower Wind, Bluewater, Porphyry, Strand).
 */
export const MORE_SYSTEM_SLUGS = [
  'arete',
  'tavola',
  'wildflower-wind',
  'bluewater',
  'porphyry',
  'strand',
] as const

/** Every system the board can show, Everything six first. Total max 12. */
export const SYSTEM_SLUGS = [
  ...FEATURED_SYSTEM_SLUGS,
  ...MORE_SYSTEM_SLUGS,
] as const

/**
 * Each image gets its own focal point inside the native 16:10 project frame,
 * so a portrait phone, a wide building shot and a full board each show the
 * part worth seeing instead of a blind centre crop.
 */
const PROJECT_POSITION: Record<string, string> = {
  switchyard: 'top center',
  kanon: 'top center',
  hayoloka: 'center',
  'api-playground': 'top center',
  'code-snippet-manager': 'top center',
  'primarindo-asia': 'center',
  'habit-tracker': 'left center',
  'fullstack-wannabe': 'top center',
  seaphantom: 'center',
  'seaphantom-p2p': 'center',
  labgrownbeasts: 'center',
}

/**
 * The paint chips are each system's own token values, four per deck. A deck
 * that is missing here simply prints no chips rather than inventing a palette.
 */
const SYSTEM_SWATCHES: Record<string, readonly string[]> = {
  tavola: ['#faf6ee', '#221a15', '#d85a38', '#2a62b6'],
  arete: ['#f2ede3', '#101229', '#1e3a8a', '#c4462b'],
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

/**
 * Builds the project gallery items:
 * - `featured`: 6 pinned releases shown on the Everything tab
 * - `all`: 6 pinned releases + max 6 latest releases (sorted by recency, max 12 total)
 */
export function buildProjectGalleryItems(): {
  featured: readonly ProjectGalleryItem[]
  all: readonly ProjectGalleryItem[]
} {
  const pinnedSlugs = new Set<string>(FEATURED_PROJECT_SLUGS)

  // 1. Pinned projects for Everything tab (preserving FEATURED_PROJECT_SLUGS order)
  const pinnedProjects: WorkProject[] = []
  for (const slug of FEATURED_PROJECT_SLUGS) {
    const project = WORK_PROJECTS.find((p) => p.slug === slug)
    if (project) pinnedProjects.push(project)
  }

  // 2. Max 6 latest projects from WORK_PROJECTS outside the pinned set
  const remaining = WORK_PROJECTS.filter((p) => !pinnedSlugs.has(p.slug)).sort(
    (a, b) => b.year - a.year || a.id - b.id,
  )
  const latestProjects = remaining.slice(0, 6)

  const toGalleryItem = (
    project: WorkProject,
    order: number,
  ): ProjectGalleryItem => ({
    id: project.slug,
    kind: 'project' as const,
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
  })

  const featured = pinnedProjects.map((p, i) => toGalleryItem(p, i))
  const all = [
    ...featured,
    ...latestProjects.map((p, i) =>
      toGalleryItem(p, pinnedProjects.length + i),
    ),
  ]

  return { featured, all }
}

const { featured: FEATURED_PROJECT_ITEMS, all: ALL_PROJECT_GALLERY_ITEMS } =
  buildProjectGalleryItems()

export { FEATURED_PROJECT_ITEMS }
export const PROJECT_GALLERY_ITEMS: readonly ProjectGalleryItem[] =
  ALL_PROJECT_GALLERY_ITEMS

/**
 * Builds the system gallery items:
 * - 6 pinned design systems from the Everything tab (`FEATURED_SYSTEM_SLUGS`)
 * - max 6 latest design systems from the catalogue (sorted by recency, max 12 total)
 */
export function buildSystemGalleryItems(
  cases: readonly DesignCase[] = DESIGN_CASES,
): readonly SystemGalleryItem[] {
  const pinnedSlugs = new Set<string>(FEATURED_SYSTEM_SLUGS)

  // 1. Pinned design systems from Everything tab (in FEATURED_SYSTEM_SLUGS order)
  const pinned: DesignCase[] = []
  for (const slug of FEATURED_SYSTEM_SLUGS) {
    const item = cases.find((c) => slugify(c.slug) === slug)
    if (item) pinned.push(item)
  }

  // 2. Max 6 latest design systems outside the pinned set (sorted by number descending)
  const remaining = cases
    .filter((c) => !pinnedSlugs.has(slugify(c.slug)))
    .sort((a, b) => Number(b.number || 0) - Number(a.number || 0))
    .slice(0, 6)

  const activeSystems = [...pinned, ...remaining]

  return activeSystems.map((item, order) => {
    const slug = slugify(item.slug)
    return {
      id: slug,
      kind: 'design-system' as const,
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
      swatches: SYSTEM_SWATCHES[slug] ?? [],
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

/**
 * Pushpins are the board's hardware: four spool colours, dealt by position so a
 * filter or a re-render never swaps the pin in a card's tape.
 */
export const PIECE_PIN = ['crimson', 'amber', 'cobalt', 'emerald'] as const

export type PiecePin = (typeof PIECE_PIN)[number]

const pinAt = new Map(GALLERY_ITEMS.map((item, index) => [item.id, index]))

export function pinFor(id: string): PiecePin {
  return PIECE_PIN[(pinAt.get(id) ?? 0) % PIECE_PIN.length]
}

/** The three spools the yarn controller offers, and the ink each strand uses. */
export const YARN_SPOOLS = [
  { id: 'crimson', label: 'Crimson', hex: '#c22026' },
  { id: 'gold', label: 'Gold', hex: '#b07b06' },
  { id: 'cobalt', label: 'Cobalt', hex: '#2740b6' },
] as const

export type YarnSpool = (typeof YARN_SPOOLS)[number]['id']

export const YARN_HEX: Record<YarnSpool, string> = Object.fromEntries(
  YARN_SPOOLS.map((spool) => [spool.id, spool.hex]),
) as Record<YarnSpool, string>

/** One strand between two pinned pieces. */
export type YarnLink = { from: string; to: string; spool: YarnSpool }

const spoolFor = (seed: string): YarnSpool =>
  YARN_SPOOLS[
    [...seed].reduce((sum, char) => sum + char.charCodeAt(0), 0) %
      YARN_SPOOLS.length
  ].id

/**
 * The board's first strings are not decorative noise: a strand joins the pieces
 * that share a material. A tag held by exactly two or three pieces is the
 * strongest thread — one string, one meaning — so those are the ones tied.
 * Tags shared by four or more pieces are a category, not a connection, and are
 * skipped rather than tangled into a net. The colour comes from the tag, so
 * every "Glass" string in the room is the same ink.
 *
 * Stable by construction: the same catalogue always ties the same strings, and
 * a filter only hides the strands whose far end is off the board.
 */
export function buildDefaultYarn(
  items: readonly GalleryItem[] = GALLERY_ITEMS,
): YarnLink[] {
  const byTag = new Map<string, string[]>()

  for (const item of items) {
    for (const tag of item.tags) {
      const holders = byTag.get(tag)
      if (holders) holders.push(item.id)
      else byTag.set(tag, [item.id])
    }
  }

  const groups = [...byTag.entries()]
    .filter(([, ids]) => ids.length === 2 || ids.length === 3)
    .sort((a, b) => a[1].length - b[1].length || a[0].localeCompare(b[0]))

  const tied = new Set<string>()
  const links: YarnLink[] = []
  const key = (a: string, b: string) => (a < b ? `${a}:${b}` : `${b}:${a}`)

  // The board is not two halves. Each release hangs off the system it was drawn
  // in, so every project carries one strand into the system wall: without it the
  // yarn piles up on the left and the right of the mat reads as untouched.
  const projects = items.filter((item) => item.kind === 'project')
  const systems = items.filter((item) => item.kind === 'design-system')

  projects.forEach((project, index) => {
    const system = systems[index % systems.length]
    if (!system) return
    const pair = key(project.id, system.id)
    if (tied.has(pair)) return
    tied.add(pair)
    links.push({
      from: project.id,
      to: system.id,
      spool: YARN_SPOOLS[index % YARN_SPOOLS.length].id,
    })
  })

  for (const [tag, ids] of groups) {
    for (let index = 0; index < ids.length - 1; index += 1) {
      const [from, to] = [ids[index], ids[index + 1]]
      const pair = key(from, to)
      if (tied.has(pair)) continue
      tied.add(pair)
      links.push({ from, to, spool: spoolFor(tag) })
    }
  }

  return links.slice(0, 12)
}

export const DEFAULT_YARN: readonly YarnLink[] = buildDefaultYarn()
