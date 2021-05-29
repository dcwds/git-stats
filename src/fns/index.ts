import { GitHubCommit } from "../interfaces"

export const sortDatesByEarliest = (dates: Date[]) =>
  dates.sort((a, b) => a.getTime() - b.getTime())

export const getPaddedDaysAgo = (daysAgo: number) => {
  // When data is displayed, we often want to operate in
  // whole weeks, so we pad the daysAgo value.
  while (!!(daysAgo % 7)) daysAgo++

  return daysAgo
}

export const getDatesByDaysAgo = (date: Date, daysAgo: number): Date[] => {
  let dateCopy = new Date(date.valueOf())
  let dates: Date[] = [new Date(dateCopy.valueOf())]
  let count: number = 0

  while (++count < getPaddedDaysAgo(daysAgo)) {
    dateCopy.setDate(dateCopy.getDate() - 1)
    dates = [...dates, new Date(dateCopy.valueOf())]
  }

  return dates
}

export const getCommitsByUserId = (
  userId: number,
  commits: GitHubCommit[]
): GitHubCommit[] =>
  commits.filter((c) => c.committer !== null && c.committer.id === userId)

export const getCommitDate = (commit: GitHubCommit): Date =>
  new Date(commit.commit.committer.date)

export const getCommitsByDaysAgo = (
  date: Date,
  daysAgo: number,
  commits: GitHubCommit[]
): GitHubCommit[] => {
  const datesInMs = getDatesByDaysAgo(date, daysAgo).map((d) => d.getTime())

  return commits.filter((c) => {
    const commitDateInMs = getCommitDate(c).getTime()

    return (
      commitDateInMs <= datesInMs[0] &&
      commitDateInMs >= datesInMs[datesInMs.length - 1]
    )
  })
}

export const getDatesWithCommitCounts = (
  date: Date,
  daysAgo: number,
  commits: GitHubCommit[]
) =>
  sortDatesByEarliest(getDatesByDaysAgo(date, daysAgo)).reduce(
    (datesAndCounts, curr) => {
      const matchingCommits = commits.filter((c) => {
        return getCommitDate(c).toDateString() === curr.toDateString()
      })

      return [
        ...datesAndCounts,
        {
          date: curr,
          commitCount: matchingCommits.length,
        },
      ]
    },
    [] as { date: Date; commitCount: number }[]
  )
