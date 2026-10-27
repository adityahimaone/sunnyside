---
name: generate-project-covers
description: Automatically captures and generates high-DPI 16:10 project thumbnail covers (WebP) for Sunnyside portfolio using Brave Browser CDP.
---

# generate-project-covers

Automates capturing, framing, and generating high-DPI 16:10 project thumbnail covers (`.webp`) for the Sunnyside portfolio projects:
- **Switchyard**: Light Mode, sidebar open, board cleanly started from `Blocked` with `Review` and `Done`, balanced gutters.
- **Habit Tracker**: Native Retina mobile capture in an elevated device mockup canvas with ambient dark emerald wash.
- **Primarindo Asia**: 16:10 desktop hero framing showing navbar, corporate identity, and manufacturing facilities.

## Execution

Run the CLI generator script directly from the repository root:

```bash
# Capture and update all project covers:
pnpm generate-covers

# Capture only a specific project:
pnpm generate-covers switchyard
pnpm generate-covers habit
pnpm generate-covers primarindo
```

## How It Works

1. **Browser Engine**: Launches local Brave Browser in headless mode (`--headless=new`) and connects via Chrome DevTools Protocol (CDP).
2. **Session Decryption**: Extracts authenticated cookies (such as `kanban_session` for Switchyard) from the local Brave profile if present.
3. **Framing & Viewports**:
   - `switchyard`: Sets Light Mode (`localStorage.setItem('kb-theme', 'light')`), keeps sidebar open, positions `Blocked`, `Review`, and `Done` with 20px margins, and applies 0.90 zoom out to prevent edge clipping.
   - `habit-tracker`: Captures at native 412×892 @ 2x scale, then uses Pillow/PIL to composite into a floating rounded device bezel with soft elevation shadow on an emerald glow background.
   - `primarindo-asia`: Renders at 1440×900 with 0.85 scale to fit corporate hero branding and factory imagery.
4. **Optimization**: Encodes directly to WebP (quality 88) at 1440×900 (16:10), saving output to `public/work/<slug>-cover.webp` and updating `public/work/manifest.json`.
