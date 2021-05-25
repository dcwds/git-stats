import GitHubUserSearch from "./github-user-search"
import { MemoryRouter, Route, Switch } from "react-router-dom"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"

describe("GitHubUserSearch", () => {
  const setup = () =>
    render(
      <MemoryRouter>
        <GitHubUserSearch />
        <Switch>
          <Route path="/stats/:user">
            <p>stats blurb</p>
          </Route>
        </Switch>
      </MemoryRouter>
    )

  test("stats are rendered when input value is submitted via click", () => {
    setup()

    const input = screen.getByLabelText(/search github user/i)
    const button = screen.getByRole("button", { name: /search/i })
    let statsBlurb = screen.queryByText(/stats blurb/i)

    expect(button).toHaveAttribute("disabled")

    userEvent.type(input, "valid-user")
    expect(button).not.toHaveAttribute("disabled")
    expect(statsBlurb).not.toBeInTheDocument()

    userEvent.click(button)
    statsBlurb = screen.queryByText(/stats blurb/i)
    expect(statsBlurb).toBeInTheDocument()
  })

  test("stats are rendered when input value is submitted via enter key", () => {
    setup()

    const input = screen.getByLabelText(/search github user/i)
    const button = screen.getByRole("button", { name: /search/i })
    let statsBlurb = screen.queryByText(/stats blurb/i)

    expect(button).toHaveAttribute("disabled")

    userEvent.type(input, "valid-user")
    expect(button).not.toHaveAttribute("disabled")
    expect(statsBlurb).not.toBeInTheDocument()

    userEvent.type(input, "{enter}")

    statsBlurb = screen.queryByText(/stats blurb/i)
    expect(statsBlurb).toBeInTheDocument()
  })
})
