# Lean mode and the Symbools fallback

An opt-in, token-cheap way to run the skill, plus a fallback for marks the model
cannot draw from scratch. Use it when the ask is "a quick identity" or a first
pass; the full kit (board, cast, story) stays the default for a finished brand.

## 1. Lean budget (strict, when lean mode is requested)

- **Sections (5 max):** `01 Thesis & Hot Takes`, `02 Material & Colour`,
  `03 The Mark`, `04 Type & Controls`, `05 Honest Audit`.
- **CSS tokens (28 max):** flat semantic `--sys-*` variables. No
  primitive → semantic → component trees unless asked.
- **SVG:** write code for the one winning mark only (`mark.svg`,
  `mark-compact.svg`, `lockup.svg`). Rejected directions get one sentence.
- **Controls (4 max):** input, primary action, toggle/pill, surface card.

## 2. Three hot takes (opens every lean case)

1. **Material thesis:** what physical or optical material governs the surface.
2. **Anti-slop enemy:** the cliché that gets the PR rejected.
3. **Unbreakable rule:** one measurable constraint (e.g. body copy ≥ 15:1 on a
   solid plate; the mark reads in one colour at 16×16).

## 3. The 5 + 1 colour law

`--sys-ground` (canvas), `--sys-plate` (solid reading surface, ≥ 12:1 with ink),
`--sys-ink` (type and mono mark), `--sys-muted` (metadata, ≥ 4.5:1 on plate),
`--sys-signal` (the single accent, ≤ 10% of the viewport). No shade ramps.
Material recipe: one class, at most 1 fill + 1 cut edge (1px) + 1 highlight or
texture; never stack `backdrop-filter` layers.

## 4. Typography

Two faces, four roles. Display (`--font-display`) only for hero, H2 and
wordmark, `font-synthesis: none`. Workhorse (`--font-sans` / `--font-mono`) for
everything else. Scale: display `clamp(2.5rem, 5vw, 4.25rem)` / 0.96 / -0.03em;
heading `clamp(1.5rem, 2.5vw, 2.25rem)` / 1.1; body 1rem / 1.6 / 62ch on
`--sys-plate`; micro 0.75rem uppercase, 0.08em, tabular-nums.

## 5. Symbools fallback (constructed track)

Before writing Bezier coordinates, map the metaphor to a chapter of Yasaburo
Kuwayama's *Trademarks & Symbols Vol. 2* (symbools.com). Chapter mapping as
recorded in the source note; verify against the book before citing it publicly.

| Chapters | Vocabulary |
| --- | --- |
| 11, 19 | stepped monoliths, portals, vaults, negative-space frames |
| 20, 21 | cantilevered wedges, isometric facets, split prisms |
| 22 | interlocking S-ribbons, parabolic counters, wave-cuts in sharp bounds |
| 23, 25 | directional notches, keystone brackets, overprint joints |

**Trigger:** `score-mark.py` fails a `craft:` check (no `<path>`, under 8 path
commands, or a flat silhouette with no curve, evenodd cut or second subpath), or
the drawing reads as a block letter. Adapt an archetype instead of redrawing.

### Archetype 1: carved vault / negative-space monogram (Ch. 19 / 22)

For spatial, glass, shelter or editorial brands. 64×64, fill-only, passes the
v2.3 gate and the craft gate (checked in this repo's scorer).

```xml
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" fill="none">
  <path fill="currentColor" fill-rule="evenodd" clip-rule="evenodd" d="M8 8H44L56 20V24H34C25.163 24 18 31.163 18 40H8V8ZM8 46H56V56H20L8 46Z"/>
  <path fill="var(--sys-signal, #7DD3FC)" d="M26 36H56V42H26C24.343 42 23 40.657 23 39C23 37.343 24.343 36 26 36Z"/>
</svg>
```

### Archetypes 2 to 4: not yet drawn

The source note names them (interlocking shear / split prism, Ch. 21, for dev
tools; keystone aperture / framing brackets, Ch. 19, for studios and print;
stepped horizon / optical rhythm, Ch. 22, for audio, data and signal brands) but
supplied no geometry. Draw and score them before listing them as verified.

## 6. Craft gate in `score-mark.py`

`check_geometric_craft` rejects marks that pass the negative bans but are stiff:
no `<path>`; fewer than 8 path commands; or no curve, `evenodd` counter-form or
second subpath. Primary: FAIL. Compact: a flat silhouette is a WARN, because the
compact is deliberately one plain path with gaps ≥ 4 units.

## 7. Lean audit table (ends every lean case)

| Gate | Target |
| --- | --- |
| SVG | zero `<circle>`, zero stroke, ≤ 3 paths, gaps ≥ 4 units, 16px pass, archetype cited if used |
| Contrast | `--sys-ink` on `--sys-plate` ≥ 12:1; `--sys-muted` on plate ≥ 4.5:1 (print measured values) |
| Known gaps | one bullet naming any unshipped asset or CSS approximation |
