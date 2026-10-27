---
name: sunnyside-brand-system
description: Design and ship a brand kit or design system from a brief — strategy, logo family, 3×3 board, favicons, tokens, single-page HTML/TSX proof, components and forms, and a fast audit. Use when creating or auditing an identity, design-system page, mockup, or pen.dev design source. Includes shadcn/Radix defaults, a typography gate, lean QA, and pen.dev integration.
metadata:
  author: adityahimaone
  source: https://github.com/adityahimaone/sunnyside
  version: '2.0'
---

# Sunnyside brand system

One idea → one mark → one system → one proof → one audit.

A method for shipping a **brand kit** or **design system** quickly without losing
the reasoning. The output is a page or a small set of files, not a folder of
exports. Sunnyside and Vitrine are evidence, not templates.

**v2.0 provenance:** rebuilt after an audit of [ui-skills.com](https://www.ui-skills.com/)
(439 skills / 27 categories; 22 relevant skills inspected). The fusion is in
`references/ui-skills-fusion.md`; the implementation half is `implement-brand-system`.

## Read this first

Pick the smallest deliverable that answers the request.

| Mode | Use when | Deliverable | Stop rule |
| --- | --- | --- | --- |
| **Brand kit** | A named identity is needed | Brief, mark family, board, favicon set, tokens, guide, audit | Every asset has a use, size and source |
| **Design system** | Components/forms must be reusable | Tokens, 5–10 primitives, one form kit, proof page, docs | Keyboard + light/dark proof pass |
| **Mockup** | A visual direction needs to be seen | One HTML/TSX page, real copy, 3–5 sections, one component group | Reads at 1440 and 390; no asset set promised |
| **Audit / QA** | Something exists and needs a verdict | Scorecard, evidence paths, fixes, gaps | Every claim has a file or a browser check |
| **pen.dev** | A canvas/board source is wanted | `.pen` + 2× PNG, reconciled with code tokens | Code remains the source of truth |

If the ask is to **build the page**, finish the kit and hand off to
`implement-brand-system`. This skill owns the decision; that skill owns the
execution.

If no brief exists, ask for: name, category, audience, promise, positioning,
stack/sizes/accessibility, three references, deliverables. Write `brief.md` before
drawing; mark unknowns `ASSUMPTION`. Template: `references/brief.md`.

## Fast path

1. **Brief and one sentence** the work can be rejected against.
2. **One idea**: monogram + meaning, product action, metaphor fusion, negative
   space, or construction geometry. One metaphor, one loud field.
3. **Draw six, keep one** on the same 64 grid. Write down why five lost.
4. **Build identity first** (`mark → family → tokens`) or **tokens first**
   (`tokens → primitives → forms`), never both at once.
5. **One proof page** with real copy and states. HTML for a board/mockup, TSX for
   an interactive system.
6. **Audit and stop**: static audit + one QA pass. Fix only what fails. Name gaps.

## Domain before defaults

Before drawing, name four things:

- **5 domain concepts or metaphors** from the product's world, not its features;
- **5 colours from the physical version** of that world (materials, light, objects);
- **one signature** that could only belong to this product;
- **3 obvious defaults** for this category, visual and structural.

Remove the product name from the proposal. If it could belong to any product in
the category, explore deeper before drawing.

## Visual direction

Choose a **material system**, not a trend label. One signature, then restraint.
Read `references/visual-directions.md` before proposing.

Current families worth knowing: liquid glass/glassmorphism, dither/halftone/1-bit,
neo-brutalist/raw, editorial/Swiss, bento/modular, gradient mesh/aurora,
grain/paper/risograph, 3D/WebGL, monochrome/pixel/ASCII.

For each, the reference gives the use case, recipe, fallback and trap. The short
version: one effect, content on a solid surface, measure the composite, respect
reduced motion, and never use a trend as the only idea.

## Token budget

- Read this file, then only the reference for the current mode.
- Six marks in **one** file; one render; one board.
- Use the templates and scripts; do not rewrite a renderer.
- One token source → CSS + JSON; never hand-edit generated output.
- One screenshot per viewport/theme, one QA run, one fix pass. Full-page only when
  the section cannot be judged otherwise.
- Stop at the acceptance test. Extra sections are not “more complete”.

## Delivery formats

| Format | Best for | Rules |
| --- | --- | --- |
| **System specimen** | Single-page design system, styleguide, docs | `design-system.html` (or TSX): topbar + contents + hero + foundations/material/marks/colour/type/parts/motion/voice/applications/tokens/audit |
| **Board / mockup** | Brand board, static case, one-page proof | One file + token block; real fonts/assets; no build; render at 2× |
| **TSX** | Product styleguide, forms, interactive case | Next/React + Tailwind v4; shadcn/Radix; host route or Storybook; small client islands |
| **Both** | Board + product page | One token source; HTML is the review artefact, TSX is the product |
| **pen.dev** | Visual source | `.pen` + 2× PNG; never the final wordmark/type/code |

Start from `templates/design-system.html` for a specimen, `templates/single-page.html` for a simple mockup, or `templates/case-page.tsx` for a case route. Use the project’s existing fonts/tokens before adding a system.

## Stack defaults

- **shadcn/ui + Radix** for accessible primitives already in the project; do not
  rebuild dialog, select, switch, tabs or slider.
- **Native elements** for text, email, password, textarea, checkbox, radio, file.
- **Radix** for portals/focus: Select, Dialog, Popover, Switch, Slider, Accordion,
  Tabs.
- **Own the source**: shadcn copies code into the repo; style with semantic tokens,
  keep ARIA/state behaviour.
- **3–6 primitives**, not 30. Judge the system by the form kit and proof page.
- **CSS variables** for colour/type/space/radius/motion/component decisions.
- **One effect** (glass, dither, grain, gradient, motion); everything else quiet.

Details: `references/design-systems.md`.

## Typography gate

Run before the first screenshot:

- 2–3 families; body 16–18px; inputs ≥14px (16px on mobile); captions ≥13px.
- Weight ≥400 below 18px; unitless line-height (display 1.1, body 1.5–1.6).
- Measure 60–75 characters; `text-wrap: balance` on headings, `pretty` on
  paragraphs.
- Tracking in `em`; `tabular-nums` on changing numbers; truncation has a way back.
- Typographic punctuation; `lang`/`dir`/`<bdi>`; text selectable; smoothing once
  on the root.
- Wordmark outlines; no display-face paragraphs; real specimens, not lorem.

Full gate and failure table: `references/typography.md`. Upstream source:
[better-typography](https://www.ui-skills.com/skills/jakubkrehel/better-typography)
(`npx skills add jakubkrehel/skills --skill better-typography`).

## Brand rules

- **One idea, one loud field.** Two metaphors means it is not reduced.
- **Draw, do not source.** Geometry, not clipart or generated marks.
- **Test 16px first.** If it fails small, it is not a mark yet.
- **Wordmark is a drawing.** Outlines, never live text.
- **Palette by role.** Accents are punctuation, not body text.
- **Document the decision.** Why, when not, what breaks next.

## Explore six, keep one

| Test | Pass condition |
| --- | --- |
| Silhouette | Black shape at 32px still reads |
| Reduction | ≤3 shapes or one continuous stroke |
| Meaning | One sentence without naming the visual |
| Scale | 16, 32, 64, 512, favicon |
| Ownability | Not a generic sun/bolt/leaf/shield/app tile |
| System | Leaves room for wordmark, favicon, board |

Keep one; the rejection note becomes the guide.

## Build order

**Brand kit:** brief → six → one mark + compact → outlined wordmark/family →
palette/type/tokens → board → icons → guide → audit.

**Design system:** brief + one effect → token source → primitives → form kit →
proof page → docs → audit. For a single-page specimen, follow the /sunnyside
anatomy: topbar → contents → hero (name, version, promise, stats, sheet) →
foundation → material → marks → colour → type → parts → motion → voice →
applications → tokens → audit/endcap.

**Mockup:** sentence + three refs → 10–20 tokens → one page (hero + 3–5 sections +
one component group) → 1440/390 check → stop.

Recipes: `references/logo-system.md`, `references/board-and-images.md`,
`references/tokens-and-docs.md`.

## Surfaces, not assumptions

A brand kit can live in a product app, a marketing site, a docs site, a Storybook,
a standalone HTML file, a pen/Figma workspace, or print. **Do not invent routes.**
Read `references/workspace-contexts.md` and choose:

| If the host has… | Build | Do not assume |
| --- | --- | --- |
| No UI / one deliverable | `design-system.html` or a board | A router, sitemap or llms twin |
| Existing app shell | A host route, settings page or Storybook | `/design-system`, `/design-engineering` |
| Docs site | Docs page + live specimens | A separate case library |
| Portfolio/archive | Case index + case page only if the brief asks | That every system needs a case |
| Component library | Storybook/Ladle stories + docs | A marketing page |
| Pen/Figma workspace | `.pen`/Figma + 2× exports + `DESIGN.md` | A code route |

If routes exist, use the host’s convention and update only what exists: canonical,
OG, icons, sitemap, llms, nav/footer, tests. If no route exists, do not create
empty metadata, a sitemap entry or a case card to satisfy a template. The
specimen can be one file; the board can be the deliverable.
## Pen.dev

Use the companion **`pen-dev`** skill for the full workflow. In short:

- **Delegated agent** for exploration: `pen --out board.pen --prompt "…"
  --prompt-file brief.md --export board.png --export-scale 2 --usage usage.json
  --max-failed-calls 3 --agent claude`.
- **MCP-in-the-loop** for exact edits: `pen interactive --out board.pen
  --enable-preview`, then `read_skill()` → `get_app_state()` → `execute()` →
  `save()`.
- Read `pen-schema.md` and `execute.md` before the first `execute`.
- Never let pen draw the final wordmark/logo/type from live text, and never let
  the `.pen` replace the code tokens. One delegated run + at most two correction
  passes.

## Lean QA

Run these from this skill folder, or copy `scripts/` into the project.

```bash
node scripts/audit.mjs --manifest audit.json
node scripts/qa.mjs --url <the surface URL or file:// path> \
  --out docs/screenshots --name <slug>
```

Then inspect only what scripts cannot judge: mark at 16px, lockup/390 header,
board at 100%/50%, form focus/error/disabled/success, one dark + one light
section, no 390 overflow. Body 4.5:1, large 3:1; measure. Write **Not verified**
for anything you did not inspect. Fix root causes (specificity, tokens), not
screenshots. Full checklist: `references/verification.md`.

## Lessons from Case 02

- Generic `img`/`a` rules beat state/component classes; test computed styles.
- State selectors break easily under scripted edits; test off/on and both themes.
- Dark inverse scopes drift; generate or sync them.
- Route moves and boards overflow silently; use a checklist and inspect 100%/50%.
- Fewer artifacts, more proof: if the host has cases, index + one case + one
  manual section + one board; otherwise one specimen + one board.

Details: `references/lessons.md`; case: `examples/vitrine.md`.

## Failure modes

- Emoji sun / app-store tile: charm or a rounded square instead of an idea.
- Live text wordmark; fonts fail and the logo changes.
- A board with no exportable mark/favicon/token file.
- Guidelines only in a PDF/Figma.
- A component museum with no form kit.
- “Looks good” with no computed values or file paths.

## Output contract

Adapt paths to the host project. Every asset has a use, size and source; every
claim points to a file or route; icons are tested at 16px; the page is readable
without JS.

```
brand/         brief.md, DESIGN.md, brandkit.html, <slug>-brandkit.png (3000×2250), assets/
public/brand/<slug>/   mark*, wordmark, lockups, glyph, favicons, icons,
                       <slug>-brandkit.png, <slug>-tokens.css/json
docs/                  <slug>-design-system-audit.md
```

Then the surface follows the host:

```
standalone      design-system.html
app route       app/<host-route>/page.tsx + <host-route>/llms.txt (only if the host has one)
storybook       <Component>.stories.tsx + docs
pen             <slug>.pen + exports
print           <slug>.pdf/png + rules
```

For a design system add the component inventory and form states; for a mockup
promise only the page and its tokens.

## Handoff to implementation

Stop when the kit is approved. Do not build the product page inside the brand
pass. Hand off:

- `brief.md` and `DESIGN.md` (or the project's design guide/README: the decisions,
  rules and what not to do);
- `tokens.json` + `tokens.css`, with the contrast pairs;
- `public/brand/<slug>/` (mark, compact mark, wordmark, lockups, favicons, icons);
- the board PNG and `brandkit.html`;
- the component inventory, form states, motion rule and named gaps;
- the audit and the target surface/stack (route, Storybook, standalone file, pen or print).

Load **`implement-brand-system`** for the HTML/TSX build. It will not redesign
the kit; it maps tokens, composes sections, uses shadcn/Radix or native controls,
and runs the QA gate.

## References

- `brief.md` — brief and review gates.
- `logo-system.md` — concepts, grid, family, favicon.
- `board-and-images.md` — board, render pipeline, image QA.
- `image-direction.md` — prompts and provenance.
- `tokens-and-docs.md` — token layers and agent-readable docs.
- `design-systems.md` — shadcn/Radix, primitives, forms, surfaces.
- `visual-directions.md` — liquid glass, dither, brutalist, editorial, bento, 3D, grain and sources.
- `workspace-contexts.md` — app, docs, portfolio, standalone, Storybook, pen, print.
- `ui-skills-fusion.md` — the ui-skills audit and the fused operating rules.
- `typography.md` — the typography gate.
- `verification.md` — ship checklist and audit format.
- `lessons.md` — Case 02 failures and rules.
- `examples/sunnyside.md`, `examples/vitrine.md` — the two cases (evidence, not defaults).

## Scripts and templates

`render-board.mjs`, `render-icons.mjs`, `favicons.py`, `downscale.py`,
`extract-wordmark.py`, `audit.mjs`, `qa.mjs`.

`templates/`: `design-system.html`, `brandkit.html`, `single-page.html`,
`case-page.tsx`, `audit.json`, `guidelines.md`.

## How to use this skill well

1. Brief first; write the one-sentence direction.
2. Six, keep one, write down why.
3. Choose the surface and HTML/TSX before building.
4. shadcn/Radix where accessible primitives matter; native for the rest.
5. Typography gate before the first screenshot.
6. Scripts for audit/QA; one look; fix the root cause; stop.
7. Name what is missing. A guide that hides its gaps is a brochure.
