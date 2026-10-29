# Cove — brand brief (v2.0)

## Job

Give the portfolio its ninth design system (Case 09): a **tidal observatory** made of an
abyssal ground and one lumen signal — a number is never shown without the hour it was
taken, and the light in the interface only ever means "this is live".

## Audience

People who read water: harbour masters, coastal engineers, dive shops, surf forecasters,
and the design engineers who build their tools. Anyone whose day is organised by a tide
table and who has to read a screen at 02:00 without waking the room.

## Promise

**The cove is the cut; the reading is the light that arrived in it.** A surface that stays
dark because that is when it is used, and puts a single light on the only thing that is
happening.

## Positioning

Not a dashboard that glows to look alive. Not a dark mode bolted onto a light system with
`filter: invert()`. Not a "data aesthetic" of grid lines, brackets and monospace costume.
Cove is an **instrument**: three values of ink, one hairline, one signal, and mono figures
that align on the decimal.

## Domain before defaults

The product's world is a cove at night: a cut in the rock, water arriving in it, a reading
taken from the edge.

- **Five concepts:** the cut, the reading inside it, the water level, the threshold, the
  hour the reading was taken.
- **Six inks from the physical world:** abyss (deep water at 02:00), deep (the panel),
  raise (the step above it), ink (moon on water), haze (spray), lumen (bioluminescence).
  Ember is not a sixth ink — it is a threshold, and it is used once per view.
- **Signature:** a carved corner with the reading nested in its cut, separated by six
  units of ground. The channel is the only part of the mark that is not drawn.
- **Obvious defaults to avoid:** a glowing hero gradient, a gauge that animates to look
  alive, a speedometer arc, glass panels on a dark ground (a shadow is invisible there, so
  the glow becomes the only depth cue — and then the glow means nothing).

## Constraints

- Stack: Next.js 16, React 19, TypeScript, CSS modules. No component runtime, no chart
  library — the sparkline and the tide chart are one SVG path each.
- Gate: Sunnyside Brand System **v3.0 constructed** — fill-only, two solid primitives in
  the primary mark, one in the compact, no path carrying both `fill` and `stroke`, one
  accent (the reading), reads at 16px.
- Detach: floor **70** against every sibling. Measured: Strand **70**, Hachure **73**,
  Riso **74**, Vitrine **75**. Clearing ships no `tokens.json`, so that pair is a design
  argument, not a measurement — said out loud in `story.md § Gap`.
- Contrast: ink on abyss **17.19:1**, ink on a panel **16.18:1**, haze on abyss **7.68:1**,
  lumen on abyss **12.18:1**, day-ramp tide on mist **5.06:1**. All eleven pairs are
  computed by `scripts/generate-cove-tokens.mjs`, not estimated.
- Material: flat panels, 1px hairlines, **no shadow anywhere except** the plate that
  floats over the hero photograph.
- Ramps: `night` is the base (an `html` element with no attribute), `day` is an override
  selected by `html[data-cove='day']`. Both ramps declare the same primitive names; only
  the values change, so no semantic token breaks on the switch.
- Type: Sora 600 (display), Geist 400 (reading), JetBrains Mono 500 (labels and every
  figure, tabular).
- Imagery: `hero.webp` full-bleed behind the hero, `footer.webp` full-bleed behind the
  footer. Both 1916 × 821 and both left-dark, which is why the copy sits on the left.
- Accessibility: 40px controls, 2px signal ring at 2px offset, `prefers-reduced-motion`
  collapses every duration to 0.01ms at the root.
