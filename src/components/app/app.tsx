import { BrowserRouter as Router, Switch, Route } from "react-router-dom"
import GitHubUserSearch from "../github-user-search"
import GitHubStats from "../github-stats"

const App = () => (
  <Router>
    <div>
      <header>GitHub Stats</header>
    </div>
    <GitHubUserSearch />
    <Switch>
      <Route path="/stats/:username">
        <GitHubStats />
      </Route>
      <Route path="/">
        <p>Home placeholder.</p>
      </Route>
    </Switch>
  </Router>
)

export default App
