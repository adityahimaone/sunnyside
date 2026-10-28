# The detach gate

A new design system is not judged against the brief alone. It is judged against
the systems it will sit next to. The detach gate turns "does this feel
different?" into a scorecard with named failures, computed from token files.

```bash
# one system against its neighbours
node scripts/detach-check.mjs --new features/<slug>/tokens.json \
  --ref features/clearing/tokens.json --ref features/strand/tokens.json

# the whole portfolio at once — every pair, weakest first
node scripts/detach-check.mjs --scan features --min 70
```

Exit 1 on any hard fail or a score below `--min`. `--json` for a machine twin.

## 1. The five hard fails

These cannot be rescued by a good score. They are duplicates wearing a new name.

| # | Fail | Why it is fatal |
| --- | --- | --- |
| **H1** | Same namespace (`--st-` twice) | Two token sets silently merge; every later override is a coin flip |
| **H2** | Same `theme.material` string | The material *is* the identity. Two "liquid-glass" systems are one system |
| **H3** | Same display face | The largest type on the page is the brand. A shared face is a shared voice |
| **H4** | Same accent hex | Not "similar" — identical. One of the two has to move |
| **H5** | One-sentence overlap > 60% | Same claim with new nouns. The brief was not rewritten |

H2 and H3 are the ones that fire in practice, because they are the easiest to
copy without noticing. A shared material string is usually a copy-paste of the
DNA block; a shared display face is usually the host's default.

## 2. The seven scored dimensions

100 points. A pair passes at 70, and every new case must pass against **every**
sibling, not the average.

| Dimension | Points | What it measures | Full marks |
| --- | --- | --- | --- |
| **Hue** | 25 | Smallest OKLCH hue angle between the two accent sets | ≥ 25° apart |
| **Value** | 15 | Mean lightness, mean chroma, lightness spread | different value structure, not a different tint |
| **Material** | 15 | How many of the 12 DNA keys differ | 10+ differ |
| **Geometry** | 15 | `radius`, `edge`, `tile`, `offset`, `stroke` | all five differ |
| **Type** | 10 | Display face, then body face | different display, different body |
| **Structure** | 10 | Section ids not present in the reference | ≥ half the reference's count |
| **Copy** | 10 | Word overlap of the one-sentence claim | no shared nouns |

Only chromatic primitives are compared for hue. A near-neutral has a
mathematically defined but perceptually meaningless hue, so anything under
chroma `0.045` is skipped — otherwise a dark "abyss" vetoes every warm palette.

**Placeholders score zero.** A `TODO` in the DNA, a placeholder display face or
an unfilled one sentence is not a decision, so it earns nothing — otherwise the
cheapest route to a high score would be leaving the work undone. A freshly
scaffolded case scores around **40/100**: it has a distinct hue and a namespace,
and no identity yet. That is the gate doing its job, not a false alarm. Fill the
DNA, name the faces, write the sentence, then re-run.

If the *reference* predates the DNA object, the gate compares only the keys both
sides declare and says so (`only 3/12 DNA keys are declared on both sides`).
Read that line before trusting a high material score.

## 3. How to read a score

| Score | Reading | Action |
| --- | --- | --- |
| 85–100 | Distinct systems | Ship |
| 70–84 | Different, with one shared habit | Name the habit in `DESIGN.md`; it is now a portfolio rule |
| 55–69 | A sibling with a new coat | Change material or value structure, then re-run |
| < 55 | The same system | Go back to the brief, not the CSS |

The dimension breakdown matters more than the total. `hue 25 · structure 5` and
`hue 5 · structure 10` both land near 70 and mean opposite things: the first is
a new colour on the old skeleton, the second is an old colour on a new one.
Neither is finished.

## 4. Worked example: Strand × Cove

Two real cases from the portfolio, measured:

```
  WEAK   46/100  vs Cove
        hue  1 · value  6 · material  9 · geo  6 · type 10 · structure  5 · copy  9
        · hue aquamarine(213°) vs ice(214°) = 1° — same family
        · theme DNA differs on 5/12 keys
        · display: syne vs instrument serif
        · sections: 0/11 not present in Cove
```

Read it in order:

- **hue 1/25.** Aquamarine 213° and ice 214° are the same colour. This is the
  finding a human reviewer misses, because the two systems *look* different —
  one is quartz sand, one is blue glass — but their accents are one degree apart.
- **structure 5/10.** All eleven section ids are shared. That is the deeper
  problem: the page skeleton was reused wholesale.
- **type 10/10.** Syne against Instrument Serif is a real difference, and it is
  the reason the two cases still read as separate work.
- **material 9/15.** Five of twelve DNA keys differ. The systems are cousins,
  not strangers.

The fix is not "make it bluer". It is: keep the value structure (both are light
grounds), move the accent family, and replace at least three sections with
sections only a coastal system would have. That lands the pair near 80 without
redrawing either mark.

Contrast with a pair that passes:

```
  PASS   88/100  vs Clearing
        hue 25 · value  8 · material 15 · geo 15 · type 10 · structure  5 · copy 10
        · closest accent hue: 39° from Clearing
        · theme DNA differs on 12/12 keys
        · display: syne vs iowan old style
```

Twelve of twelve DNA keys differ, geometry is fully separated, and the accent is
39° away. The structure score is still 5 because neither case declares sections
in `tokens.json` — a data gap, not a design one.

## 5. When the wheel is full

Eight cases with two or three chromatic accents each occupy most of the hue
circle. `init-system.mjs --peek` prints the free arcs; when there are none it
says so. That is not a dead end, because hue is only 25 of 100 points.

The levers, in order of strength:

1. **Value structure.** A night system beside a paper system scores 12–15 on
   value before hue is considered. `--mode dark` is the cheapest real separation
   available.
2. **Material.** A different material string forces different edge, ring and
   field recipes. It is the single highest-leverage DNA key.
3. **Geometry.** Radius alone is weak; radius + tile + edge together is 15
   points and is visible at a glance.
4. **Structure.** Two new section ids cost nothing and cannot be faked by a
   rename.
5. **Hue.** Move it when you can; it is the easiest to see and the easiest to
   copy.

## 6. Limits

Be honest about what the gate cannot see.

- **It reads tokens, not intent.** Two systems can score 90 and still be the
  same idea. The novelty ledger in `fresh-init.md` covers that; no script can.
- **Section ids are a proxy for structure.** Renaming `colour` to `palette`
  changes the id and changes nothing. The gate rewards a new *kind* of section
  only if you actually write one.
- **It needs `sections`.** Cases that keep their section list in `<slug>-data.ts`
  are read from the `NAV` array; cases with neither score a neutral 5.
- **Chromatics only.** A strictly greyscale system scores 12 on hue by default.
  That is a lenient pass, not a strong one.
- **The reference must be the right one.** Measuring against a case in another
  category produces a high score that means nothing. Compare neighbours, not
  strangers.
