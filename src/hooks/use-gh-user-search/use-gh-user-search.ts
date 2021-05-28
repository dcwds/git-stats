import { useState, ChangeEvent, KeyboardEvent, MouseEvent } from "react"
import { useHistory } from "react-router-dom"

const useGHUserSearch = () => {
  const history = useHistory()
  const [user, setUser] = useState("")

  const changeUser = (e: ChangeEvent<HTMLInputElement>) =>
    setUser(e.target.value)

  const searchUser = (
    e: KeyboardEvent<HTMLInputElement> | MouseEvent<HTMLButtonElement>
  ) => {
    if ((("key" in e && e.key === "Enter") || e.type === "click") && user)
      history.push(`/stats/${user}`)
  }

  return { user, changeUser, searchUser }
}

export default useGHUserSearch
