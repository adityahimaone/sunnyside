# Strand — story

> Strand is a coastal interface system for reading in daylight: every surface is a pane of sea-glass over dune light, the ink is the colour of deep water, and one sun-warm signal marks the place where something happens.

Reject it if any asset reaches for frosted pills on every card, gradient headings, or glass that refracts nothing.

## Belief

An interface is a material decision before it is a layout. Quiet surfaces are not the absence of design; they are the expensive part, because a pane that blurs what is behind it has to earn the blur with a plate that stays readable. Strand puts the paragraph on the plate and lets the pane stay a pane.

## Enemy

Cheerful noise: a frosted capsule on every card, a gradient on every heading, a glass panel that exists to prove the browser supports `backdrop-filter`. Also the empty state that congratulates you, and the photograph with type burned into it.

## Mark

Two planes, and a channel. The upper plane is sand, the lower is sea, and the six units between them are the only part of the mark that is not drawn.

- Bounding box **52 × 46** on the 64 grid, upper plane overhanging the lower by eight units.
- Both planes are sheared **18.4°**; the channel is six units, **9.4%** of the grid.
- Fill only. Nothing is stroked, nothing is rounded, nothing is a circle.
- Two primitives, one accent: sun on the upper plane, marine on the lower. In reverse, night-sun and night-ink.
- Below **28px** the component swaps to a separate compact drawing with a seven-unit channel, because six units at 16px is 1.5 device pixels and needs help.

The mark adheres strictly to the **v3.0 constructed gate**: zero circles, fill-only, two solid primitives in the primary, one in the compact, one accent. `score-mark.py` returns PASS with the dominant field at 61% — the channel is the negative space, so the two planes carry the mass.

The earlier v1.x S-monogram was retired in v2.0. It was a good letterform and a weak logo: an S made of a letter is a monogram, and a monogram has to compete with every other monogram in the portfolio. Two planes have no competition, and they survive at 16px because there is nothing fine to lose.

## Material

Sea-glass. A pane is a 158° white gradient (0.84 → 0.58), 24px of backdrop blur at 1.7 saturation, a 1px specular edge at 78% white plus a 1px inset highlight, and one long low shadow at 64px blur, −34px spread, 45% ink. A paragraph never sits on glass; it sits on a solid plate inside the pane, which is why body contrast is a measured 15.7:1 rather than a function of the photograph underneath.

One pane per view. Two panes stacked double the blur and halve the legibility. The edge is brighter than the ground — light catching a cut edge, never a grey outline. Nothing inside the material moves: no drift, no parallax, no shimmer.

## Voice

Measured, unhurried, specific. State the reading, then stop. Numbers carry a unit and a time. The interface is a logbook, not a host — it does not congratulate you for reading it. Weather metaphors are forbidden in product copy.

## Proof

- Marine on the pane composite: **15.71:1** (measured on the declared composite, not guessed).
- Marine on quartz: **16.13:1**. Marine on dune: **14.17:1**.
- Night ink on the night pane: **12.61:1**. Night ink on the night ground: **16.25:1**.
- White on sun: **5.06:1**. Sun ink on quartz: **6.82:1**.
- `score-mark.py`: **PASS**, zero circles, fill-only, dominant field 61%.
- Detach: **81 Cove · 75 Vitrine · 73 Hachure · 69 Riso · 59 Clearing**. The floor is 70 and the Clearing pair does not clear it; see Gap.
- Verified at 1440 and 390, on both surfaces, with no horizontal overflow at either width.

## Gap

Detach against Clearing is **59/100** against a floor of 70. The sun sits nine degrees from Clearing's hart in OKLCH hue, and the night sun sits on the same hue exactly. Moving the signal to roughly 35° would clear the threshold by nine degrees while landing within 27° of the same accent — the number would improve and the resemblance would not. The accent is shared; the surfaces, type, geometry and section order are not. The score is reported at the value it earned.

The other gaps are listed on the page: a static footer photograph rather than an art-directed set, composite ratios that assume a declared opacity, a wordmark that cannot swap because it is outlined, and a 2% signal budget measured by hand rather than at runtime.
