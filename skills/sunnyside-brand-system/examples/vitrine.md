# Vitrine — Case 02 (v2.5)

The second worked example. It tests the method against a different material:
glass and dither. It is a separate brand from Sunnyside; only the method carries
over. Vitrine is the **constructed track**: v2.5 replaces the v2.4 open case with
a half-light V — one architectural monogram split by its material.

- Live case: `/design-system/vitrine`
- Case library: `/design-system`
- Manual section: `/design-engineering#case-vitrine`
- Board: `/brand/vitrine/vitrine-brandkit.png`
- Tokens: `features/vitrine/tokens.json`
- Story: `design/brand/vitrine/story.md`
- Bake-off: `design/brand/vitrine/explorations/marks-v2.5.html`
- Audit: `docs/vitrine-design-system-audit.md`

## The brief

> Give the second system a different material without losing the method: a glass
> container, a halftone information layer, a form kit and an audit that names its
> own gaps.

## The one idea

**The glass arm and the light arm.** One V is split by its material: the ink arm
is the glass, the Signal arm is the light. Glass is the container; dither is the
information layer. The glass never becomes the content, and the dither never sits
under the words that explain it.

- Essence: “A glass case for a low-resolution light.”
- Promise: depth without fog.
- Family: architectural monogram.
- Gate: v2.3 constructed — zero circle, fill-only, 2–4 primitives, one accent.
- Not this: a frosted card with unreadable copy; a 1-bit retro toy; a Sunnyside
  re-skin.

## The identity

- **Mark:** Half-light V. One architectural monogram split vertically at x32: the
  glass arm `M8 8H24L32 34V56H24Z` and the Signal arm
  `M32 34L40 8H56L40 56H32Z`. Two primitives in the primary, one in the compact
  (`M6 6H22L32 32L42 6H58L42 58H22Z`). Vertex 32/34, plinth 16 × 22, arms 16,
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
horizon on one palette. All five pass `score-mark.py`. The architectural
monogram was re-drawn as the half-light V and won on silhouette and meaning; the
other four lost because Huginn, Riso and Hachure already own those silhouettes.
Full reasons: `story.md`.

## The system

- 161 token declarations: 16 theme-DNA values, primitive → semantic → component.
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
| Constructed v2.3 hard gate | 6/6 pass |
| Mark score | PASS, no failures |
| Brand-system skill resources present | 31/31 |
| Used as shipped / substituted / not used | 23 / 4 / 4 |
| Output contract | 16/16 shipped |
| dithercn install | 31 files, engine current |
| Custom shader fields | 1 |
| One-command QA | 29 pass, 1 GPU warning, 0 fail |
| Gaps named | 8 |

Substitutions: the favicon/icon and downscale scripts, and the board starter.
Unused: the AI image direction, the Sunnyside example, the v2.4 cast-forge and
the drawn marks-section template (this is the constructed track).

Gaps: board 1.03 MB; no social/print crops; no visual/a11y CI; favicon uses a
Signal field and the compact V; the compact drops the Signal arm below 32px; the
portable form CSS is an export, not the route stylesheet; no generated imagery;
Chromium-only.

## What still misses the Case 01 bar

Vitrine's half-light V is a strong constructed mark, and its marks section is a
construction card plus bake-off. It does not use the v2.4 drawn cast or the
four-movement composition because it is a technical system; the constructed
track does not require them. If the identity ever needs a warmer expression, the
next step is the drawn track: a custom-cut wordmark, a 4–6 cast from glass and
dither, and the marks composition in `templates/marks-section.html`.

That is a deliberate track choice, not a hole in the kit.

## What this case changed in the skill

1. **Choose the track first.** The constructed v2.3 gate is enough for this
   technical system; the drawn track stays for warm/editorial identities.
2. **The hard gate is a build step.** Five families, one palette, score, then
   hand-refine. A letter with a detached accent is not a mark.
3. **Compact is a separate drawing.** It drops the Signal arm rather than
   shrinking the split; the mono drops the Signal at every size.
4. **Theme DNA makes the fields.** Hard edge, square tile, solid ring and cosy
   density drive both the mark and `--field-*`.
5. **The story is part of the kit.** Seven beats, eight decision cards, a voice
   card, and a named gap.
6. **Dev origin is a QA target.** Next 16 blocks dev resources from `127.0.0.1`;
   use `localhost` or hydration appears to fail.
7. **State pairs need tests.** Empty submit → one focused alert, three invalid
   fields; reduced motion → `data-state="static"`.
8. **One command is enough.** `qa.mjs` runs the audit, the score and the browser
   pass; inspect only what it cannot see.

## Reuse checklist

- [ ] Brief and one-sentence direction.
- [ ] Track named: constructed or drawn.
- [ ] Five constructed families in one file; four rejected with reasons.
- [ ] Mark + compact + glyph + mono; compact simpler.
- [ ] Theme DNA + tokens → CSS + JSON.
- [ ] Story spine, decision cards and voice card.
- [ ] One effect and one loud field.
- [ ] One board rendered from HTML; one web copy.
- [ ] One case page and one index card.
- [ ] One form kit with all states, plus a portable CSS export.
- [ ] One-command audit + score + browser pass on `localhost`.
- [ ] Gaps named.
