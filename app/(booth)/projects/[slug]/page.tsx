import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft, ArrowRight, ArrowUpRight } from 'lucide-react'

import { WORK_PROJECTS, getProject } from '@/data/projects'
import { breadcrumbList, creativeWork, JsonLd } from '@/lib/structured-data'
import { WEBSITE_URL } from '@/lib/constants'
import layout from '@/features/archive/archive.module.css'
import styles from '@/features/projects/case-study.module.css'

/**
 * `/projects/[slug]` — the case study that the shelf's "Case study" link opens.
 *
 * The content and the JSON-LD are unchanged from the plain Tailwind version;
 * this is the same sheet as the index, with the facts moved into one cobalt
 * block and the artwork framed like a sleeve rather than floated in the column.
 */
export function generateStaticParams() {
  return WORK_PROJECTS.map((project) => ({ slug: project.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const project = getProject(slug)

  if (!project) {
    return { title: 'Project not found' }
  }

  const description = `${project.description} Built with ${project.stack.join(', ')} — ${project.role.toLowerCase()}, ${project.year}.`

  return {
    title: project.title,
    description,
    alternates: { canonical: `/projects/${project.slug}` },
    openGraph: {
      title: `${project.title} — Aditya Himawan`,
      description,
      url: `${WEBSITE_URL}/projects/${project.slug}`,
      type: 'article',
      images: project.cover ? [project.cover] : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title: `${project.title} — Aditya Himawan`,
      description,
    },
  }
}

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const project = getProject(slug)

  // An unknown slug renders the 404 rather than a thin page.
  if (!project) notFound()

  const url = `${WEBSITE_URL}/projects/${project.slug}`

  const work = creativeWork({
    title: project.title,
    description: project.description,
    url,
    image: project.cover || undefined,
    genre: project.genre,
    year: project.year,
    stack: project.stack,
  })

  const breadcrumbs = breadcrumbList([
    { name: 'Home', path: '/' },
    { name: 'Projects', path: '/projects' },
    { name: project.title, path: `/projects/${project.slug}` },
  ])

  const index = WORK_PROJECTS.findIndex((p) => p.slug === project.slug)
  const previous = WORK_PROJECTS[index - 1]
  const next = WORK_PROJECTS[index + 1]

  return (
    <>
      <JsonLd data={work} />
      <JsonLd data={breadcrumbs} />

      <main className={`${layout.page} ${styles.page}`} id="main-content">
        <div className={layout.container}>
          <nav className={styles.crumbs} aria-label="Breadcrumb">
            <Link href="/projects" className={styles.back}>
              <ArrowLeft size={14} aria-hidden />
              All projects
            </Link>
          </nav>

          <header className={styles.head}>
            <div className={styles.headCopy}>
              <p className={styles.kicker}>
                <span>{project.genre}</span>
                <span className={layout.num}>{project.year}</span>
              </p>
              <h1 className={layout.title}>{project.title}</h1>
              <p className={layout.intro}>{project.description}</p>
              <div className={layout.actions}>
                <a
                  href={project.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={layout.primary}
                >
                  Visit the live app
                  <ArrowUpRight className="size-4" aria-hidden />
                </a>
              </div>
            </div>

            <dl className={styles.facts}>
              <div className={styles.fact}>
                <dt className={styles.factLabel}>Role</dt>
                <dd className={styles.factValue}>{project.role}</dd>
              </div>
              <div className={styles.fact}>
                <dt className={styles.factLabel}>Year</dt>
                <dd className={`${styles.factValue} ${layout.num}`}>
                  {project.year}
                </dd>
              </div>
              <div className={styles.fact}>
                <dt className={styles.factLabel}>Stack</dt>
                <dd>
                  <ul className={styles.chips}>
                    {project.stack.map((tech) => (
                      <li key={tech} className={styles.chip}>
                        {tech}
                      </li>
                    ))}
                  </ul>
                </dd>
              </div>
            </dl>
          </header>

          {project.cover ? (
            <figure className={styles.cover}>
              <span className={styles.tape} aria-hidden />
              <div className={styles.coverArt}>
                <Image
                  src={project.cover}
                  alt={`${project.title} interface`}
                  fill
                  sizes="(min-width: 1200px) 1120px, 92vw"
                  className="object-cover"
                  priority
                />
              </div>
              <figcaption className={styles.coverCaption}>
                {project.title}, {project.year}
              </figcaption>
            </figure>
          ) : null}

          <div className={styles.body}>
            <section aria-labelledby="highlights-title">
              <h2 id="highlights-title" className={styles.sectionTitle}>
                What it does
              </h2>
              <ol className={styles.highlightList}>
                {project.highlights.map((highlight) => (
                  <li key={highlight} className={styles.highlight}>
                    {highlight}
                  </li>
                ))}
              </ol>
            </section>

            <aside className={styles.aside} aria-label="The artefact">
              <p className={styles.asideNote}>
                {project.role} on a {project.year} release, built with{' '}
                {project.stack.join(', ')}.
              </p>
              <a
                href={project.url}
                target="_blank"
                rel="noopener noreferrer"
                className={layout.textLink}
              >
                Open {project.title}
                <ArrowUpRight className="size-3.5" aria-hidden />
              </a>
            </aside>
          </div>

          <nav className={styles.pager} aria-label="Other projects">
            {previous ? (
              <Link
                href={`/projects/${previous.slug}`}
                className={styles.pagerLink}
              >
                <ArrowLeft size={15} aria-hidden />
                <span>
                  <span className={styles.pagerLabel}>Previous</span>
                  {previous.title}
                </span>
              </Link>
            ) : (
              <span />
            )}
            {next ? (
              <Link
                href={`/projects/${next.slug}`}
                className={`${styles.pagerLink} ${styles.pagerNext}`}
              >
                <span>
                  <span className={styles.pagerLabel}>Next</span>
                  {next.title}
                </span>
                <ArrowRight size={15} aria-hidden />
              </Link>
            ) : (
              <span />
            )}
          </nav>
        </div>
      </main>
    </>
  )
}
