# Storytelling: the brand kit and the design system as an argument

A kit that only shows assets is a poster. A kit that explains *why* is a
system. Storytelling here is not copywriting polish. It is the reasoning,
ordered so a stranger can follow it, reject it, or extend it.

## 1. The story spine (brand kit)

Write these seven beats in `story.md` (`brand-forge.mjs` scaffolds it). One or
two sentences each. If a beat needs a paragraph, the idea is not reduced yet.

| Beat | Question it answers | Sunnyside example |
| --- | --- | --- |
| **Belief** | What do we hold that others do not? | Work should feel made by a person. |
| **Enemy** | What does that belief push against? | Identity that looks generated and cannot be inspected. |
| **Mark** | What does the symbol argue, without naming the shape? | A day cut from paper and stuck on the page. |
| **Material** | What is everything made of? | Paper, hard ink offset, one cobalt field. |
| **Voice** | How does it sound when it is the one speaking? | Plain, warm, first person, no superlatives. |
| **Proof** | What can be checked? | 14.55:1 ink on paper; a 16px compact mark that reads. |
| **Gap** | What is not done yet? | No visual regression; no motion spec. |

Rules:

- **The enemy is a practice, not a competitor.** "Generic marks" is an enemy.
  "Acme Corp" is not.
- **The mark argues.** "A sun" describes. "The sunny side of a record" argues.
- **Material before mood.** Say what it is made of, not how it should feel.
- **Proof is a number, a path or a screenshot.** Adjectives are not proof.
- **The gap is mandatory.** A story with no gap is marketing.

## 2. The one sentence

Everything is judged against one sentence that can be *rejected*:

> `<Name>` is `<category>` for `<audience>` that `<promise>`, made of `<material>`.

Test: can a reviewer say "no, that is not it" about a specific asset? If every
asset passes trivially, the sentence is too vague.

## 3. Decision cards (design system)

A design system's story is its decisions. Every non-obvious token, component or
rule gets a card. Four lines, always the same shape:

```
Decision    Hard 2.5 offset, never a blur.
Because     The mark is cut paper; a blur changes the material.
Not when    A floating overlay that must read above content (use a solid scrim).
Breaks next Dark mode: the ink offset vanishes; swap it for the core colour.
```

- Write cards for: the material, the focus ring, the field edge, the radius
  scale, the motion rule, the one loud colour.
- No more than ~8 cards. Every extra card dilutes the ones that matter.
- "Breaks next" is the honest part. It becomes the audit backlog.

## 4. The reading order of a specimen

A design-system page should read like an essay with proof, not a catalogue.

| Section | Role in the story | Caption formula |
| --- | --- | --- |
| Hero | The promise + one number | "`<Name>` v`<n>`: `<promise>`. `<stat>`." |
| Foundation | The belief | "Why this exists." |
| Material | The one effect | "What everything is made of, and what it is not." |
| Marks | The argument | "Why this mark, why the other five lost." |
| Colour | Roles, not swatches | "Each colour has one job. Contrast measured." |
| Type | The voice | "Display for names, reading for sentences, mono for facts." |
| Parts | The material applied | "Same edge as the mark." |
| Forms | The proof | "A field is cut from the same sheet as the logo." |
| Motion | The temperament | "One ease, three durations, a finished still." |
| Voice | The words | "Do / don't, with real sentences." |
| Tokens | The contract | "Copy this. Do not hand-edit it." |
| Audit / endcap | The gap | "What is not verified." |

Captions are one sentence, present tense, and state the reason, not the label.
"Hard offset" is a label. "Hard offset, because the mark is cut paper" is a
caption.

## 5. Writing the captions and the hero

- **Hero:** name, one-line promise, three stats (assets, contrast, tokens), one
  sheet. No adjectives that need proof.
- **Captions:** reason first, then the value. Max 20 words.
- **Empty states and errors are story too.** They are where the voice is
  tested. Write them in the brand voice, plainly. Never "Oops!".
- **Use real copy.** Lorem proves nothing about the voice.

## 6. Voice card

```
We are      plain, specific, warm, first person
We are not  hyped, vague, apologetic, jargon-first
Say         "Saved. You can close this tab."
Don't say   "Awesome! Your changes have been successfully saved!"
```

Give the voice three real sentences: a headline, an error, a success. If they
could belong to any product, rewrite them.

## 7. Story audit (run before the board)

- [ ] The one sentence is on the first screen and can be rejected.
- [ ] The mark has an argument, not a description.
- [ ] The rejection note for the other five marks exists.
- [ ] Every non-obvious rule has a decision card with a "breaks next".
- [ ] Captions state reasons. No caption is only a label.
- [ ] Copy is real; the three voice sentences are on the page.
- [ ] Gaps are named, with an owner or a next step.
- [ ] No claim without a number, path or screenshot.
- [ ] A reader who skips the visuals can still follow the argument.

`audit.mjs` can enforce the structure (`story` check: required sections, no
TODO). Whether the argument is good is a human judgement; do not fake it.

## 8. Anti-patterns

- **The mood board narrative:** "warm, human, bold" with no material or number.
- **The origin myth:** a founder story that does not change a single decision.
- **The fortune cookie:** a belief nobody could disagree with.
- **The museum:** every token documented, no card explaining why any exists.
- **The brochure:** no gap section.
