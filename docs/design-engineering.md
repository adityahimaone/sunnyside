# Design engineering — docs architecture and domain notes

**Status (v2):** the hub is a documentation surface, the Learning wing is one
visible page, the release shelf has been removed, and the method ships as an
installable skill. The open questions below are for v3.

A working note for `/design-engineering`, its `/learning` wing, the Markdown
twins and the `sunnyside-brand-system` skill. It records the decisions, the
content sources and the questions still open. It is the repo-side companion to
the public docs.

## One sentence

A public manual for the practice: how the work is framed, the standards it is
held to, the Sunnyside case that proves it, the capability map, the method as a
skill, and the notes that make the next project faster.

## Who it is for

1. A hiring manager or client asking "what does a design engineer actually do?"
2. A peer looking for the standards, the file structure or the Pen.dev loop.
3. An agent that needs one canonical, linkable source for the practice.
4. Aditya, six months from now, looking for the decision that explains the page.

The page is evidence-first. It shows shipped artefacts and named decisions
before it lists capabilities. It also names the gaps.

## Routes

| Route | Job |
| --- | --- |
| `/design-engineering` | Docs hub: practice, standards, system, case, capabilities, skill, learning, sources |
| `/design-engineering/learning` | Field notes: Pen.dev, Figma, Craft, prompts, sources |
| `/design-engineering/llms.txt` | Raw Markdown twin of the hub |
| `/design-engineering/learning/llms.txt` | Raw Markdown twin of the field notes |

All four sit beside the archive shell; the HTML routes inherit the header,
footer, grain and `--ss-*` tokens. The hub links to `/sunnyside`, `/projects`,
the brand kit and the skill; it does not duplicate them.

## The docs shell

- A sticky contents column (220px) on the left, a 760px article on the right,
  centred in the archive container.
- The sidebar is a client island: it tracks the section in view with a scroll
  listener and sets `aria-current="location"`. At `≤1080px` it becomes a native
  `<details>` "On this page" above the article.
- `h1 → h2 → h3` only; every section heading has a stable `id`, a visible-on-
  focus `#` anchor and `scroll-margin-top`.
- Body copy is 16px / 1.75 with a 70ch measure. Small labels are 0.54–0.64rem;
  body text is not set in an accent colour.
- Tables are real `<table>` elements with `<caption>`, `<th scope>` and a
  `data-label` per cell. Below 760px each row stacks into labelled fields.
- On the Learning page, the four tracks are **visible sections**, not tabs. The
  old `learning-tabs.tsx` is deleted; nothing important is hidden behind JS.
- Figures keep the 1px outline; the install and starter code blocks use a real
  copy button (44px, press scale 0.96, 150ms).
- `prefers-reduced-motion` removes transforms and transitions; hover effects are
  gated behind `@media (hover: hover)`; the sidebar and table scrollers use
  `overscroll-behavior`.

## Chapters

1. **Overview** — the definition, the lede, the meta, the "read as Markdown"
   link.
2. **Practice** — the loop (read → direction → system → proof → write → measure)
   and the principles.
3. **Standards** — four checkable standards with their source link:
   the design contract, the interface standard, the token rule, the handoff.
4. **System** — lockup figure, palette table, type table, token chain, links to
   the specimen and brand kit.
5. **Case** — the Sunnyside brief, constraints, decisions, shipped outcomes and
   evidence. **No selected releases.** `/projects` is linked as the shelf.
6. **Capabilities** — a capability/evidence/next table, the honest gaps, the
   agent stack.
7. **Skill** — the installable `sunnyside-brand-system` package, install command,
   contents, links to `SKILL.md` and the repo folder.
8. **Learning** — a short callout with the four track links and a CTA.
9. **Sources** — a grouped table of the read/tool/skill/artefact references.

## Domain glossary

| Term | Meaning in this page |
| --- | --- |
| **Practice** | The loop and principles, not a job title. |
| **Standard** | A checkable rule with a source, e.g. "44px targets, 8px apart". |
| **Artefact** | A shipped, inspectable thing: a route, a token export, a brand kit, a `.pen` source. |
| **Case** | A brief → constraints → decisions → outcome → gaps argument. |
| **Capability** | A skill category with evidence and a named next step. |
| **Lesson** | A transferable tip tied to a tool or a Craft concept. |
| **Agent skill** | A packaged method or tool that changes the workflow, not a human capability. |
| **Gap** | An honest missing piece in the current Sunnyside example. |
| **Docs twin** | The Markdown route generated from the same data as the HTML page. |

The page separates **capability** from **agent skill**. A model is not a
substitute for the judgement that decides what to keep.

## Content sources

| Content | Source |
| --- | --- |
| Principles | `features/landing-page/studio/studio-data.ts` (`PRINCIPLES`) |
| Palette / type / motion | `features/design-system/sunnyside-data.ts`, `design.md` |
| Logo / brand rules | `design/brand/README.md`, `public/brand/` |
| Case decisions | `design.md`, `README.md`, `design/manifest.json` |
| Release catalogue | `/projects` (linked, not embedded) |
| Agent skills | the workspace skill catalogue; `https://skills.sh/` |
| Craft checks | `https://craft.gustavofior.com/` |
| Pen.dev workflow | `https://docs.pen.dev/`, `design/*.pen` |
| Figma workflow | Figma Help Center (variables, auto layout, Dev Mode) |
| The method as a skill | `skills/sunnyside-brand-system/` |

## Assumptions

- The page is public and indexable; it is linked from "Practice" in the archive
  header and the Side A menu.
- The Sunnyside case is the only result on this page. The other releases are in
  `/projects`; adding a release does not require new markup here.
- "Results" means shipped artefacts and decisions, not invented performance
  numbers. The perf doc is a recipe, so the page does not quote a score.
- Pen.dev is the first-class design source. Figma is documented as the import /
  collaboration path, not the source of truth.
- Docs are readable without JS. The Markdown twin is generated from the same
  data; it is not hand-maintained.
- The skill is the agent-facing version of the method. The page stays the
  human-facing guide; both must be updated together.

## The installable skills

`skills/sunnyside-brand-system/` is a normal `SKILL.md` package, installable via
the `skills` CLI:

```bash
npx skills add adityahimaone/sunnyside --skill sunnyside-brand-system --full-depth
```

It contains the method, ten references, seven scripts, five templates and two
cases:

- `SKILL.md` — modes, fast path, token budget, rules, output contract and verification.
- `references/brief.md`, `logo-system.md`, `board-and-images.md`,
  `image-direction.md`, `tokens-and-docs.md`, `design-systems.md`,
  `typography.md`, `verification.md`, `lessons.md`, `ui-skills-fusion.md`.
- `scripts/render-board.mjs`, `render-icons.mjs`, `favicons.py`,
  `downscale.py`, `extract-wordmark.py`, `audit.mjs`, `qa.mjs`.
- `templates/brandkit.html`, `single-page.html`, `case-page.tsx`,
  `audit.json`, `guidelines.md`.
- `examples/sunnyside.md`, `examples/vitrine.md`.

v2.0 was rebuilt after an audit of [ui-skills.com](https://www.ui-skills.com/).
The registry lists 439 skills across 27 categories; 22 relevant ones were
inspected and fused into a brand pass and an implementation pass. The audit and
the fusion rules live in `references/ui-skills-fusion.md`.

The companion `skills/implement-brand-system/` skill turns an approved kit into
the HTML/TSX proof without redesigning it, and `skills/pen-dev/` documents the
delegated pen agent and MCP-in-the-loop workflow:

```bash
npx skills add adityahimaone/sunnyside --skill implement-brand-system --full-depth
npx skills add adityahimaone/sunnyside --skill pen-dev --full-depth
```

The guideline images are **not** AI-generated. The board is HTML/CSS rendered
with Playwright at 2× and downscaled with Lanczos; the mark is SVG; the favicon
and app icons are Pillow. The skill documents AI image generation only for
atmosphere/photography, with prompts, provenance and QA. That distinction is the
part most brand kits get wrong.

## Gaps in the current Sunnyside example

1. No committed performance baseline (the doc has a recipe, not numbers).
2. No visual-regression or accessibility check in CI.
3. No generated-imagery pipeline or provenance; the identity is drawn, not
   generated.
4. Pen.dev is now a companion skill, not yet a CI-gated agent step.
5. No component-level docs for the UI primitives.
6. Motion has strong pieces but no published motion spec.
7. The skill is installable from the repo, not yet listed on skills.sh.

These gaps are shown on the page. A manual that hides its holes is a brochure.

## Open questions (v3)

1. Does `/design-engineering` replace the archive's "Practice" label, or is the
   label "Design engineering" better for a cold visitor?
2. Should standards become individual routes (`/docs/[slug]`) once there are
   more than four?
3. Should the Learning page get per-tool URLs (`/learning/pen-dev`) before the
   first Pen.dev integration?
4. What is the first Pen.dev integration: a source `.pen` for this page, or an
   MCP/CLI loop that writes frames from a brief?
5. Which real outcome can replace the qualitative case result: a shipped metric,
   a client quote, a before/after, or a build-time number?
6. Does the docs hub need a public "services / availability" section, or does
   the archive footer's contact card cover it?
7. Should the Markdown twins be generated at build time into static files rather
   than served by route handlers?
8. Should the skill be published to skills.sh and versioned on its own cadence?

## Non-goals for v2

- A full CMS for lessons.
- A component library embedded in the page.
- Duplicating the `/sunnyside` specimen or the `/projects` catalogue.
- Publishing agent prompts as a product.
- Reintroducing selected releases on the hub.
