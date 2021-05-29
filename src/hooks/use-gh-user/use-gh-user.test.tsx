import { renderHook } from "@testing-library/react-hooks"
import useGHUser from "./use-gh-user"
import { getCommitsByUserId } from "../../fns"
import ghResponses from "../../mock-data/responses"

describe("useGHUser", () => {
  test("updates state when fetching valid github user", async () => {
    const { result, waitForNextUpdate } = renderHook(() =>
      useGHUser("valid-user", 30)
    )

    expect(result.current.user).toEqual({})
    expect(result.current.repos).toEqual([])
    expect(result.current.commits).toEqual([])
    expect(result.current.status).toBe("loading")

    await waitForNextUpdate()

    expect(result.current.user).toEqual(ghResponses.user)
    expect(result.current.repos).toEqual(ghResponses.userRepos)
    expect(result.current.commits).toEqual(
      getCommitsByUserId(
        ghResponses.user.id,
        ghResponses.userRepos.map(() => ghResponses.repoCommits).flat()
      )
    )
    expect(result.current.status).toBe("done")
  })

  test("sets error status when fetching invalid github user", async () => {
    const { result, waitForNextUpdate } = renderHook(() =>
      useGHUser("invalid-user", 30)
    )

    expect(result.current.user).toEqual({})
    expect(result.current.repos).toEqual([])
    expect(result.current.commits).toEqual([])
    expect(result.current.status).toBe("loading")

    await waitForNextUpdate()

    expect(result.current.user).toEqual({})
    expect(result.current.repos).toEqual([])
    expect(result.current.commits).toEqual([])
    expect(result.current.status).toBe("error")
  })

  test("sets error status after bad request", async () => {
    const { result, waitForNextUpdate } = renderHook(() =>
      useGHUser("network-error", 30)
    )

    expect(result.current.user).toEqual({})
    expect(result.current.repos).toEqual([])
    expect(result.current.commits).toEqual([])
    expect(result.current.status).toBe("loading")

    await waitForNextUpdate()

    expect(result.current.user).toEqual({})
    expect(result.current.repos).toEqual([])
    expect(result.current.commits).toEqual([])
    expect(result.current.status).toBe("error")
  })
})
