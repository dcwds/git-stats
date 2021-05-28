import { GitHubUser, GitHubRepo, GitHubCommit } from "../../interfaces"
import ghUserResponse from "./gh-user.json"
import ghUserReposReponse from "./gh-user-repos.json"
import ghRepoCommitsResponse from "./gh-repo-commits.json"
import ghRecentCommitsResponse from "./gh-recent-commits.json"

const ghResponses = {
  user: ghUserResponse as GitHubUser,
  userRepos: ghUserReposReponse as GitHubRepo[],
  repoCommits: ghRepoCommitsResponse as GitHubCommit[],
  recentCommits: ghRecentCommitsResponse as GitHubCommit[],
}

export default ghResponses
