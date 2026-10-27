/**
 * Emit the deckle ridge used in the brand board's 05 / Tear panel.
 *
 *   node scripts/make-tear-path.mjs
 *
 * A torn sheet is not a sawtooth. It is mostly a straight-ish line with fibre
 * jitter, interrupted by a few deep bites where the pulp gave way. This
 * generates that: a seeded random walk at low amplitude, plus four notches.
 */
const mulberry32 = (seed) => () => {
  seed |= 0
  seed = (seed + 0x6d2b79f5) | 0
  let t = Math.imul(seed ^ (seed >>> 15), 1 | seed)
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296
}

const W = 300
const N = 46
const BASE = 38
const rnd = mulberry32(23)

// low-amplitude walk, clamped so the line stays near the base
const y = new Array(N).fill(BASE)
let drift = 0
for (let i = 0; i < N; i += 1) {
  drift += (rnd() - 0.5) * 3.4
  drift = Math.max(-7, Math.min(7, drift))
  y[i] = BASE + drift + (rnd() - 0.5) * 2.2
}

// four deep bites: one point plunges, its neighbours ease in and out
const bites = [7, 19, 29, 39]
for (const b of bites) {
  const depth = 17 + rnd() * 11
  y[b] = BASE + depth
  if (b - 1 >= 0) y[b - 1] = BASE + depth * 0.42
  if (b + 1 < N) y[b + 1] = BASE + depth * 0.55
  if (b - 2 >= 0) y[b - 2] = Math.min(y[b - 2], BASE + depth * 0.12)
}

const pts = []
for (let i = 0; i < N; i += 1) {
  const x = W - (i * W) / (N - 1)
  pts.push(`${x.toFixed(1)} ${y[i].toFixed(1)}`)
}

const d = `M0 0H${W}V${y[0].toFixed(1)}L${pts.slice(1).join('L')}Z`
console.log(d)
console.log(`\npoints=${N} bites=${bites.length} min=${Math.min(...y).toFixed(1)} max=${Math.max(...y).toFixed(1)}`)
