import { rest } from "msw"
import ghResponses from "./gh-user/mock-responses"

const handlers = [
  rest.get("/gh-api/gh-user", (req, res, ctx) => {
    const username = req.url.searchParams.get("username")

    if (username === "invalid-user")
      return res(ctx.status(404), ctx.json({ message: "Not found" }))
    if (username === "network-error") return res.networkError("network error")

    return res(ctx.status(200), ctx.json(ghResponses.user))
  }),
  rest.get("/gh-api/gh-user-repos", (req, res, ctx) => {
    const username = req.url.searchParams.get("username")

    if (username === "valid-user-with-no-activity")
      return res(ctx.status(200), ctx.json([]))
    return res(ctx.status(200), ctx.json(ghResponses.userRepos))
  }),
  rest.get("/gh-api/gh-user-repo-commits", (req, res, ctx) => {
    const username = req.url.searchParams.get("username")

    if (username === "valid-user-with-no-activity")
      return res(ctx.status(200), ctx.json([]))
    return res(ctx.status(200), ctx.json(ghResponses.repoCommits))
  })
]

export default handlers
