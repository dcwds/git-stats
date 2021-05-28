import {
  createContext,
  useState,
  Dispatch,
  ReactChild,
  SetStateAction,
} from "react"
import { GitHubUser, GitHubRepo, GitHubCommit } from "../../interfaces"
import useGHUser from "../../hooks/use-gh-user"
import { useParams } from "react-router-dom"

export const StatsContext = createContext<{
  user: GitHubUser | undefined
  repos: GitHubRepo[] | undefined
  commits: GitHubCommit[] | undefined
  filteredCommits: GitHubCommit[] | undefined
  setDayRange: Dispatch<SetStateAction<number>>
}>({} as any)

export const StatsProvider = ({ children }: { children: ReactChild }) => {
  const { username } = useParams<{ username: string }>()
  const [dayRange, setDayRange] = useState<number>(30)
  const { status, ...rest } = useGHUser(username, dayRange)

  return (
    <StatsContext.Provider value={{ ...rest, setDayRange }}>
      {
        {
          loading: <p>Fetching user data for {username}</p>,
          done: <>{children}</>,
          error: <p>Could not get stats for {username}</p>,
        }[status]
      }
    </StatsContext.Provider>
  )
}
