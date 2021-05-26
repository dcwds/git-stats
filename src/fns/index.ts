import { GitHubCommit } from "../interfaces"

export const getDatesByDaysAgo = (date: Date, daysAgo: number): Date[] => {
  let dates: Date[] = [new Date(date)]
  let count: number = 0

  while (++count < daysAgo) {
    date.setDate(date.getDate() - 1)
    dates = [...dates, new Date(date)]
  }

  return dates
}

export const sortCommitsByCommitDate = (commits: GitHubCommit[]) =>
  commits.sort(
    (a, b) => getCommitDate(b).getTime() - getCommitDate(a).getTime()
  )

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
  getDatesByDaysAgo(date, daysAgo).reduce((datesAndCounts, curr) => {
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
  }, [] as { date: Date; commitCount: number }[])
