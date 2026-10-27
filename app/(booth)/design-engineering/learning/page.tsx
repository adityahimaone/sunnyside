import type { Metadata } from 'next'

import { DesignEngineeringLearningPage } from '@/features/design-engineering'
import { WEBSITE_URL } from '@/lib/constants'
import { breadcrumbList, JsonLd } from '@/lib/structured-data'

export const metadata: Metadata = {
  title: 'Field Notes — Design Engineering',
  description:
    'Pen.dev first, Figma for the handoff, Craft for the second look. Working notes, tips and prompt recipes from the Sunnyside build.',
  alternates: {
    canonical: '/design-engineering/learning',
    types: { 'text/markdown': '/design-engineering/learning/llms.txt' },
  },
  openGraph: {
    title: 'Field Notes — Design Engineering | Aditya Himawan',
    description:
      'Pen.dev first, Figma for the handoff, Craft for the second look. Notes from the Sunnyside build.',
    url: `${WEBSITE_URL}/design-engineering/learning`,
    type: 'article',
    images: ['/opengraph-image'],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@adityahimaone',
    title: 'Field Notes — Design Engineering | Aditya Himawan',
    description:
      'Pen.dev first, Figma for the handoff, Craft for the second look. Notes from the Sunnyside build.',
    images: ['/opengraph-image'],
  },
}

export default function Page() {
  const crumbs = breadcrumbList([
    { name: 'Home', path: '/' },
    { name: 'Design engineering', path: '/design-engineering' },
    { name: 'Learning', path: '/design-engineering/learning' },
  ])

  return (
    <>
      <JsonLd data={crumbs} />
      <DesignEngineeringLearningPage />
    </>
  )
}
