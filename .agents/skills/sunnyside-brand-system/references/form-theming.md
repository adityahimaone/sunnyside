# Form theming: fields that match the mark

A form field is the most-used piece of a design system and the first place a
brand falls apart. Generic inputs on a branded page look like a different
product. The rule: **the form kit reads the same theme DNA as the mark.**

## 1. Theme DNA

Define one small object. The logo and the fields both read it.

| Key | Values | Mark uses it for | Field uses it for |
| --- | --- | --- | --- |
| `edge` | `hard` / `soft` / `none` | tile shadow | field shadow |
| `offset` | grid units (0 = none) | shadow offset | field shadow offset |
| `stroke` | grid units | ink edge | border weight (×0.6, min 1.5px) |
| `radius` + `tile` | rounded / circle / square | tile corners | field radius (half) |
| `ring` | `offset` / `solid` / `glow` | n/a | focus ring |
| `density` | compact / cosy / roomy | n/a | field height + gap |
| `label` | sentence / mono-caps / small-caps | n/a | label style |

`scripts/brand-forge.mjs` derives `--field-*` tokens and `<slug>-forms.css` from
this object and writes a working `forms.html`. Hand-written fields follow the
same table.

## 2. Material → field recipe

| Material | Border | Shadow | Focus | Hover | Label | Trap |
| --- | --- | --- | --- | --- | --- | --- |
| **Paper / hard offset** (Sunnyside) | 1.5px ink | hard 2.5 offset, no blur | 2px paper gap + 2px accent ring | lift −1px | sentence | blur breaks the "cut paper" idea |
| **Liquid glass** | 1px edge at 30% | inner highlight, soft | solid 2px ring on a solid chip | brighten fill | sentence | text on blur under 4.5:1; put text on a solid surface |
| **Dither / 1-bit** | 1px solid ink | none | invert fill | dither step | mono-caps | pattern behind text hurts legibility |
| **Neo-brutalist** | 3px black | hard 4–6 offset | thick accent bar | offset grows | mono-caps / caps | offset animation janks on mobile |
| **Editorial / Swiss** | bottom rule only | none | rule thickens + accent | none | small-caps | placeholder-as-label |
| **Bento / modular** | 1px hairline | soft 1–2px | solid ring | tint | sentence | too many radii; one radius only |
| **Grain / riso** | 1.5px, slight misregistration | offset in a second ink | accent ring | none | mono-caps | grain texture over text |
| **Mono / terminal** | 1px, square | none | block cursor + underline | none | mono-caps | tiny type; keep ≥14px |

Pick the row that matches the material you named in the brief. Do not mix
rows. A hard-offset field next to a glass card is two brands.

## 3. Tokens, not values

Fields read **component tokens**; components read semantic; semantic reads
primitive. No raw hex inside field CSS (`audit.mjs` fails it).

```css
--field-bg      --field-fg      --field-border   --field-radius
--field-shadow  --field-h       --field-gap      --field-pad
--field-ring    --button-bg     --button-ink
```

Dark theme: re-derive, do not invert. A hard ink offset vanishes on an ink
ground, so the dark scope swaps it for the core colour (`brand-forge` does this).

## 4. States are part of the theme

Every control ships these, all in the same material:

| State | Rule |
| --- | --- |
| Default | Visible border; placeholder in `--muted`, never a label |
| Hover | One physical response (lift, tint, dither step); not colour only |
| Focus-visible | Ring from `--field-ring`; never `outline: none` without it |
| Filled | No visual change except text; do not turn green on filled |
| Invalid | `aria-invalid`, border `--danger`, message with a `!` glyph and text |
| Disabled | 55% opacity, no shadow, no hover; keep value and label |
| Success | Text confirmation; never a green border alone |
| Active/pressed | Press into the page (offset → 0) when the material is raised |

Never use colour as the only signal. The error glyph and text are not optional.

## 5. Control checklist

- Text, email, password (show/hide as a button with `aria-pressed`), select,
  textarea + counter, checkbox, radio (fieldset + legend), switch
  (`role="switch"`, `aria-checked`), range, file, submit/reset, disabled.
- Visible `<label>` for every control; hint for non-obvious formats.
- 44px minimum target where practical; 16px type on mobile inputs.
- Error summary: `role="alert"`, `tabindex="-1"`, focused on invalid submit,
  links to each field, cleared per-field on edit.
- Native elements first; Radix for Select/Dialog/Popover/Switch/Slider when the
  host already has it. Style Radix with the same `--field-*` tokens via
  `data-slot` / `data-state`.

## 6. shadcn / Tailwind mapping

```css
/* host app owns --input, --ring, --radius: map, do not rename */
:root {
  --input: var(--field-border-color);
  --ring: var(--focus);
  --radius: var(--field-radius);
}
```

Style shadcn `Input`, `Textarea`, `Select`, `Checkbox`, `Switch` by
overriding the class with the field tokens, not by forking the primitive.
Keep `data-slot` and `data-state` intact.

## 7. Acceptance

- [ ] The field has the same edge, radius family and shadow logic as the mark.
- [ ] A screenshot of mark + field + button reads as one sheet of material.
- [ ] All states present in light and dark, keyboard focus visible in both.
- [ ] No raw hex in field CSS; contrast measured for text, border and ring.
- [ ] Error, disabled and success verified in the browser, not assumed.
- [ ] Reduced motion keeps the finished state.
- [ ] Theme DNA recorded in tokens JSON so the next person can regenerate.
