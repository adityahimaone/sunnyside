# Wildflower Wind — brief

Six lines, then the things that were decided.

**Name.** Wildflower Wind, a seed house. Not a florist, not a perfume, not a lifestyle
label: they sell seed tins, dried stems and a field guide, from one field, left alone
from June.

**Audience.** People who buy seeds and paper in the same afternoon. They keep a
garden the way other people keep a notebook — badly, honestly, and for years.

**Promise.** Everything you make with this looks gathered, not arranged.

**Enemy.** Two defaults: the symmetrical bouquet with a script logotype, and the opaque
white card that hides whatever is behind it. One is pretty. The other is furniture.

**Material.** Frosted glass over a meadow. Every surface is translucent, every edge
catches light on one side only, and whatever is behind stays visible through it.

**Rejection test.** Reject the work if it could be flattened onto white without losing
anything.

---

## Track

**Constructed.** The mark is a placement table, not an illustration: five petals, each
with an angle, a base radius, a length, a width and a bend. Every file in
`public/brand/wildflower-wind/` is that table, re-struck. What changed in v2 is the
*fill*: a petal is a translucent lens, so two petals that cross multiply, and the
darkest thing in the mark is the crossing rather than a stroke. The family is text-free
SVG, the wordmark is outlined from Instrument Serif, and no photograph is ever traced.

## Six concepts, one kept

Drawn and scored before the family was built (`scripts/variants.mjs` renders the sheet
that was judged):

| Concept | What it was | Why it lost |
| --- | --- | --- |
| A · closed rosette | five petals at 72°, evenly spaced | the enemy, exactly. A bouquet logo. |
| B · slim rosette | the same, narrower petals | still closes; reads as a daisy icon |
| C · bent petals, closed | petals curving the same way | became a pinwheel — rotation, not wind |
| D · four petals | the rosette minus one | a club suit. No story in the gap. |
| E · wide fan | petals opened to 74° | top-heavy; the gap read as a mistake |
| **F · irregular table, one taken** | **four held at 74°/72°/80°, a fifth 134° away, small, further out** | **kept** |

The kept one is the only one where the gap is *legible as an event* rather than as
spacing. At 16px it still reads as a flower; the taken petal becomes a dot, which is
what a petal looks like from far away anyway.

## Nine values

Named for the thing, not the hex:

- **Haze** `#e7e3ee` — the air the page sits in.
- **Glass** `#fbf9ff` — the pane. Surfaces only, never a page background.
- **Ink** `#2a1e33` — deep aubergine. The darkest thing the glass resolves to.
- **Petal** `#f4d9e8` — the tint inside the pane.
- **Signal** `#8f2a90` — the cosmos, refracted. The one accent, ≤8% of a viewport.
- **Leaf** `#4e6b52`, **gold** `#c8913f`, **sky** `#9ec3e0` — the light. Gold and sky
  are shape and surface only; on haze they cannot reach 4.5:1.

The accent is violet, not the pink in the photograph, for two reasons. A translucent
magenta over a warm field reads as dried blood. And the pane is a lens: what you see
through glass is refracted, and refraction is what turns that pink violet. It also sits
32° clear of Jakarta's Doger ramp, which the detach gate insisted on.

## Three defaults avoided

1. **The card.** Every surface is a pane: one lit edge, one long shadow, and a blur that
   lets the field through. A border on all four sides is furniture.
2. **Uniform radius.** Radii are nested — a 12px corner inside a 28px pane reads as a
   lens; the same 12px inside a 40px pane reads as a mistake.
3. **A photograph used as a background.** The meadow is blurred to 34px and tinted. It
   exists so the glass has something to bend, and it never competes with a word.
