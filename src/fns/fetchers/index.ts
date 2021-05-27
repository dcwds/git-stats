import { GitHubUser, GitHubRepo, GitHubCommit } from "../../interfaces"

export const fetchGitHubUser = async (
  username: string
): Promise<GitHubUser> => {
  try {
    const user = await fetch(`https://api.github.com/users/${username}`, {
      headers: {
        Authorization: `token ${process.env.REACT_APP_GH_TOKEN}`,
      },
    })

    if (!user.ok) {
      throw new Error(`could not fetch data of GitHub user: ${username}`)
    }

    return user.json()
  } catch (error) {
    throw error
  }
}

export const fetchGitHubUserRepos = async (
  username: string
): Promise<GitHubRepo[]> => {
  try {
    const repos = await fetch(
      `https://api.github.com/users/${username}/repos`,
      {
        headers: {
          Authorization: `token ${process.env.REACT_APP_GH_TOKEN}`,
        },
      }
    )

    if (!repos.ok) {
      throw new Error(`could not fetch repos of GitHub user: ${username}`)
    }

    return repos.json()
  } catch (error) {
    throw error
  }
}

export const fetchGitHubRepoCommits = async (
  username: string,
  repoName: string
): Promise<GitHubCommit[]> => {
  try {
    const commits = await fetch(
      `https://api.github.com/repos/${username}/${repoName}/commits`,
      {
        headers: {
          Authorization: `token ${process.env.REACT_APP_GH_TOKEN}`,
        },
      }
    )

    if (!commits.ok) {
      throw new Error(`could not fetch commits of GitHub repo: ${repoName}`)
    }

    return commits.json()
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
