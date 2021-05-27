import useGitHubUserSearch from "../../hooks/use-github-user-search"

const GitHubUserSearch = () => {
  const { gitHubUser, changeGitHubUser, searchGitHubUser } =
    useGitHubUserSearch()

  return (
    <div className="flex flex-row py-6 mb-6">
      <input
        className="flex-grow mr-8 py-2 px-4 rounded-md bg-gray-900"
        aria-label="search github user"
        type="text"
        placeholder="Search for a GitHub user..."
        onChange={(e) => changeGitHubUser(e)}
        onKeyDown={(e) => searchGitHubUser(e)}
      />
      <button
        className="bg-blue-600 px-4 font-semibold rounded-md"
        onClick={(e) => searchGitHubUser(e)}
        disabled={!gitHubUser}
      >
        Search
      </button>
    </div>
  )
}

export default GitHubUserSearch
