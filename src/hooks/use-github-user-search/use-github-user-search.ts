import { useState, ChangeEvent, KeyboardEvent, MouseEvent } from "react"
import { useHistory } from "react-router-dom"

const useGitHubUserSearch = () => {
  const history = useHistory()
  const [gitHubUser, setGitHubUser] = useState("")

  const changeGitHubUser = (e: ChangeEvent<HTMLInputElement>) =>
    setGitHubUser(e.target.value)

  const searchGitHubUser = (
    e: KeyboardEvent<HTMLInputElement> | MouseEvent<HTMLButtonElement>
  ) => {
    if ((("key" in e && e.key === "Enter") || e.type === "click") && gitHubUser)
      history.push(`/stats/${gitHubUser}`)
  }

  return { gitHubUser, changeGitHubUser, searchGitHubUser }
}

export default useGitHubUserSearch
