import { useContext } from "react"
import { StatsContext } from "./gh-stats-context"

const UserCommits = () => {
  const { filteredCommits: commits } = useContext(StatsContext)

  return (
    <div className="p-4">
      <h3>Commits</h3>
      <p>They have made {commits?.length} commits.</p>
    </div>
  )
}

export default UserCommits
