# 8-State Interactive Behavior Contracts & ARIA Patterns

Adapted from `build-design-system` and `component-docs`.

---

## 1. The 8 States & Trigger Definitions

| State | CSS Selector / ARIA | Visual Manifestation | Trigger / Firing Condition |
|---|---|---|---|
| **Default** | `:enabled:not(:hover):not(:active)` | Base tokens, $\ge 4.5:1$ text contrast | At rest. |
| **Hover** | `:hover:not(:disabled)` | Lightness shift, subtle tone step | Pointer enters bounding box. Pointer devices only (`@media (hover: hover)`). |
| **Focus-Visible** | `:focus-visible` | $\ge 3:1$ outline ring, 2px offset | Keyboard `Tab` navigation or programmatic focus. Never on plain mouse click. |
| **Active** | `:active` | `scale(0.97)`, pressed tone step | Pointer down or `Space`/`Enter` key depressed. Duration 140ms. |
| **Disabled** | `:disabled`, `[aria-disabled="true"]` | 45% opacity, `cursor: not-allowed` | Form or parent sets disabled. `pointer-events: none` on sub-elements. |
| **Loading** | `[aria-busy="true"]` | Idle width preserved, inline spinner replaces or overlays text | Async action in flight. Banned: changing width with longer copy. |
| **Invalid** | `[aria-invalid="true"]` | Error stroke, linked error text | Validation failure. Must link `aria-describedby="<id>-error"`. |
| **Selected** | `[aria-selected="true"]`, `[aria-pressed="true"]` | Inverted surface or accent indicator | Toggle or tab item active. |

---

## 2. Form Error Summary & Focus Pattern

When a form fails client or server validation:
1. Render an error summary container at the top of the form with `role="alert"` and `aria-live="polite"`.
2. Programmatically shift focus to the error summary or the first invalid field:
   ```ts
   const firstInvalid = formRef.current?.querySelector('[aria-invalid="true"]') as HTMLElement
   firstInvalid?.focus()
   ```
3. Ensure every field with an error references its message:
   ```html
   <input id="email" aria-invalid="true" aria-describedby="email-error" />
   <p id="email-error" class="errorText">Please enter a valid work email address.</p>
   ```

---

## 3. Keyboard Traps & Focus Trapping in Modals

1. **Dialog / Sheet (`role="dialog"`, `aria-modal="true"`)**:
   - Focus is caught inside the modal. Tabbing past the last interactive element loops to the close button.
   - `Escape` key closes the dialog and returns focus to the trigger button that opened it.
   - Background scroll is locked on the body (`overflow: hidden; padding-right: <scrollbarWidth>`).
