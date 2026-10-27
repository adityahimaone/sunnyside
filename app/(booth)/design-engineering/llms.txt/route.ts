import { docsMarkdown } from '@/features/design-engineering/markdown'

export const dynamic = 'force-static'

export function GET() {
  return new Response(docsMarkdown(), {
    headers: {
      'Content-Type': 'text/markdown; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  })
}
