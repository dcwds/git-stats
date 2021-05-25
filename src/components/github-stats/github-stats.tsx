import useGitHubUser from "../../hooks/use-github-user"
import { useParams } from "react-router-dom"

const GitHubStats = () => {
  const { user } = useParams<{ user: string }>()
  const { gitHubUser, status } = useGitHubUser(user)

  return (
    <div>
      {
        {
          loading: <p>Fetching user data for {user}</p>,
          done: <p>{gitHubUser && gitHubUser.name} stats placeholder.</p>,
        }[status]
      }
    </div>
  )
}

export default GitHubStats
