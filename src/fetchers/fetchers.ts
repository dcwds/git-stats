import { GitHubUser, GitHubRepo, GitHubCommit } from "../interfaces"

const removeBracketsFromUrl = (url: string): string =>
  url.replace(/({.*?})/gi, "")

export const commitsByUserId = (
  userId: number,
  commits: GitHubCommit[]
): GitHubCommit[] => commits.filter((c) => c.committer.id === userId)

export const fetchGitHubUser = async (
  username: string
): Promise<GitHubUser> => {
  try {
    const fetchedUser = await fetch(`https://api.github.com/users/${username}`)
    return fetchedUser.json()
  } catch (err) {
    throw new Error(`Could not fetch profile of GitHub user: ${username}`)
  }
}

export const fetchGitHubUserRepos = async (
  user: GitHubUser
): Promise<GitHubRepo[]> => {
  const { login: username, repos_url } = user

  try {
    const fetchedRepos = await fetch(repos_url)
    return fetchedRepos.json()
  } catch (err) {
    throw new Error(`Could not fetch repos of GitHub user: ${username}`)
  }
}

export const fetchGitHubRepoCommits = async (
  repo: GitHubRepo
): Promise<GitHubCommit[]> => {
  const { name, commits_url } = repo

  try {
    const fetchedCommits = await fetch(removeBracketsFromUrl(commits_url))
    return fetchedCommits.json()
  } catch (err) {
    throw new Error(`Could not fetch commits of GitHub repo: ${name}`)
  }
}

export const fetchGitHubUserCommits = async (
  user: GitHubUser
): Promise<GitHubCommit[]> => {
  const { login: username, id: userId } = user

  try {
    const fetchedUserRepos = await fetchGitHubUserRepos(user)
    const fetchedAllCommits = await Promise.all(
      fetchedUserRepos.map((r) => fetchGitHubRepoCommits(r))
    )

    return commitsByUserId(userId, fetchedAllCommits.flat())
  } catch (error) {
    throw new Error(`Could not fetch all commits of GitHub user: ${username}`)
  }
}
