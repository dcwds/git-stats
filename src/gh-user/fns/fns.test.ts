import responses from "../mock-responses"
import * as fns from "./fns"
import * as R from "ramda"

describe("fns", () => {
  test("fetches data of valid github user", async () =>
    expect(await fns.fetchUser("valid-user")).toEqual(responses.user))

  test("fails to fetch data of invalid github user", async () => {
    await expect(fns.fetchUser("invalid-user")).rejects.toThrowError(
      /could not fetch data of GitHub user: invalid-user/i
    )
  })

  test("fetches repos of valid github user", async () => {
    const repos = await fns.fetchUserRepos("valid-user")

    expect(repos).toEqual(responses.userRepos)
  })

  test("fetches commits from repo of valid github user", async () => {
    const repos = await fns.fetchUserRepos("valid-user")
    const commits = await fns.fetchRepoCommits("valid-user", repos[0].name)

    expect(commits).toEqual(responses.repoCommits)
  })

  test("fetches all repos with their respective commits of valid github user", async () => {
    const reposWithCommits = await fns.fetchUserReposWithCommits("valid-user")

    expect(reposWithCommits).toEqual(
      R.map(
        ({ name, description, html_url }) => ({
          name,
          description,
          url: html_url,
          commits: responses.repoCommits
        }),
        responses.userRepos
      )
    )
  })

  test("gets correct dates", () => {
    // Mon May 31 2021 04:00:00 GMT+0000
    const dates = fns.getDatesByDayCount(new Date(), 7)
    const expected = [
      1621742400 * 1000, // sun (filled)
      1621828800 * 1000, // mon (filled)
      1621915200 * 1000,
      1622001600 * 1000,
      1622088000 * 1000,
      1622174400 * 1000,
      1622260800 * 1000,
      1622347200 * 1000,
      1622433600 * 1000
    ]

    expect(R.map((d) => d.getTime(), dates)).toEqual(expected)
  })

  test("gets commits by day range", () => {
    const dayCount = 7
    const latestDate = new Date()
    const latestDateCopy = new Date(latestDate.valueOf())

    const earliestDate = new Date(
      latestDateCopy.setDate(latestDateCopy.getDate() - dayCount).valueOf()
    )

    const commitsByDayRange = fns.getCommitsByDayCount(
      latestDate,
      dayCount,
      responses.recentCommits
    )

    expect(
      R.filter((c) => {
        const dateInMs = fns.getCommitDate(c).getTime()

        return (
          dateInMs > latestDate.getTime() || dateInMs < earliestDate.getTime()
        )
      }, commitsByDayRange).length
    ).toBe(0)
  })

  test("gets correct dates and commit counts", () => {
    const commitDates = fns.getCommitDates(
      new Date(),
      7,
      responses.recentCommits
    )

    const expected = [
      {
        // May 23 - sun (filled)
        date: 1621742400 * 1000,
        commitCount: 0
      },
      {
        // May 24 - mon (filled)
        date: 1621828800 * 1000,
        commitCount: 3
      },
      {
        // May 25
        date: 1621915200 * 1000,
        commitCount: 3
      },
      {
        // May 26
        date: 1622001600 * 1000,
        commitCount: 3
      },
      {
        // May 27
        date: 1622088000 * 1000,
        commitCount: 2
      },
      {
        // May 28
        date: 1622174400 * 1000,
        commitCount: 2
      },
      {
        // May 29
        date: 1622260800 * 1000,
        commitCount: 1
      },
      {
        // May 30
        date: 1622347200 * 1000,
        commitCount: 0
      },
      {
        // May 31
        date: 1622433600 * 1000,
        commitCount: 0
      }
    ]

    expect(
      R.map(
        (v) => ({
          date: v.date.getTime(),
          commitCount: v.commitCount
        }),
        commitDates
      )
    ).toEqual(expected)
  })
})
