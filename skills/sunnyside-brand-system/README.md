# sunnyside-brand-system

An installable agent skill for shipping **brand kits**, **design systems** and
**single-page mockups** from a brief. It owns the brand decision and hands the
approved kit to **`implement-brand-system`** for the build:

- one idea, one mark family, one 3×3 board;
- favicon and app icons;
- primitive → semantic → component tokens, CSS + JSON;
- single-page HTML or TSX proof;
- shadcn/Radix component and a form kit themed from the same DNA as the mark;
- brand story: spine, one sentence, decision cards, story audit;
- typography gate;
- lean audit and browser QA;
- pen.dev design-source integration.

Built from the Sunnyside and Vitrine cases. The method travels; the marks do not.

**v2.2:** fuses [op7418/logo-generator-skill](https://github.com/op7418/logo-generator-skill)
(six-family brainstorm, design rules, pattern families): `--bakeoff`, five new
concepts, `score-mark.py`, `references/logo-brainstorm.md` and a worked redo in
`examples/brainstorm-huginn-riso-hachure.md`.

**v2.1:** a generated vector logo family (`scripts/brand-forge.mjs`: six
construction concepts, tokens, theme-matched form kit, proof sheet, story
scaffold), a storytelling layer, theme-matched forms and stronger audit checks.
Audit of the skill itself: [`references/skill-audit.md`](references/skill-audit.md).

**v2.0 provenance:** rebuilt after auditing
[ui-skills.com](https://www.ui-skills.com/) — 439 skills across 27 categories;
22 relevant skills inspected and fused in
[`references/ui-skills-fusion.md`](references/ui-skills-fusion.md).

## Install

```bash
npx skills add adityahimaone/sunnyside --skill sunnyside-brand-system --full-depth
npx skills add adityahimaone/sunnyside --skill implement-brand-system --full-depth
npx skills add adityahimaone/sunnyside --skill pen-dev --full-depth
```

Optional typography companion — the upstream skill by Jakub Krehel:

```bash
npx skills add jakubkrehel/skills --skill better-typography
```

Or point an agent that supports local skill folders at this folder:

```bash
npx skills add ./skills/sunnyside-brand-system
```

## The method in one screen

1. **Pick the smallest mode**: brand kit, design system, mockup, audit or pen.
2. Write `brief.md` and the one sentence the work can be rejected against.
3. Draw six marks; keep one; write down why the other five lost.
4. Build the mark + compact + outlined wordmark, or start with tokens.
5. Use one token source → CSS + JSON. Never hand-edit generated output.
6. Write `DESIGN.md`: decisions, token roles, component rules, what not to do.
7. Render the board from HTML at 2×; downscale.
8. Run the static audit and one browser QA pass. Name the gaps.
9. **Hand off** to `implement-brand-system` for the HTML/TSX proof page. Do not
   redesign the kit in the implementation pass.

## Fast commands

Run these from the skill folder, or copy `scripts/` and `templates/` into the project.

```bash
# Static audit: required files, SVG text, ICO sizes, PNG dimensions, contrast
node scripts/audit.mjs --manifest audit.json

# Generate the whole family from one config (concepts: sunburst aperture orbit hatch stack facet)
node scripts/brand-forge.mjs --init orbit > brand.json
node scripts/brand-forge.mjs --config brand.json --out public/brand/<slug> --wordmark wordmark.svg

# Six ideas from six families, one material; then objective checks
node scripts/brand-forge.mjs --bakeoff brand.json --out bakeoff
python3 scripts/score-mark.py --dir bakeoff   # pip install cairosvg pillow

# Keep the .agents/skills mirror identical
bash scripts/sync-skill.sh

# Browser QA: 1440 + 390, light + dark, reduced motion, console, overflow
node scripts/qa.mjs \
  --url http://localhost:3000/design-system/vitrine \
  --out docs/screenshots --name vitrine

# Board render and web copy
node scripts/render-board.mjs \
  --html design/brand/<slug>/brandkit.html \
  --out design/brand/<slug>/<slug>-brandkit@2x.png \
  --width 2400 --height 1800 --scale 2

# pen.dev: delegated agent or MCP-in-the-loop (see skills/pen-dev/SKILL.md)
pen status
pen --out design/brand/<slug>/<slug>-board.pen --prompt "…" --agent claude
pen interactive --out design/brand/<slug>/<slug>-board.pen --enable-preview
```

Prerequisites: Playwright for the renderer/QA, Pillow + fontTools + HarfBuzz for
the icon and wordmark scripts. The static audit has no dependencies.

## What is inside

```
sunnyside-brand-system/
  SKILL.md                     modes, fast path, rules, contract
  references/
    brief.md                   one-page brief and review gates
    logo-system.md             concepts, grid, family, favicon, tests
    board-and-images.md        the 3×3 board and render pipeline
    image-direction.md         prompts, provenance and QA for generated images
    tokens-and-docs.md         token layers and agent-readable docs
    design-systems.md          shadcn/Radix, primitives, forms, surfaces
    ui-skills-fusion.md        audit of the ui-skills registry + fused rules
    visual-directions.md       liquid glass, dither, brutalist, editorial, bento, 3D
    workspace-contexts.md      app, docs, portfolio, standalone, Storybook, pen, print
    typography.md              the typography gate + better-typography source
    verification.md            the ship checklist and audit format
    lessons.md                 Case 02 failures and the rules they produced
  scripts/
    render-board.mjs           HTML board → PNG (Playwright)
    render-icons.mjs           SVG → exact-size transparent PNGs
    favicons.py                PNG → ICO, apple and app icons (Pillow)
    downscale.py               Lanczos downscale for the web copy
    extract-wordmark.py        shaped text → SVG outlines (fontTools + HarfBuzz)
    audit.mjs                  static artifact/contrast audit (no deps)
    qa.mjs                     one browser QA pass (Playwright)
  templates/
    brandkit.html              3×3 board starter
    design-system.html         /sunnyside-style single-page system specimen
    single-page.html           static brand mockup
    case-page.tsx              Next/React case-page scaffold
    audit.json                 audit manifest template
    guidelines.md              brand-guide starter
  examples/
    sunnyside.md               the paper/cobalt case
    vitrine.md                 the glass/dither case + audit
```

## Companion skills

- [`implement-brand-system`](../implement-brand-system/SKILL.md) — turns the
  approved kit into a single-page HTML/TSX proof; never redesigns the brand.
- [`pen-dev`](../pen-dev/SKILL.md) — `.pen` design source, delegated agent and
  MCP-in-the-loop.

## Surfaces, not routes

The skill does not assume a portfolio. A system can ship as a single HTML
specimen, an app route, a Storybook, a pen/Figma file or print. Read
`references/workspace-contexts.md` before choosing a surface; never invent a
case library or a route the host does not have.

## What this skill refuses

- AI-generated logos, wordmarks, type specimens or whole boards.
- Inventing a case library, `/design-system` route or sitemap entry.
- Live text as the wordmark.
- A mark that only reads at poster size.
- Boards with no exportable assets.
- Guidelines that live only in a PDF or Figma file.
- A component museum with no form kit.
- “Looks good” audits with no computed values or file paths.
- Ten exploratory pen prompts for a board that needed one.

## Credits

The method, the Sunnyside and Vitrine cases, and the templates are by
[Aditya Himawan](https://adityahimaone.space). The typography distillation
follows [better-typography](https://www.ui-skills.com/skills/jakubkrehel/better-typography)
by Jakub Krehel. The pen.dev workflow follows the official CLI and MCP tools.
