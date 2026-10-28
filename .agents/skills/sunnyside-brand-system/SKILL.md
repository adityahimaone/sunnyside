---
name: sunnyside-brand-system
description: Design and ship a brand kit or design system from a brief — strategy, a generated vector logo family, brand story, 3×3 board, favicons, tokens, theme-matched form kit, single-page HTML/TSX proof, and a fast audit. Use when creating or auditing an identity, design-system page, mockup, or pen.dev design source. Includes shadcn/Radix defaults, a typography gate, lean QA, and pen.dev integration.
metadata:
  author: adityahimaone
  source: https://github.com/adityahimaone/sunnyside
  version: '2.3'
---

# Sunnyside brand system

One idea → one mark → one system → one proof → one audit.

A method for shipping a **brand kit** or **design system** quickly without losing
the reasoning. The output is a page or a small set of files, not a folder of
exports. Sunnyside and Vitrine are evidence, not templates.

**v2.3:** refactors the engine around the **v2.3 hard gate** (zero-circle / fill-only / 2–4 primitives) and five allowed families: architectural monogram, offset planes, louvers, ribbon, horizon. Fuses [adityahimaone.space/design-system](https://adityahimaone.space/design-system) (warm editorial minimalism, architectural grid, solid fills), [Leonxlnx/taste-skill](https://github.com/Leonxlnx/taste-skill) (anti-slop, subject-derived metaphors, no repetitive tropes) and [MengTo/Skills company-logos](https://github.com/MengTo/Skills) (64×64, fill-only, monochrome-first).

**v2.2:** fuses the discipline and pattern families of
[op7418/logo-generator-skill](https://github.com/op7418/logo-generator-skill):
a six-family brainstorm (`references/logo-brainstorm.md`), a bake-off command,
five more concepts (dotmatrix, lines, overprint, nodes, monogram) and an
objective mark scorer (`scripts/score-mark.py`).

**v2.1:** adds a generated vector logo family (`scripts/brand-forge.mjs`), a
storytelling layer (`references/storytelling.md`), theme-matched form fields
(`references/form-theming.md`) and stronger audit checks. The audit of this
skill is in `references/skill-audit.md`.

**v2.0 provenance:** rebuilt after an audit of [ui-skills.com](https://www.ui-skills.com/)
(439 skills / 27 categories; 22 relevant skills inspected). The fusion is in
`references/ui-skills-fusion.md`; the implementation half is `implement-brand-system`.

## The v2.3 hard gate

These rules apply **before** any SVG or image is generated. A mark that breaks
one is rejected, not discussed.

### A. Zero-circle / zero-Venn

- **Banned:** overlapping circular Venn diagrams, concentric rings, circular
  badges, discs with orbit rings, Mastercard-style intersecting circles.
- **Required:** across a multi-brand showcase, no two logos share the same outer
  bounding geometry. Every mark has a distinct, open, non-circular silhouette:
  angular cantilever, stepped monolith, interlocking chevrons, sheared
  parallelogram, or carved architectural monogram.

### B. Fill-only (`company-logos` discipline)

- **Banned:** `fill` and `stroke` on the same shape; thin wireframe rings that
  collapse at 32px or 16px.
- **Required:** solid, unstroked paths separated by crisp negative-space
  channels. Minimum gap: **8% of the viewBox** (5.1 units on a 64 grid) so it
  stays sharp at 32×32 compact.

### C. Universal corporate minimalism (Rand / Pentagram)

- A logo is a bold architectural stamp, not a diagram of the tagline.
- **2 to 4 solid primitives maximum.**
- Every mark works in **1-color flat monochrome (`#141413`)** first. At most
  **one accent color** for a single deliberate focal element.

## Five allowed families

Pick **one** family per brand; do not run the same family twice in a showcase.

| # | Family | Construction | Replaces |
| --- | --- | --- | --- |
| 1 | **Architectural monogram** | A custom letterform carved by sharp negative-space cuts or an offset geometric counterweight | the old letter + detached accent |
| 2 | **Offset geometric planes** | Two crisp rectangular/diamond planes shifted on a 45° or 60° axis, interlocking at a solid corner | circular Venn / overprint |
| 3 | **Brutalist louvers** | Solid wedge-cut pillars or stepped blocks; relief and density shown by bar thickness | thin hachure lines in a circle |
| 4 | **Continuous ribbon** | One thick geometric beam folding at sharp 45°/90° angles | orbit rings, node chains |
| 5 | **Horizon & counter-form** | A grounded baseline/bridge with one floating keystone or quarter-arch | circular badges, sunbursts |

If a concept cannot be assigned to one of these five, it is not in the v2.3
bake-off.

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
3. **Brainstorm five, keep one** across the five families above, one family per
   brand, never five tweaks of a letter. Fastest route:
   `brand-forge.mjs --bakeoff brand.json`, then `score-mark.py`, keep one, write
   why four lost. Protocol: `references/logo-brainstorm.md`.
4. **Generate the family** (`node scripts/brand-forge.mjs --config brand.json`):
   mark, compact, glyph, reverse, mono, icon, lockups, tokens, form kit, proof
   sheet. Then hand-refine the mark; the generator is a start, not a ceiling.
5. **Write the story** (`story.md`): belief, enemy, mark as argument, material,
   proof, gap. Decision cards for every non-obvious rule.
6. **One proof page** with real copy and states. HTML for a board/mockup, TSX for
   an interactive system. Form fields use the same theme DNA as the mark.
7. **Audit and stop**: static audit + one QA pass. Fix only what fails. Name gaps.

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
- Five marks in **one** file; one render; one board.
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

## Generate the logo family

`scripts/brand-forge.mjs` turns one JSON config into a drawn, text-free kit on the
64 grid. It is the fast path for step 3–4; it does not replace judgement.

```bash
node scripts/brand-forge.mjs --list                       # v2.3 concepts: bracket planes louvers ribbon horizon (+ legacy)
node scripts/brand-forge.mjs --bakeoff brand.json --out bakeoff   # five v2.3 families, one material
python3 scripts/score-mark.py --dir bakeoff               # circles, strokes, primitives, 16px
node scripts/brand-forge.mjs --init orbit > brand.json    # starter config, edit palette/dna/params
node scripts/brand-forge.mjs --config brand.json --out public/brand/<slug> \
  --wordmark wordmark.svg                                 # from extract-wordmark.py
```

It writes `mark`, `mark-compact` (a separate, simpler drawing), `glyph`,
`mark-reverse`, `mark-mono` (drawn one-colour stamp), `icon`, three lockups,
tokens (CSS + JSON with contrast pairs), the form kit, `sheet.html` (16/32/64/128
on light + dark) and `story.md`. Exit code 1 if any contrast pair or SVG check
fails. Without `--wordmark` it skips lockups; it never fakes one with `<text>`.

Avoid the failure modes seen in the wild (`logo-brainstorm.md` §0): a bare
initial or letter-in-a-box, an orphan accent that dies at 16px, an effect
(offset, misregistration) standing in for an idea, an overlapping-circle Venn,
and a fill+stroke wireframe. A letter earns its place only if something is cut,
joined or lit — the architectural-monogram family, not a typed initial.

Make it better than the default:

- Vary the **theme DNA** (`edge`, `offset`, `stroke`, `tile`, `radius`) before
  you vary the concept. Material makes a mark ownable; geometry alone does not.
- Treat output as draft one. Open the SVG, nudge points on the grid, keep it in
  the same viewBox, re-run `audit.mjs` (`family` check).
- The compact mark must have **fewer shapes** than the primary (audited).
- Run the five-family bake-off, then write why four lost into `story.md`.

Recipes and tests: `references/logo-system.md` §9.

## Storytelling

The kit argues; it does not just show. Read `references/storytelling.md`.

- **Story spine:** belief → enemy → mark → material → voice → proof → gap.
- **One sentence** the work can be rejected against.
- **Decision cards:** Decision / Because / Not when / Breaks next, ≤ 8 per system.
- **Specimen as essay:** every section has a one-sentence caption that states a
  reason, not a label. Real copy, a voice card, a named gap.
- Audit enforces structure (`story` check); a human judges the argument.

## Forms that match the theme

Fields are cut from the same sheet as the mark. Read `references/form-theming.md`.

- One **theme DNA** (edge, offset, stroke, tile/radius, ring, density, label)
  drives the mark *and* the `--field-*` tokens.
- Pick the **material → field recipe** row that matches the brief; never mix rows.
- Fields read component tokens only; no raw hex (audited).
- All states in the same material: hover, focus-visible, invalid, disabled,
  success, pressed. Never colour alone.
- Generated: `<slug>-forms.css` + `forms.html` (error summary, password toggle,
  counter, switch, radio fieldset, file, disabled).

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

- **The v2.3 gate first.** No circle/Venn, no fill+stroke, 2–4 primitives,
  one accent, five families, one family per brand.
- **One idea, one loud field.** Two metaphors means it is not reduced.
- **Draw, do not source.** Geometry, not clipart or generated marks.
- **Test 16px first.** If it fails small, it is not a mark yet.
- **Wordmark is a drawing.** Outlines, never live text.
- **Palette by role.** Accents are punctuation, not body text.
- **Document the decision.** Why, when not, what breaks next.

## Explore five, keep one

One family per brand. No two marks in a showcase share an outer silhouette.

| Test | Pass condition |
| --- | --- |
| Silhouette | Black shape at 32px still reads; no two share a bounding geometry |
| Reduction | 2–4 solid primitives; fill-only; no stroke |
| Meaning | One sentence without naming the visual |
| Scale | 16, 32, 64, 512, favicon |
| Ownability | Not a generic sun/bolt/leaf/shield/app tile |
| System | Leaves room for wordmark, favicon, board |

Keep one; the rejection note becomes the guide.

## Build order

**Brand kit:** brief → five → one mark + compact → outlined wordmark/family →
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
python3 scripts/score-mark.py --dir public/brand/<slug>   # 16px, silhouette, specks, negative space
node scripts/audit.mjs --manifest audit.json   # files, SVG, ICO, PNG, tokens, family, forms, story
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

- Overlapping circles / Venn diagrams / concentric rings / orbit badges.
- Fill + stroke faking a border; a wireframe that dies at 32px.
- Two brands in one showcase with the same outer silhouette.
- More than four primitives or more than one accent.
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
brand/         brief.md, story.md, DESIGN.md, brandkit.html, <slug>-brandkit.png (3000×2250), assets/
public/brand/<slug>/   mark*, wordmark, lockups, glyph, favicons, icons,
                       <slug>-brandkit.png, <slug>-tokens.css/json,
                       <slug>-forms.css, sheet.html
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

- `brief.md`, `story.md` and `DESIGN.md` (or the project's design guide/README: the
  decisions, rules and what not to do);
- `tokens.json` + `tokens.css`, with the contrast pairs;
- `public/brand/<slug>/` (mark, compact mark, wordmark, lockups, favicons, icons);
- the board PNG and `brandkit.html`;
- the component inventory, form states and `<slug>-forms.css`, motion rule, theme DNA
  and named gaps;
- the audit and the target surface/stack (route, Storybook, standalone file, pen or print).

Load **`implement-brand-system`** for the HTML/TSX build. It will not redesign
the kit; it maps tokens, composes sections, uses shadcn/Radix or native controls,
and runs the QA gate.

## References

- `brief.md` — brief and review gates.
- `logo-system.md` — concepts, grid, family, favicon.
- `logo-brainstorm.md` — v2.3 hard gate, five families, scoring, why marks come out ugly.
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
- `storytelling.md` — story spine, decision cards, specimen as essay, story audit.
- `form-theming.md` — theme DNA, material → field recipes, states, shadcn mapping.
- `skill-audit.md` — audit of this skill, fixes, known gaps.
- `examples/sunnyside.md`, `examples/vitrine.md` — the two cases (evidence, not defaults).
- `examples/brainstorm-huginn-riso-hachure.md` + `examples/configs/` — a worked v2.3 redo of three weak marks.

## Scripts and templates

`brand-forge.mjs` (generate the family, `--bakeoff`), `score-mark.py` (objective mark checks), `render-board.mjs`, `render-icons.mjs`,
`favicons.py`, `downscale.py`, `extract-wordmark.py`, `audit.mjs`, `qa.mjs`,
`sync-skill.sh` (keep `.agents/skills` mirror identical).

`templates/`: `design-system.html`, `brandkit.html`, `single-page.html`,
`case-page.tsx`, `audit.json`, `guidelines.md`.

## How to use this skill well

1. Brief first; write the one-sentence direction.
2. Five families, keep one, write down why.
3. Choose the surface and HTML/TSX before building.
4. shadcn/Radix where accessible primitives matter; native for the rest.
5. Typography gate before the first screenshot.
6. Bake off the five v2.3 families with `brand-forge`, score, then refine by hand; write the story; match the fields.
7. Scripts for audit/QA; one look; fix the root cause; stop.
8. Name what is missing. A guide that hides its gaps is a brochure.
