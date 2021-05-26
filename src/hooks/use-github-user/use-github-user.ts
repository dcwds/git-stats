import { useEffect, useState } from "react"
import { GitHubUser, GitHubRepo, GitHubCommit } from "../../interfaces"
import { fetchGitHubUser, fetchGitHubUserReposAndCommits } from "../../fetchers"

export const commitsByUserId = (
  userId: number,
  commits: GitHubCommit[]
): GitHubCommit[] =>
  commits.filter((c) => c.committer !== null && c.committer.id === userId)

const useGitHubUser = (gitHubUsername: string) => {
  const [user, setUser] = useState<GitHubUser | null>(null)
  const [repos, setRepos] = useState<GitHubRepo[] | null>(null)
  const [commits, setCommits] = useState<GitHubCommit[] | null>(null)
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
        setCommits(commitsByUserId(fetchedUser.id, fetchedCommits))

        setStatus("done")
      } catch (error) {
        setStatus("error")
      }
    })()
  }, [gitHubUsername])

  return { user, repos, commits, status }
}

export default useGitHubUser
