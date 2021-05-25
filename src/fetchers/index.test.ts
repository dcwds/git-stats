import {
  commitsByUserId,
  fetchGitHubUser,
  fetchGitHubUserRepos,
  fetchGitHubRepoCommits,
  fetchGitHubUserCommits,
} from "./"
import gitHubResponses from "../mock-data/responses"

describe("fetchers", () => {
  test("fetches data of valid github user", async () =>
    expect(await fetchGitHubUser("valid-user")).toEqual(gitHubResponses.user))

  test("fails to fetch data of invalid github user", async () => {
    await expect(fetchGitHubUser("invalid-user")).rejects.toThrowError(
      /could not fetch data of GitHub user: invalid-user/i
    )
  })

  test("fetches repos of valid github user", async () => {
    const fetchedUser = await fetchGitHubUser("valid-user")
    const fetchedRepos = await fetchGitHubUserRepos(fetchedUser)

    expect(fetchedRepos).toEqual(gitHubResponses.userRepos)
  })

  test("fetches commits of repo", async () => {
    const fetchedUser = await fetchGitHubUser("valid-user")
    const fetchedRepos = await fetchGitHubUserRepos(fetchedUser)
    const fetchedCommits = await fetchGitHubRepoCommits(fetchedRepos[0])

    expect(fetchedCommits).toEqual(gitHubResponses.repoCommits)
  })

  test("fetches all commits of valid github user", async () => {
    const fetchedUser = await fetchGitHubUser("valid-user")
    const fetchedUserCommits = await fetchGitHubUserCommits(fetchedUser)

    // needed to build the assertion
    const fetchedRepos = await fetchGitHubUserRepos(fetchedUser)
    const mockedCommits = commitsByUserId(
      fetchedUser.id,
      gitHubResponses.repoCommits
    )

    expect(fetchedUserCommits).toEqual(
      fetchedRepos.map(() => mockedCommits).flat()
    )
  })
})
