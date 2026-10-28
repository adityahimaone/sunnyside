# Vitrine — design-system audit

**Scope:** the v2.5 `sunnyside-brand-system` skill resources, the `dithercn`
engine, and the shipped Vitrine brand kit at `/design-system/vitrine`.
**Method:** read every advertised path on disk, choose the constructed track,
run the five-family bake-off and the v2.5 six-direction review, score the mark,
build against the result, run the static audit, and record what shipped versus
what was substituted.
**Date:** 28 October 2026.

## Verdict

The v2.5 method is **fulfilled**. The constructed track is selected and the mark
passes the constructed v2.3 hard gate and the objective scorer; the kit ships a
story, a five-family bake-off, a six-direction v2.5 review, theme DNA, a portable
form kit, and eight named gaps. There are four substitutions, four resources read
but not used, and one browser-only caveat (Chromium).

- Skill resources: **31/31 present**, 23 used as shipped, 4 substituted, 4 not
  used.
- Output contract: **16/16 shipped**.
- Constructed hard gate: **6/6 pass**.
- Mark score: **PASS** — no circles, no strokes, two primitives in the primary,
  one in the compact.
- Tokens: **161 declarations** including 16 theme-DNA values.
- dithercn: **13 engine files + 9 skill files × 2 locations = 31 files**, engine
  current (`colorField` present), one live shader.
- Gaps: **8**, listed in §9.

## 1. What changed from the v2.0 and v2.4 cases

The old Split V was two 13-unit strokes with a Signal dot. That is a letter plus
a detached accent, and it failed the v2.3 fill-only and zero-circle rules. The
v2.3 folded V fixed the gate; v2.4 replaced it with an open case that drew the
container and withheld the light; v2.5 replaces the case with a mark that is both
the case and the light:

| Before | After |
| --- | --- |
| Two stroked panes, one dithered | One filled V, split by its material |
| Signal dot at the apex | Signal arm, half the mark |
| 13-unit stroke, 2-unit seam | Two solid arms meeting at x32; one compact path |
| Letter + ornament | Architectural monogram: glass arm + light arm |
| Open case (v2.4) | Half-light V (v2.5) — the case, split by its light |
| 1.0 tokens / 125 declarations | 2.5 tokens / 161 declarations + theme DNA |
| No story, no bake-off, no form export | Story, five-family evidence, portable form kit |

## 2. The constructed gate (v2.3)

| Gate | Result | Evidence |
| --- | --- | --- |
| A. Zero circle / zero Venn | Pass | `mark.svg`, `mark-compact.svg` and `glyph.svg` contain no `<circle>`; the V is a filled letterform. |
| B. Fill-only | Pass | No `stroke` in the primary or compact. The two arms are solid paths meeting at x32; the compact is one path. |
| C. 2–4 primitives, one accent | Pass | Primary: glass arm + light arm. Compact: one path. One Signal arm. |
| D. One family, distinct silhouette | Pass | Architectural monogram. The half-light V is distinct from Huginn's brackets, Riso's planes, Hachure's louvers and Sunnyside's tile. |
| E. Compact is simpler | Pass | The compact is a separate one-path V with heavier walls; the primary is the same silhouette split into two materials. |
| F. Test 16px first | Pass | `score-mark.py` PASS: 16px contrast, 32% glyph coverage, no specks, no thin strokes. |

`score-mark.py --dir public/brand/vitrine` output:

```
PASS  vitrine
   NOTE  dominant field 50% (v2.3 solid mass; channels are the negative space)
```

## 3. Five-family bake-off

`brand-forge.mjs --bakeoff` generated five families on the same palette and
theme DNA. All five pass the scorer; the choice is silhouette and meaning. The
architectural monogram was re-drawn as the half-light V in v2.5; the open case
was retired.

| Family | Mark | Result |
| --- | --- | --- |
| **Architectural monogram** | **Half-light V** | **Kept:** one V, two materials; joins the wordmark and holds at 16px. |
| Offset geometric planes | Sheared sheets | Lost: Riso owns the overprint; reads as an effect, not a case. |
| Brutalist louvers | Wedge bars | Lost: Hachure owns the ridge; becomes a bar chart at 16px. |
| Horizon & counter-form | Shelf and keystone | Lost: collapses into Hachure's bar-and-diamond at 16px. |
| Continuous ribbon | Open case | Lost: retired in v2.5; draws the case and withholds the light. |

The bake-off sheet is `design/brand/vitrine/explorations/marks-v2.5.html`; the
v2.3 five-family sheet is `explorations/marks.html`. The full rejection notes and
eight decision cards are in `design/brand/vitrine/story.md`.

## 4. Brand-system resources

Every path advertised in v2.4 is present in the checkout. "Use" is what the
Vitrine build did with it, not whether the file exists.

| Resource | Present | Use | Evidence / why |
| --- | --- | --- | --- |
| `SKILL.md` | yes | used | v2.4 method for the track choice, families, story, proof and audit. |
| `references/brief.md` | yes | used | `design/brand/vitrine/brief.md`; assumptions marked. |
| `references/logo-brainstorm.md` | yes | used | Five-family bake-off; one kept, four rejected. |
| `references/logo-system.md` | yes | used | One 64 grid; fill-only; compact is a separate drawing. |
| `references/storytelling.md` | yes | used | Story spine, eight decision cards, voice card. |
| `references/form-theming.md` | yes | used | Theme DNA drives `--field-*` tokens and the form export. |
| `references/typography.md` | yes | used | Three voices, real specimens, unitless leading, balance/pretty. |
| `references/board-and-images.md` | yes | used | 2400 × 1800, 54px outer, 14px gutters, 2× render. |
| `references/tokens-and-docs.md` | yes | used | Primitive → semantic → component, generated to CSS + JSON. |
| `references/verification.md` | yes | used | This document and the browser pass. |
| `references/design-systems.md` | yes | used | Native elements first; ten controls; no runtime. |
| `references/workspace-contexts.md` | yes | used | Host route + Markdown twin; no invented routes. |
| `references/visual-directions.md` | yes | used | One effect: the dither lens. Glass is a container. |
| `references/image-direction.md` | yes | not used | No generated imagery. |
| `scripts/brand-forge.mjs` | yes | used | The five-family bake-off is reproducible from one config. |
| `scripts/score-mark.py` | yes | used | PASS: no circle, no stroke, two / one primitives, 16px. |
| `scripts/audit.mjs` | yes | used | 16/16 static checks pass, 0 warnings. |
| `scripts/qa.mjs` | yes | used | One command runs audit, score and browser; `docs/vitrine-qa.md` (29 pass, 1 GPU warning). |
| `references/craft-bar.md` | yes | used | Constructed track chosen; the drawn cast was evaluated and skipped for this technical system. |
| `scripts/cast-forge.mjs` | yes | not used | No cast in the constructed Vitrine kit. |
| `templates/marks-section.html` | yes | not used | The marks section is a construction card plus bake-off, not the drawn four-movement composition. |
| `scripts/render-board.mjs` | yes | used | 4800 × 3600, downscaled to 3000 × 2250. |
| `scripts/favicons.py` | yes | substituted | Playwright PNGs at exact 16/32/48, packed by `vitrine-ico.py`. |
| `scripts/extract-wordmark.py` | yes | used | Space Grotesk 700, seven paths, no `<text>`. |
| `scripts/render-icons.mjs` | yes | substituted | `scripts/vitrine-icons.mjs` draws the Signal field and Case icon. |
| `scripts/downscale.py` | yes | substituted | Pillow LANCZOS from 4800 × 3600 to 3000 × 2250, then 1500 × 1125. |
| `templates/brandkit.html` | yes | substituted | Custom 8-panel board; the starter's panel map was kept. |
| `templates/guidelines.md` | yes | used | Structure for `design/brand/vitrine/README.md`. |
| `examples/sunnyside.md` | yes | not used | Read as the worked example; the sun/paper/cobalt are specific. |
| `examples/vitrine.md` | yes | used | This case, revised to v2.5. |
| `README.md` | yes | used | Install and path notes. |

**Why the substitutions are not failures.** The skill ships one path to each
artifact. The favicon/icon and downscale steps use the project's Playwright and
Pillow pipeline; the board uses a custom panel map. The outputs are the same and
the substitutions are recorded here.

## 5. Output contract

| Item | Status | Evidence |
| --- | --- | --- |
| One-page brief with assumptions | shipped | `design/brand/vitrine/brief.md` |
| Five v2.3 families, one kept, four rejected | shipped | `design/brand/vitrine/explorations/marks-v2.5.html` |
| Story spine and decision cards | shipped | `design/brand/vitrine/story.md` |
| Mark, compact, glyph, mono | shipped | `public/brand/vitrine/mark.svg`, `mark-compact.svg`, `glyph.svg`, `mark-mono.svg` |
| Wordmark as outlines | shipped | `wordmark.svg`, `wordmark-reverse.svg` |
| Horizontal, stacked and reversed lockups | shipped | `lockup*.svg` |
| 3 × 3 brand board | shipped | `design/brand/vitrine/vitrine-brandkit.png` (3000 × 2250) |
| Favicon and app icons | shipped | `favicon.ico` (16/32/48), `icon.svg`, `icon-192.png`, `icon-512.png`, `apple-icon-180.png` |
| Tokens, CSS and JSON | shipped | `features/vitrine/tokens.json` → `vitrine-tokens.css` + public JSON; 161 declarations |
| Theme DNA and portable form kit | shipped | `tokens.json` + `public/brand/vitrine/vitrine-forms.css` |
| Guidelines | shipped | `design/brand/vitrine/README.md` |
| Live case with form controls | shipped | `app/design-system/vitrine/page.tsx`; ten controls |
| Agent-readable Markdown twin | shipped | `app/design-system/vitrine/llms.txt/route.ts` |
| Hard-gate evidence and score | shipped | this document + the Marks section |
| Typography gate | shipped | `story.md`, the Type section |
| Verification evidence | shipped | this document + `docs/screenshots/` |

## 6. Theme DNA and forms

The theme object in `features/vitrine/tokens.json` is emitted as `--vt-dna-*`:

| Key | Value | Mark | Field |
| --- | --- | --- | --- |
| `edge` | hard | arm edges | 1px field edge |
| `offset` | 1px | split line | hard shadow line |
| `stroke` | 1px | arm weight | border weight |
| `tile` | square | flat plinth | field corners |
| `radius` | 12px | n/a (sharp plinth) | `--vt-field-radius` |
| `ring` | solid | n/a | `--vt-field-ring-color` |
| `density` | cosy | n/a | 46px field, 8px gap |
| `label` | mono-caps | n/a | uppercase label |

The portable kit is generated by `scripts/generate-vitrine-forms.mjs` to
`public/brand/vitrine/vitrine-forms.css` and `vitrine-forms.html`. `audit.mjs`
confirms: no raw colours, `:focus-visible`, `[aria-invalid]`, `:disabled` and
`prefers-reduced-motion` are present.

The live route uses its CSS module against the same `--vt-field-*` tokens; the
export is for reuse, not the route's stylesheet. That is recorded as a gap, not
hidden.

## 7. Dithercn check

| Item | Status | Evidence |
| --- | --- | --- |
| Engine installed | pass | `lib/dither/` — 13 files; `index.ts` exports `DitherShader`. |
| Engine current | pass | `grep colorField lib/dither/shader.tsx` succeeds. |
| Agent skill installed | pass | `.agents/skills/dithercn/` and `.claude/skills/dithercn/`, 9 files each. |
| Dither tokens | pass | `app/globals.css` defines `--dither-ink`, `--dither-paper`, `--dither-cell`, `--dither-bloom`, seven named colours. |
| Signature field | pass | `features/vitrine/components/dither-lens.tsx`; no example installed. |
| Theme bridge | pass | `.vt-scope` maps the dither tokens to Vitrine; `.onCase` flips them. |
| Reduced motion | pass | QA at 1440 with `prefers-reduced-motion: reduce` reports `data-state="static"` after 2.5s; transitions collapse. |
| Shader budget | pass | One live `DitherShader`; the rest of the dither is CSS dots. |
| Console | pass with note — no `[dither-core]` errors. Normal motion and the final reduced-motion rerun were clean. One earlier reduced-motion dev pass logged a React “state update before mount” warning from the shader; headless SwiftShader also emits ReadPixels performance warnings. |

## 8. Verification

Commands run:

```bash
node scripts/generate-vitrine-tokens.mjs          # 161 declarations
node scripts/generate-vitrine-forms.mjs            # tokens-only form kit
python3 .agents/skills/sunnyside-brand-system/scripts/score-mark.py \
  --dir public/brand/vitrine                       # PASS
node .agents/skills/sunnyside-brand-system/scripts/audit.mjs \
  --manifest audit.json                            # 16/16 PASS
node scripts/render-board.mjs --html design/brand/vitrine/brandkit.html \
  --out design/brand/vitrine/vitrine-brandkit@2x.png \
  --width 2400 --height 1800 --scale 2             # 4800 × 3600
python3 - <<'PY'                                   # LANCZOS downscale
...
PY
./node_modules/.bin/tsc --noEmit                   # clean
./node_modules/.bin/eslint app/design-system features/vitrine
node scripts/vitrine-qa.mjs http://localhost:3000/design-system/vitrine
node skills/sunnyside-brand-system/scripts/qa.mjs \
  --url http://localhost:3000/design-system/vitrine --slug vitrine \
  --manifest design/brand/vitrine/audit.json --mark public/brand/vitrine --sections
```

The one-command QA report is `docs/vitrine-qa.md` (29 pass, 1 GPU warning, 0
fail). It runs the static audit, the mark score and the browser pass together.

Browser checks (Chromium via Playwright):

| Check | Result |
| --- | --- |
| 1440 × 1000, light | pass — `docs/screenshots/vitrine-1440-light.jpg` (full page); shader `running`; overflow 0. |
| 1440 × 1000, dark | pass — `docs/screenshots/vitrine-1440-dark.jpg`; theme class `dark`; overflow 0. |
| 390 × 844, light | pass — `docs/screenshots/vitrine-390-light.jpg`; overflow 0. |
| 390 × 844, dark | pass — `docs/screenshots/vitrine-390-dark.jpg`; overflow 0. |
| 1024 × 900 | pass — overflow 0; nav width 800px. |
| Hero | pass — `vitrine-hero-light.png`, `vitrine-hero-dark.png`. |
| Sections | pass — `vitrine-section-foundation.jpg`, `vitrine-section-marks.jpg`, `vitrine-section-applications.jpg`. |
| 390 section | pass — `vitrine-390-section-marks.jpg`. |
| Error summary | pass — empty submit → one focused `role="alert"`, three invalid fields (`vt-name`, `vt-email`, `vt-password`), linked messages. |
| Focus | pass — `vitrine-form-focus.png`; 3px ring plus border, never removed. |
| Reduced motion | pass — shader `static`; `vitrine-reduced-motion.png`. |
| Typography | pass — body 16px, section lead 16px, desktop input 14px, mobile input 16px, h1 weight 700. |
| No horizontal scroll | pass at 390, 1024 and 1440. |
| No console shader errors | pass with note — no `[dither-core]` errors; final reduced-motion rerun clean; one earlier dev pass logged a React warning; headless ReadPixels warnings only. |

**Dev-origin note.** Next.js 16 blocks dev resources from `127.0.0.1` by default.
The first QA pass used the IP and the client tree did not hydrate; the HMR socket
failed with `ERR_INVALID_HTTP_RESPONSE`. Accessing `http://localhost:3000`
resolves it. This is a dev-server origin rule, not a shader or page bug. The
production build was not part of this pass.

**Not verified.** Safari and Firefox; a production `next start` pass; axe CI;
visual regression; print/social crops. The production build was not run in this
pass; the one earlier reduced-motion React warning did not reproduce.

## 9. Gaps

1. **Board size.** 1.03 MB at 3000 × 2250, above the skill's ~1 MB target. The
   1500 × 1125 web copy is 431 KB. A future pass should try a quantised PNG or a
   2400 × 1800 export.
2. **No social/print crops.** The case ships the board and the SVG family only.
3. **No automated visual regression or axe CI.** The checks here are a manual
   Playwright pass, not a gate.
4. **Favicon deviation.** The favicon is a Signal field with the compact mark
   rather than a transparent primary mark, for dark-chrome legibility.
5. **The compact drops the Signal arm.** Below 32px the V is one colour; the
   two-material idea is carried by the favicon's Signal field, not by the drawing.
6. **Portable form kit.** The generated CSS is an export for reuse; the live
   route consumes the same tokens through its CSS module, not the exported file.
7. **No AI-generated atmosphere image.** Deliberate: the CSS dither and the real
   mark have no provenance cost.
8. **Browser coverage.** Chromium only. Safari and Firefox were not in this pass.

## 10. What ships where

```
app/design-system/page.tsx                  case library
app/design-system/vitrine/page.tsx           route and token scope
app/design-system/vitrine/llms.txt/route.ts  agent twin
features/vitrine/tokens.json                 token source + theme DNA
features/vitrine/vitrine-tokens.css          generated CSS
features/vitrine/vitrine.module.css          page CSS
features/vitrine/audit.ts                    gate, families, story, decisions
features/vitrine/components/*                brand, dither, form, toggle
design/brand/vitrine/brief.md                brief
design/brand/vitrine/story.md                story + decision cards
design/brand/vitrine/audit.json              static audit manifest
design/brand/vitrine/brandkit.html           board source
design/brand/vitrine/vitrine-brandkit.png    board 3000 × 2250
design/brand/vitrine/README.md               guide
design/brand/vitrine/explorations/marks.html five-family bake-off
design/brand/vitrine/explorations/marks-v2.5.html v2.5 six-direction review
public/brand/vitrine/*                       SVG, ICO, PNG, tokens, forms
scripts/generate-vitrine-tokens.mjs          token generator
scripts/generate-vitrine-forms.mjs           form kit generator
scripts/vitrine-icons.mjs                    icon render
scripts/vitrine-ico.py                       ICO packer
scripts/render-board.mjs                     board render
```
