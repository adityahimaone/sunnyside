/**
 * One reader for every tokens.json the repo has shipped.
 *
 * Five shapes exist, and each script used to guess for itself, which is how a gate came to be
 * blind to Hachure (`role`/`face`), skip Huginn, and never see Clearing. Read them here, once.
 *
 *   readTokens(path) → {
 *     path, shape, name, namespace, idea,
 *     primitives: [{ name, value, hex, role }],   hex is null for non-hex values (oklch, rgba…)
 *     contrast:   [{ label, fg, bg, ratio }],     accepts fg/bg, a/b, and `pair` as the label
 *     type:       [{ name, value, family, size, weight }],
 *     radius, space: [{ name, value }]            numbers become px
 *   }
 *   findTokens(root, slug) → path | null          features/<slug>/tokens.json, else
 *                                                 public/brand/<slug>/<slug>-tokens.json
 *
 * Detection is by key, never by case name. An unreadable shape returns shape "unknown" and empty
 * lists; callers decide whether that is a SKIP or a FAIL.
 */
import { existsSync, readFileSync } from 'node:fs'
import { join } from 'node:path'

export function findTokens(root, slug) {
  return [join(root, 'features', slug, 'tokens.json'), join(root, 'public', 'brand', slug, `${slug}-tokens.json`)].find(existsSync) ?? null
}

const HEX = /^#(?:[0-9a-f]{3}|[0-9a-f]{6}|[0-9a-f]{8})$/i
const hexOf = (v) => (typeof v === 'string' && HEX.test(v.trim()) ? v.trim() : null)
const GENERIC = /^(sans-serif|serif|monospace|system-ui|ui-[a-z-]+|-apple-system|var\(.*)$/i

/** "Bodoni Moda 400/500" → "Bodoni Moda"; "var(--font-sora), 'Sora', sans" → "Sora". */
export function familyOf(value) {
  const first = String(value ?? '')
    .split(',')
    .map((p) => p.replace(/['"]/g, '').replace(/\s+\d{3}(?:\/\d{3})*$/, '').trim())
    .find((p) => p && !GENERIC.test(p))
  return first ?? ''
}

function scale(x) {
  if (Array.isArray(x))
    return x
      .map((r, i) => (r && typeof r === 'object' ? { name: String(r.name ?? i + 1).replace(/^(radius|space)-/, ''), value: String(r.value ?? '') } : { name: String(i + 1), value: typeof r === 'number' ? `${r}px` : String(r) }))
      .filter((r) => r.value)
  if (x && typeof x === 'object') return Object.entries(x).map(([name, v]) => ({ name, value: typeof v === 'number' ? `${v}px` : String(v?.value ?? v) }))
  return []
}

export function readTokens(path) {
  const t = JSON.parse(readFileSync(path, 'utf8'))
  const meta = t.meta ?? t.$meta ?? {}

  let shape = 'unknown'
  let primitives = []
  if (Array.isArray(t.primitives)) {
    shape = 'primitives[]'
    primitives = t.primitives.map((p) => ({ name: String(p.name), value: p.value, hex: hexOf(p.value), role: p.role ?? '' }))
  } else if (t.primitive && typeof t.primitive === 'object') {
    shape = 'primitive{}'
    primitives = Object.entries(t.primitive).map(([name, v]) => {
      const value = typeof v === 'string' ? v : v?.value
      return { name, value, hex: hexOf(v?.hex) ?? hexOf(value), role: v?.role ?? '' }
    })
  } else if (t.color && typeof t.color === 'object' && !Array.isArray(t.color)) {
    shape = 'color{}'
    primitives = Object.entries(t.color)
      .filter(([, v]) => typeof v === 'string')
      .map(([name, value]) => ({ name, value, hex: hexOf(value), role: '' }))
  }

  const contrast = (Array.isArray(t.contrast) ? t.contrast : []).map((p) => ({
    label: p.label ?? p.pair ?? '',
    fg: p.fg ?? p.a,
    bg: p.bg ?? p.b,
    ratio: typeof p.ratio === 'number' ? p.ratio : null,
  }))

  let type = []
  if (Array.isArray(t.type))
    type = t.type.map((e) => ({ name: String(e.name ?? e.role ?? ''), value: String(e.value ?? e.face ?? ''), family: familyOf(e.value ?? e.face), size: e.size, weight: e.weight }))
  else if (t.type && typeof t.type === 'object')
    type = Object.entries(t.type)
      .filter(([, v]) => typeof v === 'string')
      .map(([name, value]) => ({ name, value, family: familyOf(value) }))

  return {
    path,
    shape,
    name: meta.name ?? t.name ?? '',
    namespace: meta.namespace ? String(meta.namespace).replace(/^-+|-+$/g, '') : '',
    idea: meta.idea ?? meta.essence ?? meta.oneSentence ?? t.idea ?? '',
    primitives,
    contrast,
    type,
    radius: scale(t.radius),
    space: scale(t.space),
  }
}
