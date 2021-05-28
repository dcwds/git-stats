import { useContext } from "react"
import { StatsContext } from "./gh-stats-context"

const ActivityFilter = () => {
  const { setDayRange } = useContext(StatsContext)

  return (
    <div className="text-xs font-medium p-4 border-b-2 border-gray-800">
      <label className="text-gray-300 mr-2" htmlFor="activity-select">
        Show activity for the past
      </label>
      <select
        className="text-gray-600"
        id="activity-select"
        onChange={(e) => setDayRange(Number(e.target.value))}
      >
        <option value="30">month</option>
        <option value="90">3 months</option>
        <option value="180">6 months</option>
        <option value="365">year</option>
      </select>
    </div>
  )
}

export default ActivityFilter
