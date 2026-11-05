#!/usr/bin/env node
/**
 * figma-replay-smoke — execute a generated replay plugin against a stub of the
 * Figma API and assert that the canonical system, bindings, Auto Layout,
 * components, instances and the upgrader all work.
 *
 *   node scripts/figma-replay-smoke.mjs design/figma/vesper-replay/code.js
 *   node scripts/figma-replay-smoke.mjs <code.js> --manifest <real manifest.json>
 *
 * `runReplay()` is exported so `figma-parity.mjs` can execute the same stub and
 * compare the resulting node tree against the canonical manifest.
 */
import { readFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import vm from 'node:vm'

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
  version: 2, kind: 'sunnyside/figma-manifest', brand: 'Fixture', slug: 'fixture',
  dsId: 'fixture@1.0.0',
  capture: { viewport: 1440, sheets: 2, mode: 'canonical-v2', generator: '5.0.0', checksum: 'fixture' },
  system: {
    version: 'v1.0', brand: 'Fixture', slug: 'fixture', namespace: 'fx', fonts: null,
    colours: [
      { name: 'ink', hex: '#101820', token: '--fx-ink', group: 'Primitive' },
      { name: 'paper', hex: '#F7F5F0', token: '--fx-paper', group: 'Primitive' },
    ],
    type: [{ name: 'display', family: 'Inter', size: 48, leading: 0.95, tracking: -0.02, weight: 700 }],
    space: [{ name: 's1', value: '4px' }, { name: 's2', value: '8px' }],
    radius: [{ name: 'r1', value: '8px' }],
    effects: [{ name: 'Elevation / sm', shadow: '0 4px 8px -2px rgba(16,24,40,0.08)' }],
    grid: { columns: 12, gutter: 24, maxWidth: 1160, margin: 64 },
    components: [{ name: 'Row', description: 'Fixture horizontal row', variants: ['Layout=Horizontal'] }],
    sheets: [],
  },
  tokens: {
    brand: 'Fixture', slug: 'fixture',
    palette: [{ name: 'ink', hex: '#101820' }, { name: 'paper', hex: '#F7F5F0' }],
    type: [{ name: 'display', family: 'Inter', size: 48, leading: 0.95, tracking: -0.02, weight: 700 }],
    space: [{ name: 's1', value: '4px' }, { name: 's2', value: '8px' }],
    radius: [{ name: 'r1', value: '8px' }],
  },
  sheets: [{
    index: 1, name: 'colors', label: 'section-colors', optional: false,
    node: {
      name: 'Sheet', type: 'FRAME', box: B(0, 0, 1200, 800), layout: L({ mode: 'VERTICAL', spacing: 24, padding: [32, 32, 32, 32] }),
      style: S(), component: null, text: null,
      children: [
        {
          name: 'row', type: 'FRAME', box: B(32, 32, 1136, 200),
          layout: L({ mode: 'HORIZONTAL', spacing: 16, align: 'center', justify: 'space-between', wrap: 'WRAP' }),
          style: S(), component: 'Color / Main Colors',
          componentRef: { name: 'Row', variant: 'Layout=Horizontal', description: 'Fixture horizontal row' },
          text: null,
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

/* A second sheet named "patterns" proves the optional token-sheet page is
 * filtered out by default — it is mostly CSS dumps and copy controls. */
fixture.sheets.push({
  index: 8, name: 'patterns', label: 'section-patterns', optional: true,
  node: {
    name: 'Sheet', type: 'FRAME', box: B(0, 0, 1200, 600), layout: L({ mode: 'VERTICAL', spacing: 8 }),
    style: S(), component: null, text: null,
    children: [
      { name: 'token css', type: 'TEXT', box: B(0, 0, 600, 40), layout: L(), style: S({ fontSize: 13 }), component: null, text: ':root { --x: 1 }', children: [] },
    ],
  },
})

/* ── the stub ────────────────────────────────────────────────────────────── */

export async function runReplay({ source, manifest, messages }) {
  const log = {
    pages: [], createdPages: [], frames: [], components: [], componentSets: [], instances: [],
    texts: [], rects: [], vectors: [], variables: [], paintStyles: [], textStyles: [],
    effectStyles: [], gridStyles: [], collections: [],
    notified: [], closed: [], errors: [], uiMessages: [], syncPageWrites: [], boundVariables: [],
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
      description: '', textStyleId: null, fillStyleId: null, effectStyleId: null,
      boundVariables: null, parent: null,
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
      clone() {
        const copy = nodeBase(node.type, node.name)
        for (const k of ['width', 'height', 'x', 'y', 'fills', 'strokes', 'cornerRadius', 'layoutMode', 'itemSpacing', 'description']) {
          copy[k] = Array.isArray(node[k]) ? node[k].slice() : node[k]
        }
        copy.children = node.children.map((c) => { const cc = c.clone(); cc.parent = copy; return cc })
        return copy
      },
      createInstance() {
        const n = nodeBase('INSTANCE', 'Instance')
        n.mainComponent = node
        log.instances.push(n)
        return n
      },
      setBoundVariable(field, variable) {
        if (!variable || !variable.id) throw new Error('setBoundVariable needs a variable')
        node.boundVariables = node.boundVariables || {}
        node.boundVariables[field] = variable
        log.boundVariables.push({ node: node.name, field })
      },
      rescale(s) { node.width *= s; node.height *= s },
    }
    return node
  }

  /* A duplicate generated page proves replace mode removes instead of appending.
   * A flat "HTML to Figma" page proves the upgrader can migrate a Doop import. */
  const flatText = nodeBase('TEXT', 'Doop heading')
  flatText.fontSize = 26
  flatText.fontName = { family: 'Inter', style: 'Regular' }
  flatText.fills = [{ type: 'SOLID', color: { r: 0.063, g: 0.094, b: 0.125 }, opacity: 1 }]
  const flatRect = nodeBase('RECTANGLE', 'Doop plate')
  flatRect.fills = [{ type: 'SOLID', color: { r: 0.969, g: 0.961, b: 0.941 }, opacity: 1 }]
  flatRect.resize(200, 60)
  const flatPage = nodeBase('PAGE', 'HTML to Figma')
  flatPage.appendChild(flatText)
  flatPage.appendChild(flatRect)
  const pages = [nodeBase('PAGE', 'Page 1'), nodeBase('PAGE', '01 · colors'), flatPage]

  function record(type, name) {
    const n = nodeBase(type, name)
    if (type === 'FRAME') log.frames.push(n)
    if (type === 'COMPONENT') log.components.push(n)
    if (type === 'TEXT') log.texts.push(n)
    if (type === 'RECTANGLE') log.rects.push(n)
    if (type === 'VECTOR') log.vectors.push(n)
    return n
  }

  const style = (kind) => {
    const s = { id: id(), name: '', paints: [], effects: [], layoutGrids: [], fontSize: 0, fontName: null }
    log[kind].push(s)
    return s
  }

  const figma = {
    root: { get children() { return pages } },
    get currentPage() { return current },
    set currentPage(p) {
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
    ui: { onmessage: null, postMessage(m) { log.uiMessages.push(m) } },
    notify(m) { log.notified.push(m) },
    closePlugin(m) { log.closed.push(m) },
    createPage() { const p = nodeBase('PAGE', 'Page'); pages.push(p); log.createdPages.push(p); return p },
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
    combineAsVariants(nodes, parent) {
      if (!Array.isArray(nodes) || !nodes.length) throw new Error('combineAsVariants needs components')
      const set = nodeBase('COMPONENT_SET', 'Component set')
      set.defaultVariant = nodes[0]
      for (const n of nodes) {
        const host = n.parent ? n.parent.children : null
        if (host) { const i = host.indexOf(n); if (i !== -1) host.splice(i, 1) }
        set.appendChild(n)
      }
      if (parent) parent.appendChild(set)
      log.componentSets.push(set)
      return set
    },
    createPaintStyle: () => style('paintStyles'),
    createTextStyle: () => style('textStyles'),
    createEffectStyle: () => style('effectStyles'),
    createGridStyle: () => style('gridStyles'),
    getLocalPaintStylesAsync: async () => log.paintStyles.slice(),
    getLocalTextStylesAsync: async () => log.textStyles.slice(),
    getLocalEffectStylesAsync: async () => log.effectStyles.slice(),
    getLocalGridStylesAsync: async () => log.gridStyles.slice(),
    async loadFontAsync(f) {
      if (!f || !f.family) throw new Error('loadFontAsync needs {family, style}')
      const GOOGLE = new Set([
        'inter', 'archivo', 'dm mono', 'fraunces', 'instrument sans',
        'instrument serif', 'ibm plex mono', 'ibm plex sans', 'plus jakarta sans',
        'roboto', 'open sans', 'lato', 'source serif 4', 'georgia', 'arial',
      ])
      if (!GOOGLE.has(String(f.family).toLowerCase())) throw new Error('font not available: ' + f.family)
    },
    variables: {
      getLocalVariableCollectionsAsync: async () => log.collections.slice(),
      getLocalVariablesAsync: async () => log.variables.slice(),
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
          id: id(), name, resolvedType: type, variableCollectionId: coll.id, valuesByMode: {},
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
    vm.runInContext(source, context, { filename: 'code.js', timeout: 30000 })
    if (typeof figma.ui.onmessage !== 'function') throw new Error('plugin never registered a UI message handler')
    for (const msg of messages) {
      await figma.ui.onmessage(msg)
      await new Promise((r) => setTimeout(r, 5))
    }
  } catch (e) {
    thrown = e
  }
  return { log, pages, thrown, context, flatText, flatRect }
}

/* ── report + assertions ────────────────────────────────────────────────── */

export function summarise(log, thrown, manifestPath) {
  const summary = log.closed.at(-1) || log.notified.at(-1) || ''
  const autoLayouts = log.frames.concat(log.components).filter((n) => n.layoutMode && n.layoutMode !== 'NONE')
  const boundPaints = log.frames.concat(log.rects, log.texts).filter((n) => (n.fills || []).some((p) => p && p.boundVariables))
  const solidFills = log.frames.concat(log.rects, log.texts).filter((n) => (n.fills || []).some((p) => p && p.type === 'SOLID'))
  const reported = log.uiMessages.map((m) => m.report).filter(Boolean)
  const lastReport = reported.at(-1) || {}
  const collectionNames = log.collections.map((c) => c.name)
  return {
    manifest: manifestPath || '(built-in fixture)',
    thrown: thrown ? thrown.message : null,
    summary,
    pages: log.createdPages.length,
    pageNames: log.pages?.map((p) => p.name) || [],
    duplicateGeneratedPages: 0, // filled by the caller, which owns `pages`
    replacedExistingPages: /replaced (\d+) existing page/.exec(summary)?.[1] || '0',
    autoLayoutFrames: autoLayouts.length,
    modes: [...new Set(autoLayouts.map((n) => n.layoutMode))],
    frames: log.frames.length,
    components: log.components.length,
    componentSets: log.componentSets.length,
    instances: log.instances.length,
    componentDescriptions: log.components.filter((c) => c.description).length,
    texts: log.texts.length,
    textsWithoutFill: log.texts.filter((t) => !Array.isArray(t.fills) || !t.fills.length).length,
    textsWithStyle: log.texts.filter((t) => t.textStyleId).length,
    textStyleRatio: log.texts.length ? +(log.texts.filter((t) => t.textStyleId).length / log.texts.length).toFixed(3) : 0,
    textSizes: log.texts.map((t) => ({ name: t.name, size: t.fontSize, autoResize: t.textAutoResize })),
    rects: log.rects.length,
    chips: log.frames.filter((f) => f.name === 'badge').length,
    chipBox: (() => { const f = log.frames.find((x) => x.name === 'badge'); return f ? { w: Math.round(f.width), h: Math.round(f.height), r: f.cornerRadius } : null })(),
    skippedSheets: Number((/skipped (\d+) sheet/.exec(summary) || [])[1] || 0),
    vectors: log.vectors.length,
    variables: log.variables.length,
    collections: collectionNames,
    duplicateCollections: collectionNames.length - new Set(collectionNames).size,
    paintStyles: log.paintStyles.length,
    textStyles: log.textStyles.length,
    effectStyles: log.effectStyles.length,
    gridStyles: log.gridStyles.length,
    boundPaints: boundPaints.length,
    solidFills: solidFills.length,
    paintBindingRatio: solidFills.length ? +(boundPaints.length / solidFills.length).toFixed(3) : 0,
    layoutBindings: log.boundVariables.length,
    variablesReused: lastReport.variablesReused ?? 0,
    uiMessages: log.uiMessages.map((m) => m.type),
    syncPageWrites: log.syncPageWrites.length,
    consoleErrors: log.errors,
  }
}

export function smokeProblems(report, manifestPath) {
  const problems = []
  if (report.thrown) problems.push('the plugin threw: ' + report.thrown)
  if (report.syncPageWrites) problems.push('plugin writes figma.currentPage under dynamic-page — use figma.setCurrentPageAsync (' + report.syncPageWrites + ' writes)')
  if (!report.summary) problems.push('the plugin never closed with a summary')
  if (report.pages < 1) problems.push('no page was created')
  if (report.duplicateGeneratedPages !== 1) problems.push('replace mode did not remove the pre-existing generated page')
  if (Number(report.replacedExistingPages) < 1) problems.push('replace mode did not report a replacement')
  if (report.autoLayoutFrames < 1) problems.push('no Auto Layout frame was created')
  if (report.variables < 1) problems.push('no variable was created')
  if (report.paintStyles < 1) problems.push('no paint style was created')
  if (report.textStyles < 1) problems.push('no text style was created')
  if (report.texts < 1) problems.push('no live text node was created')
  if (report.textsWithoutFill > 0) problems.push(report.textsWithoutFill + ' text node(s) have no fill — text ink was overwritten by the CSS background')
  if (report.textStyleRatio < 0.95) problems.push('only ' + Math.round(report.textStyleRatio * 100) + '% of text nodes are bound to a text style (need ≥95%)')
  if (report.paintBindingRatio < 0.90) problems.push('only ' + Math.round(report.paintBindingRatio * 100) + '% of solid fills are bound to a variable (need ≥90%)')
  if (report.duplicateCollections > 0) problems.push(report.duplicateCollections + ' duplicate variable collection(s)')
  if (!manifestPath) {
    if (report.chips < 1) problems.push('a text leaf with a background was not wrapped in a chip frame')
    if (report.chipBox && (report.chipBox.w !== 72 || report.chipBox.h !== 24)) {
      problems.push('chip plate collapsed to ' + report.chipBox.w + '×' + report.chipBox.h + ' instead of 72×24')
    }
    if (report.pages !== 1) problems.push('patterns sheet was not filtered (created ' + report.pages + ' pages)')
    if (report.skippedSheets !== 1) problems.push('skipped sheet count was not reported')
    if (report.instances < 1) problems.push('no component instance was created')
    if (report.componentSets < 1) problems.push('no component set was created')
    if (report.componentDescriptions < 1) problems.push('components have no descriptions')
    const caption = report.textSizes.find((t) => t.name === 'caption')
    if (!caption) problems.push('caption fixture text was not created')
    else if (Number(caption.size) < 12) problems.push('minFontSize did not raise the 10px caption (got ' + caption.size + ')')
    if (caption && caption.autoResize !== 'WIDTH_AND_HEIGHT') problems.push('a one-line label should be WIDTH_AND_HEIGHT (got ' + caption.autoResize + ')')
    const para = report.textSizes.find((t) => t.name === 'paragraph')
    if (!para) problems.push('paragraph fixture text was not created')
    else if (para.autoResize !== 'HEIGHT') problems.push('a wrapped paragraph should be HEIGHT (got ' + para.autoResize + ')')
  }
  if (/inked/.test(report.summary) === false) problems.push('summary does not report inked text')
  if (report.vectors < 1) problems.push('no vector node was created')
  if (report.boundPaints < 1) problems.push('no paint was bound to a variable')
  if (report.uiMessages.some((m) => m === 'error')) problems.push('the plugin reported a UI error')
  if (report.consoleErrors.length) problems.push('the plugin logged errors')
  if (/failed/i.test(report.summary)) problems.push('the plugin reported failure: ' + report.summary)
  return problems
}

/* ── CLI ────────────────────────────────────────────────────────────────── */

const isMain = process.argv[1] && resolve(process.argv[1]) === resolve(fileURLToPath(import.meta.url))
if (isMain) {
  const file = resolve(process.argv[2] || '')
  const manifestArg = process.argv.indexOf('--manifest')
  const manifestPath = manifestArg === -1 ? null : resolve(process.argv[manifestArg + 1])
  if (!file.endsWith('.js')) {
    console.error('Usage: node scripts/figma-replay-smoke.mjs <generated code.js> [--manifest <manifest.json>]')
    process.exit(1)
  }
  const source = await readFile(file, 'utf8')
  const manifest = manifestPath ? JSON.parse(await readFile(manifestPath, 'utf8')) : fixture
  const buildMsg = {
    type: 'build', json: JSON.stringify(manifest), replace: true, minFontSize: 12,
    includePatterns: false, components: true, bind: true,
  }

  const run = await runReplay({ source, manifest, messages: [buildMsg] })
  const report = summarise(run.log, run.thrown, manifestPath)
  report.file = file
  report.duplicateGeneratedPages = run.pages.filter((p) => p.name === '01 · colors').length

  let problems = smokeProblems(report, manifestPath)

  /* Idempotency: a second build in the same file must reuse collections and
   * styles instead of creating a second set. */
  const twice = await runReplay({ source, manifest, messages: [buildMsg, { ...buildMsg }] })
  const twiceNames = twice.log.collections.map((c) => c.name)
  if (twiceNames.length !== new Set(twiceNames).size) problems.push('re-running the build duplicated variable collections')
  if (twice.log.createdPages.length !== report.pages * 2) problems.push('unexpected page count on re-run: ' + twice.log.createdPages.length + ' (expected ' + report.pages * 2 + ')')
  if (twice.pages.filter((p) => /^\d{2} · /.test(p.name)).length > report.pages) problems.push('re-running the build left duplicate generated pages behind')
  report.rerun = { collections: twiceNames.length, duplicates: twiceNames.length - new Set(twiceNames).size, pagesCreated: twice.log.createdPages.length }

  /* Upgrader: migrate a flat Doop-imported page in place. */
  const up = await runReplay({ source, manifest, messages: [buildMsg, { type: 'upgrade', json: JSON.stringify(manifest), allPages: true, inferLayout: false }] })
  const upReport = up.log.uiMessages.at(-1)?.report || {}
  report.upgrade = {
    pages: upReport.upgradedPages ?? 0,
    texts: upReport.upgradedTexts ?? 0,
    fills: upReport.upgradedFills ?? 0,
    flatTextStyled: !!up.flatText.textStyleId,
    flatRectBound: !!(up.flatRect.fills[0] && up.flatRect.fills[0].boundVariables),
  }
  if (!report.upgrade.flatTextStyled) problems.push('upgrader did not bind the flat page text to a text style')
  if (!report.upgrade.flatRectBound) problems.push('upgrader did not bind the flat page fill to a variable')
  if ((report.upgrade.texts || 0) < 1 || (report.upgrade.fills || 0) < 1) problems.push('upgrader reported no changes')

  console.log(JSON.stringify(report, null, 2))
  if (problems.length) {
    console.error('\n  ✗ ' + problems.join('\n  ✗ ') + '\n')
    process.exit(1)
  }
  console.log(`\n  ✓ ${report.pages} pages, ${report.autoLayoutFrames} auto layouts, ${report.variables} variables, ${report.texts} texts (${Math.round(report.textStyleRatio * 100)}% styled), ${report.componentSets} sets / ${report.instances} instances\n`)
}
