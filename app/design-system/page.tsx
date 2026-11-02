import type { Metadata } from 'next'

import { ArchiveShell } from '@/features/archive'
import {
  CaseLibraryPage,
  DESIGN_CASES,
  getDesignCases,
} from '@/features/case-library'
import { WEBSITE_URL } from '@/lib/constants'
import { breadcrumbList, itemList, JsonLd } from '@/lib/structured-data'

export const metadata: Metadata = {
  title: 'Design Systems — Case Library',
  description:
    'Documented design systems: Sunnyside (paper and cobalt) opens the library, followed newest first by Vesper (two inks, one horizon, and a bake-off that put its own mark fourth), Wildflower Wind (a seed house, one placement table and a petal already taken), Jakarta (one stroke, nine district ramps, six published failures), Porphyry (porphyry stone, marble, gold leaf and one dark stage), Ledger (cool zinc, glass and one signal — a dashboard on shadcn/ui), Clearing (painted emerald, one pane of glass, a drawn stag on a horizon), Strand (quartz sand plates and a coastal vista), Cove (blue liquid glass and one reading plate), Hachure (survey paper and ordered dither), Riso Co. (a pinned sheet and two drums), Huginn Studio (cells, vermilion and ordered dither), and Vitrine (glass and dither). Briefs, marks, tokens and audits.',
  alternates: { canonical: '/design-system' },
  openGraph: {
    title: 'Design Systems — Case Library | Aditya Himawan',
    description:
      'Sunnyside, Vesper, Wildflower Wind, Jakarta, Porphyry, Ledger, Clearing, Strand, Cove, Hachure, Riso Co., Huginn Studio and Vitrine: distinct interface systems, one design-engineering method. Open the case files.',
    url: `${WEBSITE_URL}/design-system`,
    type: 'website',
    images: [
      {
        url: '/brand/vitrine/vitrine-brandkit.png',
        width: 1500,
        height: 1125,
        alt: 'The Vitrine brand board, one of the cases in the design-system library.',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Design Systems — Case Library | Aditya Himawan',
    description:
      'Explore documented design systems: Sunnyside, Vesper, Wildflower Wind, Jakarta, Porphyry, Ledger, Clearing, Strand, Cove, Hachure, Riso Co., Huginn Studio and Vitrine.',
    images: [
      {
        url: '/brand/vitrine/vitrine-brandkit.png',
        width: 1500,
        height: 1125,
        alt: 'The Vitrine brand board, one of the cases in the design-system library.',
      },
    ],
  },
}

export default async function DesignSystemLibraryPage() {
  const cases = await getDesignCases()

  const crumbs = breadcrumbList([
    { name: 'Home', path: '/' },
    { name: 'Design systems', path: '/design-system' },
  ])

  const list = itemList({
    name: 'Design systems — case library',
    description:
      'Documented design systems: Sunnyside (paper and cobalt) opens the library, followed newest first by Vesper (two inks and one horizon), Jakarta (one stroke, nine district ramps), Porphyry (porphyry stone, marble and one dark stage), Ledger (cool zinc, glass and one signal), Clearing (painted emerald, one pane of glass and a drawn stag on a horizon), Strand (quartz sand plates and a coastal vista), Cove (blue liquid glass and one reading plate), Hachure (survey paper and ordered dither), Riso Co. (a pinned sheet and two drums), Huginn Studio (cells, vermilion and ordered dither) and Vitrine (glass and dither).',
    items: cases.map((item) => ({
      name: `${item.number} — ${item.name}`,
      url: item.href.startsWith('http') ? item.href : `${WEBSITE_URL}${item.href}`,
      description: `${item.tagline} ${item.description}`,
    })),
  })

  return (
    <>
      <JsonLd data={crumbs} />
      <JsonLd data={list} />
      <ArchiveShell>
        <CaseLibraryPage cases={cases} />
      </ArchiveShell>
    </>
  )
}
