import { renderHook } from "@testing-library/react-hooks"
import useGitHubUser from "./use-github-user"
import gitHubResponses from "../../mock-data/responses"

describe("useGitHubUser", () => {
  test("updates state when fetching valid github user", async () => {
    const { result, waitForNextUpdate } = renderHook(() =>
      useGitHubUser("valid-user")
    )

    expect(result.current.gitHubUser).toBeNull()
    expect(result.current.status).toBe("loading")

    await waitForNextUpdate()

    expect(result.current.gitHubUser).toEqual(gitHubResponses.user)
    expect(result.current.status).toBe("done")
  })

  test("sets error status when fetching invalid github user", async () => {
    const { result, waitForNextUpdate } = renderHook(() =>
      useGitHubUser("invalid-user")
    )

    expect(result.current.gitHubUser).toBeNull()
    expect(result.current.status).toBe("loading")

    await waitForNextUpdate()

    expect(result.current.gitHubUser).toBeNull()
    expect(result.current.status).toBe("error")
  })

  test("sets error status after bad request", async () => {
    const { result, waitForNextUpdate } = renderHook(() =>
      useGitHubUser("network-error")
    )

    expect(result.current.gitHubUser).toBeNull()
    expect(result.current.status).toBe("loading")

    await waitForNextUpdate()

    expect(result.current.gitHubUser).toBeNull()
    expect(result.current.status).toBe("error")
  })
})
