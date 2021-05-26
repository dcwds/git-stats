import { useEffect, useState } from "react"
import { GitHubUser, GitHubRepo, GitHubCommit } from "../../interfaces"
import {
  fetchGitHubUser,
  fetchGitHubUserReposAndCommits,
} from "../../fns/fetchers"
import { getCommitsByUserId } from "../../fns"

const useGitHubUser = (gitHubUsername: string) => {
  const [user, setUser] = useState<GitHubUser>()
  const [repos, setRepos] = useState<GitHubRepo[]>()
  const [commits, setCommits] = useState<GitHubCommit[]>()
  const [status, setStatus] = useState<string>("idle")

  useEffect(() => {
    setStatus("loading")
    ;(async () => {
      try {
        const [fetchedUser, { repos: fetchedRepos, commits: fetchedCommits }] =
          await Promise.all([
            fetchGitHubUser(gitHubUsername),
            fetchGitHubUserReposAndCommits(gitHubUsername),
          ])

        setUser(fetchedUser)
        setRepos(fetchedRepos)
        setCommits(getCommitsByUserId(fetchedUser.id, fetchedCommits))

        setStatus("done")
      } catch (error) {
        setStatus("error")
      }
    })()
  }, [gitHubUsername])

  return { user, repos, commits, status }
}

export default useGitHubUser
