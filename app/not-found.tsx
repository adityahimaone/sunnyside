'use client'

import Link from 'next/link'
import { motion } from 'motion/react'
import { Home, FolderGit2, BookOpen } from 'lucide-react'
import { Sun } from '@/features/landing-page/studio/doodles'

export default function NotFound() {
  return (
    <div className="flex min-h-[80vh] flex-col items-center justify-center px-4 py-16 text-center">
      <title>404 — Page Not Found | Aditya Himawan</title>
      <meta
        name="description"
        content="The page you requested could not be found. Explore shipped work, blog notes, or return home."
      />
      <meta name="robots" content="noindex, follow" />

      {/* Sunnyside Paper Card */}
      <motion.div
        className="relative mx-auto w-full max-w-lg rounded-2xl border border-[rgb(25_26_46/0.14)] bg-[var(--ss-paper-hi,#fffaf1)] p-8 shadow-[0_18px_40px_-16px_rgba(25,26,46,0.12)] sm:p-12"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
      >
        {/* Subtle decorative Sun stamp */}
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center">
          <Sun className="h-20 w-20" />
        </div>

        {/* Eyebrow Stamp */}
        <div className="mb-3 inline-flex items-center gap-1.5 rounded-full border border-[rgb(25_26_46/0.15)] bg-[var(--ss-cobalt-wash,#e8ebff)] px-3 py-1 font-mono text-[11px] font-semibold tracking-wider text-[var(--ss-cobalt-ink,#2c3cae)] uppercase">
          <span>Side A</span>
          <span className="opacity-40">/</span>
          <span>404 Not Found</span>
        </div>

        {/* Big tactile 404 & title */}
        <h1 className="mb-2 font-mono text-5xl font-bold tracking-tight text-[var(--ss-ink,#191a2e)] sm:text-6xl">
          404
        </h1>
        <h2 className="mb-3 text-xl font-semibold tracking-tight text-[var(--ss-ink,#191a2e)]">
          Off the Map
        </h2>

        <p className="mx-auto mb-8 max-w-sm text-sm leading-relaxed text-[var(--ss-muted,#5f5b6e)]">
          The note, project, or page you were looking for has moved, been archived, or never existed in this catalog.
        </p>

        {/* Navigation CTAs */}
        <div className="flex flex-col gap-2.5 sm:flex-row sm:justify-center">
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-[var(--ss-cobalt,#3d53d6)] px-5 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-[var(--ss-cobalt-ink,#2c3cae)]"
          >
            <Home size={15} />
            Back to Home
          </Link>
          <Link
            href="/projects"
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-[rgb(25_26_46/0.16)] bg-white/70 px-4 py-2.5 text-sm font-medium text-[var(--ss-ink,#191a2e)] transition hover:bg-white"
          >
            <FolderGit2 size={15} />
            Projects
          </Link>
          <Link
            href="/blog"
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-[rgb(25_26_46/0.16)] bg-white/70 px-4 py-2.5 text-sm font-medium text-[var(--ss-ink,#191a2e)] transition hover:bg-white"
          >
            <BookOpen size={15} />
            Blog
          </Link>
        </div>

        {/* Footer note */}
        <p className="mt-8 border-t border-[rgb(25_26_46/0.08)] pt-4 font-mono text-[11px] text-[var(--ss-muted,#5f5b6e)]">
          Aditya Himawan · Jakarta, ID
        </p>
      </motion.div>
    </div>
  )
}
