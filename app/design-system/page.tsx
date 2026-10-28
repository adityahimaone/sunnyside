import type { Metadata } from 'next'

import { ArchiveShell } from '@/features/archive'
import { CaseLibraryPage, DESIGN_CASES } from '@/features/case-library'
import { WEBSITE_URL } from '@/lib/constants'
import { breadcrumbList, itemList, JsonLd } from '@/lib/structured-data'

export const metadata: Metadata = {
  title: 'Design Systems — Case Library',
  description:
    'Documented design systems: Sunnyside (paper and cobalt), Vitrine (glass and dither), Huginn Studio (bone, vermilion and print), Riso Co. (two-pass print and pushpin physics), and Hachure (survey paper and ordered dither). Briefs, marks, tokens, form kits and audits.',
  alternates: { canonical: '/design-system' },
  openGraph: {
    title: 'Design Systems — Case Library | Aditya Himawan',
    description:
      'Sunnyside, Vitrine, Huginn Studio, Riso Co. and Hachure: distinct interface systems, one design-engineering method. Open the case files.',
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
      'Explore documented design systems: Sunnyside, Vitrine, Huginn Studio, Riso Co. and Hachure.',
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
      'Documented design systems: Sunnyside (paper and cobalt), Vitrine (glass and dither), Huginn Studio (bone, vermilion and ordered print), Riso Co. (two-pass print and pushpin physics) and Hachure (survey paper and ordered dither).',
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
