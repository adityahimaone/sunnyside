# sunnyside-review

**Visual Taste, Token Mapping & Anti-Slop Audit Gate**

An automated and manual inspection suite that protects interfaces built from Sunnyside brand systems against token drift, accessibility defects, and AI-slop design defaults.

## Features

- **Purpose-First Token Mapping**: Detects hardcoded hex colors and rogue classes, mapping them to `--<ns>-*` tokens.
- **Anti-Slop Linting (`check-taste.mjs`)**: Flags `transition: all`, layout geometry transitions, eyebrows, monospace misuse, and nested cards.
- **Multi-Viewport Review**: Audits 1440, 1024, 768, and 390px viewports with zero-overflow verification.

## Usage

```bash
# Run static taste & token check
node skills/sunnyside-review/scripts/check-taste.mjs --slug tavola --target features/tavola
```
