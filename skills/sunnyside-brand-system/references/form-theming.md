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

## 2. Contract → field recipe

Pick **one row for the one contract** resolved in Step 0 Q1 (`references/styles.md`). Do not mix rows.
A hard-offset field next to a glass card is two brands. The first table is the legacy material shelf
for older `forms.html` builds; the second is the exact contract table used by v4.9 showcase pages. If
a Q1 answer resolves to a numbered contract, the exact table wins.

Pillar V's mono ban is not a licence to put tiny uppercase labels everywhere. On showcase pages use
sentence-case labels; mono is reserved for the rail number, tabular figures in a ledger, a code sheet
and one data stamp on a photograph. The `mono-caps` entries in the legacy table are standalone form-kit
recipes, not hero chrome.

### 2.1 Legacy material recipes

| Material | Border | Shadow | Focus | Hover | Label | Trap |
| --- | --- | --- | --- | --- | --- | --- |
| **Paper / hard offset** (Sunnyside) | 1.5px ink | hard 2.5 offset, no blur | 2px paper gap + 2px accent ring | lift −1px | sentence | blur breaks the "cut paper" idea |
| **Liquid glass** | 1px inset rim | one specular top edge only | solid 2px ring on a solid chip | brighten fill | sentence | text on blur under 4.5:1; put text on a solid surface |
| **Dither / 1-bit** | 1px solid ink | none | invert fill | dither step | mono-caps | pattern behind text hurts legibility |
| **Neo-brutalist** | 3px black | hard 4–6 offset | thick accent bar | offset grows | mono-caps / caps | offset animation janks on mobile |
| **Editorial / Swiss** | bottom rule only | none | rule thickens + accent | none | small-caps | placeholder-as-label |
| **Bento / modular** | 1px hairline | none | solid ring | tint | sentence | too many radii; one radius only; card shadows |
| **Grain / riso** | 1.5px, slight misregistration | offset in a second ink | accent ring | none | mono-caps | grain texture over text |
| **Mono / terminal** | 1px, square | none | block cursor + underline | none | mono-caps | tiny type; keep ≥14px |

### 2.2 Exact Step 0 contracts and modern styles

| Contract | Border | Shadow | Focus | Hover | Label | Trap |
| --- | --- | --- | --- | --- | --- | --- |
| **#1 Paper & ink** | 1px ink at 18% | none | 2px solid ink ring on ground | one tone step | sentence | a hard offset turns this into #26 / #28 |
| **#4 Blueprint grid** | 1px white at 22% on deep blue | none | 1.5px white ring | grid brightens | sentence, figures tabular | radius, serif, or a missing grid |
| **#5 Cardboard & steel** | 1px cold grey | none | 2px steel ring | flatten to ground | sentence | radius, soft shadow, or a serif |
| **#13 Cockpit panel** | 1px at 14% | none | 2px near-white ring | row tint | sentence, figures tabular | airy rows, white cards, or a serif |
| **#15 Frosted glass / glassmorphism 2.0** | 1px light at 22% | one inner top highlight only | solid 2px ring on a solid chip | brighten fill | sentence | text on blur under 4.5:1; a coloured bloom; a second blur radius |
| **#19 Liquid glass** | 1px inset rim at 9% + 1px mullions | one specular top edge, no soft card shadow | solid 2px ring on a solid chip | brighten pane | sentence | text on blur; a gap plus opaque filler; more than one highlight |
| **#20 Bento / modular grid** | 1px hairline at 12% | none | solid ring | tint | sentence | equal spans, a second radius, a card shadow, or a gradient |
| **#21 Scroll-reactive glass** | 1px white at 8% on nav / panes | none; one blue glow at one seam | solid 2px ring on a solid chip | nav blur grows on scroll only | sentence, figures tabular | blur behind body copy, a second glow, horizontal rules, a hero card |
| **#22 Aurora / mesh glow** | 1px white at 10% on a solid plate | none | solid 2px ring on a solid plate | plate tint | sentence | text on the mesh, >3 stops, any stop above 6% |
| **#23 OLED dark-first** | 1px white at 14% | none | 2px near-white ring | one tone step | sentence, figures tabular | calling `#111` black, a glow, or a white card |
| **#24 Exaggerated minimalism** | bottom 1px rule only | none | rule thickens + accent | none | sentence | any card, a second display face, or placeholder-as-label |
| **#25 Organic biophilic / anti-grid** | 1px ink at 14% | none | 2px ground-ink ring | none | sentence | a gradient sky, a frosted plate, grain behind text, or any card |
| **#26 Dimensional layering** | 1px ink at 10% | one hard 6px offset on the top plate only, no blur | 2px ring; pressed offset → 0 | press into page | sentence | a soft shadow, a second lifted element, or a second light |
| **#27 Spatial / VisionOS depth** | 1px white at 16% on plate edges | none | 2px near-white ring on a solid plate | one parallax layer only | sentence | a grid of floating cards, text on the object, or >3 depth layers |
| **#28 Neubrutalism** (`archival`) | 3px solid black | one hard 4–6px offset | thick accent bar | offset grows | sentence; caps only in legacy form kit | a soft shadow, any radius, a glass pane, or offset animation jank |

For `#15`, `#19`, `#21`, `#22`, `#26`, `#27` and `#28`, the field uses only the scoped override in
`styles.md` §8. Reading copy and labels stay on a solid plate; compute the pane / mesh contrast and
publish the failing pair in §03 with the job it may not do.

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

- [ ] The Step 0 contract is named and exactly one field row is used; no mixed rows.
- [ ] The field has the same edge, radius family and shadow logic as the mark.
- [ ] Any glass / mesh / hard-offset override matches `references/styles.md` §8, and its pane or mesh contrast failure is published in §03.
- [ ] A screenshot of mark + field + button reads as one sheet of material.
- [ ] All states present in light and dark, keyboard focus visible in both.
- [ ] No raw hex in field CSS; contrast measured for text, border and ring.
- [ ] Error, disabled and success verified in the browser, not assumed.
- [ ] Reduced motion keeps the finished state.
- [ ] Theme DNA recorded in tokens JSON so the next person can regenerate.
