# Porphyry — brief

**Name.** Porphyry (imperial stone; the purple-red rock Romans quarried in Egypt).
**Case.** 10 · Sunnyside portfolio.
**Category.** Interface design system and brand kit, shown as an interactive specimen.
**Audience.** Design engineers and art directors who commission a system and need to see
the argument, not only the swatches.
**Promise.** A classical stage for modern interfaces: one stone, one light, a cast that
stands in front of the word.
**Positioning.** The opposite of the flat template. A dark diorama rather than a light
document; depth from light rather than drop shadows; photographs keyed by luminance rather
than cut out; an inscription rather than a geometric sans.

**Source.** The supplied `old-masters-preloader` component: a black stage, a Greek meander
ring, marble statues on black grounds, a wordmark that fills with marble as the load climbs,
volumetric shafts and dust.

**Stack.** Next.js 16 App Router, React 19, TypeScript, CSS Modules, self-hosted Cinzel /
Jost / Pinyon Script. No shadcn dependency was added: the system uses native form controls,
and the host already provides Radix where a portal is required. Component location follows
the host rule — UI lives with the feature (`features/porphyry/components/`), not in
`/components/ui`; only cross-feature primitives belong there.

**Deliverables.** Tokens (JSON + CSS), mark family (mark, compact, mono, reverse, glyph,
favicon), outlined wordmark at three ink variants, lockups, a 1500 × 1125 board, the case
page, the form kit, the `llms.txt` twin, and the audit.

**Assumptions.** The statues are stock photographs (Unsplash) with a black ground; a
differently lit photograph would need a per-image threshold. The board is a screen
composite, not a press proof. The system has no icon set of its own: the ten stars in the
stage are decorative, and the page uses inline SVG for its controls.

**Proof.** `/design-system/porphyry` at 1440 and 390, stage and vellum, reduced motion, and
the measured detach table against every sibling. `docs/porphyry-qa.md`.
