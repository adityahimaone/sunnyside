# cove — QA

**URL:** http://localhost:3000/design-system/cove
**Run:** 2026-10-28T11:09:46.335Z → 2026-10-28T11:10:08.445Z
**Verdict:** **PASS** — 24 pass, 5 warn, 0 fail.



## Checks

| Status | Check | Evidence |
| --- | --- | --- |
| pass | Static audit | Audit: PASS — 16 passed, 0 warnings, 0 failures |
| pass | Mark score | PASS  cove |
| pass | Theme toggle | light → dark |
| pass | Typography body 1440-light | 16px |
| warn | Typography heading 1440-light | h1 weight 400; 600+ is expected. |
| pass | Typography input 1440-light | 14px at 1440px |
| pass | Overflow 1440-light | 0px |
| skip | Shader 1440-light | No dither data-state on the page. |
| pass | Console 1440-light | No page errors; no non-shader console errors. |
| pass | Form states | 1 alert(s); invalid: cv-name, cv-email, cv-password; focus alert. |
| pass | Typography body 1440-dark | 16px |
| warn | Typography heading 1440-dark | h1 weight 400; 600+ is expected. |
| pass | Typography input 1440-dark | 14px at 1440px |
| pass | Overflow 1440-dark | 0px |
| skip | Shader 1440-dark | No dither data-state on the page. |
| pass | Console 1440-dark | No page errors; no non-shader console errors. |
| pass | Typography body 390-light | 16px |
| warn | Typography heading 390-light | h1 weight 400; 600+ is expected. |
| pass | Typography input 390-light | 16px at 390px |
| pass | Overflow 390-light | 0px |
| skip | Shader 390-light | No dither data-state on the page. |
| pass | Console 390-light | No page errors; no non-shader console errors. |
| pass | Typography body 390-dark | 16px |
| warn | Typography heading 390-dark | h1 weight 400; 600+ is expected. |
| pass | Typography input 390-dark | 16px at 390px |
| pass | Overflow 390-dark | 0px |
| skip | Shader 390-dark | No dither data-state on the page. |
| pass | Console 390-dark | No page errors; no non-shader console errors. |
| pass | Typography body 1440-light-reduced | 16px |
| warn | Typography heading 1440-light-reduced | h1 weight 400; 600+ is expected. |
| pass | Typography input 1440-light-reduced | 14px at 1440px |
| pass | Overflow 1440-light-reduced | 0px |
| skip | Shader 1440-light-reduced | No dither data-state on the page. |
| pass | Console 1440-light-reduced | No page errors; no non-shader console errors. |

## Runs

| Run | Theme | Overflow | Shader | Console errors |
| --- | --- | --- | --- | --- |
| 1440-light | light | 0px | n/a | 0 |
| 1440-dark | dark | 0px | n/a | 0 |
| 390-light | light | 0px | n/a | 0 |
| 390-dark | dark | 0px | n/a | 0 |
| 1440-light-reduced | light | 0px | n/a | 0 |

## Screenshots

- `cove-1440-light.jpg`
- `cove-hero-light.png`
- `cove-form-errors.png`
- `cove-form-focus.png`
- `cove-section-foundation.jpg`
- `cove-section-marks.jpg`
- `cove-section-colour.jpg`
- `cove-section-applications.jpg`
- `cove-1440-dark.jpg`
- `cove-hero-dark.png`
- `cove-390-light.jpg`
- `cove-390-dark.jpg`
- `cove-reduced-motion.png`

## Static audit

```
PASS  required files: 30/30
PASS  SVGs: 13/13 valid, brand assets have no <text>
PASS  ICO: 16, 32, 48
PASS  PNG: public/brand/cove/favicon-16.png 16×16
PASS  PNG: public/brand/cove/favicon-32.png 32×32
PASS  PNG: public/brand/cove/favicon-48.png 48×48
PASS  PNG: public/brand/cove/apple-icon-180.png 180×180
PASS  PNG: public/brand/cove/icon-192.png 192×192
PASS  PNG: public/brand/cove/icon-512.png 512×512
PASS  PNG: public/brand/cove/mark-1024.png 1024×1024
PASS  PNG: design/brand/cove/cove-brandkit.png 3000×2250
PASS  tokens: primitives 17, semantic.light 20, semantic.dark 20, components.light 25, components.dark 25
PASS  contrast: 14/14 pairs >= 4.5:1
PASS  family: 5 marks share viewBox 0 0 64 64
PASS  forms: no raw colours, tokens only
PASS  story: 6 required sections present

Audit: PASS — 16 passed, 0 warnings, 0 failures
```

## Mark score

```
PASS  cove
   NOTE  dominant field 90% (v2.3 solid mass; channels are the negative space)
```

## Not verified

Safari and Firefox; a production build; visual regression; axe CI; print and
social crops. Add them to the host's CI if the surface ships.
