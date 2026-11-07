# sunnyside-components

**8-State UI Kits, Apple-Style Dimensional Anatomy Drawings & Component Docs**

Transforms Sunnyside brand tokens into battle-tested production primitives, monochrome technical dimension spec sheets (with concentric radii formulas and exploded axonometric layer stacks), and sourced documentation.

## Modes

1. **`kit`**: Production 8-state component families (`Button`, `Field`, `Select`, `Dialog`, `Card`, `Tabs`, `Table`).
2. **`anatomy`**: Apple-style technical dimensional redline sheets (`scripts/anatomy-sheet.mjs`).
3. **`docs`**: Sourced component documentation with strict usage rules and `Do:` / `Don't:` snippets.

## Usage

```bash
# Generate Apple-style dimensional drawing sheet with motion
node skills/sunnyside-components/scripts/anatomy-sheet.mjs --slug tavola --component card --motion
```
