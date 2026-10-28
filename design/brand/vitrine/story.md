# Vitrine — story

> Vitrine is a design system for design engineers building translucent product
> interfaces that keeps depth readable, made of one folded ribbon mark, one glass
> container, one halftone label and native fields.

Reject it if any asset needs a second loud field, a frosted paragraph, or a
circle to explain itself.

## Belief

Depth should clarify, never fog. A container earns its transparency by holding
one clear object.

## Enemy

Glass used as decoration instead of a container: the frosted card with an
unreadable paragraph, the gradient blob behind body copy, the second accent that
turns hierarchy into noise.

## Mark

The object and its label are one drawing. A single beam folds into a V and a flat
plinth; the plinth carries the only printed mark. Remove the Signal label and the
case still stands, because the fold is the idea and the label is punctuation.

The construction is a **continuous ribbon**: one solid beam with a sharp fold and
a flat base, two solid primitives in the primary mark (V + Signal label), one in
the compact. No stroke, no circle, no detached accent.

## Material

Glass is a container, never a filter. It is a translucent fill with a 1px cut
edge, one top specular and a hard 1px line. The halftone is an information layer
that sits beside or behind a surface, never under the words that explain it. Form
fields sit on a solid token ground so text contrast never depends on the blur.

## Voice

Precise, lit, unhurried. Museum labels, not marketing. Short sentences, real
numbers, and an error that says what to do next.

## Proof

- Case on Frost 17.89:1; Frost on Case 17.89:1; Case on Signal 16.99:1.
- The mark covers 30% of the 64 grid; the thinnest channel is 9 units (14%),
  above the 5.1-unit gate.
- `score-mark.py` passes the primary, compact and glyph.
- The compact mark is one shape; the primary is two.
- Ten native controls, an error summary and a visible focus ring in both themes.
- The board, the page and the mark read the same `--vt-*` source.

## Gap

The board is still above the 1 MB target; there are no social or print crops; the
browser pass is Chromium-only; there is no automated axe or visual-regression CI;
the favicon is a Signal field rather than a transparent mark; and the Signal label
is dropped below 32px. The portable form CSS is generated for reuse, while the
route consumes the same tokens through its CSS module. None of these is hidden in
the audit.

## Why the other four lost

All five v2.3 families were generated with the same palette and theme DNA and
scored. The choice is about silhouette and meaning, not defects.

| Family | Mark | Why it lost |
| --- | --- | --- |
| Architectural monogram | Two L-brackets and a keystone | Huginn already owns that silhouette. Repeating it makes the library read as one family, not five brands. |
| Offset geometric planes | Two sheared sheets | Riso Co. already owns the overlapping sheared sheet. The mark also reads as a misregistration effect before it reads as a case. |
| Brutalist louvers | Four wedge bars and an apex | Hachure already owns the stepped ridge. A louver is a shelf, not a vitrine; at 16px it becomes a bar chart. |
| Horizon & counter-form | A bar and a floating keystone | At small sizes it collapses into Hachure's bar-and-diamond silhouette. The baseline carries no letter or case. |
| **Continuous ribbon** | **One folded beam and a flat plinth** | **Kept.** The fold makes the V and the case; the plinth gives the label a home; the silhouette is open, angular and unused in the library. |

## Decision cards

### 1. Fold, do not draw a letter

- **Decision** One continuous beam folds into the V; the label is an inlay in the
  plinth, not a dot beside the letter.
- **Because** A typed initial is a typeface choice. A fold is a construction, and
  the label then has a job.
- **Not when** The mark has to carry a halftone texture at 16px.
- **Breaks next** At 16px the label is under 2px, so the compact drawing drops it
  and keeps only the heavier fold.

### 2. Glass is a container

- **Decision** Body copy never sits on a translucent surface; glass is for a
  container with one object.
- **Because** Text contrast must not depend on what is behind the panel.
- **Not when** A floating overlay must read above content; use a solid scrim.
- **Breaks next** The `.onCase` inverse scope mirrors the dark tokens. If a dark
  token changes, the mirror changes in the same commit.

### 3. One loud field

- **Decision** Signal is the only accent allowed to shout; status colours are not
  fields.
- **Because** Two loud fields remove the hierarchy the page is built on.
- **Not when** An error needs attention; Clay is a status role, not a field.
- **Breaks next** Dark focus uses Signal, so focus and accent share a colour. The
  ring is still visible because it is a ring, not a fill.

### 4. Hard 1px cut edge

- **Decision** Glass uses a 1px edge, one top specular and a hard 1px shadow.
- **Because** The mark is a solid fold; a soft glow would change the material.
- **Not when** The panel floats over a photograph; use a scrim first.
- **Breaks next** The dark edge is 18% white and can disappear on Frost; it is a
  container edge, not a border for body copy.

### 5. Native controls, token fields

- **Decision** Text, email, password, select, textarea, radio, checkbox, switch,
  range and file are native; the material is CSS.
- **Because** The kit must work without a component runtime and survive iOS input
  zoom.
- **Not when** A portal or focus trap is required; use Radix.
- **Breaks next** Native select styling differs by browser; the chevron is drawn
  and the field is tested in both themes.

### 6. The label face is a label

- **Decision** Uppercase Geist Mono at 0.14em is for metadata, never paragraphs.
- **Because** The voice is a museum label; the reading face carries sentences.
- **Not when** A caption needs more than one line; use the reading face at 13px.
- **Breaks next** The 10px label sits below the 13px caption floor. On the board
  it is 12–13px at 2×; on the page it is paired with larger text.

### 7. The Signal label is punctuation

- **Decision** One Signal inlay in the plinth; no second accent in the mark.
- **Because** The accent marks the printed label, the one focal element.
- **Not when** The mark is used as a favicon or below 32px; the compact is mono.
- **Breaks next** The inlay is tiny at 32px and absent at 16px. The mono glyph
  and compact carry the identity without it.

### 8. The board is HTML

- **Decision** The board is rendered from the same HTML, tokens and SVGs as the
  page.
- **Because** A board that is drawn twice drifts. One source, one export.
- **Not when** A print vendor requires CMYK; that is a separate artifact.
- **Breaks next** The 3000 × 2250 PNG is still above the 1 MB target. The web
  copy is downscaled, not re-exported.

## Voice card

```
We are      precise, lit, unhurried, specific
We are not  hyped, vague, apologetic, jargon-first
Say         "Request staged. This specimen does not call a server."
Say         "Use at least 8 characters."
Say         "The case holds one object. The rest is clearance."
Don't say   "Oops! Something went wrong."
Don't say   "Awesome! Your request was successfully submitted!"
```

## The v2.3 gate

| Gate | Result | Evidence |
| --- | --- | --- |
| A. Zero circle / zero Venn | Pass | No `<circle>` in the family; the V is a filled polygon. |
| B. Fill-only | Pass | No `stroke` in `mark.svg` or `mark-compact.svg`; the seam is negative space. |
| C. 2–4 primitives, one accent | Pass | Two primitives in the primary, one in the compact, one Signal inlay. |
| Family | Continuous ribbon | One folded beam with a flat plinth. |
| Compact simpler | Pass | Compact is one path; the primary is a path plus the label. |
| Score | Pass | `score-mark.py` notes no failures at 16, 32 and 128px. |
| Showcase silhouette | Pass | Distinct from Huginn's brackets, Riso's planes and Hachure's ridge. |
