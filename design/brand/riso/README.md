# Riso Co. / Atelier Ink — Identity & Design System

> Two passes, one sheet. — v3.0.0

## Core idea

A risograph prints one drum at a time, so the second impression never lands exactly on the first. That misregistration is the identity, not a defect: every display element is printed in fluorescent orange and federal blue, offset 2.5px on screen and 2.2mm on paper, and never corrected.

Where the two passes coincide, the third colour is a **third clipped path** — not `mix-blend-mode`, which would die in a favicon or a PDF export.

## Assets & structure

- `design/brand/riso/brief.md` — the brief, the domain reading, the measured contrast table, and what was rejected.
- `design/brand/riso/explorations/directions.md` — the six mark directions evaluated and the rejection log.
- `design/brand/riso/brandkit.html` — the printed board source (1500×1125).
- `design/brand/riso/assets/wordmark-path.json` — outlined Space Grotesk 700 glyph geometry.
- `public/brand/riso/` — `mark.svg`, `mark-compact.svg`, `wordmark.svg`, `lockup.svg`, `favicons/favicon.svg` (plus 16/32/180), `riso-tokens.{css,json}`, `riso-brandkit.png`.
- `features/riso/tokens.json` — 8 primitives, 22 semantic roles × 2 themes, 16 measured pairs.
- `features/riso/riso-tokens.css` — generated `--rs-*` custom properties, light + safelight.
- `features/riso/brand-paths.ts` — generated mark and wordmark geometry.
- `features/riso/riso.module.css` — the scoped stylesheet (CSS Modules; this route is not Tailwind).
- `features/riso/components/` — `brand.tsx`, `controls.tsx`, `form-demo.tsx`, `footer-demo.tsx`, `tear-study.tsx`.
- `app/design-system/riso/page.tsx` — the proof page.
- `app/design-system/riso/llms.txt/route.ts` — agent-readable twin.
- `scripts/build-riso-brand.mjs` — the single generator (contrast, mark, wordmark, lockup, favicons, TS geometry).
- `scripts/riso-wordmark.py` — outline extraction via `fontTools`.
- `scripts/render-riso-board.mjs` — Playwright board render at 2× then `sips` to 1500×1125.
- `components/ui/pushpin-tear-footer.tsx` — the footer component, unmodified in behaviour.

## Colour roles

| Token | Light | Dark | Role |
| --- | --- | --- | --- |
| `--rs-surface` | `#f1ede4` | `#141110` | Vellum / safelight ground |
| `--rs-surface-alt` | `#e8e1d3` | `#1c1815` | Panels and stages |
| `--rs-sheet` | `#ff4a1c` | `#ff4a1c` | Orange drum — fills only |
| `--rs-sheet-alt` | `#1a7ff0` | `#1a7ff0` | Blue drum, second pass |
| `--rs-ink` | `#1b1712` | `#f1ede4` | Reading text |
| `--rs-ghost` | `#1a7ff0` | `#6faeff` | The second impression in type |
| `--rs-overprint` | `#46212a` | `#6b3040` | The third colour, only where passes cross |
| `--rs-accent` | `#c22e08` | `#ff7a4d` | Orange **as type** (4.87:1) |
| `--rs-accent-alt` | `#0e3f8f` | `#6faeff` | Blue as type and links |
| `--rs-steel` | `#a3a9b2` | `#a3a9b2` | The pushpin needle, and nothing else |

## Accessibility & contrast

Ratios are computed by the build script from the semantic layer and written into `tokens.contrast` — sixteen pairs, none typed by hand, none rounded up.

All pairs pass WCAG AA except one, which is kept visible as a rule: **fluorescent orange `#ff4a1c` as body type is 2.88:1** against vellum and fails 3:1. The orange drum is therefore fill-only; orange type uses `--rs-accent` `#c22e08` (4.87:1). Darkening the fill until it passes would stop it being fluorescent orange.

The footer specimen passes `sheetInk="#1b1712"` (5.30:1 on orange) because the component's white default is 3.36:1 and fails.

Keyboard focus is a 2px offset outline in `--rs-focus`, which stays visible on vellum and on both drums.

## Regenerating

```bash
node scripts/build-riso-brand.mjs       # tokens, contrast, mark, wordmark, lockup, favicons, TS
node scripts/render-riso-board.mjs      # board HTML → 1500×1125 PNG
```

Both are idempotent. `riso-wordmark.py` only needs re-running if the wordmark text or font changes. `make-tear-path.mjs` prints the ridge path used in the board's 05 / Tear panel — paste its output into `brandkit.html` if the seed or amplitude changes.

```bash
node scripts/verify-riso.mjs            # needs the dev server on :3100
```

Reports status, height, horizontal-scroll and console errors for `/design-system`, `/design-engineering` and `/design-system/riso` at 1440 and 390, plus the `llms.txt` twin.
