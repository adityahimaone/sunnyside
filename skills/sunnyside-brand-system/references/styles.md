# Style Library — 28 surface contracts, 8 composition recipes, 5 behaviours

Step 0 asks **one** `Surface & Style` question with **8 options** (Auto + 7). This file is the depth
behind that front door. It exists so a short selector can reach a large, deterministic vocabulary
without ever showing a 57-item dropdown.

- **18 canonical contracts** live in `references/surfaces.md` (§1–§18). They are indexed in §4 below.
- **10 modern contracts** (§19–§28) are specified in full here, using the same nine slots.
- **8 composition recipes** (§6) are *not* surfaces — they bind to the Q3 hero answer and to sections.
- **5 behaviours** (§7) are *not* surfaces — they bind to the `motion` slot, Q5 polarity, or nothing.
- **Aliases** (§5) map trend words a user might type into the freeform `Other` input onto exactly one
  contract, one recipe, or "out of scope".

> **The determinism law.** A style name is not implementable until it has all nine slots. Two names
> that resolve to the same nine slots are an **alias**, not a second style. If a word cannot be
> resolved to a contract, fall back to Auto and say so in one line — never invent a material nobody
> can build.

Every contract is **universal**: it is a material, not an industry. If an option only makes sense for
one kind of brand, it is a theme and belongs in the archetype, not here.

---

## 1. Resolution order

| Step 0 answer | What the engine does |
|---|---|
| `Auto — decide from my brief` (default) | Read brief + photographs → prompt map (`surfaces.md` §Choosing one, plus §9 below) → any of the 28 contracts. State the pick and why in one line. |
| One of the 7 named options | Use that exact contract. No second question. |
| Freeform `Other` word | Resolve through the alias table (§5). A **contract** alias uses that exact contract; a **composition recipe** R1–R8 or **behaviour** B1–B5 keeps Auto for the material and binds to the hero, motion or scope; an **unknown** or **out-of-scope** word falls back to Auto. State the resolution in one line. |
| A style hint vs. an explicit Q5 polarity answer | Q5 stays binding. A `dark-first` hint becomes behaviour B4, never a second palette; state the constraint in one line. |
| Conflict (e.g. "liquid glass" + a photograph of kraft cartons) | The **photographs** win. Say so in one line. A kraft photograph cannot carry a refracting pane. |
| `"skip questions"` / `"all defaults"` / `"direct"` | Auto for every axis, no `ask_question` call. |

**Never** ask a second style question. **Never** blend two contracts. `form-theming.md` says why: a
hard-offset field next to a glass card is two brands.

## 2. The nine slots (unchanged)

`ground` · `plate` · `text` · `text2` · `rule` · `radius` · `texture` · `type` · `motion`

`demo` is not a slot — it is the consequence: the 210px live demo box in Section 04 must show the
contract doing its job. If two contracts would produce the same demo, one of them is an alias.

## 3. Modern surface contracts 19–28

Recency flags: **`2026 keep`** = named in current trend reporting as surviving; **`archival`** = a
real, implementable contract that 2026 reporting calls fading — keep it reachable, never advertise it
as "latest".

### 19. Liquid glass · `2026 keep`
> Like looking up through the glass floors of a tower. Distinct from the frosted `#15`: this one
> refracts and has a frame.

- `ground` one hazy photograph or one deep cool gradient (never stacked) · `plate` `rgba(255 255 255 / .16)` + `backdrop-filter: blur(26px) saturate(1.25)`
- `text` near-black, **on a solid light plate only** · `text2` ink at 62% on solid plates
- `rule` 1px ink at 9% as an inset rim, plus 1px mullions drawn as outset shadows — **never a gap** between panes
- `radius` 22px squircle, one value across all siblings · `motion` 260ms ease-out, one physical response
- `texture` one specular highlight on the top edge; tint shifts with what sits behind the pane
- `type` neutral grotesque, light weight at display size; tabular mono for figures only
- `demo` one continuous pane divided by 1px mullions over a hazy photograph, with a solid reading plate
- Fails loudly if: a gap plus opaque filler between panes, a coloured bloom behind the glass, type set on a blur, a second blur radius, more than one highlight
- **House rule:** glass override (§8). Publish the pane's own contrast failure in §03.

### 20. Bento / modular grid · `2026 keep`
> Like a lunchbox: unequal compartments holding one object each. A layout lens that is still a surface.

- `ground` flat off-white `#F7F7F8` · `plate` one step lighter `#FFFFFF`, separated by rule only
- `text` near-black · `text2` 62% · `rule` 1px at 12%, never boxing a chip or a stat cell
- `radius` 16px, one family — never two radii on siblings · `motion` 180ms ease-out
- `texture` none; the uneven spans are the texture · `type` geometric sans display + same family UI
- `demo` a 12-column grid with `4/8` and `6/3/3` spans, one card holding a real object
- Fails loudly if: all spans are equal (reads as a table), a second radius appears, a 1px hairline stat box appears, a card is filled with a gradient
- **Also** composition recipe R4 (§6).

### 21. Scroll-reactive glass · `2026 keep`
> Like a dark SaaS homepage whose navigation turns to glass only as you scroll. From the MindCloud build.

- `ground` near-black navy `#060E20` · `plate` `rgba(255 255 255 / .04)` on dark
- `text` `#F7F7F8` · `text2` white at 60%
- `rule` 1px white at 8% **vertical gridlines only**, starting at `--home-page-gridline-start: 128px`; no horizontal rules
- `radius` 12px controls / 16px plates · `texture` one blue glow `linear-gradient(#2B8DFF00 66%, #2B8DFF1A 100%)` at one section seam, plus the gridlines
- `type` one neo-grotesque (Roobert-like) + tabular figures for live counters · `motion` scroll-linked, 160ms; reduced motion holds the end state
- `demo` a dark ruled section, a navbar whose `blur(calc(var(--scrolled) * 220px))` grows on scroll, and one live tabular counter
- Fails loudly if: blur reaches body copy, a second glow appears, horizontal rules appear, it becomes an aurora mesh, or a hero card appears
- **House rule:** glass + single-gradient override (§8).

### 22. Aurora / mesh glow · `2026 keep`
> A coloured atmosphere, not a background image.

- `ground` deep ink `#0B0F1A` · `plate` `rgba(255 255 255 / .06)`, flat, no blur
- `text` near-white on a solid plate · `text2` 70% · `rule` 1px white at 10% · `radius` 20px
- `texture` 2–3 very low-opacity radial gradients, hue spread ≤ 40°, never under copy
- `type` neutral sans, light display weight · `motion` 320ms slow drift on one axis only
- `demo` a mesh field behind an empty band, with a solid copy plate in front of it
- Fails loudly if: text sits on the mesh, more than 3 stops, any stop above 6% opacity, a second accent appears
- **House rule:** gradient exception (§8) — this is the only contract allowed a mesh. Still no stacked scrims.

### 23. OLED dark-first · `2026 keep`
> True black, one signal. Distinct from `#13 Cockpit panel` (cool near-black, dense rows) and
> `#14 Phosphor terminal` (coloured mono text).

- `ground` `#000000` · `plate` `#0A0A0C` · `text` `#F5F5F5` · `text2` 64%
- `rule` 1px at 14% · `radius` 2px · `texture` none · `motion` 120ms linear
- `type` neutral sans + tabular mono for figures only
- `demo` a 5-row table with tabular numbers and one status dot on pure black
- Fails loudly if: `#111` is called black, a glow appears, a coloured surface is larger than the accent, white cards appear

### 24. Exaggerated minimalism · `2026 keep`
> One enormous line of type; the whitespace is the layout.

- `ground` warm near-white `#F7F6F2` · `plate` none · `text` near-black · `text2` 58%
- `rule` one 1px horizontal rule per section, nothing vertical · `radius` 0 · `texture` none
- `type` one grotesque at `clamp(64px, 12vw, 190px)`, tracking `-0.04em`; body 17px/1.55 at 48ch
- `motion` 200ms ease · `demo` one line filling the measure, one rule, one small figure block
- Fails loudly if: any card appears, a second display face appears, an eyebrow sits above the `<h1>`
- **Binds to** Hero G (typographic cover).

### 25. Organic biophilic / anti-grid · `2026 keep`
> A painted field, not a photograph. The 2026 "human-made / anti-AI" answer; Serenica is the shipped case.

- `ground` uncoated warm stock `#F4F2E9` · `plate` none, rule-separated · `text` deep ground ink `#1A241C` · `text2` 62%
- `rule` 1px at 14% · `radius` 0
- `texture` generative painted field: six flat ridge inks from sage to ground, one fixed light angle, per-pixel mottle and grain; **no photograph**
- `type` editorial serif display + humanist sans UI, no mono outside code
- `motion` 260ms ease-out; reduced motion holds the field still
- `demo` a live six-ridge field above the type, the same seed frozen in the footer
- Fails loudly if: a gradient sky, a frosted plate, a fifth or seventh ridge, a stock meadow photograph, any card
- **Binds to** Hero C + Footer F3.

### 26. Dimensional layering · `2026 keep`
> Stacked sheets with one measured lift — depth without blur.

- `ground` mid-tone paper `#EDEAE3` · `plate` one step lighter `#FBFAF6`, flat
- `text` near-black · `text2` 60% · `rule` 1px at 10% · `radius` 8px, one family
- `texture` one hard offset shadow `0 6px 0 ink@8%` on the top plate only, one light source
- `type` grotesque display + neutral sans UI · `motion` 160ms ease-out; press reduces the offset to 0
- `demo` two stacked plates with one 6px offset, no blur
- Fails loudly if: a soft or blurred shadow, a second lifted element, more than one light, a gradient
- **House rule:** single hard-offset exception (§8).

### 27. Spatial / VisionOS depth · `2026 keep`
> One real object at three depths, not a gallery of floating cards.

- `ground` deep desaturated `#0E1116` · `plate` `rgba(255 255 255 / .08)` + `blur(20px)`, floating
- `text` near-white on solid plates only · `text2` 68% · `rule` 1px white at 16% on plate edges
- `radius` 24px · `texture` one real 3D object with parallax across 2–3 depth layers; no fake dashboard
- `type` neutral sans, light display · `motion` 300ms spring-ease, scroll parallax; reduced motion freezes the final frame
- `demo` one isolated object with two-layer parallax and a solid copy plate
- Fails loudly if: a grid of floating cards, a wireframe grid, type on the object, more than 3 layers
- **House rule:** glass + motion override (§8).

### 28. Neubrutalism / hard offset · `archival`
> Thick black edges and a shadow that does not blur. Keep it buildable; do not call it a 2026 trend.

- `ground` flat off-white · `plate` solid second colour, no blend · `text` black · `text2` black 70%
- `rule` 3px solid black on every panel edge · `radius` 0 · `motion` 100ms step
- `texture` hard 4–6px offset shadow, no blur; one mono-caps label style
- `type` heavy grotesque + mono caps for labels
- `demo` a bordered box with a 5px hard offset and one mono-caps label
- Fails loudly if: a soft shadow, a gradient, any radius, a glass pane
- **House rule:** hard-offset exception (§8) — exactly one shadow at rest, no blur.
- **Recency note:** the 2026 roundups (Sessions.edu, the UXPilot review) list neubrutalism, kinetic
  type and claymorphism as *fading*. Reachable by name, never presented as "latest".

---

## 4. Canonical contracts 1–18 (index)

Full nine-slot definitions stay in `references/surfaces.md`. Recency is informational only — a print
surface is not "old", it is a material. An `archival` flag in §5 describes the **trend label** (soft UI,
Y2K, skeuomorphism, neubrutalism), never the canonical material it resolves to.

| # | Contract | Family | # | Contract | Family |
|---|---|---|---|---|---|
| 1 | Paper & ink | Print | 10 | Marble & brass | Editorial |
| 2 | Newsprint | Print | 11 | Chalk plaster | Editorial |
| 3 | Risograph | Print | 12 | Museum wall label | Editorial |
| 4 | Blueprint | Print | 13 | Cockpit panel | Screen |
| 5 | Cardboard & steel | Industrial | 14 | Phosphor terminal | Screen |
| 6 | Concrete & rebar | Industrial | 15 | **Glass & light** (= frosted glass / glassmorphism 2.0) | Screen |
| 7 | Enamel sign | Industrial | 16 | Pixel grid | Screen |
| 8 | Transit map | Industrial | 17 | Airport signage | Public |
| 9 | Linen & daylight | Editorial | 18 | Civic document | Public |

**Naming note.** `Glassmorphism`, `frosted glass` and `frosted pane` all resolve to **#15**. `Liquid
glass` resolves to **#19**. They are not synonyms: #15 is `rgba` white 8–12% / `blur(18px)` / `16px`
radius / one soft top highlight; #19 is a `26px` refracting pane / `22px` squircle / 1px mullions /
inset rim. Two names, two different demo boxes.

## 5. Alias table — typed style words → one resolution

Sourced from the 57-style taxonomy (UI/UX Pro Max), the 20-style prompt catalogue, and the 2026
trend reporting in §9. Anything marked **behaviour** or **composition** is deliberately not a surface.

| User types | Resolves to |
|---|---|
| glassmorphism, glassmorphism 2.0, frosted glass, frosted pane, blurred panel | **#15** |
| liquid glass, refractive glass, glass tower, specular pane | **#19** |
| scroll glass, sticky blur, dark SaaS glass, vertical gridlines | **#21** |
| aurora, mesh gradient, glow UI, ambient gradient | **#22** |
| OLED, true black, dark first, dark-first | **#23** + B4; Q5 stays explicit and binding |
| exaggerated minimalism, huge type, one-line hero, swiss 2.0 | **#24** |
| biophilic, organic, anti-grid, painted field, field journal | **#25** |
| dimensional layering, stacked sheets, layered cards | **#26** |
| spatial UI, visionOS, 3D depth, parallax object, hyperrealism | **#27** + R6 |
| neubrutalism, brutalism, hard offset, thick borders, claymorphism | **#28** (archival) |
| bento, bento box, bento grid, modular cards, uneven grid | **#20** + R4 |
| blueprint, technical grid, engineering grid, drawing grid | **#4** |
| grid, grid style, modular grid, unqualified "grid" | Auto → **#20** (modular spans), **#4** (technical drawing) or **#13** (data-dense rows), chosen from the brief and photographs; never invent a grid-only surface |
| e-ink, e-paper, riso, risograph, letterpress, zine | **#1** / **#3** / **#11** (pick from photographs) |
| neumorphism, soft UI, soft UI evolution | **#9** (archival) |
| HUD, sci-fi FUI, terminal, CRT, cockpit, dashboard | **#13** / **#14** |
| pixel art, 8-bit, retro, arcade, Y2K, vaporwave, cyberpunk | **#16** / **#14** (archival) |
| memphis, gen z chaos, vibrant blocks, colour bands | **#3** + **#17** / Hero H |
| skeuomorphism, enamel, heritage signage | **#7** / **#10** (archival) |
| minimalism, swiss, editorial minimal, clean startup | **#12** / **#24** |
| hero-centric, conversion-optimized, social proof, trust & authority, storytelling, interactive demo, feature showcase, minimal & direct | **composition R1–R8**, material stays on Auto |
| data-dense dashboard, heat map, executive dashboard, real-time monitoring, drill-down, comparative, predictive, behaviour analytics, financial, sales intelligence | **#13** + the `06 Kit` workbench — a content pattern, not a surface |
| motion-driven, micro-interactions, kinetic typography, parallax storytelling | **behaviour B1–B3** |
| accessible, ethical, inclusive, WCAG | **behaviour** — already enforced by the §03 contrast ledger; not a style |
| zero interface, AI-native UI, generative UI, adaptive UI | **out of scope** — changes content, not material. Say so in one line. |

## 6. Composition recipes (not surfaces)

These bind to the **Q3 hero** answer and to sections. They never override the nine slots.

| # | Recipe | Binds to | One-line contract |
|---|---|---|---|
| R1 | **Icon mosaic wall** (Mobbin) | Hero G / A | A dense grid of *real* app icons with one giant type line threaded through it. No invented logos, no icon library, no card shadows. |
| R2 | **Gallery / index grid** (CollectUI) | §04 Surfaces / §06 Kit | 12-column thumbnail grid, minimal chrome, one radius, no card shadows, one caption per card. |
| R3 | **Live counter band** (MindCloud) | Hero A bench | Tabular figures bound to real data only. A fake live dashboard is the tell that a hero was assembled. |
| R4 | **Bento wall** | **#20** + Hero A | Uneven spans, one radius family, one object per compartment. |
| R5 | **Kinetic type cover** | **#24** + Hero G | One enormous line, one rule, no eyebrow, h1 ≤ 2 lines. |
| R6 | **Storytelling scroll / parallax** | Hero H or C, **#27** | 3–5 bands, one line of the argument per band; reduced motion freezes the final frame. |
| R7 | **Interactive product demo** | Hero C | The stage must be the brand's own object; if there is no real object, take Hero G. |
| R8 | **Full-bleed atmospheric plate** | Hero E | Already canonical: one dominant image, one directional scrim in the surface's own colour, no panel. |

## 7. Behaviours (not surfaces)

| # | Behaviour | Where it binds |
|---|---|---|
| B1 | Purpose-driven motion | the `motion` slot; 120–300ms, one physical response |
| B2 | Micro-interactions | component tokens; `prefers-reduced-motion` keeps the finished state |
| B3 | Parallax / scroll-linked | **#21**, **#27**, R6; reduced motion freezes the final frame |
| B4 | Dark-first / auto scope | **Q5 polarity** — a scope, never a second palette; the explicit Q5 answer stays binding |
| B5 | AI-adaptive / generative UI | **Out of scope.** It changes what the page says, not what it is made of. Never a selector option. |

## 8. House-rule overrides (scoped, never global)

Pillar V bans blur, glass, `backdrop-filter`, gradients and shadows at rest. These overrides are
**scoped to the named contract** and change nothing else. Everything not listed stays banned: no
eyebrow, no monospace hero labels, no outlined chips or 1px stat boxes, no styled accent word, one
accent on the action, `<h1>` ≤ 2 lines, one dominant image ≥ 45% when photographs are supplied.

| Contract | What is allowed | What is still banned |
|---|---|---|
| **#15**, **#19**, **#21**, **#27** | `backdrop-filter` on panes and nav chrome only | Blur behind reading copy; a coloured bloom; a second blur radius; a frosted hero card |
| **#19** | 1px mullions and one specular top highlight | Gaps plus opaque filler between panes; more than one highlight |
| **#21**, **#22** | **one** directional glow or mesh gradient | Text on the mesh; stacked scrims; a gradient behind the `<h1>` |
| **#26**, **#28** | **one** hard offset shadow at rest, no blur | A soft shadow; a second lifted element; a second light source |
| All of the above | — | Every reading surface must be a **solid plate** or a measured scrim. Compute the pane/mesh contrast and **publish the failing pair in §03** with the job it may not do. |

Canonical contracts whose `texture` slot names a gradient or blur (**#7**, **#9**, **#10**, **#15**)
may use exactly that technique in Section 04 demos and non-hero chrome. Inside the hero they use the
solid / tone-step equivalent unless this table grants them a scoped override. This keeps the nine slots
implementable without turning a material texture into a global house-rule waiver.

## 9. Prompt signals → modern contracts

These modern signals are mirrored in the prompt-mapping table in `surfaces.md`; this is the compact
subset behind §19–§28. Do not ask a second question; pick and state which and why in one line.

| Prompt signals | Contract |
|---|---|
| glass tower, refraction, mullion, liquid glass, specular pane | **#19 Liquid glass** |
| AI platform, integration, automation, API, scroll blur, vertical gridlines, live counters | **#21 Scroll-reactive glass** + R3 |
| app gallery, icon wall, design library, screenshot index | **#1** or **#23** + R1 / R2 (composition, not a material) |
| bento, modular cards, feature grid, uneven compartments | **#20 Bento** + R4 |
| blueprint, engineering, survey, technical grid | **#4 Blueprint** |
| aurora, mesh, ambient glow, atmospheric gradient | **#22 Aurora** |
| dark-first, OLED, true black, developer tool at night | **#23 OLED** + B4; Q5 stays explicit and binding |
| one line of type, oversized headline, anti-template, no images | **#24 Exaggerated minimalism** + Hero G |
| meadow, field journal, biophilic, painted ridges, anti-AI, human-made print | **#25 Organic biophilic** |
| layered sheets, stacked plates, tactile depth without blur | **#26 Dimensional layering** |
| 3D, spatial, visionOS, floating object, parallax product | **#27 Spatial** + R6 |
| neo-brutalist, hard offset, thick black borders | **#28** (archival — say so) |
| glass, audio, photography, optics, lens, frosted panel, frosted glass, glassmorphism 2.0 | **#15 Glass & light** |

If two signals collide, the **photographs** win, not the words. A kraft-carton photograph cannot
carry a refracting pane, and a paper-white sky cannot carry an OLED ground.

---

## 10. Why the selector stays at eight

Eight is the ceiling for one selector before it stops being a choice and becomes a list. The seven
named options in Q1 are the ones with the widest distance between them: **Paper & ink** (flat print),
**Cardboard & steel** (kraft industrial), **Liquid glass** (refracting screen), **Frosted glass**
(#15, soft screen), **Boxes of different sizes** (#20, modular layout), **Blueprint grid** (#4,
technical) and **Cockpit panel** (#13, dark dense). **Auto** is the eighth option and the default.

The remaining **21 contracts** are not second-class: they are reached through the prompt map, the
alias table and the freeform `Other` input — which is how most real briefs arrive anyway. A user says
"I'm building an AI integration platform with a dark grid", not "I want #21, please".
