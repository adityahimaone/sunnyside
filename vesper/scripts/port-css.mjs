// One-off port: take the CSS out of the generated proof page and make it safe to
// import into the Next app.
//
//   node vesper/scripts/port-css.mjs <path/to/vesper-page.css>
//
// Four things have to happen, and each is a real hazard in the app:
//
//   1 · the token blocks are dropped  — the app imports vesper-tokens.css instead,
//                                       so colour still has exactly one source;
//   2 · @font-face is dropped         — next/font/local owns the same five files;
//   3 · comments are stripped first   — otherwise the selector rewriter eats them,
//                                       which is how the first run produced
//                                       "build-tokens.vs-mjs" inside a comment;
//   4 · every selector is scoped      — `.nav`, `.body`, `.wrap` and `footer`
//                                       already exist in the site shell. An
//                                       unscoped port would restyle the whole app.
//
// Classes become `vs-`-prefixed, element selectors nest under `.vs-scope`, and
// `html[data-vesper='night']` becomes an attribute on that same element, so the
// night scope cannot escape the page.

import { readFileSync, writeFileSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const here = dirname(fileURLToPath(import.meta.url))
const repo = resolve(here, '../..')
const src = readFileSync(resolve(repo, 'design-system/vesper/index.html'), 'utf8')
const css = src.match(/<style>([\s\S]*?)<\/style>/)[1]

// ── helpers ──────────────────────────────────────────────────────────────────
const findBlock = (text, headerRe) => {
  const m = headerRe.exec(text)
  if (!m) return null
  let depth = 0
  let start = -1
  for (let i = m.index; i < text.length; i++) {
    if (text[i] === '{') {
      if (depth === 0) start = i
      depth++
    } else if (text[i] === '}') {
      depth--
      if (depth === 0) return { start: m.index, end: i + 1, body: text.slice(start + 1, i) }
    }
  }
  return null
}

const dropBlock = (text, headerRe, marker) => {
  const b = findBlock(text, headerRe)
  if (!b) return text
  if (marker && !b.body.includes(marker)) return text
  return text.slice(0, b.start) + text.slice(b.end)
}

// ── 1 · strip comments, then the blocks the app owns ─────────────────────────
let body = css.replace(/\/\*[\s\S]*?\*\//g, '')
body = body.replace(/@font-face\s*\{[^}]*\}/g, '')
body = dropBlock(body, /:root\s*\{/, '--vs-chalk')
body = dropBlock(body, /html\[data-vesper='night'\]\s*\{/, '--vs-surface-page')

// ── 2 · rewrite selectors ────────────────────────────────────────────────────
const SCOPE = '.vs-scope'
// Element rules are nested with :where(), which contributes zero specificity.
// Without it `.vs-scope a{color:inherit}` (0,1,1) outranks `.vs-btn{color:…}`
// (0,1,0) and every link inside the page — buttons included — inherits ink,
// which is exactly how the blue button ended up with black text.
const NEST = ':where(.vs-scope)'
const prefixed = (sel) => sel.replace(/\.(?!vs-)([a-zA-Z_][\w-]*)/g, '.vs-$1')

const scopeSelector = (raw) => {
  const sel = raw.trim()
  if (!sel) return sel
  if (sel === ':root') return SCOPE
  if (/^html\[data-vesper='night'\]/.test(sel)) {
    const rest = sel.replace(/^html\[data-vesper='night'\]\s*/, '').trim()
    const head = `${SCOPE}[data-vesper='night']`
    if (!rest || rest === 'body') return head
    if (rest.startsWith('body')) return `${head} ${prefixed(rest.replace(/^body\s*/, ''))}`.trim()
    return `${head} ${prefixed(rest)}`
  }
  if (/^html\b/.test(sel)) return SCOPE
  if (/^body\b/.test(sel)) return prefixed(sel.replace(/^body/, SCOPE))
  // a leading pseudo (`:focus-visible`, `::selection`) is a global element
  // selector until it is nested, so it must not be left loose in the app
  if (/^::?[a-zA-Z-]/.test(sel)) return `${NEST} ${sel}`
  if (/^[*a-zA-Z]/.test(sel)) return `${NEST} ${prefixed(sel)}`
  return prefixed(sel)
}

const rewrite = (text) => {
  let out = ''
  let i = 0
  while (i < text.length) {
    const open = text.indexOf('{', i)
    if (open === -1) {
      out += text.slice(i)
      break
    }
    const prelude = text.slice(i, open)
    let depth = 1
    let j = open + 1
    while (j < text.length && depth > 0) {
      if (text[j] === '{') depth++
      else if (text[j] === '}') depth--
      j++
    }
    const inner = text.slice(open + 1, j - 1)
    const head = prelude.trim()
    if (/^@(media|supports|layer|container)/.test(head)) {
      out += `${prelude}{${rewrite(inner)}}`
    } else if (head.startsWith('@keyframes')) {
      out += `${prelude}{${inner}}`
    } else {
      const selectors = head.split(',').map(scopeSelector).filter(Boolean).join(',')
      out += `${prelude.replace(head, selectors)}{${inner}}`
    }
    i = j
  }
  return out
}

const ported = rewrite(body)

// ── 3 · write ────────────────────────────────────────────────────────────────
const header = `/* Vesper — page styles, ported from the generated proof page.

   Source: design-system/vesper/index.html in the design-system repo, generated
   by vesper/scripts/build-page.mjs. This file is that page's CSS with four
   changes, all of them about living inside the app rather than alone:

   1. the token blocks are gone — vesper-tokens.css is imported instead, so
      colour still has exactly one source;
   2. @font-face is gone — next/font/local owns the same five files;
   3. comments are stripped — the porter rewrites selectors, and a comment is
      not a selector;
   4. every selector is scoped. Classes are vs- prefixed and element selectors
      live under .vs-scope, because .nav, .body, .wrap and footer already mean
      something in the site shell and an unscoped port would restyle the app.

   Regenerate with vesper/scripts/port-css.mjs rather than hand-editing, then
   re-check both widths: the breakpoints at 860 and 560 carry the layout at 390. */

`

const dest = process.argv[2]
if (!dest) {
  console.error('usage: node vesper/scripts/port-css.mjs <path/to/vesper-page.css>')
  process.exit(1)
}

// Rules the static page carried as inline styles on the element itself, which a
// React port cannot inherit. The skip link was `position:absolute;left:-9999px`
// inline — here it is a real rule, and it now becomes visible on focus, which
// the original never did.
const additions = `
/* ── port additions ───────────────────────────────────────────────────────── */

/* Insulation. The page is a guest in an app whose <body> carries Tailwind's
   \`tracking-tight\` (-0.025em). At the body's 16px that resolves to a FIXED
   -0.4px, and every descendant inherits -0.4px as a length — so a 20px
   paragraph and a 13.5px nav link both get -0.4px, and both wrap one line
   early. That single inherited value was the whole of the 43px height gap
   between this route and the static page. Declaring it here stops the
   inheritance at the scope root; anything the page sets for itself, at any
   em, still wins further down. The rest of the block is the same defence for
   the other inherited text properties a host stylesheet can reach. */
.vs-scope{
  letter-spacing:normal;word-spacing:normal;
  font-feature-settings:normal;font-variant:normal;font-synthesis:weight style;
  text-transform:none}

/* Form controls, put back the way the browser had them.
   The static page never wrote \`font: inherit\` on a button, so Chrome's own
   stylesheet gave every one of them \`line-height: normal\`. Tailwind's preflight
   does write it, which makes a button inherit the page's 1.62 — and a 9.5px
   Copy button grows from 26px to 29.4px. Nothing about that is a design
   decision; it is a reset leaking in through the front door. Restore the UA
   default so the two copies agree, and let any real rule win over this.
   The selector is wrapped in :where() so it stays at element weight (0,0,1):
   written as .vs-scope button it would be (0,1,1) and would outrank .vs-btn's
   own \`line-height:1\` — the same specificity trap that turned the primary
   button's label black. */
:where(.vs-scope) button,:where(.vs-scope) input,
:where(.vs-scope) select,:where(.vs-scope) textarea{line-height:normal}

.vs-skip{position:absolute;left:-9999px;top:0;z-index:100;padding:10px 16px;
  background:var(--vs-surface-loud);color:var(--vs-text-on-loud);font-family:var(--vs-font-mono);
  font-size:12px;letter-spacing:.04em;text-decoration:none}
.vs-skip:focus{left:8px;top:8px}
`

writeFileSync(dest, header + ported.replace(/\n{3,}/g, '\n\n').trim() + '\n' + additions)

// ── report ───────────────────────────────────────────────────────────────────
const unscoped = [...ported.matchAll(/(?:^|\})\s*([a-zA-Z@][^{}]*?)\{/g)]
  .map((m) => m[1].trim())
  .filter((s) => !s.startsWith('.') && !s.startsWith('@') && !/^\d/.test(s) && !/^(from|to)$/.test(s))
const classes = new Set([...ported.matchAll(/\.vs-([a-zA-Z][\w-]*)/g)].map((m) => m[1]))
console.log(`css        ${css.length} → ${ported.length} bytes`)
console.log(`classes    ${classes.size} scoped`)
console.log(`tokens     ${/--vs-chalk\s*:/.test(ported) ? 'STILL PRESENT' : 'removed'}`)
console.log(`night      ${(ported.match(/\.vs-scope\[data-vesper='night'\]/g) || []).length} scoped rules`)
console.log(`unscoped   ${unscoped.length ? unscoped.join(' · ') : 'none'}`)
