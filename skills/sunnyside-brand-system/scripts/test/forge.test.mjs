import assert from 'node:assert/strict'
import { existsSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import test from 'node:test'

import { put, run, tmp } from './helpers.mjs'

const sampleTokens = {
  meta: {
    name: 'Tidewater',
    slug: 'tidewater',
    namespace: '--tw-',
    track: 'constructed',
    essence: 'Warm clay and harbor light.',
  },
  theme: {
    edge: 'none',
    offset: 0,
    stroke: 0,
    tile: 'none',
    radius: 8,
    ring: 'offset',
    density: 'cosy',
    label: 'sentence',
  },
  primitives: [
    { name: 'ground', value: '#f6f1e7', role: 'Page ground' },
    { name: 'plate', value: '#fffdf9', role: 'Reading plate' },
    { name: 'ink', value: '#181c24', role: 'Primary ink' },
    { name: 'muted', value: '#586070', role: 'Metadata' },
    { name: 'wash', value: '#e6dfd1', role: 'Surface wash' },
    { name: 'signal', value: '#c84b28', role: 'One accent' },
  ],
}

test('brand-forge generates full 12-SVG family + outlined wordmark directly from tokens.json', () => {
  const r = tmp()
  const tf = put(r, 'features/tidewater/tokens.json', sampleTokens)
  const outDir = join(r, 'public/brand/tidewater')
  const res = run('brand-forge.mjs', ['--tokens', tf, '--concept', 'junction', '--out', outDir])
  assert.equal(res.code, 0, res.err || res.out)

  const expectedSvgs = [
    'mark.svg',
    'mark-compact.svg',
    'mark-compact-reverse.svg',
    'glyph.svg',
    'mark-reverse.svg',
    'mark-mono.svg',
    'icon.svg',
    'wordmark.svg',
    'wordmark-reverse.svg',
    'lockup.svg',
    'lockup-reverse.svg',
    'lockup-stacked.svg',
    'lockup-stacked-reverse.svg',
  ]

  for (const file of expectedSvgs) {
    const full = join(outDir, file)
    assert.ok(existsSync(full), `missing ${file}`)
    const svg = readFileSync(full, 'utf8')
    assert.ok(!/<text[\s>]/.test(svg), `${file} contains live <text>`)
    assert.ok(/viewBox=/.test(svg), `${file} missing viewBox`)
  }

  // Verify compact mark sits on the 64x64 grid (contains coordinates > 32, not shrunk into 0..32)
  const compactSvg = readFileSync(join(outDir, 'mark-compact.svg'), 'utf8')
  assert.match(compactSvg, /viewBox="0 0 64 64"/)
  assert.match(compactSvg, /56/)
})

test('brand-forge supports all new constructed & drawn archetypes cleanly', () => {
  const r = tmp()
  const tf = put(r, 'features/tidewater/tokens.json', sampleTokens)
  for (const concept of ['bracket', 'ribbon', 'junction', 'carved', 'cells', 'tear', 'portal', 'archmono', 'crest']) {
    const outDir = join(r, 'out', concept)
    const res = run('brand-forge.mjs', ['--tokens', tf, '--concept', concept, '--out', outDir])
    assert.equal(res.code, 0, `${concept} failed: ${res.err || res.out}`)
  }
})

test('field-forge generates all 6 SVG background fields + CSS helper from tokens.json', () => {
  const r = tmp()
  const tf = put(r, 'features/tidewater/tokens.json', sampleTokens)
  const outDir = join(r, 'public/brand/tidewater')
  const res = run('field-forge.mjs', ['--tokens', tf, '--recipe', 'all', '--out', outDir])
  assert.equal(res.code, 0, res.err || res.out)

  for (const recipe of ['mesh', 'bands', 'grain', 'dither', 'glass', 'grid']) {
    const svgPath = join(outDir, `field-${recipe}.svg`)
    assert.ok(existsSync(svgPath), `missing field-${recipe}.svg`)
    const content = readFileSync(svgPath, 'utf8')
    assert.match(content, /viewBox="0 0 1600 1000"/)
    assert.match(content, /#c84b28/i)
  }

  const cssPath = join(outDir, 'tidewater-field.css')
  assert.ok(existsSync(cssPath), 'missing tidewater-field.css')
  const css = readFileSync(cssPath, 'utf8')
  assert.match(css, /\.fieldScrim/)
  assert.match(css, /\.photoDuotone/)
})
