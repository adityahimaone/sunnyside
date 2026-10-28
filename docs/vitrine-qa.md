# vitrine — QA

**URL:** http://localhost:3000/design-system/vitrine
**Run:** 2026-10-28T07:49:23.017Z → 2026-10-28T07:49:43.213Z
**Verdict:** **PASS** — 29 pass, 1 warn, 0 fail.



## Checks

| Status | Check | Evidence |
| --- | --- | --- |
| pass | Static audit | Audit: PASS — 16 passed, 0 warnings, 0 failures |
| pass | Mark score | PASS  vitrine |
| pass | Theme toggle | light → dark |
| pass | Typography body 1440-light | 16px |
| pass | Typography input 1440-light | 14px at 1440px |
| pass | Overflow 1440-light | 0px |
| pass | Shader 1440-light | data-state="running" |
| pass | Console 1440-light | No page errors; no non-shader console errors. |
| warn | GPU 1440-light | 4 WebGL performance warning(s). |
| pass | Form states | 1 alert(s); invalid: vt-name, vt-email, vt-password; focus alert. |
| pass | Typography body 1440-dark | 16px |
| pass | Typography input 1440-dark | 14px at 1440px |
| pass | Overflow 1440-dark | 0px |
| pass | Shader 1440-dark | data-state="running" |
| pass | Console 1440-dark | No page errors; no non-shader console errors. |
| pass | Typography body 390-light | 16px |
| pass | Typography input 390-light | 16px at 390px |
| pass | Overflow 390-light | 0px |
| pass | Shader 390-light | data-state="running" |
| pass | Console 390-light | No page errors; no non-shader console errors. |
| pass | Typography body 390-dark | 16px |
| pass | Typography input 390-dark | 16px at 390px |
| pass | Overflow 390-dark | 0px |
| pass | Shader 390-dark | data-state="running" |
| pass | Console 390-dark | No page errors; no non-shader console errors. |
| pass | Typography body 1440-light-reduced | 16px |
| pass | Typography input 1440-light-reduced | 14px at 1440px |
| pass | Overflow 1440-light-reduced | 0px |
| pass | Reduced motion 1440-light-reduced | data-state="static" |
| pass | Console 1440-light-reduced | No page errors; no non-shader console errors. |

## Runs

| Run | Theme | Overflow | Shader | Console errors |
| --- | --- | --- | --- | --- |
| 1440-light | light | 0px | running | 0 |
| 1440-dark | dark | 0px | running | 0 |
| 390-light | light | 0px | running | 0 |
| 390-dark | dark | 0px | running | 0 |
| 1440-light-reduced | light | 0px | static | 0 |

## Screenshots

- `vitrine-1440-light.jpg`
- `vitrine-hero-light.png`
- `vitrine-form-errors.png`
- `vitrine-form-focus.png`
- `vitrine-section-foundation.jpg`
- `vitrine-section-marks.jpg`
- `vitrine-section-colour.jpg`
- `vitrine-section-applications.jpg`
- `vitrine-1440-dark.jpg`
- `vitrine-hero-dark.png`
- `vitrine-390-light.jpg`
- `vitrine-390-dark.jpg`
- `vitrine-reduced-motion.png`

## Static audit

```
PASS  required files: 28/28
PASS  SVGs: 13/13 valid, brand assets have no <text>
PASS  ICO: 16, 32, 48
PASS  PNG: public/brand/vitrine/favicon-16.png 16×16
PASS  PNG: public/brand/vitrine/favicon-32.png 32×32
PASS  PNG: public/brand/vitrine/favicon-48.png 48×48
PASS  PNG: public/brand/vitrine/apple-icon-180.png 180×180
PASS  PNG: public/brand/vitrine/icon-192.png 192×192
PASS  PNG: public/brand/vitrine/icon-512.png 512×512
PASS  PNG: public/brand/vitrine/mark-1024.png 1024×1024
PASS  PNG: design/brand/vitrine/vitrine-brandkit.png 3000×2250
PASS  tokens: primitives 16, semantic.light 22, semantic.dark 22, components.light 24, components.dark 24
PASS  contrast: 9/9 pairs >= 4.5:1
PASS  family: 5 marks share viewBox 0 0 64 64
PASS  forms: no raw colours, tokens only
PASS  story: 6 required sections present

Audit: PASS — 16 passed, 0 warnings, 0 failures
```

## Mark score

```
PASS  vitrine
   NOTE  dominant field 50% (v2.3 solid mass; channels are the negative space)
```

## Not verified

Safari and Firefox; a production build; visual regression; axe CI; print and
social crops. Add them to the host's CI if the surface ships.
