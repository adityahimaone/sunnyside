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
- Explorations: [`explorations/marks.html`](./explorations/marks.html)
- Agent twin: `/design-system/vitrine/llms.txt`
- Audit: [`../../../docs/vitrine-design-system-audit.md`](../../../docs/vitrine-design-system-audit.md)

## 1. Strategy

| Item       | Decision                                                         |
| ---------- | ---------------------------------------------------------------- |
| Category   | A component system and brand kit for translucent product UI       |
| Audience   | Design engineers and product teams in data-dense, AI-assisted tools |
| Promise    | Depth without fog                                                |
| Essence    | A glass case for a low-resolution light                          |
| Metaphor   | A lit vitrine holding one object, with a printed halftone label   |
| Voice      | Precise, lit, unhurried                                          |
| Not this   | A frosted card with unreadable body copy; a 1-bit retro toy       |

The one idea: **the case and the grain**. Glass is the container; dither is the
information layer. The glass never becomes the content. The dither never sits
under the words that explain it.

## 2. Mark

**Split V** — two panes meeting at a point; one solid, one dithered.

| Property       | Value                                                        |
| -------------- | ------------------------------------------------------------ |
| Grid           | 64 × 64                                                      |
| Stroke         | 13 units, square caps                                        |
| Apex           | 32, 49                                                       |
| Left pane      | `M16 14 32 49`, solid Case (or Frost on dark)                |
| Right pane     | `M32 49 48 14`, 4-unit checkerboard dither                   |
| Signal dot     | r 3.2 at 32, 49                                              |
| Compact mark   | 15-unit strokes, solid panes, 2-unit seam, 16–24px           |
| Full mark min. | 32px                                                         |
| Compact min.   | 16px                                                         |
| Clear space    | Half the mark height on every side (16px at a 32px mark)     |

Construction values are exact, not eyeballed. The full mark's dither is a
4-unit checkerboard; it is not a gradient and it is not scaled. The compact mark
is a separate drawing: solid panes so the V survives 16px, with the seam and the
Signal dot as the only details.

### Explorations and why one won

Six marks were drawn on the same 64 grid at
[`explorations/marks.html`](./explorations/marks.html):

| Direction      | Result                                                             |
| -------------- | ------------------------------------------------------------------ |
| **Split V**    | **Kept.** Reads at 32px, ownable, carries glass + dither in one shape. |
| Aperture       | Rejected: camera-shutter generic, collapses to a dot at 16px.       |
| Case tile      | Rejected: app-store tile with a glyph, the failure mode in the brief. |
| Stacked panes  | Rejected: unreadable at 16px, too close to a bar chart.             |
| Halftone V     | Rejected: dots vanish at 32px; no silhouette.                       |
| Lens bar       | Rejected: a pill at small sizes; no letter, no meaning.             |

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
lockup at 30px high; the footer uses the wordmark at 44px high.

## 4. Palette

| Token            | Value     | Role                          | Measured |
| ---------------- | --------- | ----------------------------- | -------- |
| `--vt-case`      | `#0B0D10` | Ground, ink, the case         | 17.89:1 on Frost |
| `--vt-frost`     | `#F2F6F8` | Light ground, glass white     | 17.89:1 on Case |
| `--vt-vellum`    | `#DCE4E9` | Quiet light underlay          | 6.25:1 Graphite |
| `--vt-graphite`  | `#45525B` | Secondary text on light       | 7.40:1 on Frost |
| `--vt-subtle`    | `#5E6D76` | Hints, placeholders on light  | 4.92:1 on Frost |
| `--vt-signal`    | `#D9FF43` | The one loud field            | 16.99:1 with Case |
| `--vt-iris`      | `#5B4BE8` | Focus, links, cool accent     | 5.34:1 on Frost |
| `--vt-clay`      | `#B23A1D` | Error on light                | 5.49:1 on Frost |
| `--vt-mint`      | `#7CF0C4` | Success on dark               | 14.01:1 on Case |

Use by role, not as a checklist. Signal is the only field allowed to shout; the
page gets one. Glass is a material, never a colour. The mark is Case on light and
Frost on dark, with the Signal dot fixed. Do not recolour the dot for a campaign.

## 5. Type

| Voice   | Face              | Use                                    |
| ------- | ----------------- | -------------------------------------- |
| Display | Space Grotesk 700 | Headlines, the wordmark, numerals      |
| Reading | Geist 400         | Body at 16–18px, 1.6 leading           |
| Label   | Geist Mono 500    | Dates, sizes, metadata at 0.14em       |

Display is tight and sentence case; labels are uppercase. Do not set a paragraph
in Space Grotesk.

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
what is behind the glass. A disabled field keeps its label and value.

The page keeps its dark plates (hero, case quote, material stage, footer) on the
same semantic names with a local `.onCase` inverse scope in `vitrine.module.css`.
That block mirrors the dark semantic and component tokens; if a dark token
changes, change the mirror in the same commit.

## 9. Implementation

| Concern            | Path                                             |
| ------------------ | ------------------------------------------------ |
| Route and token load | `app/design-system/vitrine/page.tsx`            |
| Token source       | `features/vitrine/tokens.json`                    |
| Generated CSS      | `features/vitrine/vitrine-tokens.css`             |
| Generated JSON     | `public/brand/vitrine/vitrine-tokens.json`        |
| Page CSS           | `features/vitrine/vitrine.module.css`             |
| Form specimen      | `features/vitrine/components/form-demo.tsx`       |
| Dither lens        | `features/vitrine/components/dither-lens.tsx`     |
| Brand components   | `features/vitrine/components/brand.tsx`           |
| Audit data         | `features/vitrine/audit.ts`                       |
| Logo/favicon SVGs  | `public/brand/vitrine/`                           |
| Board              | `design/brand/vitrine/vitrine-brandkit.png`       |
| Board source       | `design/brand/vitrine/brandkit.html`              |
| Markdown twin      | `app/design-system/vitrine/llms.txt/route.ts`     |

Regenerate tokens after editing `tokens.json`:

```bash
node scripts/generate-vitrine-tokens.mjs
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

**Don't**

- Put body copy on a glass card.
- Use the dither as a background for a form field.
- Blur the hard edge into a glow.
- Swap the Signal dot or the tile for a mood.
- Use the glyph as a favicon.
- Add a second loud field.

## 11. Verification

- [x] Mark at 16, 24, 32, 64, 512 and as a favicon on light/dark chrome
  (`explorations/logo-qa.png`).
- [x] Lockup at 130, 240 and 512; compact at 16 and 24.
- [x] ICO contains 16, 32 and 48 (verified with Pillow and `file`).
- [x] Body contrast 4.5:1, large 3:1; every pair in section 4.
- [x] Page at 1440 and 390, light and dark, reduced motion, in Chromium.
- [x] Form: labels, hints, errors, error summary, focus, disabled, file, switch.
- [x] No `[dither-core]` compile errors in the console.
- [x] Raw Markdown twin at `/design-system/vitrine/llms.txt`.

Evidence and gaps: [`../../../docs/vitrine-design-system-audit.md`](../../../docs/vitrine-design-system-audit.md).

## 12. Still open

- The board is 1.1 MB at 3000 × 2250 (above the ~1 MB target); the 1500 × 1125
  web copy is 483 KB.
- No social/print crops beyond the board.
- No automated visual regression or axe CI for `/design-system/vitrine` or the case library.
- The favicon is deliberately the Signal field rather than a transparent compact
  mark, so it survives dark browser chrome. The transparent marks still ship.
- No AI-generated atmosphere image; the board uses CSS dots and the real mark.
- The dither was checked in Chromium; Safari and Firefox were not part of this
  pass.
