import {
  fetchGitHubUser,
  fetchGitHubUserRepos,
  fetchGitHubRepoCommits,
  fetchGitHubUserReposAndCommits,
} from "."
import gitHubResponses from "../../mock-data/responses"

describe("fetchers", () => {
  test("fetches data of valid github user", async () =>
    expect(await fetchGitHubUser("valid-user")).toEqual(gitHubResponses.user))

  test("fails to fetch data of invalid github user", async () => {
    await expect(fetchGitHubUser("invalid-user")).rejects.toThrowError(
      /could not fetch data of GitHub user: invalid-user/i
    )
  })

  test("fetches repos of valid github user", async () => {
    const repos = await fetchGitHubUserRepos("valid-user")

    expect(repos).toEqual(gitHubResponses.userRepos)
  })

  test("fetches commits from repo of valid github user", async () => {
    const repos = await fetchGitHubUserRepos("valid-user")
    const commits = await fetchGitHubRepoCommits("valid-user", repos[0].name)

    expect(commits).toEqual(gitHubResponses.repoCommits)
  })

  test("fetches all commits of valid github user", async () => {
    const { repos, commits } = await fetchGitHubUserReposAndCommits(
      "valid-user"
    )

    expect(repos).toEqual(gitHubResponses.userRepos)
    expect(commits).toEqual(repos.map(() => gitHubResponses.repoCommits).flat())
  })
})
