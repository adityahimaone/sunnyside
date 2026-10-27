import {
  AGENT_SKILLS,
  BRAND_SKILL,
  CAPABILITIES,
  CASE,
  GAPS,
  LOOP,
  PRACTICE,
  PRINCIPLES,
  RESOURCES,
  STANDARDS,
  SYSTEM,
  VITRINE_CASE,
} from './design-engineering-data'
import { LEARNING_TRACKS } from './learning-data'

const BASE = 'https://adityahimaone.space'

const absolute = (href: string) =>
  href.startsWith('/') ? `${BASE}${href}` : href

const cell = (value: string) => value.replace(/\|/g, '\\|').replace(/\n/g, ' ')

const link = (label: string, href: string) => `[${label}](${absolute(href)})`

const table = (head: string[], rows: string[][]) =>
  [
    `| ${head.map(cell).join(' | ')} |`,
    `| ${head.map(() => '---').join(' | ')} |`,
    ...rows.map((row) => `| ${row.map(cell).join(' | ')} |`),
  ].join('\n')

export function docsMarkdown() {
  return `# Design engineering — field manual

> ${PRACTICE.standfirst}

Canonical: ${BASE}/design-engineering
Updated: 2026
For: humans and agents. This is the Markdown twin of the page.

${PRACTICE.intro}

${PRACTICE.body}

## 01 — The practice

### The loop

${LOOP.map(
  (step) => `**${step.number} / ${step.title}.** ${step.line}

_Sunnyside:_ ${step.example}`,
).join('\n\n')}

### Principles

${PRINCIPLES.map(
  (principle) =>
    `- **${principle.title}.** ${principle.line}${
      principle.origin ? ` _(${principle.origin})_` : ''
    }`,
).join('\n')}

## 02 — Standards

${STANDARDS.map(
  (standard) => `### ${standard.number} / ${standard.title}

_${standard.file}_

${standard.line}

${standard.checks.map((check) => `- ${check}`).join('\n')}

Source: ${link(standard.source.label, standard.source.href)}`,
).join('\n\n')}

## 03 — The system

${SYSTEM.lede}

### Colour

${table(
  ['Name', 'Token', 'Hex', 'Role'],
  SYSTEM.swatches.map((swatch) => [
    swatch.name,
    swatch.token,
    swatch.hex,
    swatch.role,
  ]),
)}

### Type

${table(
  ['Role', 'Face', 'Specimen'],
  SYSTEM.voices.map((voice) => [voice.role, voice.name, voice.sample]),
)}

### The chain

${SYSTEM.chain.map((item) => `- **${item.label}.** ${item.line}`).join('\n')}

Links: ${SYSTEM.links.map((item) => link(item.label, item.href)).join(' · ')}

## 04 — The case: ${CASE.title}

${CASE.subtitle}

- **Role:** ${CASE.role}
- **Status:** ${CASE.status}
- **Stack:** Next.js, TypeScript, CSS Modules, Cloudflare
- **Cover:** ${absolute(CASE.cover)}

${CASE.brief}

### Constraints

${CASE.constraints.map((item) => `- ${item}`).join('\n')}

### Decisions

${CASE.decisions
  .map(
    (decision, index) =>
      `${String(index + 1).padStart(2, '0')}. **${decision.title}** ${decision.line}`,
  )
  .join('\n')}

### What shipped

${CASE.outcomes.map((item) => `- ${item}`).join('\n')}

### Evidence

${CASE.evidence
  .map((item) => `- ${link(item.label, item.href)} — ${item.note}`)
  .join('\n')}

## 04b — The case: ${VITRINE_CASE.title}

${VITRINE_CASE.subtitle}

- **Role:** ${VITRINE_CASE.role}
- **Status:** ${VITRINE_CASE.status}
- **Stack:** Next.js, TypeScript, CSS Modules, dithercn
- **Full case:** ${absolute(VITRINE_CASE.href)}
- **Case library:** ${absolute(VITRINE_CASE.library)}
- **Cover:** ${absolute(VITRINE_CASE.cover)}

${VITRINE_CASE.brief}

### Constraints

${VITRINE_CASE.constraints.map((item) => `- ${item}`).join('\n')}

### Decisions

${VITRINE_CASE.decisions
  .map(
    (decision, index) =>
      `${String(index + 1).padStart(2, '0')}. **${decision.title}** ${decision.line}`,
  )
  .join('\n')}

### What shipped

${VITRINE_CASE.outcomes.map((item) => `- ${item}`).join('\n')}

### Evidence

${VITRINE_CASE.evidence
  .map((item) => `- ${link(item.label, item.href)} — ${item.note}`)
  .join('\n')}

## 05 — Capabilities

${table(
  ['#', 'Capability', 'Evidence', 'Next'],
  CAPABILITIES.map((capability) => [
    capability.number,
    `${capability.title} — ${capability.line}`,
    capability.evidence,
    capability.next,
  ]),
)}

### Honest gaps

${GAPS.map((gap) => `- **${gap.label}.** ${gap.line}`).join('\n')}

### Agent stack

${table(
  ['Tool', 'Use', 'Source'],
  AGENT_SKILLS.map((skill) => [skill.name, skill.use, skill.note]),
)}

## 06 — The skill

${BRAND_SKILL.description}

v2.0 was rebuilt after an audit of [ui-skills.com](https://www.ui-skills.com/).
The registry lists 439 skills across 27 categories; 22 relevant ones were
inspected and fused into a brand pass and an implementation pass. It ships to a
standalone page, app route, Storybook, pen or print, and covers modern directions
from liquid glass to dither. The audit is in references/ui-skills-fusion.md.

Install:

\`\`\`bash
${BRAND_SKILL.install}
\`\`\`

Inside:

${BRAND_SKILL.includes.map((item) => `- ${item}`).join('\n')}

- ${link('Read SKILL.md', BRAND_SKILL.file)}
- ${link('Browse the package', BRAND_SKILL.repo)}
- ${link('skills.sh', 'https://skills.sh/')}

## 07 — Field notes

${LEARNING_TRACKS.map(
  (track) =>
    `- **${track.number} / ${track.label}** — ${track.title} ${link(
      'Open the track',
      `/design-engineering/learning#${track.id}`,
    )}`,
).join('\n')}

## 08 — Sources

${table(
  ['Type', 'Resource', 'Note'],
  RESOURCES.map((resource) => [
    resource.group,
    link(resource.label, resource.href),
    resource.note,
  ]),
)}

---

Read this as Markdown: ${BASE}/design-engineering/llms.txt
`
}

export function learningMarkdown() {
  const sources = Array.from(
    new Map(
      LEARNING_TRACKS.flatMap((track) =>
        track.sources.map((source) => [source.href, source] as const),
      ),
    ).values(),
  )

  return `# Field notes — design engineering

> What the tools taught me, written down before it evaporates.

Canonical: ${BASE}/design-engineering/learning
Updated: 2026
For: humans and agents. This is the Markdown twin of the page.

Pen.dev first, because the source can live in the repo. Figma for the import and the handoff. Craft for the second look. Prompts that survive either tool.

## How to use this

${LEARNING_TRACKS.map(
  (track) => `- **${track.number} / ${track.label}** — ${track.title}`,
).join('\n')}

${LEARNING_TRACKS.map(
  (track) => `## ${track.number} — ${track.label}

${track.title}

${track.intro}

${track.tips
  .map(
    (tip) => `### ${tip.number} / ${tip.title}

**Do.** ${tip.do}

**Why.** ${tip.why}`,
  )
  .join('\n\n')}

### ${track.starterLabel}

\`\`\`
${track.starter}
\`\`\`

Sources: ${track.sources
    .map((source) => link(source.label, source.href))
    .join(' · ')}`,
).join('\n\n')}

## 05 — Sources

${table(
  ['Source', 'URL'],
  sources.map((source) => [source.label, source.href]),
)}

---

Back to the manual: ${BASE}/design-engineering
`
}
