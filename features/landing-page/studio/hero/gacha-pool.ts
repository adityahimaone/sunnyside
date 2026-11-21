import { WORK_PROJECTS, type WorkProject } from '@/data/projects'

/**
 * What each button on the capsule machine draws from.
 *
 * The buckets are made from fields the catalogue already has (`genre`,
 * `problem`, `stack`), so a new project lands in the machine without anyone
 * touching this file. A bucket that ends up empty falls back to the whole
 * catalogue, which keeps every button working.
 */
export const GACHA_KINDS = [
  { id: 'design', label: 'Design', hint: 'systems, sites, brands' },
  { id: 'code', label: 'Code', hint: 'tools, local-first' },
  { id: 'product', label: 'Product', hint: 'apps, web3, business' },
  { id: 'surprise', label: 'Surprise me', hint: 'anything goes' },
] as const

export type GachaKind = (typeof GACHA_KINDS)[number]['id']

const DESIGN = /design|photograph|marketing|brand/i
const CODE = /developer|tool|local-first|learning|\bgo\b|grpc/i

function bucketOf(project: WorkProject): Exclude<GachaKind, 'surprise'> {
  const text = [project.genre, project.problem, ...project.stack].join(' ')
  if (DESIGN.test(text)) return 'design'
  if (CODE.test(text)) return 'code'
  return 'product'
}

export function poolFor(kind: GachaKind): readonly WorkProject[] {
  if (kind === 'surprise') return WORK_PROJECTS
  const pool = WORK_PROJECTS.filter((project) => bucketOf(project) === kind)
  return pool.length > 0 ? pool : WORK_PROJECTS
}

/**
 * Picks one project from a pool, avoiding the ones already pulled while any
 * are left, so the first few pulls always show something new.
 */
export function pickProject(
  pool: readonly WorkProject[],
  seen: readonly string[],
  random: () => number = Math.random,
): WorkProject {
  const fresh = pool.filter((project) => !seen.includes(project.slug))
  const from = fresh.length > 0 ? fresh : pool
  return from[Math.floor(random() * from.length)]
}

export const STICKER_ORDER = [
  'smiley',
  'daisy',
  'burst',
  'bolt',
  'heart',
  'atom',
  'sun',
] as const

export type StickerName = (typeof STICKER_ORDER)[number]

export const stickerFor = (project: WorkProject): StickerName =>
  STICKER_ORDER[project.id % STICKER_ORDER.length]

export const CATALOGUE_TOTAL = WORK_PROJECTS.length
