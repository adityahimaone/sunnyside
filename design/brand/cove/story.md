# Cove — story

> Cove is a blue liquid-glass design system for interfaces that sit over the
> world: one glass layer, one solid reading plate, one squared C with an ice
> waterline, and a type hierarchy calm enough to disappear.

Reject it if any asset needs a second glass layer, body copy on a blur, or a
blue-purple gradient doing the work of an idea.

## Belief

Depth should clarify. A surface earns its transparency by holding one thing you
can actually read.

## Enemy

Glass as wallpaper: five stacked panels, body copy on a blur, a blue-purple mesh
standing in for a material. The failure is not that glass is ugly; it is that
glass is used without a reading surface.

## Mark

The C is the cove. One squared letterform with 45° walls, a 24-unit opening and a
flat 16 × 8 ice inlay on the lower lip. The ink letter is the sheltered curve;
the inlay is the waterline. Remove the inlay and the C still stands, because the
letter is the idea and the inlay is punctuation.

The construction is an **architectural monogram**: two solid primitives in the
primary (C + inlay), one in the compact. The frame is 8 units; the arm is 12; the
opening is 24. No stroke, no circle, no detached accent.

## Material

One translucent layer over one field. The glass is a container, never a filter:
an 8% foam fill on Deep, a 1px lit cut edge, one top specular, a hard 1px line
and a large soft lift. The field can be a caustic, a photo or a render; it never
sits under the words that explain it. Copy lives on a solid plate. The grain
belongs to the field, not the type.

## Voice

Calm, exact, unhurried. Museum wall text, not a launch post. Short sentences,
real numbers, and an error that says what to do next.

## Proof

- Foam on Abyss 17.14:1; Ink on Frost 15.66:1; Abyss on Ice 13.26:1.
- 14 measured contrast pairs; every body pair is at least 4.69:1.
- The C covers the grid cleanly at 16px; the inlay is 16 × 8 and survives 32px.
- `score-mark.py` PASS on the primary, compact and glyph.
- The compact C is one shape; the primary is two.
- Ten native controls, an error summary and a visible focus ring in both
  surfaces.
- The page, the board and the form kit read the same `--cv-*` source.

## Gap

The supplied background image was not in the workspace. The shipped field is a
CSS caustic; `--cv-field-image` is the swap point. CSS `backdrop-filter` is
frosted glass, not true lensing. The constructed kit has no cast, so the marks
section is a logo card, wordmark and rule, not the four-movement composition.
The wordmark is outlined type, not a hand. The compact drops the inlay. The board
is the only export; there are no social or print crops. The browser pass is
Chromium-only and there is no axe or visual-regression CI.

## Why the other three lost

All four directions were drawn on the same 64 grid. The choice is silhouette and
meaning, not a defect.

| Family | Mark | Why it lost |
| --- | --- | --- |
| **Architectural monogram** | **Cove C** | **Kept.** A squared C is the cove; the ice inlay is the waterline. It reads at 16px and joins the serif wordmark. |
| Continuous ribbon | Liquid ribbon | A wavy ribbon is the first water metaphor everyone draws. At 128px it reads as a brush stroke; at 16px it is a squiggle. |
| Horizon & counter-form | Wave pane | A square with a wave bottom shares its outer silhouette with Sunnyside's tile. The idea is right; the shape is already in the library. |
| Brutalist louvers | Two waves | Two waves read as a water icon or a menu glyph, not a brand. The accent makes it a weather symbol. |

## Decision cards

### 1. One glass layer, one reading plate

- **Decision** Glass is for chrome over the field; anything you read sits on a
  solid plate.
- **Because** Text contrast must not depend on what is behind the blur.
- **Not when** A transient overlay must sit above content; use a solid scrim.
- **Breaks next** The Frost scope lightens the glass; the reading plate still
  carries the same text roles.

### 2. The field is the image

- **Decision** The blue caustic is one background field with one swap token:
  `--cv-field-image`.
- **Because** A real field gives the glass something to refract. A gradient alone
  is a mood, not a material.
- **Not when** There is no field to show; use the solid Abyss ground and drop the
  glass.
- **Breaks next** The supplied image is missing. The CSS fallback is deliberate;
  when the file arrives it replaces the gradients at one token.

### 3. Blue is a ground, not a gradient

- **Decision** Abyss and Foam carry the page; Ice is the only field allowed to
  shout. No purple-blue mesh.
- **Because** A restrained blue reads as water and glass. A gradient mesh reads
  as an AI launch page.
- **Not when** A status needs attention; Clay, Moss and Amber are roles.
- **Breaks next** Ice is light, so it needs dark ink on top. On Frost, links use
  the deeper focus blue instead.

### 4. Serif for the name, sans for the work

- **Decision** Instrument Serif is limited to the hero, section titles and the
  wordmark. Instrument Sans carries every control, label and paragraph.
- **Because** The serif gives the system a calm editorial voice; the sans keeps
  14px fields and 16px body unremarkable in the right way.
- **Not when** A card heading sits inside a dense table; use the reading face at
  600.
- **Breaks next** Instrument Serif ships one weight (400). Do not synthesise a
  bold; raise the size or use the italic.

### 5. Frost is a surface, not a second brand

- **Decision** Deep is the default; Frost swaps the same semantic roles onto a
  light ground.
- **Because** A system should survive a bright room without becoming a second
  palette or a second logo.
- **Not when** The hero, material and mark stages are the proof; they stay Deep.
- **Breaks next** Dark plates inside Frost use a local deep scope. If a token
  changes, change the scope in the same commit.

### 6. No glass on body copy

- **Decision** Paragraphs, labels, errors and table cells never sit directly on
  a translucent surface.
- **Because** A blur is not a contrast guarantee.
- **Not when** A caption is decorative and repeated elsewhere; still prefer the
  plate.
- **Breaks next** The glass edge can look like a border. Keep it 1px and do not
  let it become the only boundary.

## Voice card

```
We are      calm, exact, unhurried, specific
We are not  frosted, vague, hyped, blue-purple
Say         "One layer. Read on the plate."
Say         "Use at least 8 characters."
Say         "Depth is a surface, not a fog."
Don't say   "Oops! Something went wrong."
Don't say   "Immerse yourself in seamless glass."
Don't say   "Unlock the power of liquid experiences."
```

## The constructed gate (v2.3)

| Gate | Result | Evidence |
| --- | --- | --- |
| A. Zero circle / zero Venn | Pass | No `<circle>` in the family; the C is a filled letterform with 45° walls. |
| B. Fill-only | Pass | No `stroke` in `mark.svg` or `mark-compact.svg`; the inlay touches the lower lip. |
| C. 2–4 primitives, one accent | Pass | Two in the primary (C + ice inlay), one in the compact. |
| Family | Architectural monogram | One squared C; inlay on the lower lip. |
| Compact simpler | Pass | Compact is one C path; the primary adds the inlay. |
| Score | Pass | `score-mark.py` no failures at 16, 32 and 128px. |
| Showcase silhouette | Pass | Distinct from Vitrine's V, Huginn's brackets, Riso's planes, Hachure's ridge and Sunnyside's tile. |
