#!/usr/bin/env node
/**
 * scaffold-ui.mjs — Deterministic Landing Page & Faux-UI Scaffolder
 *
 * Reads features/<slug>/tokens.json and scaffolds a token-wired React/CSS Modules
 * or standalone HTML page matching the brand's surface contract and macrostructure.
 *
 * Usage:
 *   node skills/sunnyside-taste-ui/scripts/scaffold-ui.mjs --slug <slug> [--kind software|hardware|hospitality|editorial] [--out <dir>] [--html]
 */
import { existsSync } from 'node:fs'
import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const args = process.argv.slice(2)
const flag = (name, fallback) => {
  const i = args.indexOf(`--${name}`)
  return i === -1 ? fallback : args[i + 1]
}
const has = (name) => args.includes(`--${name}`)

if (has('help') || !args.length) {
  console.log(`
Sunnyside Taste UI Scaffolder
Usage:
  node scaffold-ui.mjs --slug <slug> [--kind software|hardware|hospitality|editorial] [--out <dir>] [--html] [--root .]
`)
  process.exit(0)
}

const root = resolve(flag('root', '.'))
const slug = flag('slug', '').toLowerCase()
if (!slug) {
  console.error('scaffold-ui: --slug <slug> is required.')
  process.exit(1)
}

const kind = flag('kind', 'software')
const outDir = resolve(root, flag('out', join('features', slug, 'landing')))
const isHtml = has('html')

// Resolve tokens.json
const candidateTokens = [
  join(root, 'features', slug, 'tokens.json'),
  join(root, 'features', 'design-system', 'tokens.json'),
  join(root, 'public', 'brand', slug, 'tokens.json'),
]
const tokenPath = candidateTokens.find(existsSync)
if (!tokenPath) {
  console.error(`scaffold-ui: tokens.json not found for slug "${slug}". Run brand forge first.`)
  process.exit(1)
}

const tokens = JSON.parse(await readFile(tokenPath, 'utf8'))
const meta = tokens.meta || {}
const brandName = meta.name || slug
const ns = meta.namespace || `--${slug.slice(0, 2)}-`

await mkdir(outDir, { recursive: true })

if (isHtml) {
  // Generate standalone HTML
  const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${brandName} — Living Interface</title>
  <link rel="stylesheet" href="/brand/${slug}/${slug}-tokens.css">
  <style>
    :root {
      --font-display: ${tokens.type?.[0]?.value || 'system-ui'};
      --font-reading: ${tokens.type?.[1]?.value || 'system-ui'};
      --font-mono: ${tokens.type?.[2]?.value || 'monospace'};
    }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      background: var(${ns}surface-page, #faf7f2);
      color: var(${ns}text-primary, #111111);
      font-family: var(--font-reading);
      line-height: 1.55;
      -webkit-font-smoothing: antialiased;
    }
    .wrap {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 24px;
    }
    header.nav {
      position: sticky;
      top: 0;
      z-index: 100;
      background: color-mix(in oklab, var(${ns}surface-page, #faf7f2) 90%, transparent);
      backdrop-filter: blur(12px);
      border-bottom: 1px solid color-mix(in oklab, var(${ns}text-primary, #111) 8%, transparent);
      padding: 16px 0;
    }
    .navInner {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .brandTitle {
      font-family: var(--font-display);
      font-weight: 700;
      font-size: 18px;
    }
    .hero {
      padding: 96px 0 64px;
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 56px;
      align-items: center;
    }
    .hero h1 {
      font-family: var(--font-display);
      font-size: clamp(40px, 5.5vw, 72px);
      line-height: 0.96;
      letter-spacing: -0.03em;
      max-width: 18ch;
      margin-bottom: 24px;
    }
    .hero p {
      font-size: 18px;
      max-width: 46ch;
      margin-bottom: 32px;
      color: var(${ns}text-primary, #111);
    }
    .ctaButton {
      display: inline-block;
      background: var(${ns}accent, #d84b2a);
      color: #fff;
      padding: 12px 28px;
      border-radius: 8px;
      text-decoration: none;
      font-weight: 600;
      transition: transform 140ms cubic-bezier(0.22, 1, 0.36, 1);
    }
    .ctaButton:active {
      transform: scale(0.97);
    }
    .fauxStage {
      background: var(${ns}surface-plate, #ffffff);
      border: 1px solid color-mix(in oklab, var(${ns}text-primary, #111) 12%, transparent);
      border-radius: 16px;
      padding: 24px;
      box-shadow: 0 24px 48px -12px rgba(0, 0, 0, 0.08);
    }
    .metricLedger {
      padding: 64px 0;
      border-top: 1px solid color-mix(in oklab, var(${ns}text-primary, #111) 12%, transparent);
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 24px;
    }
    .metricItem dt {
      font-size: 13px;
      color: color-mix(in oklab, var(${ns}text-primary, #111) 62%, transparent);
      margin-bottom: 6px;
    }
    .metricItem dd {
      font-size: 28px;
      font-weight: 700;
      font-variant-numeric: tabular-nums;
    }
    footer.receipt {
      border-top: 1px solid color-mix(in oklab, var(${ns}text-primary, #111) 16%, transparent);
      padding: 48px 0;
      display: flex;
      justify-content: space-between;
      align-items: baseline;
      font-size: 14px;
    }
  </style>
</head>
<body>
  <header class="nav">
    <div class="wrap navInner">
      <div class="brandTitle">${brandName}</div>
      <a href="#action" class="ctaButton" style="padding: 6px 16px; font-size: 14px;">Open Console</a>
    </div>
  </header>

  <main class="wrap">
    <section class="hero">
      <div>
        <h1>Built for deep operations.</h1>
        <p>${meta.promise || meta.essence || 'A living interface engineered with zero drift, verified contrast, and tactile physical physics.'}</p>
        <a href="#action" class="ctaButton">Explore the Platform &rarr;</a>
      </div>
      <div class="fauxStage">
        <div style="font-family: var(--font-mono); font-size: 12px; color: var(${ns}accent, #d84b2a); margin-bottom: 12px;">ACTIVE CLUSTER &middot; 48ms</div>
        <div style="height: 180px; display: grid; place-items: center; border: 1px dashed color-mix(in oklab, var(${ns}text-primary, #111) 18%, transparent); border-radius: 8px;">
          <span>Living Product Stage</span>
        </div>
      </div>
    </section>

    <section class="metricLedger">
      <dl class="metricItem"><dt>Active nodes</dt><dd>1,024</dd></dl>
      <dl class="metricItem"><dt>P99 Latency</dt><dd>0.84ms</dd></dl>
      <dl class="metricItem"><dt>Availability</dt><dd>99.995%</dd></dl>
      <dl class="metricItem"><dt>Telemetry points</dt><dd>14.2M/s</dd></dl>
    </section>
  </main>

  <footer class="receipt wrap">
    <div>${brandName} &middot; Field Manual 2026</div>
    <div>Zero AI-defaults &middot; Pure brand tokens</div>
  </footer>
</body>
</html>
`
  const htmlFile = join(outDir, 'index.html')
  await writeFile(htmlFile, htmlContent, 'utf8')
  console.log(`scaffold-ui: written standalone HTML → ${htmlFile}`)
} else {
  // Scaffolding Next.js React TSX + CSS Modules
  const tsxContent = `import React from 'react'
import styles from './landing.module.css'

export function ${brandName.replace(/[^a-zA-Z0-9]/g, '')}LandingPage() {
  return (
    <div className={styles.page}>
      <header className={styles.nav}>
        <div className={styles.wrap}>
          <div className={styles.navInner}>
            <div className={styles.brandTitle}>${brandName}</div>
            <a href="#action" className={styles.ctaButtonSm}>Console &rarr;</a>
          </div>
        </div>
      </header>

      <main className={styles.wrap}>
        <section className={styles.hero}>
          <div className={styles.heroCopy}>
            <h1 className={styles.headline}>Built for deep operations.</h1>
            <p className={styles.lede}>
              ${meta.promise || meta.essence || 'Engineered with zero drift, verified contrast, and tactile physical physics.'}
            </p>
            <div className={styles.actionRow}>
              <a href="#action" className={styles.ctaButton}>Get Started &rarr;</a>
              <a href="#docs" className={styles.linkPlain}>Read the spec &rarr;</a>
            </div>
          </div>

          <div className={styles.stageSlot}>
            <div className={styles.fauxWindow}>
              <div className={styles.stageTitlebar}>
                <span className={styles.dot} />
                <span className={styles.dot} />
                <span className={styles.dot} />
                <span className={styles.stagePath}>cluster.app / live</span>
              </div>
              <div className={styles.stageInner}>
                <div className={styles.stageBadge}>Operational &middot; 0.4ms</div>
                <div className={styles.stagePlaceholder}>Live telemetry stage</div>
              </div>
            </div>
          </div>
        </section>

        <section className={styles.ledger}>
          <dl className={styles.ledgerCell}><dt>Active nodes</dt><dd>1,024</dd></dl>
          <dl className={styles.ledgerCell}><dt>P99 Latency</dt><dd>0.84ms</dd></dl>
          <dl className={styles.ledgerCell}><dt>Availability</dt><dd>99.995%</dd></dl>
          <dl className={styles.ledgerCell}><dt>Throughput</dt><dd>14.2 GB/s</dd></dl>
        </section>
      </main>

      <footer className={styles.footer}>
        <div className={styles.wrap}>
          <div className={styles.footerInner}>
            <span>${brandName} &middot; Shipped 2026</span>
            <span>Verified WCAG AA &middot; Zero slop</span>
          </div>
        </div>
      </footer>
    </div>
  )
}
`

  const cssContent = `.page {
  background: var(${ns}surface-page, #faf7f2);
  color: var(${ns}text-primary, #111111);
  min-height: 100vh;
  font-family: var(${ns}font-reading, sans-serif);
}

.wrap {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px;
}

.nav {
  position: sticky;
  top: 0;
  z-index: 100;
  background: color-mix(in oklab, var(${ns}surface-page, #faf7f2) 90%, transparent);
  backdrop-filter: blur(12px);
  border-bottom: 1px solid color-mix(in oklab, var(${ns}text-primary, #111) 8%, transparent);
  padding: 16px 0;
}

.navInner {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.brandTitle {
  font-family: var(${ns}font-display, sans-serif);
  font-weight: 700;
  font-size: 18px;
}

.hero {
  padding: 96px 0 64px;
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
  gap: 56px;
  align-items: center;
}

.headline {
  font-family: var(${ns}font-display, sans-serif);
  font-size: clamp(38px, 5.2vw, 68px);
  line-height: 0.96;
  letter-spacing: -0.03em;
  max-width: 18ch;
  margin-bottom: 24px;
}

.lede {
  font-size: 18px;
  max-width: 46ch;
  line-height: 1.55;
  margin-bottom: 32px;
}

.actionRow {
  display: flex;
  align-items: center;
  gap: 20px;
}

.ctaButton {
  background: var(${ns}accent, #d84b2a);
  color: #fff;
  padding: 12px 28px;
  border-radius: var(${ns}radius-sm, 8px);
  text-decoration: none;
  font-weight: 600;
  transition: transform 140ms cubic-bezier(0.22, 1, 0.36, 1);
}

.ctaButton:active {
  transform: scale(0.97);
}

.ctaButtonSm {
  background: var(${ns}accent, #d84b2a);
  color: #fff;
  padding: 6px 16px;
  border-radius: var(${ns}radius-sm, 8px);
  text-decoration: none;
  font-size: 13.5px;
  font-weight: 600;
}

.linkPlain {
  color: var(${ns}text-primary, #111);
  text-decoration: none;
  font-weight: 500;
}

.fauxWindow {
  background: var(${ns}surface-plate, #ffffff);
  border: 1px solid color-mix(in oklab, var(${ns}text-primary, #111) 12%, transparent);
  border-radius: var(${ns}radius-lg, 16px);
  overflow: hidden;
  box-shadow: 0 24px 48px -12px rgba(0, 0, 0, 0.08);
}

.stageTitlebar {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 16px;
  background: color-mix(in oklab, var(${ns}surface-plate, #fff) 94%, var(${ns}text-primary, #000));
  border-bottom: 1px solid color-mix(in oklab, var(${ns}text-primary, #111) 8%, transparent);
}

.dot {
  width: 8px;
  height: 8px;
  border-radius: 999px;
  background: color-mix(in oklab, var(${ns}text-primary, #111) 24%, transparent);
}

.stagePath {
  font-family: var(${ns}font-mono, monospace);
  font-size: 11px;
  margin-left: 12px;
  color: color-mix(in oklab, var(${ns}text-primary, #111) 60%, transparent);
}

.stageInner {
  padding: 24px;
}

.stageBadge {
  font-family: var(${ns}font-mono, monospace);
  font-size: 11.5px;
  color: var(${ns}accent, #d84b2a);
  margin-bottom: 16px;
}

.stagePlaceholder {
  height: 200px;
  display: grid;
  place-items: center;
  border: 1px dashed color-mix(in oklab, var(${ns}text-primary, #111) 16%, transparent);
  border-radius: 8px;
  font-size: 14px;
  color: color-mix(in oklab, var(${ns}text-primary, #111) 60%, transparent);
}

.ledger {
  padding: 64px 0;
  border-top: 1px solid color-mix(in oklab, var(${ns}text-primary, #111) 12%, transparent);
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 24px;
}

.ledgerCell dt {
  font-size: 13px;
  color: color-mix(in oklab, var(${ns}text-primary, #111) 62%, transparent);
  margin-bottom: 6px;
}

.ledgerCell dd {
  font-size: 28px;
  font-weight: 700;
  font-variant-numeric: tabular-nums;
}

.footer {
  border-top: 1px solid color-mix(in oklab, var(${ns}text-primary, #111) 16%, transparent);
  padding: 48px 0;
}

.footerInner {
  display: flex;
  justify-content: space-between;
  font-size: 14px;
  color: color-mix(in oklab, var(${ns}text-primary, #111) 75%, transparent);
}
`

  await writeFile(join(outDir, 'landing.tsx'), tsxContent, 'utf8')
  await writeFile(join(outDir, 'landing.module.css'), cssContent, 'utf8')
  console.log(`scaffold-ui: written React landing page → ${join(outDir, 'landing.tsx')}`)
}
