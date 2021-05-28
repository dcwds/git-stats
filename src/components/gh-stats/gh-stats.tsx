import { Dispatch, FC, SetStateAction, useState } from "react"
import { GitHubUser } from "../../interfaces"
import useGHUser from "../../hooks/use-gh-user"
import { useParams } from "react-router-dom"
import GitHubActivityFilter from "../gh-activity-filter"

const GHStats = () => {
  const { username } = useParams<{ username: string }>()
  const [daysAgo, setDaysAgo] = useState<number>(30)
  const { user, status } = useGHUser(username, daysAgo)

  return (
    <div>
      {
        {
          loading: <p>Fetching user data for {username}</p>,
          done: <GHStatsDetails user={user} setDaysAgo={setDaysAgo} />,
          error: <p>Could not get stats for {username}</p>,
        }[status]
      }
    </div>
  )
}

const GHStatsDetails: FC<{
  user: GitHubUser | undefined
  setDaysAgo: Dispatch<SetStateAction<number>>
}> = ({ user }) => {
  return (
    <div>
      <div className="flex items-center mb-8">
        <img
          className="rounded-full mr-6"
          alt="GitHub Avatar"
          src={user?.avatar_url}
          width="100"
        />
        <div>
          <h2 className="text-xl font-semibold">{user?.name}</h2>
          <p className="text-gray-300 text-lg mb-2">{user?.login}</p>
          <p className="text-gray-300 text-sm">{user?.bio}</p>
        </div>
      </div>

      <GitHubActivityFilter />
    </div>
  )
}

export default GHStats
