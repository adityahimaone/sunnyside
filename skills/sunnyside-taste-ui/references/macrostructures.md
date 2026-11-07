# Macrostructures & Layout Blueprints by Business Kind

A great interface is defined by its narrative macrostructure, not by swapping accent colors on the same generic hero-and-three-cards template. Below are 12 non-template section sequences tailored to specific business kinds.

---

## 1. Software & AI Product Blueprints

### Blueprint S1 · The Living Product Stage
- **Section 1 · Hero Stage**: Headline (max 18ch) + 1-sentence lede + Primary action button + Cropped `Window` stage bleeding off right edge with live interactive state toggle.
- **Section 2 · Telemetry & Ledger**: 4-column metric ledger (`tabular-nums`) showing real operational units (latency, throughput, active nodes) + 1px hairline rules.
- **Section 3 · Bento Capability Wall**: 5 asymmetric bento compartments on a 12-column grid. Each cell contains one real capability with a miniature live faux-UI stage.
- **Section 4 · Live Interactive Workbench**: Real interactive sandbox allowing the user to tweak inputs and see real-time calculated outputs.
- **Section 5 · Enterprise Proof Ledger**: Tabular comparison matrix of specifications, security certs, and deployment options.
- **Section 6 · F5 Plate & Receipt Footer**: Sign-off statement + ruled receipt form with provenance and mark.

### Blueprint S2 · The Terminal / Developer Instrument
- **Section 1 · CLI Hero**: Full-width monospace command input + interactive copy block + immediate terminal response playback.
- **Section 2 · Architecture Flow**: Exploded system topology diagram with active packet pulse.
- **Section 3 · API Contract Accordion**: Side-by-side code pane and typed response inspector.
- **Section 4 · F1 Bench Echo Footer**: 5-cell benchmark summary and GitHub/npm links.

---

## 2. Hardware & Physical Product Blueprints

### Blueprint H1 · The Dimensional Spec Sheet
- **Section 1 · Hero with Isolated Object (Relation `around`)**: High-resolution studio photograph of the hardware on clean ground, with technical callout lines indicating dimensions.
- **Section 2 · Exploded Axonometric Layer Stack**: Isometric layer diagram showing chassis, heat sink, PCB, optical array, and housing.
- **Section 3 · Materials & Finishes Matrix**: Tactile close-up swatches (anodized aluminum, woven aramid, borosilicate glass) with micro-hardness and weight specs.
- **Section 4 · Closed-Form Dimension Table**: S#/H#/R# mechanical drawing table with tolerances.
- **Section 5 · F3 Frozen Specimen Footer**: Final blueprint silhouette.

### Blueprint H2 · In-The-Field Environmental Proof
- **Section 1 · Full-Bleed Atmospheric Hero (Relation `on`)**: Environmental photo in harsh elements + directional scrim + headline.
- **Section 2 · Stress Test Ledger**: Real laboratory test logs (IP68 submersion, drop test, thermal cycles).
- **Section 3 · 2-Column Split Details**: Detailed engineering captures and mechanical breakdowns.
- **Section 4 · F2 Reversed Split Footer**.

---

## 3. Creative Studio & Agency Blueprints

### Blueprint C1 · The Archive Wall
- **Section 1 · Typographic Cover (Relation `none`)**: Oversized display headline filling the screen (`clamp(64px, 11vw, 160px)`) + case index count.
- **Section 2 · 12-Column Case Gallery**: Alternating 7-column and 5-column project frames with video loops, title, discipline tags, and year.
- **Section 3 · Design Philosophy & Manifesto**: Large editorial type (32px) on generous measure with highlighted principles.
- **Section 4 · Studio Cast & Credits**: 6-noun capability ledger and leadership notes.
- **Section 5 · F4 Torn Receipt Footer**: Paper strip sign-off.

---

## 4. Local Place & Hospitality Blueprints

### Blueprint P1 · The Mediterranean Table (Tavola Spec)
- **Section 1 · Split Editorial + Terrace Media (Relation `beside`)**: Words on left, full-bleed sunlit dining room photo on right.
- **Section 2 · The Philosophy & Season**: Sun-baked terrace plate + seasonal harvest philosophy.
- **Section 3 · The Seasonal Carte / Menu**: Ruled dinner menu with dish names, provenance, and prices in tabular figures.
- **Section 4 · Cellar & Producers**: Soil, grape, and maritime climate notes.
- **Section 5 · F5 Plate & Receipt Footer**: Hand-signed reservation receipt with table booking action.

---

## 5. Editorial & Publication Blueprints

### Blueprint E1 · The Dispatch Cover
- **Section 1 · Masthead & Lead Story**: High-contrast serif headline + dateline + two-column lead story.
- **Section 2 · Full-Bleed Photo Essay**: Deep visual reportage with margin captions.
- **Section 3 · Multi-Author Debate**: Side-by-side contrasting opinion columns with pull quotes.
- **Section 4 · Archive Index & Colophon**.

---

## 6. The Floor: Non-Negotiable Layout Discipline

1. **One Section Per Screen**: Every major section should hold focus for a standard `1440×900` laptop viewport.
2. **Equal Edge Margins**: Container left and right margins must be mathematically identical.
3. **No Nested Cards**: Do not nest a card inside a card. Use whitespace or a 1-step tone shift.
4. **No Gratuitous Animation**: All scroll-triggered reveals must complete within 280ms; under `prefers-reduced-motion`, all elements render immediately in their final state.
