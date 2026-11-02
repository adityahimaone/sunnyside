import { Studio } from '../studio'
import type { ArchiveRepo } from '@/features/projects/lib/github'
import type { DesignCase } from '@/features/case-library'

export default function LandingPage({
  archiveRepos,
  designCases,
}: {
  archiveRepos: readonly ArchiveRepo[]
  designCases?: readonly DesignCase[]
}) {
  void archiveRepos
  return <Studio designCases={designCases} />
}
