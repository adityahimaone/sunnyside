# Porphyry — design system audit, v1.0 (31 Oct 2026)

**What this is.** Case 10. A design system built from the supplied
`old-masters-preloader`: a black stage, a meander ring, marble statues on black grounds, a
wordmark that fills with marble as the load climbs. The component is retained as a real
specimen, not a screenshot.

## The mark

The first mark was a square P with a gilded counter. It survived at 16px, but it read as a
letter in a frame: the gold bowl was doing the work, and the wordmark already carried the
name. A second bake-off tested six alternatives — the old gilded P, a meander ring, a
curtain, a capital, an arch P and a full-gold doorway. The quarried portal won: a stage
opening cut into a block of stone, an 8-unit gold threshold, and a top-right corner cut as it
came out of the quarry. It is not a letter, it is the system's idea. The six-concept sheet is
`brand/porphyry/marks-bakeoff.png` (source HTML beside it); the winner was then refined to the
quarried corner. `docs/porphyry-qa.md` records the new mark score.

## What changed from the supplied component

- The random `omUid` counter was replaced with `React.useId()`; the original generated a
  different id on the server and the client, so every SVG mask reference could break on
  hydration.
- The `srcKey` template literal was repaired; it arrived with raw newlines inside a quoted
  string and did not parse.
- Fonts are self-hosted (Cinzel, Jost, Pinyon Script) and `fontHref` defaults to `null`.
  Cinzel is a first-class face, not a Bodoni stand-in.
- `prefers-reduced-motion` now opens on the landing instead of counting up; the frame loop
  also refuses to override that state.
- The depth comparison was corrected to match the component's own documentation: figures at
  or beyond `wordDepth` stand in front of the word, the rest behind it. Previously the
  central figure rendered over the call to action.
- The chrome layer now sits above the cast (`z-index: 6`), so controls and the call to action
  are always readable.
- The tagline and brand are upright; Cinzel has no italic, and the synthetic oblique was
  wrong for an inscription.
- The wordmark is an `<h2>`, because the host page owns the `<h1>`.

## Verified

| Check | Result | Evidence |
| --- | --- | --- |
| Route responds | 200 | `curl http://localhost:3111/design-system/porphyry` |
| No console or page errors | Pass, 1440 + 390 | Playwright run, 0 errors, 0 failed requests |
| No horizontal overflow | Pass | `scrollWidth` 1440 / 1440 and 390 / 390 |
| Display face | Pass | computed h1 `Cinzel, "Trajan Pro", …` |
| Stage completes | Pass | `data-phase="landing"`, `aria-busy="false"` |
| Stage is skippable | Pass | Skip button + click-to-rush + Enter/Space handler |
| Reduced motion | Pass | phase `landing` after 0.9s, counter opacity 0, fill 0% but solid in the landing CSS |
| Theme | Pass | `html[data-po="vellum"]`; page 15.4:1; stage stays dark; choice persists after reload |
| Forms | Pass | submit → "Plate saved"; invalid field `aria-invalid` + salmon border + text |
| Focus | Pass | first Tab is the skip link: 2px solid gold, 3px offset, `:focus-visible` true |
| Mark at 16 / 32 / 48 | Pass | contact sheet rendered at 2×; compact is a separate drawing |
| Mark score | PASS | `score-mark.py --dir public/brand/porphyry` |
| Wordmark | Pass | 8 outlined Cinzel glyphs, no `<text>` |
| Tokens | Pass | 11 measured pairs; 2 published failures |
| Detach gate | Pass | weakest pair 73/100; see `porphyry-detach.md` |
| Readable without JS | Pass | page is static; the stage is an ornament above it |

Screenshots reviewed: 1440 stage, 1440 landing, 1440 vellum, 390 stage, mark logo card,
wordmark at 160/80/40 in both inks, cast comparison, parts, palette, tokens, audit.

## Not verified

- **Assistive-technology pass.** No VoiceOver/NVDA transcript. The stage has `aria-busy`, a
  live region and an `aria-label` on the word; that is not the same as a screen-reader test.
- **axe / automated accessibility.** Not installed in this pass.
- **Safari and Firefox.** All browser checks are Chrome 140 via Playwright.
- **Print proof.** The two-ink grade is a software composite. No press pull, no foil.
- **The stock photography licence beyond Unsplash.** Credits are in `GAPS`; the photographs
  are not commissioned.
- **Visual regression baseline.** No stored images; the checks are manual plus the measured
  values above.
- **390 vellum.** The theme was checked at 1440, reduced motion at 1440; the 390 pass was on
  the stage surface.

## Known sharp edges

- `currentColor` inside an `<img src="…svg">` resolves to black, not the page's ink. Every
  wordmark variant is therefore baked (`wordmark-ink`, `wordmark-reverse`); the page swaps
  them with `html[data-po="vellum"]`. Do not re-introduce a live-text wordmark.
- The stage takes its palette as a prop, while the page chrome reads the token layer. There
  are two paths into the same artefact. If a third surface appears, unify them before adding
  a theme.
- The luminance key assumes a near-black ground. A backlit or white-ground photograph needs a
  per-figure threshold and will still keep the room.
- The compact mark is a separate drawing. Do not scale the primary below 24px.
- The stage costs one canvas and one RAF loop while it is mounted. It is intentionally
  client-side; the page does not depend on it.

## Sections

`stage`, `story`, `cast`, `mark`, `stone`, `type`, `parts`, `tokens`, `audit`. Five ids
(`stage`, `story`, `cast`, `mark`, `stone`) are not present in Riso Co., satisfying the
two-section rule; `stage`, `cast` and `stone` are new across the set.
