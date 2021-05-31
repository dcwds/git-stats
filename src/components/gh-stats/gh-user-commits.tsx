import { useContext } from "react"
import { StatsContext } from "./gh-stats-context"

const getCommitCountColor = (count: number): string => {
  if (count === 0) return "#161b22"
  if (count < 3) return "#0e4429"
  if (count < 5) return "#006d32"
  if (count < 10) return "#26a641"
  else return "#39d353"
}

const UserCommits = () => {
  const { filteredCommits: commits, datesWithCommitCounts } =
    useContext(StatsContext)

  return (
    <div className="p-4">
      <h3>Commits</h3>
      <p>
        They have made {!!commits.length ? commits.length : "no"} commit
        {commits.length !== 1 ? "s" : ""}.
      </p>

      <div className="commits-graph pt-4" arial-label="commits graph">
        {datesWithCommitCounts.map((d) => (
          <div
            key={d.date.toDateString()}
            style={{ backgroundColor: getCommitCountColor(d.commitCount) }}
          ></div>
        ))}
      </div>
    </div>
  )
}

export default UserCommits
