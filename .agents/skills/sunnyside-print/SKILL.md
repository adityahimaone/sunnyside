---
name: sunnyside-print
description: Generate Sunnyside print ephemera in code — 16:10 project sleeves (the generated covers used for releases without artwork) and 4:5 Show & tell prints (poster, sticker sheet, type specimen, curve study) — plus the PNG renderer. Use when a project needs a cover with no photograph, when the showcase needs a new study card, or when an artefact should look printed rather than decorated.
metadata:
  author: adityahimaone
  source: https://github.com/adityahimaone/sunnyside
  version: '1.0'
---

# Sunnyside print

**A cover is a print, not a picture.** Two artefacts in this site already prove it: the
generated sleeves for SeaPhantom P2P and Labgrownbeasts, and the Show & tell studies
(Sun Club, Peel Here, Type Tray, Spring study). Both are drawn — no photograph, no gradient
mesh, no stock texture — and both read as something that came off a press.

This skill turns that vocabulary into a command. It does not invent a new style: it
reproduces the two that shipped, and it keeps them in one place so they cannot drift apart.

## Two modes, one skill

| Mode | Output | Size | Use |
| --- | --- | --- | --- |
| **sleeve** | `.svg` (self-contained) | 320 × 200 (16:10) or 200 × 200 | A project cover when there is no artwork |
| **print** | `.html` → `.png` | 640 × 800 (4:5) | A Show & tell study card |

They are one skill because they are one vocabulary: the same field-and-ink pairs, the same
dot screen, the same mono rails, the same Syne shout, the same "one piece of evidence" rule.
Split into two skills they would duplicate the palette, the type stack and the QA list, and
the second one would drift the first time someone edited a hex. **Two commands, one source.**

Split them only if the prints grow their own token set (a second palette, a second display
face) — at that point they are two artefacts that happen to share a folder, not one system.

## Fast path

```bash
# 1 · a sleeve for a release with no artwork
node scripts/sleeve.mjs --title "SeaPhantom P2P" --index 3 \
  --variant orbit --field cobalt --out out/seaphantom-p2p.svg

# 2 · a study card
node scripts/print.mjs --template sheet --title "Peel Here" \
  --caption "Drawn in code" --out out/peel-here.html

# 3 · either one, to PNG at 2×
node scripts/render.mjs --in out/peel-here.html --out out/peel-here.png \
  --width 700 --height 860 --selector .frame
```

Then look at the PNG. Fix the one thing that is wrong (usually a node landing on a label, or
a ghost word one size too big) and re-render. Do not add a second idea.

`render.mjs` needs `@playwright/test`. It borrows the copy in the project it runs from, so run
it from the Sunnyside repo (or any project that has Playwright installed).

## The rules — the gate

A print that breaks one of these is not a Sunnyside print.

1. **One field, one ink, one evidence.** A solid ground, a text colour, and exactly one piece
   of evidence: an orbit, two petri cells, a disc, nine die-cuts, three curves. Two pieces of
   evidence means the card has no subject.
2. **The shout is one word.** Syne 800 at 20.5% of the width for a sleeve, 9% of the width for
   a poster. Four characters maximum. It is set tight (`-0.085em`) and low (baseline at 64%).
3. **Two labels, no more.** A mono catalog line top-left and a mono note bottom-left, both at
   ~2% of the width, both uppercase with `0.16em` tracking. The card does not need a third.
4. **Nothing overlaps a label.** The evidence may cross the shout — that is the composition —
   but a node, a cell or a disc never lands on the catalog line or the note. This is the single
   most common failure, and it is why the orbit is 0.52H with a 22° tilt and not 0.57H at 24°.
5. **Ink never sits on cobalt** (2.77:1). Paper-hi on cobalt is 5.93:1 and is the only text
   pair on that field. Tangerine on cobalt is 2.16:1 — graphics only, never a word.
6. **No image, no texture file, no shadow.** The dot screen is a repeating gradient. The card
   frame owns the shadow (`8px 9px 0`), and only on a print, never on a sleeve.
7. **The frame is chrome, not the artefact.** `--no-frame` gives the bare print so the app can
   wrap it in its own card. A PNG for the site is usually rendered framed; a PNG for a
   component is not.

## What is in the box

```
scripts/sleeve.mjs   sleeve generator → SVG (Syne embedded, so the shout keeps its width)
scripts/print.mjs    print generator → HTML (four templates, fonts by relative path)
scripts/render.mjs   HTML/SVG → PNG at 2× via Playwright
assets/syne.woff2    the display face (OFL), 34KB
assets/GeistMono.ttf the label face (OFL), 172KB
references/palette.md  tokens, measured contrast, type stack, voice
references/sleeve.md   the sleeve's geometry, the two variants, the derivation rules
references/print.md    the frame and the four templates
references/qa.md       the checklist to run before shipping
examples/contact-sheet.png  all six artefacts on one sheet
```

## Failure modes

- A sleeve with a photograph in it. Then it is a screenshot, and there is a different skill
  for that (`generate-project-covers`).
- A ghost word of five or six characters. It becomes a headline and the card becomes a poster
  with a caption. Four is the ceiling.
- A second ring, a third cell, a decorative line that means nothing. Evidence is an argument.
- Ink on cobalt, or tangerine used as a text colour.
- A print that fills the card edge to edge with type. The empty upper third of a poster is the
  poster.
- Rendering at 1× and calling it done. These are read at 348px wide in a grid; render at 2×
  and look at the downscale.

## Where it lives in the repo

| Artefact | Path |
| --- | --- |
| The sleeve as a component | `features/landing-page/studio/work-gallery/work-gallery.tsx` (`GeneratedCover`) |
| The sleeve's CSS | `features/landing-page/studio/work-gallery/work-gallery.module.css` (`--cobalt`, `--mint`) |
| The prints | `features/landing-page/studio/showcase.tsx` (`SunClubPrint`, `PeelPrint`, `TypePrint`, `SpringPrint`) |
| The print's CSS | `features/landing-page/studio/studio.module.css` (`--paper`, `--ink`, `--cobalt`…) |

If the site changes, change it there first and bring the number back here. This skill is a
copy of a living thing, and a copy that drifts is worse than no copy.
