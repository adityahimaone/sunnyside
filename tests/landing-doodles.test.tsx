import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'

import { Burst, Sun } from '@/features/landing-page/studio/doodles'

describe('landing doodles', () => {
  it('renders sun coordinates with stable decimal precision', () => {
    const markup = renderToStaticMarkup(createElement(Sun))
    const coordinates = markup.match(/(?:x1|y1|x2|y2)="([^"]+)"/g) ?? []

    expect(coordinates).toHaveLength(48)
    coordinates.forEach((coordinate) => {
      const value = coordinate.match(/="([^"]+)"/)?.[1] ?? ''
      expect(value.split('.')[1]?.length ?? 0).toBeLessThanOrEqual(6)
    })
  })

  it('renders burst path coordinates with stable decimal precision', () => {
    const markup = renderToStaticMarkup(createElement(Burst))
    const path = markup.match(/<path d="([^"]+)"/)?.[1] ?? ''
    const coordinates = path.match(/-?\d+(?:\.\d+)?/g) ?? []

    expect(coordinates).toHaveLength(52)
    coordinates.forEach((coordinate) => {
      expect(coordinate.split('.')[1]?.length ?? 0).toBeLessThanOrEqual(6)
    })
  })
})
