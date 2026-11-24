import { LandingPage } from '@/features/landing-page'
import { getDesignCases } from '@/features/case-library'
import { JsonLd, person, webSite } from '@/lib/structured-data'

export default async function Home() {
  const jsonLd = person({
    description:
      'Design engineer building product interfaces in React, Next.js, and TypeScript. Crafting tactile systems, honest motion, and thoughtful digital details.',
    knowsAbout: [
      'Design Engineering',
      'Design Systems',
      'UI/UX Engineering',
      'Motion Design',
      'Frontend Architecture',
      'Creative Development',
      'React',
      'Next.js',
      'TypeScript',
      'Tailwind CSS',
      'Zustand',
      'React Query',
      'Node.js',
      'Golang',
      'Docker',
      'PostgreSQL',
      'MySQL',
    ],
    sameAs: [
      'https://github.com/adityahimaone',
      'https://linkedin.com/in/adityahimaone',
      'https://x.com/adityahimaone',
    ],
    alumniOf: [
      'Universitas AMIKOM Yogyakarta',
      'Binar Academy',
      'Alterra Academy',
      'Bangkit Academy',
    ],
  })

  const designCases = await getDesignCases()

  return (
    <>
      {/* `JsonLd` escapes `<` before the payload reaches the script tag; the
          inline script this replaced did not. */}
      <JsonLd data={jsonLd} />
      <JsonLd data={webSite()} />
      <LandingPage designCases={designCases} />
    </>
  )
}
