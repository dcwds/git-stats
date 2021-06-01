import { useContext } from "react"
import { StatsContext } from "./gh-stats-context"

const getCommitCountColor = (count: number): string => {
  if (count === 0) return "#161b22"
  if (count < 3) return "#0e4429"
  if (count < 5) return "#006d32"
  if (count < 10) return "#26a641"
  else return "#39d353"
}

const Cell = ({ date, commitCount }: { date: Date; commitCount: number }) => (
  <div
    className={(!!commitCount ? "cursor-pointer " : "") + "has-tooltip"}
    style={{ backgroundColor: getCommitCountColor(commitCount) }}
  >
    {!!commitCount && (
      <div className="tooltip bg-black p-2 rounded shadow text-xs">
        <p>
          <strong className="text-white">
            {commitCount} commit{commitCount !== 1 ? "s" : ""}
          </strong>{" "}
          on {date.toDateString()}
        </p>

        <div className="arrow-down"></div>
      </div>
    )}
  </div>
)

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
          <Cell key={d.date.toDateString()} {...d} />
        ))}
      </div>
    </div>
  )
}

export default UserCommits
