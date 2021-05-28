import { useEffect, useMemo, useState } from "react"
import { GitHubUser, GitHubRepo, GitHubCommit } from "../../interfaces"
import {
  fetchGitHubUser,
  fetchGitHubUserReposAndCommits,
} from "../../fns/fetchers"
import { getCommitsByUserId, getCommitsByDaysAgo } from "../../fns"

const useGHUser = (ghUsername: string, dayRange: number) => {
  const [user, setUser] = useState<GitHubUser>()
  const [repos, setRepos] = useState<GitHubRepo[]>()
  const [commits, setCommits] = useState<GitHubCommit[]>()
  const [status, setStatus] = useState<string>("idle")

  const filteredCommits = useMemo(
    () => commits && getCommitsByDaysAgo(new Date(), dayRange, commits),
    [dayRange, commits]
  )

  useEffect(() => {
    setStatus("loading")
    ;(async () => {
      try {
        const [fetchedUser, { repos: fetchedRepos, commits: fetchedCommits }] =
          await Promise.all([
            fetchGitHubUser(ghUsername),
            fetchGitHubUserReposAndCommits(ghUsername),
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

  return { user, repos, commits, filteredCommits, status }
}

export default useGHUser
