# Shared components

No shadcn component library in use. Only `components/ui/` primitives plus landing-page-local pieces. `cn` is `clsx` + `tailwind-merge`:

`lib/utils.ts`:
```ts
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
```

## Reveal — `features/landing-page/studio/reveal.tsx`
Scroll reveal; the visible state is the default, only below-fold nodes are armed. Full source:
```tsx
'use client'
import type { CSSProperties, ReactNode } from 'react'
import { cn } from '@/lib/utils'
import styles from './studio.module.css'
import { useInView } from './use-in-view'

type Props = { children: ReactNode; className?: string; delay?: number; y?: number; once?: boolean }

export function Reveal({ children, className, delay = 0, y = 26 }: Props) {
  const { ref, armed, inView } = useInView<HTMLDivElement>()
  return (
    <div
      ref={ref}
      className={cn(styles.reveal, className)}
      data-armed={armed}
      data-shown={inView}
      style={{ '--reveal-y': `${y}px`, '--reveal-delay': `${delay}ms` } as CSSProperties}
    >
      {children}
    </div>
  )
}
```

## SectionHead — `features/landing-page/studio/section-head.tsx`
Chapter opener shared by all six sections: mono eyebrow with a numbered circle, marker `ScriptWord`, display title, intro. Props: `number, label, script, title, intro?, onDark?, className?`. Renders `<header data-reveal-group>` with `data-head-number` chip; `onDark` switches text to `var(--paper)`.

## Doodles — `features/landing-page/studio/doodles.tsx`
Hand-drawn SVG marks: `Sun, Sparkle, Heart, Bolt, Daisy, Smiley, Burst, ArrowUpRight, ArrowLeft/Right`. All are inline SVG with `currentColor`, sized via `className`.

## WorkGallery pieces — `features/landing-page/studio/work-gallery/work-gallery.tsx`
`GeneratedCover({ project })` draws a procedurally generated sleeve (grid, ghost code, ring/orbit or cell) for projects with no screenshot. `GalleryCard({ item })` renders a taped paper card: `article.card[data-kind]` → `span.tape` → `Link.cardLink` → `.mediaShell > .media > .mediaInner` (16:10 project / 4:3 system frame, cover `Image fill` or `GeneratedCover`) → `.drawer` (description, tag pills, CTA) → `.foot` (index · category · year row, `h3` title, arrow). Pointer parallax writes `--pan-x/--pan-y` on the media.
