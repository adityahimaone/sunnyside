import type { Metadata } from 'next'
import { UiCatalogPage } from '@/features/ui'

export const metadata: Metadata = {
  title: 'Sunnyside UI — Component library',
  description:
    'Twenty production-ready React components shaped by the Sunnyside design system.',
}

export default function UiPage() {
  return <UiCatalogPage />
}
