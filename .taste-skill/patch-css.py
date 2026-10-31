import re, pathlib

p = pathlib.Path('features/landing-page/studio/studio.module.css')
css = p.read_text()

def swap(css, start, end, new):
    i = css.index(start)
    j = css.index(end, i)
    return css[:i] + new + css[j:]

# ── 1. heroGrid → drafting desk shell ───────────────────────────────────────
desk = """.deskShell {
  display: grid;
  justify-items: start;
  gap: clamp(1.2rem, 3vw, 2rem);
}

.desk {
  position: relative;
  width: 100%;
}

.deskTilt {
  width: 100%;
}

/* The mat is the desk: 24px drafting grid, ink frame, hard shadow. */
.mat {
  --grid: 24px;

  position: relative;
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  gap: clamp(1rem, 2.2vw, 1.6rem);
  padding: clamp(1rem, 2.4vw, 1.85rem);
  padding-top: clamp(3.1rem, 5vw, 3.4rem);
  border: 2.5px solid var(--ink);
  border-radius: 26px;
  background-color: var(--paper-lo);
  background-image:
    linear-gradient(to right, rgb(25 26 46 / 0.085) 1px, transparent 1px),
    linear-gradient(to bottom, rgb(25 26 46 / 0.085) 1px, transparent 1px);
  background-size: var(--grid) var(--grid);
  box-shadow: 10px 12px 0 rgb(25 26 46 / 0.14);
}

@media (min-width: 1024px) {
  .mat {
    grid-template-columns: minmax(0, 1.2fr) minmax(0, 0.8fr);
    align-items: start;
  }
}

/* Coordinate scale along the mat's top edge. */
.matScale {
  position: absolute;
  inset-inline: 0;
  top: 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  height: 2.2rem;
  margin: 0;
  padding-inline: clamp(0.9rem, 2vw, 1.4rem);
  border-radius: 23px 23px 0 0;
  background: var(--ink);
  color: color-mix(in srgb, var(--paper-hi) 78%, transparent);
  font-family: var(--font-geist-mono), monospace;
  font-size: 8.5px;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  white-space: nowrap;
  overflow: hidden;
}

"""
css = swap(css, '.heroGrid {', '.nameTag {', desk)

# ── 2. heroStats → drawing spec table ──────────────────────────────────────
spec = """.specTable {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 1px;
  margin-top: clamp(1.5rem, 3vw, 2.1rem);
  padding-top: clamp(1rem, 2vw, 1.3rem);
  border-top: 1.5px solid var(--ink);
}

.specCell {
  padding-inline: 0.85rem;
  border-left: 1px dashed var(--line);
}

.specCell:first-child {
  padding-left: 0;
  border-left: 0;
}

.specCell dt {
  font-family: var(--font-geist-mono), monospace;
  font-size: 8.5px;
  line-height: 1.3;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--muted);
}

.specCell dd {
  margin: 0.3rem 0 0;
  font-family: var(--font-syne), var(--font-space-grotesk), sans-serif;
  font-size: clamp(1.35rem, 2.2vw, 1.85rem);
  font-weight: 800;
  line-height: 1;
  letter-spacing: -0.04em;
}

"""
css = swap(css, '.heroStats {', '.heroArt {', spec)

# ── 3. paper card + stickers → blueprint sheet + tool tray ──────────────────
sheet = """.sheet {
  position: relative;
  display: flex;
  flex-direction: column;
  padding: clamp(1.05rem, 2.3vw, 1.9rem);
  border: 2px solid var(--ink);
  border-radius: 18px;
  background: var(--paper-hi);
  box-shadow: 7px 8px 0 rgb(25 26 46 / 0.16);
  transform: rotate(-0.5deg);
  transform-origin: 50% 25%;
}

/* The blueprint's inset frame. */
.sheet::before {
  content: '';
  position: absolute;
  inset: 0.6rem;
  border: 1px dashed rgb(25 26 46 / 0.14);
  border-radius: 12px;
  pointer-events: none;
}

.sheetHead {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  padding-bottom: 0.85rem;
  border-bottom: 1.5px solid var(--ink);
}

.sheetBadge {
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
  padding: 0.24rem 0.55rem;
  border: 1.5px solid var(--ink);
  border-radius: 999px;
  background: var(--mint);
  color: var(--ink);
  font-family: var(--font-geist-mono), monospace;
  font-size: 8px;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  white-space: nowrap;
}

/* ── Tool tray: swatch fan, loupe, sticky note ───────────────────────────── */

.tools {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 0.9rem;
  min-height: 100%;
  padding-top: 0.4rem;
}

.swatchFan {
  position: relative;
  height: 8.6rem;
  margin-inline: auto;
  width: min(100%, 13rem);
}

.swatch {
  position: absolute;
  left: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  gap: 0.45rem;
  width: 100%;
  padding: 0.34rem 0.5rem;
  border: 1.5px solid var(--ink);
  border-radius: 5px;
  background: var(--paper-hi);
  color: var(--ink);
  text-align: left;
  transform-origin: 0 100%;
  transform: rotate(calc(var(--i) * 5.5deg));
  transition:
    transform 0.24s var(--ease-out),
    box-shadow 0.24s var(--ease-out);
}

.swatch[data-active] {
  box-shadow: 3px 3px 0 var(--ink);
  border-width: 2px;
}

.swatch:hover,
.swatch:focus-visible {
  transform: rotate(calc(var(--i) * 5.5deg)) translateY(-0.32rem);
}

.swatchChip {
  flex: none;
  width: 0.72rem;
  height: 0.72rem;
  border: 1px solid var(--ink);
  border-radius: 3px;
  background: var(--chip);
}

.swatchName {
  font-family: var(--font-geist-mono), monospace;
  font-size: 8.5px;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}

.loupe {
  position: absolute;
  z-index: 8;
  display: grid;
  place-items: center;
  align-content: center;
  gap: 0.1rem;
  width: clamp(5rem, 8.5vw, 6.4rem);
  aspect-ratio: 1;
  border: 2.5px solid var(--ink);
  border-radius: 50%;
  background: color-mix(in srgb, var(--paper-hi) 88%, transparent);
  box-shadow:
    inset 0 0 0 5px var(--desk-accent),
    4px 5px 0 rgb(25 26 46 / 0.18);
  transform: translate(-50%, -50%);
  pointer-events: none;
}

.loupeHex {
  font-family: var(--font-geist-mono), monospace;
  font-size: 9px;
  font-weight: 700;
  letter-spacing: 0.06em;
}

.loupeName {
  font-family: var(--font-geist-mono), monospace;
  font-size: 7.5px;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: var(--muted);
}

@media (hover: none) {
  .loupe {
    display: none;
  }
}

.sheetNote {
  position: relative;
  z-index: 7;
  margin-top: auto;
  padding: 0.7rem 0.78rem 0.65rem;
  border: 1.5px solid var(--ink);
  border-radius: 4px;
  background: var(--butter);
  color: var(--ink);
  box-shadow: 5px 6px 0 rgb(25 26 46 / 0.16);
  transform: rotate(-2.2deg);
  font-size: 0.72rem;
  line-height: 1.42;
}

.sheetNote b {
  display: block;
  margin-bottom: 0.25rem;
  font-family: var(--font-geist-mono), monospace;
  font-size: 8px;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  opacity: 0.6;
}

/* Masking tape, torn edges, pinning the sheet to the mat. */
.tape {
  position: absolute;
  z-index: 6;
  width: 4.6rem;
  height: 1.35rem;
  background: rgb(255 210 63 / 0.86);
  box-shadow: 0 1px 1px rgb(25 26 46 / 0.08);
  clip-path: polygon(2% 0, 100% 4%, 98% 100%, 0 94%);
}

.tapeTL {
  top: -0.5rem;
  left: 1.4rem;
  transform: rotate(-8deg);
}

.tapeTR {
  top: -0.5rem;
  right: 1.4rem;
  transform: rotate(7deg);
}

.tapeBL {
  bottom: -0.5rem;
  left: 2.6rem;
  transform: rotate(5deg);
}

"""
css = swap(css, '.heroArt {', '.heroSticker {', sheet)

p.write_text(css)
print('ok', len(css))
