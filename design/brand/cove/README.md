# Cove — brand and system guide

> A calmer kind of depth.

Cove is Case 06: a blue liquid-glass design system with one glass layer, one
solid reading plate and one ice accent. It is a separate identity from
Sunnyside (paper/cobalt), Vitrine (glass/dither), Huginn (print), Riso Co.
(misregistration) and Hachure (survey dither).

- Live case: `/design-system/cove`
- Case library: `/design-system`
- Board: [`cove-brandkit.png`](./cove-brandkit.png) (3000 × 2250)
- Board source: [`brandkit.html`](./brandkit.html)
- Brief: [`brief.md`](./brief.md)
- Story and decision cards: [`story.md`](./story.md)
- Audit manifest: [`audit.json`](./audit.json)
- Version: 1.0
- Agent twin: `/design-system/cove/llms.txt`
- Audit: [`../../../docs/cove-design-system-audit.md`](../../../docs/cove-design-system-audit.md)

## 1. Strategy

| Item | Decision |
| --- | --- |
| Category | A material system and brand kit for interfaces that sit over a field |
| Audience | Design engineers and product teams building media, AI and data surfaces |
| Promise | Clarity you can see through |
| Essence | A calmer kind of depth |
| Metaphor | A cove: sheltered water against a stone edge |
| Family | Architectural monogram |
| Gate | v2.3 constructed — zero circle, fill-only, 2–4 primitives, one accent |
| Voice | Calm, exact, unhurried |
| Not this | Glass everywhere; body copy on a blur; a blue-purple mesh |

The one idea: **the glass layer and the reading plate**. The field carries the
atmosphere, the glass carries the chrome, and the plate carries the words. The
glass never becomes the content, and the field never sits under the copy.

## 2. Mark

**Half-light C** — one squared architectural monogram with 45° walls and one ice
inlay on the lower lip. The ink letter is the cove; the inlay is the waterline.
Two solid primitives in the primary, one in the compact. No stroke, no circle, no
detached accent.

| Property | Value |
| --- | --- |
| Grid | 64 × 64 |
| Family | Architectural monogram |
| Primary path | `M56 8H28L8 24V40L28 56H56V44H28L20 36V28L28 20H56Z` |
| Inlay | `M40 36H56V44H40Z`, Ice |
| Compact path | `M56 6H30L6 24V40L30 58H56V44H30L22 36V28L30 20H56Z` |
| Primitive count | 2 primary / 1 compact |
| Frame | 8 units |
| Opening | 24 units |
| Arm | 12 units |
| Inlay | 16 × 8 units |
| Bbox | 48 × 48 units |
| Full mark min. | 32px |
| Compact min. | 16px |
| Clear space | Half the mark height on every side |

The mark is fill-only. The C is the letter and the cove; the Ice inlay is the
one focal element. The compact is a separate one-path C with heavier walls; it
drops the inlay rather than shrinking the waterline into a speck. The mono and
glyph drop the colour at every size.

### Why the other three lost

All four directions were drawn on the same 64 grid. The choice is silhouette and
meaning, not a defect.

| Direction | Family | Result |
| --- | --- | --- |
| **Cove C** | **Architectural monogram** | **Kept: one letter, one waterline; joins the serif wordmark, holds 16px.** |
| Liquid ribbon | Continuous ribbon | Lost: a wavy ribbon is the first water metaphor; it reads as a squiggle at 16px. |
| Wave pane | Horizon & counter-form | Lost: the square silhouette collides with Sunnyside's tile. |
| Two waves | Brutalist louvers | Lost: it reads as a water icon or a menu glyph, not a brand. |

### The constructed gate (v2.3)

| Gate | Result | Evidence |
| --- | --- | --- |
| A. Zero circle / zero Venn | Pass | No `<circle>`; the C is a filled letterform. |
| B. Fill-only | Pass | No `stroke`; the inlay touches the lower lip; the compact is one path. |
| C. 2–4 primitives, one accent | Pass | Two in the primary (C + inlay), one in the compact. |
| D. One family, distinct silhouette | Pass | Distinct from the five existing case marks. |
| E. Compact simpler | Pass | One C path versus the C plus the inlay. |
| F. Test 16px first | Pass | `score-mark.py` PASS at 16, 32 and 128px. |

## 3. Wordmark and lockups

The wordmark is Instrument Serif 400 frozen as outlines: `cove`, tracking
−0.02em, four glyph paths, no `<text>`. It is 2.56 × 1.0 em (1422 × 555 units).
At 25px high it is 64px wide.

| Lockup | File | Spec |
| --- | --- | --- |
| Horizontal | `lockup.svg` | mark 34, gap 10, wordmark 25 high (108 × 34) |
| Horizontal reverse | `lockup-reverse.svg` | Foam on Abyss |
| Stacked | `lockup-stacked.svg` | mark 48, gap 12, wordmark 28 (72 × 88) |
| Stacked reverse | `lockup-stacked-reverse.svg` | Foam on Abyss |
| Wordmark | `wordmark.svg` | currentColor; `wordmark-reverse.svg` too |

Minimums: full lockup 100px wide; wordmark 56px wide; mark 32px full, 16px
compact. Clear space stays half the mark height. The header uses the horizontal
lockup at 30px high; the footer uses the wordmark at 44px. The Ice inlay stays
Ice in both surfaces.

## 4. Palette

| Token | Value | Role | Measured |
| --- | --- | --- | --- |
| `--cv-abyss` | `#06121C` | Ground, ink, the deep plate | 17.14:1 with Foam |
| `--cv-foam` | `#E9F6FB` | Body text, light ground | 17.14:1 on Abyss |
| `--cv-ice` | `#7CE7FF` | The one loud field | 13.26:1 with Abyss |
| `--cv-horizon` | `#2E5F78` | Structure, mid-tone | surface |
| `--cv-mist` | `#9DBCCB` | Secondary text on Deep | 9.44:1 on Abyss |
| `--cv-line` | `#244457` | Hairline on Deep | structure |
| `--cv-frost` | `#EAF4F8` | Light ground | 15.66:1 with Ink |
| `--cv-ink` | `#0A1B28` | Body on Frost | 15.66:1 on Frost |
| `--cv-graphite` | `#4A6575` | Secondary on Frost | 5.51:1 |
| `--cv-fog` | `#55707F` | Hints and placeholders | 4.69:1 |
| `--cv-clay` | `#FF8F80` | Error on Deep | 8.54:1 |
| `--cv-moss` | `#7BE0C3` | Success on Deep | 11.96:1 |
| `--cv-amber` | `#FFD08A` | Warning on Deep | 13.18:1 |

Use by role, not as a checklist. Ice is the only field allowed to shout. Glass is
a material, never a colour. The mark is Abyss on Frost and Foam on Deep, with the
Ice inlay fixed. Do not recolour the inlay for a campaign.

## 5. Type

| Voice | Face | Use |
| --- | --- | --- |
| Display | Instrument Serif 400 / italic | Hero, section titles, wordmark |
| Reading | Instrument Sans 400–600 | Body at 16–18px, fields, tables |
| Label | Geist Mono 500 | Dates, sizes, token names at 0.14em |

The serif has one weight. Do not synthesise a bold; raise the size or use the
italic. Do not set a paragraph in Instrument Serif. The typography gate is on the
page: three voices, body 16–18, inputs 14/16 on mobile, captions 13, unitless
leading, balance on headings, pretty on paragraphs, outlined wordmark.

Why this pairing: Instrument Serif and Instrument Sans were drawn together. The
serif gives the hero and the name a calm editorial contrast; the sans keeps every
control and paragraph neutral. Geist Mono is the existing label face, so the
system adds two families, not three.

Instrument Serif and Instrument Sans are licensed under the SIL Open Font
License 1.1. The exact TTFs are in `app/design-system/cove/fonts/` (for the
route) and `public/brand/cove/fonts/` (for the portable form kit and the board).

## 6. Shape and material

| Token | Value | Use |
| --- | --- | --- |
| `--cv-radius-xs` | 6px | Checkbox |
| `--cv-radius-sm` | 10px | Chip |
| `--cv-radius-md` | 12px | Input, select, button |
| `--cv-radius-lg` | 18px | Small panel |
| `--cv-radius-xl` | 24px | Glass card |
| `--cv-radius-2xl` | 32px | Hero plate |

Glass recipe:

- fill: 8% Foam on Deep, 62% white on Frost;
- edge: 1px `--cv-glass-edge`;
- specular: `inset 0 1px 0 --cv-glass-highlight`, top only;
- hard line: `0 1px 0 --cv-glass-edge` — the brand's tactile edge;
- lift: a large, very soft shadow for lighting only;
- blur: 18px with saturate 1.45, on containers only;
- grain: `feTurbulence` at 0.16 opacity on the field, never on the plate.

Theme DNA (recorded in `features/cove/tokens.json` and emitted as `--cv-dna-*`):

| Key | Value | Mark uses it for | Field uses it for |
| --- | --- | --- | --- |
| `edge` | lit-cut | C walls and inlay seat | 1px field edge |
| `offset` | 1px | inlay seat | hard shadow line |
| `stroke` | 1px | arm weight | border weight |
| `tile` | square | flat plinth | field corners |
| `radius` | 18px | n/a (sharp C) | `--cv-field-radius` |
| `ring` | halo | n/a | `--cv-field-ring-color` |
| `density` | airy | n/a | 48px field, 8px gap |
| `label` | mono-caps | n/a | uppercase label |

Do not put body copy on glass. Do not dither or grain an input surface. Do not
add a second glass layer or a second specular.

## 7. Motion

- Press/hover: 120ms; state change: 240ms; entrance: 480ms.
- Ease: `cubic-bezier(0.22, 1, 0.36, 1)`.
- Hover lift is 1px, press is 1px down. No bounce.
- The field is a still frame. Under `prefers-reduced-motion: reduce`, transitions
  collapse to 0.01ms and nothing drifts.

## 8. Forms

Ten native controls: text, email, password (show/hide), select, radio group,
textarea, checkbox, switch, range and file. Every control has a visible label;
hints and errors are linked with `aria-describedby`; the error summary takes
focus and links to the invalid field; the password toggle is a real button with
`aria-pressed`.

Focus is a 2px outline plus a 3px ring, never removed. The field surface is a
translucent fill over a solid token, so text contrast does not depend on what is
behind the glass. A disabled field keeps its label and value. The field reads
`--cv-field-*` tokens; the portable kit is
`public/brand/cove/cove-forms.css` (no raw colours) with a static
`cove-forms.html` sheet.

Deep is the default; Frost is a light surface scope. The hero, material and mark
stages and the footer stay Deep in both, using a local deep scope and the reverse
brand images.

## 9. Implementation

| Concern | Path |
| --- | --- |
| Route and token load | `app/design-system/cove/page.tsx` |
| Route fonts | `app/design-system/cove/layout.tsx` + `fonts/` |
| Token source | `features/cove/tokens.json` |
| Generated CSS | `features/cove/cove-tokens.css` |
| Generated JSON | `public/brand/cove/cove-tokens.json` |
| Portable form kit | `public/brand/cove/cove-forms.css` + `.html` |
| Page CSS | `features/cove/cove.module.css` |
| Form specimen | `features/cove/components/form-demo.tsx` |
| Brand components | `features/cove/components/brand.tsx` |
| Audit data | `features/cove/cove-data.ts` |
| Logo/favicon SVGs | `public/brand/cove/` + `app/design-system/cove/icon.svg` |
| Board | `design/brand/cove/cove-brandkit.png` |
| Board source | `design/brand/cove/brandkit.html` |
| Story | `design/brand/cove/story.md` |
| Audit manifest | `design/brand/cove/audit.json` |
| Markdown twin | `app/design-system/cove/llms.txt/route.ts` |

Regenerate tokens, forms and icons after editing:

```bash
node scripts/generate-cove-tokens.mjs
node scripts/generate-cove-forms.mjs
node scripts/cove-icons.mjs
python3 scripts/cove-ico.py
```

Regenerate the board:

```bash
node scripts/render-board.mjs \
  --html design/brand/cove/brandkit.html \
  --out design/brand/cove/cove-brandkit@2x.png \
  --width 2400 --height 1800 --scale 2
```

Then downscale with Pillow/Lanczos to 3000 × 2250 and 1500 × 1125.

## 10. Do / don’t

**Do**

- Use the supplied SVGs, not retyped text or recoloured PNGs.
- Keep the hard 1px glass edge hard.
- Put body copy on a solid reading plate.
- Give the page one Ice field.
- Use the compact C below 32px.
- Keep the field outside the text block.
- Check Deep and Frost and the 390px layout.
- Set `--cv-field-image` to the supplied image when it is available.

**Don’t**

- Put body copy on a glass card.
- Stack two glass layers.
- Grain or blur an input surface.
- Add a detached accent or a second primitive to the compact.
- Use the full mark with its inlay below 32px.
- Swap the Ice inlay or the field for a mood.
- Claim true lensing; this is CSS `backdrop-filter`.

## 11. Verification

- [x] Mark at 16, 24, 32, 64, 512 and as a favicon on light/dark chrome.
- [x] Lockup at 100, 240 and 512; compact at 16 and 24.
- [x] ICO contains 16, 32 and 48.
- [x] Body contrast 4.5:1, large 3:1; every pair in section 4.
- [x] `score-mark.py`: PASS, no failures; compact simpler than the primary.
- [x] Static audit: 16/16 pass. One-command browser QA: 24 pass, 5 warnings,
      0 fail (`docs/cove-qa.md`).
- [x] Page at 1440 and 390, Deep and Frost, reduced motion, in Chromium.
- [x] Form: labels, hints, errors, error summary, focus, disabled, file, switch.
- [x] Raw Markdown twin at `/design-system/cove/llms.txt`.

Evidence and gaps: [`../../../docs/cove-design-system-audit.md`](../../../docs/cove-design-system-audit.md).

## 12. Still open

- The supplied background image was not in the workspace. The page ships a CSS
  caustic; `--cv-field-image` is the one-line swap. The board uses the same
  fallback.
- CSS `backdrop-filter` is frosted glass, not true refraction. No shader is
  shipped; the guide says so.
- The compact C drops the Ice inlay below 32px; the favicon's Ice field carries
  the accent.
- No mark cast. The constructed track may skip it, so the marks section is a logo
  card, wordmark and rule, not the four-movement composition.
- The wordmark is outlined Instrument Serif, not a custom-drawn hand.
- The board is 1.51 MB at 3000 × 2250; the 1500 × 1125 web copy is 0.39 MB. No
  social or print crops.
- The browser pass is Chromium only; there is no axe or visual-regression CI.
- The five QA warnings are the h1 weight. Instrument Serif ships one weight
  (400); the hero is 400 at 6.2rem. The gate's 700+ default assumes a
  multi-weight display face; this is a deliberate exception, not a missing file.
- Deep is the default and Frost is the light scope. The hero, material and mark
  stages and the footer stay Deep in both; that is intentional, not a missing
  light theme.
