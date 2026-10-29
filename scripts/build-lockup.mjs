#!/usr/bin/env node
/**
 * Compose a horizontal lockup from an existing mark and an existing outlined
 * wordmark. Neither file is redrawn here: the mark keeps its own geometry and
 * the wordmark stays outlines, so the lockup can never contain live text.
 *
 *   node scripts/build-lockup.mjs \
 *     --mark public/brand/riso/mark.svg \
 *     --wordmark public/brand/riso/wordmark.svg \
 *     --out public/brand/riso/lockup.svg \
 *     --mark-size 56 --word-height 33 --gap 16 --ink currentColor
 *
 * The output viewBox is derived from the two boxes plus the gap, so changing
 * one number does not leave the other side floating.
 */
import { readFileSync, writeFileSync } from 'node:fs'

const args = process.argv.slice(2)
const flag = (name, fallback) => {
  const index = args.indexOf(`--${name}`)
  return index === -1 ? fallback : args[index + 1]
}

const markPath = flag('mark')
const wordPath = flag('wordmark')
const out = flag('out')
if (!markPath || !wordPath || !out) {
  console.error('Need --mark, --wordmark and --out.')
  process.exit(1)
}

const markSize = Number(flag('mark-size', 56))
const wordHeight = Number(flag('word-height', 33))
const gap = Number(flag('gap', 16))
const label = flag('label', '')
const ink = flag('ink', 'currentColor')

const inner = (file) => {
  const svg = readFileSync(file, 'utf8')
  const viewBox = svg.match(/viewBox="([^"]+)"/)?.[1]
  if (!viewBox) throw new Error(`${file} has no viewBox`)
  const body = svg
    .replace(/^[\s\S]*?<svg[^>]*>/, '')
    .replace(/<\/svg>[\s\S]*$/, '')
    .replace(/<title>[\s\S]*?<\/title>/g, '')
    // `currentColor` resolves to black inside an <img>, because the outer
    // document's colour never crosses into the SVG document. Bake the ink in
    // so a lockup file looks the same on any surface.
    .replace(/currentColor/g, ink)
  return { body, viewBox: viewBox.split(/[\s,]+/).map(Number) }
}

const mark = inner(markPath)
const word = inner(wordPath)

const markScale = markSize / Math.max(mark.viewBox[2], mark.viewBox[3])
const wordScale = wordHeight / word.viewBox[3]
const wordWidth = word.viewBox[2] * wordScale

const height = Math.max(markSize, wordHeight)
const width = markSize + gap + wordWidth
const wordY = (height - wordHeight) / 2

const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${round(width)} ${round(height)}" width="${round(width)}" height="${round(height)}" fill="${ink}" role="img" aria-label="${label}">
  <title>${label}</title>
  <!-- Mark and wordmark are both drawings; this file adds no new geometry.
       Rebuild with scripts/build-lockup.mjs, never by hand. -->
  <g transform="translate(${round((markSize - mark.viewBox[2] * markScale) / 2)} ${round((markSize - mark.viewBox[3] * markScale) / 2)}) scale(${round(markScale, 4)})">
${mark.body.trim()}
  </g>
  <g transform="translate(${round(markSize + gap)} ${round(wordY)}) scale(${round(wordScale, 4)})">
${word.body.trim()}
  </g>
</svg>
`

writeFileSync(out, svg)
console.log(`${out}  ${round(width)} × ${round(height)}`)

function round(value, digits = 2) {
  const factor = 10 ** digits
  return Math.round(value * factor) / factor
}
