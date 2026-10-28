# Cove — design-system audit

**Scope:** the v2.4 `sunnyside-brand-system` resources, the constructed-track
mark, the portable form kit, and the shipped Cove case at
`/design-system/cove`.
**Method:** read the method, write the brief, draw four directions on one 64
grid, choose the C, outline Instrument Serif, build tokens → CSS/JSON → form
kit → proof page → board, then run the static audit, the mark score and the
browser pass.
**Date:** 28 October 2026.

## Verdict

The method is **fulfilled with named gaps**. The constructed track is selected;
the C passes the v2.3 hard gate and the objective scorer; the kit ships a brief,
a story, four directions, theme DNA, a portable form kit, a board and eight named
gaps.

- Mark score: **PASS** — no circles, no strokes, two primitives in the primary,
  one in the compact.
- Static audit: **16/16 pass**, 0 warnings.
- Browser QA: **24 pass, 5 warnings, 0 fail** (`docs/cove-qa.md`). The five
  warnings are the h1 weight: Instrument Serif ships one weight (400) and the
  hero is 400 at 6.2rem. The gate's 700+ default assumes a multi-weight display
  face; this is a deliberate exception.
- Tokens: **161 declarations** across theme DNA, primitive, semantic and
  component layers.
- Palette: **14 measured contrast pairs**, all at least 4.5:1 for body use.
- Forms: ten native controls, an error summary and a visible focus ring.
- Verification: the one-command report is `docs/cove-qa.md`.
- Gaps: **8**, listed in §8.

## 1. What is new

Cove is not a re-skin of Vitrine. Vitrine is glass plus dither and a V; Cove is
one glass layer over a blue field and a squared C with one ice waterline. The
shared method is the track, the gate, the token layers, the form proof and the
audit. The material, mark, type and palette are different.

| Before (Vitrine) | After (Cove) |
| --- | --- |
| Half-light V, two-tone letter | Squared C with one ice inlay |
| Glass + dither | Glass + blue caustic field |
| Space Grotesk / Geist | Instrument Serif / Instrument Sans |
| Signal chartreuse | Ice cyan on Abyss |
| Dark plates inside a light page | Deep default, Frost light scope |
| Dither lens shader | CSS glass; no shader |

## 2. The constructed gate (v2.3)

| Gate | Result | Evidence |
| --- | --- | --- |
| A. Zero circle / zero Venn | Pass | No `<circle>`; the C is a filled letterform with 45° walls. |
| B. Fill-only | Pass | No stroke in the primary or compact; the inlay touches the lower lip. |
| C. 2–4 primitives, one accent | Pass | Primary: C + ice inlay. Compact: one path. |
| D. One family, distinct silhouette | Pass | Architectural monogram; distinct from the five existing case marks. |
| E. Compact is simpler | Pass | One C path versus the C plus the inlay. |
| F. Test 16px first | Pass | `score-mark.py` PASS at 16, 32 and 128px. |

`score-mark.py --dir public/brand/cove` output:

```
PASS  cove
   NOTE  dominant field 90% (v2.3 solid mass; channels are the negative space)
```

## 3. Four directions

| Direction | Family | Result |
| --- | --- | --- |
| **Cove C** | **Architectural monogram** | **Kept:** one letter, one waterline; joins the serif wordmark and holds 16px. |
| Liquid ribbon | Continuous ribbon | Lost: a wavy ribbon is the first water metaphor; it reads as a squiggle at 16px. |
| Wave pane | Horizon & counter-form | Lost: the square silhouette collides with Sunnyside's tile. |
| Two waves | Brutalist louvers | Lost: it reads as a water icon or a menu glyph, not a brand. |

## 4. Type research

Instrument Serif and Instrument Sans were drawn as a pair. The serif has the
contrast and calm for the hero and the outlined wordmark; the sans is neutral
enough for 14px inputs, 16px body, tables and labels. Geist Mono is the existing
project label face, so Cove adds two families, not three. Instrument Serif ships
one weight; the guide forbids synthetic bold.

Sources: [TypePairs](https://typepairs.com/pairs/instrument-serif-instrument-sans),
[Google Fonts — Instrument Serif](https://fonts.google.com/specimen/Instrument+Serif),
[Google Fonts — Instrument Sans](https://fonts.google.com/specimen/Instrument+Sans),
[Apple HIG — Materials](https://developer.apple.com/design/human-interface-guidelines/materials),
[better-typography](https://www.ui-skills.com/skills/jakubkrehel/better-typography).

## 5. Tokens and forms

The token source is `features/cove/tokens.json`. It generates
`features/cove/cove-tokens.css`, the public CSS/JSON downloads and the portable
form kit. The four layers are:

1. **Theme DNA** — architectural monogram, liquid glass, lit-cut edge, 1px
   offset, square tile, halo ring, airy density, mono-caps label, and the mark
   geometry.
2. **Primitive** — Abyss, Deep, Glass, Horizon, Line, Mist, Foam, Ice, Ice ink,
   Clay, Moss, Amber, Frost, Ink, Graphite, Fog, Frost line.
3. **Semantic** — Deep and Frost: bg, fg, muted, subtle, border, surface,
   accent, focus, status, glass fill/edge/highlight/shadow, field image.
4. **Component** — field-*, button-*, card-*, chip-*, table-*.

The portable kit is `public/brand/cove/cove-forms.css` with a static
`cove-forms.html` sheet. It has no raw colours and includes `:focus-visible`,
`[aria-invalid]`, `:disabled`, `[aria-checked]` and reduced motion.

The live route uses its CSS module against the same `--cv-field-*` tokens; the
export is for reuse, not the route's stylesheet.

## 6. Verification

Commands:

```bash
node scripts/generate-cove-tokens.mjs
node scripts/generate-cove-forms.mjs
node scripts/cove-icons.mjs
python3 scripts/cove-ico.py
python3 .agents/skills/sunnyside-brand-system/scripts/score-mark.py \
  --dir public/brand/cove
cd design/brand/cove && node ../../../.agents/skills/sunnyside-brand-system/scripts/audit.mjs \
  --manifest audit.json
node .agents/skills/sunnyside-brand-system/scripts/qa.mjs \
  --url http://localhost:3000/design-system/cove --slug cove \
  --manifest design/brand/cove/audit.json --mark public/brand/cove --sections
```

Browser checks: 1440 and 390, Deep and Frost, reduced motion, theme switching,
overflow, form errors, console/page errors. The report is `docs/cove-qa.md`
(24 pass, 5 warnings, 0 fail). The warnings are the h1 weight: Instrument Serif
has one weight (400); the hero is 400 at 6.2rem. The gate's 700+ default assumes
a multi-weight display face and does not apply to a single-weight serif used this
large.

**Not verified:** Safari and Firefox; a production build; axe CI; visual
regression; print/social crops.

## 7. Output contract

Shipped: brief; four directions; story and six decision cards; mark, compact,
glyph and mono; outlined wordmark; lockups; board; favicons and app icons; tokens
CSS/JSON; theme DNA; portable form kit; guide; live case; Markdown twin; gate
evidence and score.

Not shipped: a cast (the constructed track may skip it); a custom-drawn
wordmark; the supplied field image; social/print crops.

## 8. Gaps

1. **The supplied background image is missing.** The page uses a CSS caustic;
   `--cv-field-image` is the single swap point.
2. **CSS glass is not lensing.** `backdrop-filter` is a frosted approximation;
   no shader or refraction layer ships.
3. **No cast.** The marks section is a logo card, wordmark and rule, not the
   four-movement composition.
4. **The wordmark is outlined type.** The C carries the custom construction; the
   name is the reading face.
5. **The compact drops the inlay.** Below 32px the C is one colour; the favicon's
   Ice field carries the accent.
6. **Board weight and crops.** 1.51 MB at 3000 × 2250; no social or print crops.
7. **Chromium only.** No axe or visual-regression CI.
8. **The field has no image provenance** until the supplied file is added; the
   CSS fallback is named in the guide and the page.

## 9. What ships where

```
app/design-system/cove/page.tsx              route
app/design-system/cove/layout.tsx            local Instrument fonts
app/design-system/cove/llms.txt/route.ts     agent twin
app/design-system/cove/icon.svg              route icon
features/cove/tokens.json                    token source
features/cove/cove-tokens.css                generated CSS
features/cove/cove.module.css                page CSS
features/cove/cove-data.ts                   story, decisions, gates, gaps
features/cove/components/*                   brand, forms, toggle, chrome
design/brand/cove/brief.md                   brief
design/brand/cove/story.md                   story + decisions
design/brand/cove/brandkit.html              board source
design/brand/cove/cove-brandkit.png          board 3000 × 2250
design/brand/cove/README.md                  guide
design/brand/cove/audit.json                 static audit manifest
public/brand/cove/*                          SVG, ICO, PNG, tokens, forms
scripts/generate-cove-tokens.mjs             token generator
scripts/generate-cove-forms.mjs              form kit generator
scripts/cove-icons.mjs                       icon render
scripts/cove-ico.py                          ICO packer
```
