/**
 * The Learning wing.
 *
 * Pen.dev is first because it is the design source that can live in the repo.
 * Figma is the import/collaboration path. Craft is the review lens. The prompt
 * track is the bridge between the two: a brief that can go into either tool and
 * still be judged in the browser.
 */

export type LearningTip = {
  number: string
  title: string
  do: string
  why: string
}

export type LearningTrack = {
  id: 'pen' | 'figma' | 'craft' | 'prompts'
  number: string
  label: string
  kicker: string
  title: string
  intro: string
  tips: LearningTip[]
  starterLabel: string
  starter: string
  sources: { label: string; href: string }[]
}

export const LEARNING_TRACKS: LearningTrack[] = [
  {
    id: 'pen',
    number: '01',
    label: 'Pen.dev',
    kicker: 'The source',
    title: 'Design where the file can live with the code.',
    intro:
      'Pen.dev is the first tool in the loop because a `.pen` file is JSON: it can be committed, reviewed and read by an agent. The workflow below is the one in `design/`, not a generic tutorial.',
    tips: [
      {
        number: '01',
        title: 'One file per surface.',
        do: 'Keep `design-engineering.pen` for this route. Do not merge every page into one canvas.',
        why: 'A file that mirrors a route can be reviewed in the same pull request as that route.',
      },
      {
        number: '02',
        title: 'Frame zero is the system.',
        do: 'Open with a 00 frame: tokens, type, marks, radii, spacing. Every screen after it applies those values.',
        why: 'If a screen needs a new value, it belongs in the system frame first — otherwise the system is a rumour.',
      },
      {
        number: '03',
        title: 'Name frames by route, in reading order.',
        do: 'Use `00 / System`, `01 / Hero`, `02 / Practice`, and so on. Map them in `design/manifest.json`.',
        why: 'A reviewer should be able to walk the file like the page. “Frame 37” is not a handoff.',
      },
      {
        number: '04',
        title: 'Let the agent draft; keep the veto.',
        do: 'Ask for three directions on the canvas, keep one, and write down why the other two lost.',
        why: 'The model is useful for divergence. It does not know which compromise your brand can afford.',
      },
      {
        number: '05',
        title: 'Travel with the assets.',
        do: 'Keep referenced fonts, images and library files with the document.',
        why: 'A broken asset turns a design review into a debugging session.',
      },
      {
        number: '06',
        title: 'Edit through the CLI or MCP.',
        do: 'Let the tools write the `.pen` file; do not hand-edit the JSON.',
        why: 'The format is an API. Manual edits create merge conflicts with nicer fonts.',
      },
      {
        number: '07',
        title: 'Export at 2× for review.',
        do: 'Put the PNG next to the source. The export is what gets looked at; the source is what gets edited.',
        why: 'A screenshot in the PR is a shared reference. A canvas nobody opens is not.',
      },
      {
        number: '08',
        title: 'Design → code is a rebuild.',
        do: 'Use the canvas for composition, then rebuild with the real tokens and components.',
        why: 'Generated markup will not know your focus ring, your empty state or your reduced-motion path.',
      },
    ],
    starterLabel: 'A Pen.dev brief for this page',
    starter: `Open a 1440 × 900 frame.
Frame 00 — system
  paper #f3ecdf · ink #191a2e · cobalt #3d53d6 · butter #ffd23f
  Syne 800 / Geist 400 / Geist Mono 500
  radius 4 / 8 / 14 / 20 / 28
Frame 01 — hero
  title, standfirst, contents, one loud field
Frame 02 — case
  Sunnyside case, evidence row, three releases
Frame 03 — learning
  four tracks, one open at a time
Export 2×. Add the frames to design/manifest.json.`,
    sources: [
      {
        label: 'pen.dev — .pen files',
        href: 'https://docs.pen.dev/core-concepts/pen-files',
      },
      {
        label: 'pen.dev — agents and skills',
        href: 'https://docs.pen.dev/core-concepts/ai-agents',
      },
    ],
  },
  {
    id: 'figma',
    number: '02',
    label: 'Figma',
    kicker: 'The import / collaboration path',
    title: 'Make the file argue for the interface.',
    intro:
      'Figma is where a lot of the work is reviewed and where imported Pen.dev frames get annotated. The goal is not a prettier file; it is a file that can survive the handoff.',
    tips: [
      {
        number: '01',
        title: 'Variables are the contract.',
        do: 'Use colour, number, string and boolean variables; publish the collection. Use modes for light/dark, not duplicate frames.',
        why: 'A token name that matches the code is worth more than a perfect swatch.',
      },
      {
        number: '02',
        title: 'Name by route and state.',
        do: '`/design-engineering / hero / title`, `/card / hover`. The name is the handoff.',
        why: 'Search is how a developer finds the frame six weeks later.',
      },
      {
        number: '03',
        title: 'Build the states before the happy path.',
        do: 'Default, hover, focus, pressed, disabled, loading, empty, error. The ugly ones first.',
        why: 'A screen without its states is a poster, not an interface.',
      },
      {
        number: '04',
        title: 'Auto layout is the responsive test.',
        do: 'Set min/max width, wrap and fill container. Test a 60-character label and a 320px frame.',
        why: 'If the frame only works with lorem, the interface only works with lorem.',
      },
      {
        number: '05',
        title: 'Properties and slots, not variant sprawl.',
        do: 'Boolean, text and instance-swap properties; a slot for content. Stop cloning eight near-identical variants.',
        why: 'The file should teach the component’s contract, not its history.',
      },
      {
        number: '06',
        title: 'Dev Mode is part of the design.',
        do: 'Map components to code with Code Connect; check the token names and the measurements in Dev Mode.',
        why: 'The handoff starts before the developer opens the file.',
      },
      {
        number: '07',
        title: 'Keep the file reviewable.',
        do: 'One page per surface, a cover, compressed images, no orphan layers.',
        why: 'A file that takes 30 seconds to load does not get a second review.',
      },
      {
        number: '08',
        title: 'Design the evidence.',
        do: 'Add measurements, a “what changed” frame and the decision that produced the screen.',
        why: 'A screenshot is not a spec. The reason is the part that survives.',
      },
    ],
    starterLabel: 'A Figma page structure that matches the code',
    starter: `00 / Cover
01 / Design engineering — hero
02 / Practice — loop
03 / Results — case
04 / Learning — tabs
05 / States — tabs, buttons, links
06 / What changed — annotations
Variables: colour / semantic, number / space, number / radius
Modes: paper (default)`,
    sources: [
      {
        label: 'Figma — variables',
        href: 'https://help.figma.com/hc/en-us/articles/15339657135383-Guide-to-variables-in-Figma',
      },
      {
        label: 'Figma — auto layout',
        href: 'https://help.figma.com/hc/en-us/articles/360040451373-Guide-to-auto-layout',
      },
    ],
  },
  {
    id: 'craft',
    number: '03',
    label: 'Craft',
    kicker: 'The second look',
    title: 'The details that make it feel drawn, not assembled.',
    intro:
      'A review pass borrowed from Craft, with the Sunnyside exception noted where the house style deliberately disagrees. Use it before calling a page finished.',
    tips: [
      {
        number: '01',
        title: 'Optical alignment beats math.',
        do: 'Nudge the thing until it looks centered. The eye centers the weight, not the box.',
        why: 'A mathematically centered play icon is visibly off; a centered triangle is not.',
      },
      {
        number: '02',
        title: 'Tabular numbers for values that move.',
        do: 'Any changing count, timer or price gets `font-variant-numeric: tabular-nums`.',
        why: 'Proportional digits make a live number jitter as it counts.',
      },
      {
        number: '03',
        title: 'Nested radii should agree.',
        do: 'Inner radius = outer radius − padding. A 16px card with 8px padding needs an 8px child.',
        why: 'A constant radius inside a larger radius looks like a mistake at the corner.',
      },
      {
        number: '04',
        title: 'Hit areas are part of the design.',
        do: '44px minimum, 8px between targets. Give the icon button a larger hit area, not a larger icon.',
        why: 'The pointer is not the only input; the thumb is usually the one that misses.',
      },
      {
        number: '05',
        title: 'Choose the edge on purpose.',
        do: 'Sunnyside uses a 1.5px ink border because the edge is printed. Use a shadow when elevation is the message, not as the default.',
        why: 'A hard border and a soft shadow say different things about the same surface.',
      },
      {
        number: '06',
        title: 'Give images an outline.',
        do: 'A 1px inset ring keeps a light image from bleeding into paper.',
        why: 'Without it, a pale screenshot has no edge and the layout looks unfinished.',
      },
      {
        number: '07',
        title: 'Test the actual text/background pair.',
        do: 'Light text on dark renders heavier. Check the pair, not the hex values in isolation.',
        why: 'Font smoothing changes the perceived weight; a contrast ratio does not describe it.',
      },
      {
        number: '08',
        title: 'Ease out, exit faster.',
        do: 'Enter with an ease-out curve, leave sooner. One duration for every transition is a tell.',
        why: 'Waiting for an exit is more annoying than waiting for an entrance.',
      },
      {
        number: '09',
        title: 'Stagger the group, not every child.',
        do: 'A short stagger on a row is enough. Stop before it becomes a loading screen.',
        why: 'The last item should not arrive after the reader has already scrolled past.',
      },
      {
        number: '10',
        title: 'Make it interruptible.',
        do: 'The second input must not wait for the first animation. Exit removes the node after it is gone.',
        why: 'Fluid interfaces answer the latest intent, not a queue of old ones.',
      },
    ],
    starterLabel: 'The ten-minute finish pass',
    starter: `[ ] optical alignment on every icon + label row
[ ] tabular numerals on the counters
[ ] nested radii checked
[ ] 44px targets, 8px apart
[ ] image outlines on every screenshot
[ ] focus visible on paper and cobalt
[ ] reduced-motion path exists
[ ] 320 / 768 / 1024 / 1440 checked
[ ] one decorative thing removed`,
    sources: [
      { label: 'Craft — the index', href: 'https://craft.gustavofior.com/' },
      {
        label: 'Craft — resources',
        href: 'https://craft.gustavofior.com/resources',
      },
    ],
  },
  {
    id: 'prompts',
    number: '04',
    label: 'Prompts',
    kicker: 'The bridge',
    title: 'Briefs that survive the tool.',
    intro:
      'These are working prompts, not incantations. Each one names the output, the evidence and the thing to reject, so the result can be judged in the browser instead of in the chat.',
    tips: [
      {
        number: '01',
        title: 'A brand kit brief starts with a metaphor.',
        do: 'Name the symbol logic, the palette, the grid and the panels. Ask for a 3×3 board with one loud field.',
        why: 'A model asked for “a premium brand” will produce the same premium brand it produces for everyone.',
      },
      {
        number: '02',
        title: 'A critique prompt asks for the weakest five.',
        do: 'Name the checks: hierarchy, states, contrast, keyboard, responsive, generic patterns. Ask for the smallest fix, not a redesign.',
        why: 'A broad “make it better” produces a new page. A constrained critique produces a decision.',
      },
      {
        number: '03',
        title: 'A motion audit counts the moves.',
        do: 'List every animation: purpose, property, duration, ease, trigger, reduced-motion path. Delete what cannot answer the purpose.',
        why: 'Motion is easiest to justify when it is written down next to the thing it explains.',
      },
      {
        number: '04',
        title: 'A Pen.dev brief starts with frame zero.',
        do: 'Ask for the system frame before the screens. Name the canvas, the tokens, the routes and the export size.',
        why: 'A canvas with no system frame is six screens with six different ideas about spacing.',
      },
      {
        number: '05',
        title: 'An image brief names the light, the crop and the refusal.',
        do: 'Describe the subject, light, material, grain and palette; list what must not appear; ask for 16:10 and 4:5 crops.',
        why: 'A model fills a vague image brief with the same stock sun, smile or gradient.',
      },
    ],
    starterLabel: 'The page-critique prompt',
    starter: `Audit /design-engineering as a design engineer.
Check: hierarchy, spacing scale, component states, contrast,
keyboard path, reduced motion, 320/768/1024/1440, and any
generic patterns that could belong to any portfolio.
Return: the five weakest things, why each is weak, and the
smallest concrete fix. Do not redesign the page.
Do not invent metrics.`,
    sources: [
      {
        label: 'Craft — the checks behind the prompts',
        href: 'https://craft.gustavofior.com/',
      },
      {
        label: 'ui-skills — the tool directory',
        href: 'https://www.ui-skills.com/skills/',
      },
    ],
  },
]
