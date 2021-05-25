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

    if (!fetchedUser.ok) {
      throw new Error(`could not fetch data of GitHub user: ${username}`)
    }

    return fetchedUser.json()
  } catch (error) {
    throw error
  }
}

export const fetchGitHubUserRepos = async (
  user: GitHubUser
): Promise<GitHubRepo[]> => {
  const { login: username, repos_url } = user

  try {
    const fetchedRepos = await fetch(repos_url)

    if (!fetchedRepos.ok) {
      throw new Error(`could not fetch repos of GitHub user: ${username}`)
    }

    return fetchedRepos.json()
  } catch (error) {
    throw error
  }
}

export const fetchGitHubRepoCommits = async (
  repo: GitHubRepo
): Promise<GitHubCommit[]> => {
  const { name, commits_url } = repo

  try {
    const fetchedCommits = await fetch(removeBracketsFromUrl(commits_url))

    if (!fetchedCommits.ok) {
      throw new Error(`could not fetch commits of GitHub repo: ${name}`)
    }

    return fetchedCommits.json()
  } catch (error) {
    throw error
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
    throw new Error(`could not fetch all commits of GitHub user: ${username}`)
  }
}
