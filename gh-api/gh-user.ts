import fetch from "node-fetch"
import { Handler } from "@netlify/functions"

const handler: Handler = async (event) => {
  const { username } = event.queryStringParameters

  try {
    const user = await fetch(`https://api.github.com/users/${username}`, {
      headers: {
        Authorization: `token ${process.env.GH_TOKEN}`
      }
    })

    const data = await user.json()

    if (!user.ok) {
      throw new Error(`could not fetch data of GitHub user: ${username}`)
    }

    return {
      headers: {
        "Content-Type": "application/json; charset=utf-8"
      },
      statusCode: 200,
      body: JSON.stringify(data)
    }
  } catch (error) {
    return {
      statusCode: error.statusCode || 500,
      headers: {
        "Content-Type": "application/json; charset=utf-8"
      },
      body: JSON.stringify({
        error: error.message
      })
    }
  }
}

export { handler }
