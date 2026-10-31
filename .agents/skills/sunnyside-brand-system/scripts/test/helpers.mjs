import { execFileSync } from 'node:child_process'
import { mkdirSync, mkdtempSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

export const scripts = join(dirname(fileURLToPath(import.meta.url)), '..')
export const tmp = () => mkdtempSync(join(tmpdir(), 'sbs-test-'))

export function put(root, rel, content) {
  const file = join(root, rel)
  mkdirSync(dirname(file), { recursive: true })
  writeFileSync(file, typeof content === 'string' ? content : JSON.stringify(content, null, 2))
  return file
}

/** Run a script; a non-zero exit is a verdict, so return it instead of throwing. */
export function run(script, args) {
  try {
    return { code: 0, out: execFileSync('node', [join(scripts, script), ...args], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }), err: '' }
  } catch (e) {
    return { code: e.status ?? 1, out: String(e.stdout ?? ''), err: String(e.stderr ?? '') }
  }
}

export function gates(root, slug) {
  const r = run('gates.mjs', ['--root', root, '--slug', slug, '--json'])
  const rows = r.out.trim().startsWith('{') ? JSON.parse(r.out).rows : []
  const row = (name) => rows.find((x) => x.name === name)
  return { code: r.code, rows, row, status: (name) => row(name)?.status }
}

/** A minimal, valid case. Pass overrides to break exactly one thing. */
export function goodCase(root, slug = 'x', { tokens = {}, css } = {}) {
  put(root, `features/${slug}/tokens.json`, {
    meta: { name: 'X', namespace: 'xx' },
    primitives: [
      { name: 'ink', value: '#111111', role: 'text' },
      { name: 'paper', value: '#f5f0e6', role: 'ground' },
      { name: 'glow', value: '#d9ff43', role: 'accent' },
    ],
    contrast: [
      { label: 'ink on paper', fg: '#111111', bg: '#f5f0e6', ratio: 16.63 },
      { label: 'glow on paper', fg: '#d9ff43', bg: '#f5f0e6', ratio: 1.01 },
    ],
    type: [{ name: 'display', value: "'Sora', sans-serif" }],
    ...tokens,
  })
  put(root, `features/${slug}/${slug}-tokens.css`, css ?? ':root{--xx-ink:#111111;--xx-paper:#f5f0e6;--xx-glow:#d9ff43;}')
}
