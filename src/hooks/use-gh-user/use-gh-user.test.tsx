import { renderHook } from "@testing-library/react-hooks"
import useGHUser from "./use-gh-user"
import { getCommitsByDayCount, getCommitsByUserId } from "../../fns"
import ghResponses from "../../mock-data/responses"
import { DAY_COUNT } from "../../constants"
import * as R from "ramda"

describe("useGHUser", () => {
  test("updates state when fetching valid github user", async () => {
    const { result, waitForNextUpdate } = renderHook(() =>
      useGHUser("valid-user")
    )

    expect(result.current.user).toEqual(null)
    expect(result.current.filteredRepos).toEqual([])
    expect(result.current.filteredCommits).toEqual([])
    expect(result.current.status).toBe("loading")

    await waitForNextUpdate()

    expect(result.current.user).toEqual(ghResponses.user)
    expect(result.current.filteredRepos).toEqual(
      R.map(
        ({ name, description, html_url }) => ({
          name,
          description,
          url: html_url,
          commits: getCommitsByDayCount(
            new Date(),
            DAY_COUNT,
            getCommitsByUserId(ghResponses.user.id, ghResponses.repoCommits)
          )
        }),
        ghResponses.userRepos
      )
    )
    expect(result.current.filteredCommits).toEqual(
      getCommitsByUserId(
        ghResponses.user.id,
        ghResponses.userRepos.map(() => ghResponses.repoCommits).flat()
      )
    )
    expect(result.current.status).toBe("done")
  })

  test("sets error status when fetching invalid github user", async () => {
    const { result, waitForNextUpdate } = renderHook(() =>
      useGHUser("invalid-user")
    )

    expect(result.current.user).toEqual(null)
    expect(result.current.filteredRepos).toEqual([])
    expect(result.current.filteredCommits).toEqual([])
    expect(result.current.status).toBe("loading")

    await waitForNextUpdate()

    expect(result.current.user).toEqual(null)
    expect(result.current.filteredRepos).toEqual([])
    expect(result.current.filteredCommits).toEqual([])
    expect(result.current.status).toBe("error")
  })

  test("sets error status after bad request", async () => {
    const { result, waitForNextUpdate } = renderHook(() =>
      useGHUser("network-error")
    )

    expect(result.current.user).toEqual(null)
    expect(result.current.filteredRepos).toEqual([])
    expect(result.current.filteredCommits).toEqual([])
    expect(result.current.status).toBe("loading")

    await waitForNextUpdate()

    expect(result.current.user).toEqual(null)
    expect(result.current.filteredRepos).toEqual([])
    expect(result.current.filteredCommits).toEqual([])
    expect(result.current.status).toBe("error")
  })
})
