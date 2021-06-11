import { Provider } from "../context"
import Commits from "./commits"
import { MemoryRouter, Route } from "react-router-dom"
import { render, screen } from "@testing-library/react"

describe("Commits", () => {
  const setup = (route: string) =>
    render(
      <MemoryRouter initialEntries={[route]}>
        <Route path="/:username?">
          <Provider>
            <Commits />
          </Provider>
        </Route>
      </MemoryRouter>
    )

  test("does not render commits graph for valid user with no commits", async () => {
    setup("/valid-user-with-no-activity")

    const noCommits = await screen.findByText(/no commits/i)
    const graph = screen.queryByLabelText(/commit graph/i)

    expect(noCommits).toBeInTheDocument()
    expect(graph).not.toBeInTheDocument()
  })

  test("renders commits graph for valid user", async () => {
    setup("/valid-user")

    const commitCount = await screen.findByLabelText(/commit count/i)
    const graph = await screen.findByLabelText(/commit graph/i)

    expect(commitCount).toMatchSnapshot()
    expect(graph).toMatchSnapshot()
  })
})
