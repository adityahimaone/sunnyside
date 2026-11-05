import assert from 'node:assert/strict'
import test from 'node:test'
import vm from 'node:vm'
import {
  checksum, CHECKSUM_JS, captureInput, finalizeManifest, readSystem,
  buildSystemSpec, makeDsId, SHEET_INDEX, CAPTURE_VIEWPORT, MANIFEST_KIND,
} from '../lib/canonical.mjs'

const fonts = { display: 'Archivo', reading: 'Inter', mono: 'DM Mono' }
const base = {
  slug: 'mullion', brandName: 'Mullion', version: 'v1.0', ns: 'mu', fonts,
  primitives: [
    { name: 'ink', hex: '#101820', token: '--mu-ink', role: 'text', lum: 0.02 },
    { name: 'paper', hex: '#F7F5F0', token: '--mu-paper', role: 'surface', lum: 0.9 },
  ],
  scales: { Primary: [{ name: 'Primary-10', hex: '#EEF2FF' }, { name: 'Primary-70', hex: '#2960EC' }] },
  parsed: { type: [], space: [], radius: [] },
  cssText: '', houseRadius: '8px',
  spacingTokens: [
    { name: 'space-1', px: '4px' }, { name: 'space-2', px: '8px' },
    { name: 'space-4', px: '16px' }, { name: 'space-8', px: '32px' },
  ],
  primaryHex: '#2960EC', primaryTint: '#EEF2FF', secondaryTint: '#F5F0FF', tertiaryTint: '#ECFDF5',
}

test('canonical sheet index has 8 sheets and only 08 is optional', () => {
  assert.equal(SHEET_INDEX.length, 8)
  assert.equal(SHEET_INDEX[7].name, 'patterns')
  assert.equal(SHEET_INDEX[7].optional, true)
  assert.ok(SHEET_INDEX.slice(0, 7).every((s) => !s.optional))
  assert.equal(CAPTURE_VIEWPORT, 1440)
})

test('a tokens.json with only meta/primitives still yields a complete system', () => {
  const s = buildSystemSpec(base)
  assert.equal(s.dsId, makeDsId('mullion', 'v1.0'))
  /* Two primitives + two ramp steps + the 23 declared semantic surfaces. A
   * real sheet has three 10-step ramps, so the shipped count is 60–90. */
  assert.ok(s.colours.length >= 24, `expected a full colour library, got ${s.colours.length}`)
  assert.ok(s.type.length >= 10, `expected canonical type roles, got ${s.type.length}`)
  assert.equal(s.space.length, 4)
  assert.ok(s.radius.length >= 4)
  assert.equal(s.effects.length, 3)
  assert.equal(s.components.length, 7, 'Button, Badge, Input, Modal, Cast Mark, System Icon, Spot Illustration')
  assert.ok(s.components.some((c) => c.name === 'System Icon'))
  assert.equal(s.sheets.length, 8)
  assert.deepEqual(s.fonts, fonts)
  assert.ok(s.colours.some((c) => c.group === 'Semantic'))
  assert.ok(s.colours.some((c) => c.group === 'Scale'))
  assert.ok(s.colours.some((c) => c.hex === '#E11D48'), 'sheet literal danger colour must be declared')
})

test('CSS custom properties are folded into the colour library', () => {
  const s = buildSystemSpec({ ...base, cssText: ':root { --mu-accent: #123456; --mu-alias: var(--mu-accent); }' })
  assert.ok(s.colours.some((c) => c.name === 'css-mu-accent' && c.hex === '#123456'))
  assert.ok(s.colours.some((c) => c.name === 'css-mu-alias' && c.hex === '#123456'))
})

test('token-file values win over canonical fallbacks', () => {
  const s = buildSystemSpec({
    ...base,
    parsed: {
      type: [{ name: 'Hero', family: 'Fraunces', size: 64, weight: 700 }],
      space: [{ name: 'gap', value: '20px' }],
      radius: [{ name: 'card', value: '12px' }],
    },
  })
  assert.equal(s.space.length, 1)
  assert.equal(s.space[0].value, '20px')
  assert.equal(s.radius.length, 1)
  assert.equal(s.radius[0].value, '12px')
  assert.ok(s.type.some((t) => t.name === 'Hero' && t.size === 64))
  assert.ok(s.type.some((t) => t.name === 'Body Regular'), 'canonical roles are still present')
})

test('Node checksum and the injected browser copy are the same algorithm', () => {
  const ctx = vm.createContext({ Math, String })
  vm.runInContext(CHECKSUM_JS, ctx)
  for (const s of ['', 'hello', 'sunnyside/figma-manifest', JSON.stringify(base), '🎨 · 1440px']) {
    assert.equal(vm.runInContext(`figmaChecksum(${JSON.stringify(s)})`, ctx), checksum(s))
  }
  assert.equal(checksum('hello'), checksum('hello'))
  assert.notEqual(checksum('hello'), checksum('hellp'))
})

test('finalizeManifest signs the envelope deterministically and ignores source', () => {
  const m = {
    version: 2, slug: 'mullion', brand: 'Mullion',
    capture: { viewport: 1440, sheets: 8, mode: 'canonical-v2', generator: '5.0.0' },
    system: buildSystemSpec(base), tokens: { brand: 'Mullion' },
    sheets: [{ name: 'colors', node: { id: 'n1' } }], nodes: 1,
    source: 'file:///one/place.html',
  }
  const a = finalizeManifest(structuredClone(m))
  const b = finalizeManifest({ ...structuredClone(m), source: 'file:///another/place.html' })
  assert.equal(a.capture.checksum, b.capture.checksum)
  assert.equal(a.kind, MANIFEST_KIND)
  assert.equal(a.dsId, makeDsId('mullion', 'v1.0'))
  assert.equal(a.capture.checksum, checksum(captureInput(a)))
  const changed = finalizeManifest({ ...structuredClone(m), nodes: 2 })
  assert.notEqual(changed.capture.checksum, a.capture.checksum)
  assert.equal(a.capture.checksum.length, 8)
})

test('v1 token-only manifests upgrade to the system shape', () => {
  const s = readSystem({
    kind: MANIFEST_KIND, brand: 'Old',
    tokens: {
      brand: 'Old', palette: [{ name: 'ink', hex: '#101820' }],
      type: [{ name: 'display', family: 'Inter', size: 48 }],
      space: [{ name: 's1', value: '4px' }], radius: [],
    },
  })
  assert.equal(s.colours.length, 1)
  assert.equal(s.colours[0].hex, '#101820')
  assert.equal(s.type.length, 1)
  assert.equal(s.sheets.length, 8)
  assert.deepEqual(s.effects, [])
})
