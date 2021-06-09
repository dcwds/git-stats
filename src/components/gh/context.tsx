import { createContext, ReactChild } from "react"
import {
  GitHubUser,
  fetchedGitHubRepo,
  GitHubCommit,
  GraphMonth
} from "../../interfaces"
import useGHUser from "../../hooks/use-gh-user"
import { useParams } from "react-router-dom"

export const StatsContext = createContext<{
  user: GitHubUser | null
  commitDates: { date: Date; commitCount: number }[] | null
  filteredRepos: fetchedGitHubRepo[]
  filteredCommits: GitHubCommit[]
  monthMarkers: GraphMonth[] | null
}>({} as any)

export const StatsProvider = ({ children }: { children: ReactChild }) => {
  const { username } = useParams<{ username: string }>()
  const { status, ...rest } = useGHUser(username)

  return (
    <StatsContext.Provider value={{ ...rest }}>
      {
        {
          idle: (
            <p className="text-sm leading-relaxed text-gray-300">
              GitHub user stats are generated from the past six months of their
              commit activity within public repositories.
            </p>
          ),
          loading: <p>Fetching user data for {username}</p>,
          done: <>{children}</>,
          error: <p>Could not get stats for {username}</p>
        }[status]
      }
    </StatsContext.Provider>
  )
}
