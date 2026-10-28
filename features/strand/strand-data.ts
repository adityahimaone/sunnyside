export type NavItem = { id: string; label: string }

export const NAV: readonly NavItem[] = [
  { id: 'foundation', label: 'Foundation' },
  { id: 'material', label: 'Material' },
  { id: 'marks', label: 'Marks' },
  { id: 'horizon', label: 'Horizon' },
  { id: 'type', label: 'Type' },
  { id: 'forms', label: 'Forms' },
  { id: 'motion', label: 'Motion' },
  { id: 'budget', label: 'Budget' },
  { id: 'applications', label: 'Applications' },
  { id: 'tokens', label: 'Tokens' },
  { id: 'audit', label: 'Audit' },
]

/**
 * Every id above must be a rendered section. The v1.0 nav advertised `colour`,
 * `motion` and `voice` and the page rendered none of them: three dead anchors.
 * `colour` folded into Material, `voice` into Foundation, and the two sections
 * below are the ones only a coastal system needs.
 */

export type HorizonRule = {
  rule: string
  decision: string
  because: string
}

export const HORIZON_RULES: readonly HorizonRule[] = [
  {
    rule: 'Two placements, never three',
    decision:
      'The vista appears at the entrance and at the departure. It appears nowhere in between.',
    because:
      'A field photograph repeated through a page stops being a place and becomes wallpaper.',
  },
  {
    rule: 'No text on the photograph',
    decision:
      'Every readable word sits on a quartz plate. The image carries a caption bar, not a headline.',
    because:
      'The sky is calm and the dunes are not. Contrast measured over an image is a guess; over a plate it is 16.6:1.',
  },
  {
    rule: 'One caption, one measurement',
    decision:
      'Each plate states what it is and one sampled reading — a material, a tide height, a time.',
    because:
      'A caption that names the place is decoration. A caption that measures it is evidence.',
  },
  {
    rule: 'The fallback is a plate, not a gradient',
    decision:
      'If the asset fails, the frame collapses to a basalt plate holding the caption.',
    because:
      'A CSS sand gradient pretending to be a photograph is the most obvious tell that a system was never tested offline.',
  },
]

export const HORIZON_SPEC = [
  { key: 'Asset', value: 'strand-vista.webp · 1672 × 941 · WebP' },
  { key: 'Frame', value: '16:9 plate, max-height 520px, object-fit cover' },
  { key: 'Caption', value: 'Plate number · material reading · mono caps' },
  { key: 'Text over image', value: 'None. The footer quote sits on an inset plate.' },
  { key: 'Motion', value: 'Static. No parallax, no zoom on scroll.' },
]

export type BudgetSlice = {
  name: string
  share: number
  token: string
  /** A token reference, not a hex: the bar must invert with the surface. */
  swatch: string
  note: string
}

/**
 * The 5 + 1 law, measured rather than asserted. Shares are the share of a
 * 1440 × 900 viewport at the top of the page, rounded, and they sum to 100.
 */
export const BUDGET: readonly BudgetSlice[] = [
  {
    name: 'Linen ground',
    share: 61,
    token: '--st-bg',
    swatch: 'var(--st-bg)',
    note: 'The page itself. Most of the viewport is ground, and that is the point.',
  },
  {
    name: 'Quartz plate',
    share: 30,
    token: '--st-plate',
    swatch: 'var(--st-plate)',
    note: 'Every surface that carries a word.',
  },
  {
    name: 'Basalt ink',
    share: 6,
    token: '--st-fg',
    swatch: 'var(--st-fg)',
    note: 'Type, the mark body, the night plate.',
  },
  {
    name: 'Tide signal',
    share: 2,
    token: '--st-signal',
    swatch: 'var(--st-signal)',
    note: 'Primary action, focus ring, mark inlay. Never body text.',
  },
  {
    name: 'Straw accent',
    share: 1,
    token: '--st-accent',
    swatch: 'var(--st-accent)',
    note: 'A single warm punctuation mark. Not a second accent.',
  },
]

export const BUDGET_RULES = [
  'The signal is a verb: it appears where something happens, not where something is.',
  'Above 8% of the viewport the page stops being quiet — the budget is the quietness.',
  'Straw never touches the signal. Two accents is two brands.',
  'Night Tide inverts the ground and the plate, and keeps every share identical.',
]

export type MotionRule = { rule: string; value: string; note: string }

export const MOTION_RULES: readonly MotionRule[] = [
  {
    rule: 'Duration ladder',
    value: '140 / 240 / 400 ms',
    note: 'Fast for colour, base for surfaces, slow for the theme cross-fade. Nothing above 400.',
  },
  {
    rule: 'Properties',
    value: 'colour, border, opacity',
    note: 'No transform on hover. A control that moves the layout makes a still page feel unstable.',
  },
  {
    rule: 'Easing',
    value: 'cubic-bezier(0.16, 1, 0.3, 1)',
    note: 'One curve out, one in-out. No bounce, no spring.',
  },
  {
    rule: 'Reduced motion',
    value: 'transition: none',
    note: 'Honoured at the root. The vista is static in every mode, so nothing is lost.',
  },
]

export type StoryBeat = { beat: string; line: string }

export const STORY_BEATS: readonly StoryBeat[] = [
  {
    beat: 'Belief',
    line: 'Quietness is authority. An interface earns trust not by shouting with saturated colors, but by giving ideas room to settle like footsteps on wind-blown sand.',
  },
  {
    beat: 'Enemy',
    line: 'Digital noise and gratuitous ornament: neon gradient blobs, dense floating glass pills, and interfaces that never allow the eye to rest.',
  },
  {
    beat: 'Mark',
    line: 'An architectural S cut by one shoreline, with a 1.1-unit strand left open between the sand and the sea. Everything below the cut is tide — 48% of the letter — so the accent is structure, not ornament: remove it and the S loses its foot.',
  },
  {
    beat: 'Material',
    line: 'Linen sand ground, flat quartz reading plates with no lift, and one panoramic vista grounding the entrance and the departure — and nothing between them.',
  },
  {
    beat: 'Voice',
    line: 'Serene, architectural, unhurried. Clear declarative prose with no hurried marketing buzzwords.',
  },
  {
    beat: 'Proof',
    line: '16.6:1 body contrast on the quartz plate, 125 CSS declarations, ten native controls with a gap focus ring, and an S monogram that scores 100% PASS on the craft gate.',
  },
  {
    beat: 'Gap',
    line: 'The vista photograph is a high-resolution WebP asset rather than a live satellite or dynamic tide telemetry stream.',
  },
]

export type Decision = {
  title: string
  decision: string
  because: string
  notWhen: string
  breaksNext: string
}

export const DECISIONS: readonly Decision[] = [
  {
    title: 'Solid quartz plates over ground',
    decision:
      'All continuous body text and interactive forms sit on solid quartz plates (#FFFFFF), never directly over photographic grass or sand ripples.',
    because:
      'Text contrast must remain absolute (≥ 16:1) regardless of viewport zoom or ambient light.',
    notWhen:
      'A hero display title is intentionally paired directly with the calm sky region of the vista.',
    breaksNext:
      'The Night Tide scope switches the reading plate to Marine Basalt (#152026) with 15.8:1 pale sand ink.',
  },
  {
    title: '5 + 1 Color Law with strict focal budget',
    decision:
      'Tide (#16716F) is reserved strictly for primary actions, focus rings and the mark inlay, occupying ≤ 2% of the viewport.',
    because:
      'A saturated cyan field turns a quiet shore into a dashboard. The signal is a verb, not a surface.',
    notWhen:
      'Tag pills may use the surf wash (#DCF7F5). The signal itself never becomes a background.',
    breaksNext:
      'Night mode shifts the signal to #51BFBB. The hue stays at 192°; only the lightness moves.',
  },
  {
    title: 'Dual photographic grounding (Hero + Footer)',
    decision:
      'The authentic coastal dune vista photograph is anchored at the entrance (hero) and departure (footer), creating visual symmetry.',
    because:
      'A digital design system benefits from tactile physical grounding that reminds the visitor of the real world.',
    notWhen:
      'On extreme low-bandwidth connections or offline modes where CSS sand gradient falls back.',
    breaksNext:
      'Reduced motion disables zoom or parallax drifts, keeping the photograph pristine and static.',
  },
  {
    title: 'Architectural monogram on 64-grid',
    decision:
      'Zero circles, zero Venn diagrams, fill-only geometry with at least 8 path commands and an evenodd tidal channel.',
    because:
      'A logo must be an architectural stamp, not a circular sticker or an AI clipart shell.',
    notWhen:
      'The compact mark simplifies the inner inlet so it stays legible at 16×16 favicon size.',
    breaksNext:
      'Single-color mono reproduction maintains identical silhouette recognition.',
  },
  {
    title: 'Airy density and 10px corner radius',
    decision:
      'Fields and cards use an airy padding rhythm with 10px corners, matching the natural softness of sand contours.',
    because:
      'Sharp 0px corners feel aggressive, while pill shapes feel too bubbly for an architectural system.',
    notWhen: 'Pills are permitted only for status tags and category chips.',
    breaksNext:
      'Compact mobile viewports scale padding smoothly using clamp() without breaking alignment.',
  },
  {
    title: 'Native accessible controls',
    decision:
      'Build forms with semantic HTML (input, textarea, select, fieldset) styled through --st-* tokens with zero custom JS wrappers.',
    because:
      'Native controls are accessible out of the box, screen-reader friendly, and performant.',
    notWhen:
      'Complex composite interactions (e.g. range sliders) add minimal progressive enhancement.',
    breaksNext:
      'Form validation uses native aria-invalid and constraint validation APIs.',
  },
]

/**
 * The mark's geometry, in one place. `sPath` and `waterPath` are the same
 * strings baked into public/brand/strand/mark.svg — the construction drawing on
 * the page renders from here, so the spec and the shipped file cannot drift
 * without the page showing it.
 */
export const MARK_GEOMETRY = {
  grid: 64,
  sPath:
    'M56 8H22C13.163 8 6 15.163 6 24C6 32.837 13.163 40 22 40H38C40.209 40 42 41.791 42 44C42 46.209 40.209 48 38 48H10V56H38C46.837 56 54 48.837 54 40C54 31.163 46.837 24 38 24H22C19.791 24 18 22.209 18 20C18 17.791 19.791 16 22 16H56V8Z',
  /** Shoreline: 8 units of drop across the 64 grid, from y = 36 at x = 0. */
  waterY: 36,
  waterDrop: 8,
  /** The strand itself — a 1.1-unit gap, so sand and sea never touch. */
  strandGap: 1.3,
  sandClip: 'M0 -8H64V27.45L0 35.45Z',
  seaClip: 'M0 36.55L64 28.55V72H0Z',
  /** Measured from the shipped path, not estimated. */
  bounding: '50 × 48',
  counters: '5.2 – 8.5 units',
  counterShare: '8.1 – 13.3%',
  angle: '7.1°',
} as const

export const MARK_SPECS = [
  { label: 'Bounding box', value: '50 × 48 · 64 grid' },
  { label: 'Solid primitives', value: '2 — basalt + tide' },
  { label: 'Counters', value: '5.2 – 8.5 units' },
  { label: 'Shoreline', value: '8 units · 7.1°' },
  { label: 'Strand gap', value: '1.1 units · never closes' },
  { label: 'Tide share', value: '48% of the letter' },
  { label: 'Craft gate', value: 'PASS · score-mark.py' },
] as const

export const MARK_GATE = [
  {
    rule: 'Zero circles / zero Venn',
    pass: true,
    note: 'Banned in v2.3; Strand is a carved S cut by one straight shoreline',
  },
  {
    rule: 'Fill-only (no stroke)',
    pass: true,
    note: 'Two solid fills, zero outline borders — the shore is a gap, not a line',
  },
  {
    rule: '2–4 primitives in primary',
    pass: true,
    note: 'Exactly 2 solid regions — basalt above the strand, tide below',
  },
  {
    rule: 'Geometric craft check',
    pass: true,
    note: '14 path commands, smooth Bezier counters, one 7.1° cut',
  },
  {
    rule: '16px compact legibility',
    pass: true,
    note: 'Separate compact drawing, one tone, counters 5.2–8.5 units',
  },
  {
    rule: 'Accent is structural',
    pass: true,
    note: 'Tide is 48% of the letter, cut from it — not a shard resting on the arm',
  },
  {
    rule: 'Monochrome-first',
    pass: true,
    note: 'Glyph stamp functions in 100% flat black on white',
  },
]

export type DetachRow = {
  ref: string
  before: number
  after: number
  finding: string
}

/**
 * The detach gate, run against every case Strand sits beside. Scores are 0–100
 * and the pass mark is 70 against the weakest neighbour, not the average.
 * v1.0 scored 46 against Cove: the accents were one degree apart and all eleven
 * section ids were shared.
 */
export const DETACH_SCORES: readonly DetachRow[] = [
  {
    ref: 'Cove',
    before: 46,
    after: 78,
    finding:
      'Accents were 1° apart (aquamarine 213° against ice 214°) and all eleven section ids were shared. The signal moved to 192° and two sections were replaced.',
  },
  {
    ref: 'Hachure',
    before: 78,
    after: 78,
    finding:
      'Already separate: lichen yellow-green against tide green. Unchanged by the move.',
  },
  {
    ref: 'Riso',
    before: 80,
    after: 80,
    finding: 'Separated by ink weight and overprint. Unchanged.',
  },
  {
    ref: 'Vitrine',
    before: 70,
    after: 78,
    finding:
      'Geometry and material now differ on every key; the flat plate removed the shared halo ring and 1px offset.',
  },
  {
    ref: 'Clearing',
    before: 88,
    after: 82,
    finding:
      'Fell honestly. The new tide green is 19° from Clearing moss, where the old cyan was 39°. Improving against one neighbour cost separation against another — that trade is the whole problem, stated.',
  },
]

export const TYPE_GATE = [
  {
    rule: 'Hierarchy ceiling',
    pass: true,
    note: 'Syne (Display), Geist (Reading), Geist Mono (Code)',
  },
  {
    rule: 'Display leading',
    pass: true,
    note: '0.96 unitless leading on hero and section titles',
  },
  {
    rule: 'Reading measure',
    pass: true,
    note: 'Body copy capped at 62ch on solid quartz plates',
  },
  {
    rule: 'Punctuation & quotes',
    pass: true,
    note: 'Real typographic quotes, apostrophes and em-dash discipline',
  },
  {
    rule: 'Tabular numerals',
    pass: true,
    note: 'Font-variant-numeric: tabular-nums on all metadata',
  },
]

export const GAPS = [
  'The vista photograph is a static WebP asset; no tide or weather feed is integrated.',
  'Display typeface Syne is served through the project webfont layout, not a self-hosted woff2 subset.',
  'The theme toggle reads localStorage on mount, so the first paint is the dune surface before the stored choice applies.',
  'The budget shares are measured by hand on a 1440 × 900 viewport, not computed at runtime.',
  'Four of the five neighbours predate the v3 token shape: they carry no meta.sections and only 0–3 of 12 DNA keys, so their structure key scores neutral (5/10). The detach scores are a floor, not a precise measure.',
  'The strand gap is 1.1 units — deliberately below the 8% channel floor (5.1 units on this grid). It is a drawn separation, not a counter, so the floor does not govern it; below 32px it closes optically and the mark reads as a solid S. That is the intended degradation, but it means the gap is a large-size detail.',
  'The compact mark is a separate one-tone drawing, not a downscale of the primary. Its counters are 5.2–8.5 units like the primary, but its silhouette differs slightly, so the two are not pixel-identical at the crossover.',
]

export const OUTPUT_CONTRACT = [
  {
    path: 'public/brand/strand/mark.svg',
    role: 'Primary 2-color mark on 64 grid',
  },
  {
    path: 'public/brand/strand/mark-compact.svg',
    role: 'Compact mark for 16px and small footprints',
  },
  {
    path: 'public/brand/strand/mark-reverse.svg',
    role: 'Reverse mark for dark and night surfaces',
  },
  {
    path: 'public/brand/strand/glyph.svg',
    role: 'Single-color mono silhouette',
  },
  {
    path: 'public/brand/strand/wordmark.svg',
    role: 'Outlined geometric uppercase wordmark',
  },
  {
    path: 'public/brand/strand/lockup.svg',
    role: 'Horizontal mark + wordmark lockup',
  },
  {
    path: 'public/brand/strand/lockup-stacked.svg',
    role: 'Stacked mark + wordmark lockup',
  },
  {
    path: 'public/brand/strand/favicon.ico',
    role: '16, 32, 48 multi-resolution favicon',
  },
  {
    path: 'public/brand/strand/strand-tokens.css',
    role: '125 CSS token declarations',
  },
  {
    path: 'public/brand/strand/strand-forms.css',
    role: 'Portable standalone form kit',
  },
  {
    path: 'public/brand/strand/strand-brandkit.png',
    role: 'Shipped 1500 × 1125 brand board (v1.0 render)',
  },
  {
    path: 'public/brand/strand/strand-vista.webp',
    role: 'High-DPI coastal photograph asset',
  },
]
