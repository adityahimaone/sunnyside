#!/usr/bin/env node
/**
 * figma-parity — prove the HTML page, the canonical manifest and the native
 * replay plugin describe the SAME design system.
 *
 *   node scripts/figma-parity.mjs --manifest vesper.manifest.json \
 *     --plugin design/figma/vesper-replay/code.js
 *   node scripts/figma-parity.mjs --manifest ... --fig "test ds 3.fig" --out parity.json
 *
 * Gates (from the `test ds 3.fig` audit):
 *   · node / text counts within 2%          · sheet geometry within 2px
 *   · exact colours                         · ≥95% text bound to text styles
 *   · ≥90% fills bound to variables         · ≥1 instance per component
 *   · zero duplicate collections            · safe re-run (idempotent system)
 *
 * `--fig` adds an informational Doop/HTML-import reference via `openpencil info
 * --json`. Doop is a snapshot importer, so its raw node count is reported as a
 * delta, not asserted — the canonical spec is the contract, not the importer.
 */
import { readFile, writeFile, mkdir } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { execFileSync } from 'node:child_process'
import { runReplay } from './figma-replay-smoke.mjs'
import { captureInput, checksum } from './lib/canonical.mjs'

const HERE = dirname(fileURLToPath(import.meta.url))
const TEMPLATE_PLUGIN = join(HERE, '..', 'templates', 'figma-replay-plugin.js')

const args = process.argv.slice(2)
const one = (name, fallback) => {
  const i = args.indexOf(`--${name}`)
  return i === -1 ? fallback : args[i + 1]
}

const manifestPath = resolve(one('manifest', ''))
const pluginPath = resolve(one('plugin', TEMPLATE_PLUGIN))
const figPath = one('fig', null)
const outPath = one('out', null)
if (!manifestPath || !existsSync(manifestPath)) {
  console.error('Usage: node scripts/figma-parity.mjs --manifest <manifest.json> [--plugin <code.js>] [--fig <file.fig>] [--out <report.json>]')
  process.exit(1)
}
if (!existsSync(pluginPath)) throw new Error(`plugin not found: ${pluginPath}`)

const manifest = JSON.parse(await readFile(manifestPath, 'utf8'))
const source = await readFile(pluginPath, 'utf8')
if (manifest.kind !== 'sunnyside/figma-manifest') throw new Error('not a Sunnyside manifest')

/* ── colour helpers (same normalisation as the plugin) ──────────────────── */
function cssHex(str) {
  if (!str || typeof str !== 'string') return null
  const s = str.trim().toLowerCase()
  if (s === 'transparent' || s === 'none' || s === 'rgba(0, 0, 0, 0)') return null
  if (s.charAt(0) === '#') {
    let h = s.slice(1)
    if (h.length === 3) h = h[0] + h[0] + h[1] + h[1] + h[2] + h[2]
    if (h.length === 8) h = h.slice(0, 6)
    return /^[0-9a-f]{6}$/.test(h) ? '#' + h.toUpperCase() : null
  }
  const m = s.match(/rgba?\(([^)]+)\)/)
  if (!m) return null
  const p = m[1].split(/[,\s/]+/).filter(Boolean).map(parseFloat)
  if (p.length < 3) return null
  if (p.length > 3 && p[3] <= 0.001) return null
  return '#' + p.slice(0, 3).map((v) => ('0' + Math.round(Math.max(0, Math.min(255, v))).toString(16)).slice(-2)).join('').toUpperCase()
}
const rgbHex = (c) => '#' + [c.r, c.g, c.b]
  .map((v) => ('0' + Math.round(Math.max(0, Math.min(1, v)) * 255).toString(16)).slice(-2))
  .join('').toUpperCase()

/* ── canonical spec side ────────────────────────────────────────────────── */
const spec = {
  sheets: manifest.sheets.length,
  nodes: 0, texts: 0,
  colours: new Set(),
  components: new Set(),
  componentRefs: 0,
  extraWrappers: 0,
  roots: [],
  nowrap: 0,
  actionGroups: [],
  componentPages: new Set(),
}
function walkSpec(n, sheetName) {
  spec.nodes++
  if (n.type === 'TEXT') spec.texts++
  if (/nowrap/i.test(String((n.style && n.style.whiteSpace) || ''))) spec.nowrap++
  if (n.role === 'action-group') spec.actionGroups.push(Number(n.box.w))
  if (n.componentRef) spec.componentPages.add(sheetName)
  const fill = cssHex(n.style && n.style.fill)
  if (fill) spec.colours.add(fill)
  /* Inherited `color` on a container is never painted; only text ink is. */
  if (n.type === 'TEXT') {
    const ink = cssHex(n.style && n.style.color)
    if (ink) spec.colours.add(ink)
  }
  const hasPlate = n.type === 'TEXT' && !!(fill && n.style && n.style.opacity !== 0)
  const leafWrap = !!n.componentRef && n.type !== 'FRAME' && n.type !== 'COMPONENT'
  if (hasPlate) spec.extraWrappers++
  if (leafWrap) spec.extraWrappers++
  if (n.componentRef) {
    spec.componentRefs++
    spec.components.add(n.componentRef.name)
  }
  for (const c of n.children || []) walkSpec(c, sheetName)
}
for (const s of manifest.sheets) {
  walkSpec(s.node, s.name)
  spec.roots.push({ name: s.name, w: Number(s.node.box.w), h: Number(s.node.box.h) })
}

/* ── replay side ────────────────────────────────────────────────────────── */
const buildMsg = {
  type: 'build', json: JSON.stringify(manifest), replace: true, minFontSize: 0,
  includePatterns: true, components: true, bind: true,
}
const run = await runReplay({ source, manifest, messages: [buildMsg] })
const rerun = await runReplay({ source, manifest, messages: [buildMsg, { ...buildMsg }] })

/* Component sets live at page level (Figma's safest place for them) and are
 * positioned over the library board, so they are expected page children — not
 * evidence that a sheet frame was detached. */
const isLibraryNode = (n) => n.name === '◆ Component Library' || /^Component \/ /.test(n.name)
function sheetRoots(r) {
  return r.pages
    .filter((p) => /^\d{2} · /.test(p.name))
    .map((p) => {
      const kids = p.children || []
      return kids.find((c) => c.name === 'figma-sheet') || kids.find((c) => !isLibraryNode(c))
    })
    .filter(Boolean)
}
const roots = sheetRoots(run)
const replay = {
  nodes: 0, texts: 0, solidFills: 0, boundFills: 0, colours: new Set(),
  styleBoundTexts: 0, wrappedTexts: 0, actionGroups: [],
  componentsInSheet: 0, circles: [],
}
function walkReplay(n) {
  replay.nodes++
  if (n.type === 'TEXT') {
    replay.texts++
    if (n.textStyleId) replay.styleBoundTexts++
    if (n.textAutoResize === 'HEIGHT') replay.wrappedTexts++
  }
  if (n.name === 'action-group') replay.actionGroups.push(Number(n.width))
  if (n.type === 'COMPONENT') replay.componentsInSheet++
  if (/^(tnd-logo-circle|sheet-num-badge)$/.test(n.name) && Number(n.width) > 0) {
    replay.circles.push({ name: n.name, w: Math.round(Number(n.width)), h: Math.round(Number(n.height)), r: Math.round(Number(n.cornerRadius) || 0) })
  }
  for (const p of n.fills || []) {
    if (!p || p.type !== 'SOLID' || !p.color) continue
    replay.solidFills++
    if (p.boundVariables && p.boundVariables.color) replay.boundFills++
    replay.colours.add(rgbHex(p.color))
  }
  for (const c of n.children || []) walkReplay(c)
}
for (const root of roots) walkReplay(root)

const expectedExtra = spec.extraWrappers
const adjustedNodes = replay.nodes - expectedExtra
const nodeDelta = spec.nodes ? Math.abs(adjustedNodes - spec.nodes) / spec.nodes : 1
const textDelta = spec.texts ? Math.abs(replay.texts - spec.texts) / spec.texts : 1

let geometryMax = 0
const geometry = spec.roots.map((r, i) => {
  const got = roots[i]
  const dw = got ? Math.abs((Number(got.width) || 0) - r.w) : Infinity
  const dh = got ? Math.abs((Number(got.height) || 0) - r.h) : Infinity
  geometryMax = Math.max(geometryMax, dw, dh)
  return { sheet: r.name, spec: `${r.w}×${r.h}`, replay: got ? `${Math.round(got.width)}×${Math.round(got.height)}` : 'missing', dw, dh }
})

const missingColours = [...spec.colours].filter((c) => !replay.colours.has(c))
const colourCoverage = spec.colours.size ? 1 - missingColours.length / spec.colours.size : 1
const textStyleRatio = replay.texts ? replay.styleBoundTexts / replay.texts : 0
const fillBindingRatio = replay.solidFills ? replay.boundFills / replay.solidFills : 0
const collectionNames = run.log.collections.map((c) => c.name)
const duplicateCollections = collectionNames.length - new Set(collectionNames).size
const instances = run.log.instances.length
const rerunNames = rerun.log.collections.map((c) => c.name)
const rerunDuplicates = rerunNames.length - new Set(rerunNames).size
const rerunGeneratedPages = rerun.pages.filter((p) => /^\d{2} · /.test(p.name)).length
const lastReport = run.log.uiMessages.at(-1)?.report || {}
const rerunReport = rerun.log.uiMessages.at(-1)?.report || {}

/* v5.1 structural gates: no sheet frames were reparented to the page root,
 * the library sits above the sheet, action groups keep their full width, and
 * only genuinely multi-line copy uses HEIGHT. */
const pageMeta = run.pages.filter((p) => /^\d{2} · /.test(p.name)).map((p) => {
  const kids = p.children || []
  const lib = kids.find((c) => c.name === '◆ Component Library')
  const root = kids.find((c) => c.name === 'figma-sheet') || kids.find((c) => !isLibraryNode(c))
  const expected = kids.filter((c) => isLibraryNode(c)).length
  return {
    name: p.name,
    extra: Math.max(0, kids.length - 1 - expected),
    libraryY: lib ? Number(lib.y) : null,
    rootY: root ? Number(root.y) : null,
  }
})
const detachedFrames = pageMeta.reduce((a, p) => a + p.extra, 0)
const librariesAbove = pageMeta.filter((p) => p.libraryY !== null && p.rootY !== null && p.libraryY < p.rootY).length
const wrappedRatio = replay.texts ? replay.wrappedTexts / replay.texts : 0
const actionWidthOk = spec.actionGroups.length > 0 &&
  spec.actionGroups.every((w, i) => Math.abs((replay.actionGroups[i] ?? 0) - w) <= 2)

let signature = { valid: false, expected: null, actual: null }
if (manifest.capture && manifest.capture.checksum) {
  const expected = checksum(captureInput(manifest))
  signature = { valid: expected === manifest.capture.checksum, expected, actual: manifest.capture.checksum }
} else {
  signature = { valid: false, expected: null, actual: null, note: 'v1 manifest has no signature' }
}

/* Doop / HTML-importer reference (informational). */
let figReference = null
if (figPath) {
  try {
    const candidates = [process.env.OPENPENCIL_BIN, join(process.env.HOME || '', '.bun/bin/openpencil')].filter(Boolean)
    const bin = candidates.find(existsSync)
    if (bin) {
      const info = JSON.parse(execFileSync(bin, ['info', resolve(figPath), '--json'], { encoding: 'utf8' }))
      const doopPage = Object.keys(info.pageCounts || {}).find((k) => /html|doop|import/i.test(k))
      figReference = {
        file: resolve(figPath),
        totalNodes: info.totalNodes,
        pages: info.pages,
        doopPage,
        doopNodes: doopPage ? info.pageCounts[doopPage] : null,
        canonicalNodes: spec.nodes,
        deltaVsDoopPct: doopPage ? +(((info.pageCounts[doopPage] - spec.nodes) / info.pageCounts[doopPage]) * 100).toFixed(1) : null,
        note: 'Doop imports invisible chrome and cannot reconstruct variables/styles; this is a reference, not a gate.',
      }
    }
  } catch (e) {
    figReference = { error: String(e.message || e) }
  }
}

/* ── gates ──────────────────────────────────────────────────────────────── */
const gates = [
  { gate: 'canonical signature', value: signature.valid ? 'VALID' : 'INVALID', threshold: 'valid', pass: signature.valid },
  { gate: 'capture mode', value: manifest.capture?.mode || 'n/a', threshold: 'canonical-v2', pass: manifest.capture?.mode === 'canonical-v2' },
  { gate: 'sheets in spec', value: spec.sheets, threshold: 8, pass: spec.sheets === 8 },
  { gate: 'node count ≤2%', value: `${adjustedNodes} vs ${spec.nodes} (+${expectedExtra} wrappers) · ${(nodeDelta * 100).toFixed(2)}%`, threshold: '≤2%', pass: nodeDelta <= 0.02 },
  { gate: 'text count ≤2%', value: `${replay.texts} vs ${spec.texts} · ${(textDelta * 100).toFixed(2)}%`, threshold: '≤2%', pass: textDelta <= 0.02 },
  { gate: 'sheet geometry ≤2px', value: `${geometryMax === Infinity ? 'missing root' : geometryMax.toFixed(0) + 'px max'}`, threshold: '≤2px', pass: geometryMax <= 2 },
  { gate: 'exact colours', value: `${spec.colours.size - missingColours.length}/${spec.colours.size} · ${(colourCoverage * 100).toFixed(1)}%`, threshold: '100%', pass: missingColours.length === 0 },
  { gate: 'text → styles ≥95%', value: `${(textStyleRatio * 100).toFixed(1)}%`, threshold: '≥95%', pass: textStyleRatio >= 0.95 },
  { gate: 'fills → variables ≥90%', value: `${(fillBindingRatio * 100).toFixed(1)}%`, threshold: '≥90%', pass: fillBindingRatio >= 0.90 },
  { gate: 'instances ≥ components', value: `${instances} instances / ${spec.components.size} components`, threshold: '≥1 each', pass: spec.components.size === 0 || instances >= spec.components.size },
  { gate: 'duplicate collections', value: duplicateCollections, threshold: 0, pass: duplicateCollections === 0 },
  { gate: 'safe re-run', value: `${rerunDuplicates} dup collections · ${rerunGeneratedPages} generated pages · ${rerunReport.variablesReused ?? 0} reused vars`, threshold: '0 dup / 1 page set', pass: rerunDuplicates === 0 && rerunGeneratedPages === spec.sheets && (rerunReport.variablesReused ?? 0) > 0 },
  { gate: 'no console errors', value: run.log.errors.length, threshold: 0, pass: run.log.errors.length === 0 && !run.thrown },
  { gate: 'action groups full width', value: `${replay.actionGroups.map(Math.round).join('/')} vs ${spec.actionGroups.join('/')}`, threshold: '≤2px each', pass: spec.actionGroups.length ? actionWidthOk : true },
  { gate: 'no detached sheet frames', value: detachedFrames, threshold: 0, pass: detachedFrames === 0 },
  { gate: 'library above sheet', value: `${librariesAbove} boards / ${spec.componentPages.size} pages`, threshold: 'one per component page', pass: spec.componentPages.size > 0 ? librariesAbove >= spec.componentPages.size : true },
  { gate: 'one-line labels', value: `${replay.wrappedTexts}/${replay.texts} wrapped · ${(wrappedRatio * 100).toFixed(1)}%`, threshold: '≤5%', pass: spec.nowrap > 0 ? wrappedRatio <= 0.05 : true },
  { gate: 'no components in sheet', value: replay.componentsInSheet, threshold: 0, pass: replay.componentsInSheet === 0 },
  {
    gate: 'circles stay round',
    value: replay.circles.length ? `${replay.circles.filter((c) => c.w === c.h && c.r === Math.round(c.w / 2)).length}/${replay.circles.length} round (${replay.circles[0].w}×${replay.circles[0].h} r${replay.circles[0].r})` : 'n/a',
    threshold: 'square + r=w/2',
    pass: replay.circles.every((c) => c.w === c.h && Math.abs(c.r - c.w / 2) <= 1),
  },
]

const report = {
  manifest: manifestPath,
  plugin: pluginPath,
  brand: manifest.brand,
  dsId: manifest.dsId,
  checksum: manifest.capture?.checksum,
  signature,
  spec: { sheets: spec.sheets, nodes: spec.nodes, texts: spec.texts, colours: spec.colours.size, componentRefs: spec.componentRefs, components: [...spec.components] },
  replay: {
    pages: roots.length, nodes: replay.nodes, adjustedNodes, extraWrappers: expectedExtra,
    texts: replay.texts, solidFills: replay.solidFills, boundFills: replay.boundFills,
    styleBoundTexts: replay.styleBoundTexts, wrappedTexts: replay.wrappedTexts,
    actionGroups: replay.actionGroups, detachedFrames, librariesAbove,
    instances, componentSets: run.log.componentSets.length, variables: run.log.variables.length,
  },
  geometry,
  missingColours,
  report: lastReport,
  figReference,
  gates,
  pass: gates.every((g) => g.pass),
}

const pad = (s, n) => String(s).padEnd(n)
console.log(`\n  ${manifest.brand} · parity gate · ${manifest.dsId || ''} · ${manifest.capture?.checksum || ''}`)
console.log('  ' + '-'.repeat(78))
for (const g of gates) console.log(`  ${g.pass ? '✓' : '✗'} ${pad(g.gate, 28)} ${pad(g.value, 40)} ${g.threshold}`)
if (figReference && !figReference.error) {
  console.log('  ' + '-'.repeat(78))
  console.log(`  · .fig reference: ${figReference.doopPage} ${figReference.doopNodes} nodes vs canonical ${figReference.canonicalNodes} (${figReference.deltaVsDoopPct}% delta, informational)`)
}
console.log('  ' + '-'.repeat(78))

if (outPath) {
  await mkdir(dirname(resolve(outPath)), { recursive: true })
  await writeFile(resolve(outPath), JSON.stringify(report, null, 2), 'utf8')
  console.log(`  · report → ${resolve(outPath)}`)
}
if (!report.pass) {
  console.error('\n  ✗ parity gate failed\n')
  process.exit(1)
}
console.log('  ✓ all parity gates passed\n')
