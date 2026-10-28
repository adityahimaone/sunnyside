# Logo brainstorm: from name to five honest families

> **Scope.** This file is the **constructed track**. For a warm, editorial or
> object-led brand, use the **drawn track** in `craft-bar.md` first. The five
> families and the zero-circle gate are not universal; applying them to every
> brief is how the skill produced good logos and thin brands.

## v2.3 — the hard gate

The v2.2 bake-off failed the same way the v2.0 sheet did: Huginn, Riso Co. and
Hachure all came out as overlapping circles / discs / thin ring outlines. Three
brands, one silhouette. The v2.3 gate fixes the engine, not the taste:

### A. Zero-circle / zero-Venn
Banned: overlapping circular Venns, concentric rings, circular badges, discs
with orbit rings, Mastercard-style intersecting circles. Across a showcase, no
two logos share the same outer bounding geometry. Every mark has a distinct,
open, non-circular silhouette.

### B. Fill-only
Banned: `fill` + `stroke` on the same shape; thin wireframe rings that collapse
at 32px. Required: solid, unstroked paths separated by negative-space channels
of at least **8% of the viewBox** (5.1 units on 64).

### C. Universal corporate minimalism
A mark is a bold architectural stamp, not a diagram of the tagline. **2–4 solid
primitives.** Monochrome first (`#141413`). At most one accent color on one
focal element.

### Five allowed families

| # | Family | Construction | Replaces |
| --- | --- | --- | --- |
| 1 | Architectural monogram | A custom letterform carved by sharp negative-space cuts or an offset counterweight | the typed initial + ornament |
| 2 | Offset geometric planes | Two sheared parallelograms/diamonds shifted on a 45°/60° axis, interlocking at a solid corner | circular Venn overprint |
| 3 | Brutalist louvers | Solid wedge-cut pillars/stepped blocks; density by bar thickness | thin hachure lines in a circle |
| 4 | Continuous ribbon | One thick beam folding at sharp 45°/90° angles | orbit rings, node chains |
| 5 | Horizon & counter-form | A grounded baseline/bridge plus one floating keystone or quarter-arch | circular badges, sunbursts |

Pick one family per brand. If a concept cannot be assigned to one of the five,
it is not in the v2.3 bake-off.

### SVG code-quality checklist

- Are there `<circle>` elements used as outer containers or Venn diagrams? If
  yes, reject and redraw with `<path>`/`<polygon>`.
- Are any elements using `stroke` + `fill` to fake a border? If yes, convert to
  pure fill shapes with negative-space cutouts.
- Do all three logos have completely different outer silhouettes from 3 metres
  away? Must be yes.

---

# v2.2 history — six families

Fusion of this skill's six-keep-one method with the design discipline and
pattern families of
[op7418/logo-generator-skill](https://github.com/op7418/logo-generator-skill)
(paraphrased, with credit; install it separately if you want its Gemini
showcase step). The fused rule: **explore wide across families, judge with
numbers, then draw by hand.**

## 0. Why marks come out ugly

Diagnosis from a real proof sheet (Huginn, Riso Co., Hachure, all v2.0 output):

| Symptom | What it was | Rule that prevents it |
| --- | --- | --- |
| Initial in a box, or a bare initial | Every brand became "H" or a blob; nothing said what the product does | A letter alone is a typeface choice, not an idea. Use a letter only when something is cut, joined or lit (§3). |
| Detached square next to a letter (Huginn) | An accent with no job; vanishes at 16px | Every part is attached or deleted. `score-mark.py` flags specks under 15% of the median part. |
| Pennant/shield blob with a misregistration offset (Riso) | Offset effect with no shape idea; reads as a render bug small | Effects at < 1.5px at 16px are noise. Compact drops them. The *idea* must survive flat. |
| Chamfered letter with notches (Hachure) | Name's meaning (hatching) never drawn | Draw the thing the name points at. Hachure = short lines on a slope. |
| Same drawing move three times | One construction method (letter + decoration) | Draw from **six different families**, not six tweaks. |

## 1. Gather (one round, five lines)

Name · category · audience · core concept (one verb or image) · mood and
palette limits. Etymology counts: what does the *name itself* depict?

## 2. Concept bank (before any drawing)

Fill four columns, three entries each, from the product's world:

| Name says | Product does | Material it is made of | What it is *not* |
| --- | --- | --- | --- |
| e.g. Huginn = Odin's raven "thought" (pair with Muninn "memory") | remembers decisions | black ink, feather, bone | a chatbot bubble, a circuit brain |
| e.g. Riso = risograph | overprints two spot inks | paper, fluorescent ink, drum | a printer icon |
| e.g. Hachure = map shading lines | shows slope | line, paper, survey | a topo-map pin |

Rank the entries by **how little explanation they need**. The top two or three
become the briefs for the bake-off. Cut anything that works for any product in
the category.

## 3. Six families, six ideas

Allocate across families (from the op7418 method), one idea each:

| # | Family | `brand-forge` concept | Reads as |
| --- | --- | --- | --- |
| 1 | pure geometry | `aperture`, `orbit`, `facet`, `sunburst` | focus, cycle, decision, origin |
| 2 | dot matrix | `dotmatrix` | data, signal, texture with a void |
| 3 | line system | `lines` | flow, signal, shading |
| 4 | dots/shapes + geometry | `overprint`, `stack` | merge, layers, two things that agree |
| 5 | lines + geometry | `hatch` | drawing, relief, craft |
| 6 | node network | `nodes` | agents, links, route |
| + | letter with a cut | `monogram` | only if the letter carries an idea |

Run it:

```bash
node scripts/brand-forge.mjs --init sunburst > brand.json      # edit palette + dna + story
node scripts/brand-forge.mjs --bakeoff brand.json --out bakeoff
python3 scripts/score-mark.py --dir bakeoff
```

`bakeoff.html` shows six cards on the same palette and material, each with the
16/32/64/128 row on light and dark, and two lines to fill: *the sentence this
mark argues* and *why it was kept or lost*. Same material on purpose: the only
variable is the idea.

## 4. Design rules (paraphrased from the op7418 reference)

1. **One or two core ideas.** Six shapes is already a lot.
2. **Generous negative space.** Roughly 40–50% of the mark should be empty
   (the field counts). `score-mark.py` reports the share.
3. **Stroke weight on a 100 grid: 2.5–4** (≈ 1.6–2.6 on our 64 grid). Thinner
   looks fragile, heavier looks clumsy. Compact strokes go up, not down.
4. **Intentional imbalance.** Perfect symmetry is inert; shift weight.
5. **Restraint.** No gradient, shadow or extra colour that does not carry meaning.
6. **One focal point.** The eye knows where to land.
7. **Structural mass.** Two thin lines feel weak; use dense repetition or a
   solid shape.
8. **Round the cuts.** Negative-space cuts and stroke ends are rounded, not
   sharp, unless the brand is deliberately hard-edged and says so.

## 5. Judge with numbers, then with eyes

`scripts/score-mark.py` fails or warns on: compact strokes under 2.4 units,
dots under 4 units, a silhouette that covers < 10% or > 88% of the box, no
contrast at 16px, detached specks, more than 24 elements, and negative space
outside 25–80%. It notes full symmetry. It cannot judge taste; it only removes
the failures not worth discussing.

Then the six tests in `logo-system.md` §2. Keep one. Write why five lost
into `story.md`.

## 6. Refine by hand

The generator is draft one. Open the SVG, move points on the 64 grid, keep one
viewBox, re-run `score-mark.py` and `audit.mjs`. Ideas to push a kept mark:

- Change **material** (edge, offset, stroke) before you change geometry.
- Break one rule on purpose: a gap, an off-centre disc, a cut that stays.
- Build the compact as a separate drawing with fewer parts and heavier strokes.

## 7. Showcase images are not the logo

The op7418 skill makes presentation images with a Gemini image model from an
exported PNG. That is fine for a mockup or a hero. Never let a generated image
become the mark: the mark is drawn (this skill's "draw, do not source"), and
generated showcases get a provenance line (`image-direction.md`).

## 8. Exit criteria

- [ ] Six ideas from six families on one page; five rejection notes written.
- [ ] The kept mark states its argument in one sentence without naming a shape.
- [ ] `score-mark.py`: no FAIL; every WARN has a written reason.
- [ ] Compact read at 16px on light and dark chrome by a human.
- [ ] Not a letter alone, not an effect alone, no orphan parts.
