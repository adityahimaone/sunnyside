# sunnyside-brand-system

An installable agent skill for shipping **brand kits** and **design systems** from a brief:
one idea, a mark family, tokens, a board, an immersive proof page, Figma and DESIGN.md exports,
and an audit that names what it could not verify.

Built from shipped cases (listed in `references/case-evidence.md`), starting with Sunnyside, Vitrine, Huginn, Riso Co., Hachure, Cove, Strand and
Clearing. The method travels; the marks do not.

## v3.5: one token reader, a CI guard, and tests

- **One loader.** `scripts/lib/tokens.mjs` reads every `tokens.json` shape in the repo and finds
  it in `features/` or `public/brand/`. `gates.mjs` and `design-md.mjs` use it. Huginn and
  Clearing, previously invisible to the gates, now run them, and the loader exposed a real
  collision: Cove and Clearing accents are 5° apart (65/100).
- **CI.** `.github/workflows/skill-check.yml` fails on a stale `.agents/` mirror, failing tests,
  or a regression on the known-good case (Porphyry).
- **Tests.** 27 unit tests (`node --test "scripts/test/*.test.mjs"`) cover the loader, the gates
  (including mutation cases for palette drift, contrast, fonts, detach and credits), the detach
  display-face fix, external references, and the asset licence check. All use temp fixtures;
  none touch the network.
- **Not done:** `detach-check.mjs` still reads its own subset of the token shapes.

## v3.4: audited against the cases that came after it

Written after checking an outside review (Gemini's audit of the published page) against the
repo. Adopted what held up, rejected what would have cost more than it saved.

- **Adopted, adapted:** one retry then publish (never tune a number until it passes); a three-
  specimen type proof at real copy; the page must prove five jobs; at most one question before
  building; a stated side-effects table.
- **Rejected:** a locked six-section spine (the detach gate scores shared section ids, so it
  would make each case less separate from the last); a mandatory post-build menu and a three-
  question intake (extra turns, and the tracks already answer "which kind"); a rewritten
  stub Figma exporter (`figma-forge.mjs` already exists and is smoke-tested); generic Tailwind
  blueprints (they duplicate `immersive.md`); a promise that scanner warnings will clear.
- **New gate, from a shipped bug:** *palette is one source* (tokens.json against the token CSS,
  hex and oklch, with mutation tests). It is the portable form of Ledger's `check-palette.mjs`.
- **Fixed in the gates:** a case folder with no `tokens.json` (Jakarta) used to pass its font
  check and skip the rest; it now fails.
- **Hardened:** `design-md.mjs --lint` pins `@google/design.md@0.4.0` instead of floating.
- **No more counts in prose.** "Eight systems" no longer matched the repo (Jakarta, Ledger and
  Porphyry exist); `case-evidence.md` is the one place that keeps a list.

## What is in the box

```
SKILL.md                      the whole method in one read
references/research.md        studying a category, DESIGN.md, free-asset licences
references/case-evidence.md   every case, their numbers, the recurring decisions
references/gates.md           the gate checks and the QA checklist
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
