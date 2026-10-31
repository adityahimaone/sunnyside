# sunnyside-brand-system

An installable agent skill for shipping **brand kits** and **design systems** from a brief:
one idea, a mark family, tokens, a board, an immersive proof page, Figma and DESIGN.md exports,
and an audit that names what it could not verify.

Built from eight shipped cases: Sunnyside, Vitrine, Huginn, Riso Co., Hachure, Cove, Strand and
Clearing. The method travels; the marks do not.

## v3.3: straighter, with outside eyes

- **No loops.** The fast path is eleven steps after a pre-flight, and each gate names the one
  step to return to. `gates.mjs` runs the six static gates in a single command right after the
  tokens exist, instead of five commands at the end, after the board, page and export were built.
- **Look outward.** `brand-ref.mjs` searches the 69 brands behind design.ricoui.com/brands,
  shows who already owns your hue, and feeds them to the detach gate. Fetched at runtime, never
  vendored (the source repo has no licence file).
- **Free assets, with the paperwork.** `assets.mjs` fetches photos and icons from Openverse,
  Pexels, Unsplash and Iconify and records each licence; the assets gate fails an unrecorded file.
- **DESIGN.md out.** `design-md.mjs` writes Google's open format from the tokens and lints it.
- **Bugs the audit found.** The display-face hard fail was blind to Hachure's `role`/`face`
  token shape; outside references earned free points for differing from nothing; a typo'd slug
  could pass. `gates.mjs` also fails a palette that publishes no failing contrast pair, which
  Cove and Strand do not yet (their lowest ratio is 5.06:1).
- **Cleaned.** Dropped the `build-lockup.mjs` reference (no such script), the repeated "how to
  use this well" section, a stale Vitrine to-do, a superseded brainstorm example, and the
  mismatched counts. The `.agents/skills/` mirror was regenerated.

## What is in the box

```
SKILL.md                      the whole method in one read
references/research.md        studying a category, DESIGN.md, free-asset licences
references/case-evidence.md   the eight cases, their numbers, the recurring decisions
references/gates.md           the eight checks and the QA checklist
references/immersive.md       the seven recipes with code
references/tokens-and-docs.md token layers and the llms twin
references/figma-export.md    tokens to Figma, the emitters, the traps
references/logo-system.md     grid, family, favicon
references/form-theming.md    the form kit every case ships
references/craft-bar.md       the drawn-track bar and the marks composition
scripts/                      init, detach, gates, brand-ref, assets, design-md, forge, cast,
                              score, audit, qa, board, icons, figma, sync-skill.sh
templates/                    design system page, single page, case page, guidelines, audit
examples/                     Sunnyside and Vitrine, plus brand-forge configs
```

## Install

```bash
npx skills add adityahimaone/sunnyside --skill sunnyside-brand-system --full-depth
```

Network use (all optional): `brand-ref.mjs` needs raw.githubusercontent.com; `assets.mjs` needs
its source host, plus `PEXELS_API_KEY` or `UNSPLASH_ACCESS_KEY` for those two; `design-md.mjs
--lint` needs the npm registry.

Companion: **`implement-brand-system`** turns an approved kit into an HTML/TSX proof without
redesigning it.
