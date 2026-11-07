/**
 * CVD (Color Vision Deficiency) & OKLab delta-E utilities.
 * Zero external dependencies.
 */

export function hexToRgb(hex) {
  const h = hex.replace('#', '')
  const f = h.length === 3 ? [...h].map((c) => c + c).join('') : h.slice(0, 6)
  return [0, 2, 4].map((i) => parseInt(f.slice(i, i + 2), 16) / 255)
}

export function rgbToOklab(r, g, b) {
  // sRGB to linear sRGB
  const rLin = r <= 0.04045 ? r / 12.92 : ((r + 0.055) / 1.055) ** 2.4
  const gLin = g <= 0.04045 ? g / 12.92 : ((g + 0.055) / 1.055) ** 2.4
  const bLin = b <= 0.04045 ? b / 12.92 : ((b + 0.055) / 1.055) ** 2.4

  // linear sRGB to LMS
  const l = 0.4122214708 * rLin + 0.5363325363 * gLin + 0.0514459929 * bLin
  const m = 0.2119034982 * rLin + 0.6806995451 * gLin + 0.1073969566 * bLin
  const s = 0.0883024619 * rLin + 0.2817188376 * gLin + 0.6299787005 * bLin

  const l_ = Math.cbrt(l)
  const m_ = Math.cbrt(m)
  const s_ = Math.cbrt(s)

  const L = 0.2104542553 * l_ + 0.7936177850 * m_ - 0.0040720468 * s_
  const a = 1.9779984951 * l_ - 2.4285922050 * m_ + 0.4505937099 * s_
  const bVal = 0.0259040371 * l_ + 0.7827717662 * m_ - 0.8086757660 * s_
  return [L, a, bVal]
}

export function hexToOklab(hex) {
  const [r, g, b] = hexToRgb(hex)
  return rgbToOklab(r, g, b)
}

export function oklchToOklab(str) {
  const m = String(str).match(/oklch\(\s*([\d.]+)(%?)\s+([\d.]+)\s+([-\d.]+|none)(?:deg)?/i)
  if (!m) return null
  const L = Number(m[1]) / (m[2] === '%' ? 100 : 1)
  const C = Number(m[3])
  if (C === 0 || m[4] === 'none') {
    return [L, 0.0, 0.0]
  }
  const H = (Number(m[4]) * Math.PI) / 180
  const a = C * Math.cos(H)
  const b = C * Math.sin(H)
  return [L, a, b]
}

export function parseColorToOklab(val) {
  if (typeof val !== 'string') return null
  const s = val.trim()
  if (/^#(?:[0-9a-f]{3}|[0-9a-f]{6}|[0-9a-f]{8})$/i.test(s)) return hexToOklab(s)
  if (/^oklch\(/i.test(s)) return oklchToOklab(s)
  return null
}

export function deltaEOk(lab1, lab2) {
  const dL = lab1[0] - lab2[0]
  const da = lab1[1] - lab2[1]
  const db = lab1[2] - lab2[2]
  return Math.sqrt(dL * dL + da * da + db * db)
}

/**
 * Deuteranopia projection in OKLab: collapses 'a' (red-green) axis
 */
export function simulateDeuteranopia(lab) {
  return [lab[0], 0.0, lab[2]]
}

/**
 * Protanopia projection in OKLab: collapses 'a' and adjusts L for L-cone loss
 */
export function simulateProtanopia(lab) {
  return [lab[0] - 0.12 * lab[1], 0.0, lab[2]]
}

/**
 * Tritanopia projection in OKLab: collapses 'b' (yellow-blue) axis
 */
export function simulateTritanopia(lab) {
  return [lab[0], lab[1], 0.0]
}

/**
 * Check delta-E under CVD simulation (Deuteranopia, Protanopia, Tritanopia).
 * Returns { pass: boolean, results: Array<{ label, dEDeut, dEProt, dETrit, minCvd, pass, hasNonColorIndicator }> }
 */
export function auditCvdSafety(colorPairs, threshold = 0.045) {
  const results = []
  let pass = true

  for (const pair of colorPairs) {
    const labA = parseColorToOklab(pair.colorA)
    const labB = parseColorToOklab(pair.colorB)
    if (!labA || !labB) continue

    const deutA = simulateDeuteranopia(labA)
    const deutB = simulateDeuteranopia(labB)
    const dEDeut = deltaEOk(deutA, deutB)

    const protA = simulateProtanopia(labA)
    const protB = simulateProtanopia(labB)
    const dEProt = deltaEOk(protA, protB)

    const tritA = simulateTritanopia(labA)
    const tritB = simulateTritanopia(labB)
    const dETrit = deltaEOk(tritA, tritB)

    const minCvd = Math.min(dEDeut, dEProt, dETrit)
    const pairPass = minCvd >= threshold || Boolean(pair.hasNonColorIndicator)
    if (!pairPass) pass = false

    results.push({
      label: pair.label || `${pair.colorA} vs ${pair.colorB}`,
      dEDeut,
      dEProt,
      dETrit,
      minCvd,
      pass: pairPass,
      hasNonColorIndicator: Boolean(pair.hasNonColorIndicator),
    })
  }

  return { pass, results }
}
