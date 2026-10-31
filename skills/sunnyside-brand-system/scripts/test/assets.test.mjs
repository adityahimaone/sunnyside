import assert from 'node:assert/strict'
import test from 'node:test'
import { put, run, tmp } from './helpers.mjs'

const entry = (o) => ({ file: 'a.jpg', source: 'openverse', id: '1', license: 'CC0 1.0', attributionRequired: false, attribution: null, ...o })

function dirWith(files, credits) {
  const r = tmp()
  for (const f of files) put(r, `assets/${f}`, 'x')
  put(r, 'assets/credits.json', credits)
  return `${r}/assets`
}

test('credits: every file recorded with a usable licence passes', () => {
  assert.equal(run('assets.mjs', ['credits', '--dir', dirWith(['a.jpg'], [entry({})])]).code, 0)
})

test('credits: a file with no record fails', () => {
  const r = run('assets.mjs', ['credits', '--dir', dirWith(['a.jpg', 'stray.jpg'], [entry({})])])
  assert.equal(r.code, 1)
  assert.match(r.out, /FAIL stray.jpg/)
})

test('credits: an unknown licence fails', () => {
  assert.equal(run('assets.mjs', ['credits', '--dir', dirWith(['a.jpg'], [entry({ license: 'unknown — check the icon set' })])]).code, 1)
})

test('credits: a licence that needs credit but has none written fails', () => {
  assert.equal(run('assets.mjs', ['credits', '--dir', dirWith(['a.jpg'], [entry({ license: 'BY 4.0', attributionRequired: true })])]).code, 1)
})

test('credits: attribution written, so it passes', () => {
  assert.equal(run('assets.mjs', ['credits', '--dir', dirWith(['a.jpg'], [entry({ license: 'BY 4.0', attributionRequired: true, attribution: '"A" by Jo, CC BY 4.0' })])]).code, 0)
})
