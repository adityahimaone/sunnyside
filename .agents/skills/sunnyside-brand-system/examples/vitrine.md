# Vitrine — Case 02

The second worked example. It tests the method against a different material:
glass and dither. It is a separate brand from Sunnyside; only the method carries
over.

- Live case: `/design-system/vitrine`
- Case library: `/design-system`
- Manual section: `/design-engineering#case-vitrine`
- Board: `/brand/vitrine/vitrine-brandkit.png`
- Tokens: `features/vitrine/tokens.json`
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
- Not this: a frosted card with unreadable copy; a 1-bit retro toy; a Sunnyside
  re-skin.

## The identity

- **Mark:** Split V. Two panes meet at a point; one solid, one 4-unit checker
  dither. 64 grid, 13-unit strokes, Signal dot at the apex. The compact 16px
  mark is a separate drawing: solid panes, 2-unit seam.
- **Wordmark:** Space Grotesk 700, −0.04em, seven glyph paths, no `<text>`.
- **Palette:** Case `#0B0D10`, Frost `#F2F6F8`, Signal `#D9FF43`, Iris `#5B4BE8`,
  Clay `#B23A1D`, Mint `#7CF0C4`. Ink on Frost 17.89:1; Case on Signal 16.99:1.
- **Type:** Space Grotesk display, Geist reading, Geist Mono labels.
- **Material:** 9% white glass on Case, 58% on Frost; 1px cut edge, top
  specular, hard 1px shadow. One effect: the lens dither.

## The system

- 125 token declarations, primitive → semantic → component.
- One `DitherShader` field (caustic lens, iris→signal colour field); no example
  component installed.
- Ten native controls: text, email, password, select, radio, textarea, checkbox,
  switch, range, file. Validation, error summary, password toggle, disabled.
- Glass is a container; forms sit on solid fields; body copy never on a blur.
- A local `.onCase` inverse scope for dark plates inside a light page.
- One case library, one full case, one manual section, one board, one Markdown
  twin.

## The audit

| Check | Result |
| --- | --- |
| Brand-system skill resources present | 16/16 |
| Used as shipped / substituted / not used | 10 / 4 / 2 |
| Output contract | 12/12 shipped |
| dithercn install | 31 files, engine current |
| Custom shader fields | 1 |
| Gaps named | 6 |

Substitutions: the favicon/icon and downscale scripts, and the board starter.
Unused: the AI image direction and the Sunnyside example (read, not copied).

Gaps: board 1.1 MB; no social/print crops; no visual/a11y CI; favicon uses a
Signal field instead of a transparent mark; no generated imagery; Chromium-only.

## What this case changed in the skill

1. **Route moves are a checklist.** Canonical, OG, icons, sitemap, llms, docs,
   board URLs and tests move together. Stale `.next` generated types are not
   source.
2. **Specificity is a QA target.** Generic `img`/`a` rules broke the logo and the
   primary button. Test computed styles, not just screenshots.
3. **State pairs need tests.** A scripted edit made the off switch look on.
4. **Dark inverse scopes drift.** Duplicating dark tokens works until it does
   not; generate or sync them.
5. **Boards overflow silently.** Check 3000 and 1500; remove redundant meta.
6. **Favicons need a field.** A transparent Case mark disappears on dark chrome.
7. **One case index, one case page, one manual block.** Fewer, better artifacts.
8. **Lean QA.** Static audit + one browser pass; computed styles for the states
   that are easy to break.

## Reuse checklist

- [ ] Brief and one-sentence direction.
- [ ] Six marks in one file; five rejected with reasons.
- [ ] Compact mark and outlined wordmark.
- [ ] Token source → CSS + JSON.
- [ ] One effect and one loud field.
- [ ] One board rendered from HTML; one web copy.
- [ ] One case page and one index card.
- [ ] One form kit with all states.
- [ ] Static audit + one browser pass.
- [ ] Gaps named.
