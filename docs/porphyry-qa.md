# Porphyry — QA

**URL:** http://localhost:3111/design-system/porphyry (the local dev server was already in
use on 3111; `localhost`, not `127.0.0.1`, per the Next.js 16 dev-origin rule).
**Run:** 31 October 2026. Chrome 140 via Playwright, `channel: 'chrome'`.
**Verdict:** **PASS** for the stage surface at 1440 and 390, vellum at 1440, reduced motion
and the form kit. Two open items: assistive technology and cross-browser.

## Checks

| Status | Check | Evidence |
| --- | --- | --- |
| pass | HTTP | `/design-system/porphyry` 200; `/llms.txt` 200 |
| pass | Console / page errors | 0 at 1440, 0 at 390, 0 vellum, 0 reduced, 0 forms |
| pass | Failed requests | 0 in every run |
| pass | Overflow 1440 | `scrollWidth` 1440 = viewport 1440 |
| pass | Overflow 390 | `scrollWidth` 390 = viewport 390 |
| pass | Display face | computed h1 `Cinzel, "Trajan Pro", "Times New Roman", serif` |
| pass | Heading scale | h1 41.6px at 390; display clamp 41–80 |
| pass | Stage height | 641px at 390 (clamp), frame intact |
| pass | Stage completes | `data-phase` landing; `aria-busy` false |
| pass | Skip | skip link is the first tab stop; `:focus-visible` true; 2px solid gold, 3px offset |
| pass | Theme toggle | stage → vellum; `html[data-po="vellum"]`; persists after reload |
| pass | Vellum contrast | 15.4:1 (computed from the page's own colours) |
| pass | Stage stays dark in vellum | stage background `rgb(20, 10, 14)` |
| pass | Reduced motion | phase landing after 0.9s; counter opacity 0; grain animation 0.00001s |
| pass | Form submit | "Save the plate" → "Plate saved" |
| pass | Field error | `aria-invalid="true"`, border `rgb(224, 138, 120)`, error text present |
| pass | Replay | replay button remounts the stage; `data-phase` returns to `load` |
| pass | Mark sizes | 48 / 32 / 16 rendered at exact CSS sizes; 1-ink glyph inline |
| pass | Mark score | `PASS porphyry` — 90% dominant field, the opening as negative space |
| pass | Detach gate | weakest 73/100 vs Hachure; no hard fails |
| scope | Wordmark variants | `wordmark-reverse` on stage, `wordmark-ink` on vellum; computed display swaps |
| open | Assistive technology | no VoiceOver/NVDA transcript |
| open | Cross-browser | Chrome only; no Safari or Firefox run |
| open | axe | not installed |
| open | Press proof | not printed |

## Runs

| Run | Surface | Overflow | Console errors | Failed requests |
| --- | --- | --- | --- | --- |
| 1440 | stage | 0px | 0 | 0 |
| 390 | stage | 0px | 0 | 0 |
| 1440 | vellum | 0px | 0 | 0 |
| 1440 | reduced motion | 0px | 0 | 0 |
| 1440 | form / focus | 0px | 0 | 0 |

## Notes

- The first dev server was serving a corrupt generated `globals.css` (Tailwind arbitrary
  values mangled) for every route, including `/` and the existing cases. It was restarted
  with a clean `.next/dev`; the new route then compiled. This was an environment fault, not
  a Porphyry regression.
- The stage sequence is deliberately long (load ~3.2s + unveil 3s). It is skippable by click,
  Enter, Space or the Skip control, and reduced motion opens on the landing immediately.
- The 16px compact mark was inspected at 2× on the dark icons row and in the brand board.

## Screenshots

Rendered during the pass and reviewed: `final2-desktop-fold.png`,
`final2-desktop-full.png`, `final2-mobile-fold.png`, `final2-mobile-full.png`,
`final2-reduced.png`, `final2-vellum.png`, `final-topbar-stage.png`,
`final-topbar-vellum.png`, `final-mark-section.png`, `final2-library-card.png`. The durable
artefacts are the route, `public/brand/porphyry/porphyry-brandkit.png` and the bake-off sheet
at `brand/porphyry/marks-bakeoff.png`; the rest are session captures.
