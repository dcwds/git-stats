import { GitHubUser, GitHubRepo, GitHubCommit } from "../../interfaces"
import gitHubUserResponse from "./github-user.json"
import gitHubUserReposReponse from "./github-user-repos.json"
import gitHubRepoCommitsResponse from "./github-repo-commits.json"

const gitHubResponses = {
  user: gitHubUserResponse as GitHubUser,
  userRepos: gitHubUserReposReponse as GitHubRepo[],
  repoCommits: gitHubRepoCommitsResponse as GitHubCommit[],
}

export default gitHubResponses
