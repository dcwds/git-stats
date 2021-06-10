import { useEffect, useMemo, useState } from "react"
import { User, FetchedRepo } from "../../interfaces"
import { DAY_COUNT } from "../../../constants"
import * as fns from "../../fns"
import * as R from "ramda"

const useUser = (username: string) => {
  const [user, setUser] = useState<User | null>(null)
  const [repos, setRepos] = useState<FetchedRepo[]>([])
  const [status, setStatus] = useState<string>("")
  const [now, setNow] = useState<Date | null>(null)

  const filteredRepos = useMemo(
    () =>
      now && user
        ? R.map(
            (r: FetchedRepo) => ({
              ...r,
              commits: fns.getCommitsByDayCount(
                now,
                DAY_COUNT,
                fns.getCommitsByUserId(user.id, r.commits)
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
    () => now && fns.getCommitDates(now, DAY_COUNT, filteredCommits),
    [filteredCommits, now]
  )

  const monthMarkers = useMemo(
    () => now && fns.getMonthMarkers(now, DAY_COUNT),
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
          fns.fetchUser(username),
          fns.fetchUserReposWithCommits(username)
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

export default useUser
