# sunnyside-taste-ui

**Post-Brand Landing Pages, Web Apps & Living Faux-UI Stages**

`sunnyside-taste-ui` is the downstream skill invoked after `sunnyside-brand-system`. It ingests an approved brand kit (`tokens.json`, `<slug>-tokens.css`, `DESIGN.md`, `public/brand/<slug>/`) and builds production landing pages, web applications, marketing showcases, and interactive product stages.

## What it does

1. **Zero-Drift Brand Ingestion**: Strictly binds to the approved OKLCH tokens and chosen surface contract (#1–#28).
2. **Business-Kind Routing**: Chooses the appropriate visual idioms, macrostructures, and interaction physics for software/AI, hardware, creative studios, places/hospitality, and editorial projects.
3. **Living Product Stages (`stageshow`)**: Embeds real interactive faux-UI stages (`Window`, `Phone`, `Terminal`, `Receipt`) with real domain data and cursor choreography instead of generic screenshots.
4. **Anti-Slop Floor Enforcement**: Rejects cliché SaaS eyebrows, unmeasured scrims, nested cards, and unconstrained headlines.
5. **Deterministic Scaffolder (`scripts/scaffold-ui.mjs`)**: Scaffolds a complete token-wired React/CSS Modules or standalone HTML skeleton in seconds.

## Usage

```bash
# Scaffold a landing page skeleton for a brand
node skills/sunnyside-taste-ui/scripts/scaffold-ui.mjs --slug tavola --kind hospitality --out features/tavola/landing
```
