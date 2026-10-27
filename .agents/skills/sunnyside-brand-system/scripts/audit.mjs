#!/usr/bin/env node
/**
 * Static brand-system audit. No dependencies beyond Node.
 *
 *   node scripts/audit.mjs --manifest audit.json
 *
 * Manifest paths resolve from the current working directory. A manifest can
 * name required files, SVG folders, assets that must not contain <text>, the
 * favicon ICO, PNG dimensions, and a tokens JSON with contrast pairs.
 *
 * Exit code 1 means at least one check failed.
 */
import { readFile, readdir, stat } from 'node:fs/promises'
import { join, relative } from 'node:path'

const args = process.argv.slice(2)
const flag = (name, fallback) => {
  const index = args.indexOf(`--${name}`)
  return index === -1 ? fallback : args[index + 1]
}
const manifestPath = flag('manifest', 'audit.json')
const cwd = process.cwd()
const failures = []
const passes = []
const warnings = []
const fail = (message) => failures.push(message)
const pass = (message) => passes.push(message)
const warn = (message) => warnings.push(message)
const rel = (path) => relative(cwd, path) || '.'

let manifest
try {
  manifest = JSON.parse(await readFile(manifestPath, 'utf8'))
} catch (error) {
  console.error(`Cannot read manifest: ${manifestPath}\n${error.message}`)
  process.exit(1)
}

const root = join(cwd, manifest.root ?? '.')

// 1. Required files
if (Array.isArray(manifest.required)) {
  let ok = 0
  for (const file of manifest.required) {
    try {
      const info = await stat(join(root, file))
      if (!info.isFile()) throw new Error('not a file')
      ok += 1
    } catch {
      fail(`missing required file: ${file}`)
    }
  }
  pass(`required files: ${ok}/${manifest.required.length}`)
}

// 2. SVG audit
const walk = async (dir) => {
  const out = []
  let entries
  try {
    entries = await readdir(dir, { withFileTypes: true })
  } catch {
    return out
  }
  for (const entry of entries) {
    const full = join(dir, entry.name)
    if (entry.isDirectory()) out.push(...(await walk(full)))
    else if (entry.name.endsWith('.svg')) out.push(full)
  }
  return out
}

const noText = (manifest.noText ?? []).map((item) => join(root, item))
const svgs = []
for (const dir of manifest.svgDirs ?? []) {
  svgs.push(...(await walk(join(root, dir))))
}
let svgOk = 0
for (const svg of svgs) {
  const source = await readFile(svg, 'utf8')
  const hasViewBox = /viewBox\s*=\s*["'][^"']+["']/.test(source)
  const hasSvg = /<svg[\s>]/.test(source)
  const isBrandAsset =
    noText.includes(svg) ||
    noText.some((prefix) => svg === prefix || svg.startsWith(`${prefix}/`))
  if (!hasSvg || !hasViewBox) {
    fail(`invalid SVG (missing <svg> or viewBox): ${rel(svg)}`)
    continue
  }
  if (isBrandAsset && /<text[\s>]/.test(source)) {
    fail(`brand SVG contains live <text>: ${rel(svg)}`)
    continue
  }
  svgOk += 1
}
if (svgs.length > 0) {
  pass(`SVGs: ${svgOk}/${svgs.length} valid${noText.length ? ', brand assets have no <text>' : ''}`)
}

// 3. ICO sizes
if (manifest.ico) {
  const file = join(root, manifest.ico)
  try {
    const data = await readFile(file)
    if (data.readUInt16LE(0) !== 0 || data.readUInt16LE(2) !== 1) {
      throw new Error('not an ICO')
    }
    const count = data.readUInt16LE(4)
    const sizes = []
    for (let index = 0; index < count; index += 1) {
      const width = data.readUInt8(6 + index * 16) || 256
      sizes.push(width)
    }
    const expected = manifest.icoSizes ?? []
    const missing = expected.filter((size) => !sizes.includes(size))
    if (missing.length > 0) {
      fail(`ICO missing sizes: ${missing.join(', ')} (has ${sizes.join(', ')})`)
    } else {
      pass(`ICO: ${sizes.join(', ')}`)
    }
  } catch (error) {
    fail(`ICO check failed: ${rel(file)} (${error.message})`)
  }
}

// 4. PNG dimensions
if (Array.isArray(manifest.pngs)) {
  for (const item of manifest.pngs) {
    const file = join(root, item.path)
    try {
      const data = await readFile(file)
      if (data.subarray(0, 8).toString('hex') !== '89504e470d0a1a0a') {
        throw new Error('not a PNG')
      }
      const width = data.readUInt32BE(16)
      const height = data.readUInt32BE(20)
      if (item.width && item.height) {
        if (width !== item.width || height !== item.height) {
          fail(
            `PNG size: ${item.path} is ${width}×${height}, expected ${item.width}×${item.height}`,
          )
        } else {
          pass(`PNG: ${item.path} ${width}×${height}`)
        }
      } else {
        pass(`PNG: ${item.path} ${width}×${height}`)
      }
    } catch (error) {
      fail(`PNG check failed: ${item.path} (${error.message})`)
    }
  }
}

// 5. Tokens and contrast
if (manifest.tokens) {
  try {
    const tokens = JSON.parse(await readFile(join(root, manifest.tokens), 'utf8'))
    const groups = [
      ['primitives', tokens.primitives?.length],
      ['semantic.light', tokens.semantic?.light?.length],
      ['semantic.dark', tokens.semantic?.dark?.length],
      ['components.light', tokens.components?.light?.length],
      ['components.dark', tokens.components?.dark?.length],
    ]
    const missing = groups.filter(([, count]) => !count)
    if (missing.length > 0) {
      fail(`tokens missing groups: ${missing.map(([name]) => name).join(', ')}`)
    } else {
      pass(`tokens: ${groups.map(([name, count]) => `${name} ${count}`).join(', ')}`)
    }

    const pairs = Array.isArray(tokens.contrast) ? tokens.contrast : []
    if (pairs.length === 0) {
      warn('tokens file has no contrast pairs')
    } else {
      const min = manifest.contrastMin ?? 4.5
      let ok = 0
      for (const pair of pairs) {
        if (!pair.fg || !pair.bg || !/^#[0-9a-f]{6}$/i.test(pair.fg) || !/^#[0-9a-f]{6}$/i.test(pair.bg)) {
          warn(`contrast skipped (not hex): ${pair.label ?? 'unlabelled'}`)
          continue
        }
        const ratio = contrast(pair.fg, pair.bg)
        const floor = pair.min ?? min
        if (ratio + 0.005 < floor) {
          fail(
            `contrast: ${pair.label ?? `${pair.fg} on ${pair.bg}`} is ${ratio.toFixed(2)}:1, needs ${floor}:1`,
          )
        } else {
          ok += 1
        }
      }
      pass(`contrast: ${ok}/${pairs.length} pairs >= ${min}:1`)
    }
  } catch (error) {
    fail(`tokens check failed: ${rel(join(root, manifest.tokens))} (${error.message})`)
  }
}

function contrast(fg, bg) {
  const luminance = (hex) => {
    const channels = hex
      .slice(1)
      .match(/.{2}/g)
      .map((value) => Number.parseInt(value, 16) / 255)
      .map((value) =>
        value <= 0.03928 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4,
      )
    return 0.2126 * channels[0] + 0.7152 * channels[1] + 0.0722 * channels[2]
  }
  const a = luminance(fg)
  const b = luminance(bg)
  return (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05)
}

for (const message of passes) console.log(`PASS  ${message}`)
for (const message of warnings) console.log(`WARN  ${message}`)
for (const message of failures) console.log(`FAIL  ${message}`)
const verdict = failures.length === 0 ? 'PASS' : 'FAIL'
console.log(
  `\nAudit: ${verdict} — ${passes.length} passed, ${warnings.length} warnings, ${failures.length} failures`,
)
process.exit(failures.length === 0 ? 0 : 1)
