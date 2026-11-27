/**
 * @jest-environment node
 */
import {
  componentDocs,
  componentGroups,
  getComponentDoc,
} from '@/features/ui/docs/registry'

describe('/ui component registry', () => {
  it('publishes unique, routable slugs for the full set', () => {
    const slugs = componentDocs.map((doc) => doc.slug)
    expect(new Set(slugs).size).toBe(slugs.length)
    expect(slugs).toHaveLength(20)
    for (const slug of slugs) expect(slug).toMatch(/^[a-z0-9-]+$/)
  })

  it('groups every component under a declared collection', () => {
    for (const doc of componentDocs) {
      expect(componentGroups).toContain(doc.group)
      expect(doc.importLine).toContain("from '@/features/ui'")
    }
  })

  it('resolves known slugs and rejects unknown ones', () => {
    expect(getComponentDoc('button')?.name).toBe('Button')
    expect(getComponentDoc('radio-group')?.exportName).toBe(
      'RadioGroup, RadioItem',
    )
    expect(getComponentDoc('missing')).toBeUndefined()
  })
})
