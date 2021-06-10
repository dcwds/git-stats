import { useContext, FC } from "react"
import { Context } from "../context"
import { FetchedRepo } from "../../interfaces"
import { sortByNumbersDesc, getRoundedPercentages } from "../../../common/fns"
import * as R from "ramda"

const Repo: FC<Partial<FetchedRepo> & { percentage: number }> = ({
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
const Repos = () => {
  const { filteredRepos } = useContext(Context)

  // it's important that we sort repos to match the sort order
  // of percentages.
  const reposByActivityAsc = R.compose(
    R.filter((r: FetchedRepo) => !!r.commits.length),
    R.sort(
      (a: FetchedRepo, b: FetchedRepo) => b.commits.length - a.commits.length
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
          <Repo key={idx} percentage={activityPercentages[idx]} {...r} />
        ),
        R.map((r) => R.omit(["commits"], r), reposByActivityAsc)
      )}
    </div>
  )
}

export default Repos
