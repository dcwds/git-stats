import { createContext, ReactChild } from "react"
import {
  GitHubUser,
  GitHubRepo,
  GitHubCommit,
  GraphMonth
} from "../../interfaces"
import useGHUser from "../../hooks/use-gh-user"
import { useParams } from "react-router-dom"

export const StatsContext = createContext<{
  user: Partial<GitHubUser>
  repos: GitHubRepo[]
  commits: GitHubCommit[]
  commitDates: { date: Date; commitCount: number }[]
  filteredCommits: GitHubCommit[]
  monthMarkers: GraphMonth[]
}>({} as any)

export const StatsProvider = ({ children }: { children: ReactChild }) => {
  const { username } = useParams<{ username: string }>()
  const { status, ...rest } = useGHUser(username)

  return (
    <StatsContext.Provider value={{ ...rest }}>
      {
        {
          loading: <p>Fetching user data for {username}</p>,
          done: <>{children}</>,
          error: <p>Could not get stats for {username}</p>
        }[status]
      }
    </StatsContext.Provider>
  )
}
