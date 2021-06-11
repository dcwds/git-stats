import { User, Repo, Commit, GraphMonth } from "../interfaces"
import {
  sortByNumbersDesc,
  toNextMultipleOf7,
  monthNumToText
} from "../../common/fns"
import * as R from "ramda"

export const fetchUser = async (username: string): Promise<User> => {
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

export const fetchUserRepos = async (username: string): Promise<Repo[]> => {
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

export const fetchRepoCommits = async (
  username: string,
  repo: string
): Promise<Commit[]> => {
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

export const fetchUserReposWithCommits = async (
  username: string
): Promise<
  {
    name: string
    description: string
    url: string
    commits: Commit[]
  }[]
> => {
  try {
    const repos = await fetchUserRepos(username)
    const reposWithCommits = Promise.all(
      R.map(
        async ({ name, description, html_url }) => ({
          name,
          description,
          url: html_url,
          commits: await fetchRepoCommits(username, name)
        }),
        repos
      )
    )

    return reposWithCommits
  } catch (error) {
    throw new Error(
      `could not fetch repos and commits of GitHub user: ${username}`
    )
  }
}

export const getDayRange = R.compose(R.range(0), toNextMultipleOf7)

export const numbersToDates = (startDate: Date, dayCount: number) =>
  R.map((n: number) => {
    const dateCopy = new Date(startDate.valueOf())
    dateCopy.setDate(dateCopy.getDate() - n)

    return dateCopy
  }, sortByNumbersDesc(getDayRange(dayCount)))

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
  commits: Commit[]
): Commit[] =>
  R.filter((c) => c.committer !== null && c.committer.id === userId, commits)

export const getCommitDate = (commit: Commit): Date =>
  new Date(commit.commit.committer.date)

export const getCommitsByDayCount = (
  startDate: Date,
  dayCount: number,
  commits: Commit[]
): Commit[] => {
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
  commits: Commit[]
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

  R.addIndex<number>(R.forEach)((curr, idx) => {
    const prevMonth = R.last(res)

    if (curr === -1) {
      // Weeks that are not exclusive to a particular month need to be
      // tracked so month positions are placed correctly in the timeline.
      if (R.isNil(month)) return weekOffset++

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
      R.isNil(months[idx + 1]) &&
      !R.find(R.propEq("month", monthNumToText(month)))(res)
    ) {
      // prevMonth value is not updated in this iteration,
      // so we pass it explicitly.
      res = addMonth(month, weekCount, R.last(res))(res)
    }
  }, months)

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
