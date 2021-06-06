import { GitHubCommit, GraphMonth } from "../interfaces"
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

export const numbersToDates = (startDate: Date, dayCount: number) =>
  R.map((n: number) => {
    const dateCopy = new Date(startDate.valueOf())
    dateCopy.setDate(dateCopy.getDate() - n)

    return dateCopy
  }, R.sort(numbersDesc, getDayRange(dayCount)))

export const fillDatesToSunday = (dates: Date[]) => {
  let earliestDate = dates[0]

  if (earliestDate.getDay() === 0) return dates

  while (earliestDate.getDay() !== 0) {
    const dateCopy = new Date(earliestDate.valueOf())
    dateCopy.setDate(dateCopy.getDate() - 1)

    dates = R.prepend(dateCopy, dates)
    earliestDate = dates[0]
  }

  return dates
}

export const getDatesByDayCount = R.compose(fillDatesToSunday, numbersToDates)

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
    getDatesByDayCount(startDate, dayCount)
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
    getDatesByDayCount(startDate, dayCount)
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

export const getMonthPositions = (months: number[]) => {
  const addMonth = (
    month: number,
    weekCount: number,
    prevMonth: GraphMonth | undefined
  ) => {
    return R.append({
      month: monthNumToText(month),
      start: (R.isNil(prevMonth) ? 0 : prevMonth.end) + weekOffset,
      // month week is inclusive, so 1 is added
      end: (R.isNil(prevMonth) ? 0 : prevMonth.end) + weekCount + 1
    })
  }
  let month: number | null = null
  let weekCount = 0
  let weekOffset = 0
  let res: GraphMonth[] = []

  while (months.length) {
    const curr = months[0]
    const prevMonth = R.last(res)

    months = R.tail(months)

    if (curr === -1) {
      if (R.isNil(month)) {
        // Weeks that are not exclusive to a particular month need to be
        // tracked so month positions are placed correctly in the timeline.
        weekOffset++
        continue
      }

      weekCount++
    } else {
      if (R.isNil(month)) month = curr

      if (curr !== month) {
        res = addMonth(month, weekCount, prevMonth)(res)

        month = curr
        weekCount = 0
      }
    }

    // Handle update for the case where a next month never occurs.
    if (
      !months.length &&
      !R.find(R.propEq("month", monthNumToText(month)))(res)
    ) {
      // prevMonth value is not updated in this iteration,
      // so we pass it explicitly.
      res = addMonth(month, weekCount, R.last(res))(res)
    }
  }

  return res
}

export const getMonthMarkers = R.compose(
  getMonthPositions,
  getStartOfMonths,
  R.map((w: number[]) => R.uniq(w)),
  R.splitEvery(7),
  R.map((d: Date) => d.getMonth()),
  getDatesByDayCount
)

// a month that sits on the very edge of the graph
// should not be considered, as it can't legally span to the next
// grid column (nonexistent), and therefore introduces layout issues
export const withoutEdgeMonth = (edgeNumber: number, months: GraphMonth[]) =>
  R.filter((m) => {
    // add 1 because CSS grid column does not operate with a starting index of 0
    return m.start + 1 !== edgeNumber
  }, months)
