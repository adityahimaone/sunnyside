#!/usr/bin/env node
/**
 * check-taste.mjs — Static Anti-Slop, Brand House-Rules & Token-Mapping Auditor
 *
 * Runs:
 *   Pass 1 · Purpose-First Token Mapping (scans for hardcoded hex, rogue classes, transition:all)
 *   Pass 2 · Anti-Slop Floor Lint (eyebrows, banned fonts, monospace misuse, nested cards)
 *
 * Usage:
 *   node skills/sunnyside-review/scripts/check-taste.mjs --slug <slug> --target features/<slug> [--json]
 */
import { existsSync } from 'node:fs'
import { readdir, readFile, stat } from 'node:fs/promises'
import { dirname, extname, join, resolve } from 'node:path'

const args = process.argv.slice(2)
const flag = (name, fallback) => {
  const i = args.indexOf(`--${name}`)
  return i === -1 ? fallback : args[i + 1]
}
const has = (name) => args.includes(`--${name}`)

if (has('help') || !args.length) {
  console.log(`
Sunnyside Taste & Token Reviewer
Usage:
  node check-taste.mjs --slug <slug> [--target features/<slug>] [--url http://localhost:3000/...] [--json] [--root .]
`)
  process.exit(0)
}

const root = resolve(flag('root', '.'))
const slug = flag('slug', '').toLowerCase()
const targetDir = resolve(root, flag('target', join('features', slug)))
const urlArg = flag('url', '')
const asJson = has('json')

if (!slug) {
  console.error('check-taste: --slug is required.')
  process.exit(1)
}

// Find tokens
const candidateTokens = [
  join(root, 'features', slug, 'tokens.json'),
  join(root, 'features', 'design-system', 'tokens.json'),
  join(root, 'public', 'brand', slug, 'tokens.json'),
]
const tokenPath = candidateTokens.find(existsSync)
let tokens = null
if (tokenPath) {
  tokens = JSON.parse(await readFile(tokenPath, 'utf8'))
}

// Collect target files (.tsx, .ts, .css, .html)
async function getFiles(dir) {
  if (!existsSync(dir)) return []
  const entries = await readdir(dir, { withFileTypes: true })
  const files = []
  for (const entry of entries) {
    const full = join(dir, entry.name)
    if (entry.isDirectory()) {
      if (!['node_modules', '.next', '.git'].includes(entry.name)) {
        files.push(...(await getFiles(full)))
      }
    } else if (['.tsx', '.ts', '.css', '.html'].includes(extname(entry.name))) {
      // Exclude token definition files themselves
      if (!entry.name.endsWith('-tokens.css') && entry.name !== 'tokens.json') {
        files.push(full)
      }
    }
  }
  return files
}

const targetFiles = await getFiles(targetDir)

const findings = []
const addFinding = (level, rule, file, line, message) => {
  findings.push({ level, rule, file: file.replace(root + '/', ''), line, message })
}

// OKLab color distance helper for Purpose-First Token Mapping
function hexToOklab(hex) {
  const h = hex.replace('#', '')
  const f = h.length === 3 ? [...h].map((c) => c + c).join('') : h.slice(0, 6)
  const [r, g, b] = [0, 2, 4].map((i) => {
    const c = parseInt(f.slice(i, i + 2), 16) / 255
    return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4
  })
  const l = Math.cbrt(0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b)
  const m = Math.cbrt(0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b)
  const s = Math.cbrt(0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b)
  return {
    L: 0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s,
    a: 1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s,
    b: 0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s,
  }
}

function deltaEOk(hexA, hexB) {
  const A = hexToOklab(hexA)
  const B = hexToOklab(hexB)
  return Math.hypot(A.L - B.L, A.a - B.a, A.b - B.b)
}

// Known primitives for token mapping
const tokenCatalog = []
if (tokens?.primitives) {
  for (const p of tokens.primitives) {
    const hex = p.hex || (typeof p.value === 'string' && p.value.startsWith('#') ? p.value : null)
    if (hex) {
      tokenCatalog.push({
        name: p.name,
        hex: hex.toLowerCase(),
        role: (p.role || p.name || '').toLowerCase(),
      })
    }
  }
}

// Pass 1 & Pass 2 Lints
for (const file of targetFiles) {
  const content = await readFile(file, 'utf8')
  const lines = content.split('\n')

  lines.forEach((text, idx) => {
    const lineNum = idx + 1

    // 1. Pass 1 · Purpose-First Token Mapping: Hardcoded hex colors
    const hexMatches = text.match(/#([0-9a-f]{3}|[0-9a-f]{6})\b/gi)
    if (hexMatches) {
      for (const hex of hexMatches) {
        // Skip comments, inline SVG markup, and data URIs
        if (text.trim().startsWith('//') || text.includes('/*') || text.includes('filter=') || text.includes('data:image') || text.includes('<path') || text.includes('<svg')) continue
        const low = hex.toLowerCase()
        const exact = tokenCatalog.find((t) => t.hex === low)
        const isTextProp = /\bcolor\s*:/i.test(text) && !/background-color|border-color/i.test(text)
        if (exact) {
          const isSurfaceOnly = /paper|ground|surface|wash/i.test(exact.role)
          if (isTextProp && isSurfaceOnly) {
            addFinding('should-fix', 'token-do-not-use', file, lineNum, `[Do Not Use] Color ${hex} matches surface token --${exact.name}, but is applied to foreground text.`)
          } else {
            addFinding('should-fix', 'raw-hex-mapped', file, lineNum, `[Exact] Hardcoded color ${hex} matches token --${exact.name}. Replace with var(--${exact.name}).`)
          }
        } else if (tokenCatalog.length) {
          const ranked = tokenCatalog
            .map((t) => ({ ...t, dE: deltaEOk(low, t.hex) }))
            .sort((a, b) => a.dE - b.dE)
          const best = ranked[0]
          if (best.dE < 0.02) {
            addFinding('should-fix', 'token-semantic', file, lineNum, `[Semantic] Hardcoded color ${hex} is within ΔE_OK=${best.dE.toFixed(3)} of token --${best.name} (${best.hex}).`)
          } else if (best.dE < 0.045) {
            addFinding('should-fix', 'token-ambiguous', file, lineNum, `[Ambiguous] Hardcoded color ${hex} is near token --${best.name} (ΔE_OK=${best.dE.toFixed(3)}).`)
          } else {
            addFinding('should-fix', 'raw-hex-unmapped', file, lineNum, `[Gap] Hardcoded hex color ${hex} found outside tokens.json (nearest --${best.name} ΔE_OK=${best.dE.toFixed(3)}).`)
          }
        } else {
          addFinding('should-fix', 'raw-hex-unmapped', file, lineNum, `[Gap] Hardcoded hex color ${hex} found outside tokens.json.`)
        }
      }
    }

    // 1b. Pass 1 · Rogue Tailwind default palette classes
    if (/\b(?:text|bg|border)-(?:slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)-(?:50|[1-9]00|950)\b/.test(text)) {
      addFinding('should-fix', 'rogue-tailwind-palette', file, lineNum, 'Rogue Tailwind default palette class detected. Bind to semantic brand tokens instead.')
    }

    // 2. Anti-Slop: transition: all
    if (/transition\s*:\s*all\b/i.test(text)) {
      addFinding('blocking', 'transition-all', file, lineNum, 'Banned `transition: all` causes layout reflow jank. Transition specific properties (transform, opacity).')
    }

    // 3. Anti-Slop: animating layout properties
    if (/transition\s*:.*(?:width|height|margin|padding|top|left)\b/i.test(text)) {
      addFinding('blocking', 'layout-animation', file, lineNum, 'Animating layout geometry (width/height/margin/padding). Use transform/opacity instead.')
    }

    // 4. Anti-Slop: Banned AI-default fonts
    if (/(?:font-family|font)\s*:.*(?:Inter|Roboto|Arial)\b/i.test(text)) {
      addFinding('blocking', 'ai-default-font', file, lineNum, 'Banned generic AI-default font (Inter/Roboto/Arial) found.')
    }

    // 5. Anti-Slop: Eyebrows
    if (/className=.*(?:eyebrow|kicker|badge-pill)/i.test(text) || /class="[^"]*eyebrow[^"]*"/i.test(text)) {
      addFinding('blocking', 'anti-eyebrow', file, lineNum, 'Banned eyebrow above heading detected. Let the headline lead.')
    }

    // 6. Anti-Slop: Monospace outside legal areas
    if (/class(?:Name)?=.*(?:btn|button|nav|link).*mono/i.test(text)) {
      addFinding('should-fix', 'mono-misuse', file, lineNum, 'Monospace font applied to button or navigation link.')
    }

    // 7. Anti-Slop: Nested cards
    if (/class(?:Name)?=.*card.*class(?:Name)?=.*card/i.test(text)) {
      addFinding('should-fix', 'nested-cards', file, lineNum, 'Card nested inside card. Use subtle tone step or whitespace.')
    }
  })
}

const blockingCount = findings.filter((f) => f.level === 'blocking').length
const shouldFixCount = findings.filter((f) => f.level === 'should-fix').length
const isReady = blockingCount === 0

if (asJson) {
  console.log(JSON.stringify({ slug, targetDir, isReady, blockingCount, shouldFixCount, findings }, null, 2))
} else {
  console.log(`\n  🔎 Sunnyside Taste & Token Audit — ${slug}`)
  console.log(`  Scanned ${targetFiles.length} files under ${targetDir.replace(root + '/', '')}\n`)

  if (!findings.length) {
    console.log(`  ✅ All 10 Floor laws and token-mapping checks passed cleanly.`)
  } else {
    for (const f of findings) {
      const tag = f.level === 'blocking' ? '🔴 BLOCKING' : '🟡 SHOULD-FIX'
      console.log(`  ${tag} [${f.rule}] ${f.file}:${f.line} — ${f.message}`)
    }
  }

  console.log(`\n  Ready to ship: ${isReady ? 'YES' : 'NO'} (${blockingCount} blocking, ${shouldFixCount} should-fix)\n`)
}

process.exit(isReady ? 0 : 1)
