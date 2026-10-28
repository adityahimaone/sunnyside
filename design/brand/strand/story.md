# Strand — story

> Strand is a quiet coastal design system for contemplative, high-craft interfaces: flat white quartz reading plates, marine basalt ink, one shallow-tide green signal, and an atmospheric dune vista framing both hero and footer.

Reject it if any asset reaches for generic neon gradients, circular Venn diagrams, or crowded feature cards that crowd out the horizon.

## Belief

Quietness is strength. An interface earns authority not by shouting with saturated colors, but by giving ideas room to settle, like footprints on a wind-swept dune.

## Enemy

Over-decorated digital noise: gratuitous border glows, rounded floating glass capsules on busy video loops, generic pastel cards, and interfaces that never allow the eye to rest.

## Mark

The S is the strand. One architectural letterform carved with wind-swept dune curves on the outer perimeter, crossed by a single straight shoreline at 7.1°. Everything below that line is tide — 48% of the letter — so the accent is a region of the mark rather than a wedge resting on it.

The cut is 1.1 units wide. Sand and sea are held apart by that gap; they never touch. A strand is the strip *between* the water and the land, so the mark's most important line is the one that is not drawn. Below 32px the gap closes optically and the mark reads as a solid S — which is the correct degradation, not a compromise.

The mark adheres strictly to the **v3.0 constructed gate**:
- Zero circles, zero Venn rings, zero fake strokes.
- Two solid regions in the primary mark — basalt above the shoreline, tide below — separated by the 1.1-unit strand.
- One primitive in the compact mark, maintaining counters of 5.2–8.5 units that stay open at 16×16 favicon size.
- 100% PASS on `score-mark.py`, and detach ≥ 70 against every sibling case.

## Material

Clean reading surfaces modeled after quartz sand plates. Surfaces separate by soft tonal shifts and 1px negative space cuts, never by heavy black shadows. The panoramic dune photograph grounds the entrance (hero) and the departure (footer), reminding the visitor of the physical horizon outside the screen.

## Voice

Measured, serene, architectural. We speak in clear, declarative sentences. No buzzwords, no hurried sales hype.

## Proof

- Marine Basalt on Quartz Plate: **16.6:1** contrast ratio (WCAG AAA).
- Coastal Haze on Quartz Plate: **5.0:1** contrast ratio (WCAG AA).
- Pale Sand on Night Basalt: **14.4:1** contrast ratio.
- `score-mark.py` PASS with zero warnings on primary and compact marks.
- Detach: **78–82** against all five siblings, scored on the weakest pair.
- Verified across mobile (320px, 390px) and wide desktop (1440px).

## Gap

The photograph in the hero and footer is a static WebP asset rather than a live coastal webcam or dynamic tide simulation. Future revisions could integrate real tidal timetable data for local coastal zones.

## Alternative Marks Considered

Why the other marks lost in the bake-off:
- **Bracket (Ch. 19)**: Lost because the bilateral framing brackets felt like an optical viewfinder or camera rig rather than a natural shoreline.
- **Horizon & Counter-form (Ch. 22)**: Rejected because a flat floating sun over a line read too close to Case 01 (Sunnyside) and lacked the tactile grain of sand dunes.
- **Louvers (Ch. 21)**: Lost because parallel vertical bars resembled industrial air grates or a harbor pier rather than fluid coastal wind ripples.
- **Continuous Ribbon (Ch. 22)**: Lost because an unbroken diagonal strip felt like an infrastructure transit corridor instead of an open beach.

A later v1.2 pass tested sixteen further constructions against the same letterform. All of them lost, and the reason is consistent: the S is a fragile silhouette, so any change to its *form* reads as damage rather than intent.

- **Severed foot / dropped lower half** — read as a printing misregistration, not a design decision.
- **Sheared halves** (2 and 3.5 units) — the spine breaks at the seam; the letter looks slipped.
- **Terminals cut at 7.1°** — the top bar looks chipped.
- **Reflection in the waterline** — the mirrored S turns the whole mark into a "3".
- **Wave-shaped cut** — the curved boundary reads as a second S competing with the letter.
- **Ramped swell** (calm at the dune, swell offshore) — conceptually the best of the group, but at 512px the waterline becomes a second letterform.
- **Wedge of sea opening across the letter** — too shallow to register as a gesture at any size.
- **Dune-profile counters** — the hump reads as a lump in the stroke.
- **Pool in the bay** — a teal bar in the crook, which looks accidental.
- **Leaning letter** (4° and 6°) — dynamic, but it contradicts the brand's own promise of quiet surfaces.
- **Cut on the letter's own horizontal at y = 40** — elegant, and the tide line hides inside the letterform; rejected only because the accent drops to a weak sliver at header size.

What survived is the smallest possible change with the largest conceptual payoff: keep the measured 7.1° cut, and open it into a 1.1-unit strand. The redesign is a gap.
