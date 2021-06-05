import {
  createContext,
  useState,
  Dispatch,
  ReactChild,
  SetStateAction
} from "react"
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
  setDayCount: Dispatch<SetStateAction<number>>
  monthMarkers: GraphMonth[]
}>({} as any)

export const StatsProvider = ({ children }: { children: ReactChild }) => {
  const { username } = useParams<{ username: string }>()
  const [dayCount, setDayCount] = useState<number>(180)
  const { status, ...rest } = useGHUser(username, dayCount)

  return (
    <StatsContext.Provider value={{ ...rest, setDayCount }}>
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
