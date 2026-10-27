import { mkdir, readFile, writeFile } from 'node:fs/promises'

const source = JSON.parse(await readFile('features/huginn/tokens.json', 'utf8'))
const property = (name) => `--hg-${name}`
const declarations = (tokens) => tokens.map(({ name, value }) => `  ${property(name)}: ${value};`).join('\n')
const componentDeclarations = (components) => Object.entries(components).flatMap(([component, values]) => Object.entries(values).map(([name, value]) => `  ${property(`${component}-${name}`)}: ${value};`)).join('\n')
const shared = [declarations(source.primitives), declarations(source.type), declarations(source.space), declarations(source.radius), declarations(source.motion)].filter(Boolean).join('\n')
const css = `/* Generated from features/huginn/tokens.json. */\n.hg-scope {\n${shared}\n${declarations(source.semantic.light)}\n${componentDeclarations(source.components)}\n  background: var(--hg-bg);\n  color: var(--hg-fg);\n  font-family: var(--hg-font-reading);\n  color-scheme: light;\n}\n.hg-scope[data-theme='dark'] {\n${declarations(source.semantic.dark)}\n  color-scheme: dark;\n}\n`
await mkdir('public/brand/huginn', { recursive: true })
await writeFile('features/huginn/huginn-tokens.css', css)
await writeFile('public/brand/huginn/huginn-tokens.css', css)
await writeFile('public/brand/huginn/huginn-tokens.json', `${JSON.stringify(source, null, 2)}\n`)
console.log(`Huginn tokens generated from ${source.meta.name}`)
