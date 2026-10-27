# Image direction

There are two different jobs, and mixing them is how a brand kit turns into an
AI moodboard:

1. **The guideline image** — the board. Render it from HTML/CSS. It needs the
   real type, the real mark and a repeatable layout. Never generate it.
2. **The brand image** — atmosphere, photography, texture, an illustration
   inside the world. This can be generated or shot, as long as it is art-directed
   and has provenance.

## 1. What never gets generated

- the logo, the wordmark, the lockup, the favicon;
- type specimens and the brand guide;
- UI screenshots presented as real product;
- any image whose text or logo must be exact;
- a human face used as a testimonial or a team member.

If the output needs to be redrawn as a clean vector, draw it.

## 2. What may be generated

- a landscape or cityscape for the atmosphere panel;
- paper, ink, halftone, risograph or material studies;
- a still life / product-world image that does not contain the brand's logo;
- abstract light, shadow or texture;
- a photographic crop used behind type.

The generated image should feel like it belongs to the palette, the light and
the material of the brand. It should not introduce a second style.

## 3. Prompt template

```text
[SUBJECT] in [PLACE / CONTEXT].
Light: [direction, quality, time of day].
Material: [paper, ink, metal, glass, fabric].
Palette: [3–4 hexes, in order of area].
Composition: [crop, focal point, negative space for type].
Texture: [grain, halftone, scan, dust, none].
Mood: [three words].
Aspect: [16:10 / 4:5 / 1:1].
Avoid: text, logos, watermarks, stock smiles, extra fingers, gradients,
neon, glossy 3D, lens flare, busy background.
```

The negative list matters more than the adjectives. Models default to glossy,
over-lit, logo-shaped nonsense when given a vague brief.

## 4. Three worked prompts

**Paper atmosphere**

```text
A sheet of warm cream paper on a dark studio table, lit from the left by a low
window, a single cobalt card under the sheet lifting one corner, fine paper
grain, shallow depth of field, quiet and tactile, palette #f3ecdf #191a2e #3d53d6,
16:10, space on the upper left for a headline. Avoid text, logos, glossy 3D,
neon, gradients.
```

**Material macro**

```text
Extreme close-up of printed ink on uncoated paper, a cobalt rectangle
overlapping a butter circle, visible fibre and halftone dots, raking light,
no shadow, palette #f3ecdf #3d53d6 #ffd23f, 4:5. Avoid text, logos, digital
noise, glossy surfaces.
```

**Atmosphere / landscape**

```text
A quiet coastal horizon at first light, pale butter sun behind a low bank of
mist, deep ink-blue water, one cobalt band at the horizon, 35mm grain, muted and
cinematic, palette #f3ecdf #191a2e #3d53d6 #ffd23f, 16:9, lots of sky for type.
Avoid people, boats, logos, text, HDR, oversaturation.
```

## 5. Provenance

Every generated image gets a sibling note:

| Field | Example |
| --- | --- |
| File | `public/work/brand-atmosphere.webp` |
| Prompt | the full prompt, not a summary |
| Model | `[model / version]` |
| Seed | `[seed]` if the tool exposes one |
| Source / tool | `[tool or provider]` |
| License / terms | `[plan / license note]` |
| Crop | `[original ratio → final ratio]` |
| Use | `[page / panel]` |
| Reviewed by | `[name]` |

Store it next to the asset or in a `provenance.md`. A generated image with no
prompt is not reproducible and cannot be audited.

## 6. The pipeline

1. Write the art direction in one paragraph. Pick the light, the material, the
   palette and the crop before opening a generator.
2. Generate 4–8 candidates at the final aspect ratio. Do not generate at a
   different ratio and crop blindly.
3. Pick one. Crop it in the browser or in the image tool; keep the original.
4. Grade it with CSS filters or a controlled adjustment, not a new generation.
   Do not let the grade introduce a colour outside the palette.
5. Composite it into the HTML board or the page. Add the type in HTML, never in
   the image.
6. Save the provenance note. Optimise to WebP/AVIF at the displayed size.
7. QA: no text, no logos, no extra fingers, no frame artefacts, correct palette,
   correct crop, no uncanny faces.

## 7. The Sunnyside case

The Sunnyside atmosphere panel was **not** an AI image. It was a cobalt panel
with a giant SVG glyph, CSS halftone dots, and a paper headline. It was better
than a generated image would have been because:

- the glyph is the brand's own mark;
- the halftone is a system texture, not a one-off;
- the palette is exact;
- the type is real;
- the panel is editable and has no rights question.

The board's "image direction" panel is a demonstration of the direction, not a
claim that every brand needs photography. If the brand needs photography, use
the prompts above and keep the provenance.

## 8. Working with image skills

Image-generation agent skills (e.g. an imagegen skill) are good at divergence and
bad at exactness. Use them to produce candidates for the atmosphere, then:

- pick and crop yourself;
- keep the prompt and model;
- never let the skill place the logo or the type;
- never trust the output's spelling, hands or labels;
- check the palette against the tokens, not against the vibe.

A generated image is evidence of a direction, not the brand itself.
