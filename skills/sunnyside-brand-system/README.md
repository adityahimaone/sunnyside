# sunnyside-brand-system

An installable agent skill for shipping **brand kits**, **design systems** and
**single-page mockups** from a brief:

- one idea, one mark family, one 3×3 board;
- favicon and app icons;
- primitive → semantic → component tokens, CSS + JSON;
- single-page HTML or TSX proof;
- shadcn/Radix component and form kit;
- typography gate;
- lean audit and browser QA;
- pen.dev design-source integration.

Built from the Sunnyside and Vitrine cases. The method travels; the marks do not.

## Install

```bash
npx skills add adityahimaone/sunnyside --skill sunnyside-brand-system --full-depth
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
6. Build one proof page: HTML for a static board/mockup, TSX for an interactive
   system. Use shadcn/Radix for accessible primitives; native for the rest.
7. Run the typography gate before the first screenshot.
8. Render the board from HTML at 2×; downscale.
9. Run the static audit and one browser QA pass. Fix the root cause, not the
   screenshot. Name the gaps.

## Fast commands

Run these from the skill folder, or copy `scripts/` and `templates/` into the project.

```bash
# Static audit: required files, SVG text, ICO sizes, PNG dimensions, contrast
node scripts/audit.mjs --manifest audit.json

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
    design-systems.md          shadcn/Radix, primitives, forms, case page
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
    single-page.html           static brand/design-system mockup
    case-page.tsx              Next/React case-page scaffold
    audit.json                 audit manifest template
    guidelines.md              brand-guide starter
  examples/
    sunnyside.md               the paper/cobalt case
    vitrine.md                 the glass/dither case + audit
```

## What this skill refuses

- AI-generated logos, wordmarks, type specimens or whole boards.
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
