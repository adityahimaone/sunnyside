#!/usr/bin/env node
/**
 * canvas — drive OpenPencil headlessly, with no app and no MCP token.
 *
 *   node scripts/canvas.mjs build  --html design-system.html --css tokens.css \
 *                                  --tokens tokens.json --brand public/brand/<slug> \
 *                                  --name "<Name>" --out design/<slug>.fig
 *   node scripts/canvas.mjs verify --file design/<slug>.fig [--expect 11]
 *   node scripts/canvas.mjs split  --file design/<slug>.fig
 *   node scripts/canvas.mjs export --file design/<slug>.fig --page "00 · Cover" -o cover.png
 *
 * Why headless: the app path needs a token that rotates on every relaunch, an
 * RPC that times out after 20s, and a save that silently returns a stale file.
 * `openpencil import` and `openpencil eval` need none of it and are reproducible.
 *
 * What headless cannot do: variables, text styles, paint styles. `typeof
 * figma.variables` is "undefined" in the eval runtime (0.16.0). Those belong to
 * the Figma plugin in sunnyside-brand-system, not here.
 */
import { execFileSync, spawnSync } from 'node:child_process'
import { existsSync } from 'node:fs'
import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { dirname, join, resolve, basename } from 'node:path'

const argv = process.argv.slice(2)
const cmd = argv[0]
const one = (name, fallback) => {
  const i = argv.indexOf(`--${name}`)
  return i === -1 ? fallback : argv[i + 1]
}
/* accept -o and --output for the same thing; -o is what every CLI user types */
const short = (name, fallback) => {
  const i = argv.indexOf(`-${name}`)
  if (i !== -1) return argv[i + 1]
  return one(name, fallback)
}
const has = (name) => argv.includes(`--${name}`)

const die = (m) => {
  console.error(`\n  ✗ ${m}\n`)
  process.exit(1)
}

function run(bin, args, opts = {}) {
  return execFileSync(bin, args, { encoding: 'utf8', maxBuffer: 64 * 1024 * 1024, ...opts })
}

function haveOpenpencil() {
  try {
    run('openpencil', ['--version'])
    return true
  } catch (e) {
    return false
  }
}

/* ── the eval payload ────────────────────────────────────────────────────── */

function polishScript(spec) {
  return `
const SPEC = ${JSON.stringify(spec)};
const report = { pages: [], renamed: 0, errors: [] };
const fail = (w, e) => report.errors.push(w + ': ' + ((e && e.message) || String(e)));

const rgb = (hex) => {
  let h = String(hex || '#000').replace('#', '');
  if (h.length === 3) h = h[0] + h[0] + h[1] + h[1] + h[2] + h[2];
  const n = parseInt(h.slice(0, 6), 16) || 0;
  return { r: ((n >> 16) & 255) / 255, g: ((n >> 8) & 255) / 255, b: (n & 255) / 255 };
};
const solid = (hex, a) => ({ type: 'SOLID', color: rgb(hex), opacity: a == null ? 1 : a });

function frame(parent, name, x, y, w, h, fill) {
  const f = figma.createFrame();
  f.name = name; f.x = x; f.y = y; f.resize(w, h);
  f.fills = fill ? [solid(fill)] : [];
  if (parent) parent.appendChild(f);
  return f;
}
function label(parent, text, x, y, size, colour, family) {
  const t = figma.createText();
  t.characters = String(text);
  t.fontSize = size;
  t.fills = [solid(colour)];
  try { if (family) t.fontName = { family, style: 'Regular' }; } catch (e) {}
  t.x = x; t.y = y;
  if (parent) parent.appendChild(t);
  return t;
}
function swatch(parent, name, x, y, w, h, fill, radius) {
  const r = figma.createRectangle();
  r.name = name; r.x = x; r.y = y; r.resize(w, h);
  r.fills = fill ? [solid(fill)] : [];
  if (radius) r.cornerRadius = radius;
  if (parent) parent.appendChild(r);
  return r;
}

/* 1 · rename the imported sections so the tree reads as an index */
const host = figma.root.children.find((p) => p.name === SPEC.pageName) || figma.root.children[0];
if (host) {
  figma.currentPage = host;
  const wanted = SPEC.sections || [];
  let top = null;
  const walk = (node, depth) => {
    if (!node || depth > 3 || !node.children) return null;
    const hits = node.children.filter((c) => wanted.includes(c.name));
    if (hits.length >= Math.max(3, wanted.length - 4)) return node;
    for (const c of node.children) { const hit = walk(c, depth + 1); if (hit) return hit; }
    return null;
  };
  top = walk(host, 0);
  if (top) {
    for (const child of top.children) {
      const i = wanted.indexOf(child.name);
      if (i === -1) continue;
      child.name = String(i + 1).padStart(2, '0') + ' · ' + child.name;
      report.renamed++;
    }
  } else {
    fail('rename', new Error('no frame held the section names'));
  }
}

/* 2 · a cover, because a file that opens on a wall of sections has no title */
if (SPEC.name) {
  const page = figma.createPage();
  page.name = '00 · Cover';
  figma.currentPage = page;
  const W = 1600, H = 900;
  const f = frame(page, 'Cover', 0, 0, W, H, SPEC.paper);
  label(f, SPEC.name, 96, 120, 120, SPEC.ink, SPEC.font);
  if (SPEC.essence) label(f, SPEC.essence, 96, 290, 24, SPEC.muted, SPEC.font);
  let x = 96;
  const strip = (SPEC.swatches || []).slice(0, 8);
  const cw = (W - 192) / Math.max(strip.length, 1);
  for (const s of strip) { swatch(f, 'palette/' + s.name, x, 620, cw - 4, 170, s.hex); x += cw; }
  report.pages.push(page.name);
}

/* 3 · the marks, as vectors, not as text */
if (SPEC.assets && SPEC.assets.length) {
  const page = figma.createPage();
  page.name = '90 · Marks';
  figma.currentPage = page;
  const pad = 64, cell = 320, cols = 3;
  const rows = Math.ceil(SPEC.assets.length / cols);
  const f = frame(page, 'Marks', 0, 0, pad * 2 + cols * cell, pad * 2 + 90 + rows * (cell + 36), SPEC.paper);
  label(f, 'Marks', pad, pad, 44, SPEC.ink, SPEC.font);
  SPEC.assets.forEach((a, i) => {
    const cx = pad + (i % cols) * cell;
    const cy = pad + 90 + Math.floor(i / cols) * (cell + 36);
    const box = frame(f, a.name, cx, cy, cell - 16, cell - 16, SPEC.raised);
    try {
      const node = figma.createNodeFromSvg(a.svg);
      box.appendChild(node);
      const scale = Math.min((box.width - 48) / node.width, (box.height - 48) / node.height, 1);
      if (scale > 0 && Number.isFinite(scale)) node.rescale(scale);
      node.x = Math.max((box.width - node.width) / 2, 0);
      node.y = Math.max((box.height - node.height) / 2, 0);
    } catch (e) { fail('mark/' + a.name, e); }
    label(f, a.name, cx, cy + cell - 6, 12, SPEC.muted, SPEC.font);
  });
  report.pages.push(page.name);
}

report.total = figma.root.children.length;
JSON.stringify(report);
`
}

/* ── token + asset readers (shared by build) ─────────────────────────────── */

const V = (n) => (n && typeof n === 'object' ? (n.$value ?? n.value) : n)

function colourOf(value, vars, depth = 0) {
  if (value == null || depth > 6) return null
  const s = String(value).trim()
  const v = s.match(/^var\(\s*--([\w-]+)\s*(?:,\s*([^)]+))?\)$/)
  if (v) return colourOf((vars && vars[v[1]]) ?? v[2], vars, depth + 1)
  if (s.startsWith('#')) {
    let h = s.slice(1)
    if (h.length === 3) h = h[0] + h[0] + h[1] + h[1] + h[2] + h[2]
    return '#' + h.slice(0, 6).toUpperCase()
  }
  const fn = s.match(/^rgba?\(([^)]+)\)$/i)
  if (fn) {
    const p = fn[1].includes('/') ? fn[1].split('/')[0].trim().split(/\s+/) : fn[1].split(/[,\s]+/).filter(Boolean)
    const [r, g, b] = p.slice(0, 3).map((x) => Math.round(parseFloat(x)))
    if ([r, g, b].some(Number.isNaN)) return null
    return '#' + [r, g, b].map((n) => Math.max(0, Math.min(255, n)).toString(16).padStart(2, '0')).join('').toUpperCase()
  }
  return null
}

function cssVars(css) {
  const out = {}
  const re = /--([\w-]+)\s*:\s*([^;{}]+);/g
  let m
  while ((m = re.exec(css))) out[m[1]] = m[2].trim()
  return out
}

function firstFamily(stack) {
  if (!stack) return ''
  const generic = /^(serif|sans-serif|monospace|system-ui|ui-.*|cursive|fantasy|inherit|initial)$/i
  return (
    String(stack)
      .split(',')
      .map((p) => p.trim().replace(/^['"]|['"]$/g, ''))
      .find((p) => p && !generic.test(p)) || ''
  )
}

function sanitizeSvg(svg) {
  let out = String(svg)
    .replace(/<!--[\s\S]*?-->/g, '')
    .replace(/var\(\s*--[\w-]+\s*,\s*(#[0-9a-fA-F]{3,8})\s*\)/g, '$1')
    .replace(/var\(\s*--[\w-]+\s*\)/g, 'currentColor')
  const open = out.match(/<svg\b[^>]*>/i)
  if (!open) return ''
  let tag = open[0]
  const vb = tag.match(/viewBox=["']([^"']+)["']/i)
  const w = tag.match(/\bwidth=["']([\d.]+)/i)
  const h = tag.match(/\bheight=["']([\d.]+)/i)
  if (!vb && w && h) tag = tag.replace(/<svg/i, `<svg viewBox="0 0 ${w[1]} ${h[1]}"`)
  tag = tag.replace(/\s(width|height)=["'][^"']*["']/gi, '')
  return out.replace(open[0], tag)
}

/* ── commands ────────────────────────────────────────────────────────────── */

async function build() {
  if (!haveOpenpencil()) die('the `openpencil` CLI is not on PATH — `bun add -g @open-pencil/cli`')

  const html = one('html', '')
  const css = one('css', '')
  const tokensPath = one('tokens', '')
  const brand = one('brand', '')
  const out = resolve(one('out', 'design/canvas.fig'))
  const pageName = one('page', 'Design System')

  if (!html || !existsSync(html)) die(`no HTML at ${html}`)

  const spec = { pageName, name: one('name', ''), essence: one('essence', ''), font: one('font', 'Inter') }

  if (tokensPath && existsSync(tokensPath)) {
    const tokens = JSON.parse(await readFile(tokensPath, 'utf8'))
    const vars = css && existsSync(css) ? cssVars(await readFile(css, 'utf8')) : {}
    const prim = tokens.color?.primitive || tokens.primitives || tokens.palette || tokens.color || {}
    spec.swatches = Object.entries(prim)
      .map(([name, v]) => ({ name, hex: colourOf(V(v), vars) }))
      .filter((s) => s.hex)
      .slice(0, 8)
    const sem = tokens.color?.light || tokens.semantic?.light || tokens.semantic || {}
    const pick = (n) => colourOf(V(sem[n]), vars)
    spec.paper = pick('surface') || spec.swatches[0]?.hex || '#FFFFFF'
    spec.ink = pick('ink') || '#111111'
    spec.muted = pick('ink-muted') || spec.ink
    spec.raised = pick('surface-raised') || spec.paper
  } else {
    spec.paper = '#FFFFFF'
    spec.ink = '#111111'
    spec.muted = '#666666'
    spec.raised = '#F4F4F4'
    spec.swatches = []
  }

  const htmlText = await readFile(html, 'utf8')
  spec.sections = [...new Set([...htmlText.matchAll(/<section[^>]*\bid=["']([^"']+)["']/g)].map((m) => m[1]))]

  if (brand && existsSync(brand)) {
    const { readdir } = await import('node:fs/promises')
    const files = (await readdir(brand)).filter((f) => f.endsWith('.svg')).sort()
    spec.assets = []
    for (const f of files) {
      const svg = sanitizeSvg(await readFile(join(brand, f), 'utf8'))
      if (svg) spec.assets.push({ name: f.replace(/\.svg$/, ''), svg })
    }
  }

  await mkdir(dirname(out), { recursive: true })
  console.log(`  importing ${basename(html)} → ${basename(out)}`)
  const impArgs = ['import', html, '-o', out, '--pageName', pageName]
  if (css && existsSync(css)) impArgs.push('--css', css)
  run('openpencil', impArgs, { stdio: 'inherit' })

  const script = polishScript(spec)
  const scriptPath = join(dirname(out), 'canvas.polish.js')
  await writeFile(scriptPath, script)
  console.log(`  polishing (${spec.sections.length} sections, ${(spec.assets || []).length} marks)`)
  const result = run('openpencil', ['eval', out, '-w', '-c', script])
  console.log('  ' + result.trim())

  await verify(out, spec.sections.length)
}

async function verify(fileArg, expectArg) {
  const file = resolve(fileArg || one('file', 'design/canvas.fig'))
  const expect = Number(expectArg ?? one('expect', 0)) || 0
  if (!existsSync(file)) die(`no file at ${file}`)

  const info = run('openpencil', ['info', file])
  const tree = run('openpencil', ['tree', file, '--depth', '2'])
  const pages = (info.match(/(\d+)\s+pages/) || [])[1] || '?'
  const nodes = (info.match(/(\d+)\s+nodes/) || [])[1] || '?'
  const fonts = (info.match(/Fonts:\s*(.+)/) || [])[1] || ''

  const numbered = [...tree.matchAll(/"(\d{2}) · ([\w-]+)"/g)].map((m) => m[1] + ' ' + m[2])
  const problems = []
  if (!numbered.length) problems.push('no section frame is named "NN · name" — the tree is not an index')
  if (expect && numbered.length !== expect) {
    problems.push(`expected ${expect} numbered sections, found ${numbered.length}`)
  }

  /* lint exits 1 when it finds anything, and a large document's JSON truncates
   * when it is read from a pipe — 65KB came back as "Unexpected end of JSON
   * input". Redirect to a file, then parse the file. */
  let lint = null
  let lintWhy = ''
  const lintFile = join(dirname(file), '.' + basename(file) + '.lint.json')
  const q = (p) => "'" + String(p).replace(/'/g, "'\\''") + "'"
  spawnSync('sh', ['-c', `openpencil lint ${q(file)} --json > ${q(lintFile)} 2>/dev/null`], {
    encoding: 'utf8',
  })
  try {
    lint = JSON.parse(await readFile(lintFile, 'utf8'))
  } catch (e) {
    lintWhy = e.message
  }

  const report = {
    file,
    pages: Number(pages),
    nodes: Number(nodes),
    fonts,
    sections: numbered,
    lint: lint
      ? {
          errors: lint.errorCount ?? null,
          warnings: lint.warningCount ?? null,
          contrast: (lint.messages || []).filter((m) => m.ruleId === 'color-contrast').length,
        }
      : 'unavailable' + (lintWhy ? ': ' + lintWhy : ''),
    problems,
  }
  console.log(JSON.stringify(report, null, 2))
  if (problems.length) {
    console.error('\n  ✗ ' + problems.join('\n  ✗ ') + '\n')
    process.exit(1)
  }
}

async function split() {
  const file = resolve(one('file', ''))
  if (!existsSync(file)) die(`no file at ${file}`)
  /* One page per section, when the sections are longer than a screen. */
  const script = `
const host = figma.root.children.find((p) => p.name === ${JSON.stringify(one('page', 'Design System'))}) || figma.root.children[0];
figma.currentPage = host;
const all = [];
const walk = (n, d) => {
  if (!n || d > 3 || !n.children) return;
  for (const c of n.children) { if (/^\\d{2} · /.test(c.name)) all.push(c); else walk(c, d + 1); }
};
walk(host, 0);
for (const section of all) {
  const p = figma.createPage();
  p.name = section.name;
  p.appendChild(section);
  section.x = 0; section.y = 0;
}
JSON.stringify({ moved: all.length, pages: figma.root.children.length });
`
  const result = run('openpencil', ['eval', file, '-w', '-c', script])
  console.log(result.trim())
}

async function exportPage() {
  const file = resolve(one('file', ''))
  const page = one('page', '')
  const out = short('o', one('output', 'export.png'))
  if (!existsSync(file)) die(`no file at ${file}`)
  const args = ['export', file, '-o', out]
  if (page) args.push('--page', page)
  if (has('node')) args.push('--node', one('node', ''))
  run('openpencil', args, { stdio: 'inherit' })
}

const COMMANDS = { build, verify: () => verify(), split, export: exportPage }
if (!COMMANDS[cmd]) {
  console.error(`Usage:
  node scripts/canvas.mjs build  --html <page.html> [--css <tokens.css>] [--tokens <tokens.json>]
                                 [--brand <svg dir>] [--name "<Name>"] [--essence "..."]
                                 [--font Inter] [--out design/<slug>.fig]
  node scripts/canvas.mjs verify --file <file.fig> [--expect 11]
  node scripts/canvas.mjs split  --file <file.fig> [--page "Design System"]
  node scripts/canvas.mjs export --file <file.fig> --page "00 · Cover" -o cover.png`)
  process.exit(1)
}
await COMMANDS[cmd]()
