import {
  BOOK_STAGES,
  POP_IDS,
  bookState,
  easeInOutCubic,
  easeOutBack,
  progressWithin,
} from '@/features/landing-page/studio/diorama/book-scroll'

/**
 * The pop-up book is a pure function of scroll progress. These pin down the
 * promises the animation makes: it starts shut and ends open, it only ever
 * moves forward as you scroll forward, the panels stand up in order, and a
 * little overshoot never leaves them off the page.
 */
describe('book scroll', () => {
  const sweep = Array.from({ length: 1001 }, (_, i) => i / 1000)

  describe('easing', () => {
    it('starts at 0 and ends at 1', () => {
      for (const ease of [easeInOutCubic, easeOutBack]) {
        expect(ease(0)).toBeCloseTo(0, 10)
        expect(ease(1)).toBeCloseTo(1, 10)
      }
    })

    it('eases in and out of the cover turn without ever leaving [0, 1]', () => {
      for (const t of sweep) {
        const v = easeInOutCubic(t)
        expect(v).toBeGreaterThanOrEqual(0)
        expect(v).toBeLessThanOrEqual(1)
      }
      expect(easeInOutCubic(0.5)).toBeCloseTo(0.5, 10)
    })

    it('overshoots on the way up and settles on 1', () => {
      const peak = Math.max(...sweep.map((t) => easeOutBack(t)))
      expect(peak).toBeGreaterThan(1)
      expect(peak).toBeLessThan(1.2)
    })
  })

  describe('progressWithin', () => {
    it('holds at 0 before the stage and at 1 after it', () => {
      expect(progressWithin(0, [0.2, 0.6])).toBe(0)
      expect(progressWithin(0.2, [0.2, 0.6])).toBe(0)
      expect(progressWithin(0.4, [0.2, 0.6])).toBeCloseTo(0.5, 10)
      expect(progressWithin(0.6, [0.2, 0.6])).toBe(1)
      expect(progressWithin(1, [0.2, 0.6])).toBe(1)
    })
  })

  describe('bookState', () => {
    it('is a shut book with nothing standing at the top of the rail', () => {
      const s = bookState(0)
      expect(s.open).toBe(0)
      expect(s.hump).toBeCloseTo(0, 10)
      expect(POP_IDS.every((id) => s.pops[id] === 0)).toBe(true)
      expect(POP_IDS.some((id) => s.ready[id])).toBe(false)
    })

    it('is fully open, every panel standing and usable, at the bottom', () => {
      const s = bookState(1)
      expect(s.open).toBe(1)
      expect(s.hump).toBeCloseTo(0, 10)
      for (const id of POP_IDS) expect(s.pops[id]).toBeCloseTo(1, 10)
      expect(POP_IDS.every((id) => s.ready[id])).toBe(true)
    })

    it('never opens backwards as you scroll forwards', () => {
      let previous = -1
      for (const p of sweep) {
        const { open } = bookState(p)
        expect(open).toBeGreaterThanOrEqual(previous)
        previous = open
      }
    })

    it('holds the book shut for a beat before the cover moves', () => {
      expect(bookState(BOOK_STAGES.open[0]).open).toBe(0)
      expect(bookState(BOOK_STAGES.open[0] + 0.05).open).toBeGreaterThan(0)
    })

    it('has the cover fully open before the first panel starts to rise', () => {
      expect(BOOK_STAGES.open[1]).toBeLessThanOrEqual(BOOK_STAGES.build[0])
      const justBefore = bookState(BOOK_STAGES.build[0])
      expect(justBefore.open).toBe(1)
      expect(justBefore.pops.build).toBe(0)
    })

    it('stands the panels up in order: build, motion, rest, systems', () => {
      const starts = POP_IDS.map((id) => BOOK_STAGES[id][0])
      expect([...starts].sort((a, b) => a - b)).toEqual(starts)
      const ends = POP_IDS.map((id) => BOOK_STAGES[id][1])
      expect([...ends].sort((a, b) => a - b)).toEqual(ends)
      // while the first is half up, the last has not begun
      const mid = bookState((BOOK_STAGES.build[0] + BOOK_STAGES.build[1]) / 2)
      expect(mid.pops.build).toBeGreaterThan(0.5)
      expect(mid.pops.systems).toBe(0)
    })

    it('finishes before the end of the rail, so there is a moment of rest', () => {
      expect(BOOK_STAGES.systems[1]).toBeLessThan(1)
      expect(
        POP_IDS.every((id) => bookState(BOOK_STAGES.systems[1]).ready[id]),
      ).toBe(true)
    })

    it('peaks the turning shadow mid-turn and never goes negative', () => {
      const humps = sweep.map((p) => bookState(p).hump)
      expect(Math.min(...humps)).toBeGreaterThanOrEqual(0)
      const peak = Math.max(...humps)
      expect(peak).toBeCloseTo(1, 2)
      const at = sweep[humps.indexOf(peak)]
      const [start, end] = BOOK_STAGES.open
      expect(at).toBeGreaterThan(start)
      expect(at).toBeLessThan(end)
    })

    it('keeps every panel within a small overshoot of upright', () => {
      for (const p of sweep) {
        for (const id of POP_IDS) {
          const v = bookState(p).pops[id]
          expect(v).toBeGreaterThanOrEqual(0)
          expect(v).toBeLessThan(1.2)
        }
      }
    })

    it('marks a panel usable only once it has stood up', () => {
      expect(bookState(BOOK_STAGES.systems[0] + 0.01).ready.systems).toBe(false)
      // One panel standing is enough for that panel, even while a later one
      // is still folded down.
      const mid = bookState(BOOK_STAGES.build[1])
      expect(mid.ready.build).toBe(true)
      expect(mid.ready.systems).toBe(false)
    })

    it('never takes a panel back out of reach once it is standing', () => {
      const flags = sweep.map((p) => bookState(p).ready)
      for (const id of POP_IDS) {
        let seen = false
        for (const ready of flags) {
          if (seen) expect(ready[id]).toBe(true)
          seen = seen || ready[id]
        }
      }
    })
  })
})
