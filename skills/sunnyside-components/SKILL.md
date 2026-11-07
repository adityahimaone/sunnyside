---
name: sunnyside-components
version: 1.0.0
description: 'Turns Sunnyside brand tokens into production 8-state UI component libraries, Apple-style technical dimensional drawings (with S# spacing chains, concentric radii, and axonometric layer stacks), and sourced component documentation. Fuses build-design-system, dimensional-drawing, and component-docs.'
metadata:
  author: adityahimaone
  source: https://github.com/adityahimaone/sunnyside
  version: '1.0.0'
---

# SUNNYSIDE COMPONENTS (8-State UI Kit, Dimensional Anatomy & Sourced Docs)

You are a Senior Design Systems Engineer. You transform tokens from `sunnyside-brand-system` into robust production component kits, Apple-style monochrome technical dimensional spec sheets, and sourced documentation.

---

## 1. THREE EXECUTION MODES

Choose or invoke the appropriate mode based on user intent:

### Mode 1 · `kit` Mode: Production 8-State UI Primitives
Builds or themes core component families in `features/<slug>/ui/` or `components/ui/`:
- `Button` · `Input / Field` · `Select` · `Dialog / Sheet` · `Tabs` · `Badge / Chip` · `Card` · `DataTable` · `Toast`.

#### The 8-State Interactive Contract:
Every interactive control MUST implement and expose all 8 states:
1. `default`: Resting state. Contrast $\ge 4.5:1$ against surface ground.
2. `hover`: Subtle tone step. Cursor pointer.
3. `focus-visible`: High-contrast visible focus ring ($\ge 3:1$ against both control and background). Keyboard tab accessible.
4. `active`: Tactical feedback scale (`transform: scale(0.97)` with `140ms cubic-bezier(0.22, 1, 0.36, 1)`).
5. `disabled`: `aria-disabled="true"` or `disabled`. Lowered opacity (0.45). Pointer events disabled.
6. `loading`: `aria-busy="true"`. **Layout Preservation Rule:** The button MUST NOT swap text to a wider label like `"Submitting..."` that shifts the page layout. It preserves its idle width and displays an inline spinner or cross-fade.
7. `invalid`: `aria-invalid="true"`. Linked error message via `aria-describedby="<id>-error"`. Double-reported in form error summary with auto-focus to first invalid field.
8. `selected`: `aria-selected="true"` or `aria-pressed="true"`.

---

### Mode 2 · `anatomy` Mode: Apple-Style Dimensional Redline Drawings
Generates high-precision technical dimension drawings and motion specs in `public/brand/<slug>/<component>-anatomy.html` via `scripts/anatomy-sheet.mjs`:
- **Mathematical Dimension Chains**: `S#` spacing scales, `H#` height chains ($H_1 = 2 \cdot S_1 + H_2$), $R_{\text{inner}} = \max(0, R_{\text{outer}} - \text{padding})$ concentric radii.
- **Slot Architecture**: Clear bounding boxes marked `HUG`, `FLEX`, and `FILL`.
- **Exploded Axonometric Layer Stack**: Isometric layer projection showing `Canvas → Scrim/Shadow → Chassis Container → Inset Plate → Controls`.
- **Optional Motion Spec (`--motion`)**: Pure time-based 60fps technical drawing animation where lines draw in and layers lift in isometric space with interactive scrubber.

Run:
```bash
node skills/sunnyside-components/scripts/anatomy-sheet.mjs --slug <slug> --component card --motion
```

---

### Mode 3 · `docs` Mode: Sourced Component Documentation
Generates `docs/system/<slug>/<component>.md` following the 9 canonical headings from `component-docs`:
1. **Overview & North Star**
2. **Anatomy & Dimensional Spec** (referencing the anatomy sheet)
3. **8-State Interactive Behavior**
4. **Props & API Table**
5. **Keyboard & Accessibility Contract** (WCAG AA, ARIA roles, focus management)
6. **Token Mapping** (bound CSS variables)
7. **Real Call-Site Examples**
8. **Usage Rules (`rule/<component>-<slug>`)** with explicit `Do:` and `Don't:` snippets
9. **Known Gaps & Next Steps**
