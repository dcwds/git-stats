import { GraphMonth } from "../../interfaces"
import { useContext } from "react"
import { Context } from "../context"
import { withoutEdgeMonth } from "../../fns"
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
    className="has-tooltip"
    style={{ backgroundColor: getCommitCountColor(commitCount) }}
  >
    <div className="tooltip bg-black p-2 rounded shadow text-xs">
      <p>
        <strong className="text-white">
          {!!commitCount ? commitCount : "No"} commit
          {commitCount !== 1 ? "s" : ""}
        </strong>{" "}
        on {R.replace(/(\s\d{4})/i, ", $1", date.toDateString())}
      </p>

      <div className="arrow-down"></div>
    </div>
  </div>
)

const Commits = () => {
  const {
    filteredCommits: commits,
    commitDates,
    monthMarkers
  } = useContext(Context)

  return (
    <div className="card">
      <h3>Commits</h3>
      <p aria-label="commit count">
        They have made {!!commits.length ? commits.length : "no"} commit
        {commits.length !== 1 ? "s" : ""}.
      </p>

      {!!commits.length && !!commitDates && !!monthMarkers && (
        <div className="mt-4" aria-label="commit graph">
          <div
            className="graph-months"
            style={{
              gridTemplateColumns: `2.3em repeat(${Math.ceil(
                commitDates.length / 7
              )}, 1fr)`
            }}
          >
            {
              // this div is required as an offset, as weekdays sit in this
              // position later in the graph
            }
            <div></div>

            {R.addIndex<GraphMonth>(R.map)(
              ({ month, start, end }, idx) => (
                // add 2 to start and end because:
                // - weekdays offset column (empty div)
                // - graph months use a starting index of 0
                <div
                  key={idx}
                  style={{ gridColumn: `${start + 2} / ${end + 2}` }}
                >
                  {month}
                </div>
              ),
              withoutEdgeMonth(Math.ceil(commitDates.length / 7), monthMarkers)
            )}
          </div>

          <div className="graph-content">
            <div className="graph-days">
              <div></div>
              <div>mon</div>
              <div></div>
              <div>wed</div>
              <div></div>
              <div>fri</div>
              <div></div>
            </div>

            <div arial-label="graph dates" className="graph-dates">
              {R.map(
                (d) => (
                  <Cell key={d.date.toDateString()} {...d} />
                ),
                commitDates
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Commits
