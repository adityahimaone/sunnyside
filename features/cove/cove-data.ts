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
    line: 'Depth should clarify. A surface earns its transparency by holding one thing you can actually read.',
  },
  {
    beat: 'Enemy',
    line: 'Glass as wallpaper: five stacked panels, body copy on a blur, a blue-purple gradient doing the work of an idea.',
  },
  {
    beat: 'Mark',
    line: 'A squared C is the cove. One ice inlay on the lower lip is the waterline; remove it and the letter still stands.',
  },
  {
    beat: 'Material',
    line: 'One translucent layer over one field, a lit cut edge, one specular, and a solid plate for anything you have to read.',
  },
  {
    beat: 'Voice',
    line: 'Calm, exact, unhurried. Museum wall text, not a launch post.',
  },
  {
    beat: 'Proof',
    line: '14 measured contrast pairs, 161 tokens, ten native controls, a 17.14:1 body pair and a C that reads at 16px.',
  },
  {
    beat: 'Gap',
    line: 'The supplied field image was not in the workspace; the fallback is CSS. Glass is a CSS approximation, not true lensing.',
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
    title: 'One glass layer, one reading plate',
    decision:
      'Glass is for chrome that floats over the field. Anything you read sits on a solid plate.',
    because:
      'Text contrast must not depend on what is behind the blur. The field is the atmosphere, not the page.',
    notWhen:
      'A transient overlay must sit above content; use a solid scrim, not another glass sheet.',
    breaksNext:
      'The Frost scope lightens the glass; the reading plate still carries the same text roles.',
  },
  {
    title: 'The field is the image',
    decision:
      'The blue caustic is one background field with a single swap token: --cv-field-image.',
    because:
      'A photographed or rendered field gives the glass something real to refract. A gradient alone is a mood, not a material.',
    notWhen:
      'There is no field to show; use the solid Abyss ground and drop the glass.',
    breaksNext:
      'The supplied image is not here. The CSS fallback is deliberate; when the file arrives, it replaces the gradients at one token.',
  },
  {
    title: 'Blue is a ground, not a gradient',
    decision:
      'Abyss and Foam carry the page; Ice is the only field allowed to shout. No purple-blue mesh.',
    because:
      'A restrained blue reads as water and glass. A gradient mesh reads as an AI launch page.',
    notWhen:
      'A status needs attention; Clay, Moss and Amber are roles, not decoration.',
    breaksNext:
      'Ice is light, so it needs dark ink on top. On Frost, links use the deeper focus blue instead.',
  },
  {
    title: 'Serif for the name, sans for the work',
    decision:
      'Instrument Serif is limited to the hero, section titles and the wordmark. Instrument Sans carries every control, label and paragraph.',
    because:
      'The serif gives the system a calm editorial voice; the sans keeps 14px fields and 16px body unremarkable in the right way.',
    notWhen:
      'A card heading needs to sit inside a dense table; use the reading face at 600.',
    breaksNext:
      'Instrument Serif ships one weight (400). Do not synthesise a bold; raise the size or use the italic for emphasis.',
  },
  {
    title: 'Frost is a surface, not a second brand',
    decision:
      'Deep is the default; Frost swaps the same semantic roles onto a light ground.',
    because:
      'A system should survive a bright room without becoming a different palette or a second logo.',
    notWhen:
      'The hero and the material stages are the proof; they stay Deep in both surfaces.',
    breaksNext:
      'Dark plates inside Frost use a local deep scope. If a token changes, change the scope in the same commit.',
  },
  {
    title: 'No glass on body copy',
    decision:
      'Paragraphs, labels, errors and table cells never sit directly on a translucent surface.',
    because:
      'A blur is not a contrast guarantee. The reading plate is the only place the copy lives.',
    notWhen:
      'A caption is decorative and repeated elsewhere; still prefer the plate.',
    breaksNext:
      'The glass edge can look like a border. Keep it 1px and do not let it become the only boundary.',
  },
]

export type MarkPath = { d: string; accent?: boolean }

export type MarkFamily = {
  id: string
  name: string
  family: string
  verdict: 'kept' | 'rejected'
  reason: string
  paths: readonly MarkPath[]
}

export const MARK_FAMILIES: readonly MarkFamily[] = [
  {
    id: 'cove-c',
    name: 'Cove C',
    family: 'Architectural monogram',
    verdict: 'kept',
    reason:
      'A squared C with 45° walls is the cove itself; the ice inlay on the lower lip is the waterline. It reads at 16px and joins the serif wordmark.',
    paths: [
      { d: 'M56 8H28L8 24V40L28 56H56V44H28L20 36V28L28 20H56Z' },
      { d: 'M40 36H56V44H40Z', accent: true },
    ],
  },
  {
    id: 'ribbon',
    name: 'Liquid ribbon',
    family: 'Continuous ribbon',
    verdict: 'rejected',
    reason:
      'A wavy ribbon is the first water metaphor everyone draws. At 128px it reads as a brush stroke; at 16px it is a squiggle.',
    paths: [
      {
        d: 'M8 44C8 32 16 30 22 36C28 42 36 42 42 36C48 30 56 32 56 44V52C56 54 54 54 52 52C48 46 40 46 34 52C28 58 20 54 16 50C12 46 8 48 8 50Z',
      },
      { d: 'M34 34H44V42H34Z', accent: true },
    ],
  },
  {
    id: 'pane',
    name: 'Wave pane',
    family: 'Horizon & counter-form',
    verdict: 'rejected',
    reason:
      'A square with a wave bottom shares its outer silhouette with Sunnyside’s tile. The idea is right; the shape is already in the library.',
    paths: [
      {
        d: 'M8 8H56V40C50 34 44 46 38 40C32 34 26 46 20 40C16 36 12 38 8 42Z',
      },
      { d: 'M8 8H56V14H8Z', accent: true },
    ],
  },
  {
    id: 'waves',
    name: 'Two waves',
    family: 'Brutalist louvers',
    verdict: 'rejected',
    reason:
      'Two waves read as a water icon or a menu glyph, not a brand. The accent makes it a weather symbol.',
    paths: [
      {
        d: 'M8 24C16 16 24 32 32 24C40 16 48 32 56 24V32C48 40 40 24 32 32C24 40 16 24 8 32Z',
      },
      {
        d: 'M8 40C16 32 24 48 32 40C40 32 48 48 56 40V48C48 56 40 40 32 48C24 56 16 40 8 48Z',
        accent: true,
      },
    ],
  },
]

export type GateCheck = {
  gate: string
  title: string
  result: 'pass'
  evidence: string
}

export const MARK_GATE: readonly GateCheck[] = [
  {
    gate: 'A',
    title: 'Zero circle / zero Venn',
    result: 'pass',
    evidence:
      'No <circle> in the family. The C is a filled letterform with 45° walls, not a disc or a ring.',
  },
  {
    gate: 'B',
    title: 'Fill-only',
    result: 'pass',
    evidence:
      'No stroke in mark.svg or mark-compact.svg. The inlay touches the lower lip; the compact is one solid path.',
  },
  {
    gate: 'C',
    title: '2–4 primitives, one accent',
    result: 'pass',
    evidence:
      'Two primitives in the primary (C + ice inlay), one in the compact. Ice appears once, as the waterline.',
  },
  {
    gate: 'D',
    title: 'One family, distinct silhouette',
    result: 'pass',
    evidence:
      'Architectural monogram. The C is distinct from Vitrine’s V, Huginn’s brackets, Riso’s planes, Hachure’s ridge and Sunnyside’s tile.',
  },
  {
    gate: 'E',
    title: 'Compact is simpler',
    result: 'pass',
    evidence:
      'The compact is a separate one-path C with heavier walls; the primary is the same letter plus the inlay.',
  },
  {
    gate: 'F',
    title: 'Test 16px first',
    result: 'pass',
    evidence:
      'score-mark.py PASS: 16px contrast, no specks, no thin strokes. The C stays a C at 16.',
  },
]

export const TYPE_GATE = [
  'Three voices: Instrument Serif display, Instrument Sans reading, Geist Mono label.',
  'Body 16–18px; inputs 14px, 16px on mobile; captions 13px.',
  'Unitless leading: display 0.96, body 1.6; weight ≥400 below 18px.',
  'Measure 60–75 characters; balance on headings, pretty on paragraphs.',
  'Tracking in em; tabular numbers on counts and ratios; real specimens, not lorem.',
  'The wordmark is outlined; no paragraph is set in Instrument Serif.',
] as const

export const TYPE_RESEARCH = {
  title: 'Why Instrument',
  body: 'Instrument Serif and Instrument Sans were drawn as a pair: a high-contrast serif for the few display moments, a Swiss-neutral sans for every field, label and paragraph. The serif gives Cove its calm editorial voice without turning the product into a magazine; the sans keeps 14px inputs and 16px body unremarkable in the right way. Geist Mono is already the project label face, so the metadata stays honest without adding a third family for its own sake.',
  sources: [
    {
      label: 'TypePairs — Instrument Serif + Instrument Sans',
      href: 'https://typepairs.com/pairs/instrument-serif-instrument-sans',
    },
    {
      label: 'Google Fonts — Instrument Serif',
      href: 'https://fonts.google.com/specimen/Instrument+Serif',
    },
    {
      label: 'Google Fonts — Instrument Sans',
      href: 'https://fonts.google.com/specimen/Instrument+Sans',
    },
    {
      label: 'Apple HIG — Materials',
      href: 'https://developer.apple.com/design/human-interface-guidelines/materials',
    },
    {
      label: 'better-typography',
      href: 'https://www.ui-skills.com/skills/jakubkrehel/better-typography',
    },
  ],
} as const

export const MOTION = [
  {
    name: 'Press and hover',
    value: '120ms',
    note: 'One physical response; no bounce.',
  },
  {
    name: 'State change',
    value: '240ms',
    note: 'Colour, border and ring settle together.',
  },
  {
    name: 'Entrance',
    value: '480ms',
    note: 'Only for a first reveal; never a loop.',
  },
  {
    name: 'Ease',
    value: 'cubic-bezier(0.22, 1, 0.36, 1)',
    note: 'One ease for the system.',
  },
  {
    name: 'Reduced motion',
    value: '0.01ms',
    note: 'The field is static; the page still works.',
  },
] as const

export const VOICE = {
  weAre: 'Calm, exact, unhurried, specific.',
  weAreNot: 'Frosted, vague, hyped, blue-purple.',
  say: [
    'One layer. Read on the plate.',
    'Use at least 8 characters.',
    'Depth is a surface, not a fog.',
  ],
  dontSay: [
    'Oops! Something went wrong.',
    'Immerse yourself in seamless glass.',
    'Unlock the power of liquid experiences.',
  ],
  quote: 'Depth is a surface, not a fog.',
  contexts: [
    ['Success', 'Request staged. This specimen does not call a server.'],
    ['Error', 'Use at least 8 characters.'],
    ['Headline', 'A calmer kind of depth.'],
  ],
} as const

export type Colour = {
  name: string
  value: string
  role: string
  ratio: string
}

export const COLOUR_MAIN: readonly Colour[] = [
  {
    name: 'Abyss',
    value: '#06121C',
    role: 'Ground, ink, the deep plate',
    ratio: '17.14:1',
  },
  {
    name: 'Foam',
    value: '#E9F6FB',
    role: 'Body text, light ground',
    ratio: '17.14:1',
  },
  {
    name: 'Ice',
    value: '#7CE7FF',
    role: 'The one loud field',
    ratio: '13.26:1',
  },
  {
    name: 'Horizon',
    value: '#2E5F78',
    role: 'Structure, mid-tone',
    ratio: 'surface',
  },
  {
    name: 'Mist',
    value: '#9DBCCB',
    role: 'Secondary text on deep',
    ratio: '9.44:1',
  },
  {
    name: 'Moss',
    value: '#7BE0C3',
    role: 'Success, never decoration',
    ratio: '11.96:1',
  },
]

export type Resource = {
  path: string
  status: 'used' | 'substituted' | 'not used'
  evidence: string
  note?: string
}

export const RESOURCES: readonly Resource[] = [
  {
    path: 'SKILL.md',
    status: 'used',
    evidence: 'The v2.4 method for the track, mark, story, proof and audit.',
  },
  {
    path: 'references/brief.md',
    status: 'used',
    evidence: 'design/brand/cove/brief.md',
  },
  {
    path: 'references/logo-system.md',
    status: 'used',
    evidence: 'public/brand/cove/mark.svg',
    note: 'One 64 grid, one construction, no stroke and no circle.',
  },
  {
    path: 'references/craft-bar.md',
    status: 'used',
    evidence: 'design/brand/cove/story.md',
    note: 'The constructed track; the cast is optional and skipped.',
  },
  {
    path: 'references/storytelling.md',
    status: 'used',
    evidence: 'design/brand/cove/story.md',
    note: 'Seven beats and six decision cards.',
  },
  {
    path: 'references/form-theming.md',
    status: 'used',
    evidence: 'features/cove/tokens.json',
    note: 'Theme DNA drives the field tokens and the portable kit.',
  },
  {
    path: 'references/typography.md',
    status: 'used',
    evidence: 'the Type section',
    note: 'Three voices, real specimens, unitless leading.',
  },
  {
    path: 'references/visual-directions.md',
    status: 'used',
    evidence: 'the Material section',
    note: 'Liquid glass: one layer, solid reading plate, measured composite.',
  },
  {
    path: 'references/verification.md',
    status: 'used',
    evidence: 'docs/cove-design-system-audit.md',
  },
  {
    path: 'scripts/score-mark.py',
    status: 'used',
    evidence: 'public/brand/cove',
    note: 'PASS: no circle, no stroke, two primitives in the primary.',
  },
  {
    path: 'scripts/extract-wordmark.py',
    status: 'used',
    evidence: 'public/brand/cove/wordmark.svg',
    note: 'Instrument Serif 400, four glyph paths, no <text>.',
  },
  {
    path: 'scripts/audit.mjs',
    status: 'used',
    evidence: 'design/brand/cove/audit.json',
  },
  {
    path: 'scripts/qa.mjs',
    status: 'used',
    evidence: 'docs/cove-qa.md',
  },
  {
    path: 'scripts/brand-forge.mjs',
    status: 'not used',
    evidence: 'The four directions were drawn by hand from the water world.',
  },
  {
    path: 'scripts/cast-forge.mjs',
    status: 'not used',
    evidence:
      'No cast in the constructed kit; the logo card and rule carry it.',
  },
  {
    path: 'templates/design-system.html',
    status: 'not used',
    evidence: 'The proof is a host TSX route, not a standalone specimen.',
  },
]

export type ContractItem = {
  item: string
  status: 'shipped' | 'partial' | 'gap'
  evidence: string
  note?: string
}

export const OUTPUT_CONTRACT: readonly ContractItem[] = [
  {
    item: 'One-page brief with assumptions marked',
    status: 'shipped',
    evidence: 'design/brand/cove/brief.md',
  },
  {
    item: 'Four directions, one kept, three rejected with reasons',
    status: 'shipped',
    evidence: 'the Marks section',
  },
  {
    item: 'Story spine and six decision cards',
    status: 'shipped',
    evidence: 'design/brand/cove/story.md',
  },
  {
    item: 'Mark, compact mark, glyph and mono',
    status: 'shipped',
    evidence:
      'public/brand/cove/mark.svg, mark-compact.svg, glyph.svg, mark-mono.svg',
  },
  {
    item: 'Wordmark as outlines',
    status: 'shipped',
    evidence: 'public/brand/cove/wordmark.svg',
    note: 'Instrument Serif 400, four glyph paths, no live text.',
  },
  {
    item: 'Horizontal, stacked and reversed lockups',
    status: 'shipped',
    evidence: 'public/brand/cove/lockup*.svg',
  },
  {
    item: 'Brand board',
    status: 'shipped',
    evidence: 'design/brand/cove/cove-brandkit.png',
  },
  {
    item: 'Favicon and app icon set',
    status: 'shipped',
    evidence:
      'public/brand/cove/favicon.ico, icon.svg, apple-icon-180.png, icon-192.png, icon-512.png',
  },
  {
    item: 'Primitive → semantic → component tokens, CSS and JSON',
    status: 'shipped',
    evidence:
      'features/cove/tokens.json → cove-tokens.css + public/brand/cove/cove-tokens.json',
    note: '161 declarations across four layers.',
  },
  {
    item: 'Theme DNA and portable form kit',
    status: 'shipped',
    evidence:
      'features/cove/tokens.json (theme) + public/brand/cove/cove-forms.css',
  },
  {
    item: 'Guidelines that explain why, when not, and what breaks next',
    status: 'shipped',
    evidence: 'design/brand/cove/README.md',
  },
  {
    item: 'Live design-system case with ten native controls',
    status: 'shipped',
    evidence: 'app/design-system/cove/page.tsx',
  },
  {
    item: 'Agent-readable Markdown twin',
    status: 'shipped',
    evidence: 'app/design-system/cove/llms.txt/route.ts',
  },
  {
    item: 'Hard-gate evidence and objective score',
    status: 'shipped',
    evidence: 'docs/cove-design-system-audit.md',
  },
]

export const GAPS = [
  'The supplied background image was not in the workspace. The page ships a CSS caustic field; --cv-field-image is the single swap point when the file arrives.',
  'CSS backdrop-filter is frosted glass, not true lensing. There is no shader or refraction layer, and the guide says so.',
  'No mark cast. The constructed track may skip it, so the marks section is a logo card, wordmark and rule rather than the four-movement composition.',
  'The wordmark is outlined type, not a custom-drawn hand. The C carries the custom construction; the name is the reading face.',
  'The compact C drops the ice inlay below 32px; the favicon’s Ice field carries the accent.',
  'The board is the only export beyond the SVG family; no social or print crops were produced.',
  'The browser pass is Chromium only; there is no axe or visual-regression CI.',
  'The field fallback is CSS, not a generated atmosphere image, so there is no image provenance to maintain until the supplied file is added.',
] as const
