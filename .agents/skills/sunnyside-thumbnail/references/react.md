# The in-app version

Use this when the sleeve has to be drawn by the app — a gallery tile, a card
that must parallax, anything that needs to scale with its container. The file
version (`scripts/make-sleeve.mjs`) is the same drawing; this one is live.

The original is `GeneratedCover` in
`features/landing-page/studio/work-gallery/work-gallery.tsx`. What follows is
that component generalised: two hardcoded variants became a `variant` prop, two
hardcoded colours became a palette, and the viewport-clamped padding became
container units so the card scales with its box instead of the window.

## Requirement

`cqw` units need a container. Put this on the card, not on the sleeve:

```css
.card { container-type: inline-size; }
```

Without it, `cqw` falls back to the small viewport and a 349 px tile gets
viewport-sized type — the word overflows and the labels look like headlines.

## Palette

```ts
export const SLEEVE_PALETTES = {
  cobalt: { ground: '#3d53d6', ink: '#fffaf1', accent: '#ff6a2b', glow: '#ffd23f' },
  mint: { ground: '#b7e4c7', ink: '#191a2e', accent: '#ff6a2b', glow: '#ffd23f' },
  ink: { ground: '#191a2e', ink: '#fffaf1', accent: '#ffd23f', glow: '#ffd23f' },
  paper: { ground: '#f3ecdf', ink: '#191a2e', accent: '#ff6a2b', glow: '#ff6a2b' },
  butter: { ground: '#ffd23f', ink: '#191a2e', accent: '#3d53d6', glow: '#ff6a2b' },
  pink: { ground: '#ffb6e1', ink: '#191a2e', accent: '#3d53d6', glow: '#ffd23f' },
  sky: { ground: '#a9c8ff', ink: '#191a2e', accent: '#ff6a2b', glow: '#ffd23f' },
  tangerine: { ground: '#ff6a2b', ink: '#191a2e', accent: '#3d53d6', glow: '#ffd23f' },
} as const

export type SleevePalette = keyof typeof SLEEVE_PALETTES
```

## Component

```tsx
import type { CSSProperties } from 'react'
import styles from './sleeve.module.css'

type Variant = 'orbit' | 'petri'

interface SleeveProps {
  /** The oversized word. 2–6 characters. */
  word: string
  /** Top-left catalogue line, e.g. "AH—005". */
  code?: string
  /** Bottom-left line. Uppercased for you. */
  note?: string
  variant?: Variant
  palette?: SleevePalette
  /** Keep the "/ GENERATED SLEEVE" tail. */
  suffix?: boolean
  className?: string
}

export function Sleeve({
  word,
  code,
  note,
  variant = 'orbit',
  palette = 'cobalt',
  suffix = true,
  className,
}: SleeveProps) {
  const p = SLEEVE_PALETTES[palette]
  const style = {
    '--sleeve-ground': p.ground,
    '--sleeve-ink': p.ink,
    '--sleeve-accent': p.accent,
    '--sleeve-glow': p.glow,
  } as CSSProperties

  return (
    <div
      className={[styles.sleeve, className].filter(Boolean).join(' ')}
      style={style}
      data-variant={variant}
      aria-hidden
    >
      <span className={styles.grid} />
      {code ? (
        <span className={styles.code}>
          {code}
          {suffix ? ' / generated sleeve' : ''}
        </span>
      ) : null}
      <span className={styles.ring} />
      {variant === 'petri' ? (
        <>
          <span className={styles.cell} data-size="lg" />
          <span className={styles.cell} data-size="sm" />
        </>
      ) : (
        <span className={styles.orbit} />
      )}
      <span className={styles.ghost}>{word.toUpperCase()}</span>
      {note ? <span className={styles.note}>{note}</span> : null}
    </div>
  )
}
```

The DOM order matters: grid, code, ring, ornament, word, note — the word is
painted after the ring so the arc never crosses the glyphs.

## Module CSS

```css
.sleeve {
  --pad: 5.5cqw;

  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: var(--pad);
  overflow: hidden;
  isolation: isolate;
  background: var(--sleeve-ground);
  color: var(--sleeve-ink);
}

.grid {
  position: absolute;
  inset: 0;
  z-index: -1;
  background-image: radial-gradient(currentColor 0.29cqw, transparent 0.29cqw);
  background-size: 2.58cqw 2.58cqw;
  opacity: 0.12;
  pointer-events: none;
}

.code,
.note {
  position: relative;
  z-index: 2;
  font-family: var(--font-geist-mono), ui-monospace, monospace;
  font-size: 2.15cqw;
  letter-spacing: 0.16em;
  line-height: 1;
  text-transform: uppercase;
  opacity: 0.78;
}

.note {
  margin-top: auto;
}

.ghost {
  position: relative;
  z-index: 2;
  margin-top: auto;
  font-family: var(--font-syne), var(--font-space-grotesk), system-ui, sans-serif;
  font-size: 22cqw;
  font-weight: 800;
  letter-spacing: -0.085em;
  line-height: 0.7;
}

.ring {
  position: absolute;
  right: -18%;
  bottom: -26%;
  width: 82%;
  aspect-ratio: 1;
  border: 0.57cqw solid currentColor;
  border-radius: 50%;
  opacity: 0.45;
}

/* ── orbit ─────────────────────────────────────────────────────────────── */

.orbit {
  position: absolute;
  z-index: 1;
  top: 57%;
  right: -6%;
  width: 82%;
  height: 0.57cqw;
  background: var(--sleeve-accent);
  transform: rotate(-24deg);
  opacity: 0.9;
}

.orbit::before,
.orbit::after {
  content: '';
  position: absolute;
  top: 50%;
  width: 2.5cqw;
  height: 2.5cqw;
  border: 0.43cqw solid currentColor;
  border-radius: 50%;
  background: var(--sleeve-ground);
  translate: -50% -50%;
}

.orbit::before { left: 0; }
.orbit::after  { left: 100%; }

/* ── petri ─────────────────────────────────────────────────────────────── */

.cell {
  position: absolute;
  z-index: 1;
  border: 0.43cqw solid currentColor;
  border-radius: 50%;
  background: radial-gradient(
    circle at 38% 34%,
    color-mix(in srgb, var(--sleeve-glow) 82%, transparent),
    transparent 62%
  );
  opacity: 0.75;
}

.cell[data-size='lg'] { top: 16%; right: 17%; width: 38%; aspect-ratio: 1; }
.cell[data-size='sm'] { top: 40%; right: 11%; width: 19%; aspect-ratio: 1; }
```

## Seeded choice

So a project without a palette always draws the same art, and the set stays
stable across builds:

```ts
function hashSeed(input: string): number {
  let hash = 0x811c9dc5
  for (let i = 0; i < input.length; i++) {
    hash ^= input.charCodeAt(i)
    hash = Math.imul(hash, 0x01000193)
  }
  return hash >>> 0
}

export function sleeveFor(slug: string) {
  const h = hashSeed(slug)
  const palettes = Object.keys(SLEEVE_PALETTES) as SleevePalette[]
  return {
    palette: palettes[h % palettes.length],
    variant: (['orbit', 'petri'] as const)[(h >>> 8) % 2],
  }
}
```

## Differences from the original

| original | here | why |
| --- | --- | --- |
| `padding: clamp(0.9rem, 1.8vw, 1.25rem)` | `5.5cqw` | the original sized the padding from the **viewport**, so a card in a narrow column got a margin meant for the window |
| `data-variant="petri"` swapped the whole ground to mint | `palette` prop | two hardcoded colours became eight |
| `background: var(--cobalt)` / `var(--mint)` | `--sleeve-ground` | same values, one code path |
| `--tangerine` for the orbit line | `--sleeve-accent` | the line and the glow need different roles |
| `color-mix(var(--butter) …)` in the cell | `var(--sleeve-glow)` | same value for cobalt and mint; keeps butter off a butter ground |

Nothing else changed. The geometry is identical, which is why the calibration
targets in `recipe.md` still apply.
