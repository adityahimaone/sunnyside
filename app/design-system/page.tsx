import type { Metadata } from 'next'

import { ArchiveShell } from '@/features/archive'
import { CaseLibraryPage, DESIGN_CASES } from '@/features/case-library'
import { WEBSITE_URL } from '@/lib/constants'
import { breadcrumbList, itemList, JsonLd } from '@/lib/structured-data'

export const metadata: Metadata = {
  title: 'Design Systems — Case Library',
  description:
    'Documented design systems: Sunnyside (paper and cobalt), Vitrine (glass and dither), Huginn Studio (cells, vermilion and ordered dither), Riso Co. (a pinned sheet and two drums), Hachure (survey paper and ordered dither), Cove (blue liquid glass and one reading plate), Strand (quartz sand plates and a coastal vista), Clearing (painted emerald, one pane of glass, a drawn stag on a horizon), Ledger (cool zinc, glass and one signal — a dashboard on shadcn/ui), and Porphyry (porphyry stone, marble, gold leaf and one dark stage). Briefs, marks, tokens and audits.',
  alternates: { canonical: '/design-system' },
  openGraph: {
    title: 'Design Systems — Case Library | Aditya Himawan',
    description:
      'Sunnyside, Vitrine, Huginn Studio, Riso Co., Hachure, Cove, Strand, Clearing, Ledger and Porphyry: distinct interface systems, one design-engineering method. Open the case files.',
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
      'Explore documented design systems: Sunnyside, Vitrine, Huginn Studio, Riso Co., Hachure, Cove, Strand, Clearing, Ledger and Porphyry.',
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

export default function DesignSystemLibraryPage() {
  const crumbs = breadcrumbList([
    { name: 'Home', path: '/' },
    { name: 'Design systems', path: '/design-system' },
  ])

  const list = itemList({
    name: 'Design systems — case library',
    description:
      'Documented design systems: Sunnyside (paper and cobalt), Vitrine (glass and dither), Huginn Studio (cells, vermilion and ordered dither), Riso Co. (a pinned sheet and two drums), Hachure (survey paper and ordered dither), Cove (blue liquid glass and one reading plate), Strand (quartz sand plates and a coastal vista) and Clearing (painted emerald, one pane of glass and a drawn stag on a horizon), Ledger (cool zinc, glass and one signal) and Porphyry (porphyry stone, marble and one dark stage).',
    items: DESIGN_CASES.map((item) => ({
      name: `${item.number} — ${item.name}`,
      url: `${WEBSITE_URL}${item.href}`,
      description: `${item.tagline} ${item.description}`,
    })),
  })

  return (
    <>
      <JsonLd data={crumbs} />
      <JsonLd data={list} />
      <ArchiveShell>
        <CaseLibraryPage />
      </ArchiveShell>
    </>
  )
}
