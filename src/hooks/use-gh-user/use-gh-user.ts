import { useEffect, useMemo, useState } from "react"
import { GitHubUser, fetchedGitHubRepo } from "../../interfaces"
import { DAY_COUNT } from "../../constants"
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
  const [user, setUser] = useState<GitHubUser | null>(null)
  const [repos, setRepos] = useState<fetchedGitHubRepo[]>([])
  const [status, setStatus] = useState<string>("idle")

  const filteredRepos = useMemo(() => {
    if (!user) return []

    return R.map(
      (r: fetchedGitHubRepo) => ({
        ...r,
        commits: getCommitsByDayCount(
          new Date(),
          DAY_COUNT,
          getCommitsByUserId(user.id, r.commits)
        )
      }),
      repos
    )
  }, [repos, user])

  const filteredCommits = useMemo(
    () => R.flatten(R.pluck("commits", filteredRepos)),
    [filteredRepos]
  )

  const commitDates = useMemo(
    () => getCommitDates(new Date(), DAY_COUNT, filteredCommits),
    [filteredCommits]
  )

  const monthMarkers = useMemo(() => getMonthMarkers(new Date(), DAY_COUNT), [])

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

        setStatus("done")
      } catch (error) {
        setStatus("error")
      }
    })()
  }, [ghUsername])

  return {
    user,
    status,
    filteredCommits,
    filteredRepos,
    commitDates,
    monthMarkers
  }
}

export default useGHUser
