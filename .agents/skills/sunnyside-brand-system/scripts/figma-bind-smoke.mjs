#!/usr/bin/env node
/**
 * figma-bind-smoke — run a generated bind plugin against a stub of the Figma
 * API, twice: once with a system already built, once with an empty file.
 *
 *   node scripts/figma-bind-smoke.mjs design/figma/vesper-bind/code.js
 *
 * It is the same discipline as figma-smoke.mjs: Figma is the only place a
 * plugin can really run, but a plugin that has never been executed is a plugin
 * nobody has tested. This catches a bad RGB match, a style key that never
 * resolves, a swallowed exception and a plugin that reports success after
 * doing nothing.
 */
import { readFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import vm from 'node:vm'

const file = resolve(process.argv[2] || '')
if (!file.endsWith('.js')) {
  console.error('Usage: node scripts/figma-bind-smoke.mjs <generated code.js>')
  process.exit(1)
}

const source = await readFile(file, 'utf8')
const dataMatch = source.match(/const DATA = ([\s\S]*?);\n/)
if (!dataMatch) throw new Error('generated plugin has no DATA block')
const DATA = JSON.parse(dataMatch[1])

const hexToRgb = (hex) => {
  const h = hex.replace('#', '').slice(0, 6)
  return { r: parseInt(h.slice(0, 2), 16) / 255, g: parseInt(h.slice(2, 4), 16) / 255, b: parseInt(h.slice(4, 6), 16) / 255 }
}
const target = hexToRgb(DATA.palette[0].hex)

let nextId = 1
const id = () => 'n' + nextId++

function makeNode(type, name, props = {}) {
  return {
    id: id(), type, name, children: [], fills: [], strokes: [],
    layoutMode: 'NONE', inferredAutoLayout: null,
    ...props,
  }
}

function makeFigma({ hasSystem }) {
  const created = []
  const notify = []
  const closed = []
  const errors = []

  const rect = makeNode('RECTANGLE', 'swatch', {
    fills: [{ type: 'SOLID', color: { ...target }, opacity: 1 }],
    strokes: [{ type: 'SOLID', color: { ...target }, opacity: 1 }],
  })
  const text = makeNode('TEXT', 'label', {
    fontSize: 16,
    fontName: { family: 'Inter', style: 'Regular' },
    textStyleId: '',
  })
  const flatFrame = makeNode('FRAME', 'flat row', {
    children: [rect, text],
    inferredAutoLayout: {
      layoutMode: 'HORIZONTAL', paddingLeft: 8, paddingRight: 8,
      paddingTop: 4, paddingBottom: 4, itemSpacing: 12,
      primaryAxisSizingMode: 'AUTO', counterAxisSizingMode: 'AUTO',
      primaryAxisAlignItems: 'MIN', counterAxisAlignItems: 'CENTER',
      layoutWrap: 'NO_WRAP', strokesIncludedInLayout: false,
    },
  })
  const alreadyLaidOut = makeNode('FRAME', 'already auto layout', {
    layoutMode: 'VERTICAL', children: [makeNode('RECTANGLE', 'child')],
    inferredAutoLayout: { layoutMode: 'HORIZONTAL', itemSpacing: 99 },
  })
  const page = makeNode('PAGE', 'Page 1', { children: [flatFrame, alreadyLaidOut], selection: [] })

  const existing = hasSystem
    ? [{ id: 'v1', name: DATA.palette[0].name, valuesByMode: { m1: { ...target, a: 1 } } }]
    : []

  const variables = {
    async getLocalVariablesAsync() { return existing },
    createVariableCollection(name) {
      const coll = {
        id: 'c1', name, modes: [{ modeId: 'm1', name: 'Default' }],
        renameMode(modeId, label) { this.modes[0].name = label },
        addMode(label) { return 'm2' },
      }
      created.push(coll)
      return coll
    },
    createVariable(name, coll, type) {
      const v = {
        id: 'v' + (created.length + 1), name, resolvedType: type,
        valuesByMode: {},
        setValueForMode(modeId, value) { this.valuesByMode[modeId] = value },
      }
      created.push(v)
      return v
    },
    setBoundVariableForPaint(paint, field, variable) {
      if (!paint || paint.type !== 'SOLID') throw new Error('setBoundVariableForPaint needs a SOLID paint')
      if (field !== 'color') throw new Error('unexpected bind field ' + field)
      if (!variable || !variable.id) throw new Error('binding to an undefined variable')
      return { ...paint, boundVariables: { color: { type: 'VARIABLE_ALIAS', id: variable.id } } }
    },
    createVariableAlias(v) { return { type: 'VARIABLE_ALIAS', id: v.id } },
  }

  const figma = {
    currentPage: page,
    variables,
    mixed: Symbol('mixed'),
    async getLocalTextStylesAsync() {
      return hasSystem ? [{ id: 's1', name: 'Type/body', fontSize: 16, fontName: { family: 'Inter', style: 'Regular' } }] : []
    },
    getLocalTextStyles() { return [] },
    notify(message) { notify.push(message) },
    closePlugin(message) { closed.push(message) },
  }

  return { figma, rect, text, flatFrame, alreadyLaidOut, created, notify, closed, errors }
}

async function run(hasSystem) {
  const stub = makeFigma({ hasSystem })
  const context = vm.createContext({
    figma: stub.figma,
    console: { log() {}, warn() {}, error: (m) => stub.errors.push(String(m)) },
    JSON, Math, Number, Object, Array, String, Symbol, Promise, Set, Map, isNaN, parseInt, parseFloat,
  })
  let thrown = null
  try {
    vm.runInContext(source, context, { filename: file, timeout: 20000 })
    await new Promise((r) => setTimeout(r, 50))
  } catch (e) {
    thrown = e
  }
  return { ...stub, thrown }
}

const withSystem = await run(true)
const emptyFile = await run(false)

const summary = withSystem.closed[0] || ''
const counts = /bound (\d+) fills, (\d+) strokes, (\d+) text styles/.exec(summary)
const report = {
  file,
  brand: DATA.brand,
  palette: DATA.palette.length,
  inferLayout: DATA.inferLayout,
  withSystem: {
    thrown: withSystem.thrown ? withSystem.thrown.message : null,
    summary,
    fillsBound: counts ? Number(counts[1]) : 0,
    strokesBound: counts ? Number(counts[2]) : 0,
    textsStyled: counts ? Number(counts[3]) : 0,
    paintHasBinding: Boolean(withSystem.rect.fills[0].boundVariables),
    strokeHasBinding: Boolean(withSystem.rect.strokes[0].boundVariables),
    textStyleApplied: withSystem.text.textStyleId === 's1',
    flatFrameLayout: withSystem.flatFrame.layoutMode,
    alreadyLaidOutUntouched: withSystem.alreadyLaidOut.layoutMode,
    consoleErrors: withSystem.errors,
  },
  emptyFile: {
    thrown: emptyFile.thrown ? emptyFile.thrown.message : null,
    summary: emptyFile.closed[0] || '',
    variablesCreated: emptyFile.created.filter((x) => x.valuesByMode).length,
    paintHasBinding: Boolean(emptyFile.rect.fills[0].boundVariables),
    consoleErrors: emptyFile.errors,
  },
}

const problems = []
if (withSystem.thrown) problems.push('plugin threw with a system present: ' + withSystem.thrown.message)
if (emptyFile.thrown) problems.push('plugin threw on an empty file: ' + emptyFile.thrown.message)
if (!counts) problems.push('no close summary was produced')
if (report.withSystem.fillsBound < 1) problems.push('no fill was bound')
if (report.withSystem.strokesBound < 1) problems.push('no stroke was bound')
if (report.withSystem.textsStyled < 1) problems.push('no text style was applied')
if (!report.withSystem.paintHasBinding) problems.push('fill binding was not written back to the node')
if (!report.withSystem.strokeHasBinding) problems.push('stroke binding was not written back to the node')
if (!report.withSystem.textStyleApplied) problems.push('text style was not written back to the node')
if (DATA.inferLayout && report.withSystem.flatFrameLayout !== 'HORIZONTAL') problems.push('inferred auto layout was not applied')
if (!DATA.inferLayout && report.withSystem.flatFrameLayout !== 'NONE') problems.push('auto layout was applied while inferLayout is off')
if (report.withSystem.alreadyLaidOutUntouched !== 'VERTICAL') problems.push('a frame that already had auto layout was modified')
if (report.emptyFile.variablesCreated !== DATA.palette.length) problems.push('fallback collection did not create every primitive colour')
if (!report.emptyFile.paintHasBinding) problems.push('fallback variables were not used for binding')
if (withSystem.errors.length || emptyFile.errors.length) problems.push('the plugin logged errors')
if (/failed|error\(s\)/i.test(summary)) problems.push('the plugin reported failures: ' + summary)

console.log(JSON.stringify(report, null, 2))
if (problems.length) {
  console.error('\n  ✗ ' + problems.join('\n  ✗ ') + '\n')
  process.exit(1)
}
console.log(`\n  ✓ ${DATA.brand}: fills, strokes, text styles and fallback collection all bound; inferLayout=${DATA.inferLayout}\n`)
