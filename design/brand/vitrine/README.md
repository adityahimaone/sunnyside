# Vitrine — brand and system guide

> A glass case for a low-resolution light.

Vitrine is Case 02 of the portfolio: a glass-and-dither design system with a
component specimen at `/design-system/vitrine`. It is a **separate identity** from
Sunnyside (paper, cobalt, sun). The point of the system is the tension between a
smooth glass container and a hard dithered information layer.

- Live case: `/design-system/vitrine`
- Case library: `/design-system`
- Board: [`vitrine-brandkit.png`](./vitrine-brandkit.png) (3000 × 2250)
- Board source: [`brandkit.html`](./brandkit.html)
- Brief: [`brief.md`](./brief.md)
- Story and decision cards: [`story.md`](./story.md)
- Explorations: [`explorations/marks.html`](./explorations/marks.html)
- v2.5 mark review: [`explorations/marks-v2.5.html`](./explorations/marks-v2.5.html)
  ([PNG](./explorations/marks-v2.5.png)) — six replacements for the open case;
  the half-light V was adopted in v2.5.
- Audit manifest: [`audit.json`](./audit.json)
- Version: 2.5
- Agent twin: `/design-system/vitrine/llms.txt`
- Audit: [`../../../docs/vitrine-design-system-audit.md`](../../../docs/vitrine-design-system-audit.md)

## 1. Strategy

| Item       | Decision                                                         |
| ---------- | ---------------------------------------------------------------- |
| Category   | A component system and brand kit for translucent product UI       |
| Audience   | Design engineers and product teams in data-dense, AI-assisted tools |
| Promise    | Depth without fog                                                |
| Essence    | A glass case for a low-resolution light                          |
| Metaphor   | A vitrine’s V, half glass and half light                          |
| Family     | Architectural monogram                                           |
| Gate       | v2.3 constructed — zero circle, fill-only, 2–4 primitives, one accent |
| Voice      | Precise, lit, unhurried                                          |
| Not this   | A frosted card with unreadable body copy; a 1-bit retro toy       |

The one idea: **the glass arm and the light arm**. One V is split by its
material; the container and the object are the same drawing. The glass never
becomes the content. The dither never sits under the words that explain it.

## 2. Mark

**Half-light V** — one architectural monogram, split vertically at x32. The ink
arm is the glass; the Signal arm is the light; the plinth is flat. Two solid
primitives in the primary, one in the compact. No stroke, no circle, no detached
accent.

| Property       | Value                                                        |
| -------------- | ------------------------------------------------------------ |
| Grid           | 64 × 64                                                      |
| Family         | Architectural monogram                                       |
| Glass arm      | `M8 8H24L32 34V56H24Z`                                       |
| Light arm      | `M32 34L40 8H56L40 56H32Z`, Signal                           |
| Compact path   | `M6 6H22L32 32L42 6H58L42 58H22Z`                            |
| Primitive count| 2 primary / 1 compact                                        |
| Frame          | 8 units                                                      |
| Vertex         | 32 / 34                                                      |
| Plinth         | 16 × 22 units                                                |
| Arms           | 16 units                                                     |
| Bbox           | 48 × 48 units                                                |
| Full mark min. | 32px                                                         |
| Compact min.   | 16px                                                         |
| Clear space    | Half the mark height on every side (16px at a 32px mark)     |

The mark is fill-only. The split is the material boundary: the ink arm is the
glass and the Signal arm is the light. The compact is a separate one-path V with
heavier walls; it drops the Signal arm rather than shrinking the split into a
speck. The mono mark and glyph drop the Signal at every size.

### Why the other four lost

All five constructed v2.3 families were drawn with the same palette and theme
DNA and scored. The choice is silhouette and meaning, not defects.

| Family                 | Mark                  | Result |
| ---------------------- | --------------------- | ------ |
| **Architectural monogram** | **Half-light V**   | **Kept: one V, two materials; joins the wordmark, holds 16px, unused in the library.** |
| Offset geometric planes| Sheared sheets        | Lost: Riso owns the overprint. |
| Brutalist louvers      | Wedge bars            | Lost: Hachure owns the ridge; reads as a bar chart at 16px. |
| Continuous ribbon      | Open case             | Lost: v2.5 retired it; it draws the case and withholds the light. |
| Horizon & counter-form | Shelf and keystone    | Lost: collapses into Hachure's bar-and-diamond at 16px. |

### The constructed gate (v2.3)

| Gate | Result | Evidence |
| --- | --- | --- |
| A. Zero circle / zero Venn | Pass | No `<circle>` in the family; the V is a filled letterform. |
| B. Fill-only | Pass | No `stroke` in `mark.svg` or `mark-compact.svg`; the two arms are solid paths meeting at x32, and the compact is one path. |
| C. 2–4 primitives, one accent | Pass | Two in the primary (glass arm + light arm), one in the compact; one Signal arm. |
| Family | Pass | Architectural monogram, distinct from Huginn, Riso, Hachure and Sunnyside. |
| Compact simpler | Pass | One V path versus a two-material V. |
| Score | Pass | `score-mark.py` PASS at 16, 32 and 128px; glyph covers 32%. |

## 3. Wordmark and lockups

The wordmark is the real type frozen as outlines: **Space Grotesk 700**,
`vitrine`, tracking −0.04em. Seven `<path>` elements, no `<text>`. It is
2.87 × 0.76 em (2873 × 758 units). At 25px high it is 94.8px wide.

| Lockup             | File                          | Spec                                      |
| ------------------ | ----------------------------- | ----------------------------------------- |
| Horizontal         | `lockup.svg`                  | mark 34, gap 10, wordmark 25 high         |
| Horizontal reverse | `lockup-reverse.svg`          | Frost mark and wordmark on Case           |
| Stacked            | `lockup-stacked.svg`          | mark 48, gap 12, wordmark 28 high         |
| Stacked reverse    | `lockup-stacked-reverse.svg`  | Frost on Case                             |
| Wordmark           | `wordmark.svg`                | currentColor; `wordmark-reverse.svg` too  |

Minimums: full lockup 130px wide; wordmark 72px wide; mark 32px full, 16px
compact. Clear space stays half the mark height. The header uses the horizontal
lockup at 30px high; the footer uses the wordmark at 44px high. The Signal arm
stays Signal in both themes.

## 4. Palette

| Token            | Value     | Role                          | Measured |
| ---------------- | --------- | ----------------------------- | -------- |
| `--vt-case`      | `#0B0D10` | Ground, ink, the case         | 17.89:1 on Frost |
| `--vt-frost`     | `#F2F6F8` | Light ground, glass white     | 17.89:1 on Case |
| `--vt-vellum`    | `#DCE4E9` | Quiet light underlay          | 6.25:1 Graphite |
| `--vt-graphite`  | `#45525B` | Secondary text on light       | 7.40:1 on Frost |
| `--vt-subtle`    | `#5E6D76` | Hints, placeholders on light  | 4.92:1 on Frost |
| `--vt-signal`    | `#D9FF43` | The one loud field and label  | 16.99:1 with Case |
| `--vt-iris`      | `#5B4BE8` | Focus, links, cool accent     | 5.34:1 on Frost |
| `--vt-clay`      | `#B23A1D` | Error on light                | 5.49:1 on Frost |
| `--vt-mint`      | `#7CF0C4` | Success on dark               | 14.01:1 on Case |

Use by role, not as a checklist. Signal is the only field allowed to shout; the
page gets one. Glass is a material, never a colour. The mark is Case on light and
Frost on dark, with the Signal arm fixed. Do not recolour the arm for a
campaign.

## 5. Type

| Voice   | Face              | Use                                    |
| ------- | ----------------- | -------------------------------------- |
| Display | Space Grotesk 700 | Headlines, the wordmark, numerals      |
| Reading | Geist 400         | Body at 16–18px, 1.6 leading           |
| Label   | Geist Mono 500    | Dates, sizes, metadata at 0.14em       |

Display is tight and sentence case; labels are uppercase. Do not set a paragraph
in Space Grotesk. The typography gate is recorded on the case page: three voices,
body 16–18, inputs 14/16 on mobile, captions 13, unitless leading, balance on
headings, pretty on paragraphs.

## 6. Shape and material

| Token             | Value                     | Use                   |
| ----------------- | ------------------------- | --------------------- |
| `--vt-radius-xs`  | 4px                       | Checkbox              |
| `--vt-radius-sm`  | 8px                       | Chip                  |
| `--vt-radius-md`  | 12px                      | Input, select, button |
| `--vt-radius-lg`  | 16px                      | Small panel           |
| `--vt-radius-xl`  | 24px                      | Glass card            |
| `--vt-radius-2xl` | 32px                      | Hero plate            |

Glass recipe:

- fill: 58% white on light, 9% white on case;
- edge: 1px `--vt-glass-edge`;
- specular: `inset 0 1px 0 --vt-glass-highlight`, top only;
- hard line: `0 1px 0 --vt-glass-edge` — the brand's tactile edge;
- lift: a large, very soft shadow for lighting only;
- blur: 18px with saturate 1.45, on containers only.

Theme DNA (recorded in `features/vitrine/tokens.json` and emitted as
`--vt-dna-*`):

| Key | Value | Mark uses it for | Field uses it for |
| --- | --- | --- | --- |
| `edge` | hard | arm edges | 1px field edge |
| `offset` | 1px | split line | hard shadow line |
| `stroke` | 1px | arm weight | border weight |
| `tile` | square | flat plinth | field corners |
| `radius` | 12px | n/a (sharp plinth) | `--vt-field-radius` |
| `ring` | solid | n/a | `--vt-field-ring-color` |
| `density` | cosy | n/a | 46px field, 8px gap |
| `label` | mono-caps | n/a | uppercase label |

Do not put body copy on glass. Do not dither an input surface. Do not add a
second specular or a gradient mesh behind the panel.

## 7. Motion

- Press/hover: 120ms; state change: 240ms; entrance: 480ms.
- Ease: `cubic-bezier(0.23, 1, 0.32, 1)`.
- Hover lift is 1px, press is 1px down. No bounce.
- The dither drifts slowly; `stillTime={6}` is the finished reduced-motion
  frame. Under `prefers-reduced-motion: reduce`, the shader root reports
  `data-state="static"` and CSS transitions collapse to 0.01ms.

## 8. Forms

Ten native controls ship in one specimen: text, email, password (show/hide),
select, textarea, radio group, checkbox, switch, range and file. Every control
has a visible label; hints and errors are linked with `aria-describedby`; the
error summary takes focus and links to the invalid field; the password toggle is
a real button with `aria-pressed`.

Focus is a 2px outline plus a 3px ring, never removed. The field surface is a
translucent fill over a solid token, so the text contrast does not depend on
what is behind the glass. A disabled field keeps its label and value. The field
reads `--vt-field-*` tokens; the portable kit is
`public/brand/vitrine/vitrine-forms.css` (no raw colours) with a static
`vitrine-forms.html` sheet.

The page keeps its dark plates (hero, mark stage, material stage, footer) on the
same semantic names with a local `.onCase` inverse scope in
`vitrine.module.css`. That block mirrors the dark semantic and component
tokens; if a dark token changes, change the mirror in the same commit.

## 9. Implementation

| Concern            | Path                                             |
| ------------------ | ------------------------------------------------ |
| Route and token load | `app/design-system/vitrine/page.tsx`            |
| Token source       | `features/vitrine/tokens.json`                    |
| Generated CSS      | `features/vitrine/vitrine-tokens.css`             |
| Generated JSON     | `public/brand/vitrine/vitrine-tokens.json`        |
| Portable form kit  | `public/brand/vitrine/vitrine-forms.css` + `.html` |
| Page CSS           | `features/vitrine/vitrine.module.css`             |
| Form specimen      | `features/vitrine/components/form-demo.tsx`       |
| Dither lens        | `features/vitrine/components/dither-lens.tsx`     |
| Brand components   | `features/vitrine/components/brand.tsx`           |
| Audit data         | `features/vitrine/audit.ts`                       |
| Logo/favicon SVGs  | `public/brand/vitrine/`                           |
| Board              | `design/brand/vitrine/vitrine-brandkit.png`       |
| Board source       | `design/brand/vitrine/brandkit.html`              |
| Story              | `design/brand/vitrine/story.md`                   |
| Audit manifest     | `design/brand/vitrine/audit.json`                 |
| Markdown twin      | `app/design-system/vitrine/llms.txt/route.ts`     |

Regenerate tokens and forms after editing `tokens.json`:

```bash
node scripts/generate-vitrine-tokens.mjs
node scripts/generate-vitrine-forms.mjs
```

Regenerate the board:

```bash
node scripts/render-board.mjs \
  --html design/brand/vitrine/brandkit.html \
  --out design/brand/vitrine/vitrine-brandkit@2x.png \
  --width 2400 --height 1800 --scale 2
```

Then downscale with Pillow/Lanczos to 3000 × 2250 and 1500 × 1125.

## 10. Do / don't

**Do**

- Use the supplied SVGs, not retyped text or recoloured PNGs.
- Keep the hard 1px shadow hard.
- Give the page one Signal field.
- Use the compact mark below 32px.
- Keep the dither outside the text block.
- Check both themes and the 390px layout.
- Change the theme DNA before changing the mark's geometry.

**Don't**

- Put body copy on a glass card.
- Use the dither as a background for a form field.
- Blur the hard edge into a glow.
- Add a detached accent or a second primitive to the compact.
- Use the full two-material V with its Signal arm below 32px.
- Swap the Signal arm or the field for a mood.
- Add a second loud field.

## 11. Verification

- [x] Mark at 16, 24, 32, 64, 512 and as a favicon on light/dark chrome.
- [x] Lockup at 130, 240 and 512; compact at 16 and 24.
- [x] ICO contains 16, 32 and 48 (verified with Pillow and `file`).
- [x] Body contrast 4.5:1, large 3:1; every pair in section 4.
- [x] `score-mark.py`: PASS, no failure; compact simpler than the primary.
- [x] `audit.mjs`: 16/16 static checks pass, 0 warnings.
- [x] Page at 1440 and 390, light and dark, reduced motion, in Chromium.
- [x] Form: labels, hints, errors, error summary, focus, disabled, file, switch.
- [x] No `[dither-core]` compile errors in the console.
- [x] Raw Markdown twin at `/design-system/vitrine/llms.txt`.
- [x] One-command v2.5 QA: 29 pass, 1 GPU warning, 0 fail (`docs/vitrine-qa.md`).

Evidence and gaps: [`../../../docs/vitrine-design-system-audit.md`](../../../docs/vitrine-design-system-audit.md).

## 12. Still open

- The board is 1.03 MB at 3000 × 2250; the 1500 × 1125 web copy is 431 KB.
- No social/print crops beyond the board.
- No automated visual regression or axe CI for `/design-system/vitrine` or the case library.
- The favicon uses the Signal field and the compact mark rather than a
  transparent primary mark, so it survives dark browser chrome. The transparent
  marks still ship.
- The compact mark drops the Signal arm: below 32px the V is one colour, so the
  two-material idea is carried by the favicon’s Signal field, not by the drawing.
- The portable form CSS is a generated export for reuse; the live route consumes
  the same tokens through its CSS module.
- No AI-generated atmosphere image; the board uses CSS dots and the real mark.
- The dither was checked in Chromium; Safari and Firefox were not part of this
  pass.
- The primary mark was adopted in v2.5. The compact, wordmark cut, cast and
  composition have not been rebuilt beyond the mark swap; the case remains the
  constructed track, so the cast is still optional and absent.
