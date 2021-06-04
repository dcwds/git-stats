import { GitHubCommit } from "../interfaces"
import * as R from "ramda"

export const numbersDesc = (a: number, b: number) => b - a
export const roundToWeek = (n: number) => 7 * Math.ceil(n / 7)

// This is not ideal, as we lose access to `Date` localization.
export const monthNumToText = (n: number) => {
  if (n < 0) return ""

  return [
    "jan",
    "feb",
    "mar",
    "apr",
    "may",
    "jun",
    "jul",
    "aug",
    "sep",
    "oct",
    "nov",
    "dec"
  ][n]
}

export const getDayRange = R.compose(R.range(0), roundToWeek)

// Using `R.curry` here produces a TS error:
// `expected 0 arguments but got 1` when calling it.
// TODO: do more research on TS error
export const getDatesByDayCount = (startDate: Date) => (dayCount: number) =>
  R.map((n: number) => {
    const dateCopy = new Date(startDate.valueOf())
    dateCopy.setDate(dateCopy.getDate() - n)

    return dateCopy
  }, R.sort(numbersDesc, getDayRange(dayCount)))

export const getCommitsByUserId = (
  userId: number,
  commits: GitHubCommit[]
): GitHubCommit[] =>
  R.filter((c) => c.committer !== null && c.committer.id === userId, commits)

export const getCommitDate = (commit: GitHubCommit): Date =>
  new Date(commit.commit.committer.date)

export const getCommitsByDayCount = (
  startDate: Date,
  dayCount: number,
  commits: GitHubCommit[]
): GitHubCommit[] => {
  const datesAsTimes = R.map(
    (d) => d.getTime(),
    getDatesByDayCount(startDate)(dayCount)
  )

  return R.filter((c) => {
    const commitTime = getCommitDate(c).getTime()

    return (
      commitTime >= datesAsTimes[0] &&
      commitTime <= datesAsTimes[datesAsTimes.length - 1]
    )
  }, commits)
}

export const getCommitDates = (
  startDate: Date,
  dayCount: number,
  commits: GitHubCommit[]
) =>
  R.reduce(
    (commitDates, curr: Date) => {
      const matchingCommits = R.filter(
        (c) => getCommitDate(c).toDateString() === curr.toDateString(),
        commits
      )

      return [
        ...commitDates,
        {
          date: curr,
          commitCount: matchingCommits.length
        }
      ]
    },
    [] as { date: Date; commitCount: number }[],
    getDatesByDayCount(startDate)(dayCount)
  )

export const getStartOfMonths = (monthNums: number[][]) => {
  // Keep start of month, replace the rest.
  // Ignore weeks which contain two months.
  let months: number[] = []
  let seen: number[] = []

  R.forEach((pos) => {
    if (pos.length > 1) {
      months = [...months, -1]
    } else {
      const n = pos[0]
      if (R.includes(n, seen)) months = [...months, -1]
      else {
        months = [...months, n]
        seen = [...seen, n]
      }
    }
  }, monthNums)

  return months
}

export const getMonthsWithWeekCounts = (months: number[]) => {
  let month: number | null = null
  let addMonth = (month: number, weekCount: number) =>
    R.append({
      month: monthNumToText(month),
      weekCount: weekCount + 1 // month week is inclusive
    })
  let weekCount = 0
  let res: { month: string; weekCount: number }[] = []

  while (months.length) {
    let curr = months[0]
    months = R.tail(months)

    if (curr === -1) {
      if (R.isNil(month)) continue

      weekCount++
    } else {
      if (R.isNil(month)) month = curr

      if (curr !== month) {
        res = addMonth(month, weekCount)(res)

        month = curr
        weekCount = 0
      }
    }

    // Handle update for the case where a next month never occurs.
    if (
      !months.length &&
      !R.find(R.propEq("month", monthNumToText(month)))(res)
    )
      res = addMonth(month, weekCount)(res)
  }

  return res
}

export const getMonthMarkersByDayRange = R.compose(
  getMonthsWithWeekCounts,
  getStartOfMonths,
  R.map((w: number[]) => R.uniq(w)),
  R.splitEvery(7),
  R.map((d: Date) => d.getMonth()),
  getDatesByDayCount(new Date())
)
