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
 * The sunnyside-brand-system skill advertises these resources in its SKILL.md.
 * This is the audit of that claim against the checkout, not a wish list: every
 * path was read, and the status records whether the build used it as shipped.
 */
export const SKILL_RESOURCES: readonly SkillResource[] = [
  {
    path: 'skills/sunnyside-brand-system/SKILL.md',
    kind: 'reference',
    present: true,
    status: 'used',
    evidence: 'The method for every step in this case.',
  },
  {
    path: 'skills/sunnyside-brand-system/references/brief.md',
    kind: 'reference',
    present: true,
    status: 'used',
    evidence: 'design/brand/vitrine/brief.md',
  },
  {
    path: 'skills/sunnyside-brand-system/references/logo-system.md',
    kind: 'reference',
    present: true,
    status: 'used',
    evidence: 'design/brand/vitrine/explorations/marks.html',
    note: 'Six marks on one 64 grid; Split V kept, five rejected.',
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
    path: 'skills/sunnyside-brand-system/references/image-direction.md',
    kind: 'reference',
    present: true,
    status: 'not used',
    evidence: 'No generated imagery in the kit.',
    note: 'The atmosphere panel is CSS dots and a real SVG, so there is no provenance to keep.',
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
    note: 'The supplied script builds PNGs with Pillow; the PNGs come from Playwright at exact 16/32/48, then the ICO is packed from those bytes.',
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
    note: 'Same Playwright approach, with the Signal-field favicon and the Case app icon drawn explicitly.',
  },
  {
    path: 'skills/sunnyside-brand-system/scripts/downscale.py',
    kind: 'script',
    present: true,
    status: 'substituted',
    evidence: 'scripts/render-board.mjs + Pillow LANCZOS',
    note: 'One downscale pass from 4800 × 3600 to 3000 × 2250, then a 1500 × 1125 web copy.',
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
    item: 'Six explorations, one kept, five rejected',
    status: 'shipped',
    evidence: 'design/brand/vitrine/explorations/marks.html',
    note: 'Split V kept; aperture, case tile, stacked panes, halftone V and lens bar rejected.',
  },
  {
    item: 'Mark, compact mark and glyph',
    status: 'shipped',
    evidence: 'public/brand/vitrine/mark.svg, mark-compact.svg, glyph.svg',
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
    note: 'Six files: light and reverse for horizontal and stacked, plus the two marks.',
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
    note: '125 declarations from one source.',
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
  'The board is 1.1 MB at 3000 × 2250, above the skill’s ~1 MB target. The 1500 × 1125 web copy is 483 KB.',
  'No social, print or Open Graph crops were produced; the case ships the board and the SVG family only.',
  'There is no automated visual regression or axe CI for the Vitrine route or the case library. The checks here are a manual Playwright pass.',
  'The favicon deliberately uses a Signal field instead of a transparent compact mark, so it survives dark browser chrome. The transparent marks still ship.',
  'No AI-generated atmosphere image. The board and page use CSS dots and the real mark, so the kit has no generated-image provenance to maintain.',
  'The dither was checked in Chromium (Playwright). Safari and Firefox were not part of this pass.',
] as const

export const NAV = [
  { id: 'case', label: 'Case' },
  { id: 'material', label: 'Material' },
  { id: 'forms', label: 'Forms' },
  { id: 'tokens', label: 'Tokens' },
  { id: 'audit', label: 'Audit' },
] as const
