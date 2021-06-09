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

const useGHUser = (username: string) => {
  const [user, setUser] = useState<GitHubUser | null>(null)
  const [repos, setRepos] = useState<fetchedGitHubRepo[]>([])
  const [status, setStatus] = useState<string>("")
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
    // url param is optional, so a check is needed
    if (R.isNil(username)) {
      setStatus("idle")
      return
    }

    setStatus("loading")
    ;(async () => {
      try {
        const [fetchedUser, fetchedReposWithCommits] = await Promise.all([
          fetchGitHubUser(username),
          fetchGitHubUserReposWithCommits(username)
        ])

        setUser(fetchedUser)
        setRepos(fetchedReposWithCommits)
        setNow(new Date())
        setStatus("done")
      } catch (error) {
        setStatus("error")
      }
    })()
  }, [username])

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
