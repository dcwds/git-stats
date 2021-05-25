import useGitHubUserSearch from "../../hooks/use-github-user-search"

const GitHubUserSearch = () => {
  const { gitHubUser, changeGitHubUser, searchGitHubUser } =
    useGitHubUserSearch()

  return (
    <div>
      <input
        aria-label="search github user"
        type="text"
        placeholder="Search for a GitHub user..."
        onChange={(e) => changeGitHubUser(e)}
        onKeyDown={(e) => searchGitHubUser(e)}
      />
      <button onClick={(e) => searchGitHubUser(e)} disabled={!gitHubUser}>
        Search
      </button>
    </div>
  )
}

export default GitHubUserSearch
