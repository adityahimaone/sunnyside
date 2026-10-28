import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Strand — Case 07 | Design System',
  description:
    'Strand is a quiet coastal design system: flat white quartz reading plates with no lift, marine basalt ink, one shallow-tide green signal, and an atmospheric dune vista framing both hero and footer.',
  alternates: {
    canonical: '/design-system/strand',
    types: { 'text/markdown': '/design-system/strand/llms.txt' },
  },
  openGraph: {
    title: 'Strand — Case 07 | Design System',
    description:
      'Where the dunes meet the tide. A quiet shore interface system cut from white quartz sand and marine basalt.',
    type: 'website',
    url: '/design-system/strand',
    images: [
      {
        url: '/brand/strand/strand-brandkit.png',
        width: 1500,
        height: 1125,
        alt: 'Strand brand board: the architectural S mark, coastal shoreline palette, quartz reading plates and form kit',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Strand — Case 07 | Design System',
    description:
      'Where the dunes meet the tide. An architectural coastal interface system.',
    images: ['/brand/strand/strand-brandkit.png'],
  },
}

export default function StrandLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return <div className="st-scope">{children}</div>
}
