import useGitHubUser from "../../hooks/use-github-user"
import { useParams } from "react-router-dom"

const GitHubStats = () => {
  const { username } = useParams<{ username: string }>()
  const { user, status } = useGitHubUser(username)

  return (
    <div>
      {
        {
          loading: <p>Fetching user data for {username}</p>,
          done: <p>{user && user.name} stats placeholder.</p>,
          error: <p>Could not get stats for {username}</p>,
        }[status]
      }
    </div>
  )
}

export default GitHubStats
