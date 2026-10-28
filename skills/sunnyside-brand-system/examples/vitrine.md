# Vitrine — Case 02 (v2.3)

The second worked example. It tests the method against a different material:
glass and dither. It is a separate brand from Sunnyside; only the method carries
over. The v2.3 pass replaced the old stroke-and-dot Split V with a fill-only
continuous ribbon.

- Live case: `/design-system/vitrine`
- Case library: `/design-system`
- Manual section: `/design-engineering#case-vitrine`
- Board: `/brand/vitrine/vitrine-brandkit.png`
- Tokens: `features/vitrine/tokens.json`
- Story: `design/brand/vitrine/story.md`
- Bake-off: `design/brand/vitrine/explorations/marks.html`
- Audit: `docs/vitrine-design-system-audit.md`

## The brief

> Give the second system a different material without losing the method: a glass
> container, a halftone information layer, a form kit and an audit that names its
> own gaps.

## The one idea

**The case and the grain.** A vitrine holds one lit object; the halftone label is
the only print. Glass is the container; dither is the information layer. The
glass never becomes the content, and the dither never sits under the words that
explain it.

- Essence: “A glass case for a low-resolution light.”
- Promise: depth without fog.
- Family: continuous ribbon.
- Gate: v2.3 — zero circle, fill-only, 2–4 primitives, one accent.
- Not this: a frosted card with unreadable copy; a 1-bit retro toy; a Sunnyside
  re-skin.

## The identity

- **Mark:** Folded V. One continuous beam folds into the V and a flat plinth; the
  plinth carries one Signal label. Two solid primitives in the primary
  (`M10 4L32 44L54 4L62 8L42 56L22 56L2 8Z` + a 10 × 8 label), one in the
  compact (`M12 6L32 42L52 6L61 12L42 58L22 58L3 12Z`). 64 grid, 9-unit channel,
  no stroke, no circle.
- **Wordmark:** Space Grotesk 700, −0.04em, seven glyph paths, no `<text>`.
- **Palette:** Case `#0B0D10`, Frost `#F2F6F8`, Signal `#D9FF43`, Iris `#5B4BE8`,
  Clay `#B23A1D`, Mint `#7CF0C4`. Ink on Frost 17.89:1; Case on Signal 16.99:1.
- **Type:** Space Grotesk display, Geist reading, Geist Mono labels.
- **Material:** 9% white glass on Case, 58% on Frost; 1px cut edge, top
  specular, hard 1px shadow. One effect: the lens dither.
- **Theme DNA:** hard edge, square tile, solid ring, cosy density. The mark and
  the fields read the same object.

## Five families, one material

`brand-forge.mjs --bakeoff` generated bracket, planes, louvers, ribbon and
horizon on one palette. All five pass `score-mark.py`. The ribbon won on
silhouette and meaning; the other four lost because Huginn, Riso and Hachure
already own those silhouettes. Full reasons: `story.md`.

## The system

- 159 token declarations: 14 theme-DNA values, primitive → semantic → component.
- One `DitherShader` field (caustic lens, iris→signal colour field); no example
  component installed.
- Ten native controls: text, email, password, select, radio, textarea, checkbox,
  switch, range, file. Validation, error summary, password toggle, disabled.
- Glass is a container; forms sit on solid fields; body copy never on a blur.
- A portable form kit: `public/brand/vitrine/vitrine-forms.css` + `.html`,
  tokens only, all states.
- A local `.onCase` inverse scope for dark plates inside a light page.
- One case library, one full case, one manual section, one board, one Markdown
  twin.

## The audit

| Check | Result |
| --- | --- |
| v2.3 hard gate | 6/6 pass |
| Mark score | PASS, no failures |
| Brand-system skill resources present | 28/28 |
| Used as shipped / substituted / not used | 22 / 4 / 2 |
| Output contract | 16/16 shipped |
| dithercn install | 31 files, engine current |
| Custom shader fields | 1 |
| Browser pass | 1440 / 390, light / dark, reduced motion, Chromium |
| Gaps named | 8 |

Substitutions: the favicon/icon and downscale scripts, and the board starter.
Unused: the AI image direction and the Sunnyside example (read, not copied).

Gaps: board 1.10 MB; no social/print crops; no visual/a11y CI; favicon uses a
Signal field and the compact mark; the Signal label is dropped below 32px; the
portable form CSS is an export, not the route stylesheet; no generated imagery;
Chromium-only.

## What still misses the Case 01 bar

Vitrine's v2.3 folded V is a strong constructed mark, but its marks section is a
construction card plus a gate. It has no drawn wordmark, no cast, and no
four-movement composition. The next pass should add:

- a cast derived from glass and dither — a lens arc, a dot, a signal burst, a
  bracket, a glare, a registration mark — each with one job;
- a custom-cut or drawn wordmark that belongs to the folded V;
- a logo card, wordmark scale, cast drawer and usage rule
  (`templates/marks-section.html`).

That is the difference between “a good mark” and the Case 01 bar.

## What this case changed in the skill

1. **The hard gate is a build step.** Five families, one palette, score, then
   hand-refine. A letter with a detached accent is not a mark.
2. **Compact is a separate drawing.** It drops the label rather than shrinking
   it; the mono glyph drops it at every size.
3. **Theme DNA makes the fields.** Hard edge, square tile, solid ring and cosy
   density drive both the mark and `--field-*`.
4. **The story is part of the kit.** Seven beats, eight decision cards, a voice
   card, and a named gap.
5. **Dev origin is a QA target.** Next 16 blocks dev resources from `127.0.0.1`;
   use `localhost` or hydration appears to fail.
6. **State pairs need tests.** Empty submit → one focused alert, three invalid
   fields; reduced motion → `data-state="static"`.
7. **Boards overflow silently.** Check 3000 and 1500; the 2× render is not the
   web copy.
8. **Lean QA.** Static audit + one browser pass; computed styles for the states
   that are easy to break.

## Reuse checklist

- [ ] Brief and one-sentence direction.
- [ ] Five v2.3 families in one file; four rejected with reasons.
- [ ] Mark + compact + glyph + mono; compact simpler.
- [ ] Theme DNA + tokens → CSS + JSON.
- [ ] Story spine, decision cards and voice card.
- [ ] One effect and one loud field.
- [ ] One board rendered from HTML; one web copy.
- [ ] One case page and one index card.
- [ ] One form kit with all states, plus a portable CSS export.
- [ ] Static audit + one browser pass on `localhost`.
- [ ] Gaps named.
