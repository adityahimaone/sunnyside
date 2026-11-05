# The route

`page.html` is the specimen, generated from `../../index.html` by
`scripts/build-tokens.mjs` with its asset prefixes lifted three levels. `layout.tsx`
registers the three faces as CSS variables, which is the only thing the React layer
does: without it the token sheet names fonts that never load.

There is no `page.tsx` on purpose. The specimen is one hand-authored HTML file, and a
second React rendering of it would be a second implementation that drifts the first
time a colour moves. One artefact, one source, one place to be wrong.

`llms.txt/route.ts` is the agent-readable twin: it reads `tokens.json` and emits the
palette, the computed contrast, the type scale and the rules as text.

If this moves into a real Next app:

1. `import '@/features/wildflower-wind/wildflower-wind-tokens.css'` in the layout.
2. Serve `page.html` from `public/` and route to it, or port the sections to
   components — but then delete `index.html` and this file, so there is still exactly
   one implementation.
