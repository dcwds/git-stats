import { useContext, FC } from "react"
import { StatsContext } from "./gh-stats-context"
import { fetchedGitHubRepo } from "../../interfaces"
import { sortByNumbersDesc, getRoundedPercentages } from "../../fns"
import * as R from "ramda"

const UserRepo: FC<Partial<fetchedGitHubRepo> & { percentage: number }> = ({
  name,
  description,
  url,
  percentage
}) => (
  <div className="mb-4">
    <a href={url} className="block mb-1">
      <h4>{name}</h4>
    </a>
    <p className="text-xs overflow-ellipsis overflow-hidden whitespace-nowrap mb-1">
      {description}
    </p>

    <div className="percentage-bar">
      <div className="container">
        <div className="indicator" style={{ width: `${percentage}%` }}></div>
      </div>
      <div className="text">{`${percentage}%`}</div>
    </div>
  </div>
)
const UserRepos = () => {
  const { filteredRepos } = useContext(StatsContext)

  // it's important that we sort repos to match the sort order
  // of percentages.
  const reposByActivityAsc = R.compose(
    R.filter((r: fetchedGitHubRepo) => !!r.commits.length),
    R.sort(
      (a: fetchedGitHubRepo, b: fetchedGitHubRepo) =>
        b.commits.length - a.commits.length
    )
  )(filteredRepos)

  const activityPercentages = sortByNumbersDesc(
    getRoundedPercentages(R.map((r) => r.commits.length, reposByActivityAsc))
  )

  return (
    <div className="card">
      <h3>Repos</h3>

      {R.addIndex(R.map)(
        (r, idx) => (
          <UserRepo key={idx} percentage={activityPercentages[idx]} {...r} />
        ),
        R.map((r) => R.omit(["commits"], r), reposByActivityAsc)
      )}
    </div>
  )
}

export default UserRepos
