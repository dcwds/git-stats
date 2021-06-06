import { useEffect, useMemo, useState } from "react"
import { GitHubUser, GitHubRepo, GitHubCommit } from "../../interfaces"
import {
  fetchGitHubUser,
  fetchGitHubUserReposAndCommits
} from "../../fns/fetchers"
import {
  getCommitsByUserId,
  getCommitsByDayCount,
  getCommitDates,
  getMonthMarkers
} from "../../fns"

const useGHUser = (ghUsername: string) => {
  const [user, setUser] = useState<Partial<GitHubUser>>({})
  const [repos, setRepos] = useState<GitHubRepo[]>([])
  const [commits, setCommits] = useState<GitHubCommit[]>([])
  const [status, setStatus] = useState<string>("idle")

  // This can later be abstracted into an activity filter hook
  // as a potential feature.
  const dayCount = 180

  const filteredCommits = useMemo(
    () => getCommitsByDayCount(new Date(), dayCount, commits),
    [dayCount, commits]
  )

  const commitDates = useMemo(
    () => getCommitDates(new Date(), dayCount, filteredCommits),
    [dayCount, filteredCommits]
  )

  const monthMarkers = useMemo(
    () => getMonthMarkers(new Date(), dayCount),
    [dayCount]
  )

  useEffect(() => {
    setStatus("loading")
    ;(async () => {
      try {
        const [fetchedUser, { repos: fetchedRepos, commits: fetchedCommits }] =
          await Promise.all([
            fetchGitHubUser(ghUsername),
            fetchGitHubUserReposAndCommits(ghUsername)
          ])

        setUser(fetchedUser)
        setRepos(fetchedRepos)
        setCommits(getCommitsByUserId(fetchedUser.id, fetchedCommits))

        setStatus("done")
      } catch (error) {
        setStatus("error")
      }
    })()
  }, [ghUsername])

  return {
    user,
    repos,
    commits,
    status,
    filteredCommits,
    commitDates,
    monthMarkers
  }
}

export default useGHUser
