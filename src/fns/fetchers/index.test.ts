import {
  fetchGitHubUser,
  fetchGitHubUserRepos,
  fetchGitHubRepoCommits,
  fetchGitHubUserReposWithCommits
} from "."
import ghResponses from "../../mock-data/responses"
import * as R from "ramda"

describe("fetchers", () => {
  test("fetches data of valid github user", async () =>
    expect(await fetchGitHubUser("valid-user")).toEqual(ghResponses.user))

  test("fails to fetch data of invalid github user", async () => {
    await expect(fetchGitHubUser("invalid-user")).rejects.toThrowError(
      /could not fetch data of GitHub user: invalid-user/i
    )
  })

  test("fetches repos of valid github user", async () => {
    const repos = await fetchGitHubUserRepos("valid-user")

    expect(repos).toEqual(ghResponses.userRepos)
  })

  test("fetches commits from repo of valid github user", async () => {
    const repos = await fetchGitHubUserRepos("valid-user")
    const commits = await fetchGitHubRepoCommits("valid-user", repos[0].name)

    expect(commits).toEqual(ghResponses.repoCommits)
  })

  test("fetches all repos with their respective commits of valid github user", async () => {
    const reposWithCommits = await fetchGitHubUserReposWithCommits("valid-user")

    expect(reposWithCommits).toEqual(
      R.map(
        ({ name, description, html_url }) => ({
          name,
          description,
          url: html_url,
          commits: ghResponses.repoCommits
        }),
        ghResponses.userRepos
      )
    )
  })
})
