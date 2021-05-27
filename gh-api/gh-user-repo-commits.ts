import fetch from "node-fetch"
import { Handler } from "@netlify/functions"

const handler: Handler = async (event) => {
  const { username, repo } = event.queryStringParameters

  try {
    const commits = await fetch(
      `https://api.github.com/repos/${username}/${repo}/commits`,
      {
        headers: {
          Authorization: `token ${process.env.GH_TOKEN}`,
        },
      }
    )

    const data = await commits.json()

    if (!commits.ok) {
      throw new Error(`could not fetch commits of GitHub repo: ${repo}`)
    }

    return {
      headers: {
        "Cache-Control": "public, max-age=3600, s-maxage=3600",
        "Content-Type": "application/json; charset=utf-8",
      },
      statusCode: 200,
      body: JSON.stringify(data),
    }
  } catch (error) {
    return {
      headers: {
        "Content-Type": "application/json; charset=utf-8",
      },
      statusCode: error.statusCode || 500,
      body: JSON.stringify({
        error: error.message,
      }),
    }
  }
}

export { handler }
