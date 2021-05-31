import ghResponses from "../mock-data/responses"
import * as fns from "./"

describe("timezones", () => {
  test("should always be UTC", () =>
    expect(new Date().getTimezoneOffset()).toBe(0))
})

describe("fns", () => {
  test("gets padded number", () => {
    expect(fns.getPaddedDaysAgo(5)).toBe(7)
    expect(fns.getPaddedDaysAgo(10)).toBe(14)
    expect(fns.getPaddedDaysAgo(30)).toBe(35)
  })

  test("gets correct dates", () => {
    // Mon May 31 2021 04:00:00 GMT+0000
    const dates = fns.getDatesByDaysAgo(new Date(1622433600 * 1000), 7)
    const expected = [
      1622433600 * 1000,
      1622347200 * 1000,
      1622260800 * 1000,
      1622174400 * 1000,
      1622088000 * 1000,
      1622001600 * 1000,
      1621915200 * 1000,
    ]

    expect(dates.map((d) => d.getTime())).toEqual(expected)
  })

  test("gets commits by days ago", () => {
    const daysAgo = 7
    // Mon May 31 2021 04:00:00 GMT+0000
    const latestDate = new Date(1622433600 * 1000)
    const latestDateCopy = new Date(latestDate.valueOf())

    const earliestDate = new Date(
      latestDateCopy.setDate(latestDateCopy.getDate() - daysAgo).valueOf()
    )

    const commitsByDaysAgo = fns.getCommitsByDaysAgo(
      latestDate,
      daysAgo,
      ghResponses.recentCommits
    )

    expect(
      commitsByDaysAgo.filter((c) => {
        const dateInMs = fns.getCommitDate(c).getTime()

        return (
          dateInMs > latestDate.getTime() || dateInMs < earliestDate.getTime()
        )
      }).length
    ).toBe(0)
  })

  test("gets correct dates and commit counts", () => {
    // Mon May 31 2021 04:00:00 GMT+0000
    const datesAndCounts = fns.getDatesWithCommitCounts(
      new Date(1622433600 * 1000),
      7,
      ghResponses.recentCommits
    )

    const expected = [
      {
        // May 31
        date: 1622433600 * 1000,
        commitCount: 0,
      },
      {
        // May 30
        date: 1622347200 * 1000,
        commitCount: 0,
      },
      {
        // May 29
        // commits:
        // 2021-05-29T18:06:52Z
        date: 1622260800 * 1000,
        commitCount: 1,
      },
      {
        // May 28
        // commits:
        // 2021-05-28T16:38:35Z
        // 2021-05-28T02:43:26Z
        date: 1622174400 * 1000,
        commitCount: 2,
      },
      {
        // May 27
        // commits:
        // 2021-05-27T19:41:37Z
        // 2021-05-27T04:03:50Z
        date: 1622088000 * 1000,
        commitCount: 2,
      },
      {
        // May 26
        // commits:
        // 2021-05-26T16:43:44Z
        // 2021-05-26T03:05:23Z
        // 2021-05-26T02:58:36Z
        date: 1622001600 * 1000,
        commitCount: 3,
      },
      {
        // May 25
        // commits:
        // 2021-05-25T19:44:07Z
        // 2021-05-25T16:04:23Z
        // 2021-05-25T03:14:30Z
        date: 1621915200 * 1000,
        commitCount: 3,
      },
    ]

    expect(
      datesAndCounts.map((v) => ({
        date: v.date.getTime(),
        commitCount: v.commitCount,
      }))
    ).toEqual(expected.reverse())
  })
})
