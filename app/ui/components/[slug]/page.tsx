import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { componentDocs, getComponentDoc, UiComponentPage } from '@/features/ui'

export function generateStaticParams() {
  return componentDocs.map((component) => ({ slug: component.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const component = getComponentDoc(slug)
  if (!component) return {}
  return {
    title: `${component.name} — Sunnyside UI`,
    description: component.description,
  }
}

export default async function ComponentPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const component = getComponentDoc(slug)
  if (!component) notFound()
  return <UiComponentPage component={component} />
}
