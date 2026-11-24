'use client'

import { useEffect, useState } from 'react'

import { CHAPTERS, type ChapterId } from './studio-data'

type PagePosition = {
  active: ChapterId
  scrolled: boolean
  footerVisible: boolean
}

/**
 * One scroll read for the header and the chapter rail.
 *
 * Chapter and footer document-space Y offsets are cached on layout/resize so
 * scroll frames only read `window.scrollY` and `window.innerHeight` — zero
 * forced `getBoundingClientRect()` layout reads during scroll.
 */
export function usePagePosition(): PagePosition {
  const [state, setState] = useState<PagePosition>({
    active: 'home',
    scrolled: false,
    footerVisible: false,
  })

  useEffect(() => {
    let frame = 0
    let measureTimer = 0
    let chapterTops: Array<{ id: ChapterId; top: number }> = []
    let footerTop: number | null = null
    let vh = window.innerHeight

    const measureOffsets = () => {
      vh = window.innerHeight
      const sy = window.scrollY
      chapterTops = []
      for (const chapter of CHAPTERS) {
        const el = document.getElementById(chapter.id)
        if (!el) continue
        chapterTops.push({
          id: chapter.id,
          top: el.getBoundingClientRect().top + sy,
        })
      }
      const footer = document.getElementById('outro')
      footerTop = footer ? footer.getBoundingClientRect().top + sy : null
    }

    const evaluate = () => {
      frame = 0
      // Re-measure lazily if dynamic sections mounted after the initial pass.
      if (chapterTops.length < CHAPTERS.length || footerTop === null) {
        measureOffsets()
      }

      const sy = window.scrollY
      const line = sy + vh * 0.38
      let current: ChapterId = 'home'
      for (const chapter of chapterTops) {
        if (chapter.top <= line) current = chapter.id
      }

      const footerVisible =
        footerTop !== null ? footerTop - sy < vh - 96 : false

      const next = {
        active: current,
        scrolled: sy > 24,
        footerVisible,
      }

      setState((previous) =>
        previous.active === next.active &&
        previous.scrolled === next.scrolled &&
        previous.footerVisible === next.footerVisible
          ? previous
          : next,
      )
    }

    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(evaluate)
    }

    const onLayoutChange = () => {
      window.clearTimeout(measureTimer)
      measureTimer = window.setTimeout(() => {
        measureOffsets()
        schedule()
      }, 120)
    }

    measureOffsets()
    evaluate()

    const ro =
      typeof ResizeObserver === 'undefined'
        ? null
        : new ResizeObserver(onLayoutChange)
    ro?.observe(document.body)

    window.addEventListener('scroll', schedule, { passive: true })
    window.addEventListener('resize', onLayoutChange)
    return () => {
      window.clearTimeout(measureTimer)
      if (frame) cancelAnimationFrame(frame)
      ro?.disconnect()
      window.removeEventListener('scroll', schedule)
      window.removeEventListener('resize', onLayoutChange)
    }
  }, [])

  return state
}
