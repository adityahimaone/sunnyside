import type { CSSProperties } from 'react'

/**
 * The diorama is drawn in the reference's own pixel space: a 1024 × 572
 * capture whose wooden frame occupies x 105–918, y 80–547. Every coordinate in
 * the art and the overlay is a coordinate in that capture. Nothing is
 * re-measured: the SVG uses it as its viewBox, and the HTML overlay converts
 * the same numbers to percentages of the stage, so a change to one number moves
 * the drawing and the text that sits on it together.
 */
export const OX = 105
export const OY = 80
export const W = 813
export const H = 467
export const VIEWBOX = `${OX} ${OY} ${W} ${H}`

const pct = (n: number) => `${(n * 100).toFixed(3)}%`

/** Top-left anchored box, optionally sized. */
export function at(
  x: number,
  y: number,
  w?: number,
  h?: number,
): CSSProperties {
  return {
    left: pct((x - OX) / W),
    top: pct((y - OY) / H),
    ...(w === undefined ? null : { width: pct(w / W) }),
    ...(h === undefined ? null : { height: pct(h / H) }),
  }
}

/** Right-anchored: `x` is the right edge, so text that grows stays on its edge. */
export function atRight(x: number, y: number): CSSProperties {
  return { right: pct((OX + W - x) / W), top: pct((y - OY) / H) }
}

/** A length in the reference's pixels, scaled with the stage. */
export const u = (n: number) => `calc(var(--u) * ${n})`

/** Fill a CSS custom property for a size, so the stylesheet can use it too. */
export const vars = (record: Record<string, string | number>) =>
  record as unknown as CSSProperties

/* ── drawing helpers ─────────────────────────────────────────────────────── */

const f = (n: number) => Number(n.toFixed(2))

/** A gear outline: trapezoid teeth around a root circle. */
export function gearPath(
  cx: number,
  cy: number,
  outer: number,
  root: number,
  teeth: number,
) {
  const step = (Math.PI * 2) / teeth
  const points: string[] = []
  for (let i = 0; i < teeth; i += 1) {
    const a = i * step
    const spans: Array<[number, number]> = [
      [a - step * 0.3, root],
      [a - step * 0.17, outer],
      [a + step * 0.17, outer],
      [a + step * 0.3, root],
    ]
    for (const [angle, radius] of spans) {
      points.push(
        `${f(cx + Math.cos(angle) * radius)} ${f(cy + Math.sin(angle) * radius)}`,
      )
    }
  }
  return `M${points.join('L')}Z`
}

/** A many-pointed star: the sun's rays. */
export function starPath(
  cx: number,
  cy: number,
  outer: number,
  inner: number,
  points: number,
  rotate = 0,
) {
  const out: string[] = []
  for (let i = 0; i < points * 2; i += 1) {
    const a = (i * Math.PI) / points + (rotate * Math.PI) / 180 - Math.PI / 2
    const r = i % 2 === 0 ? outer : inner
    out.push(`${f(cx + Math.cos(a) * r)} ${f(cy + Math.sin(a) * r)}`)
  }
  return `M${out.join('L')}Z`
}

/** A wire spring standing on `y2` and reaching up to `y1`. */
export function coilPath(
  x: number,
  y1: number,
  y2: number,
  width = 8,
  turns = 5,
) {
  const h = (y2 - y1) / turns
  let d = `M${x - width / 2} ${f(y2)}`
  for (let i = 0; i < turns; i += 1) {
    const top = y2 - h * (i + 1)
    d += `C${x - width / 2} ${f(top + h * 0.7)} ${x + width / 2} ${f(top + h * 0.7)} ${x + width / 2} ${f(top + h * 0.5)}`
    d += `C${x + width / 2} ${f(top + h * 0.2)} ${x - width / 2} ${f(top + h * 0.3)} ${x - width / 2} ${f(top)}`
  }
  return d
}

/** Quarter-ellipse meridians over a dome of radius `r`. */
export function domeRibs(cx: number, baseY: number, r: number, count: number) {
  const paths: string[] = [`M${cx} ${baseY - r}V${baseY}`]
  for (let i = 1; i <= count; i += 1) {
    const d = (r / (count + 0.6)) * i
    paths.push(`M${cx} ${baseY - r}A${f(d)} ${r} 0 0 1 ${f(cx + d)} ${baseY}`)
    paths.push(`M${cx} ${baseY - r}A${f(d)} ${r} 0 0 0 ${f(cx - d)} ${baseY}`)
  }
  return paths
}
