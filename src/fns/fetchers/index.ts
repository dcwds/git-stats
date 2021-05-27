import { GitHubUser, GitHubRepo, GitHubCommit } from "../../interfaces"

export const fetchGitHubUser = async (
  username: string
): Promise<GitHubUser> => {
  try {
    const user = await fetch(`/gh-api/gh-user?username=${username}`)
    const data = await user.json()

    if (!user.ok) {
      throw new Error(`could not fetch data of GitHub user: ${username}`)
    }

    return data
  } catch (error) {
    throw error
  }
}

export const fetchGitHubUserRepos = async (
  username: string
): Promise<GitHubRepo[]> => {
  try {
    const repos = await fetch(`/gh-api/gh-user-repos?username=${username}`)
    const data = await repos.json()

    if (!repos.ok) {
      throw new Error(`could not fetch repos of GitHub user: ${username}`)
    }

    return data
  } catch (error) {
    throw error
  }
}

export const fetchGitHubRepoCommits = async (
  username: string,
  repo: string
): Promise<GitHubCommit[]> => {
  try {
    const commits = await fetch(
      `/gh-api/gh-user-repo-commits?username=${username}&repo=${repo}`
    )
    const data = await commits.json()

    if (!commits.ok) {
      throw new Error(`could not fetch commits of GitHub repo: ${repo}`)
    }

    return data
  } catch (error) {
    throw error
  }
}

export const fetchGitHubUserReposAndCommits = async (
  username: string
): Promise<{ repos: GitHubRepo[]; commits: GitHubCommit[] }> => {
  try {
    const repos = await fetchGitHubUserRepos(username)
    const commits = (
      await Promise.all(
        repos.map((r) => fetchGitHubRepoCommits(username, r.name))
      )
    ).flat()

    return { repos, commits }
  } catch (error) {
    throw new Error(
      `could not fetch repos and commits of GitHub user: ${username}`
    )
  }
}
