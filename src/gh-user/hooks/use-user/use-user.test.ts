import { renderHook } from "@testing-library/react-hooks"
import useUser from "./"
import responses from "../../mock-responses"
import { DAY_COUNT } from "../../../constants"
import * as fns from "../../fns"
import * as R from "ramda"

describe("useUser", () => {
  test("updates state when fetching valid github user", async () => {
    const { result, waitForNextUpdate } = renderHook(() =>
      useUser("valid-user")
    )

    expect(result.current.user).toEqual(null)
    expect(result.current.filteredRepos).toEqual([])
    expect(result.current.filteredCommits).toEqual([])
    expect(result.current.status).toBe("loading")

    await waitForNextUpdate()

    expect(result.current.user).toEqual(responses.user)
    expect(result.current.filteredRepos).toEqual(
      R.map(
        ({ name, description, html_url }) => ({
          name,
          description,
          url: html_url,
          commits: fns.getCommitsByDayCount(
            new Date(),
            DAY_COUNT,
            fns.getCommitsByUserId(responses.user.id, responses.repoCommits)
          )
        }),
        responses.userRepos
      )
    )
    expect(result.current.filteredCommits).toEqual(
      fns.getCommitsByUserId(
        responses.user.id,
        responses.userRepos.map(() => responses.repoCommits).flat()
      )
    )
    expect(result.current.status).toBe("done")
  })

  test("sets error status when fetching invalid github user", async () => {
    const { result, waitForNextUpdate } = renderHook(() =>
      useUser("invalid-user")
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
      useUser("network-error")
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
