#!/usr/bin/env node
/**
 * figma-handoff — the whole HTML → Figma pipeline in one command.
 *
 *   node scripts/figma-handoff.mjs --slug vesper --root .
 *   node scripts/figma-handoff.mjs --slug vesper --root . --check
 *   node scripts/figma-handoff.mjs --slug vesper --root . --infer-layout
 *
 * Runs, in order:
 *   1. figma-html.mjs   → public/brand/<slug>/<slug>-figma.html
 *   2. figma-forge.mjs  → design/figma/<slug>/{manifest.json,code.js}
 *   3. figma-bind.mjs   → design/figma/<slug>-bind/{manifest.json,code.js}
 *   4. figma-smoke.mjs + figma-bind-smoke.mjs → both plugins executed
 *   5. with --with-replay: figma-manifest.mjs (headless Chrome) → seed manifest
 *      → figma-replay.mjs → replay plugin → figma-replay-smoke.mjs
 *
 * Two Figma paths:
 *   A. build plugin → import the HTML sheet with html.to.design → bind plugin
 *   B. --with-replay → one replay plugin builds Auto Layout + system natively,
 *      no third-party importer and no clipboard step.
 *
 * Zero required dependencies. `--check` runs every generator in dry-run mode
 * and writes nothing. `--skip-forge`, `--skip-sheet`, `--skip-bind`,
 * `--no-smoke` let one step be regenerated on its own.
 */
import { execFileSync, spawnSync } from 'node:child_process'
import { existsSync, readFileSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { findTokens } from './lib/tokens.mjs'

const HERE = dirname(fileURLToPath(import.meta.url))
const script = (name) => join(HERE, name)

const args = process.argv.slice(2)
const one = (name, fallback) => {
  const i = args.indexOf(`--${name}`)
  return i === -1 ? fallback : args[i + 1]
}
const has = (name) => args.includes(`--${name}`)

const slug = one('slug', '')
const root = resolve(one('root', '.'))
const outBase = resolve(one('out', join(root, 'design', 'figma')))
const tokensArg = one('tokens', null)
const check = has('check')

if (!slug) {
  console.error(`Usage:
  node scripts/figma-handoff.mjs --slug <slug> [--root .] [--tokens <path>] [--out <dir>]
      [--infer-layout] [--with-replay] [--check]
      [--skip-sheet] [--skip-forge] [--skip-bind] [--no-smoke]`)
  process.exit(1)
}

function locateTokens() {
  if (tokensArg) {
    const p = resolve(tokensArg)
    if (!existsSync(p)) throw new Error(`--tokens path does not exist: ${p}`)
    return p
  }
  const extra = [
    join(root, 'src', 'tokens.json'),
    join(root, slug, 'src', 'tokens.json'),
    join(root, 'src', slug, 'tokens.json'),
  ]
  return extra.find(existsSync) ?? findTokens(root, slug)
}

const tokensPath = locateTokens()
if (!tokensPath) throw new Error(`No tokens.json for "${slug}" under ${root} — pass --tokens <path>`)

const raw = JSON.parse(readFileSync(tokensPath, 'utf8'))
const meta = raw.meta ?? raw.$meta ?? {}
const name = raw.name ?? meta.name ?? slug.charAt(0).toUpperCase() + slug.slice(1)
const essence = meta.essence ?? meta.promise ?? raw.oneSentence ?? raw.claim ?? ''

const css = [
  join(root, 'features', slug, `${slug}-tokens.css`),
  join(root, 'public', 'brand', slug, `${slug}-tokens.css`),
  join(root, 'src', `${slug}-tokens.css`),
].find(existsSync)
const brand = [
  join(root, 'public', 'brand', slug),
  join(root, 'brand', slug),
].find(existsSync)
const page = [
  join(root, 'design-system.html'),
  join(root, `${slug}-figma.html`),
].find(existsSync)

const sheetOut = join(root, 'public', 'brand', slug, `${slug}-figma.html`)
const forgeOut = join(outBase, slug)
const bindOut = join(outBase, `${slug}-bind`)
const manifestOut = join(outBase, `${slug}.manifest.json`)
const replayOut = join(outBase, `${slug}-replay`)

function run(label, file, argv, optional = false) {
  console.log(`\n  ── ${label}`)
  try {
    const out = execFileSync(process.execPath, [script(file), ...argv], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] })
    process.stdout.write(out)
  } catch (e) {
    const detail = (e.stdout || '') + (e.stderr || '') || e.message
    if (optional) {
      console.log(`  · skipped (${String(e.message).split('\n')[0]})`)
      return false
    }
    console.error(detail)
    process.exit(1)
  }
  return true
}

/* A missing headless browser is not a failed handoff — it only means the
 * replay plugin has no embedded seed and the user pastes the JSON instead. */
function runTolerant(label, file, argv) {
  console.log(`\n  ── ${label}`)
  const res = spawnSync(process.execPath, [script(file), ...argv], { encoding: 'utf8' })
  if (res.stdout) process.stdout.write(res.stdout)
  if (res.stderr) process.stdout.write(res.stderr)
  if (res.status === 0) return true
  console.log(`  · optional step unavailable (exit ${res.status}) — continuing without a seed`)
  return false
}

console.log(`  ${name} · Figma handoff${check ? ' (dry run)' : ''}`)
console.log(`  root     ${root}`)
console.log(`  tokens   ${tokensPath}`)
console.log(`  css      ${css || '(none)'}`)
console.log(`  brand    ${brand || '(none)'}`)
console.log(`  out      ${outBase}`)

/* 1 · the sheet */
if (!has('skip-sheet')) {
  const argv = ['--slug', slug, '--root', root, '--tokens', tokensPath, '--out', sheetOut]
  if (check) argv.push('--check')
  run('1/5  HTML sheet', 'figma-html.mjs', argv)
}

/* 2 · the system */
if (!has('skip-forge')) {
  const argv = [
    '--tokens', tokensPath, '--slug', slug, '--name', name,
    '--essence', essence, '--out', forgeOut, '--target', 'figma',
  ]
  if (css) argv.push('--css', css)
  if (brand) argv.push('--brand', brand)
  if (page) argv.push('--html', page)
  if (check) argv.push('--check')
  run('2/5  build plugin', 'figma-forge.mjs', argv, true)
}

/* 3 · the binder */
if (!has('skip-bind')) {
  const argv = ['--slug', slug, '--root', root, '--tokens', tokensPath, '--out', bindOut]
  if (has('infer-layout')) argv.push('--infer-layout')
  if (check) argv.push('--check')
  run('3/5  bind plugin', 'figma-bind.mjs', argv)
}

/* 4 · optional: native replay (Auto Layout + system, no importer) */
let hasSeed = false
if (has('with-replay')) {
  if (check) {
    run('4/5  replay plugin (dry run)', 'figma-replay.mjs',
      ['--slug', slug, '--brand', name, '--out', replayOut, '--check'], true)
  } else {
    hasSeed = runTolerant('4/5  extract manifest', 'figma-manifest.mjs',
      ['--html', sheetOut, '--out', manifestOut])
    const argv = ['--slug', slug, '--brand', name, '--out', replayOut]
    if (hasSeed) argv.push('--manifest', manifestOut)
    run('4/5  replay plugin', 'figma-replay.mjs', argv)
  }
}

/* 5 · smoke tests */
if (!check && !has('no-smoke')) {
  if (existsSync(join(forgeOut, 'code.js'))) {
    run('5/5  build smoke', 'figma-smoke.mjs', [join(forgeOut, 'code.js')], true)
  } else {
    console.log('\n  ── 5/5  build smoke skipped (no generated code.js)')
  }
  run('5/5  bind smoke', 'figma-bind-smoke.mjs', [join(bindOut, 'code.js')])
  if (has('with-replay')) {
    const argv = [join(replayOut, 'code.js')]
    if (hasSeed) argv.push('--manifest', manifestOut)
    run('5/5  replay smoke', 'figma-replay-smoke.mjs', argv)
  }
}

if (!check) {
  console.log(`\n  Path A — importer (uses html.to.design / Stitch for Auto Layout):\n    1. Plugins → Development → Import plugin from manifest → ${join(forgeOut, 'manifest.json')}\n    2. Import ${sheetOut} with html.to.design / Stitch to Figma\n    3. Select the imported frames, run ${join(bindOut, 'manifest.json')}`)
  if (has('with-replay')) {
    console.log(`\n  Path B — native replay (Auto Layout + variables + styles + components, one plugin):\n    1. Import ${join(replayOut, 'manifest.json')}\n    2. Run ${name} — replay, then Build in Figma${hasSeed ? '' : ' (paste the JSON from "Copy for Figma")'}\n    Seed: ${hasSeed ? manifestOut : 'not generated — no headless Chrome'}`)
  }
} else {
  console.log('\n  Nothing written.')
}
