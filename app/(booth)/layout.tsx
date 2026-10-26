import { ArchiveShell } from '@/features/archive'

/**
 * The archive routes share the back room: paper, one sticky bar, one sign-off.
 *
 * This used to mount a booth with an ambient colour wash per route. The pages
 * had already moved to the Sunnyside paper system, so the wash only added a
 * second, invisible chrome layer. The shell is now the only thing this layout
 * owns; each page brings its own composition.
 */
export default function BoothLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <ArchiveShell>{children}</ArchiveShell>
}
