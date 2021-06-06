import { useEffect, useMemo, useState } from "react"
import { GitHubUser, GitHubRepo, GitHubCommit } from "../../interfaces"
import {
  fetchGitHubUser,
  fetchGitHubUserReposWithCommits
} from "../../fns/fetchers"
import {
  getCommitsByUserId,
  getCommitsByDayCount,
  getCommitDates,
  getMonthMarkers
} from "../../fns"
import * as R from "ramda"

const useGHUser = (ghUsername: string) => {
  const [user, setUser] = useState<Partial<GitHubUser>>({})
  const [repos, setRepos] = useState<Partial<GitHubRepo>[]>([])
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
        const [fetchedUser, fetchedReposWithCommits] = await Promise.all([
          fetchGitHubUser(ghUsername),
          fetchGitHubUserReposWithCommits(ghUsername)
        ])

        setUser(fetchedUser)
        setRepos(fetchedReposWithCommits)
        setCommits(
          getCommitsByUserId(
            fetchedUser.id,
            R.flatten(R.pluck("commits", fetchedReposWithCommits))
          )
        )

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
