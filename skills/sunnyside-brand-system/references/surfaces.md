# Surface Catalogue — 18 materials, each with an implementation contract

Step 0 asks one Surface question. These are the 18 surfaces it can resolve to. Eight are in the
question itself; the other ten live here so an agent can reach for them when the theme clearly
implies one, without inventing a material nobody can build.

Every surface is **universal**: it is a material, not an industry. Paper & ink works for a bank, a
record label, a shipping network and a hospital. If an option only makes sense for one kind of
brand, it is a theme, not a surface — put it in the archetype, not here.

Every surface is **implementable from a prompt** because it is defined by the same nine slots. Two
agents given the same surface and the same brand hue must land on the same CSS. That is the test:
if a slot can be filled two different ways by two careful agents, the slot is underspecified.

---

## The nine slots

| Slot | What it decides | Why it must be fixed |
|---|---|---|
| `ground` | Page background: hex + how it is built | The largest area on screen. Everything else is judged against it. |
| `plate` | Raised surface: cards, sheets, panels | The second-largest area. Must be a *derived* step from `ground`, not an unrelated colour. |
| `text` | Primary text colour | Contrast is measured against `ground` and `plate`, both. |
| `text2` | Secondary text, labels, captions | Must pass 4.5:1 at 14px, or it is decoration and gets a restricted job. |
| `rule` | Line weight and colour | The single strongest signal of a surface. 1px kraft reads as industrial; 1px warm grey reads as editorial. |
| `radius` | Corner treatment, one value | Zero vs 2px vs 12px changes the whole read. Never mix two radii on siblings. |
| `texture` | The CSS technique that makes it feel physical | This is what separates two surfaces with identical palettes. Must be named, not implied. |
| `type` | Display / UI / mono pairing character | Serif authority vs neo-grotesque discipline vs mono data. |
| `motion` | Duration and easing character | Snappy 120ms reads mechanical; 240ms ease-out reads editorial. |

`demo` is not a slot — it is the consequence. The 210px live demo box in Section 04 must show the
surface doing its job: a card, a rule, a table row, a scanline. If the demo would look identical
under two surfaces, the surfaces are not different enough to both be options.

---

## Family 1 · Print (flat ink on absorbent ground)

### 1. Paper & ink
> Like a book page or a screen-printed poster.

- `ground` warm uncoated off-white · `plate` same ground, separated by rule only · `text` near-black warm
- `rule` 1px, ink at 18% · `radius` 0 · `motion` 140ms, linear-ish
- `texture` flat fill; optional ordered dither at 2% via an SVG `feTurbulence` overlay at `opacity: .04`
- `type` editorial serif display + humanist sans UI + no mono
- `demo` a printed card: hairline border, no shadow, flat fill, a caption in small caps
- Fails loudly if: any gradient, any blur, any shadow, any radius

### 2. Newsprint
> Like a broadsheet front page.

- `ground` newsprint grey-cream · `plate` none — columns are separated by rules, never by cards
- `text` dense black · `text2` black at 62%
- `rule` 1px solid black at 30%, plus 3px section rules · `radius` 0 · `motion` 100ms, none
- `texture` very slight warm grain; column rules are the texture
- `type` condensed serif display, tight leading (1.05), serif body, no mono
- `demo` a headline block with a 3px rule above and a 1px column rule below
- Fails loudly if: cards appear, radius appears, leading goes airy

### 3. Risograph
> Like a two-drum duplicator print with visible misregistration.

- `ground` paper white · `plate` second spot colour at 100%
- `text` spot 1 · `text2` spot 1 at 70%
- `rule` 2px spot colour, offset 1px from its own edge · `radius` 0 · `motion` 120ms, step
- `texture` two spot colours only, `mix-blend-mode: multiply`, plus a 1–2px registration offset on the mark
- `type` grotesque display, grotesque UI, no serif, no mono
- `demo` two overlapping spot blocks with a visible 1.5px offset edge
- Fails loudly if: a third colour appears, offset is clean, blend mode is normal

### 4. Blueprint
> Like a diazo architectural drawing.

- `ground` deep blueprint blue · `plate` same blue, lighter grid · `text` paper white
- `rule` 1px white at 22% for the grid, 1.5px white at 90% for structure
- `radius` 0 · `motion` 160ms, linear
- `texture` a 24px repeating grid (`repeating-linear-gradient` both axes) at low opacity
- `type` technical mono for everything, one condensed sans for headlines
- `demo` a grid-backed panel with dimension ticks and a mono label
- Fails loudly if: grid is absent, radius appears, a serif appears

---

## Family 2 · Industrial (constructed, load-bearing)

### 5. Cardboard & steel
> Like a warehouse or a shipping container.

- `ground` kraft tan · `plate` grey steel, cool · `text` near-black
- `rule` 1px cold grey, plus 2px on table heads · `radius` 0 · `motion` 140ms, cubic-bezier(.22,.61,.36,1)
- `texture` kraft grain via a 3-stop noise overlay at 6%; flute lines on large panels
- `type` disciplined neo-grotesque display + same family UI + tabular mono for numbers
- `demo` a waybill: 1px rules, tabular numbers, zero radius, a barcode-like bar
- Fails loudly if: radius > 0, a serif appears, a shadow appears

### 6. Concrete & rebar
> Like a poured concrete wall with exposed reinforcement.

- `ground` cool mid-grey · `plate` one step lighter, matte · `text` near-black
- `rule` 2px dark grey at 40% · `radius` 2px · `motion` 180ms, ease-out
- `texture` fine grain (`feTurbulence` at 8%) + occasional 1px horizontal form-work seams
- `type` heavy grotesque display, neutral sans UI, mono only for units
- `demo` a panel with a form-work seam and a 2px rule, 2px radius
- Fails loudly if: it looks like glass, gradient is smooth, radius > 4px

### 7. Enamel sign
> Like a vitreous enamel railway sign.

- `ground` deep enamel colour · `plate` same colour, glossy · `text` cream
- `rule` 3px cream, inset 6px from the edge · `radius` 6px · `motion` 120ms, snap
- `texture` one soft specular highlight (`linear-gradient` at 115deg, 8% white, one band only)
- `type` geometric sans display, all caps, generous tracking; same family UI
- `demo` a bordered plate with an inset cream frame and one highlight band
- Fails loudly if: more than one highlight, radius 0, tracking is tight

### 8. Transit map
> Like a metro diagram.

- `ground` paper white · `plate` none — lines are the structure
- `rule` 4px coloured lines with 2px white casing · `radius` 99px on line ends only
- `motion` 140ms, ease-out · `text` near-black
- `texture` flat; the diagonal 45° segment is the texture
- `type` humanist sans throughout, station labels in caps at 11px
- `demo` two crossing 4px lines with white casings and a station dot
- Fails loudly if: lines are 1px, no casing, no 45° segment

---

## Family 3 · Editorial (soft ground, light)

### 9. Linen & daylight
> Like an interior magazine.

- `ground` warm sunlit cream · `plate` white with a 1px warm border
- `rule` 1px warm grey · `radius` 12px · `motion` 240ms, ease-out
- `texture` linen weave via two crossed repeating gradients at 2%, or nothing at all
- `type` editorial serif display + neutral sans UI + no mono
- `demo` a soft card with a 12px radius, 1px border, real blur behind it
- Fails loudly if: radius < 8px, a hard shadow appears, mono appears

### 10. Marble & brass
> Like a hotel lobby.

- `ground` off-white marble · `plate` warm brass at 100%
- `rule` 1px brass at 60% · `radius` 2px · `motion` 300ms, slow ease
- `texture` marble veining via 2–3 very low-opacity radial gradients, never a photo
- `type` high-contrast serif display + neutral sans UI + small-caps labels
- `demo` a brass plate with a veined ground behind it, 2px radius
- Fails loudly if: brass is used as text on marble without a contrast check

### 11. Chalk plaster
> Like a limewashed wall.

- `ground` matte chalk white, very slightly warm · `plate` none, rule-separated
- `rule` 1px at 12% — barely visible, that is the point · `radius` 0 · `motion` 220ms, ease
- `texture` heavy soft grain (`feTurbulence` at 14%, `baseFrequency` low) — the only surface where grain is loud
- `type` humanist sans display at large sizes + same family UI; no serif, no mono
- `demo` a large type block on a grained ground with no card at all
- Fails loudly if: a card appears, a rule is strong, grain is absent

### 12. Museum wall label
> Like the small printed card beside an artwork.

- `ground` gallery white · `plate` none
- `rule` 1px at 10% · `radius` 0 · `motion` 200ms, ease
- `texture` none — this is the one surface defined by the absence of texture
- `type` small caps sans for labels at 10–11px, generous tracking, one serif for the work title
- `demo` a label block: 3 lines, caps, 0.14em tracking, hairline above
- Fails loudly if: any texture, any colour beyond ink, type goes above 14px for labels

---

## Family 4 · Screen (light emitted, not reflected)

### 13. Cockpit panel
> Like an aircraft dashboard.

- `ground` near-black cool · `plate` one step up, cool · `text` near-white
- `rule` 1px at 14% — hairlines only · `radius` 2px · `motion` 120ms, linear
- `texture` none; density is the texture — rows at 28px, every number tabular
- `type` mono for all data, one neutral sans for labels, no serif anywhere
- `demo` a 5-row table: tabular numbers, 1px row rules, one status dot
- Fails loudly if: a serif appears, row height goes airy, radius > 4px

### 14. Phosphor terminal
> Like a CRT monitor.

- `ground` true black · `plate` black plus a 1px phosphor border
- `text` phosphor green (or amber), never pure white · `text2` phosphor at 60%
- `rule` 1px phosphor at 30% · `radius` 0 · `motion` 80ms, step, no easing
- `texture` scanlines via `repeating-linear-gradient` at 3px pitch, 4% opacity
- `type` mono only, one size ladder, all caps for labels
- `demo` a mono block with scanlines and a blinking cursor block
- Fails loudly if: white text appears, scanlines are absent, easing is smooth

### 15. Glass & light
> Like a frosted panel over a photograph.

- `ground` photograph or deep gradient · `plate` `rgba` white at 8–12% + `backdrop-filter: blur(18px)`
- `rule` 1px white at 22% · `radius` 16px · `motion` 260ms, ease-out
- `texture` the blur itself; one soft inner highlight on the top edge
- `type` neutral sans throughout, light weight at large sizes
- `demo` a blurred panel over a coloured field with a 1px light border
- Fails loudly if: blur is faked with opacity, radius < 12px, a serif appears

### 16. Pixel grid
> Like an 8-bit screen.

- `ground` one flat saturated colour · `plate` a second flat colour, no blend
- `rule` 2px solid, never 1px · `radius` 0 · `motion` 60ms, step
- `texture` none — aliasing is the texture; every edge lands on a 4px grid
- `type` one bitmap-style display face, one mono UI, no third
- `demo` a bordered box on a 4px grid with a hard 2px border
- Fails loudly if: any anti-aliased curve, any 1px rule, any radius

---

## Family 5 · Public (built for reading at distance)

### 17. Airport signage
> Like a terminal direction sign.

- `ground` paper white · `plate` a signal colour at 100%
- `text` near-black on white, white on signal · `text2` 70%
- `rule` none — blocks of colour do the separating · `radius` 0 · `motion` 140ms, ease-out
- `texture` flat; the arrow and the numeral are the texture
- `type` grotesque display at 88px+, same family UI, tabular numerals
- `demo` a signal block with a 96px numeral and one arrow
- Fails loudly if: a card appears, a rule appears, a numeral is under 64px

### 18. Civic document
> Like a printed form from a public office.

- `ground` recycled off-white · `plate` same ground
- `rule` 1px at 40%, plus a 1px dashed rule for fields · `radius` 0 · `motion` 120ms
- `texture` nothing decorative; the dashed field rule and the box number are the texture
- `type` one workhorse sans, one mono for reference numbers
- `demo` a form row: label, dashed underline, mono reference number
- Fails loudly if: it looks premium, a shadow appears, radius appears

---

## Choosing one from a prompt

Do not ask a second question. Read the theme and pick, then say which and why in one line.

| Prompt signals | Surface |
|---|---|
| waybill, freight, warehouse, parcel, depot, logistics | **Cardboard & steel** |
| print, edition, press, poster, book, zine, type foundry | **Paper & ink** or **Risograph** |
| newspaper, daily, dispatch, report, journal | **Newsprint** |
| architecture, engineering, survey, drawing, plan | **Blueprint** or **Concrete & rebar** |
| transit, metro, route, network, map | **Transit map** or **Airport signage** |
| interior, home, hotel, textile, furniture | **Linen & daylight** or **Marble & brass** |
| terminal, CLI, tool, infra, dashboard, telemetry | **Cockpit panel** or **Phosphor terminal** |
| retro, arcade, game, synth, chiptune | **Pixel grid** or **Phosphor terminal** |
| gallery, museum, archive, curation, art | **Museum wall label** |
| public service, form, permit, registry, civic | **Civic document** |
| glass, audio, photography, optics, lens | **Glass & light** |
| railway, station, enamel, heritage, signage | **Enamel sign** |
| studio, craft, ceramics, atelier, plaster | **Chalk plaster** |

If two signals collide (e.g. "freight + editorial"), pick the one the **photographs** support, not the
one the words support. A photograph of kraft cartons against brick cannot carry a Linen & daylight
page; it will look like a photo pasted onto a magazine.

---

## Why not more than eight in the question

Eight is the ceiling for one selector before it stops being a choice and becomes a list. The eight
that ship in Step 0 are the ones with the widest distance between them:

1. Paper & ink — flat, reflected light, no radius
2. Cardboard & steel — kraft, industrial, zero radius
3. Linen & daylight — soft, editorial, 12px radius
4. Cockpit panel — dark, dense, tabular
5. Airport signage — bold colour blocks, oversized numerals
6. Concrete & rebar — grey, matte, structural
7. Phosphor terminal — black, mono, scanlines
8. Marble & brass — material, warm, veined

The remaining ten are not second-class. They are reached through the prompt-mapping table above,
which is how most real briefs arrive anyway — a user says "I'm building a metro app", not "I want
Transit map, please".
