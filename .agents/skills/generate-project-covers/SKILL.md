---
name: generate-project-covers
description: Automatically captures and generates high-DPI 16:10 project thumbnail covers (WebP) for Sunnyside portfolio using Brave Browser CDP.
---

# generate-project-covers

Universal thumbnail generator that captures live screenshots for **ANY URL, web app, or link**, as well as the predefined Sunnyside portfolio projects. Outputs high-DPI 16:10 `.webp` cards optimized for the Sunnyside design system.

## Usage

### 1. Capture ANY Arbitrary URL / Link / App

You can pass any URL directly:

```bash
# Capture any URL in 16:10 desktop mode:
pnpm generate-covers https://stripe.com --out public/work/stripe-cover.webp

# Capture any mobile app in floating device mockup mode:
pnpm generate-covers https://my-mobile-app.com --out public/work/app-cover.webp --mode mobile-mockup

# Capture with custom dimensions, scale, or theme:
pnpm generate-covers https://github.com --width 1440 --height 900 --theme light
```

**Options:**
- `--url <url>`: Target URL to screenshot (also accepts raw URL as first argument).
- `--out <path>`: Output `.webp` destination path.
- `--mode <desktop|mobile|mobile-mockup>`:
  - `desktop` *(default)*: Crisp 16:10 desktop viewport (`1440×900` @ 2x).
  - `mobile`: Native phone viewport (`412×892` @ 2x).
  - `mobile-mockup`: Native mobile screen floating inside a refined device bezel on an ambient dark glow background.
- `--theme <light|dark>`: Injects theme preferences (`localStorage` and class updates).
- `--zoom <number>`: Applies CSS zoom level if needed.
- `--wait <ms>`: Delay in milliseconds for client apps (default `4000ms`).
- `--cookie <name=val>`: Injects session cookies for authenticated apps.

---

### 2. Portfolio Project Presets

Run preset shortcuts for existing portfolio items:

```bash
# Capture all portfolio projects:
pnpm generate-covers

# Capture only a specific project preset:
pnpm generate-covers switchyard
pnpm generate-covers habit
pnpm generate-covers primarindo
```

**Preset Configurations:**
- **Switchyard**: Light Mode, sidebar open, starting cleanly at `Blocked` with `Review`, `Done`, and `Archived`, natural framing without clipping.
- **Habit Tracker**: Native Retina iPhone capture inside an elevated mobile device mockup canvas with ambient dark emerald wash.
- **Primarindo Asia**: 16:10 desktop hero framing showing corporate navbar, logo, headline, and manufacturing facility.
