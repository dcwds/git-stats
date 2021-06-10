import { Provider } from ".."
import GHUserSearch from "./search"
import { MemoryRouter, Route, Switch } from "react-router-dom"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"

describe("GHUserSearch", () => {
  const setup = () =>
    render(
      <MemoryRouter>
        <Switch>
          <Route path="/:username?">
            <GHUserSearch />
            <Provider>
              <p>stats blurb</p>
            </Provider>
          </Route>
        </Switch>
      </MemoryRouter>
    )

  test("stats are rendered when input value is submitted via click", async () => {
    setup()

    const input = screen.getByLabelText(/search github user/i)
    const button = screen.getByRole("button", { name: /search/i })
    let statsBlurb = screen.queryByText(/stats blurb/i)

    expect(button).toHaveAttribute("disabled")

    userEvent.type(input, "valid-user")
    expect(button).not.toHaveAttribute("disabled")
    expect(statsBlurb).not.toBeInTheDocument()

    userEvent.click(button)
    statsBlurb = await screen.findByText(/stats blurb/i)
    expect(statsBlurb).toBeInTheDocument()
  })

  test("stats are rendered when input value is submitted via enter key", async () => {
    setup()

    const input = screen.getByLabelText(/search github user/i)
    const button = screen.getByRole("button", { name: /search/i })
    let statsBlurb = screen.queryByText(/stats blurb/i)

    expect(button).toHaveAttribute("disabled")

    userEvent.type(input, "valid-user")
    expect(button).not.toHaveAttribute("disabled")
    expect(statsBlurb).not.toBeInTheDocument()

    userEvent.type(input, "{enter}")

    statsBlurb = await screen.findByText(/stats blurb/i)
    expect(statsBlurb).toBeInTheDocument()
  })
})
