import { rest } from "msw"
import gitHubResponses from "./mock-data/responses"

const handlers = [
  rest.get("https://api.github.com/users/:user", (req, res, ctx) => {
    const { user } = req.params

    if (user === "invalid-user")
      return res(ctx.status(500), ctx.json({ error: "user does not exist" }))
    return res(ctx.status(200), ctx.json(gitHubResponses.user))
  }),
  rest.get("https://api.github.com/users/:user/repos", (_, res, ctx) =>
    res(ctx.status(200), ctx.json(gitHubResponses.userRepos))
  ),
  rest.get("https://api.github.com/repos/:user/:repo/commits", (_, res, ctx) =>
    res(ctx.status(200), ctx.json(gitHubResponses.repoCommits))
  ),
]

export default handlers
