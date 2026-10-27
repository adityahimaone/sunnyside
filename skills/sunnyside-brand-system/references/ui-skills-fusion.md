# UI Skills audit and fusion

Source: [ui-skills.com](https://www.ui-skills.com/) and the `ui-skills` registry
(`npx ui-skills list`). The registry currently lists **439 skills across 27
categories**. This is a triage and fusion, not a copy.

## Scope

I inspected the **22 skills that govern brand kits, design systems, component
implementation and QA**. I excluded stack-specific and media-specific skills
(Vue, Nuxt, SwiftUI, React Native, Three.js, Remotion, video, slides, 3D,
charts-only, writing-only, Figma-only tool loops). Those are valid skills; they
do not change this method. I read the two design-system apply/audit skills only
for their section strategy and evidence rules.

Inspected: `ui-skills-root`, `baseline-ui`, `improve-ui`, `create-design-md`,
`component-canvas`, `create-canvas`, `fixing-accessibility`,
`fixing-metadata`, `fixing-motion-performance`, `frontend-design`,
`better-typography`, `better-colors`, `better-ui`,
`make-interfaces-feel-better`, `emil-design-eng`, `apple-design`, `shadcn`,
`react-best-practices`, `web-design-guidelines`, `better-interface`,
`interface-design`, `better-layout`. I also read
`apply-design-system` and `audit-design-system` for the section-level
implementation and evidence rules.

## What I took

| Skill | Useful rule | Where it lives now |
| --- | --- | --- |
| **ui-skills-root** | Route to the smallest context: prefer 1 skill, never more than 3. | `SKILL.md` modes; implementation skill handoff |
| **baseline-ui** | Accessible primitives; no hand-built keyboard; `text-balance`/`text-pretty`; tabular numbers; no layout animation; no `transition: all`; one accent; empty state has an action. | Implementation rules |
| **improve-ui** | Audit only the traced surface; require contract + runtime + correction; no unsupported findings; plans are self-contained. | `references/verification.md`, lessons |
| **better-interface** | Review order a11y → layout → writing → type → colour → polish; escalation triggers are HIGH on sight; cheaper fix order delete → platform → reuse → correct → add; one root cause per row. | `references/verification.md` |
| **interface-design** | Domain exploration before defaults (5 concepts, 5 colours, one signature, 3 obvious defaults); one focal point; ratio type scale; density; one depth strategy; component checkpoint. | Brand direction + implementation composition |
| **better-layout** | Group with space (2× gap between groups); shared edges; DOM order; logical properties; one primary action; hidden-content cue; `minmax(0,1fr)` / `min-width:0`; `100dvh`; 320px/200% and RTL checks. | `references/verification.md`; implementation layout |
| **create-design-md** | Evidence pipeline: role → value → source → scope → recurrence → confidence; omit uncertain/local values; `DESIGN.md` is a contract. | Brand handoff + `DESIGN.md` |
| **frontend-design** | Ground the direction in the subject; type carries personality; structure must mean something; avoid generic accent-word/all-caps/numbered/fade-in tells unless structural. | Brand direction and critique |
| **better-typography** | Exact type gate: 2–3 families, unitless leading, 60–75ch, `em` tracking, 16px mobile inputs, tabular numbers. | `references/typography.md` |
| **better-colors** | One neutral + one accent + only used status ramps; primitives vs semantic roles; one filled action; measure rendered pairs; no token borrowing. | `references/design-systems.md`; color gate |
| **better-ui** | Concentric radii; optical alignment; shadows for elevation, borders for structure; image outlines; 0.96 press/150ms; transitions not keyframes; hover only on hover-capable pointers. | Implementation craft pass |
| **make-interfaces-feel-better** | Unseen details compound; review at 10% speed; icon states via `currentColor`; exits shorter than enters; 44px hit areas. | Implementation craft pass |
| **emil-design-eng** | Animation decision order: should it animate, purpose, easing, duration; frequency decides; `ease-out`; no `transition: all`. | Motion gate |
| **apple-design** | Translucency and depth convey hierarchy; critically damped springs by default, bounce only after momentum; reduced motion. | Glass/material guidance |
| **shadcn** | Use existing components; semantic colors; `cn`; no manual z-index; fields use invalid/disabled state; use installed version, don't assume new APIs. | Implementation stack |
| **react-best-practices** | Server first; small client islands; no waterfalls; bundle discipline; avoid unnecessary re-renders. | Implementation architecture |
| **web-design-guidelines** | Fetch the latest guideline source and run a release review. | Implementation QA pass |
| **fixing-accessibility** | Names, keyboard, focus/dialogs, semantics, forms/errors, announcements, contrast. | A11y gate |
| **fixing-metadata** | Title/description/canonical/OG/JSON-LD/icons agree and are absolute; no duplicates; noindex only when intended. | Metadata gate |
| **fixing-motion-performance** | Compositor properties; no scroll polling; no continuous blur; no layout animation; pause off-screen. | Motion gate |
| **apply-design-system** | Classify each section: already-connected, exact-swap, compose-from-primitives, blocked; one section at a time; validate after. | Implementation workflow |
| **audit-design-system** | Evidence standard; what to flag/not; attach a replacement only when structurally credible; confidence. | Audit format |
| **component-canvas / create-canvas** | Reviewed; useful for variant exploration, not part of the shipping path. | Optional exploration only |

## What I deliberately did not take

- **"Never animate"** and **"never gradient"** from baseline-ui are good defaults,
  not laws. A brief that asks for glass, dither or a meaningful motion gets that
  effect. The rule is: one deliberate effect, no decorative extras.
- **"Never use an accent word / all-caps / numbers / fade-ins"** from
  frontend-design are diagnostics. They are tells when decorative. Keep them
  when they encode structure: one accent word that names the material, a numbered
  sequence that is actually a sequence, a label that is actually a label.
- **Stack mandates** (Tailwind only, motion/react only, Base UI only) are
  conditional. Use the host project's stack; do not add a second system.
- **Figma- and pen-specific tool loops** belong to their skills, not this one.
- **Component counts** are not a quality metric. Three strong primitives plus a
  real form beat twenty variants.

## The fused operating rules

1. **Route before reading.** Pick 1 skill, 2 at most, 3 for a broad review.
2. **Defaults, then the brief.** A deliberate brand decision may override a
   baseline rule; document the reason.
3. **Evidence over taste.** Every audit finding needs a contract, a rendered/runtime
   fact, and a correction. No unsupported findings.
4. **Tokens before components.** One source, three layers; no raw hex in
   components, no borrowed token.
5. **Type and colour are measured.** Contrast, measure, weights, sizes, line
   heights, tabular numbers.
6. **Components: existing first.** shadcn/Radix/native; no custom keyboard/focus;
   one section at a time; validate after.
7. **One effect, one action.** One signature material and one filled primary
   action per view.
8. **Motion has a job.** Frequency decides; compositor properties; reduced motion;
   no `transition: all`; no layout animation.
9. **Ship the gates.** A11y, metadata, responsive 390, reduced motion, contrast,
   console.
10. **Stop with a report.** Pass/gap table, evidence paths, no “looks good”.

## Where the fusion lands

- **`sunnyside-brand-system`** — direction, identity, tokens, board, docs, handoff,
  and the rule that it stops before implementation.
- **`implement-brand-system`** — the execution skill: tokens → shell → sections →
  components/forms → responsive/dark/metadata → QA, using the fused rules above.
- **One optional reviewer** — `better-typography`, `better-colors`,
  `fixing-accessibility`, etc. Load only the one the failure needs.

The registry is the menu; this method is the order.
