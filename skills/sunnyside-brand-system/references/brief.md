# The brief

Write this before the first canvas. If the user cannot answer a question, make a
stated assumption and mark it `ASSUMPTION` so it can be rejected later.

## The one-page brief

```md
# [Brand] — brand brief

## Job
[One sentence, in the audience's words.]

## Audience
[Who they are, what they already know, where they meet the brand.]

## Promise
[What the brand makes possible. Not an adjective.]

## Positioning
[What it is not. The nearest thing it must not look like.]

## Track
- [ ] Constructed (v2.3 gate): corporate, technical, architectural.
- [ ] Drawn (v2.4 gate): editorial, warm, human, object-led.
Why: [one sentence. Do not mix the tracks.]

## Constraints
- Stack / media:
- Sizes that must work: 16px, 32px, navbar, social, print?
- Accessibility:
- Time / budget:
- Must-not-change:

## References
1. [link] — take: [one specific thing]
2. [link] — take: [one specific thing]
3. [link] — take: [one specific thing]

## Deliverables
- [ ] mark
- [ ] wordmark (drawn or outlined)
- [ ] lockups
- [ ] compact/favicon
- [ ] cast of 4–6 (drawn track; optional constructed)
- [ ] marks composition (logo card, wordmark scale, cast drawer, rule)
- [ ] board
- [ ] tokens
- [ ] story + decision cards
- [ ] guide
- [ ] audit + QA report

## Non-goals
- [What this version will not do.]

## Success
[What a reviewer should be able to say after 30 seconds.]

## Voice
[Three words, plus one sentence that sounds like the brand.]
```

## Questions worth asking

1. **What is the one thing a stranger should remember?** If the answer is a
   colour, the brand is not finished.
2. **Where will this be seen first?** A tab, a pitch deck and a shopfront demand
   different tests.
3. **What must never appear?** Stock smiles, gradients, a mascot, a crest — the
   refusals are as useful as the references.
4. **What already exists?** A typeface, a marker, a photograph, a name. Build on
   what the client already owns before inventing a new language.
5. **Who has to maintain it?** If the answer is "a designer with the source
   file", the docs and tokens are part of the brief.
6. **What does success look like at 16px?** If nobody can answer, the favicon
   will be an afterthought.
7. **Does the brand have a character or a hand?** If yes, name the drawn track
   and the cast. If no, say why the constructed track is right.
8. **What are the 4–6 small marks for?** If nobody can name a job for each, the
   cast is decoration; skip it.

## Review gates

A brief is ready when:

- the job fits in one sentence;
- the audience and the context are named;
- the track is named and the gate matches it;
- the constraints include the smallest and largest output;
- the non-goals are explicit;
- the references name what to take, not just a mood;
- the deliverables and the acceptance tests are listed;
- the person who will maintain it is named.

## The Sunnyside brief, in short

> Make a portfolio that feels made by a person, and make the system behind it
> inspectable. It has to carry a studio landing, the archive rooms, a design
> system specimen, a brand kit and a 16px favicon without becoming five
> different brands.

Constraints: Next.js on Cloudflare; warm paper, one cobalt field; no stock marks
or generated identity; real content and focus states; documented as a page, not
a PDF. The one-sentence direction: **a studio wall, not a template.**
