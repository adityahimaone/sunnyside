// Six mark concepts for the Vesper bake-off, each drawn on the same 64-unit grid.
// One write, one grid: every coordinate is a multiple of 1 unit, and every
// concept uses at most four primitives so the comparison is about the idea,
// not about how much detail a drawing can carry.

export const GRID = 64
export const INK = '#0d1526'
export const CREAM = '#f4ebda'
export const COBALT = '#1b3fa2'

// ── 1 · Lodestar ────────────────────────────────────────────────────────────
// A four-point star that did not go back up: its lower point becomes the post,
// the post stands on a plinth. Star 46 wide, post 6, plinth 20.
const lodestar = [
  'M32 3 L35.6 22.4 L55 26 L35.6 29.6 L32 49 L28.4 29.6 L9 26 L28.4 22.4 Z',
  'M29 47 H35 V55 H29 Z',
  'M22 55 H42 V59 H22 Z',
]

// ── 2 · Horn ────────────────────────────────────────────────────────────────
// The crescent from the artwork, its lower horn continuing straight down into
// the post. Outer r 21, inner r 17 offset 7 — the gap is the light.
const horn = [
  'M40 5 A21 21 0 1 0 40 47 L40 41 A15 15 0 1 1 40 11 Z',
  'M37 44 H43 V55 H37 Z',
  'M24 55 H44 V59 H24 Z',
]

// ── 3 · Lantern ─────────────────────────────────────────────────────────────
// The lamp head as an object: finial, tapered glass, two feet, a plinth. The
// window is a counter-form, so the light is the paper showing through.
const lantern = [
  'M30 3 H34 V8 H30 Z',
  'M24 11 H40 L44 33 H20 Z',
  'M27 16 H37 L39 29 H25 Z',
  'M22 33 H27 V40 H22 Z M37 33 H42 V40 H37 Z',
  'M18 40 H46 V45 H18 Z',
]

// ── 4 · Horizon ─────────────────────────────────────────────────────────────
// A disc with its bottom cut away by the horizon, standing on the rule. The
// moon has already set; what is left is the line.
const horizon = [
  'M12 32 A20 20 0 0 1 52 32 Z',
  'M10 40 H54 V44 H10 Z',
  'M27 44 H37 V55 H27 Z',
  'M20 55 H44 V59 H20 Z',
]

// ── 5 · Ray ─────────────────────────────────────────────────────────────────
// Five tapered rays leaving one point, the middle one continuing into the post.
// The fan is 96° wide; every ray is 3 units at the base, 0 at the tip.
const ray = [
  'M30 30 L12 10 L16 8 L32 28 Z',
  'M32 28 L26 6 L30 5 L33 27 Z',
  'M32 28 L32 2 L36 2 L34 28 Z',
  'M33 27 L38 5 L42 6 L35 28 Z',
  'M32 28 L48 8 L52 10 L34 30 Z',
  'M29 30 H35 V55 H29 Z',
  'M22 55 H42 V59 H22 Z',
]

// ── 6 · Rung ────────────────────────────────────────────────────────────────
// The ladder in the artwork, in perspective: six rungs converging on a horizon
// that is only a line. The narrowest rung is 6 units, the widest 40.
const rung = [
  'M29 4 H35 L40 58 H24 Z',
  'M30 12 H34 V15 H30 Z',
  'M29.4 22 H36.6 V25 H29.4 Z',
  'M28.6 33 H37.4 V36 H28.6 Z',
  'M27.6 44 H38.4 V47 H27.6 Z',
  'M26.4 55 H39.6 V58 H26.4 Z',
]

export const concepts = [
  {
    id: 'lodestar',
    name: 'Lodestar',
    line: 'The star that stayed.',
    why: 'One object, two readings: a four-point star at speed, a lamppost at rest. The lower point is the post — nothing is added to the star, something is taken from it.',
    risk: 'A four-point star is the most-used mark shape of the decade; only the post separates it from the sparkle.',
    paths: lodestar,
    primitives: 3,
  },
  {
    id: 'horn',
    name: 'Horn',
    line: 'The moon, standing.',
    why: 'The crescent and the post are the two silhouettes already in the artwork. The gap between horn and post is the light, not a colour.',
    risk: 'At 16px the crescent closes up and reads as a hook or a digit.',
    paths: horn,
    primitives: 3,
  },
  {
    id: 'lantern',
    name: 'Lantern',
    line: 'The head, not the light.',
    why: 'The only concept that draws the lamp itself. The window is a counter-form, so the mark works in one ink on any stock.',
    risk: 'Five primitives is one more than the track allows; the feet vanish below 24px.',
    paths: lantern,
    primitives: 5,
  },
  {
    id: 'horizon',
    name: 'Horizon',
    line: 'The line that is left.',
    why: 'The strongest horizontal in the artwork, reduced to a half disc on a rule. Reads as a setting sun and as an underline.',
    risk: 'Says evening, not lamp. It could belong to any sunset brand.',
    paths: horizon,
    primitives: 4,
  },
  {
    id: 'ray',
    name: 'Ray',
    line: 'Light, before the object.',
    why: 'The stipple fan in the sky, drawn as five tapered rays. It is the only concept that keeps the artwork’s direction of travel.',
    risk: 'Seven primitives; at 16px the outer rays merge into a wedge.',
    paths: ray,
    primitives: 7,
  },
  {
    id: 'rung',
    name: 'Rung',
    line: 'The way there.',
    why: 'The ladder is the one object in the artwork that implies a next step, which is what a design system is for.',
    risk: 'Six rungs is a diagram, not a mark; it disappears at 24px and cannot be reversed on cream.',
    paths: rung,
    primitives: 6,
  },
]

export const svg = (paths, { size = 64, fill = INK, bg = null, pad = 0 } = {}) => {
  const body = paths.map((d) => `<path d="${d}"/>`).join('')
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${GRID} ${GRID}" width="${size}" height="${size}" role="img">${
    bg ? `<rect width="${GRID}" height="${GRID}" fill="${bg}"/>` : ''
  }<g fill="${fill}" fill-rule="evenodd">${body}</g></svg>`
}
