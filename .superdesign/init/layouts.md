# Layout components

Every layout piece lives in `features/landing-page/studio/` and is composed by `studio.tsx`.

## Studio shell — `features/landing-page/studio/studio.tsx` (default export `Studio`)
```tsx
'use client'
export default function Studio() {
  const { active, scrolled, footerVisible } = usePagePosition()
  const rootRef = useRef<HTMLDivElement>(null)
  useLandingMotion(rootRef)
  return (
    <div ref={rootRef} className={styles.root}>
      <SiteHeader active={active} scrolled={scrolled} />
      <main>
        <Hero /><About /><Projects /><Showcase /><Skills />
        <StickerJourney /><Contact />
      </main>
      <SiteFooter visible={footerVisible} />
    </div>
  )
}
```
`SectionHead` numbers the chapters 01–06; `ChapterRail` renders the fixed playhead rail; `usePagePosition` drives both.

## SiteHeader — `features/landing-page/studio/site-header.tsx`
Paper bar with the die-cut sun mark + marker wordmark and section anchors. `data-scrolled` tightens it.

## SiteFooter — `features/landing-page/studio/site-footer.tsx`
Writes its own name; reveals when `visible`.

## Work chapter — `features/landing-page/studio/projects.tsx`
```tsx
<section id="work" className={`${styles.work} scroll-mt-24`} aria-labelledby="work-title">
  <span className={styles.workSun} aria-hidden data-work-sun><Sun className="w-full" /></span>
  <div className={styles.shell}>
    <SectionHead onDark number="03" label="Selected work" script="the good stuff"
      title={<span id="work-title">Work that<br />shipped.</span>}
      intro={`Six releases from the catalogue and the ${systems} documented systems behind them. Filter the wall, then open a card for the notes.`} />
    <WorkGallery />
    <Reveal delay={0.1}>
      <div className={styles.archiveBand}>
        <p>Six releases · {systems} systems · 2022–26</p>
        <Link className={styles.archiveLink} href="/projects">The full discography<ArrowUpRight className="size-5" /></Link>
      </div>
    </Reveal>
    <SectionNext onDark href="skills" label="Skills" note="the toolbox" />
  </div>
</section>
```
`.work` is the cobalt room (`background: var(--cobalt)`), `.shell` the centred column; `.workSun` is the oversized sun glyph bleeding off the right edge.
