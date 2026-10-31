import assert from 'node:assert/strict'
import test from 'node:test'
import { put, run, tmp } from './helpers.mjs'

const base = (name, ns, type) => ({
  meta: { name, namespace: ns, oneSentence: `${name} is a thing` },
  theme: { family: 'a', material: 'm', edge: 'e', offset: 'o', stroke: 's' },
  primitives: [{ name: 'ink', value: '#111111' }, { name: 'paper', value: '#f5f0e6' }, { name: 'accent', value: '#d9ff43' }],
  type,
})

test('the display face is read from name/value AND role/face shapes', () => {
  const r = tmp()
  const a = put(r, 'a.json', base('A', 'aa', [{ name: 'display', value: 'Sora' }]))
  const b = put(r, 'b.json', base('B', 'bb', [{ role: 'display', face: 'Sora' }]))
  const res = JSON.parse(run('detach-check.mjs', ['--new', a, '--ref', b, '--json']).out)
  // Before the fix the role/face file read as an empty placeholder and H3 never fired.
  assert.ok(res.results[0].hard.some((h) => h.startsWith('H3')), JSON.stringify(res.results[0].hard))
})

test('an external reference is scored on hue, value and type only', () => {
  const r = tmp()
  const a = put(r, 'a.json', base('A', 'aa', [{ name: 'display', value: 'Sora' }]))
  const ext = put(r, 'ext.json', { _external: true, meta: { name: 'Out', namespace: 'ref-out' }, color: { ink: '#0a2540', paper: '#ffffff', accent: '#635bff' }, type: { display: 'Camphor' } })
  const res = JSON.parse(run('detach-check.mjs', ['--new', a, '--ref', ext, '--json']).out)
  const p = res.results[0].parts
  assert.deepEqual([p.material, p.geometry, p.structure, p.copy], [0, 0, 0, 0])
  assert.ok(res.results[0].score <= 100)
})
