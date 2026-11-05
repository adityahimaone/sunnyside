// Bake-off contact sheet: every concept at 128, 40 and 16, on cream and on
// cobalt. The sheet is the artefact of this step; the winner is written into
// brand/brief.md with the reason the others lost, and the measured score from
// score-bakeoff.mjs is printed on each row so the eye and the arithmetic sit
// side by side. The two disagree, which is the interesting part.
import { writeFileSync, readFileSync, existsSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { concepts, svg, INK, CREAM, COBALT } from './marks.mjs'
import { round2 } from './marks2.mjs'

const here = dirname(fileURLToPath(import.meta.url))
const out = resolve(here, '../public/brand/vesper/bakeoff/sheet.html')

const scoresFile = resolve(here, '../public/brand/vesper/bakeoff/scores.json')
const scores = existsSync(scoresFile) ? JSON.parse(readFileSync(scoresFile, 'utf8')) : null
const scoreOf = (c) => (scores ? scores.find((s) => s.id === c.id) : null)

const all = [
  ...concepts.map((c) => ({ ...c, round: 1 })),
  ...round2.map((c) => ({ ...c, round: 2 })),
]

const row = (c) => {
  const big = svg(c.paths, { fill: INK })
  const bigRev = svg(c.paths, { fill: CREAM })
  const s40 = svg(c.paths, { fill: INK })
  const s16 = svg(c.paths, { fill: INK })
  const s16r = svg(c.paths, { fill: CREAM })
  const s = scoreOf(c)
  const shipped = c.id === 'horizon-star'
  const scoreBlock = s
    ? `<div class="score ${shipped ? 'ship' : ''}">
        <b>${s.score}</b><span>score</span>
        <em>${s.cover16 ? (s.cover16 * 100).toFixed(1) + '% ink @ 16px' : ''}</em>
        <em>${s.failed.length ? 'loses ' + s.failed.map((f) => f.replace(/\(.*?\)/, '').trim()).join(', ') : 'loses nothing'}</em>
      </div>`
    : ''
  return `
  <article class="row ${shipped ? 'ship' : ''}">
    <div class="idx mono">${String(all.indexOf(c) + 1).padStart(2, '0')}<br><span style="opacity:.5">R${c.round}</span></div>
    <div class="plate big">${big}</div>
    <div class="plate night">${bigRev}</div>
    <div class="sizes">
      <div class="s40">${s40}</div>
      <div class="s16">${s16}</div>
      <div class="s16 nightchip">${s16r}</div>
    </div>
    <div class="txt">
      <h2>${c.name}${shipped ? ' <span class="tag">shipped</span>' : ''}</h2>
      <p class="line">${c.line}</p>
      <p>${c.why}</p>
      <p class="risk"><b>Risk</b> ${c.risk}</p>
      <p class="mono meta">${c.primitives} primitives · ${c.paths.length} subpaths</p>
    </div>
    ${scoreBlock}
  </article>`
}

writeFileSync(
  out,
  `<!doctype html><html><head><meta charset="utf-8"><title>Vesper — bake-off</title>
<style>
@font-face{font-family:'Fraunces';src:url('../../../../assets/fonts/Fraunces-Variable.woff2') format('woff2');font-weight:300 700;font-display:block}
@font-face{font-family:'Archivo';src:url('../../../../assets/fonts/Archivo-Variable.woff2') format('woff2');font-weight:100 900;font-display:block}
@font-face{font-family:'DM Mono';src:url('../../../../assets/fonts/DMMono-Regular.woff2') format('woff2');font-weight:400;font-display:block}
:root{--chalk:#f6efe1;--ink:#0d1526;--cobalt:${COBALT};--line:rgba(13,21,38,.16)}
*{box-sizing:border-box}
body{margin:0;background:var(--chalk);color:var(--ink);font-family:'Archivo',system-ui,sans-serif;padding:56px 48px 80px}
h1{font-family:'Fraunces',serif;font-weight:300;font-size:56px;line-height:.95;letter-spacing:-.035em;margin:0 0 6px}
.sub{font-family:'DM Mono',monospace;font-size:12px;letter-spacing:.08em;text-transform:uppercase;opacity:.6;margin-bottom:40px}
.row{display:grid;grid-template-columns:40px 180px 180px 150px minmax(0,1fr) 168px;gap:24px;align-items:center;padding:24px 0;border-top:1px solid var(--line)}
.row.ship{background:linear-gradient(90deg,transparent,rgba(27,63,162,.05) 12%,rgba(27,63,162,.05) 88%,transparent)}
.idx{font-size:11px;line-height:1.3;opacity:.55}
.plate{height:180px;display:grid;place-items:center;border:1px solid var(--line)}
.plate.night{background:var(--cobalt);border-color:var(--cobalt)}
.plate svg{width:128px;height:128px}
.sizes{display:flex;align-items:center;gap:18px}
.s40 svg{width:40px;height:40px}
.s16 svg{width:16px;height:16px}
.nightchip{background:var(--cobalt);padding:8px;display:grid;place-items:center}
h2{font-family:'Fraunces',serif;font-weight:400;font-size:26px;letter-spacing:-.02em;margin:0 0 2px}
.tag{font-family:'DM Mono',monospace;font-size:9.5px;letter-spacing:.1em;text-transform:uppercase;color:var(--cobalt);
  border:1px solid currentColor;padding:2px 5px;vertical-align:3px;margin-left:6px}
.line{font-family:'Fraunces',serif;font-style:italic;font-size:17px;margin:0 0 10px;opacity:.85}
.txt p{font-size:13.5px;line-height:1.55;margin:0 0 8px;max-width:52ch;opacity:.8}
.risk b{font-family:'DM Mono',monospace;font-size:10px;letter-spacing:.1em;text-transform:uppercase;opacity:.55;margin-right:6px}
.meta{font-family:'DM Mono',monospace;font-size:10.5px;letter-spacing:.06em;text-transform:uppercase;opacity:.45;margin:0}
.score{border-left:1px solid var(--line);padding-left:18px}
.score b{display:block;font-family:'Fraunces',serif;font-weight:400;font-size:34px;line-height:1;letter-spacing:-.02em}
.score.ship b{color:var(--cobalt)}
.score span{display:block;font-family:'DM Mono',monospace;font-size:9.5px;letter-spacing:.12em;text-transform:uppercase;opacity:.45;margin:2px 0 8px}
.score em{display:block;font-style:normal;font-family:'DM Mono',monospace;font-size:10px;line-height:1.5;opacity:.55}
</style></head><body>
<h1>Eleven ways to draw a lamp</h1>
<div class="sub">Vesper · bake-off · two rounds · 64-unit grid · same primitives budget${scores ? ' · scored by score-bakeoff.mjs' : ''}</div>
${all.map(row).join('')}
</body></html>`,
)
console.log('wrote', out)
