#!/usr/bin/env node
/**
 * figma-replay-smoke — execute a generated replay plugin against a stub of the
 * Figma API and assert that Auto Layout, variables, styles and node types were
 * all produced.
 *
 *   node scripts/figma-replay-smoke.mjs design/figma/vesper-replay/code.js
 *   node scripts/figma-replay-smoke.mjs <code.js> --manifest <real manifest.json>
 *
 * With --manifest it replays the real sheet manifest rather than the fixture,
 * which is the closest thing to opening Figma without opening Figma.
 */
import { readFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import vm from 'node:vm'

const file = resolve(process.argv[2] || '')
const manifestArg = process.argv.indexOf('--manifest')
const manifestPath = manifestArg === -1 ? null : resolve(process.argv[manifestArg + 1])
if (!file.endsWith('.js')) {
  console.error('Usage: node scripts/figma-replay-smoke.mjs <generated code.js> [--manifest <manifest.json>]')
  process.exit(1)
}

const source = await readFile(file, 'utf8')

const L = (o = {}) => ({
  mode: 'NONE', spacing: 0, counterSpacing: 0, padding: [0, 0, 0, 0],
  align: 'stretch', justify: 'flex-start', wrap: 'NO_WRAP', grow: 0,
  columns: '', positioning: 'AUTO', ...o,
})
const S = (o = {}) => ({
  fill: 'rgba(0, 0, 0, 0)', color: 'rgb(16, 24, 32)', radius: 0,
  stroke: null, strokeWidth: 0, fontFamily: 'Inter', fontSize: 16,
  fontWeight: '400', lineHeight: 'normal', letterSpacing: 'normal', opacity: 1, ...o,
})
const B = (x, y, w, h) => ({ x, y, w, h })

const fixture = {
  version: 1, kind: 'sunnyside/figma-manifest', brand: 'Fixture', slug: 'fixture',
  viewport: 1440,
  tokens: {
    brand: 'Fixture', slug: 'fixture',
    palette: [{ name: 'ink', hex: '#101820' }, { name: 'paper', hex: '#F7F5F0' }],
    type: [{ name: 'display', family: 'Inter', size: 48, leading: 0.95, tracking: -0.02, weight: 700 }],
    space: [{ name: 's1', value: '4px' }, { name: 's2', value: '8px' }],
    radius: [{ name: 'r1', value: '8px' }],
  },
  sheets: [{
    name: 'colors', label: 'section-colors',
    node: {
      name: 'Sheet', type: 'FRAME', box: B(0, 0, 1200, 800), layout: L({ mode: 'VERTICAL', spacing: 24, padding: [32, 32, 32, 32] }),
      style: S(), component: null, text: null,
      children: [
        {
          name: 'row', type: 'FRAME', box: B(32, 32, 1136, 200),
          layout: L({ mode: 'HORIZONTAL', spacing: 16, align: 'center', justify: 'space-between', wrap: 'WRAP' }),
          style: S(), component: 'Color / Main Colors', text: null,
          children: [
            { name: 'Title', type: 'TEXT', box: B(32, 32, 600, 60), layout: L(), style: S({ fontSize: 48, fontWeight: '700' }), component: null, text: 'Fixture system', children: [] },
            { name: 'caption', type: 'TEXT', box: B(32, 96, 200, 16), layout: L(), style: S({ fontSize: 10, color: 'rgb(100, 116, 139)' }), component: null, text: 'small caption', children: [] },
            { name: 'badge', type: 'TEXT', box: B(32, 120, 72, 24), layout: L(), style: S({ fontSize: 11, color: 'rgb(255, 255, 255)', fill: 'rgb(17, 24, 39)', radius: 999 }), component: null, text: 'PASS', children: [] },
            { name: 'paragraph', type: 'TEXT', box: B(32, 156, 300, 120), layout: L(), style: S({ fontSize: 14, color: 'rgb(71, 85, 105)' }), component: null, text: 'A longer paragraph that wrapped across several lines in the browser and must keep wrapping inside its measured column.', children: [] },
            { name: 'swatch', type: 'RECTANGLE', box: B(648, 32, 200, 60), layout: L({ grow: 1 }), style: S({ fill: 'rgb(247, 245, 240)', radius: 8 }), component: null, text: null, children: [] },
          ],
        },
        {
          name: 'grid', type: 'FRAME', box: B(32, 256, 1136, 400),
          layout: L({ mode: 'GRID', columns: '224px 224px 224px', spacing: 18, counterSpacing: 18 }),
          style: S(), component: null, text: null,
          children: [
            { name: 'absolute chip', type: 'RECTANGLE', box: B(40, 260, 64, 64), layout: L({ positioning: 'ABSOLUTE' }), style: S(), component: null, text: null, children: [] },
            { name: 'vector', type: 'VECTOR', box: B(120, 260, 64, 64), svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" fill="#101820"/></svg>', component: null, text: null, children: [] },
          ],
        },
      ],
    },
  }],
}

/* A second sheet named "patterns" proves the token-sheet page is filtered out
 * by default — it is mostly CSS dumps and copy controls. */
fixture.sheets.push({
  name: 'patterns', label: 'section-patterns',
  node: {
    name: 'Sheet', type: 'FRAME', box: B(0, 0, 1200, 600), layout: L({ mode: 'VERTICAL', spacing: 8 }),
    style: S(), component: null, text: null,
    children: [
      { name: 'token css', type: 'TEXT', box: B(0, 0, 600, 40), layout: L(), style: S({ fontSize: 13 }), component: null, text: ':root { --x: 1 }', children: [] },
    ],
  },
})

const manifest = manifestPath ? JSON.parse(await readFile(manifestPath, 'utf8')) : fixture

/* ── the stub ────────────────────────────────────────────────────────────── */

const log = {
  pages: [], frames: [], components: [], texts: [], rects: [], vectors: [],
  variables: [], paintStyles: [], textStyles: [], collections: [],
  notified: '', closed: '', errors: [], uiMessages: [], syncPageWrites: [],
}
let nextId = 1
const id = () => 'n' + nextId++

function nodeBase(type, name) {
  const node = {
    id: id(), type, name: name || type, x: 0, y: 0, width: 0, height: 0,
    children: [], fills: [], strokes: [], strokeWeight: 0, cornerRadius: 0,
    opacity: 1, layoutMode: 'NONE', itemSpacing: 0, layoutGrow: 0,
    layoutPositioning: 'AUTO', layoutWrap: 'NO_WRAP',
    paddingTop: 0, paddingRight: 0, paddingBottom: 0, paddingLeft: 0,
    appendChild(child) {
      if (!child || typeof child !== 'object') throw new Error('appendChild got ' + child)
      child.parent = node
      node.children.push(child)
      return child
    },
    resize(w, h) {
      if (!Number.isFinite(w) || !Number.isFinite(h)) throw new Error('resize got ' + w + '×' + h)
      node.width = w; node.height = h
    },
    remove() {
      const host = node.parent ? node.parent.children : pages
      const i = host.indexOf(node)
      if (i !== -1) host.splice(i, 1)
    },
  }
  return node
}

/* Pre-seed a page with the exact name the plugin is about to create. Replace
 * mode must remove it instead of appending a duplicate set of 8 pages. */
const pages = [nodeBase('PAGE', 'Page 1'), nodeBase('PAGE', '01 · colors')]

function record(type, name) {
  const n = nodeBase(type, name)
  if (type === 'FRAME') log.frames.push(n)
  if (type === 'COMPONENT') log.components.push(n)
  if (type === 'TEXT') log.texts.push(n)
  if (type === 'RECTANGLE') log.rects.push(n)
  if (type === 'VECTOR') log.vectors.push(n)
  return n
}

const figma = {
  root: { get children() { return pages } },
  get currentPage() { return current },
  set currentPage(p) {
    /* Read-only under dynamic-page — record it so the smoke test can fail it. */
    log.syncPageWrites.push(p && p.name)
    current = p
  },
  async setCurrentPageAsync(p) {
    if (!p) throw new Error('setCurrentPageAsync needs a page')
    current = p
  },
  async loadAllPagesAsync() {},
  mixed: Symbol('mixed'),
  showUI() {},
  ui: {
    onmessage: null,
    postMessage(m) { log.uiMessages.push(m) },
  },
  notify(m) { log.notified = m },
  closePlugin(m) { log.closed = m },
  createPage() { const p = nodeBase('PAGE', 'Page'); pages.push(p); log.pages.push(p); return p },
  createFrame: () => record('FRAME', 'Frame'),
  createComponent: () => record('COMPONENT', 'Component'),
  createText: () => record('TEXT', 'Text'),
  createRectangle: () => record('RECTANGLE', 'Rectangle'),
  createNodeFromSvg(svg) {
    if (typeof svg !== 'string' || svg.indexOf('<svg') === -1) throw new Error('createNodeFromSvg needs SVG markup')
    const n = record('VECTOR', 'Vector')
    n.fills = [{ type: 'SOLID' }]
    return n
  },
  createPaintStyle() { const s = { id: id(), name: '', paints: [] }; log.paintStyles.push(s); return s },
  createTextStyle() { const s = { id: id(), name: '', fontSize: 0 }; log.textStyles.push(s); return s },
  async loadFontAsync(f) {
    if (!f || !f.family) throw new Error('loadFontAsync needs {family, style}')
    /* Figma bundles Inter and hosts the Google Fonts roster, so the families a
     * Sunnyside kit ships (Archivo, DM Mono, Fraunces, Instrument, IBM Plex,
     * Plus Jakarta) resolve without installation. Anything else falls back. */
    const GOOGLE = new Set([
      'inter', 'archivo', 'dm mono', 'fraunces', 'instrument sans',
      'instrument serif', 'ibm plex mono', 'ibm plex sans', 'plus jakarta sans',
      'roboto', 'open sans', 'lato', 'source serif 4', 'georgia', 'arial',
    ])
    if (!GOOGLE.has(String(f.family).toLowerCase())) throw new Error('font not available: ' + f.family)
  },
  variables: {
    createVariableCollection(name) {
      const c = {
        id: id(), name, modes: [{ modeId: 'm1', name: 'Default' }],
        renameMode(m, label) { this.modes[0].name = label },
        addMode(label) { return 'm2' },
      }
      log.collections.push(c)
      return c
    },
    createVariable(name, coll, type) {
      const v = {
        id: id(), name, resolvedType: type, valuesByMode: {},
        setValueForMode(modeId, value) {
          if (type === 'COLOR' && (!value || value.r < 0 || value.r > 1)) throw new Error('colour channel out of range on ' + name)
          this.valuesByMode[modeId] = value
        },
      }
      log.variables.push(v)
      return v
    },
    setBoundVariableForPaint(paint, field, variable) {
      if (!paint || paint.type !== 'SOLID') throw new Error('setBoundVariableForPaint needs a SOLID paint')
      if (field !== 'color') throw new Error('unexpected bind field ' + field)
      if (!variable || !variable.id) throw new Error('binding to an undefined variable')
      return { ...paint, boundVariables: { color: { type: 'VARIABLE_ALIAS', id: variable.id } } }
    },
  },
}
let current = pages[0]

const context = vm.createContext({
  figma, __html__: '<html></html>',
  console: { log() {}, warn() {}, error: (m) => log.errors.push(String(m)) },
  JSON, Math, Number, Object, Array, String, Symbol, Promise, Set, Map, isNaN, parseInt, parseFloat, RegExp,
})

let thrown = null
try {
  vm.runInContext(source, context, { filename: file, timeout: 20000 })
  if (typeof figma.ui.onmessage !== 'function') throw new Error('plugin never registered a UI message handler')
  await figma.ui.onmessage({ type: 'build', json: JSON.stringify(manifest), replace: true, minFontSize: 12 })
  await new Promise((r) => setTimeout(r, 50))
} catch (e) {
  thrown = e
}

const summary = log.closed || log.notified || ''
const autoLayouts = log.frames.concat(log.components).filter((n) => n.layoutMode && n.layoutMode !== 'NONE')
const absoluteChildren = log.rects.filter((n) => n.layoutPositioning === 'ABSOLUTE')
const boundPaints = log.frames.concat(log.rects).filter((n) => (n.fills || []).some((p) => p && p.boundVariables))

const report = {
  file,
  manifest: manifestPath || '(built-in fixture)',
  thrown: thrown ? thrown.message : null,
  summary,
  pages: log.pages.length,
  pageNames: pages.map((p) => p.name),
  duplicateGeneratedPages: pages.filter((p) => p.name === '01 · colors').length,
  replacedExistingPages: /replaced (\d+) existing page/.exec(summary)?.[1] || '0',
  autoLayoutFrames: autoLayouts.length,
  modes: [...new Set(autoLayouts.map((n) => n.layoutMode))],
  frames: log.frames.length,
  components: log.components.length,
  texts: log.texts.length,
  textsWithoutFill: log.texts.filter((t) => !Array.isArray(t.fills) || !t.fills.length).length,
  textSizes: log.texts.map((t) => ({ name: t.name, size: t.fontSize, autoResize: t.textAutoResize })),
  rects: log.rects.length,
  chips: log.frames.filter((f) => f.name === 'badge').length,
  chipBox: (() => { const f = log.frames.find((x) => x.name === 'badge'); return f ? { w: Math.round(f.width), h: Math.round(f.height), r: f.cornerRadius } : null })(),
  skippedSheets: Number((/skipped (\d+) sheet/.exec(summary) || [])[1] || 0),
  vectors: log.vectors.length,
  absoluteChildren: absoluteChildren.length,
  variables: log.variables.length,
  collections: log.collections.map((c) => c.name),
  paintStyles: log.paintStyles.length,
  textStyles: log.textStyles.length,
  boundPaints: boundPaints.length,
  uiMessages: log.uiMessages.map((m) => m.type),
  syncPageWrites: log.syncPageWrites.length,
  consoleErrors: log.errors,
}

const problems = []
if (thrown) problems.push('the plugin threw: ' + thrown.message)
if (log.syncPageWrites.length) problems.push('plugin writes figma.currentPage under dynamic-page — use figma.setCurrentPageAsync (' + log.syncPageWrites.length + ' writes)')
if (!summary) problems.push('the plugin never closed with a summary')
if (report.pages < 1) problems.push('no page was created')
if (report.duplicateGeneratedPages !== 1) problems.push('replace mode did not remove the pre-existing generated page')
if (Number(report.replacedExistingPages) < 1) problems.push('replace mode did not report a replacement')
if (report.autoLayoutFrames < 1) problems.push('no Auto Layout frame was created')
if (report.variables < 1) problems.push('no variable was created')
if (report.paintStyles < 1) problems.push('no paint style was created')
if (report.textStyles < 1 && (manifest.tokens?.type || []).length) problems.push('no text style was created')
if (report.texts < 1) problems.push('no live text node was created')
if (report.textsWithoutFill > 0) problems.push(report.textsWithoutFill + ' text node(s) have no fill — text ink was overwritten by the CSS background')
if (!manifestPath && report.chips < 1) problems.push('a text leaf with a background was not wrapped in a chip frame')
if (!manifestPath && report.chipBox && (report.chipBox.w !== 72 || report.chipBox.h !== 24)) {
  problems.push('chip plate collapsed to ' + report.chipBox.w + '×' + report.chipBox.h + ' instead of 72×24')
}
if (!manifestPath && report.pages !== 1) problems.push('patterns sheet was not filtered (created ' + report.pages + ' pages)')
if (!manifestPath && report.skippedSheets !== 1) problems.push('skipped sheet count was not reported')
if (!/inked/.test(summary)) problems.push('summary does not report inked text')
/* The 10px caption only exists in the built-in fixture, so these two checks
 * apply to the fixture run, not to a real sheet manifest. */
if (!manifestPath) {
  const caption = report.textSizes.find((t) => t.name === 'caption')
  if (!caption) problems.push('caption fixture text was not created')
  else if (Number(caption.size) < 12) problems.push('minFontSize did not raise the 10px caption (got ' + caption.size + ')')
  if (caption && caption.autoResize !== 'WIDTH_AND_HEIGHT') problems.push('a one-line label should be WIDTH_AND_HEIGHT (got ' + caption.autoResize + ')')
  const para = report.textSizes.find((t) => t.name === 'paragraph')
  if (!para) problems.push('paragraph fixture text was not created')
  else if (para.autoResize !== 'HEIGHT') problems.push('a wrapped paragraph should be HEIGHT (got ' + para.autoResize + ')')
}
if (report.vectors < 1) problems.push('no vector node was created')
if (report.boundPaints < 1) problems.push('no paint was bound to a variable')
if (log.uiMessages.some((m) => m.type === 'error')) problems.push('the plugin reported a UI error')
if (log.errors.length) problems.push('the plugin logged errors')
if (/failed/i.test(summary)) problems.push('the plugin reported failure: ' + summary)

console.log(JSON.stringify(report, null, 2))
if (problems.length) {
  console.error('\n  ✗ ' + problems.join('\n  ✗ ') + '\n')
  process.exit(1)
}
console.log(`\n  ✓ ${report.pages} pages, ${report.autoLayoutFrames} auto layouts, ${report.variables} variables, ${report.texts} texts, ${report.vectors} vectors, ${report.components} components\n`)
