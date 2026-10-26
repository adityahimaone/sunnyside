<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## Project direction

- The current landing page is **Sunnyside / Side A**: warm paper, dark ink, restrained cobalt, bright accent marks, tactile paper edges, and purposeful sticker-like artwork. Use `/sunnyside`, `features/design-system/sunnyside-data.ts`, and [`design.md`](./design.md) as the design reference; confirm details against the owning feature’s live styles.
- Do not describe or reintroduce the removed rack/DAW/device-wall direction as the current landing-page design. Old proposals and audit files under `docs/` are historical unless explicitly linked from current code or this guidance.
- Keep UI and CSS with the feature that owns them. Put only genuinely cross-feature primitives in `components/ui/`; keep shared logic in `hooks/` or `lib/`. Routes should compose feature views, and feature entry points should expose explicit named exports.
- The `/sunnyside` route is a documented, interactive specimen with token exports—not a published component library. Archive styles use namespaced `--ss-*` tokens; preserve feature-scoped layouts rather than assuming every route consumes one global system.
- Keep controls semantic and keyboard-accessible, retain visible focus, verify text contrast, and respect reduced-motion preferences. Decorative marks and colour must not be the only way content communicates meaning.
