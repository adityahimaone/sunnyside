# The checklist

Run this before a sleeve or a print leaves the machine. It takes a minute; every item on it is
something that has shipped wrong before.

## Both

- [ ] **Rendered at 2×, then looked at the downscale.** These are read at ~348px wide in a
      grid. A 2× PNG shrunk to 348 is what a person sees; the 2× PNG is not.
- [ ] **Nothing overlaps a label.** The evidence may cross the shout — that is the composition
      — but no node, cell, disc or sticker touches the catalog line, the note or the caption.
- [ ] **One field, one ink, one evidence.** Count them out loud. Two evidences means the card
      has no subject.
- [ ] **The shout is 4 characters or fewer** and it is the right 4. `Sun Club` is `SUN`.
- [ ] **Contrast measured, not guessed.** On cobalt: paper-hi (5.93:1) only. Ink on cobalt
      (2.77:1) and tangerine on cobalt (2.16:1) are failures, not choices.
- [ ] **No image, no texture, no shadow** except the card frame's `8px 9px 0`.
- [ ] **The labels say something a printer would write.** A catalog number, a stock, a date.
      Not a benefit.

## Sleeve

- [ ] The ring is cropped by two edges; nothing else is cropped.
- [ ] The orbit clears both labels (0.52H, −22°). If it does not, the angle is wrong before
      the position is.
- [ ] The shout reaches ~75% of the width. At 90% it is a size too large, not a word too long.
- [ ] `--variant` matches the subject: orbit for anything networked, petri for anything grown.
- [ ] The SVG opens with the display face intact (Syne is embedded; check the file size is
      ~48KB — a 3KB file means the font was not found).
- [ ] The component in the site still falls back correctly: a project with a `cover` shows the
      image, not the sleeve.

## Print

- [ ] The top third is still empty.
- [ ] The frame's border, radius and shadow are untouched (2px / 18px / `8px 9px 0`).
- [ ] Rails are 8px mono. They have not grown into navigation.
- [ ] The template matches the content: poster for a loud identity, sheet for nine of
      something, specimen for parts, curve for a comparison of three.
- [ ] Stickers carry the paper halo (`paint-order: stroke`). Without it the sheet reads as
      icons.
- [ ] `--no-frame` was used if something else provides the frame.

## The one thing

After the checklist, name the single thing that is wrong. Fix that. Do not fix three things
and do not add a fourth element to balance the second one.
