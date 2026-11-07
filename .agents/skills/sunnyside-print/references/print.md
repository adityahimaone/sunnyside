# The print

A 4:5 artefact for the Show & tell track. Reference: the four studies in
`features/landing-page/studio/showcase.tsx` — Sun Club, Peel Here, Type Tray, Spring study.

## The frame

The card is the only chrome, and it is the same on every print:

```css
.frame {
  width: 640px; height: 800px;
  border: 2px solid var(--ink);
  border-radius: 18px;
  box-shadow: 8px 9px 0 rgb(25 26 46 / 0.12);
  overflow: hidden;
}
```

On the site the card also lifts on hover (`translateY(-7px) rotate(-1.2deg)`, shadow to
`12px 16px`). That is interaction, not the artefact — a PNG never carries it.

`--no-frame` drops the border and shadow, for a print that will be wrapped by something else.

## The four templates

### poster — `--template poster`

The Sun Club recipe: a loud field, a repeating conic ray burst from the lower right, a disc
with one word rotated inside it, a shout at the left, a barcode at the right.

- Field: cobalt (paper-hi text) or any other field from `--field`
- Rays: `repeating-conic-gradient(from 8deg, butter 0 7deg, transparent 7deg 14deg)`, right
  `-35%`, bottom `-28%`, width `115%`, opacity `.9`
- Disc: tangerine, right `-14%`, bottom `-8%`, width `74%`, `2px` ink border, word rotated
  `-12deg` in Syne 800
- Shout: `max-width: 7ch`, so a two-word title breaks into two lines
- Barcode: 18 bars, `2px` wide, every third `4px`, height `1rem`

Use for: a membership card, a club, a one-colour identity, anything that should feel like it
was posted on a wall.

### sheet — `--template sheet`

The Peel Here recipe: nine die-cut stickers on paper stock, each in its own dashed cell.

- Ground: paper-hi, ink text
- Grid: 3 × 3, gap `.4rem`, each cell `1px dashed rgb(25 26 46 / .35)`, radius `4px`
- Each mark: a solid shape in one palette colour with a **paper-hi halo behind it**
  (`paint-order: stroke`, `stroke-width: 7`). The halo is what makes it a die-cut and not an
  icon; without it the sheet reads as a line-icon set.
- Marks available: smiley, daisy, heart, bolt, burst, sun, sparkle
- Caption: `Drawn in code · cut, don't tear`

Use for: stickers, a component drawer, anything with nine of something.

### specimen — `--template specimen`

The Type Tray recipe: a butter ground, one enormous `Aa`, and three rows naming the faces.

- Ground: butter by default (`--field` to change)
- `Aa` at 28% of the card width, Syne 800, tracking −0.05em
- Rows: family name in Syne 700, role and weights in mono, `1px` rules between
- All free space goes above the `Aa`; the rows sit just above the footer

Use for: a type specimen, a token sheet, any "here are the parts" card.

### curve — `--template curve`

The Spring study recipe: a grid, three curves that arrive at the same point at three speeds,
and a label for each.

- Ground: paper-hi
- Grid: three horizontals, four verticals, `rgb(25 26 46 / .16)`
- Curves: cobalt, tangerine, mint at `2.4px`, all ending at `(236, 36)`
- End: two dots, cobalt under tangerine at `.5`, so the arrival reads as one point
- Foot: `soft`, `snap`, `loose`

Use for: motion, easing, a comparison of three of anything.

## Composition rules

1. **The top third is empty.** Every one of the four leaves the upper area open and puts the
   weight at the bottom. Filling it is the fastest way to make a print look like a slide.
2. **One piece of evidence.** Rays or a disc or nine cells or three curves — never two.
3. **The rails are 8px mono and never grow.** They are annotations on a print, not navigation.
4. **A print is not a card with a picture in it.** There is no image slot. If the artefact needs
   a photograph, it is a different skill.

## Rendering

```bash
node scripts/print.mjs --template poster --title "Sun Club" --out out/sun-club.html
node scripts/render.mjs --in out/sun-club.html --out out/sun-club.png \
  --width 700 --height 860 --selector .frame
```

The HTML body carries 30px of padding around the frame so the shadow is not clipped by the
viewport; the selector screenshots the frame alone, shadow included. At `--scale 2` the PNG is
1280 × 1600 and downsamples cleanly to the 320px card the site actually shows.
