# Porphyry — design guide

**One sentence.** A page composed like a stage: one stone, one light, and a cast that stands
in front of the word.

## The five rules

1. **The stage is the default; the vellum is the proof surface.** Never make the vellum the
   identity. It is the paper you read on. The stage is the room.
2. **Gold is the only accent.** It carries focus, eyebrows, the lit edge and the primary
   action. Porphyry is a field. Never set gold on porphyry as type (4.28:1).
3. **Depth comes from light, not from shadows.** No drop shadows, no lifted cards. If
   something needs to sit above something else, light it or leave the stage.
4. **Zero radius.** The mark, cards, fields and buttons are square. Native controls keep the
   platform's shape; the system does not repaint what the OS owns.
5. **One effect.** The stage: the marble fill, the luminance key, the two-ink grade, the
   shafts. Everything else is quiet.

## Type

| Role | Face | Notes |
| --- | --- | --- |
| Display / h1–h2 | Cinzel 400–600 | Inscriptional caps. Never a paragraph. |
| Reading / UI | Jost 400/500 | 17px body, 1.6; labels 11px, 0.22em caps. |
| Signature | Pinyon Script | Once per page at most; the hero word only. |
| Figures / meta | Geist Mono | Ratios, plate numbers, token names. |

## Colour by role

- `stage` #160a0f — the ground. Never pure black.
- `porphyry` #7a1f3d — the loud field, never body copy.
- `gold` #c9a45c — the signal, the only accent.
- `marble` #f2ead9 — the reading ink on the stage.
- `vellum` #f4ecdd + `ink` #241017 — the proof surface.
- `porphyry-ink` #a6395c — ornament on the stage only (3.10:1).

The two failing pairs are published on purpose. A palette that only publishes its passes is
a brochure.

## Marks

- **Primary** `mark.svg` — stone block, trapezoid opening, 8-unit gold threshold; one corner quarried.
- **Reverse** `mark-reverse.svg` — marble block, gold threshold; use on the stage.
- **Compact** `mark-compact.svg` / `mark-compact-reverse.svg` — a separate drawing for 16px.
- **One ink** `mark-mono.svg` — a stamp; no gold.
- **Wordmark** `wordmark.svg` (current ink), `wordmark-ink.svg`, `wordmark-reverse.svg` —
  outlined Cinzel at 0.085em; never live text.
- **Lockups** `lockup.svg`, `lockup-reverse.svg`, `lockup-mono.svg`.
- **Favicons** `favicon.svg`, `app/design-system/porphyry/icon.svg`.

**One rule.** The gold threshold is the only light in the mark. If a variant needs a second lit
element — a star, a rule, a highlight — it is a different mark, not a variant.

## Components

Buttons (primary + quiet + disabled), field, select, switch, radio well, chips, card, plate.
States: hover, focus-visible (2px gold, 2px offset), invalid (text + border), disabled,
success (button label change). Native inputs underneath the custom surfaces.

## Theme

`html[data-po="vellum"] .po-scope` flips the page chrome. The stage component receives its
palette as a prop and stays the stage. Two token paths into the same artefact is a known
sharp edge; if a third surface arrives, unify them first.

## What not to do

- Do not round the mark, the cards or the fields.
- Do not use porphyry as a paragraph colour on vellum without checking (8.56:1 is fine; the
  issue is tone, not contrast).
- Do not add a second accent. Ember is invalid-only.
- Do not put the ink lockup on the stage: 1.1:1.
- Do not animate a second idea. The stage is the only sequence.
