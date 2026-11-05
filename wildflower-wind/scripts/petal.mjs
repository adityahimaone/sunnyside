// The petal, drawn as a bent spine with a width profile.
//
// Narrow at the base, widest at 72% of its length, then a rounded tip — that is a
// petal. Let the width fall to zero and the same curve becomes a leaf, which is the
// wrong plant. The bend is what makes five of them a flower already in motion.

const n2 = (v) => Number(v.toFixed(2))

// quadratic spine: base at (0,0), tip at (bend*len, -len)
const spine = (t, len, bend) => {
  const u = 1 - t
  return [2 * u * t * 0 + t * t * bend * len, 2 * u * t * -0.5 * len + t * t * -len]
}

const tangent = (t, len, bend) => {
  const a = [2 * t * bend * len, -(1 - t) * len - t * len]
  const m = Math.hypot(a[0], a[1]) || 1
  return [a[0] / m, a[1] / m]
}

// 0 at the base, 1 at 72% of the length, 0.58 at the tip.
const width = (t) => (t <= 0.72 ? Math.sin((Math.PI / 2) * (t / 0.72)) : 1 - 0.42 * ((t - 0.72) / 0.28) ** 2)

export function curvedPetal(len, hw, bend, samples = 14) {
  const left = []
  const right = []
  for (let i = 0; i <= samples; i++) {
    const t = i / samples
    const [x, y] = spine(t, len, bend)
    const [tx, ty] = tangent(t, len, bend)
    const w = hw * width(t)
    left.push([x + ty * w, y - tx * w])
    right.push([x - ty * w, y + tx * w])
  }
  const [tipX, tipY] = spine(1, len, bend)
  const [ttx, tty] = tangent(1, len, bend)
  const cap = [tipX + ttx * len * 0.045, tipY + tty * len * 0.045]

  const pts = [...left]
  const d =
    pts.map((p, i) => `${i ? 'L' : 'M'}${n2(p[0])} ${n2(p[1])}`).join('') +
    `Q${n2(cap[0])} ${n2(cap[1])} ${n2(right[samples][0])} ${n2(right[samples][1])}` +
    right
      .slice(0, -1)
      .reverse()
      .map((p) => `L${n2(p[0])} ${n2(p[1])}`)
      .join('') +
    'Z'
  return d
}
