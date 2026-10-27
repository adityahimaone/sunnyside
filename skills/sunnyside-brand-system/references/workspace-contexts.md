# Workspace contexts

Do not assume a portfolio. Do not invent routes. A brand kit is useful in a
product app, a marketing site, a docs site, a Storybook, a standalone HTML file,
a Figma/pen workspace, and a print deck. The surface follows the workspace.

## Context matrix

| Context | Surface | Deliverable | Route assumptions | Verify |
| --- | --- | --- | --- | --- |
| **Standalone** | One local HTML file | `design-system.html` + tokens + assets | None | Browser at 1440/390; no build |
| **Product app** | In-app styleguide / settings page | Route or modal/page + components | Use the app's existing router; never invent `/design-system` | Route, keyboard, dark, 390 |
| **Marketing site** | Brand landing + system page | One page or one route | Existing site routes only | SEO, OG, 390, contrast |
| **Docs site** | Docs page + live specimens | MDX/route + examples | Existing docs pattern | Search, anchors, 390 |
| **Portfolio / archive** | Case index + case page + manual | Case library *if the brief asks* | Optional; current Sunnyside pattern | Case links, canonical, llms |
| **Component library** | Storybook / Ladle / Histoire | Stories + MDX/docs | No page route required | Story states, a11y, controls |
| **Design workspace** | Figma / pen / Notion | `.pen`/Figma + board/exports + `DESIGN.md` | None | Export at 2×, 16px icons, token match |
| **Print / social** | Artboards / exports | PNG/SVG/PDF + rules | None | Crop, bleed, 16px, contrast |

## Decide the surface first

Ask, in order:

1. **Does the workspace already have a UI?** If yes, use its shell, routes, tokens
   and conventions. Do not create a parallel site.
2. **Does it have routes?** If no, a single HTML file or a Storybook story is the
   surface. Do not add a router for a proof page.
3. **Is there a design-system surface?** Use an existing `/styleguide`,
   `/design-system`, `/brand`, Storybook, or docs page. If none, ask before adding
   a public route.
4. **Is this a case study or a system reference?** A case has a narrative; a
   system reference is a specimen. They are different pages. Do not force a case
   page into a product app.
5. **Is the deliverable code, a canvas, or a deck?** Code → HTML/TSX; canvas →
   pen/Figma; deck → slides/PDF. Do not pretend a PNG is a component library.

## Route-based workspaces

Use the host's route convention. The following are **examples, not defaults**:

- a product styleguide route;
- a marketing `/brand` or `/design-system` page;
- a docs route;
- a portfolio case library.

If the host has none and a route is requested, choose one route and state it. Do
not add a library, a manual page and a Markdown twin unless the brief asks.

When a route changes, update only what exists:

- canonical/OG/icons if the host has metadata;
- sitemap if the host has one;
- nav/footer and internal links;
- Markdown twin (`llms.txt`) only if the host publishes one;
- tests and generated route types;
- board URLs and audit evidence.

If a route does not exist, skip the metadata/route checklist. Do not create empty
`llms.txt`, sitemap entries or case cards to satisfy a template.

## No-route workspaces

- **Standalone HTML:** one file, local tokens, no metadata, no sitemap. Use anchor
  navigation and a print stylesheet if useful.
- **Storybook/Ladle:** one story per component; a docs page for the system; no
  page route. The story is the proof.
- **Product modal/page:** use the app shell; a styleguide can be a settings page
  or an internal route.
- **Pen/Figma/Notion:** the canvas and exports are the deliverable; `DESIGN.md`
  is the handoff. The code implementation is a separate step.
- **Print/social:** no runtime; verify crops, bleed, contrast and 16px icons.

## Case pages are optional

A case page is justified when:

- the work has a decision, a constraint, a result and evidence;
- the host already has a case/archive surface, or the brief asks for one;
- someone will read it as a story, not as a component reference.

If not, a **system specimen** (foundations → components → tokens) is enough. Do
not build a case library for one system. Do not build a manual page for one page.

## The universal output contract

Every context has the same core:

```
brief / DESIGN.md
tokens.css + tokens.json
assets (mark, wordmark, lockups, favicon/icons)
one proof surface
one audit with gaps
```

Only the **surface** changes:

```
standalone      design-system.html
app route       app/<host-route>/page.tsx
storybook       <Component>.stories.tsx + docs
pen             <slug>.pen + exports
print           <slug>.pdf/png + rules
```

Adapt paths to the host. The contract is what ships, not the folder names.

## Verification by context

- **Standalone/HTML:** 1440/390, console, overflow, keyboard, contrast.
- **App route:** the above + route metadata, loading/empty/error, auth boundaries.
- **Docs:** anchors, search, code samples, 390, print.
- **Storybook:** every story state, controls, a11y addon, keyboard.
- **Pen/Figma:** 2× export, real vectors, token match, 16px icons.
- **Print:** bleed, crop, ink coverage, contrast, embedded fonts.

If a check does not apply, say **Not applicable**; do not fake a pass.
