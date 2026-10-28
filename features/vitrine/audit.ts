export type ResourceStatus = 'used' | 'substituted' | 'not used'

export type SkillResource = {
  path: string
  kind: 'reference' | 'script' | 'template' | 'example'
  present: boolean
  status: ResourceStatus
  evidence: string
  note?: string
}

/**
 * The v2.3 sunnyside-brand-system skill advertises these resources in its
 * SKILL.md. This is the audit of that claim against the checkout, not a wish
 * list: every path was read, and the status records whether the build used it
 * as shipped.
 */
export const SKILL_RESOURCES: readonly SkillResource[] = [
  {
    path: 'skills/sunnyside-brand-system/SKILL.md',
    kind: 'reference',
    present: true,
    status: 'used',
    evidence:
      'The v2.3 method for the brief, five families, story, proof and audit.',
  },
  {
    path: 'skills/sunnyside-brand-system/references/brief.md',
    kind: 'reference',
    present: true,
    status: 'used',
    evidence: 'design/brand/vitrine/brief.md',
  },
  {
    path: 'skills/sunnyside-brand-system/references/logo-brainstorm.md',
    kind: 'reference',
    present: true,
    status: 'used',
    evidence: 'design/brand/vitrine/explorations/marks.html',
    note: 'The v2.3 five-family bake-off, one kept and four rejected with reasons.',
  },
  {
    path: 'skills/sunnyside-brand-system/references/logo-system.md',
    kind: 'reference',
    present: true,
    status: 'used',
    evidence: 'public/brand/vitrine/mark.svg',
    note: 'One 64 grid, one construction, no stroke and no circle.',
  },
  {
    path: 'skills/sunnyside-brand-system/references/storytelling.md',
    kind: 'reference',
    present: true,
    status: 'used',
    evidence: 'design/brand/vitrine/story.md',
    note: 'Belief → enemy → mark → material → voice → proof → gap, plus eight decision cards.',
  },
  {
    path: 'skills/sunnyside-brand-system/references/form-theming.md',
    kind: 'reference',
    present: true,
    status: 'used',
    evidence: 'features/vitrine/tokens.json',
    note: 'Theme DNA (hard edge, square tile, solid ring, cosy density) drives the --field-* tokens.',
  },
  {
    path: 'skills/sunnyside-brand-system/references/typography.md',
    kind: 'reference',
    present: true,
    status: 'used',
    evidence: 'app/design-system/vitrine/page.tsx',
    note: 'Three voices, real specimens, unitless leading, balance/pretty, tabular numbers.',
  },
  {
    path: 'skills/sunnyside-brand-system/references/board-and-images.md',
    kind: 'reference',
    present: true,
    status: 'used',
    evidence: 'design/brand/vitrine/brandkit.html',
    note: '2400 × 1800, 54px outer, 14px gutters, rendered at 2×.',
  },
  {
    path: 'skills/sunnyside-brand-system/references/tokens-and-docs.md',
    kind: 'reference',
    present: true,
    status: 'used',
    evidence: 'features/vitrine/tokens.json',
    note: 'Primitive → semantic → component, generated to CSS and JSON.',
  },
  {
    path: 'skills/sunnyside-brand-system/references/verification.md',
    kind: 'reference',
    present: true,
    status: 'used',
    evidence: 'docs/vitrine-design-system-audit.md',
  },
  {
    path: 'skills/sunnyside-brand-system/references/design-systems.md',
    kind: 'reference',
    present: true,
    status: 'used',
    evidence: 'features/vitrine/components/form-demo.tsx',
    note: 'Native elements first; ten controls; no component runtime.',
  },
  {
    path: 'skills/sunnyside-brand-system/references/workspace-contexts.md',
    kind: 'reference',
    present: true,
    status: 'used',
    evidence: 'app/design-system/vitrine/page.tsx',
    note: 'A host route and a Markdown twin; no invented routes.',
  },
  {
    path: 'skills/sunnyside-brand-system/references/visual-directions.md',
    kind: 'reference',
    present: true,
    status: 'used',
    evidence: 'features/vitrine/vitrine.module.css',
    note: 'One effect: the dither lens. Glass is a container; content sits on a solid surface.',
  },
  {
    path: 'skills/sunnyside-brand-system/references/image-direction.md',
    kind: 'reference',
    present: true,
    status: 'not used',
    evidence: 'No generated imagery in the kit.',
    note: 'The atmosphere is CSS dither and the real SVG, so there is no provenance to keep.',
  },
  {
    path: 'skills/sunnyside-brand-system/scripts/brand-forge.mjs',
    kind: 'script',
    present: true,
    status: 'used',
    evidence: 'The five-family bake-off is reproducible from one JSON config.',
    note: 'bracket, planes, louvers, ribbon, horizon on one palette and theme DNA.',
  },
  {
    path: 'skills/sunnyside-brand-system/scripts/score-mark.py',
    kind: 'script',
    present: true,
    status: 'used',
    evidence: 'public/brand/vitrine',
    note: 'PASS: no circle, no stroke, two primitives, compact one, 16px contrast.',
  },
  {
    path: 'skills/sunnyside-brand-system/scripts/audit.mjs',
    kind: 'script',
    present: true,
    status: 'used',
    evidence: 'design/brand/vitrine/audit.json',
  },
  {
    path: 'skills/sunnyside-brand-system/scripts/qa.mjs',
    kind: 'script',
    present: true,
    status: 'used',
    evidence: 'scripts/vitrine-qa.mjs',
    note: 'Desktop, mobile, dark, reduced motion, overflow and console checks.',
  },
  {
    path: 'skills/sunnyside-brand-system/scripts/render-board.mjs',
    kind: 'script',
    present: true,
    status: 'used',
    evidence: 'scripts/render-board.mjs',
    note: 'Copied into the repo because the skill lives outside it and cannot resolve the app’s Playwright.',
  },
  {
    path: 'skills/sunnyside-brand-system/scripts/favicons.py',
    kind: 'script',
    present: true,
    status: 'substituted',
    evidence: 'scripts/vitrine-icons.mjs, scripts/vitrine-ico.py',
    note: 'PNGs come from Playwright at exact 16/32/48; the ICO is packed from those bytes.',
  },
  {
    path: 'skills/sunnyside-brand-system/scripts/extract-wordmark.py',
    kind: 'script',
    present: true,
    status: 'used',
    evidence: 'public/brand/vitrine/wordmark.svg',
    note: 'Space Grotesk 700, -0.04em tracking, seven glyph paths, no <text>.',
  },
  {
    path: 'skills/sunnyside-brand-system/scripts/render-icons.mjs',
    kind: 'script',
    present: true,
    status: 'substituted',
    evidence: 'scripts/vitrine-icons.mjs',
    note: 'Same Playwright approach, with the Signal favicon and the Case app icon drawn explicitly.',
  },
  {
    path: 'skills/sunnyside-brand-system/scripts/downscale.py',
    kind: 'script',
    present: true,
    status: 'substituted',
    evidence: 'scripts/render-board.mjs + Pillow LANCZOS',
    note: 'One downscale pass from 4800 × 3600 to 3000 × 2250, then 1500 × 1125.',
  },
  {
    path: 'skills/sunnyside-brand-system/templates/brandkit.html',
    kind: 'template',
    present: true,
    status: 'substituted',
    evidence: 'design/brand/vitrine/brandkit.html',
    note: 'Custom 8-panel board; the starter’s panel map was kept, its Sunnyside assets were not.',
  },
  {
    path: 'skills/sunnyside-brand-system/templates/guidelines.md',
    kind: 'template',
    present: true,
    status: 'used',
    evidence: 'design/brand/vitrine/README.md',
  },
  {
    path: 'skills/sunnyside-brand-system/examples/sunnyside.md',
    kind: 'example',
    present: true,
    status: 'not used',
    evidence: 'Read as the worked example.',
    note: 'The sun, paper and cobalt are Sunnyside-specific; Vitrine had to be a different mark and palette.',
  },
  {
    path: 'skills/sunnyside-brand-system/examples/vitrine.md',
    kind: 'example',
    present: true,
    status: 'used',
    evidence: 'This case, revised to the v2.3 ribbon V.',
  },
  {
    path: 'skills/sunnyside-brand-system/README.md',
    kind: 'reference',
    present: true,
    status: 'used',
    evidence: 'Install and path notes.',
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
    evidence: 'design/brand/vitrine/brief.md',
  },
  {
    item: 'Five v2.3 families, one kept, four rejected with reasons',
    status: 'shipped',
    evidence: 'design/brand/vitrine/explorations/marks.html',
    note: 'Architectural monogram, offset planes, louvers, ribbon, horizon.',
  },
  {
    item: 'Story spine and decision cards',
    status: 'shipped',
    evidence: 'design/brand/vitrine/story.md',
    note: 'Belief, enemy, mark, material, voice, proof, gap; eight cards.',
  },
  {
    item: 'Mark, compact mark, glyph and mono',
    status: 'shipped',
    evidence:
      'public/brand/vitrine/mark.svg, mark-compact.svg, glyph.svg, mark-mono.svg',
  },
  {
    item: 'Wordmark as outlines',
    status: 'shipped',
    evidence: 'public/brand/vitrine/wordmark.svg',
    note: 'Seven glyph paths, currentColor, no live text.',
  },
  {
    item: 'Horizontal, stacked and reversed lockups',
    status: 'shipped',
    evidence: 'public/brand/vitrine/lockup*.svg',
    note: 'Four files: light and reverse for horizontal and stacked.',
  },
  {
    item: '3 × 3 brand board as a real image',
    status: 'shipped',
    evidence: 'design/brand/vitrine/vitrine-brandkit.png',
    note: '3000 × 2250, rendered from HTML at 2× and downscaled.',
  },
  {
    item: 'Favicon and app icon set',
    status: 'shipped',
    evidence:
      'public/brand/vitrine/favicon.ico, icon.svg, apple-icon-180.png, icon-192.png, icon-512.png',
  },
  {
    item: 'Primitive → semantic → component tokens, CSS and JSON',
    status: 'shipped',
    evidence:
      'features/vitrine/tokens.json → vitrine-tokens.css + public/brand/vitrine/vitrine-tokens.json',
    note: '159 declarations, including fourteen theme-DNA tokens.',
  },
  {
    item: 'Theme DNA and portable form kit',
    status: 'shipped',
    evidence:
      'features/vitrine/tokens.json (theme) + public/brand/vitrine/vitrine-forms.css',
    note: 'The mark and the fields share the hard edge, square tile and solid ring.',
  },
  {
    item: 'Guidelines that explain why, when not, and what breaks next',
    status: 'shipped',
    evidence: 'design/brand/vitrine/README.md',
  },
  {
    item: 'Live design-system case with form controls',
    status: 'shipped',
    evidence: 'app/design-system/vitrine/page.tsx',
    note: 'Ten controls, validation, error summary, password toggle, switch, range and file.',
  },
  {
    item: 'Agent-readable Markdown twin',
    status: 'shipped',
    evidence: 'app/design-system/vitrine/llms.txt/route.ts',
  },
  {
    item: 'Hard-gate evidence and objective score',
    status: 'shipped',
    evidence: 'docs/vitrine-design-system-audit.md',
    note: 'A zero-circle, fill-only, two-primitive mark; score-mark.py PASS.',
  },
  {
    item: 'Typography gate',
    status: 'shipped',
    evidence: 'design/brand/vitrine/story.md, page type section',
  },
  {
    item: 'Verification evidence',
    status: 'shipped',
    evidence: 'docs/vitrine-design-system-audit.md',
    note: 'Screenshots at 1440 and 390, light/dark, reduced motion.',
  },
]

export type DitherAudit = {
  item: string
  status: 'pass' | 'note'
  evidence: string
  note?: string
}

export const DITHER_AUDIT: readonly DitherAudit[] = [
  {
    item: 'Engine installed in lib/dither',
    status: 'pass',
    evidence: '13 files; index.ts exports DitherShader.',
  },
  {
    item: 'Engine current (colorField present)',
    status: 'pass',
    evidence: 'grep colorField lib/dither/shader.tsx',
  },
  {
    item: 'Agent skill installed in both locations',
    status: 'pass',
    evidence:
      '.agents/skills/dithercn and .claude/skills/dithercn, 9 files each.',
  },
  {
    item: 'Dither tokens in global CSS',
    status: 'pass',
    evidence:
      'app/globals.css defines --dither-ink and the seven named colours.',
  },
  {
    item: 'Signature dither written as a field',
    status: 'pass',
    evidence: 'features/vitrine/components/dither-lens.tsx',
    note: 'No example component installed; the lens field is six lines of geometry plus a colour field.',
  },
  {
    item: 'Reduced motion keeps a finished frame',
    status: 'pass',
    evidence: 'DitherShader data-state="static", stillTime=6.',
  },
  {
    item: 'Live shader budget',
    status: 'pass',
    evidence:
      'One DitherShader on the page; the rest of the dither is CSS dots.',
  },
]

export const GAPS = [
  'The board is 1.10 MB at 3000 × 2250, above the skill’s ~1 MB target. The 1500 × 1125 web copy is 450 KB.',
  'No social, print or Open Graph crops were produced; the case ships the board and the SVG family only.',
  'There is no automated visual regression or axe CI for the Vitrine route or the case library. The checks here are a manual Playwright pass.',
  'The favicon deliberately uses a Signal field and the compact mark instead of a transparent primary mark, so it survives dark browser chrome. The transparent marks still ship.',
  'The Signal label in the primary mark is under 2px at 16px. The compact drawing drops it and is used below 32px; the mono glyph drops it at every size.',
  'The portable form CSS is a generated export for reuse; the live route consumes the same tokens through its CSS module, not the exported file.',
  'No AI-generated atmosphere image. The board and page use CSS dots and the real mark, so the kit has no generated-image provenance to maintain.',
  'The dither was checked in Chromium (Playwright). Safari and Firefox were not part of this pass.',
] as const

export const NAV = [
  { id: 'foundation', label: 'Foundation' },
  { id: 'marks', label: 'Marks' },
  { id: 'material', label: 'Material' },
  { id: 'colour', label: 'Colour' },
  { id: 'type', label: 'Type' },
  { id: 'forms', label: 'Forms' },
  { id: 'motion', label: 'Motion' },
  { id: 'voice', label: 'Voice' },
  { id: 'applications', label: 'Applications' },
  { id: 'tokens', label: 'Tokens' },
  { id: 'audit', label: 'Audit' },
] as const

export type MarkPath = {
  d: string
  accent?: boolean
}

export type MarkFamily = {
  id: string
  name: string
  family: string
  verdict: 'kept' | 'rejected'
  reason: string
  paths: readonly MarkPath[]
}

/**
 * The five v2.3 families, generated with brand-forge on Vitrine's palette and
 * theme DNA. The kept ribbon was hand-refined to the shipped V and plinth.
 */
export const MARK_FAMILIES: readonly MarkFamily[] = [
  {
    id: 'monogram',
    name: 'Bracket monogram',
    family: 'Architectural monogram',
    verdict: 'rejected',
    reason:
      'Huginn already owns the two-bracket silhouette. Repeating it makes the library read as one family.',
    paths: [
      { d: 'M8 8H20V28H30V36H20V56H8Z' },
      { d: 'M56 8H44V28H34V36H44V56H56Z' },
      { d: 'M32 22L38 32L32 42L26 32Z', accent: true },
    ],
  },
  {
    id: 'planes',
    name: 'Sheared sheets',
    family: 'Offset geometric planes',
    verdict: 'rejected',
    reason:
      'Riso Co. already owns the overlapping sheared sheet. The mark reads as a misregistration effect before it reads as a case.',
    paths: [
      { d: 'M24 10H52L36 54H8Z', accent: true },
      { d: 'M34 4H62L46 48H18Z' },
    ],
  },
  {
    id: 'louvers',
    name: 'Wedge bars',
    family: 'Brutalist louvers',
    verdict: 'rejected',
    reason:
      'Hachure already owns the stepped ridge. A louver is a shelf, not a vitrine; at 16px it becomes a bar chart.',
    paths: [
      {
        d: 'M2 56V36L10 42V56Z M15.3 56V26L25.3 32V56Z M30.6 56V16L42.6 22V56Z M47.9 56V8L61.9 14V56Z',
      },
      { d: 'M54.9 2L61.9 8L54.9 14L47.9 8Z', accent: true },
    ],
  },
  {
    id: 'horizon',
    name: 'Shelf and keystone',
    family: 'Horizon & counter-form',
    verdict: 'rejected',
    reason:
      'At small sizes it collapses into Hachure’s bar-and-diamond silhouette, and the baseline carries no letter or case.',
    paths: [
      { d: 'M8 42H56V52H8Z' },
      { d: 'M32 10L42 24L32 38L22 24Z', accent: true },
    ],
  },
  {
    id: 'ribbon',
    name: 'Folded V',
    family: 'Continuous ribbon',
    verdict: 'kept',
    reason:
      'The fold makes the V and the case; the flat plinth gives the printed label a home; the silhouette is open, angular and unused in the library.',
    paths: [
      { d: 'M10 4L32 44L54 4L62 8L42 56L22 56L2 8Z' },
      { d: 'M27 46H37V54H27Z', accent: true },
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
      'No <circle> in the mark family. The V is a filled polygon, not a disc or a ring.',
  },
  {
    gate: 'B',
    title: 'Fill-only',
    result: 'pass',
    evidence:
      'No stroke attribute in mark.svg or mark-compact.svg. The seam is a 9-unit negative channel, above the 5.1-unit floor.',
  },
  {
    gate: 'C',
    title: '2–4 primitives, one accent',
    result: 'pass',
    evidence:
      'Two primitives in the primary (beam + label), one in the compact. Signal appears once, on the label.',
  },
  {
    gate: 'D',
    title: 'One family, distinct silhouette',
    result: 'pass',
    evidence:
      'Continuous ribbon. Distinct from Huginn’s brackets, Riso’s planes, Hachure’s louvers and Sunnyside’s tile.',
  },
  {
    gate: 'E',
    title: 'Compact is simpler',
    result: 'pass',
    evidence:
      'The compact is a separate one-path drawing with heavier arms; the primary is a path plus the label.',
  },
  {
    gate: 'F',
    title: 'Test 16px first',
    result: 'pass',
    evidence:
      'score-mark.py PASS: compact contrast at 16px, glyph coverage 30%, no specks, no thin strokes.',
  },
]

export type StoryBeat = {
  beat: string
  line: string
}

export const STORY_BEATS: readonly StoryBeat[] = [
  {
    beat: 'Belief',
    line: 'Depth should clarify, never fog. A container earns its transparency by holding one clear object.',
  },
  {
    beat: 'Enemy',
    line: 'Glass used as decoration: the frosted card with an unreadable paragraph, the gradient blob behind body copy.',
  },
  {
    beat: 'Mark',
    line: 'The object and its label are one drawing. A single beam folds into a V and a plinth; the plinth carries the only print.',
  },
  {
    beat: 'Material',
    line: 'A glass container, a halftone information layer, a hard 1px cut edge, and fields on a solid ground.',
  },
  {
    beat: 'Voice',
    line: 'Precise, lit, unhurried. Museum labels, not marketing.',
  },
  {
    beat: 'Proof',
    line: '17.89:1 body contrast, 159 tokens, ten native controls, a 30% silhouette and a compact mark that reads at 16px.',
  },
  {
    beat: 'Gap',
    line: 'Board weight, social crops, axe CI, Chromium-only QA, and a Signal label that is dropped below 32px.',
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
    title: 'Fold, do not draw a letter',
    decision:
      'One continuous beam folds into the V; the label is an inlay in the plinth, not a dot beside the letter.',
    because:
      'A typed initial is a typeface choice. A fold is a construction, and the label then has a job.',
    notWhen: 'The mark has to carry a halftone texture at 16px.',
    breaksNext:
      'At 16px the label is under 2px, so the compact drops it and keeps the heavier fold.',
  },
  {
    title: 'Glass is a container',
    decision:
      'Body copy never sits on a translucent surface; glass is for a container with one object.',
    because: 'Text contrast must not depend on what is behind the panel.',
    notWhen: 'A floating overlay must read above content; use a solid scrim.',
    breaksNext:
      'The .onCase inverse scope mirrors the dark tokens; change both in the same commit.',
  },
  {
    title: 'One loud field',
    decision:
      'Signal is the only accent allowed to shout; status colours are not fields.',
    because: 'Two loud fields remove the hierarchy the page is built on.',
    notWhen: 'An error needs attention; Clay is a status role, not a field.',
    breaksNext:
      'Dark focus uses Signal, so focus and accent share a colour. The ring is still visible because it is a ring, not a fill.',
  },
  {
    title: 'Hard 1px cut edge',
    decision: 'Glass uses a 1px edge, one top specular and a hard 1px shadow.',
    because: 'The mark is a solid fold; a soft glow would change the material.',
    notWhen: 'The panel floats over a photograph; use a scrim first.',
    breaksNext:
      'The dark edge is 18% white and can disappear on Frost; it is a container edge, not a body-copy border.',
  },
  {
    title: 'Native controls, token fields',
    decision:
      'Text, email, password, select, textarea, radio, checkbox, switch, range and file are native; the material is CSS.',
    because:
      'The kit must work without a component runtime and survive iOS input zoom.',
    notWhen: 'A portal or focus trap is required; use Radix.',
    breaksNext:
      'Native select styling differs by browser; the chevron is drawn and tested in both themes.',
  },
  {
    title: 'The label face is a label',
    decision:
      'Uppercase Geist Mono at 0.14em is for metadata, never paragraphs.',
    because: 'The voice is a museum label; the reading face carries sentences.',
    notWhen:
      'A caption needs more than one line; use the reading face at 13px.',
    breaksNext:
      'The 10px label sits below the 13px caption floor; on the page it is paired with larger text.',
  },
  {
    title: 'The Signal label is punctuation',
    decision: 'One Signal inlay in the plinth; no second accent in the mark.',
    because: 'The accent marks the printed label, the one focal element.',
    notWhen:
      'The mark is used as a favicon or below 32px; the compact is mono.',
    breaksNext:
      'The inlay is tiny at 32px and absent at 16px. The mono glyph and compact carry the identity without it.',
  },
  {
    title: 'The board is HTML',
    decision:
      'The board is rendered from the same HTML, tokens and SVGs as the page.',
    because: 'A board that is drawn twice drifts. One source, one export.',
    notWhen: 'A print vendor requires CMYK; that is a separate artifact.',
    breaksNext:
      'The 3000 × 2250 PNG is still above the 1 MB target. The web copy is downscaled, not re-exported.',
  },
]

export const VOICE = {
  weAre: 'Precise, lit, unhurried, specific.',
  weAreNot: 'Hyped, vague, apologetic, jargon-first.',
  say: [
    'Request staged. This specimen does not call a server.',
    'Use at least 8 characters.',
    'The case holds one object. The rest is clearance.',
  ],
  dontSay: [
    'Oops! Something went wrong.',
    'Awesome! Your request was successfully submitted!',
    'Unlock the power of seamless experiences.',
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
    value: 'cubic-bezier(0.23, 1, 0.32, 1)',
    note: 'One ease for the system.',
  },
  {
    name: 'Reduced motion',
    value: '0.01ms',
    note: 'The shader holds a finished frame.',
  },
] as const

export const TYPE_GATE = [
  'Three voices: Space Grotesk display, Geist reading, Geist Mono label.',
  'Body 16–18px; inputs 14px, 16px on mobile; captions 13px.',
  'Unitless leading: display 0.94, body 1.6; weight ≥400 below 18px.',
  'Measure 60–75 characters; balance on headings, pretty on paragraphs.',
  'Tracking in em; tabular numbers on changing values; real specimens, not lorem.',
  'The wordmark is outlined; no paragraph is set in the display face.',
] as const
