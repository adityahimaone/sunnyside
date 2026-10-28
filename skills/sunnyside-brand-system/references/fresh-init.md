# Fresh init: starting a system that inherits nothing

Every design system skill works fine on an empty machine. This one has to work
on a repo that already holds eight finished cases, because that is the real
condition: the ninth case is written by an agent that has just read the other
eight, and the pull toward the nearest neighbour is stronger than the pull
toward the brief.

Fresh init is the procedure that resists it. It has three moves: **borrow the
shell, refuse the identity, prove the distance.**

## 1. Borrow the shell, not the look

There are two kinds of inheritance and only one of them is legitimate.

| Legitimate — copy it | Illegitimate — regenerate it |
| --- | --- |
| Folder shape (`features/<slug>/`, `app/design-system/<slug>/`) | Hue family and accent |
| Token layering (primitive → semantic → component) | Value structure (where the ramp sits) |
| Scope-class pattern (`.xx-scope`, `html[data-xx='dark']`) | Material string in the DNA object |
| Naming (`<slug>-tokens.css`, `<slug>.module.css`, `<slug>-data.ts`) | Display face |
| The component contract (`Mark`, `Wordmark`, `Lockup`) | Geometry: radius, edge, tile, offset |
| Metadata shape, `llms.txt` route, icon slots | Section list and section order |
| The audit table format | One sentence, story beats, decision cards |

The left column is *plumbing*. Copying it is what makes nine cases feel like one
portfolio. The right column is *identity*. Copying it is what makes nine cases
feel like one case repeated.

Write the split down before starting. If a decision is not in the left column,
it has to be made again from the brief.

## 2. The four refusals

`scripts/init-system.mjs` refuses to scaffold in four situations. Each refusal
is a real duplicate, not a style preference.

1. **The slug exists.** `features/<slug>/` or `app/design-system/<slug>/` is
   already there. Rename, or use the existing case.
2. **The namespace is taken.** Two-letter prefixes are scarce and a collision
   silently merges two token sets. The script allocates the first free pair and
   prints it (`--ti-`).
3. **The hue is inside 8° of a sibling accent.** That is the same colour family
   with a new name. The script names the culprit and its chroma, and prints the
   free arcs on the wheel.
4. **No free arc is left.** With eight cases this is normal. The script says so
   and points at the real levers: value mode, material, geometry, structure.
   `--force` keeps the hue and makes the other dimensions carry the separation.

Refusals 3 and 4 are the ones that matter. They convert "make it different" from
an intention into a constraint that fires before a single line of CSS exists.

## 3. The blank-slate ritual

Before drawing, name these four things. They are the same four the skill asks
for in every mode, but here they are checked against a ledger.

- **Five concepts** from the product's world — not its features.
- **Five colours** from the physical version of that world: materials, light,
  objects. Hex values come later; the *material* comes first.
- **One signature** that could only belong to this brand.
- **Three obvious defaults** for this category — the ones to avoid.

Then fill the **novelty ledger**: for each sibling case, write the one thing it
already owns. The ledger is short and brutal:

| Case | Owns |
| --- | --- |
| Huginn | dither, a painting reduced to cells, blackletter |
| Vitrine | half-light glass, the V, misregistration |
| Riso | two sheared sheets, solid overprint |
| Hachure | relief in bar weight |
| Cove | blue liquid glass, the ice pane |
| Strand | coastal quartz, the dune-crest S |
| Clearing | painted emerald, the stag on the horizon |

If the new concept appears in the ledger, it is not new. This is faster and more
honest than a mood board, and it is the only artefact that survives into
`brief.md` as evidence.

## 4. DNA before CSS

The theme DNA object is the contract between the mark, the surface and the
fields. Write all of it before any CSS, and write it in words, not values:

```json
"theme": {
  "family": "architectural-monogram | drawn-track",
  "material": "the physical thing the surface is made of",
  "edge": "how a boundary is cut",
  "offset": "how far a plate sits off its shadow",
  "stroke": "the one line weight the family shares",
  "tile": "square | round | none",
  "radius": "one number",
  "ring": "how focus is drawn",
  "density": "airy | compact",
  "label": "mono-caps | sans-caps | sentence",
  "field-recipe": "the form material",
  "mark-form": "the mark's construction in one phrase"
}
```

Every `TODO` here is a decision deferred to whoever writes the CSS, and that
person will copy the neighbour. Fill it now.

## 5. Command sequence

```bash
# 1 · see the palette, the neighbours and the free arcs — writes nothing
node scripts/init-system.mjs --slug tidewater --name "Tidewater" --case 09 \
  --hue 28 --peek

# 2 · scaffold
node scripts/init-system.mjs --slug tidewater --name "Tidewater" --case 09 \
  --hue 28 --mode light

# 3 · measure the distance before drawing anything
node scripts/detach-check.mjs --new features/tidewater/tokens.json \
  --ref features/clearing/tokens.json --ref features/strand/tokens.json

# 4 · draw six, keep one, generate the family
node scripts/brand-forge.mjs --init bracket > brand.json
node scripts/brand-forge.mjs --config brand.json --out public/brand/tidewater
```

`--mode` sets which ramp is the page default. Both ramps are always emitted with
the same primitive names, so the semantic layer never breaks on a theme flip.

## 6. The two-section rule

A scaffold ships eight sections because eight is the shape of a design-system
page. It is not the shape of *this* design system. Before the page is reviewed:

- **Replace at least two section ids** with sections this system actually
  needs — a material study, a density ladder, a colour-budget ledger, a print
  proof. Renaming a section does not count; the detach gate compares ids.
- **Delete any section that has nothing true to say.** An empty "Motion" section
  is worse than no Motion section.
- **Keep the audit last.** It is the only section whose position is fixed,
  because it is the page admitting what it has not proved.

## 7. Checklist

- [ ] slug, namespace and hue are free; the refusal did not fire
- [ ] `brief.md` has the track, five concepts, five physical colours, one
      signature, three defaults to avoid
- [ ] the novelty ledger names what each sibling owns, and the new idea is not
      in it
- [ ] all twelve DNA keys are filled — no `TODO`
- [ ] the display face and the one sentence are real, not placeholders
- [ ] `detach-check.mjs` scores ≥ 70 against every sibling, no hard fails
- [ ] at least two section ids are new
- [ ] the palette's ink-on-plate is ≥ 7:1 and signal-on-plate ≥ 4.5:1
- [ ] the scaffold compiles before a mark exists

A fresh scaffold scores about **40/100** on the gate, because placeholders earn
nothing. That is the intended reading: the scaffold has a namespace and a hue,
and no identity yet. The score climbs as the DNA, the faces and the sentence
become decisions.

A system that passes 1–8 is allowed to be drawn. One that fails 3 or 5 is not a
new case; it is the last case with a different name.
