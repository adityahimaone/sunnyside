# Porphyry — detach gate (Case 10)

Measured on 31 October 2026 with the skill's own script, against every sibling that
declares tokens. Reproduce:

```bash
node .agents/skills/sunnyside-brand-system/scripts/detach-check.mjs \
  --new features/porphyry/tokens.json \
  --ref features/ledger/tokens.json \
  --ref features/riso/tokens.json \
  --ref features/cove/tokens.json \
  --ref features/strand/tokens.json \
  --ref features/vitrine/tokens.json \
  --ref features/hachure/tokens.json
```

## Result

**PASS — weakest pair 73/100 (threshold 70).** No hard fails: namespace, material, display
face, accent hex and one sentence are all distinct.

| Against | Score | Hue | Value | Material | Geometry | Type | Structure | Copy |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Ledger | 82 | 12* | 15 | 15 | 15 | 10 | 5 | 10 |
| Riso Co. | 81 | 25 | 8 | 3* | 15 | 10 | 10 | 10 |
| Cove | 82 | 25 | 2 | 15 | 12 | 10 | 9 | 9 |
| Strand | 83 | 22 | 5 | 15 | 12 | 10 | 9 | 9 |
| Vitrine | 87 | 25 | 8 | 15 | 15 | 10 | 5 | 9 |
| Hachure | 73 | 25 | 5 | 3* | 15 | 10 | 5 | 10 |

\* Neutral or partial because the reference predates the twelve-key DNA object (Ledger,
Riso, Hachure) or declares no accent primitives (Ledger). The tool reports these as
`incomplete`, not as visual collisions.

## The closest hue

Gold (`#c9a45c`, OKLCH 0.737 0.101 83°) is 22° from Strand's copper and 33° from Hachure's
lichen. Under the 25° line against Strand, so value structure had to carry the pair.

## What the score is and is not

The gate measures separation, not quality. 73 against Hachure is a real number produced by
two token files that do not share the full DNA object; it does not mean the two pages look
alike. The stage's value structure (dark-first with a vellum proof surface), its material
(porphyry / marble / gold), its display face (Cinzel) and its new section ids (`stage`,
`cast`, plus `story`, `stone`, `mark`) are the actual separation.

Five section ids are new relative to Riso Co.: `stage`, `story`, `cast`, `mark`, `stone`.
The two-section rule is met.
