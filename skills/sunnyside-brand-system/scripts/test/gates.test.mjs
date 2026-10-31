import assert from 'node:assert/strict'
import test from 'node:test'
import { gates, goodCase, put, tmp } from './helpers.mjs'

test('a sound case passes every gate that can run, and exits 0', () => {
  const r = tmp()
  goodCase(r)
  const g = gates(r, 'x')
  assert.equal(g.status('palette'), 'PASS')
  assert.equal(g.status('contrast'), 'PASS')
  assert.equal(g.status('font'), 'PASS')
  assert.equal(g.status('detach'), 'SKIP') // no siblings is a skip with a reason, not a pass
  assert.equal(g.code, 0)
})

test('palette: a one-digit hex drift fails', () => {
  const r = tmp()
  goodCase(r, 'x', { css: ':root{--xx-ink:#111112;--xx-paper:#f5f0e6;--xx-glow:#d9ff43;}' })
  const g = gates(r, 'x')
  assert.equal(g.status('palette'), 'FAIL')
  assert.match(g.row('palette').detail, /ink/)
  assert.equal(g.code, 1)
})

test('palette: a primitive the CSS never declares fails', () => {
  const r = tmp()
  goodCase(r, 'x', { css: ':root{--xx-ink:#111111;--xx-paper:#f5f0e6;}' })
  assert.match(gates(r, 'x').row('palette').detail, /glow is in tokens.json but not declared/)
})

test('palette: oklch values compare by number, and drift fails (primitive{} shape)', () => {
  const ok = tmp()
  put(ok, 'features/x/tokens.json', { name: 'X', primitive: { 'xx-a': { value: 'oklch(0.834 0.056 268.2)', hex: '#b9c8ee' } }, contrast: [{ fg: '#000', bg: '#fff', ratio: 21 }, { fg: '#777', bg: '#888' }] })
  put(ok, 'features/x/x-tokens.css', ':root{--xx-a: oklch(0.834 0.056 268.2);}')
  assert.equal(gates(ok, 'x').status('palette'), 'PASS')
  const bad = tmp()
  put(bad, 'features/x/tokens.json', { name: 'X', primitive: { 'xx-a': { value: 'oklch(0.834 0.056 268.2)', hex: '#b9c8ee' } } })
  put(bad, 'features/x/x-tokens.css', ':root{--xx-a: oklch(0.834 0.056 270.2);}')
  assert.equal(gates(bad, 'x').status('palette'), 'FAIL')
})

test('palette: percentage and decimal lightness are the same colour', () => {
  const r = tmp()
  put(r, 'features/x/tokens.json', { meta: { name: 'X', namespace: 'xx' }, primitives: [{ name: 'paper', value: 'oklch(62% 0.19 260)' }] })
  put(r, 'features/x/x-tokens.css', ':root{--xx-paper: oklch(0.62 0.19 260);}')
  assert.equal(gates(r, 'x').status('palette'), 'PASS')
})

test('palette: an alpha channel in the CSS is not the same as an opaque token', () => {
  const r = tmp()
  put(r, 'features/x/tokens.json', { meta: { name: 'X', namespace: 'xx' }, primitives: [{ name: 'ink', value: 'oklch(0.62 0.19 260)' }] })
  put(r, 'features/x/x-tokens.css', ':root{--xx-ink: oklch(0.62 0.19 260 / 0.5);}')
  assert.equal(gates(r, 'x').status('palette'), 'FAIL')
})

test('a case folder without tokens.json fails; it is not skipped', () => {
  const r = tmp()
  put(r, 'features/x/x-tokens.css', ':root{}')
  const g = gates(r, 'x')
  assert.equal(g.status('detach'), 'FAIL')
  assert.equal(g.status('palette'), 'FAIL')
  assert.equal(g.status('contrast'), 'FAIL')
  assert.equal(g.code, 1)
})

test('tokens kept under public/brand/<slug>/ are found (Huginn, Clearing)', () => {
  const r = tmp()
  put(r, 'public/brand/x/x-tokens.json', { $meta: { name: 'X' }, primitives: [{ name: 'ink', value: '#111111' }], contrast: [{ label: 'a', a: '#111111', b: '#ffffff', ratio: 18.9 }, { label: 'b', a: '#aaaaaa', b: '#ffffff', ratio: 2.3 }] })
  put(r, 'public/brand/x/x-tokens.css', ':root{--ink:#111111;}')
  const g = gates(r, 'x')
  assert.equal(g.status('contrast'), 'PASS')
  assert.equal(g.status('palette'), 'PASS')
})

test('contrast: a palette that publishes only passes fails', () => {
  const r = tmp()
  goodCase(r, 'x', { tokens: { contrast: [{ label: 'a', fg: '#111111', bg: '#f5f0e6', ratio: 16.63 }] } })
  assert.match(gates(r, 'x').row('contrast').detail, /no failing pair/)
})

test('contrast: a stated ratio that was estimated, not computed, fails', () => {
  const r = tmp()
  goodCase(r, 'x', { tokens: { contrast: [{ label: 'a', fg: '#111111', bg: '#f5f0e6', ratio: 12 }, { label: 'b', fg: '#d9ff43', bg: '#f5f0e6', ratio: 1.01 }] } })
  const d = gates(r, 'x').row('contrast')
  assert.equal(d.status, 'FAIL')
  assert.match(d.detail, /stated 12, computed/)
})

test('font: a --font-* alias no layout declares fails; declaring it passes', () => {
  const r = tmp()
  goodCase(r, 'x', { css: ':root{--xx-ink:#111111;--xx-paper:#f5f0e6;--xx-glow:#d9ff43;--xx-display:var(--font-zed);}' })
  put(r, 'app/layout.tsx', "const a = Sora({ variable: '--font-sora' })")
  assert.equal(gates(r, 'x').status('font'), 'FAIL')
  put(r, 'app/layout.tsx', "const z = Zed({ variable: '--font-zed' })")
  assert.equal(gates(r, 'x').status('font'), 'PASS')
})

test('a typo in the slug runs nothing and exits 1', () => {
  const r = tmp()
  goodCase(r)
  const g = gates(r, 'nope')
  assert.ok(g.rows.every((x) => x.status === 'SKIP'))
  assert.equal(g.code, 1)
})
