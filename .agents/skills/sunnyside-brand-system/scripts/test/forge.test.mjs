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

test('field-forge generates all 10 SVG background fields + CSS helper from tokens.json', () => {
  const r = tmp()
  const tf = put(r, 'features/tidewater/tokens.json', sampleTokens)
  const outDir = join(r, 'public/brand/tidewater')
  const res = run('field-forge.mjs', ['--tokens', tf, '--recipe', 'all', '--out', outDir])
  assert.equal(res.code, 0, res.err || res.out)

  const allRecipes = ['mesh', 'bands', 'grain', 'dither', 'glass', 'grid', 'riso', 'bayer', 'scrim', 'anatomy']
  for (const recipe of allRecipes) {
    const svgPath = join(outDir, `field-${recipe}.svg`)
    assert.ok(existsSync(svgPath), `missing field-${recipe}.svg`)
    const content = readFileSync(svgPath, 'utf8')
    assert.match(content, /viewBox="0 0 1600 1000"/)
    if (recipe === 'scrim') {
      assert.match(content, /#f6f1e7/i)
    } else {
      assert.match(content, /#c84b28/i)
    }
  }

  const cssPath = join(outDir, 'tidewater-field.css')
  assert.ok(existsSync(cssPath), 'missing tidewater-field.css')
  const css = readFileSync(cssPath, 'utf8')
  assert.match(css, /\.fieldScrim/)
  assert.match(css, /\.photoDuotone/)
})

test('forge.mjs declarative pipeline executes single-pass from a brand.json spec', () => {
  const r = tmp()
  const specObj = {
    name: 'Tavola',
    slug: 'tavola',
    namespace: 'tv',
    polarity: 'light',
    synthesis: {
      surface: 'Paper & ink',
      essence: 'Coastal lunch',
      track: 'constructed',
    },
    primitives: [
      { name: 'ivory', value: '#FAF6EE', role: 'ground' },
      { name: 'terrace', value: '#F2ECE0', role: 'plate' },
      { name: 'espresso', value: '#221A15', role: 'ink' },
      { name: 'terracotta', value: '#D85A38', role: 'accent' },
    ],
    cast: [
      { id: 'arc', name: 'Arc', d: 'M12 44a20 20 0 0 1 40 0h-8a12 12 0 0 0-24 0h-8z' },
      { id: 'spark', name: 'Spark', d: 'M32 10l5 17 17 5-17 5-5 17-5-17-17-5 17-5 5-17z' },
      { id: 'slab', name: 'Slab', d: 'M10 40h44v8H10z' },
      { id: 'beam', name: 'Beam', d: 'M14 14l36 36-6 6L8 20z' },
      { id: 'keystone', name: 'Keystone', d: 'M32 12l18 20-18 20-18-20z' },
      { id: 'dish', name: 'Dish', d: 'M8 20h20v20H8zm28 0h20v20H36zm-14 24h20v16H22z' },
    ],
  }
  const specFile = put(r, 'brand/tavola.brand.json', specObj)
  const res = run('forge.mjs', ['--spec', specFile, '--root', r])
  assert.equal(res.code, 0, res.err || res.out)

  // Verify marks exist
  assert.ok(existsSync(join(r, 'public/brand/tavola/mark.svg')))
  assert.ok(existsSync(join(r, 'public/brand/tavola/mark-compact.svg')))
  assert.ok(existsSync(join(r, 'public/brand/tavola/wordmark.svg')))
  assert.ok(existsSync(join(r, 'public/brand/tavola/cast/arc.svg')))
  assert.ok(existsSync(join(r, 'public/brand/tavola/cast/dish.svg')))

  // Verify tokens & CSS
  assert.ok(existsSync(join(r, 'features/tavola/tokens.json')))
  assert.ok(existsSync(join(r, 'features/tavola/tavola-tokens.css')))
  const css = readFileSync(join(r, 'features/tavola/tavola-tokens.css'), 'utf8')
  assert.match(css, /--tv-ivory/)
  assert.match(css, /--tv-terracotta/)
  assert.match(css, /--tv-text-primary:\s*var\(--tv-espresso\)/)
  assert.match(css, /--tv-accent:\s*var\(--tv-terracotta\)/)
  // Polarity was single light -> no night block
  assert.ok(!css.includes('night'))
})
