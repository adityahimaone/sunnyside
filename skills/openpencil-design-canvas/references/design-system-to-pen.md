# Design system → OpenPencil frames

The mapping the canvas implements. Extend this table, not the script, when a
brand ships something new.

## Two sources, two section maps

A design system reaches the canvas one of two ways. They do not share a section
list, and mixing them produces a board that is half a page and half a spec.

### A · The page, imported (default)

`scripts/canvas.mjs build --html …` imports the real page and keeps its sections,
in its order. The names come from `<section id="…">` in the HTML, so the canvas
cannot drift from the page:

| # | Frame | Built from |
| --- | --- | --- |
| 01 | foundation | the page's own `#foundation` |
| 02 | material | the physical thing: paper, dither, tear |
| 03 | marks | logo card, wordmark scale, cast drawer, one usage rule |
| 04 | colour | primitive → semantic light → semantic dark |
| 05 | type | the roles at real size |
| 06 | parts | buttons, fields, states |
| 07 | motion | durations and easing |
| 08 | voice | the copy rules |
| 09 | tokens | the layer diagram |
| 10 | audit | the measured pairs, including the failing one |
| 11 | surface | the page ends in the object the identity is made of |

Plus, added by the build pass: `00 · Cover` (name, essence, palette strip, mark)
and `90 · Marks` (every brand SVG as a vector, in a framed cell).

A section with no page content is not skipped — the page decides. If the page
grew a twelfth section, the canvas gets twelve and `--expect 12` is the check.

### B · The tokens, drawn (no page)

`scripts/brand_to_pen.py` builds a brand board straight from a token file. Use it
when there is no page — a kit, not a product. Read like a spec, not like the JSON.
A section with no tokens is skipped, so the numbers are stable ids with gaps
(huginn ships no space/radius/components → `01 02 03 04 08 10 11`).

| # | Frame | Built from |
| --- | --- | --- |
| 01 | Cover | `$meta`/`meta` (name, idea, track, material), first 8 primitives, counts |
| 02 | Color | primitive → semantic light → semantic dark → component light → component dark |
| 03 | Typography | `type` families, then `type.scale` drawn at real px |
| 04 | Logo | clearspace rule, minimum sizes, every `*.svg` at review size |
| 05 | Spacing | `space`/`spacing` as bars |
| 06 | Radius | `radius` on 120px squares, pill clamped to 60 |
| 07 | Elevation | `shadow`/`elevation` + `glass` values |
| 08 | Motion | `motion` durations as bars, easing as strings |
| 09 | Components | `components`/`component` tokens grouped by widget prefix |
| 10 | Accessibility | `contrast[]` with computed ratio and grade |
| 11 | Imagery | photographs, or the brandkit PNG as fallback |

## Legibility contract

The sheet is a document someone reads, so the script enforces:

```
T_TITLE 54 · T_NAME 22 · T_ROW 16 · T_HEX 15 · T_TIER 15 · T_ROLE 14
```

- No text below 14px, ever. The only exception is the type-scale specimen, which
  must be true size even when the brand's caption step is 11px.
- Text on a chip comes from `on_fill(fill)` — it compares `ratio(INK, fill)` with
  `ratio(CREAM, fill)` and takes the winner. Never pick by a luminance threshold;
  a threshold puts cream on mid-grey and fails AA.
- Chips get a 2px `EDGE` hairline, otherwise a cream chip on a cream sheet has no
  boundary at 1×.
- A label lives **inside** the filled frame (`panel()`), never beside it. A sibling
  text is measured against the section ground, so lint reports `1.00:1` on a chip
  that renders correctly — the node tree has to say what the eye sees.
- One column count per tier (4-up). A ragged 3-up tier breaks vertical alignment
  between tiers, which is worse than one orphan chip.

## Colour resolution

Semantic and component values are `var(--x)` references, so the JSON alone cannot
render them. `css_vars()` returns `{"light": …, "dark": …}` and:

1. aliases `--cl-foo` to `--foo` (the JSON writes `var(--surface-page)`, the CSS
   declares `--cl-surface-page`),
2. chases refs up to six hops (`semantic → primitive` is two),
3. splits the sheet at the **last** `[data-*=night|dark] {` rule — the first match
   is usually the header comment, and splitting there leaves the light scope empty.

When the JSON has no `components` tier, component tokens are recovered from the
CSS by widget prefix (`button|focus|card|glass|field|input|tab|badge|panel|chip|
link|row|spark`), deduped on the name without its `cl-` namespace.

## Logo rules

```
clearspace  x = 0.5 × mark height, all four sides, drawn on a box diagram
minimum     mark 16px · wordmark 120px · lockup 240px
```

- Review sizes are not shipping sizes. Shipping sizes come from the tokens
  (`mark.sizes.stage/header/minimum/compact`).
- Art is inset 6% inside its frame: brand SVGs are tight-bbox, so an un-inset
  wordmark touches the frame edge and reads as clipped.
- Height comes from the `viewBox` aspect (`art_box`). Forcing a square root crops
  the wordmark off the bottom of a lockup.
- A pale cut (`art_is_light`) gets a dark plate, or it is invisible on cream.
- A mark under 48px sits in a framed 140×88 cell so a 16px specimen still reads.

## Token schema drift

Four shapes exist in the wild:

```jsonc
// v1 (clearing) — dicts, clamp() in the type scale
{ "color": { "bark": "#0E211C" },
  "semantic": { "surfacePage": "var(--surface-page)" },
  "type": { "scale": { "display": "clamp(2.5rem, 1.55rem + 3.6vw, 4.25rem)" } },
  "contrast": [ { "pair": "bark on cream", "fg": "#0E211C", "bg": "#F3EDDE", "ratio": 14.35 } ] }

// v4 (riso/huginn) — primitives + semantic scopes, string type roles
{ "primitives": [ { "name": "paper", "value": "#F1EDE4" } ],
  "semantic": { "light": [ ... ], "dark": [ ... ] },
  "contrast": [ { "label": "Carbon on vellum", "a": "#1B1712", "b": "#F1EDE4", "ratio": 15.26 } ],
  "type": { "display": "Space Grotesk 700" } }

// v3 (strand/cove) — every scale is a [{name, value, role}] list
{ "type":   [ { "name": "font-display", "value": "…", "role": "…" } ],
  "space":  [ { "name": "space-1", "value": "0.25rem", "role": "4" } ],
  "radius": [ { "name": "radius-xs", "value": "4px" } ] }

// v2 (hachure) — type carries its own size per role, no radius at all
{ "type": [ { "role": "display", "face": "mono", "weight": "700",
              "size": "clamp(2.5rem, 7.2vw, 6.25rem)", "use": "Case title" } ],
  "space": [ { "name": "1", "value": "4px" } ] }
```

`normalize()` accepts all four: primitives win over `color`, `fg/a` and `bg/b` are
both read, `type` may be a dict with `scale`, a dict of strings, a list of
`{name, value}`, or a list of `{role, size}`, and `radius`/`space` go through the
same dict-or-list coercion. A fifth shape means extending `normalize()` only —
never the frame builders.

Guards worth keeping:

- `type`/`semantic`/`components` as a **list** makes `.get()` raise
  `AttributeError: 'list' object has no attribute 'get'` — branch on `isinstance`.
- `to_px()` must test `clamp(` **before** any `"(" in value` guard, or the guard
  meant for `cubic-bezier` also eats every `clamp()` and the display step vanishes.
- Numeric tokens (`radius: {xs: 6}`) must survive `entries()` unchanged; a
  colour-only resolver turns them into `None` and the whole section disappears.

## Per-brand overrides

Optional `openpencil.json` next to the tokens file:

```json
{
  "mark_size": { "lockup-stacked": 320, "seal": 180 },
  "skip": ["og-image", "press-kit"],
  "ground": "#F3EDDE",
  "ink": "#0E211C",
  "mono_marks": false
}
```

`mono_marks: true` forces every hex in the SVG to `ink` — only for single-colour
brands. Default keeps the brand's own colours.

## What the .fig is not

- Not the token source of truth. `*-tokens.json` is; regenerate the canvas.
- Not a variable set. The headless runtime has no `figma.variables`, no
  `createTextStyle`, no `createPaintStyle` (verified on 0.16.0). Tokens as
  variables and roles as styles are the Figma plugin's job —
  `figma-forge.mjs` in `sunnyside-brand-system`.
- Not a colour proof when it came from `import`. The import can drop a fill; the
  resulting `color-contrast` finding is about the import, not the brand. Check
  the HTML first.
- Not a single-document file. `save_file` writes a bundle (zip: `canvas.fig` +
  `images/` + `meta.json` + `thumbnail.png`); `.fig` is writable, `.pen` read-only.
- Not the deliverable for a site. It is a review surface; the build reads tokens.
- Not a place for a live-text wordmark. The wordmark is a drawing, always.
- Not a place to hide brand defects. If a dark scope has no `field-bg` or a focus
  ring equals its button fill, the board shows it — that is the finding, not a bug
  in the board.
