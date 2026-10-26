import { Studio } from '../studio'
import type { ArchiveRepo } from '@/features/projects/lib/github'

export default function LandingPage({
  archiveRepos,
}: {
  archiveRepos: readonly ArchiveRepo[]
}) {
  void archiveRepos
  return <Studio />
}
