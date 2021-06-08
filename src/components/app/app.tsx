import { BrowserRouter as Router, Switch, Route } from "react-router-dom"
import GHUserSearch from "../gh-user-search"
import * as GH from "../gh-stats"

const App = () => (
  <Router>
    <main className="flex flex-col justify-center max-w-xl p-4 mx-auto">
      <div className="py-6">
        <header>
          <p className="font-semibold">GitHub Stats</p>
        </header>
      </div>
      <GHUserSearch />
      <Switch>
        <Route path="/stats/:username">
          <GH.StatsProvider>
            <>
              <GH.UserProfile />
              <GH.UserCommits />
              <GH.UserRepos />
            </>
          </GH.StatsProvider>
        </Route>
        <Route path="/">
          <p>Home placeholder.</p>
        </Route>
      </Switch>
    </main>
  </Router>
)

export default App
