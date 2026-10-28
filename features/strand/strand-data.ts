export type NavItem = { id: string; label: string }

export const NAV: readonly NavItem[] = [
  { id: 'foundation', label: 'Foundation' },
  { id: 'material', label: 'Material' },
  { id: 'marks', label: 'Marks' },
  { id: 'colour', label: 'Colour' },
  { id: 'type', label: 'Type' },
  { id: 'forms', label: 'Forms' },
  { id: 'motion', label: 'Motion' },
  { id: 'voice', label: 'Voice' },
  { id: 'applications', label: 'Applications' },
  { id: 'tokens', label: 'Tokens' },
  { id: 'audit', label: 'Audit' },
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
    line: 'An architectural S carved from dune ridges. A 5.2-unit tidal channel flows through the center, anchored by an aquamarine wedge in the coastal inlet.',
  },
  {
    beat: 'Material',
    line: 'Linen sand ground, quartz white reading plates, and an authentic panoramic vista photograph grounding both the entrance and departure.',
  },
  {
    beat: 'Voice',
    line: 'Serene, architectural, unhurried. Clear declarative prose with no hurried marketing buzzwords.',
  },
  {
    beat: 'Proof',
    line: '16.5:1 body contrast on quartz plate, 124 CSS declarations, ten accessible native controls, and an S monogram that scores 100% PASS on the v2.5 craft gate.',
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
      'Tidal Aquamarine (#3B8898) is reserved strictly for primary actions, focus rings and the mark inlay, occupying ≤ 8% of the viewport.',
    because:
      'Flooding the canvas with cyan destroys the feeling of a quiet coastal retreat.',
    notWhen:
      'Tag pills or subtle indicator chips may use an 8% tint of aquamarine wash.',
    breaksNext:
      'Night mode shifts the signal to luminescent #4EA4B5 for crisp dark readability.',
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

export const MARK_GATE = [
  {
    rule: 'Zero circles / zero Venn',
    pass: true,
    note: 'Banned in v2.3; Strand uses non-circular sweeping dune crests',
  },
  {
    rule: 'Fill-only (no stroke)',
    pass: true,
    note: 'Solid basalt and aquamarine fills, zero outline borders',
  },
  {
    rule: '2–4 primitives in primary',
    pass: true,
    note: 'Exactly 2 solid paths in primary (Basalt body + Aquamarine wedge)',
  },
  {
    rule: 'Geometric craft check',
    pass: true,
    note: '14 path commands with smooth Bezier curves and evenodd counter-form',
  },
  {
    rule: '16px compact legibility',
    pass: true,
    note: 'Simplified monolithic compact mark with contrast spread 0.28',
  },
  {
    rule: 'Monochrome-first',
    pass: true,
    note: 'Glyph stamp functions in 100% flat black on white',
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
  'The vista photograph is a static WebP image; local meteorological or tide feeds are not integrated.',
  'Display typeface Syne is served through the project webfont layout instead of a custom in-repo woff2 bundle.',
  'Color mode toggle is stored in browser localStorage and operates client-side.',
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
    role: '124 CSS token declarations',
  },
  {
    path: 'public/brand/strand/strand-forms.css',
    role: 'Portable standalone form kit',
  },
  {
    path: 'public/brand/strand/strand-brandkit.png',
    role: 'Rendered 3000 × 2250 brand board',
  },
  {
    path: 'public/brand/strand/strand-vista.webp',
    role: 'High-DPI coastal photograph asset',
  },
]
