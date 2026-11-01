# bluewater — QA

**URL:** http://localhost:3000/design-system/bluewater
**Run:** 2026-11-01T08:21:37.701Z → 2026-11-01T08:21:51.917Z
**Verdict:** **PASS** — 20 pass, 0 warn, 0 fail.



## Checks

| Status | Check | Evidence |
| --- | --- | --- |
| skip | Theme toggle | No Dark/Light button found; theme forced for screenshots. |
| pass | Typography body 1440-light | 16px |
| pass | Typography input 1440-light | 16px at 1440px |
| pass | Overflow 1440-light | 0px |
| skip | Shader 1440-light | No dither data-state on the page. |
| pass | Console 1440-light | No page errors; no non-shader console errors. |
| skip | Form states | No <form> found. |
| pass | Typography body 1440-dark | 16px |
| pass | Typography input 1440-dark | 16px at 1440px |
| pass | Overflow 1440-dark | 0px |
| skip | Shader 1440-dark | No dither data-state on the page. |
| pass | Console 1440-dark | No page errors; no non-shader console errors. |
| pass | Typography body 390-light | 16px |
| pass | Typography input 390-light | 16px at 390px |
| pass | Overflow 390-light | 0px |
| skip | Shader 390-light | No dither data-state on the page. |
| pass | Console 390-light | No page errors; no non-shader console errors. |
| pass | Typography body 390-dark | 16px |
| pass | Typography input 390-dark | 16px at 390px |
| pass | Overflow 390-dark | 0px |
| skip | Shader 390-dark | No dither data-state on the page. |
| pass | Console 390-dark | No page errors; no non-shader console errors. |
| pass | Typography body 1440-light-reduced | 16px |
| pass | Typography input 1440-light-reduced | 16px at 1440px |
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

- `bluewater-1440-light.jpg`
- `bluewater-hero-light.png`
- `bluewater-1440-dark.jpg`
- `bluewater-hero-dark.png`
- `bluewater-390-light.jpg`
- `bluewater-390-dark.jpg`
- `bluewater-reduced-motion.png`

## Static audit

Not run.

## Mark score

Not run.

## Not verified

Safari and Firefox; a production build; visual regression; axe CI; print and
social crops. Add them to the host's CI if the surface ships.
