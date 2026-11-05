// Vesper — the board.
//
//   node vesper/scripts/build-board.mjs
//
// 1500 × 1125, rendered at 2× to brand/vesper-board.png. Six plates: the field,
// the mark reversed, the family, the palette, the type, the cast. A board that
// shows only the logo is a logo.

import { readFileSync, writeFileSync, mkdirSync } from 'node:fs'
import { dirname, resolve, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const here = dirname(fileURLToPath(import.meta.url))
const root = resolve(here, '..')
const brand = join(root, 'public', 'brand', 'vesper')
const outDir = join(root, 'brand')
mkdirSync(outDir, { recursive: true })

const tokens = JSON.parse(readFileSync(join(root, 'features', 'vesper', 'tokens.json'), 'utf8'))

const inline = (file) => {
  const src = readFileSync(join(brand, file), 'utf8')
  const vb = src.match(/viewBox="([^"]+)"/)[1]
  const body = src.replace(/^[\s\S]*?<svg[^>]*>/, '').replace(/<\/svg>\s*$/, '').replace(/fill="#[0-9a-fA-F]{3,6}"/g, '')
  return `<svg viewBox="${vb}" fill="currentColor" aria-hidden="true">${body}</svg>`
}

const P = Object.fromEntries(tokens.primitives.map((p) => [p.name, p.value]))
const cast = ['moon', 'lamp', 'horizon', 'figure', 'ray', 'grain'].map((id) => inline(`cast/${id}.svg`))

const swatch = (p) => `<div class="sw"><span style="background:${p.value}"></span><b>${p.name}</b><i>${p.value}</i></div>`

const html = `<!doctype html><html><head><meta charset="utf-8"><style>
@font-face{font-family:'Fraunces';src:url('../assets/fonts/Fraunces-Variable.woff2');font-weight:300 700;font-display:block}
@font-face{font-family:'Fraunces';src:url('../assets/fonts/Fraunces-Variable-Italic.woff2');font-weight:300 700;font-style:italic;font-display:block}
@font-face{font-family:'Archivo';src:url('../assets/fonts/Archivo-Variable.woff2');font-weight:100 900;font-display:block}
@font-face{font-family:'DM Mono';src:url('../assets/fonts/DMMono-Regular.woff2');font-weight:400;font-display:block}
*{box-sizing:border-box;margin:0}
body{width:1500px;height:1125px;background:${P.chalk};color:${P.lampblack};font-family:'Archivo',sans-serif;overflow:hidden}
.board{width:1500px;height:1125px;display:grid;grid-template-columns:760px 740px;grid-template-rows:430px 350px 345px}
.plate{position:relative;overflow:hidden}
.plate.night{background:${P.cobalt};color:${P.chalk}}
.plate.field img{width:100%;height:100%;object-fit:cover;object-position:50% 40%}
.tag{position:absolute;left:26px;top:22px;font-family:'DM Mono',monospace;font-size:10px;letter-spacing:.16em;text-transform:uppercase;opacity:.62}
.night .tag{opacity:.72}
.markbig{position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);width:250px;height:250px;color:${P.chalk}}
.wordline{position:absolute;left:50%;bottom:34px;transform:translateX(-50%);text-align:center;width:100%}
.wordline svg{height:44px;width:auto;color:${P.chalk}}
.ess{position:absolute;left:26px;bottom:26px;font-family:'Fraunces',serif;font-style:italic;font-size:17px;opacity:.85}
.fam{display:grid;grid-template-columns:1.1fr .9fr;height:100%}
.fam .a{display:grid;place-items:center;border-right:1px solid rgb(13 21 38 / .14)}
.fam .a svg{width:150px;height:150px}
.fam .b{padding:30px 28px;display:flex;flex-direction:column;justify-content:center;gap:18px}
.fam .b .row{display:flex;align-items:center;justify-content:space-between;gap:14px;padding-bottom:14px;border-bottom:1px solid rgb(13 21 38 / .12)}
.fam .b .row:last-child{border-bottom:0;padding-bottom:0}
.fam .b svg{width:34px;height:34px}
.fam .b svg.wm{width:104px;height:auto}
.fam .b span{font-family:'DM Mono',monospace;font-size:9.5px;letter-spacing:.12em;text-transform:uppercase;opacity:.55}
.pal{padding:26px 28px;display:grid;grid-template-columns:repeat(4,1fr);gap:14px 12px;align-content:start}
.sw span{display:block;height:56px;border:1px solid rgb(13 21 38 / .14)}
.sw b{display:block;font-size:11.5px;font-weight:600;margin-top:7px;letter-spacing:-.005em}
.sw i{display:block;font-family:'DM Mono',monospace;font-size:9.5px;font-style:normal;opacity:.55;letter-spacing:.02em}
.type{padding:34px 30px;display:flex;flex-direction:column;justify-content:space-between}
.type .big{font-family:'Fraunces',serif;font-weight:300;font-size:62px;line-height:.98;letter-spacing:-.032em}
.type .big em{font-style:italic}
.type .meta{display:flex;justify-content:space-between;gap:16px;font-family:'DM Mono',monospace;font-size:9.5px;letter-spacing:.1em;text-transform:uppercase;opacity:.6;border-top:1px solid rgb(13 21 38 / .16);padding-top:12px}
.castwrap{background:${P.night};color:${P.chalk};padding:10px 28px 22px;display:grid;grid-template-columns:repeat(3,1fr);gap:1px;height:calc(100% - 40px);margin-top:40px}
.castwrap .c{background:${P.night};display:grid;place-items:center;gap:8px;padding:12px 6px}
.castwrap svg{width:44px;height:44px;color:${P.chalk}}
.castwrap .c span{font-family:'DM Mono',monospace;font-size:8.5px;letter-spacing:.12em;text-transform:uppercase;opacity:.55}
.head{position:absolute;right:26px;top:20px;text-align:right;font-family:'DM Mono',monospace;font-size:10px;letter-spacing:.16em;text-transform:uppercase;opacity:.62;line-height:1.7}
</style></head><body>
<div class="board">

  <div class="plate field">
    <img src="../public/brand/vesper/field/stipple.png" alt="">
    <span class="tag" style="color:${P.chalk}">01 · The field</span>
    <div class="head" style="color:${P.chalk}">Vesper<br>two inks · 2026</div>
  </div>

  <div class="plate night">
    <span class="tag">02 · The mark, reversed</span>
    <div class="markbig">${inline('mark.svg')}</div>
    <div class="wordline">${inline('lockup.svg')}</div>
  </div>

  <div class="plate" style="border-top:1px solid rgb(13 21 38 / .16)">
    <div class="fam">
      <div class="a">${inline('mark.svg')}</div>
      <div class="b">
        <span class="tag" style="position:static;opacity:.55">03 · The family</span>
        <div class="row"><span>Primary · 64 grid</span>${inline('mark.svg')}</div>
        <div class="row"><span>Compact · 16–24px</span>${inline('mark-compact.svg')}</div>
        <div class="row"><span>Glyph</span>${inline('glyph.svg')}</div>
        <div class="row"><span>Wordmark · outlined</span><span class="wm">${inline('wordmark.svg')}</span></div>
      </div>
    </div>
  </div>

  <div class="plate" style="border-top:1px solid rgb(13 21 38 / .16);border-left:1px solid rgb(13 21 38 / .16)">
    <span class="tag" style="left:28px;top:22px">04 · The ink</span>
    <div class="pal" style="padding-top:52px">
      ${tokens.primitives.map(swatch).join('')}
    </div>
  </div>

  <div class="plate type" style="border-top:1px solid rgb(13 21 38 / .16)">
    <div>
      <span class="tag" style="position:static;opacity:.55">05 · The voice</span>
      <div class="big" style="margin-top:18px">Evening<br>arrives <em>early</em><br>out here.</div>
    </div>
    <div class="meta"><span>Fraunces 300 · 62/0.98</span><span>Archivo · DM Mono</span><span>${tokens.contrast.length} pairs</span></div>
  </div>

  <div class="plate" style="border-top:1px solid rgb(13 21 38 / .16);border-left:1px solid rgb(13 21 38 / .16);background:${P.night}">
    <div class="castwrap">
      ${cast.map((c, i) => `<div class="c">${c}<span>${['moon', 'lamp', 'horizon', 'figure', 'ray', 'grain'][i]}</span></div>`).join('')}
    </div>
    <span class="tag" style="color:${P.chalk}">06 · The cast</span>
  </div>

</div>
</body></html>`

writeFileSync(join(outDir, 'board.html'), html)
console.log('wrote vesper/brand/board.html')
