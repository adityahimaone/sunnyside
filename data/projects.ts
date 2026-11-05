/** Two wash colours plus the accent that drives a project's glass rims. */
export interface ProjectPalette {
  a: string
  b: string
  accent: string
}

export type WorkProject = {
  id: number
  slug: string
  title: string
  description: string
  /** 1:1 artwork. Local path or allow-listed remote URL. */
  cover: string
  url: string
  /** Reads as the genre on a sleeve. */
  genre: string
  /**
   * The shape of problem this project solved, which is not the same thing as
   * `genre`.
   *
   * `genre` is deliberately one-per-release — Developer tools, Corporate,
   * Utility, Web3, DeFi, Biotech — so it works as a sleeve label and as an
   * identity, but grouping by it produces six buckets of one, which is what the
   * existing genre filter on /projects already does. This field is what makes
   * "can you build the thing I need?" answerable, because it buckets the work
   * by what was hard rather than by what it was.
   */
  problem: string
  year: number
  /** Liner notes: personnel line. */
  role: string
  /** Liner notes: personnel chips. */
  stack: string[]
  /** Liner notes tracklist, and the "lyrics" that light up on the turntable. */
  highlights: string[]
  palette: ProjectPalette
  /**
   * Repository name, when the work is public. The shelf reads the star count
   * off this rather than off a positional guess at `FEATURED_PROJECTS`, which
   * drifted the moment the two lists stopped having the same length.
   */
  githubSlug?: string
}

/**
 * Reuses the palettes the rack section already had, promoted to exported
 * data. `a`/`b` drive the ambient wash, `accent` the glass rims.
 */
const PALETTES: ProjectPalette[] = [
  { a: '#315d72', b: '#7eb8c7', accent: '#7eb8c7' },
  { a: '#476b50', b: '#8fc49a', accent: '#8fc49a' },
  { a: '#a55b35', b: '#dc8752', accent: '#dc8752' },
  { a: '#563f70', b: '#9c7fbd', accent: '#9c7fbd' },
  { a: '#36466f', b: '#7489bd', accent: '#7489bd' },
  { a: '#743f3f', b: '#b96862', accent: '#b96862' },
]

function palette(index: number): ProjectPalette {
  return PALETTES[index % PALETTES.length]
}

type Seed = Omit<WorkProject, 'id' | 'palette'>

const SEEDS: Seed[] = [
  {
    slug: 'switchyard',
    title: 'Switchyard',
    description:
      'A control plane for coding agents. Boards and tasks live in one place, a dispatcher claims each one, and results wait in review until someone approves the diff.',
    cover: '/work/switchyard-cover.webp',
    url: 'https://kanban.adityahimaone.space/board/default',
    genre: 'Developer tools',
    problem: 'Internal tools',
    year: 2026,
    role: 'Design and build',
    stack: ['Go', 'SQLite', 'React', 'Vite', 'gRPC'],
    highlights: [
      'One board, one queue, no handoff',
      'Dispatch lands where the task lives',
      'Every run leaves a trace you can read',
      'Review happens where the work happened',
      'Nothing hides in a second tab',
      'The agent stops when the work stops',
    ],
  },
  {
    slug: 'kanon',
    title: 'Kanon',
    description:
      'A studio of six skills that write a brand kit and a design system: marks on one grid, tokens in three layers, and a contrast ledger that publishes its own failures.',
    cover: '/work/kanon-cover.webp',
    url: 'https://design-system.adityahimaone.space/',
    genre: 'Design system',
    problem: 'Design systems',
    year: 2026,
    role: 'Design and build',
    stack: ['Next.js', 'TypeScript', 'Tailwind CSS', 'SVG'],
    highlights: [
      'Marks drawn on one shared grid',
      'Tokens in three layers, not one',
      'Contrast measured, failures printed',
      'Twenty-four cases on the shelf',
      'Six skills, one output',
      'A system you can read, not just use',
    ],
  },
  {
    slug: 'hayoloka',
    title: 'Hayoloka',
    description:
      'A wedding photography studio site built around the gallery: full-bleed frames, honest sequencing, and a booking path that asks three questions instead of twelve.',
    cover: '/work/hayoloka-cover.webp',
    url: 'https://hayoloka.vercel.app/',
    genre: 'Photography',
    problem: 'Marketing sites',
    year: 2025,
    role: 'Design and build',
    stack: ['Next.js', 'TypeScript', 'Tailwind CSS'],
    highlights: [
      'The photographs lead, the copy follows',
      'Galleries that load before the scroll',
      'A booking path of three questions',
      'Type quiet enough for the work',
      'Readable on a phone at a reception',
      'One studio, not a template',
    ],
  },
  {
    slug: 'api-playground',
    title: 'API Playground',
    description:
      'A Postman-like API tester that stays local: workspaces, collections and the last hundred requests live in the browser, with no account to lose access to.',
    cover: '/work/api-playground-cover.webp',
    url: 'https://github.com/adityahimaone/api-playground',
    genre: 'Developer tools',
    problem: 'Local-first tools',
    year: 2026,
    role: 'Design and build',
    stack: ['Next.js', 'TypeScript', 'Zustand', 'Tailwind CSS'],
    highlights: [
      'Every method, every body type',
      'Variables scoped global to collection',
      'History of the last hundred calls',
      'Collections imported and exported as JSON',
      'Auth off by a switch, data never sent',
      'Dark and light, both legible',
    ],
    githubSlug: 'api-playground',
  },
  {
    slug: 'code-snippet-manager',
    title: 'Code Snippet Manager',
    description:
      'A personal snippet library with a dark console face: save, tag and search code, highlighted on the way in and copied in one click.',
    cover: '/work/code-snippet-manager-cover.webp',
    url: 'https://github.com/adityahimaone/code-snippet-manager',
    genre: 'Developer tools',
    problem: 'Local-first tools',
    year: 2025,
    role: 'Design and build',
    stack: ['Next.js', 'TypeScript', 'Zustand', 'Prism.js'],
    highlights: [
      'Snippets that read like they did in the editor',
      'Search across title, language and tag',
      'Copy in one click, no dialog',
      'Storage in the browser, never a server',
      'A console palette with real contrast',
      'Tagging that survives a thousand snippets',
    ],
    githubSlug: 'code-snippet-manager',
  },
  {
    slug: 'primarindo-asia',
    title: 'Primarindo Asia',
    description:
      'A manufacturing group running several plants on one site. Content, catalogue and enquiry flows rebuilt so the sales team stopped maintaining duplicate pages.',
    cover: '/work/primarindo-asia-cover.webp',
    url: 'https://www.primarindo.co.id/',
    genre: 'Corporate',
    problem: 'Marketing sites',
    year: 2024,
    role: 'Frontend lead',
    stack: ['Next.js', 'TypeScript', 'CMS'],
    highlights: [
      'Manufacturing, made scannable',
      'Product lines on one honest grid',
      'Capability without the brochure tone',
      'A public face that matches the plant',
      'The facts first, the pitch after',
      'Clear enough to forward to a client',
    ],
  },
  {
    slug: 'habit-tracker',
    title: 'Habit Tracker',
    description:
      'A habit tracker built around streaks and weekly review rather than daily guilt. Local-first, so the data never leaves the device.',
    cover: '/work/habit-tracker-cover.webp',
    url: 'https://habit.adityahimaone.space/today/',
    genre: 'Utility',
    problem: 'Offline-capable products',
    year: 2026,
    role: 'Design and build',
    stack: ['Next.js', 'TypeScript', 'Tailwind CSS'],
    highlights: [
      'Log the day in a single tap',
      'Miss once and the streak survives',
      'The week reads in one glance',
      'No dashboard sprawl to decode',
      'Small enough to keep every morning',
      'Momentum you can actually see',
    ],
  },
  {
    slug: 'fullstack-wannabe',
    title: 'Fullstack Wannabe',
    description:
      'A local-first learning sandbox: draw a schema, seed it, interrogate it with SQL, then rebuild the same backend in Go, TypeScript and PHP. Every answer is checked against real execution, not a video.',
    cover: '/work/fullstack-wannabe-cover.webp',
    url: 'https://fs.adityahimaone.space/',
    genre: 'Learning',
    problem: 'Learning by doing',
    year: 2026,
    role: 'Design and build',
    stack: ['React', 'TypeScript', 'Vite', 'Tailwind CSS', 'sql.js'],
    highlights: [
      'A schema you draw, not one you are given',
      'Quests checked against real execution',
      'The same API rebuilt in three stacks',
      'Progress stays in the browser',
      'No account, no video, no copy-paste',
      'Four modules, one chain of work',
    ],
  },
  {
    slug: 'seaphantom',
    title: 'SeaPhantom',
    description:
      'A collectible NFT storefront with on-chain verification, wallet connection and a gallery that stays readable on a phone.',
    cover:
      'https://res.cloudinary.com/deselamak/image/upload/v1699777135/portofolio/y2l1g36bjudgsf6yr0eg.webp',
    url: 'https://seaphantom.com',
    genre: 'Web3',
    problem: 'Wallet-connected UI',
    year: 2022,
    role: 'Frontend engineer',
    stack: ['React', 'Web3.js', 'Tailwind CSS'],
    highlights: [
      'Landing page for a Web3 product',
      'Explain the collection, not the jargon',
      'Responsive from the first breakpoint',
      'A door, not a dead end',
      'The pitch ends where the product starts',
      'Built to hand off cleanly',
    ],
  },
  {
    slug: 'seaphantom-p2p',
    title: 'SeaPhantom P2P',
    description:
      'The peer-to-peer trading desk for the same collection: escrow, live order book and settlement states, designed to be readable at a glance.',
    // No artwork for this one: an empty cover draws the generated album-art
    // fallback, the same treatment the "More on GitHub" archive rows use.
    cover: '',
    url: 'https://auth.seaphantom.com/',
    genre: 'DeFi',
    problem: 'Wallet-connected UI',
    year: 2022,
    role: 'Frontend engineer',
    stack: ['React', 'TypeScript', 'Web3.js'],
    highlights: [
      'Account states you can read at a glance',
      'Confirm before the trade commits',
      'Every pending state has feedback',
      'Trading without the guesswork',
      'Failure modes surfaced, not swallowed',
      'The interface admits what it does not know',
    ],
  },
  {
    slug: 'labgrownbeasts',
    title: 'Labgrownbeasts',
    description:
      'A biotech brand site built to make a hard subject feel plain: long-form science, clear structure, and a gallery that loads before you scroll to it.',
    // Generated cover, for the same reason as SeaPhantom P2P above.
    cover: '',
    url: 'https://labgrownbeasts.com/',
    genre: 'Biotech',
    problem: 'Marketing sites',
    year: 2022,
    role: 'Frontend engineer',
    stack: ['Next.js', 'CMS', 'Tailwind CSS'],
    highlights: [
      'A profile site for a small team',
      'The work explains itself',
      'Case studies in the order people arrive',
      'Company story without a sales call',
      'Maintainable by the people who own it',
      'Clarity as a competitive edge',
    ],
  },
]

/**
 * The order the six releases are presented in, by slug.
 *
 * Explicit rather than sorted by year: the section is a curated set, not a
 * changelog, and Switchyard leads because it is the strongest thing here. A
 * year sort put Habit Tracker (2026) first and demoted everything else, and
 * the heading's "newest first" then had to be reworded instead of the data
 * being fixed. Listing the order here means a new project goes where it
 * belongs by being added to this array, and the A1/B1 labels, the sleeve
 * tags and the turntable all follow from it.
 */
const ORDER: readonly string[] = [
  'switchyard',
  'kanon',
  'hayoloka',
  'api-playground',
  'code-snippet-manager',
  'primarindo-asia',
  'habit-tracker',
  'fullstack-wannabe',
  'seaphantom',
  'seaphantom-p2p',
  'labgrownbeasts',
]

const ORDERED_SEEDS = ORDER.map((slug) => {
  const seed = SEEDS.find((candidate) => candidate.slug === slug)
  if (!seed) throw new Error(`ORDER lists "${slug}", which is not in SEEDS`)
  return seed
})

// Anything added to SEEDS without being added to ORDER would silently vanish
// from the site, so fail loudly rather than dropping it.
const missing = SEEDS.filter((seed) => !ORDER.includes(seed.slug)).map(
  (seed) => seed.slug,
)
if (missing.length > 0) {
  throw new Error(`SEEDS entries missing from ORDER: ${missing.join(', ')}`)
}

export const WORK_PROJECTS: WorkProject[] = ORDERED_SEEDS.map(
  (seed, index) => ({
    ...seed,
    id: index,
    palette: palette(index),
  }),
)

/**
 * Look up one project by slug, for `/projects/[slug]`.
 *
 * Every project's `url` points off-site — a repo or a live client site — so the
 * detail pages are the only place any of this work was ever indexable. Until
 * this existed the six projects were reachable solely as outbound links from
 * `/projects`, which means the work itself earned its authority for whichever
 * host it happened to sit on.
 */
export function getProject(slug: string): WorkProject | undefined {
  return WORK_PROJECTS.find((project) => project.slug === slug)
}

/** Seconds of "playback" each project gets in the turntable preview. */
export const PROJECT_PREVIEW_DURATION = 185

export function formatProjectTime(seconds: number) {
  const safe = Math.max(0, Math.round(seconds))
  const minutes = Math.floor(safe / 60)
  return `${minutes}:${(safe % 60).toString().padStart(2, '0')}`
}

/** A1..A3 then B1..B3 — the six projects split into two sides. */
export function trackLabel(index: number, count = WORK_PROJECTS.length) {
  const perSide = Math.ceil(count / 2)
  const side = index < perSide ? 'A' : 'B'
  return `${side}${(index % perSide) + 1}`
}
