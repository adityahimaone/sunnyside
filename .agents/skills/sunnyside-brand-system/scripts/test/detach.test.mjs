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

test('multi-ramp archetype uses primaryAccent rather than colliding on every district ramp', () => {
  const r = tmp()
  const civic = put(r, 'civic.json', {
    meta: { name: 'Civic', namespace: 'cv', archetype: 'multi-ramp', primaryAccent: 'senja-100', oneSentence: 'A city of junctions and nine ramps.' },
    theme: { family: 'wayfinding', material: 'enamel', edge: '1px', offset: '0', stroke: '100' },
    primitives: [
      { name: 'kertas', value: '#F7F4EE' },
      { name: 'senja-100', value: '#F7481B', role: 'primary civic accent' },
      { name: 'daun-100', value: '#00A062', role: 'park district' },
    ],
    type: [{ name: 'display', value: 'Plus Jakarta Sans' }],
  })
  const greenBrand = put(r, 'green.json', {
    meta: { name: 'Green', namespace: 'gr', oneSentence: 'Forest canopy and moss.' },
    theme: { family: 'forest', material: 'moss', edge: '2px', offset: '4px', stroke: '2px' },
    primitives: [
      { name: 'paper', value: '#F2F4EE' },
      { name: 'signal', value: '#00A062', role: 'accent' },
    ],
    type: [{ name: 'display', value: 'Cinzel' }],
  })
  const res = JSON.parse(run('detach-check.mjs', ['--new', civic, '--ref', greenBrand, '--json']).out)
  assert.equal(res.results[0].hard.length, 0)
  assert.equal(res.results[0].parts.hue, 25)
})

test('init-system.mjs supports --archetype and --modules in --peek mode', () => {
  const r = tmp()
  const res = run('init-system.mjs', [
    '--slug', 'meridian',
    '--name', 'Meridian',
    '--hue', '210',
    '--archetype', 'multi-ramp',
    '--modules', 'forms,cast,apps',
    '--root', r,
    '--peek',
  ])
  assert.equal(res.code, 0)
  assert.match(res.out, /Meridian/)
})
