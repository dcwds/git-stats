import { useContext } from "react"
import { StatsContext } from "./gh-stats-context"
import * as R from "ramda"

const getCommitCountColor = (count: number): string => {
  if (count === 0) return "#161b22"
  if (count < 3) return "#0e4429"
  if (count < 5) return "#006d32"
  if (count < 10) return "#26a641"
  else return "#39d353"
}

const Cell = ({ date, commitCount }: { date: Date; commitCount: number }) => (
  <div
    className="has-tooltip cursor-pointer"
    style={{ backgroundColor: getCommitCountColor(commitCount) }}
  >
    <div className="tooltip bg-black p-2 rounded shadow text-xs">
      <p>
        <strong className="text-white">
          {!!commitCount ? commitCount : "No"} commit
          {commitCount !== 1 ? "s" : ""}
        </strong>{" "}
        on {date.toDateString()}
      </p>

      <div className="arrow-down"></div>
    </div>
  </div>
)

const UserCommits = () => {
  const {
    filteredCommits: commits,
    commitDates,
    monthMarkers
  } = useContext(StatsContext)

  return (
    <div className="p-4">
      <h3>Commits</h3>
      <p>
        They have made {!!commits.length ? commits.length : "no"} commit
        {commits.length !== 1 ? "s" : ""}.
      </p>

      {!!commits.length && (
        <>
          <div
            className="grid pt-4 capitalize text-xs mb-2"
            style={{
              gridTemplateColumns: `repeat(${Math.floor(
                commitDates.length / 7
              )}, 1fr)`
            }}
          >
            {R.addIndex<{ month: string; weekCount: number }>(R.map)(
              ({ month, weekCount }, idx) => (
                <div key={idx} style={{ gridColumn: `1 / ${weekCount}` }}>
                  {month}
                </div>
              ),
              monthMarkers
            )}
          </div>

          <div arial-label="commits graph" className="commits-graph">
            {R.map(
              (d) => (
                <Cell key={d.date.toDateString()} {...d} />
              ),
              commitDates
            )}
          </div>
        </>
      )}
    </div>
  )
}

export default UserCommits
