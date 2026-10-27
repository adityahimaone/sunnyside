import type { Metadata } from 'next'

import { DesignEngineeringPage } from '@/features/design-engineering'
import { WEBSITE_URL } from '@/lib/constants'
import { breadcrumbList, JsonLd } from '@/lib/structured-data'

export const metadata: Metadata = {
  title: 'Design Engineering — Field Manual',
  description:
    'How the work moves: the practice, the standards, the Sunnyside and Vitrine cases, the capability atlas and the notes behind it. Design engineering from brief to browser.',
  alternates: {
    canonical: '/design-engineering',
    types: { 'text/markdown': '/design-engineering/llms.txt' },
  },
  openGraph: {
    title: 'Design Engineering — Field Manual | Aditya Himawan',
    description:
      'The practice, the standards, the Sunnyside and Vitrine cases, the skills and the field notes behind the work.',
    url: `${WEBSITE_URL}/design-engineering`,
    type: 'article',
    images: ['/opengraph-image'],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@adityahimaone',
    title: 'Design Engineering — Field Manual | Aditya Himawan',
    description:
      'The practice, the standards, the Sunnyside and Vitrine cases, the skills and the field notes behind the work.',
    images: ['/opengraph-image'],
  },
}

export default function Page() {
  const crumbs = breadcrumbList([
    { name: 'Home', path: '/' },
    { name: 'Design engineering', path: '/design-engineering' },
  ])

  return (
    <>
      <JsonLd data={crumbs} />
      <DesignEngineeringPage />
    </>
  )
}
