// The specimen is the same page as the app route, built from the same files.
//
//   node scripts/build-specimen.mjs [--css <path to wildflower-wind.module.css>]
//
// The React page in the app is the source of truth for layout; this reads that
// module CSS verbatim and the case's own tokens.json, then writes a standalone
// index.html with the styles inlined. Nothing is retyped, so the two cannot
// disagree about a colour, a radius or a ratio — only about a word.

import { readFile, writeFile } from 'node:fs/promises'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const here = dirname(fileURLToPath(import.meta.url))
const root = join(here, '..')

const arg = (n, d) => {
  const i = process.argv.indexOf(`--${n}`)
  return i === -1 ? d : process.argv[i + 1]
}

const cssPath = resolve(
  arg('css', join(root, '..', '..', '..', 'Development', 'sunnyside', 'features', 'wildflower-wind', 'wildflower-wind.module.css')),
)

const tokens = JSON.parse(await readFile(join(root, 'features', 'wildflower-wind', 'tokens.json'), 'utf8'))
const tokenCss = await readFile(join(root, 'features', 'wildflower-wind', 'wildflower-wind-tokens.css'), 'utf8')
const moduleCss = await readFile(cssPath, 'utf8')

/* ── the dynamic blocks, from the tokens ────────────────────────────────── */

const MARK = 'public/brand/wildflower-wind'

const LIGHT_LABEL = new Set(['haze', 'glass', 'gold', 'sky', 'petal'])
const labelOn = (n) => (LIGHT_LABEL.has(n) ? '#2a1e33' : '#fbf9ff')

const swatches = tokens.primitives
  .map(
    (p) => `<div class="swi">
          <div class="chipSwatch" style="background:${p.value}"><span style="color:${labelOn(p.name)}">${p.name}</span></div>
          <div class="meta"><b>${p.role.split('.')[0]}</b><code>${p.value}</code><p>${p.role.split('.').slice(1).join('.').trim() || '—'}</p></div>
        </div>`,
  )
  .join('\n        ')

const pairs = tokens.contrast
  .map((c) => {
    const job = (c.label.split(' — ')[1] ?? 'text').trim()
    const label = c.label.replace(/ —.*$/, '')
    return `<tr${c.pass ? '' : ' class="fail"'}>
              <td><span class="dot" style="background:${c.fg}"></span>${label}</td>
              <td class="num">${c.ratio.toFixed(2)}:1</td>
              <td class="job">${job}</td>
              <td class="verdict${c.pass ? '' : ' verdictFail'}">${c.pass ? 'Pass' : 'Fails'}</td>
            </tr>`
  })
  .join('\n            ')

const scale = tokens.type
  .map((t) => {
    const family = t.value === 'Instrument Serif' ? 'var(--wi-font-display)' : t.value === 'IBM Plex Mono' ? 'var(--wi-font-mono)' : 'var(--wi-font-reading)'
    const sample = t.name === 'mono' ? '--wi-signal: #8f2a90;' : t.name === 'label' ? 'Seed house · est. 2026' : 'Wildflower Wind'
    return `<div class="scaleRow">
              <span class="scaleName">${t.name}</span>
              <span class="scaleSample" style="font-family:${family};font-size:var(--wi-${t.name}-s);line-height:var(--wi-${t.name}-lh);letter-spacing:var(--wi-${t.name}-ls);font-weight:var(--wi-${t.name}-w);text-transform:${t.name === 'label' ? 'uppercase' : 'none'}">${sample}</span>
              <span class="scaleSpec">${t.size} · ${t.leading} · ${t.tracking} · ${t.weight}</span>
            </div>`
  })
  .join('\n            ')

const marks = [
  ['mark.svg', 'Primary', '24px floor', 92, false],
  ['mark-compact.svg', 'Compact', 'a different drawing', 60, false],
  ['glyph.svg', 'Glyph', 'favicon', 40, false],
  ['mark-mono.svg', 'One ink', 'print', 60, false],
  ['mark-reverse.svg', 'Reverse', 'on ink', 60, true],
]
  .map(
    ([file, label, note, size, dark]) => `<div class="markTile${dark ? ' markTileDark' : ''}">
              <span class="k">${label} · ${note}</span>
              <img src="${MARK}/${file}" alt="${label} mark" width="${size}" height="${size}">
            </div>`,
  )
  .join('\n            ')

const PLACEMENT = [
  ['01', '2°', '4.6', '21.0', '0.35', '0.10', 'glass'],
  ['02', '76°', '5.4', '19.5', '0.35', '0.14', 'glass'],
  ['03', '148°', '4.8', '20.5', '0.35', '0.08', 'glass'],
  ['04', '228°', '6.0', '18.5', '0.35', '0.16', 'glass'],
  ['05', '296°', '16.6', '10.5', '0.38', '0.20', 'signal'],
]
  .map((r) => `<tr>${r.map((c) => `<td>${c}</td>`).join('')}</tr>`)
  .join('\n              ')

const DEFS = [
  ['Belief', 'Arrangement is the enemy of a meadow. A good page looks gathered, not composed.'],
  ['Enemy', 'Two defaults: the symmetrical bouquet with a script logotype, and the opaque white card that hides whatever is behind it. One is pretty. The other is furniture.'],
  ['Material', 'Frosted glass over a meadow. Every surface is translucent, every edge catches light on one side only, and whatever is behind stays visible through it.'],
  ['Test', 'Reject the work if it could be flattened onto white without losing anything.'],
]
  .map(([k, v]) => `<div><dt>${k}</dt><dd>${v}</dd></div>`)
  .join('\n              ')

const DECISIONS = [
  ['01', 'The mark is glass, so the overlap is the ink.', 'Five translucent petals multiply where they cross. The darkest thing in the mark is the crossing, not a stroke — which is the whole argument in one rule.', 'The surface prints in one colour. Then the petals go solid and the crossings are cut out instead.', 'Giving a petal a solid fill. The glass becomes a sticker.'],
  ['02', 'Every surface is a pane, and a pane has one lit edge.', 'Light comes from the top-left of the field. A border on all four sides is a card; one bright edge and one long shadow is glass.', 'The surface sits inside a photograph, where there is no page light — then use the scrim, not a border.', 'Adding a second shadow direction. Two lights make a drop shadow.'],
  ['03', 'Radius is nested, never uniform.', 'A 12px corner inside a 28px pane reads as a lens. The same 12px inside a 40px pane reads as a mistake — the inner radius has to be the outer minus the padding.', 'The element is smaller than twice the radius. Then it is a pill.', 'Rounding every corner to the same value. That is a card grid with soft edges.'],
  ['04', 'The photograph is the light, not the background.', 'The meadow is blurred to 34px behind everything. It exists so the glass has something to bend, and it never competes with a word.', 'The crop would put a horizon through the text. Move the pane, not the photograph.', 'Putting a sharp photograph inside a pane. Then it is a picture, not light.'],
]
  .map(
    ([n, title, because, notWhen, breaks]) => `<article class="card">
              <span class="cardNum">${n}</span>
              <h3>${title}</h3>
              <dl>
                <dt>Because</dt><dd>${because}</dd>
                <dt>Not when</dt><dd>${notWhen}</dd>
                <dt>Breaks next</dt><dd>${breaks}</dd>
              </dl>
            </article>`,
  )
  .join('\n            ')

const PROVED = [
  'Fifteen contrast pairs recomputed from hex at build time; the stated ratios are the computed ones.',
  'Nine primitives in tokens.json match the token CSS at the same value, in both scopes.',
  'The mark at 16px is a different drawing — four placements, not five.',
  'The wordmark is outlines from Instrument Serif. No font file can change the name.',
]
const NOT_VERIFIED = [
  'Glass on a low-contrast display. Backdrop blur varies by GPU and browser; the pane is designed to hold without it.',
  'The meadow photograph behind the page. It was supplied for this system and carries no licence record.',
  'Print. A translucent mark on coated stock is a different problem from a translucent mark on a screen.',
  'Figma parity. The plugin carries variables and styles, not the blend modes that make the petals glass.',
]
const GAPS = [
  'gold on haze, 2.19:1 — graphic only. It may never carry a label, including a tin’s variety name.',
  'sky on haze, 1.47:1 — surface only. Never a rule, never an icon that must be read.',
  'Backdrop blur is unverified below Safari 16.4 and Firefox 103.',
  'The cast has four members. A fifth — a petal that cracks — was drawn and dropped: it read as damage.',
]
const list = (arr) => arr.map((t) => `<li>${t}</li>`).join('\n                ')

/* ── the page ───────────────────────────────────────────────────────────── */

const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Wildflower Wind — the specimen</title>
<meta name="description" content="A seed house under glass: five translucent petals that multiply where they cross, a haze ground, panes with one lit edge, and a violet that is the cosmos refracted.">
<link rel="icon" href="${MARK}/glyph.svg">
<style>
@font-face{font-family:'Instrument Serif';src:url('assets/fonts/InstrumentSerif-400-normal.woff2') format('woff2');font-weight:400;font-style:normal;font-display:block}
@font-face{font-family:'Instrument Serif';src:url('assets/fonts/InstrumentSerif-400-italic.woff2') format('woff2');font-weight:400;font-style:italic;font-display:block}
@font-face{font-family:'Instrument Sans';src:url('assets/fonts/InstrumentSans-Variable.woff2') format('woff2');font-weight:400 700;font-display:block}
@font-face{font-family:'IBM Plex Mono';src:url('assets/fonts/IBMPlexMono-400-normal.woff2') format('woff2');font-weight:400;font-display:block}

*{box-sizing:border-box}
html,body{margin:0;padding:0}
body{background:#e7e3ee}
img{max-width:100%}
a{color:inherit}
:focus-visible{outline:2px solid var(--wi-signal);outline-offset:3px}

${tokenCss}

${moduleCss}
</style>
</head>
<body class="wi-scope">
<div class="root">

  <div class="backdrop" aria-hidden="true"><img src="assets/photos/field-main.webp" alt=""></div>

  <header class="topbar">
    <a class="brand" href="#main"><img src="${MARK}/mark-compact.svg" alt="" width="26" height="26"><span class="brandName">Wildflower Wind</span></a>
    <nav class="topnav" aria-label="Sections">
      <a href="#premise">Premise</a><a href="#calyx">Calyx</a><a href="#light">Light</a>
      <a href="#setting">Setting</a><a href="#season">Season</a><a href="#ledger">Ledger</a>
    </nav>
  </header>

  <main class="shell" id="main">

    <section class="pane hero">
      <div class="heroTop">
        <span class="chip"><i></i>Case 13 · Seed house · 2026</span>
        <img class="heroMark" src="${MARK}/mark.svg" alt="" width="148" height="148">
      </div>
      <h1 class="title">Wildflower <em>Wind</em></h1>
      <p class="lede">A seed house sells a future it cannot photograph. So the identity does not show the flower. It shows the flower through glass: four petals still holding, one already gone, and the crossing where they overlap gone dark.</p>
      <div class="heroFoot">
        <span>Primitives · 9</span><span>Pairs computed · ${tokens.contrast.length}</span>
        <span>Published as failing · ${tokens.contrast.filter((c) => !c.pass).length}</span><span>Mark files · 15</span>
      </div>
    </section>

    <section class="pane section" id="premise">
      <div class="sectionHead"><span class="sectionNum">01</span><span class="sectionLabel">Premise</span></div>
      <h2 class="h2">Nothing here sits on top of anything.</h2>
      <div class="grid2">
        <div class="prose">
          <p>A pane of glass does not hide what is behind it, and it does not leave it alone either. It bends it, softens it, and catches one edge of light. That is the whole interface: a meadow that stays visible, and surfaces you read through rather than on.</p>
          <p>The mark is built the same way. Five translucent petals are laid down, and where two cross they multiply — so the flower has no outline and no ink of its own. It has a dark crossing and a lit rim, and the fifth petal is the one the wind already took.</p>
        </div>
        <dl class="defs">
              ${DEFS}
        </dl>
      </div>
      <div class="cards">
            ${DECISIONS}
      </div>
    </section>

    <section class="pane section" id="calyx">
      <div class="sectionHead"><span class="sectionNum">02</span><span class="sectionLabel">Calyx</span></div>
      <h2 class="h2">Five petals. One gone.</h2>
      <p class="prose">A petal is narrow at the base, widest at 72% of its length, rounded at the tip, and bent by 8–16% of that length. Four hold the calyx at 74°, 72° and 80°; the fifth sits 134° away, small, further out, in the gap the wind opened. It is the only place the accent is allowed in the mark.</p>
      <div class="markRow" style="margin-top:30px">
            ${marks}
      </div>
      <table class="table">
        <caption>The placement table — every file in the family is this, re-struck.</caption>
        <thead><tr><th>Petal</th><th>Angle</th><th>Base r</th><th>Length</th><th>Width</th><th>Bend</th><th>Fill</th></tr></thead>
        <tbody>
              ${PLACEMENT}
        </tbody>
      </table>
    </section>

    <section class="pane section" id="light">
      <div class="sectionHead"><span class="sectionNum">03</span><span class="sectionLabel">Light</span></div>
      <h2 class="h2">Nine values, and one of them is the light.</h2>
      <p class="prose">The haze is the air the page sits in, the pane is what you read through, and the ink is the darkest thing the glass resolves to. The violet is the cosmos seen through the pane — refraction is why it is not pink. Gold and sky are light, never words: on this ground they cannot reach 4.5:1, and pretending otherwise is how a palette becomes a brochure.</p>
      <div class="sw">
        ${swatches}
      </div>
      <table class="pairTable">
        <thead><tr><th>Pair</th><th style="text-align:right">Ratio</th><th>Allowed job</th><th style="text-align:right">Verdict</th></tr></thead>
        <tbody>
            ${pairs}
        </tbody>
      </table>
    </section>

    <section class="pane section" id="setting">
      <div class="sectionHead"><span class="sectionNum">04</span><span class="sectionLabel">Setting</span></div>
      <h2 class="h2">A field guide, held up to the light.</h2>
      <div class="spec">
        <div class="capLine"><span>display-1 · Instrument Serif 400 · 108px · lh 0.92 · ls −0.035em</span><span>real size</span></div>
        <div class="specDisplay">Wildflower</div>
      </div>
      <div class="spec">
        <div class="capLine"><span>body-1 · Instrument Sans 400 · 18px · lh 1.62 · 64ch</span><span>reading</span></div>
        <p class="specRead">The seed is the smallest thing a plant makes and the largest thing it promises. We pack them in April, from a field that is left alone from June, and we write the harvest on the tin in pencil because the weather always has the last word. Nothing in this catalogue is a guarantee. Everything in it is an invitation to a summer you have not had yet.</p>
      </div>
      <div class="scale">
            ${scale}
      </div>
    </section>

    <section class="pane section" id="season">
      <div class="sectionHead"><span class="sectionNum">05</span><span class="sectionLabel">Season</span></div>
      <h2 class="h2">What it looks like in the post.</h2>
      <div class="bento">
        <div class="tin">
          <div class="tinTop"><span>No. 04</span><span>2.4 g</span></div>
          <img src="${MARK}/mark-reverse.svg" alt="" width="88" height="88">
          <div class="tinName">Cosmos<br><em>‘Purity’</em></div>
        </div>
        <div class="cardApp">
          <div class="qt">“Sow thin, in May, where the wind already goes.”</div>
          <div class="ft"><span>Field note 04</span><span>41°N</span></div>
        </div>
        <div class="tag">
          <span style="font-family:var(--wi-font-mono);font-size:9.5px;letter-spacing:.12em">RESERVED</span>
          <div class="big">Harvest<br>2026</div>
        </div>
        <div class="photo">
          <img src="assets/photos/field-left.webp" alt="The meadow at first light">
          <div class="ov"><span>Plate 01 · first light · 06:10</span><span>Documented, never recoloured</span></div>
        </div>
      </div>
    </section>

    <section class="pane section" id="ledger">
      <div class="sectionHead"><span class="sectionNum">06</span><span class="sectionLabel">Ledger</span></div>
      <h2 class="h2">What is proved, and what is not.</h2>
      <div class="ledger">
        <div class="ledgerCol ledgerOk"><h4><i></i>Proved</h4><ul>${list(PROVED)}</ul></div>
        <div class="ledgerCol ledgerGap"><h4><i></i>Not verified</h4><ul>${list(NOT_VERIFIED)}</ul></div>
        <div class="ledgerCol ledgerFail"><h4><i></i>Known gaps</h4><ul>${list(GAPS)}</ul></div>
      </div>
    </section>

    <section class="closing" aria-label="The meadow at dusk">
      <img class="plate" src="assets/photos/field-center.webp" alt="The meadow at last light">
      <img class="wm" src="${MARK}/wordmark-reverse.svg" alt="Wildflower Wind" height="64">
      <span class="cap">Plate 03 · last light · 19:35</span>
    </section>

    <footer class="pane footer">
      <div>
        <h4>The case</h4>
        <p>A seed house under glass. Nine values, fifteen contrast pairs recomputed from hex, two published as failing, and a mark whose ink is the place two petals cross.</p>
      </div>
      <div>
        <h4>Files</h4>
        <div class="footerLinks">
          <a href="docs/wildflower-wind-design-system-audit.md">The audit ↗</a>
          <a href="brand/DESIGN.md">DESIGN.md ↗</a>
          <a href="tokens/wildflower-wind.tokens.json">tokens.json ↗</a>
        </div>
      </div>
      <div>
        <h4>Elsewhere</h4>
        <div class="footerLinks">
          <a href="brand/wildflower-wind-board-1500.png">The board ↗</a>
          <a href="/design-system/wildflower-wind">The route ↗</a>
        </div>
      </div>
    </footer>

  </main>
</div>
</body>
</html>
`

await writeFile(join(root, 'index.html'), html)
console.log(`specimen → index.html  (${(html.length / 1024).toFixed(0)} kB, css from ${cssPath.split('/').slice(-3).join('/')})`)
