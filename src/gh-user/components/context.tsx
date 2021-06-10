import { createContext, ReactChild } from "react"
import { User, FetchedRepo, Commit, GraphMonth } from "../interfaces"
import useUser from "../hooks/use-user"
import { useParams } from "react-router-dom"

export const Context = createContext<{
  user: User | null
  commitDates: { date: Date; commitCount: number }[] | null
  filteredRepos: FetchedRepo[]
  filteredCommits: Commit[]
  monthMarkers: GraphMonth[] | null
}>({} as any)

export const Provider = ({ children }: { children: ReactChild }) => {
  const { username } = useParams<{ username: string }>()
  const { status, ...rest } = useUser(username)

  return (
    <Context.Provider value={{ ...rest }}>
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
    </Context.Provider>
  )
}
