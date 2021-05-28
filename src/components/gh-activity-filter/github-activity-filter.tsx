import React from "react"

const GHActivityFilter = () => (
  <div>
    <label className="text-gray-200 mr-2" htmlFor="activity-select">
      Show activity for the past
    </label>
    <select className="text-gray-600" id="activity-select">
      <option value="30">month</option>
      <option value="90">3 months</option>
      <option value="180">6 months</option>
      <option value="365">year</option>
    </select>
  </div>
)

export default GHActivityFilter
