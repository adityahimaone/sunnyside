import { getAllPosts } from '@/features/blog'
import { WORK_PROJECTS } from '@/data/projects'
import { WEBSITE_URL } from '@/lib/constants'

function toW3CDate(dateStr?: string): string | undefined {
  if (!dateStr) return undefined
  try {
    const d = new Date(dateStr)
    if (isNaN(d.getTime())) return dateStr.slice(0, 10)
    return d.toISOString().split('T')[0]
  } catch {
    return dateStr.slice(0, 10)
  }
}

export async function GET() {
  const posts = await getAllPosts()

  // The date the newest post was written. Used as the `lastmod` for the
  // section indexes that are not otherwise datable.
  const lastPostDate = posts[0]?.dateModified ?? posts[0]?.date
  const fallbackLastmod = lastPostDate ? toW3CDate(lastPostDate) : undefined

  const pages = [
    { url: '/', changefreq: 'daily', priority: 1.0 },
    { url: '/blog', changefreq: 'daily', priority: 0.9 },
    { url: '/projects', changefreq: 'monthly', priority: 0.8 },
    {
      url: '/guides/self-hosting-nextjs',
      changefreq: 'monthly',
      priority: 0.8,
    },
    { url: '/guides/vps-vs-vercel', changefreq: 'monthly', priority: 0.7 },
    { url: '/bookmarks', changefreq: 'weekly', priority: 0.8 },
    // Reachable from /bookmarks rather than the dock. Listed because it is a
    // real page a crawler can index, not because it is in the navigation.
    { url: '/skills', changefreq: 'monthly', priority: 0.7 },
    { url: '/music', changefreq: 'monthly', priority: 0.8 },
    // The visual system behind the landing page. Linked from the footer note.
    { url: '/sunnyside', changefreq: 'monthly', priority: 0.6 },
  ].map((page) => ({ ...page, lastmod: fallbackLastmod }))

  const blogEntries = posts.map(
    (post: { slug: string; date: string; dateModified?: string }) => ({
      url: `/blog/${post.slug}`,
      lastmod: toW3CDate(post.dateModified ?? post.date),
      changefreq: 'monthly',
      priority: 0.7,
    }),
  )

  const projectEntries = WORK_PROJECTS.map((project) => ({
    url: `/projects/${project.slug}`,
    // No per-project lastmod exists — the data file is hand-curated and a
    // project entry changes when the project does, not on a schedule. Omitting
    // the field is more honest than stamping every one with the newest post's
    // date, which is what the index pages do.
    changefreq: 'yearly',
    priority: 0.7,
  }))

  const allUrls = [...pages, ...blogEntries, ...projectEntries]

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allUrls
  .map(
    (entry) => `
  <url>
    <loc>${WEBSITE_URL}${entry.url}</loc>${
      'lastmod' in entry && entry.lastmod
        ? `\n    <lastmod>${entry.lastmod}</lastmod>`
        : ''
    }
    <changefreq>${entry.changefreq}</changefreq>
    <priority>${entry.priority}</priority>
  </url>`,
  )
  .join('')}
</urlset>`

  return new Response(sitemap, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=86400, s-maxage=86400',
    },
  })
}
