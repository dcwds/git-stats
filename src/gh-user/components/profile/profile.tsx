import { useContext } from "react"
import { Context } from "../context"

const Profile = () => {
  const { user } = useContext(Context)
  return (
    <div className="card">
      <div className="flex items-center">
        <img
          className="rounded-full mr-6"
          alt="GitHub Avatar"
          src={user?.avatar_url}
          width="80"
        />
        <div>
          <h2 className="text-lg font-semibold">{user?.name}</h2>
          <p className="text-gray-300 mb-2">{user?.login}</p>
          <p className="text-gray-300 text-sm">{user?.bio}</p>
        </div>
      </div>
    </div>
  )
}

export default Profile
