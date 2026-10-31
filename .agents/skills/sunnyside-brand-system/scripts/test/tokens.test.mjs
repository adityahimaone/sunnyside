import assert from 'node:assert/strict'
import test from 'node:test'
import { findTokens, familyOf, readTokens } from '../lib/tokens.mjs'
import { put, tmp } from './helpers.mjs'

test('primitives[] shape', () => {
  const r = tmp()
  const f = put(r, 't.json', { meta: { name: 'A', namespace: '-aa-', idea: 'one' }, primitives: [{ name: 'ink', value: '#111', role: 'text' }] })
  const t = readTokens(f)
  assert.equal(t.shape, 'primitives[]')
  assert.equal(t.namespace, 'aa')
  assert.equal(t.idea, 'one')
  assert.deepEqual(t.primitives[0], { name: 'ink', value: '#111', hex: '#111', role: 'text' })
})

test('primitive{} shape keeps oklch as the value and the hex beside it (Ledger)', () => {
  const f = put(tmp(), 't.json', { name: 'L', primitive: { 'lg-a': { value: 'oklch(1 0 0)', hex: '#ffffff' } } })
  const p = readTokens(f).primitives[0]
  assert.equal(p.value, 'oklch(1 0 0)')
  assert.equal(p.hex, '#ffffff')
})

test('flat color{} shape (Clearing) and a non-hex value has no hex', () => {
  const f = put(tmp(), 't.json', { name: 'C', color: { bark: '#0E211C', haze: 'rgb(1 2 3 / 0.5)' } })
  const t = readTokens(f)
  assert.equal(t.shape, 'color{}')
  assert.equal(t.primitives[0].hex, '#0E211C')
  assert.equal(t.primitives[1].hex, null)
})

test('unknown shape returns empty lists, never throws', () => {
  const t = readTokens(put(tmp(), 't.json', { hello: 'world' }))
  assert.equal(t.shape, 'unknown')
  assert.deepEqual([t.primitives, t.contrast, t.type, t.radius, t.space], [[], [], [], [], []])
})

test('contrast accepts fg/bg, a/b, and pair as a label', () => {
  const t = readTokens(put(tmp(), 't.json', { contrast: [{ pair: 'p', fg: '#000', bg: '#fff', ratio: 21 }, { label: 'q', a: '#111', b: '#eee' }] }))
  assert.deepEqual(t.contrast[0], { label: 'p', fg: '#000', bg: '#fff', ratio: 21 })
  assert.deepEqual(t.contrast[1], { label: 'q', fg: '#111', bg: '#eee', ratio: null })
})

test('type: name/value, role/face, and an object of strings with weights', () => {
  const a = readTokens(put(tmp(), 'a.json', { type: [{ name: 'display', value: "var(--font-sora), 'Sora', sans-serif" }] }))
  assert.equal(a.type[0].family, 'Sora')
  const b = readTokens(put(tmp(), 'b.json', { type: [{ role: 'display', face: 'mono' }] }))
  assert.equal(b.type[0].name, 'display')
  assert.equal(b.type[0].family, 'mono')
  const c = readTokens(put(tmp(), 'c.json', { type: { display: 'Bodoni Moda 400/500', scale: { h1: '2rem' } } }))
  assert.deepEqual(c.type.map((x) => [x.name, x.family]), [['display', 'Bodoni Moda']])
  assert.equal(familyOf("system-ui, 'Geist'"), 'Geist')
})

test('radius and space: arrays of objects, arrays of numbers, objects of numbers', () => {
  const t = readTokens(put(tmp(), 't.json', { radius: [{ name: 'radius-sm', value: '6px' }], space: [4, 8], }))
  assert.deepEqual(t.radius, [{ name: 'sm', value: '6px' }])
  assert.deepEqual(t.space, [{ name: '1', value: '4px' }, { name: '2', value: '8px' }])
  assert.deepEqual(readTokens(put(tmp(), 'o.json', { radius: { xs: 6 } })).radius, [{ name: 'xs', value: '6px' }])
})

test('findTokens prefers features/, falls back to public/brand/, else null', () => {
  const r = tmp()
  assert.equal(findTokens(r, 'x'), null)
  const pub = put(r, 'public/brand/x/x-tokens.json', {})
  assert.equal(findTokens(r, 'x'), pub)
  const feat = put(r, 'features/x/tokens.json', {})
  assert.equal(findTokens(r, 'x'), feat)
})
