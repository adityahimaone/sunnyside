# Strand — brand brief

## Job

Give the portfolio its seventh design system (Case 07): a coastal interface system made of sea-glass over dune light — one pane per view, marine ink, a single sun-warm signal, and a coast that appears twice, framed at the entrance and full-bleed at the departure.

## Audience

Design engineers, creative directors, and product teams building calm, high-craft interfaces: architectural studios, editorial products, quiet data tools, and anything that has to hold a reading rather than a pitch.

## Promise

**Where the dunes meet the tide.** A quiet surface that lets a sentence be the loudest thing on the page.

## Positioning

Not a summer beach with umbrellas and cartoon surfboards. Not a dark crypto terminal. Not a gradient mesh with a blur on top. Strand is a **material study**: one pane of sea-glass, a solid plate inside it for every paragraph, marine ink, one sun-warm signal used at two percent of the viewport, and a horizon that never moves.

## Domain before defaults

The product's world is a coastal strand: a dune ridge, a flat sea, a horizon that does not move.

- **Five concepts:** the dune ridge, the tide line, the strand between them, the sea-glass pane, the sun that marks an event.
- **Six inks from the physical world:** dune linen, quartz, marine, coastal haze, sun, depth.
- **Signature:** two sheared planes with a six-unit channel between them — the channel is the strand, and it is the only part of the mark that is not drawn.
- **Obvious defaults to avoid:** frosted pills on every card, gradient headings, glass that refracts nothing, weather metaphors in product copy.

## Constraints

- Stack: Next.js 16, React 19, TypeScript, CSS modules; no heavy component runtime.
- Gate: Sunnyside Brand System **v3.0 constructed** — fill-only, 2 solid primitives in the primary mark, 1 in the compact, no shape carrying both `fill` and `stroke`, one accent only, mark reads at 16px.
- Detach: floor **70** against every sibling (Cove, Hachure, Riso Co., Vitrine, Clearing). Current worst pair: **59 (Clearing)** — reported, not rounded up. See `story.md § Gap`.
- Contrast: body on the pane **15.71:1**, night body **12.61:1**, secondary text ≥ 4.5:1, all measured on the declared composite.
- Material: `backdrop-filter` with a `@supports` fallback to a solid tint of the same value, so contrast never changes.
- Sizes: mark at 16, 24, 32, 48, 64, 180, 192, 512, 1024.
- Imagery: `strand-vista.webp` framed in the hero; `dune-quiet-divider.webp` full-bleed in the footer, edge to edge, no radius, no max-width wrapper.
- Accessibility: 44px touch targets, gap-ring focus, `prefers-reduced-motion` honoured at the root.
