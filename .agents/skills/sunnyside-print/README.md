# sunnyside-print

Generates the two kinds of Sunnyside print artefact in code: 16:10 **sleeves** (the generated
covers for releases without artwork) and 4:5 **prints** (the Show & tell studies).

```bash
node scripts/sleeve.mjs --title "SeaPhantom P2P" --index 3 --variant orbit --field cobalt --out out/sleeve.svg
node scripts/print.mjs --template sheet --title "Peel Here" --out out/peel-here.html
node scripts/render.mjs --in out/peel-here.html --out out/peel-here.png --width 700 --height 860 --selector .frame
```

Start with `SKILL.md`. The numbers behind the two artefacts are in `references/`.

`render.mjs` borrows `@playwright/test` from the project it runs in, so run it from the
Sunnyside repo. `assets/` carries both faces (OFL): Syne for the shout, Geist Mono for the
labels.

The contact sheet in `examples/` is every artefact this skill makes, in one PNG.
