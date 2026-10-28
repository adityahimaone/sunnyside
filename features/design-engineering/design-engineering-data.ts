/**
 * The field manual’s content.
 *
 * One rule for editing this file: a claim gets an artefact. If there is no
 * shipped thing to point at, it is a gap, not a capability.
 */

export type Principle = {
  number: string
  title: string
  line: string
  origin?: string
}

export type LoopStep = {
  number: string
  title: string
  line: string
  example: string
}

export type Standard = {
  number: string
  file: string
  title: string
  line: string
  checks: string[]
  source: { label: string; href: string }
}

export type Capability = {
  id: string
  number: string
  title: string
  line: string
  tone: 'cobalt' | 'butter' | 'pink' | 'mint' | 'paper'
  skills: string[]
  evidence: string
  next: string
}

export type AgentSkill = {
  name: string
  use: string
  note: string
}

export type Resource = {
  label: string
  href: string
  note: string
  group: string
}

export const PRACTICE = {
  eyebrow: '01 / The practice',
  title: ['Design', 'engineering'],
  standfirst: 'The work between the drawing and the browser.',
  intro:
    'I design the system and build the interface: the name, the mark, the type, the tokens, then the page that proves them. Sunnyside is the first worked example — one paper world, a brand kit and the docs that keep it honest. Vitrine is the second: a glass case, a dithered label and a form kit that has to survive the material.',
  body: 'Most handoffs lose the reason. A file says what, a ticket says when, and the browser finds out whether it was true. The practice is the loop that keeps the reason attached: one direction, one system, one proof, one written decision.',
  actions: [
    { href: '#case', label: 'Read the Sunnyside case', kind: 'primary' },
    { href: '/sunnyside', label: 'Open the system', kind: 'secondary' },
  ] as const,
}

export const LOOP: LoopStep[] = [
  {
    number: '01',
    title: 'Read the room',
    line: 'Audience, constraints, what already exists. The non-negotiables get written down before the canvas opens.',
    example:
      'Sunnyside started with three constraints: warm paper, one cobalt field, no stock marks. Everything later had to survive them.',
  },
  {
    number: '02',
    title: 'Set a direction',
    line: 'References, a point of view, one sentence you can reject work against. A moodboard is not a direction.',
    example:
      'The direction became “a studio wall, not a template”. It is why the page has a sticker drawer and not a hero illustration.',
  },
  {
    number: '03',
    title: 'Draw the system',
    line: 'Type, colour, tokens, marks, states. Each part has to make sense outside the page that introduced it.',
    example:
      'The logo had to work at 34px in a navbar, 16px in a tab, and 1200px on a social card. The favicon got its own compact geometry.',
  },
  {
    number: '04',
    title: 'Build the proof',
    line: 'A real page, real copy, real states. The browser is where the design decision is tested.',
    example:
      'Side A and the archive were built before the specimen. The specimen documents what the code does; it does not invent a cleaner version.',
  },
  {
    number: '05',
    title: 'Write the decision',
    line: 'Why this, why not that, what breaks next. The reasoning is part of the deliverable.',
    example:
      '`design.md`, the brand guide, the README routes and the Pen.dev manifest all ship with the code.',
  },
  {
    number: '06',
    title: 'Measure and cut',
    line: 'Contrast, keyboard, reduced motion, performance, the second look. Then remove the sticker that was only decoration.',
    example:
      'The archive shares one shell and four routes. The fifth sticky bar was cut; the page did not need it.',
  },
]

export const PRINCIPLES: Principle[] = [
  {
    number: '01',
    title: 'Make it legible.',
    line: 'If a new teammate cannot see what a screen is doing in three seconds, the screen is not finished.',
    origin: 'Side A',
  },
  {
    number: '02',
    title: 'Motion earns its keep.',
    line: 'Every move explains a change, keeps a place, or gives an answer back. Nothing moves because it can.',
    origin: 'Side A',
  },
  {
    number: '03',
    title: 'Leave it easy to change.',
    line: 'Types, tokens and honest names are for the next person, who will have less context than me.',
    origin: 'Side A',
  },
  {
    number: '04',
    title: 'One loud field at a time.',
    line: 'Cobalt is a room, not a coat of paint. A page earns one loud surface; the rest stays paper.',
    origin: 'House rule',
  },
  {
    number: '05',
    title: 'Paper is the room.',
    line: 'Edges, grain and hard shadows are structure. Glass and glow are not the default.',
    origin: 'House rule',
  },
]

export const STANDARDS: Standard[] = [
  {
    number: '01',
    file: 'The design contract',
    title: 'Agree what the thing is before drawing it.',
    line: 'One page, written before the canvas. It is the document the review is held against.',
    checks: [
      'One sentence for the job, in the user’s words.',
      'The audience and the context they arrive in.',
      'The constraints: stack, content, time, accessibility.',
      'What this version will not do.',
    ],
    source: { label: 'The Sunnyside brief', href: '#case' },
  },
  {
    number: '02',
    file: 'The interface standard',
    title: 'Legibility is a test, not a taste.',
    line: 'The floor every page is held to, including the pages nobody links to.',
    checks: [
      'Body text at 4.5:1; large text at 3:1.',
      'Visible focus and a complete keyboard path.',
      '44px targets with 8px between them.',
      'A reduced-motion route that is not a blank page.',
      '320 / 768 / 1024 / 1440 checked, not assumed.',
    ],
    source: {
      label: 'The specimen’s foundation',
      href: '/sunnyside#foundation',
    },
  },
  {
    number: '03',
    file: 'The token rule',
    title: 'Name the role, not the hex.',
    line: 'A token is a decision with a name. If a component knows the hex, the decision is hidden again.',
    checks: [
      'Primitive → semantic → component; no skipping layers.',
      'Raw hex only in the primitive file.',
      '`--ss-*` where the app’s shadcn layer already owns the short names.',
      'Type, space, radius and motion are tokens too.',
    ],
    source: { label: 'Tokens and exports', href: '/sunnyside#tokens' },
  },
  {
    number: '04',
    file: 'The handoff',
    title: 'The file is the argument. The code is the truth.',
    line: 'A design source is reviewable when it has a name, a route, a manifest and a 2× export.',
    checks: [
      'Design files named by route; frames numbered in reading order.',
      'A manifest maps frames → routes → tokens → motion.',
      '2× exports live next to the source for review.',
      'The code is the source of truth; the file is the argument.',
    ],
    source: {
      label: 'The Pen.dev manifest',
      href: 'https://github.com/adityahimaone/sunnyside/blob/main/design/manifest.json',
    },
  },
]

export const SYSTEM = {
  eyebrow: '03 / The system',
  title: 'One paper. One loud field. One drawer of marks.',
  lede: 'Sunnyside is not a component library with a landing page attached. It is a visual language with a specimen, a brand kit, and the archive that uses them. The page you are reading is built in it.',
  swatches: [
    { name: 'Paper', token: '--ss-paper', hex: '#f3ecdf', role: 'The room' },
    { name: 'Ink', token: '--ss-ink', hex: '#191a2e', role: 'Type + edges' },
    {
      name: 'Cobalt',
      token: '--ss-cobalt',
      hex: '#3d53d6',
      role: 'One loud field',
    },
    {
      name: 'Butter',
      token: '--ss-butter',
      hex: '#ffd23f',
      role: 'Sun + focus',
    },
    {
      name: 'Tangerine',
      token: '--ss-tangerine',
      hex: '#ff6a2b',
      role: 'Annotation',
    },
  ],
  voices: [
    { name: 'Syne 800', role: 'Display', sample: 'Interfaces with a pulse.' },
    {
      name: 'Geist 400',
      role: 'Reading',
      sample: 'The voice you actually read.',
    },
    {
      name: 'Geist Mono 500',
      role: 'Label',
      sample: '03 / THE SYSTEM · JAKARTA',
    },
    { name: 'The marker', role: 'Annotation', sample: 'made by hand' },
  ],
  chain: [
    { label: 'Primitive', line: 'Paper, ink, cobalt, butter, tangerine.' },
    { label: 'Semantic', line: 'Surface, text, border, accent, focus.' },
    { label: 'Component', line: 'Button, card, header, specimen.' },
    { label: 'Page', line: 'Side A, the archive, this manual.' },
  ],
  links: [
    { href: '/sunnyside', label: 'Open the specimen' },
    { href: '/brand/sunnyside-brandkit.png', label: 'Brand kit' },
    { href: '/brand/sunnyside-lockup.svg', label: 'Logo lockup' },
    {
      href: 'https://github.com/adityahimaone/sunnyside/blob/main/design.md',
      label: 'design.md',
    },
  ],
}

export const CASE = {
  number: 'Case 01',
  title: 'Sunnyside',
  subtitle: 'A portfolio that had to be its own proof.',
  status: 'Shipped · 2026',
  role: 'Identity · design system · frontend · docs',
  cover: '/brand/sunnyside-brandkit.png',
  coverAlt:
    'The Sunnyside brand kit: a paper and ink identity board with the sun mark, palette, type specimens and favicon sizes.',
  brief:
    'Make a portfolio that feels made by a person, and make the system behind it inspectable. The site had to carry a studio landing, the archive rooms, a design-system specimen, a brand kit and a 16px favicon without becoming five different brands.',
  constraints: [
    'Next.js 16 on Cloudflare Workers, with D1 and R2 already in the deploy.',
    'One palette: warm paper, ink, one cobalt field, four accents.',
    'No stock marks or generated identity; every mark is drawn in code or SVG.',
    'Real content, real routes, real focus states.',
    'The system has to be documented as a page, not a PDF.',
  ],
  decisions: [
    {
      title: 'One paper world, two wings.',
      line: 'Side A is the studio wall; the archive is the back room. Same shell, same tokens, same type — different density, not a different brand.',
    },
    {
      title: 'Tokens before components.',
      line: 'The archive uses namespaced `--ss-*` values so shadcn and Tailwind cannot quietly recolour a page. The specimen exports the same values as CSS and JSON.',
    },
    {
      title: 'Draw the marks.',
      line: 'The sun, the marker, the logo and the favicon are code or SVG. The identity has no image assets, which is why it scales from a tab to a board.',
    },
    {
      title: 'The specimen is the contract.',
      line: 'The `/sunnyside` route documents what the code actually does. When the prose and the page disagree, the page wins and the prose gets fixed.',
    },
    {
      title: 'Docs ship with the product.',
      line: '`design.md`, the brand guide, the README routes and this field manual are part of the deliverable. A decision with no note is a decision waiting to be undone.',
    },
    {
      title: 'Design sources live in the repo.',
      line: 'Pen.dev `.pen` files, a manifest and 2× exports sit in `design/` beside the code they describe. The source is versioned, not attached to a chat.',
    },
  ],
  outcomes: [
    'One identity across the navbar, favicon, social card and brand kit.',
    'The archive rooms and this manual share one shell; the specimen is the reference.',
    'Copyable CSS/JSON tokens and downloadable SVG marks.',
    'A repeatable Pen.dev source → manifest → export loop.',
    'A brand kit with clear space, minimum sizes and do/don’t rules.',
  ],
  evidence: [
    {
      label: 'The live site',
      href: '/',
      note: 'Side A, the archive and the specimen.',
    },
    {
      label: 'The design system',
      href: '/sunnyside',
      note: 'Palette, type, marks, parts, motion, voice, tokens.',
    },
    {
      label: 'The brand kit',
      href: '/brand/sunnyside-brandkit.png',
      note: 'The board, the mark and the favicon family.',
    },
    {
      label: 'The design notes',
      href: 'https://github.com/adityahimaone/sunnyside/blob/main/design.md',
      note: 'The visual rules and the implementation map.',
    },
    {
      label: 'The design sources',
      href: 'https://github.com/adityahimaone/sunnyside/tree/main/design',
      note: 'Pen.dev files, exports and the manifest.',
    },
    {
      label: 'The release shelf',
      href: '/projects',
      note: 'The other five releases, with their own case notes.',
    },
  ],
}

export const HUGINN_CASE = {
  number: 'Case 03',
  title: 'Huginn Studio',
  subtitle: 'A picture becomes cells. A name becomes cells.',
  status: 'Shipped · 2026',
  role: 'Identity · design system · marks · component proof',
  href: '/design-system/huginn',
  library: '/design-system',
  cover: '/brand/huginn/huginn-brandkit.png',
  coverAlt:
    'The Huginn brand board: the two-bracket keystone mark, the drawn blackletter wordmark, the vermilion field and the painting dissolving into it through an ordered dither.',
  brief:
    'Give a two-city software studio an identity that depends on a drawing rather than a font: one bone sheet, one vermilion field, a blackletter wordmark cut into a 22-row cell grid, and a painting dissolved into that field by an ordered dither. The case proves the language with a native form kit and a configurable footer, then measures what it shipped.',
  decisions: [
    {
      title: 'Two brackets, one bridge.',
      line: 'The H is cut into two interlocking L-beams; the vermilion diamond keystone is the only loud thing. No strokes, no circles, and the compact widens the channels.',
    },
    {
      title: 'The wordmark is a drawing, not a face.',
      line: '760 cells on a 22-row grid resolve to a single path. No webfont to load, no licence to buy, and no platform where the name falls back to something else.',
    },
    {
      title: 'The dither is a mask, not a filter.',
      line: 'A canvas is punched with transparent holes and laid over the painting, so no image pixel is ever read. The effect survives file://, a CDN and a canvas-taint policy unchanged.',
    },
    {
      title: 'The footer is a specimen.',
      line: 'The Wild Hunt Footer lives in the case proof and is not applied to Sunnyside or the portfolio shell.',
    },
  ],
  outcomes: [
    'A mark that survives 16px, a drawn wordmark, a lockup and favicon-ready SVG at six sizes.',
    'Three token layers — primitive, semantic, component — as DTCG JSON with CSS and JSON exports.',
    'A native form kit and a configurable ordered-dither footer, both proved in the specimen.',
    'A measured audit: 43 contrast targets across two themes, 53 focusables, and reduced motion verified by frame comparison.',
    'A full case page, a Markdown twin, and the two findings the first build got wrong named alongside the ones it got right.',
  ],
}

export const RISO_CASE = {
  number: 'Case 04',
  title: 'Riso Co.',
  subtitle: 'Two passes, one sheet.',
  status: 'Shipped · 2026',
  role: 'Identity · design system · form kit · print proof',
  href: '/design-system/riso',
  library: '/design-system',
  cover: '/brand/riso/riso-brandkit.png',
  coverAlt:
    'The Riso Co. brand board: a fluorescent orange sheet pulled 2.2mm off its federal blue pass, the two-sheet overprint mark, five ink chips, the outlined wordmark at three favicon sizes, and the torn sheet edge.',
  brief:
    'A risograph prints one drum at a time, so the second impression never lands exactly on the first. Most digital riso pastiche hides that; Riso Co. makes it the rule. Every element is printed twice — fluorescent orange and federal blue — and the 2.5px misregistration is the identity rather than a defect to be corrected.',
  decisions: [
    {
      title: 'The second pass is never corrected.',
      line: 'One CSS variable, `--rs-reg`, offsets every display element. A slider in the specimen runs 0–6px so the reader can pull the sheet back into register and watch the idea disappear.',
    },
    {
      title: 'The mark is the press behaviour.',
      line: 'Two sheared sheets are the two drum passes; the overlap is a solid overprint polygon. No strokes, no circles, so the mark survives a favicon and a PDF.',
    },
    {
      title: 'The overprint is measured, not blended.',
      line: 'No `mix-blend-mode`. Where the passes coincide the third colour is a third clipped path, so the identity survives a favicon, a PDF and a client with blending disabled.',
    },
  ],
  outcomes: [
    'A mark family at 64/32/16px plus a mono union, an outlined wordmark and a lockup — all SVG, no live text, no webfont dependency.',
    'Three token layers with 16 contrast pairs computed in the build rather than typed, including the one pair that fails: orange as body type at 2.88:1, documented as fills-only.',
    'A native form kit with default, focus, invalid, disabled and success states, and an error summary that moves focus to the first bad field.',
    'The pushpin tear footer rebuilt as a print specimen, with a seed control that re-tears the sheet on demand.',
    'A printed 1500×1125 brand board, a full case page and a Markdown twin — with the 2.88:1 failure named in the audit instead of rounded up.',
  ],
}

export const VITRINE_CASE = {
  number: 'Case 02',
  title: 'Vitrine',
  subtitle: 'A glass case for a low-resolution light.',
  status: 'Shipped · 2026',
  role: 'Identity · design system · form kit · dither',
  href: '/design-system/vitrine',
  library: '/design-system',
  cover: '/brand/vitrine/vitrine-brandkit.png',
  coverAlt:
    'The Vitrine brand board: the Split V mark, the Case and Frost palette, the Signal field, type specimens, favicon sizes and the form specimen.',
  brief:
    'Give the second system a different material without losing the method: a glass container, a halftone information layer, a form kit and an audit that names its own gaps. Vitrine had to prove that glass and dither can be legible together, not just photogenic.',
  constraints: [
    'A separate brand from Sunnyside: no sun, paper or cobalt.',
    'Glass is a container; body copy sits on solid ground.',
    'One live DitherShader; reduced motion keeps a finished frame.',
    'Ten native controls with labels, errors, focus and a disabled state.',
    'One token source generates CSS and JSON; the case is readable without JavaScript.',
  ],
  decisions: [
    {
      title: 'The case and the grain.',
      line: 'Glass holds the object; the dither is the printed label inside it. The glass never becomes the content, and the dither never sits under the words that explain it.',
    },
    {
      title: 'Split V, one solid and one dithered.',
      line: 'Two panes meet at a point. The full mark keeps the checkerboard; the compact 16px mark drops it so the silhouette survives a favicon.',
    },
    {
      title: 'Audit the method, not just the output.',
      line: 'The page records 16/16 skill resources present, 10 used as shipped, 4 substitutions and 6 named gaps. A case without its gaps is a brochure.',
    },
  ],
  outcomes: [
    'A new brand kit, outlined wordmark, favicon set, 3 × 3 board and 125-declaration token system.',
    'A ten-control form specimen with a focused error summary, password toggle, switch, range and file input.',
    'One custom lens dither on the dithercn engine, static under reduced motion, with no example component installed.',
    'An honest case page and Markdown twin: 12/12 output-contract items shipped, six gaps named.',
  ],
  evidence: [
    {
      label: 'Read the full case',
      href: '/design-system/vitrine',
      note: 'The brand, forms, tokens and audit on one page.',
    },
    {
      label: 'The case library',
      href: '/design-system',
      note: 'Sunnyside and Vitrine, side by side.',
    },
    {
      label: 'The brand kit',
      href: '/brand/vitrine/vitrine-brandkit.png',
      note: '3000 × 2250, rendered from HTML.',
    },
    {
      label: 'The tokens',
      href: '/brand/vitrine/vitrine-tokens.json',
      note: 'Primitive → semantic → component, one source.',
    },
    {
      label: 'The audit',
      href: '/design-system/vitrine#audit',
      note: 'Resources, substitutions and gaps.',
    },
    {
      label: 'The Markdown twin',
      href: '/design-system/vitrine/llms.txt',
      note: 'The same case for agents and readers without JS.',
    },
  ],
}

/** The method, packaged as an installable agent skill. */
export const BRAND_SKILL = {
  name: 'sunnyside-brand-system',
  description:
    'A fast, evidence-led skill for brand kits, design systems and single-page HTML/TSX mockups: strategy, logo family, board, favicons, tokens, forms, modern visual directions, universal surfaces and lean QA. It hands the approved kit to implement-brand-system.',
  install:
    'npx skills add adityahimaone/sunnyside --skill sunnyside-brand-system --full-depth',
  folder: 'skills/sunnyside-brand-system',
  repo: 'https://github.com/adityahimaone/sunnyside/tree/main/skills/sunnyside-brand-system',
  file: 'https://github.com/adityahimaone/sunnyside/blob/main/skills/sunnyside-brand-system/SKILL.md',
  includes: [
    'SKILL.md — modes, fast path, token budget, rules and output contract',
    '12 references — brief, logo, board, image direction, tokens, design systems, typography, verification, lessons, ui-skills fusion, visual directions, workspace contexts',
    'UI Skills audit — 22 relevant skills inspected; fused into the brand and implementation passes',
    '7 scripts — board, icons, favicon, downscale, wordmark, static audit, browser QA',
    '6 templates — system specimen, brand board, single-page mockup, TSX case page, audit manifest, guide',
    '2 examples — Sunnyside and Vitrine, with the Case 02 audit',
    'Companion implement-brand-system skill — HTML/TSX implementation, shadcn/Radix, forms, metadata, QA',
    'Companion pen-dev skill — delegated agent and MCP-in-the-loop',
  ],
}

export const CAPABILITIES: Capability[] = [
  {
    id: 'brand',
    number: '01',
    title: 'Brand systems',
    line: 'A name, a mark, a wordmark and the rules that keep them one thing.',
    tone: 'cobalt',
    skills: ['Naming', 'Logo systems', 'Wordmark', 'Brand kit', 'Favicon'],
    evidence:
      'The Sunnyside mark, marker wordmark, compact favicon, reversed lockups and the brand kit all exist as SVG with written rules.',
    next: 'A motion identity and a sound mark; the brand is currently still on paper.',
  },
  {
    id: 'image',
    number: '02',
    title: 'Art direction & image generation',
    line: 'References, a direction, and the images that carry it. A prompt is not a style.',
    tone: 'butter',
    skills: [
      'References',
      'Moodboards',
      'Prompt libraries',
      'Halftone / print',
      'Provenance',
    ],
    evidence:
      'The brand board and the cobalt atmosphere panel are art-directed, but they are drawn, not generated. The image direction exists; the pipeline does not.',
    next: 'A small generated-image pipeline with provenance, rights and a house crop.',
  },
  {
    id: 'systems',
    number: '03',
    title: 'Design systems',
    line: 'Tokens, type, components and the docs that make them reusable.',
    tone: 'mint',
    skills: [
      'Tokens',
      'Type scales',
      'Component rules',
      'Specimens',
      'Accessibility',
    ],
    evidence:
      'The `/sunnyside` specimen, the namespaced `--ss-*` tokens, the CSS/JSON exports, the one-shell archive and the Vitrine case with its own `--vt-*` tokens and form kit.',
    next: 'Component-level docs for the UI primitives, and visual regression in CI.',
  },
  {
    id: 'interface',
    number: '04',
    title: 'Interface engineering',
    line: 'React, Next.js, TypeScript and the browser. The place the decision is tested.',
    tone: 'cobalt',
    skills: [
      'React',
      'Next.js',
      'TypeScript',
      'CSS Modules',
      'Responsive',
      'Edge',
    ],
    evidence:
      'Side A, the archive, the specimen and this page run on the same Next.js app and deploy to Cloudflare Workers.',
    next: 'A committed performance budget, not just a measurement recipe.',
  },
  {
    id: 'motion',
    number: '05',
    title: 'Motion & interaction',
    line: 'Easing, stagger, interruption and the reduced-motion route.',
    tone: 'pink',
    skills: [
      'Motion',
      'GSAP',
      'CSS transitions',
      'Reduced motion',
      'State feedback',
    ],
    evidence:
      'The sticker-slap footer, the marked words, the hover tilt and the scroll work all use the same short, purposeful vocabulary.',
    next: 'Publish the motion spec: duration, ease, distance and the stop rule.',
  },
  {
    id: 'voice',
    number: '06',
    title: 'Content & voice',
    line: 'Naming, microcopy and the notes that make a system legible.',
    tone: 'paper',
    skills: [
      'Naming',
      'Microcopy',
      'Voice pairs',
      'Documentation',
      'Editorial',
    ],
    evidence:
      'The voice pairs, the button copy, the brand guide and the route-by-route README keep the tone specific instead of corporate.',
    next: 'A public voice page; the guidance currently lives inside the specimen data.',
  },
  {
    id: 'tooling',
    number: '07',
    title: 'Tooling & AI',
    line: 'Figma, Pen.dev, agents and the prompts that survive a second project.',
    tone: 'butter',
    skills: ['Figma', 'Pen.dev', 'CLI / MCP', 'Agent skills', 'Prompt design'],
    evidence:
      'The `.pen` sources, the manifest and the 2× exports are in the repo; the site was built with a small, named agent stack.',
    next: 'A live Pen.dev → code loop, with the manifest as the handoff.',
  },
  {
    id: 'delivery',
    number: '08',
    title: 'Delivery & QA',
    line: 'Tests, deploys, monitoring and the second look before it ships.',
    tone: 'mint',
    skills: [
      'Jest',
      'Playwright',
      'GitHub Actions',
      'Cloudflare',
      'Observability',
    ],
    evidence:
      'The project runs unit and e2e tests, deploys through OpenNext on every push, and has a failure notification path.',
    next: 'An automated axe pass and a visual diff on the routes that carry the brand.',
  },
]

export const GAPS = [
  {
    label: 'Performance',
    line: 'The perf doc is a recipe, not a committed score for the current routes.',
  },
  {
    label: 'CI',
    line: 'Tests run; visual regression and an automated accessibility pass do not.',
  },
  {
    label: 'Images',
    line: 'The identity is drawn, not generated. There is no provenance or rights rule for generated imagery.',
  },
  {
    label: 'Pen.dev',
    line: 'The pen-dev skill documents the loop, but the CI-gated agent run is still manual.',
  },
  {
    label: 'Components',
    line: 'The UI primitives have no public spec pages. The specimen documents the language, not every part.',
  },
  {
    label: 'Motion',
    line: 'The pieces are good; the published motion spec is missing.',
  },
  {
    label: 'Skill listing',
    line: 'The brand-system skill installs from the repo; it is not yet listed in the skills.sh registry.',
  },
]

export const AGENT_SKILLS: AgentSkill[] = [
  {
    name: 'brandkit',
    use: 'Identity boards and symbol systems from a written brief.',
    note: 'Running in this workspace',
  },
  {
    name: 'imagegen-frontend-web',
    use: 'Section-by-section visual references before the build.',
    note: 'Running in this workspace',
  },
  {
    name: 'design-taste-frontend',
    use: 'A brief-led direction that rejects templated defaults.',
    note: 'Running in this workspace',
  },
  {
    name: 'implement-brand-system',
    use: 'Turns an approved kit into an HTML/TSX proof without redesigning it.',
    note: 'Running in this workspace',
  },
  {
    name: 'pen-dev',
    use: 'Pen.dev .pen boards, exports and the MCP-in-the-loop workflow.',
    note: 'Running in this workspace',
  },
  {
    name: 'better-typography',
    use: 'Type scale, wrapping, font features and punctuation checks.',
    note: 'ui-skills.com / optional',
  },
  {
    name: 'craft-design-engineering',
    use: 'The small decisions: radii, hit areas, numerals, easing.',
    note: 'craft.gustavofior.com',
  },
  {
    name: 'frontend-ui-engineering',
    use: 'Accessible, responsive production UI and real states.',
    note: 'Running in this workspace',
  },
  {
    name: 'ui-ux-pro-max',
    use: 'Design-system and UX checks before delivery.',
    note: 'Running in this workspace',
  },
  {
    name: 'accessible-animation',
    use: 'Reduced-motion tiers instead of an all-or-nothing switch.',
    note: 'Running in this workspace',
  },
  {
    name: 'find-skills',
    use: 'Find the tool before inventing it.',
    note: 'skills.sh',
  },
]

export const RESOURCES: Resource[] = [
  {
    label: 'Craft — the index',
    href: 'https://craft.gustavofior.com/',
    note: 'Design-engineering concepts: type, colour, layout, motion, sound, data.',
    group: 'Read',
  },
  {
    label: 'Craft — resources',
    href: 'https://craft.gustavofior.com/resources',
    note: 'The references Gustavo keeps coming back to, grouped by discipline.',
    group: 'Read',
  },
  {
    label: 'Pen.dev — .pen files',
    href: 'https://docs.pen.dev/core-concepts/pen-files',
    note: 'The open, JSON-based design file that can live in the repo.',
    group: 'Tool',
  },
  {
    label: 'Pen.dev — agents & skills',
    href: 'https://docs.pen.dev/core-concepts/ai-agents',
    note: 'Working with a model on the canvas, with context and permissions.',
    group: 'Tool',
  },
  {
    label: 'Figma — variables',
    href: 'https://help.figma.com/hc/en-us/articles/15339657135383-Guide-to-variables-in-Figma',
    note: 'Colour, number, string and boolean tokens with modes.',
    group: 'Tool',
  },
  {
    label: 'Figma — auto layout',
    href: 'https://help.figma.com/hc/en-us/articles/360040451373-Guide-to-auto-layout',
    note: 'The responsive behaviour that survives a real content length.',
    group: 'Tool',
  },
  {
    label: 'ui-skills',
    href: 'https://www.ui-skills.com/skills/',
    note: 'The agent-skill directory the archive’s Skills page is built from.',
    group: 'Skill',
  },
  {
    label: 'The brand kit',
    href: '/brand/sunnyside-brandkit.png',
    note: 'The identity board, with the lockup, palette, type and favicon sizes.',
    group: 'Artefact',
  },
]
