# Hero "Sunrise" and the About sticker tray

The brief: an immersive, stunning, animated (ideally 3D) hero that stays
lightweight, then stickers that obey gravity when the page reaches About.

## Directions weighed

| #   | Direction                                                                                                     | Why it lost or won                                                                                                                                                                             |
| --- | ------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | **Real 3D sun in WebGL** (`three` is already a dependency): an extruded sun, toon-lit, with orbiting stickers | Most literal "3D", but it ships a renderer for one object, adds a canvas the page then has to keep alive, and the system draws every mark flat. Rejected on weight.                            |
| 2   | **Sticker-sheet peel**: the hero is a sheet of stickers that peels away on scroll                             | Strong story, but it is the old hero's paper-card idea again, and a peel needs a lot of bespoke geometry for one moment. Kept only as an echo: the hero stickers leave dashed outlines behind. |
| 3   | **Paper-theatre diorama**: cardboard planes in real CSS 3D, tilting with the pointer                          | Fits the brand (die-cut, hard shadows), costs no dependency, and the depth is genuine. **Chosen as the base.**                                                                                 |
| 4   | **Orbit / planetarium** of stickers around a central sun                                                      | Perpetual motion by design, which `design.md` rules out, and it fights the copy for space.                                                                                                     |
| 5   | **Sunrise over the paper**: the sun rises from behind the paper the rest of the site is printed on            | Gives the hero a place in the page (sky over paper ground) and a reason for the cobalt field. **Chosen as the composition**, on top of 3.                                                      |

For gravity: matter-js was weighed and dropped. The stickers are close to
round, so a ~200 line circle world with spin, friction and sleep covers
stacking, rolling, walls and being flung, with no dependency.

## What shipped

- `studio/hero/` is the scene: a flat-banded cobalt sky, a ring of rays, a far
  hill, the sun (six ink cut-outs under the painted face, so it shows an edge
  when it tilts), clouds, four stickers and the paper ground. Wrappers move with
  the individual `translate` / `rotate` / `scale` properties; the elements
  inside run the entrance with `transform`, so the two never fight.
- `use-hero-scene.ts` is one rAF loop for pointer parallax and scroll, running
  only while the hero is on screen. Touch gets scroll only.
- `studio/gravity/` is the tray: `physics.ts` (pure, tested), `pit-runtime.ts`
  (release on view, drag and fling, shake, resize, sleep), `sticker-pit.tsx`.
- The hero's four stickers fall into the tray and leave dashed outlines. The
  journey now flies only the sun and the heart.

## Weight and motion

- No new dependencies, no WebGL, no images. The runtime is ~11 KB unminified.
- Nothing loops forever. After the entrance (sun rise, three pulse rings, a few
  sparkle twinkles, four slow sticker drifts) the hero is still, and pointer
  parallax is the only thing that moves it. Early builds looped the rings,
  twinkle and bob; with them running, an idle hero cost a frame budget in a
  software renderer, and `design.md` asks for no perpetual decoration.
- The sticker drop-shadow is a filter on the drawing, not on the element that
  moves, so it is rasterised once instead of every frame.
- The tray simulates only while on screen and something is moving; at rest it
  costs nothing.

## Accessibility

- The scene and the stickers are `aria-hidden`; the tray's one control, "Shake
  the tray", is a real button.
- Reduced motion builds no loops: the hero is the finished picture, and the
  tray shows each sticker sitting in its own outline.
- Only the stickers capture touch (`touch-action: none`), so the tray never
  traps scrolling.

## Known limits

- The tray is wide and shallow, so seven flat discs settle as a row, not a
  heap. A bowl-shaped floor would heap them; it was left out as a bigger change.
- Checked in headless Chrome under software rendering at small viewports. Not
  yet profiled on real devices.
