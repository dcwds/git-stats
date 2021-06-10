import { useState, ChangeEvent, KeyboardEvent, MouseEvent } from "react"
import { useHistory, useParams } from "react-router-dom"

const useUserSearch = () => {
  const { username } = useParams<{ username: string }>()
  const history = useHistory()
  const [user, setUser] = useState(username ? username : "")

  const changeUser = (e: ChangeEvent<HTMLInputElement>) =>
    setUser(e.target.value)

  const searchUser = (
    e: KeyboardEvent<HTMLInputElement> | MouseEvent<HTMLButtonElement>
  ) => {
    if ((("key" in e && e.key === "Enter") || e.type === "click") && user)
      history.push(`/${user}`)
  }

  return { user, changeUser, searchUser }
}

export default useUserSearch
