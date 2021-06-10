import fetch from "node-fetch"
import { Handler } from "@netlify/functions"

const handler: Handler = async (event) => {
  const { username } = event.queryStringParameters

  try {
    const repos = await fetch(
      `https://api.github.com/users/${username}/repos`,
      {
        headers: {
          Authorization: `token ${process.env.GH_TOKEN}`
        }
      }
    )

    const data = await repos.json()

    if (!repos.ok) {
      throw new Error(`could not fetch repos of GitHub user: ${username}`)
    }

    return {
      headers: {
        "Cache-Control": "public, max-age=3600, s-maxage=3600",
        "Content-Type": "application/json; charset=utf-8"
      },
      statusCode: 200,
      body: JSON.stringify(data)
    }
  } catch (error) {
    return {
      headers: {
        "Content-Type": "application/json; charset=utf-8"
      },
      statusCode: error.statusCode || 500,
      body: JSON.stringify({
        error: error.message
      })
    }
  }
}

export { handler }
