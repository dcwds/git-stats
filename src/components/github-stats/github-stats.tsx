import { FC } from "react"
import { GitHubUser } from "../../interfaces"
import useGitHubUser from "../../hooks/use-github-user"
import { useParams } from "react-router-dom"
import GitHubActivityFilter from "../github-activity-filter"

const GitHubStats = () => {
  const { username } = useParams<{ username: string }>()
  const { user, status } = useGitHubUser(username)

  return (
    <div>
      {
        {
          loading: <p>Fetching user data for {username}</p>,
          done: <GitHubStatsDetails user={user} />,
          error: <p>Could not get stats for {username}</p>,
        }[status]
      }
    </div>
  )
}

const GitHubStatsDetails: FC<{ user: GitHubUser | undefined }> = ({ user }) => {
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

export default GitHubStats
