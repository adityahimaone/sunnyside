# Riso Co. — brief, v4.0

**Supersedes v3.0 ("two passes, one sheet").** The v3 mark was a registration diagram: two
offset parallelograms that said "two passes" and nothing about paper. v4.0 starts from the
thing the system already ended in — the pushpin-and-tear footer — and makes it the identity.

## One sentence

> One pin holds the sheet. The tear is what the second drum prints.

## The five domain concepts

1. **The pin** — the only thing holding the sheet to the wall while the second drum runs.
2. **The tear** — a sheet does not cut along a straight line; the seam records the pull.
3. **Registration** — the second pass is always a few units off, and the offset is the craft.
4. **The deckle** — a torn edge is the only ornament a sheet is allowed.
5. **Overprint** — the third colour exists only where the two drums cross.

## The five colours from the physical world

Unbleached vellum (#F1EDE4) · soy carbon (#1B1712) · fluorescent orange drum (#F2542D) ·
federal blue drum (#1D63FF) · the steel of the pin's needle (#A3A9B2).

## The signature

A sheet pinned at the top, torn from the pin, the right flap 4,3 out of register. Only the pin
crosses the tear.

## The three defaults this refuses

1. Risograph as a *filter*: grain overlays, blend modes, drop shadows pretending to be ink.
2. A "print" palette of two pastel spot colours used as accents on white.
3. A logo built from two overlapping circles, which is what every two-ink brand reaches for.

## Deliverables

- `public/brand/riso/` — mark, compact, mono stamp, reverse, glyph, wordmark, two lockups, favicons.
- `features/riso/` — tokens (CSS + JSON), page module, data, six primitives, footer demo.
- `app/design-system/riso/` — the specimen, its layout, `llms.txt`, icon.
- `design/brand/riso/brandkit.html` → `public/brand/riso/riso-brandkit.png` (1500 × 1125).

## Track and gate

**Constructed**, family 2 (offset geometric planes). Fill only, no stroke, three primitives
(two flaps and a pin), one accent per surface, zero circles. The compact is a separate drawing
with two shapes and no pin. The one-colour stamp punches the pin through both flaps with
`fill-rule: evenodd`.

## Non-goals

- No halftone engine. Every dot on the page is a square or a rule.
- No third ink. The overprint is where the two drums cross, not a new colour.
- No rounded corner anywhere, including focus rings.
