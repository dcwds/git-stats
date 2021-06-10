import { User, Repo, Commit } from "../interfaces"
import userResponse from "./gh-user.json"
import userReposResponse from "./gh-user-repos.json"
import repoCommitsResponse from "./gh-repo-commits.json"
import recentCommitsResponse from "./gh-recent-commits.json"

const responses = {
  user: userResponse as User,
  userRepos: userReposResponse as Repo[],
  repoCommits: repoCommitsResponse as Commit[],
  recentCommits: recentCommitsResponse as Commit[]
}

export default responses
