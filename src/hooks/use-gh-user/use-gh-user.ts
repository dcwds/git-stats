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
  const [now, setNow] = useState<Date | null>(null)

  const filteredRepos = useMemo(
    () =>
      now && user
        ? R.map(
            (r: fetchedGitHubRepo) => ({
              ...r,
              commits: getCommitsByDayCount(
                now,
                DAY_COUNT,
                getCommitsByUserId(user.id, r.commits)
              )
            }),
            repos
          )
        : [],
    [repos, user, now]
  )

  const filteredCommits = useMemo(
    () => R.flatten(R.pluck("commits", filteredRepos)),
    [filteredRepos]
  )

  const commitDates = useMemo(
    () => now && getCommitDates(now, DAY_COUNT, filteredCommits),
    [filteredCommits, now]
  )

  const monthMarkers = useMemo(
    () => now && getMonthMarkers(now, DAY_COUNT),
    [now]
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
        setNow(new Date())
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
