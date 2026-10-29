# Cove — story (v2.0)

> The cove is the cut; the reading is the light that arrived in it.

Cove v1.0 was a blue liquid-glass system: one glass layer, one solid plate, a squared C.
It was competent and it was the wrong idea. It inherited Clearing's glass, Strand's
patience, and a palette that sat 8° from its neighbour — three systems in a row that all
said "calm surface over a photograph". v2.0 throws all of it away and starts from the
question the other eight cases never had to answer: *what does a system look like when the
data is the identity?*

## Belief

**Night is the default, not a theme.**

Every other case in the portfolio is a light system with a dark variant, because they are
read in daylight. Cove is read at 02:00, from a phone, by someone who does not want a white
rectangle in a dark room. So the base ramp is the abyss and daylight is the exception. That
single inversion cascades:

- A shadow is invisible on a near-black ground, so **elevation had to become value** —
  `--cv-plate` is one step lighter than `--cv-bg`, plus a hairline.
- A glow is the only depth cue left on a dark ground, so **the glow had to be rationed**.
  Lumen appears only where a value is live: a filled gauge, a sparkline stroke, a status
  dot, a primary action. Two percent of the viewport, counted rather than felt.
- A dark ground makes every light value louder, so **the palette collapsed to three values
  plus one signal**. v1.0 had eleven inks. v2.0 has abyss, deep, raise, ink, haze, lumen
  and ember, and haze is the only grey — a fourth neutral would mean the value structure
  had drifted.

## Enemy

**The dashboard that glows for no reason.**

A gradient in the hero. A gauge that animates so it looks alive. A dark mode chosen because
dark is fashionable, with a `filter: invert()` and a shadow that no one can see. The enemy
is not "too much colour" — it is **light used as decoration**, because the moment a glow
stops meaning "this is happening", the system has no way left to say that anything is.

Cove's answer is a budget: one accent, one meaning, one live dot per view, and a rule that
the mark is the only place the signal appears at rest.

## Mark

Nine drawings. Eight lost.

The first survivor candidate was a "tide staff": a column with two horizontal dashes
crossing it, read as a water gauge. At 160px it was elegant. At 16px it was a tuning fork,
and at 32 it was busy. The second was a "comb": four vertical bars of decreasing height,
which read as an E and then as a barcode.

The mark that survived is the simplest thing that still says *cove*: **a carved corner with
the reading nested in its cut.**

```
block    M8 8H56V30H30V56H8Z   48 × 48, cut 26 × 26
reading  M36 36H50V50H36Z      14 × 14, six units of ground on every side
compact  M8 8H56V33H33V56H8Z   one shape, arms thickened to 25
```

Two filled quadrilaterals. No circle anywhere in the family, no path carrying a stroke —
the six-unit channel is negative space, not a drawn gap. That is why the mark survives a
favicon: a stroke cannot be both the edge and the gap, and an outline dies at 16px.

## Material

Flat panels, 1px hairlines, and **one shadow in the whole system**: the plate that floats
over the hero photograph, where a hairline genuinely cannot separate a card from an image.

Everything else separates by value. `--cv-bg` → `--cv-plate` → `--cv-raise` is the entire
elevation model, and a hover moves the fill without moving the edge. There is no
`backdrop-filter` except the topbar's 12px blur, which exists so type can pass under it,
not so a card can look like glass.

The two photographs are the one place the system allows a scrim: `hero.webp` is a night
coastline with the dark water on the left, `footer.webp` is indigo ink in water, dark on
the left. Both 1916 × 821, both used full-bleed with no max-width wrapper. In the day ramp
the scrim becomes mist at 88% — the photograph stays, the subject drops into the daylight
palette, and no second asset is shipped.

## Proof

**The data layer is the identity.** A tidal system that draws its charts like a marketing
page has a palette, not an identity, so the chart is the specimen:

- **One value per card.** A reading card holds one number, one unit, one time. Two numbers
  make a table, and a table belongs in the log.
- **Time is part of the value.** A number without an hour is decoration. The time sits in
  the same line as the figure, in haze, never in a tooltip.
- **The gauge is a rail, not a dial.** A vertical track with a filled segment and a single
  tick at the threshold. No needle, no arc, no speedometer.
- **Sparklines carry no axes.** Twenty-four points, one stroke, no grid, no dots, no
  gradient under the line.
- **Stale is visible.** A reading older than its interval drops to haze and loses the lumen
  dot. It does not fade out — it stops claiming to be live.

Type carries the same argument. Sora names, Geist reads, JetBrains Mono measures. Every
figure on the page is mono and tabular, because a column of readings has to align on the
decimal to be scanned, and a proportional face makes 1.14 and 1.41 the same width and the
same blur. The wordmark is Sora SemiBold outlined to paths and frozen in
`features/cove/wordmark-path.ts` — a logo that can swap is not a logo.

The 24-hour curve is a fixed sample of twenty-four numbers. The page says "sample" in the
plate, in the chart head and in the gaps list; there is no feed behind it, and pretending
otherwise would have been the easiest lie in the case.

## Gap

**The detach score against Strand is 70, exactly at the floor.** The gate passes, and
"exactly" is the honest word: hue is 117° away and the display face differs, but the value
ladder is the closest of any sibling (mean L 0.55 against 0.61) and nine of twelve section
ids are shared. Structure is the dimension that nearly failed, and it nearly failed because
a specimen page for a design system has a shape — hero, contents, sections, tokens, audit —
that is hard to escape without making the page worse.

**Clearing is not scored at all.** It ships no `tokens.json`, so the gate has nothing to
read. Everything claimed about Cove being unlike Clearing — serif against mono labels,
cream against abyss, one pane of glass against flat panels — is a design argument, not a
measurement. Any number in that row would have been invented.

Two more gaps are listed on the page and not hidden here: the readings are a fixed sample,
and the photographs upscale above 2×.
