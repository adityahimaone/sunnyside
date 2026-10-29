# Cove — brand and system guide (v2.0)

> The cove is the cut; the reading is the light that arrived in it.

Case 09 of the Sunnyside portfolio. Night-first, one signal, mono figures.
Live at `/design-system/cove`; machine-readable at `/design-system/cove/llms.txt`.

| | |
| --- | --- |
| Namespace | `cv` — `--cv-*`, scope `.cv-scope` |
| Ramps | `night` (base) · `day` (`html[data-cove='day']`) |
| Material | ink and lumen — flat panels, hairlines, no glass, one shadow (the hero plate) |
| Mark | carved corner + nested reading, 64 grid, six-unit channel |
| Type | Sora 600 · Geist 400 · JetBrains Mono 500 |
| Tokens | 112 declarations, 14 primitives, 11 measured contrast pairs |
| Detach | floor 70 · measured 70 / 73 / 74 / 75 · Clearing unscored (no `tokens.json`) |

## Files

```
features/cove/
  tokens.json            source of truth
  cove-tokens.css        generated — do not edit
  cove-data.ts           every string the page renders
  cove.module.css        the specimen page
  wordmark-path.ts       Sora SemiBold, outlined and frozen
  components/            brand, contents, code, actions, theme toggle, parts, instruments
app/design-system/cove/
  layout.tsx             fonts + .cv-scope
  page.tsx               12 sections
  llms.txt/route.ts      generated from cove-data
  icon.svg, apple-icon.png
public/brand/cove/       marks, lockups, icons, tokens, forms, hero.webp, footer.webp
design/brand/cove/       brief, story, this file, brandkit.html + board
```

## Regenerate

```bash
node scripts/generate-cove-tokens.mjs   # tokens.json → css + public exports
node scripts/generate-cove-forms.mjs    # portable form kit (checks every var)
node scripts/cove-icons.mjs && python3 scripts/cove-ico.py
node scripts/render-board.mjs --html design/brand/cove/brandkit.html \
  --out design/brand/cove/cove-brandkit.png --width 1500 --height 1125 --scale 2
```

## Rules that are easy to break

1. Never read a raw hex in a component. Read a semantic name.
2. Lumen is a state, never a surface. Two glowing things on one screen is one too many.
3. No `box-shadow` on a panel. Elevation is `--cv-plate` → `--cv-raise` plus a hairline.
4. Every figure is mono and tabular. Every number carries its time.
5. `night` and `day` declare the same primitive names. Never add a `dark:` variant.
