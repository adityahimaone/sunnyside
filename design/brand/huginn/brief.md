# Huginn — brief, v3.0

**Supersedes v2.x (two brackets and a keystone).** The bracket mark framed the name; it did not
carry the studio's actual material, which is a grid of cells. v3.0 takes the cell the footer
already draws with — the 22-row wordmark, the ordered dither — and makes it the whole system.

## One sentence

> Everything Huginn prints is a cell — the painting, the name and the mark — and one cell always
> leaves the grid, because that is what thought does.

## What this is

A brand kit and design system for **Huginn**, a two-city print and software studio
(Oslo · Reykjavík). It covers the mark, the wordmark, the field, the dissolve, the type voices,
the parts, the voice and the tokens that carry all of it.

## The five domain concepts

1. **The cell** — one 14-unit square on a 3-unit gap. The only primitive.
2. **The dissolve** — an ordered 4 × 4 Bayer decides which cells print; the picture thins, it
   does not fade.
3. **The field** — one vermilion plate per page, the poster the studio prints on.
4. **The escapee** — the sixth cell, six units off the grid, printed in the field colour.
5. **The colophon** — the studio names the painting, the museum and the licence on its own sheet.

## The five colours from the physical world

Vermilion field (#E2281B) · ink black (#100F0E) · bone (#FFFDF9) · chalk (#F4EFE5) ·
the cobalt of a registration pencil (#1B2DB0), which is the only cold note.

## The signature

Five cells hold the picture; the sixth has left. The wordmark is the same cell, spelled out in
22 rows. Nothing in the logo is a font.

## The three defaults this refuses

1. The editorial dark-mode portfolio: a big serif, a duotone photograph, a gradient at the fold.
2. "Dither" as a texture overlay instead of a rendering rule.
3. A blackletter *font* standing in for a drawn wordmark.

## Deliverables

- `public/brand/huginn/` — mark, compact, mono stamp, reverse, glyph, cell-drawn wordmark,
  two lockups, favicon, and the studio's plate (painting + cutout).
- `features/huginn/` — tokens (CSS + JSON), page module, data, six primitives, dither plate,
  footer demo.
- `app/design-system/huginn/` — the specimen, its layout, `llms.txt`, icon.
- `design/brand/huginn/brandkit.html` → `public/brand/huginn/huginn-brandkit.png` (1500 × 1125).

## Track and gate

**Constructed**, cell matrix. Fill only, no stroke, no circles, one accent (the escapee), and
the escapee keeps its off-grid position in every variant including the one-colour stamp. The
compact redraws three cells at 8 units; it is not a scale-down.

## Non-goals

- No cast. A cell cast would be a second logo set, and this track does not ship one.
- No second loud field per page.
- No type below 24px on the field.
