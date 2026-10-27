# Vitrine — design-system audit

**Scope:** the `sunnyside-brand-system` skill resources, the `dithercn` engine and
agent skill, and the shipped Vitrine brand kit at `/design-system/vitrine`.
Companion pages: the `/design-system` case library and the
`/design-engineering#case-vitrine` section both link to the full case.
**Method:** read every advertised path on disk, build against it, run the
browser checks, and record what shipped versus what was substituted.
**Date:** 27 October 2026.

## Verdict

The brand-system method is **fulfilled**, with four substitutions, two resources
read but not used, and six named gaps. The dithercn install is **complete and
current**; one custom field was written and no example component was installed,
because none of the examples is a lens case.

- Skill resources: **16/16 present**, 10 used as shipped, 4 substituted, 2 not
  used.
- Output contract: **12/12 shipped**.
- dithercn: **13 engine files + 9 skill files × 2 locations = 31 files**, engine
  current (`colorField` present), one live shader.
- Gaps: **6**, listed in §6.

## 1. Brand-system resources

Every path advertised in the skill is present in the checkout. "Use" is what the
Vitrine build did with it, not whether the file exists.

| Resource | Present | Use | Evidence / why |
| --- | --- | --- | --- |
| `SKILL.md` | yes | used | Method for the brief, six explorations, mark, board, tokens, docs, verification. |
| `references/brief.md` | yes | used | `design/brand/vitrine/brief.md`; assumptions marked. |
| `references/logo-system.md` | yes | used | Six marks on one 64 grid; Split V kept, five rejected with reasons. |
| `references/board-and-images.md` | yes | used | 2400 × 1800, 54px outer, 14px gutters, 2× render, Lanczos downscale. |
| `references/image-direction.md` | yes | not used | No generated imagery. The atmosphere panel is CSS dots and the real SVG, so there is no prompt/seed/provenance to keep. |
| `references/tokens-and-docs.md` | yes | used | Primitive → semantic → component; CSS + JSON generated from `tokens.json`. |
| `references/verification.md` | yes | used | This document and the browser pass. |
| `scripts/render-board.mjs` | yes | used | Copied to `scripts/render-board.mjs`; the skill lives outside the repo and cannot resolve the app's Playwright. |
| `scripts/favicons.py` | yes | substituted | The PNGs come from Playwright at exact 16/32/48; `scripts/vitrine-ico.py` packs those bytes into the ICO. |
| `scripts/extract-wordmark.py` | yes | used | Space Grotesk 700, −0.04em, seven glyph paths, no live text. |
| `scripts/render-icons.mjs` | yes | substituted | `scripts/vitrine-icons.mjs` draws the Signal favicon and the Case app icon explicitly. |
| `scripts/downscale.py` | yes | substituted | A Pillow LANCZOS pass from 4800 × 3600 to 3000 × 2250, then 1500 × 1125. |
| `templates/brandkit.html` | yes | substituted | A custom 8-panel board; the starter's map was kept, Sunnyside's assets were not. |
| `templates/guidelines.md` | yes | used | Structure for `design/brand/vitrine/README.md`. |
| `examples/sunnyside.md` | yes | not used | Read as the worked example. The sun, paper and cobalt are Sunnyside-specific; Vitrine had to be different. |
| `README.md` | yes | used | Install and path notes. |

**Why the substitutions are not failures.** The skill ships one path to each
artifact; two of its scripts assume Pillow-only icon generation, and one assumes
the Sunnyside board. The outputs are the same, and the substitutions are
recorded above with their actual commands. Nothing was silently skipped.

## 2. Output contract

| Item | Status | Evidence |
| --- | --- | --- |
| One-page brief with assumptions | shipped | `design/brand/vitrine/brief.md` |
| Six explorations, one kept | shipped | `explorations/marks.html`, `explorations/marks.png` |
| Mark, compact mark, glyph | shipped | `public/brand/vitrine/mark.svg`, `mark-compact.svg`, `glyph.svg` |
| Wordmark as outlines | shipped | `public/brand/vitrine/wordmark.svg` |
| Horizontal, stacked, reversed lockups | shipped | `lockup.svg`, `lockup-reverse.svg`, `lockup-stacked.svg`, `lockup-stacked-reverse.svg` |
| 3 × 3 brand board | shipped | `vitrine-brandkit.png` (3000 × 2250) + `brandkit.html` |
| Favicon and app icons | shipped | `favicon.ico` (16/32/48), `icon.svg`, `apple-icon-180.png`, `icon-192.png`, `icon-512.png`, `mark-1024.png` |
| Tokens, CSS and JSON, three layers | shipped | `features/vitrine/tokens.json` → `vitrine-tokens.css` + public JSON; 125 declarations |
| Guidelines | shipped | `design/brand/vitrine/README.md` |
| Live case with form controls | shipped | `app/design-system/vitrine/page.tsx`; ten controls, validation, error summary |
| Agent-readable Markdown twin | shipped | `app/design-system/vitrine/llms.txt/route.ts` |
| Verification evidence | shipped | this document + `/tmp` is not shipped; see §5 |

## 3. Dithercn check

| Item | Status | Evidence |
| --- | --- | --- |
| Engine installed | pass | `lib/dither/` — 13 files; `index.ts` exports `DitherShader`. |
| Engine current | pass | `grep colorField lib/dither/shader.tsx` succeeds. |
| Agent skill installed | pass | `.agents/skills/dithercn/` and `.claude/skills/dithercn/`, 9 files each (SKILL.md + 8 references). |
| Dither tokens | pass | `app/globals.css` defines `--dither-ink`, `--dither-paper`, `--dither-cell`, `--dither-bloom`, seven named colours. |
| Signature field | pass | `features/vitrine/components/dither-lens.tsx`; no example installed. |
| Theme bridge | pass | `.vt-scope` maps `--dither-ink`/`--dither-paper`/`--dither-cell` to Vitrine tokens; `.onCase` flips them on dark plates. |
| Reduced motion | pass | `DitherShader` reports `data-state="static"` and holds `stillTime={6}`; CSS transitions collapse. |
| Shader budget | pass | One live `DitherShader`; the remaining dither is CSS dot fields. |
| Console | pass | No `[dither-core] shader failed to compile` or uniform errors in the Playwright pass. |

**Installed files:** 13 engine (`index`, `matrices`, `blue-noise`, `tokens`,
`color`, `motion`, `glsl`, `shader`, `pattern`, `style`, `fill`, `diffuse`,
`export`) and 18 skill files (9 × 2). The registry reported 31 created files,
matching the count on disk.

## 4. Design decisions worth recording

- **Vitrine is a new brand, not a Sunnyside variant.** The mark is a V of two
  panes, not a sun; the palette is Case/Frost/Signal/Iris, not paper/cobalt.
- **The dither is a field, not an example.** The lens is a caustic ring map in
  square units with an iris→signal `colorField`. No example installed.
- **Glass is a container only.** Body copy is never on a translucent surface.
  The page uses an `.onCase` inverse scope for the dark plates so the same
  semantic and component tokens work on both grounds.
- **The dark plates use a local inverse scope.** `.onCase` in
  `features/vitrine/vitrine.module.css` mirrors the dark semantic and component
  tokens so the hero, case quote, material stage and footer can use the same
  classes and the same `DitherShader` on a Case ground. It must be kept in sync
  with the dark token block; this is the one duplication in the system.
- **The favicon is the Signal field.** A transparent Case mark disappears on
  dark chrome; the Signal tile survives both. The transparent compact marks still
  ship for other uses. This is a documented deviation from the skill's
  transparent-favicon default.
- **The board's atmosphere panel is CSS, not an AI image.** It uses the real
  palette and the real mark, and it has no provenance liability.

## 5. Verification

Commands and checks run:

```bash
node scripts/generate-vitrine-tokens.mjs          # 125 declarations
node scripts/render-board.mjs --html design/brand/vitrine/brandkit.html \
  --out design/brand/vitrine/vitrine-brandkit@2x.png \
  --width 2400 --height 1800 --scale 2             # 4800 × 3600
node scripts/vitrine-icons.mjs                     # 16/32/48/180/192/512/1024
python3 scripts/vitrine-ico.py                     # ICO with 16/32/48
python3 -c "from PIL import Image; ..."            # ICO sizes + LANCZOS downscale
./node_modules/.bin/tsc --noEmit
./node_modules/.bin/eslint app/design-system features/vitrine
```

Browser checks (Chromium via Playwright):

| Check | Result |
| --- | --- |
| 1440 × 1000, light | pass — `docs/screenshots/vitrine-1440-light.jpg` (full page) |
| 1440 × 1000, dark | pass — `docs/screenshots/vitrine-1440-dark.jpg` (full page) |
| 390 × 844, light | pass — `docs/screenshots/vitrine-390-light.jpg` (full page) |
| 390 × 844, dark | pass — `docs/screenshots/vitrine-390-dark.jpg` (full page) |
| Hero, desktop and phone | pass — `docs/screenshots/vitrine-hero-light.png`, `vitrine-hero-dark.png`, `vitrine-390-hero-light.png`, `vitrine-390-hero-dark.png` |
| Form states | pass — `docs/screenshots/vitrine-form-errors.png`, `vitrine-form-success.png`, `vitrine-form-focus.png` |
| Logo QA | pass — `design/brand/vitrine/explorations/logo-qa.png` |
| Case library | pass — `docs/screenshots/design-system-cases-1440.png`, `design-system-cases-390.png` |
| Design-engineering case | pass — `docs/screenshots/design-engineering-vitrine-case.png`, `design-engineering-vitrine-390.png`, `design-engineering-case-switch.png` |
| Reduced motion | pass — shader `data-state="static"`, form still usable |
| Keyboard | tab reaches skip link, nav, theme toggle, all fields, submit, reset |
| Error summary | submit empty → summary focused, links to the three invalid fields |
| Password toggle | show/hide works, `aria-pressed` updates |
| No horizontal scroll at 390 | pass |
| No console shader errors | pass — no `[dither-core]` messages; headless SwiftShader emits ReadPixels performance warnings only |

Full-page captures are downscaled to JPEG for the repo; the viewport and form
captures stay PNG. The image files are the evidence; the
audit is not a substitute for looking.

## 6. Gaps

1. **Board size.** 1.1 MB at 3000 × 2250, above the skill's ~1 MB target. The
   1500 × 1125 web copy is 483 KB. A future pass should try a 256-colour PNG or
   2400 × 1800 export.
2. **No social/print crops.** The case ships the board and the SVG family only.
3. **No automated visual regression or axe CI.** The checks for Vitrine and the
   new case library are a manual Playwright pass, not a gate.
4. **Favicon deviation.** Signal field instead of transparent compact mark, for
   dark-chrome legibility. Documented, not hidden.
5. **No AI-generated atmosphere image.** Deliberate: the CSS dots and real mark
   are stronger and have no provenance cost.
6. **Browser coverage.** Chromium only. Safari and Firefox were not in this pass.

## 7. What ships where

```
app/design-system/page.tsx                  case library
app/design-system/vitrine/page.tsx          route and token scope
app/design-system/vitrine/llms.txt/route.ts agent twin
features/case-library/                      library data, view and CSS
features/vitrine/tokens.json                 token source
features/vitrine/vitrine-tokens.css          generated CSS
features/vitrine/vitrine.module.css          page CSS
features/vitrine/audit.ts                    audit data
features/vitrine/components/*                brand, dither, form, toggle
design/brand/vitrine/brief.md                brief
design/brand/vitrine/brandkit.html           board source
design/brand/vitrine/vitrine-brandkit.png    board 3000 × 2250
design/brand/vitrine/README.md               guide
public/brand/vitrine/*                       SVG, ICO, PNG, tokens
scripts/generate-vitrine-tokens.mjs          token generator
scripts/vitrine-icons.mjs                    icon render
scripts/vitrine-ico.py                       ICO packer
scripts/render-board.mjs                     board render
```
