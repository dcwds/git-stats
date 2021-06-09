import { BrowserRouter as Router, Switch, Route } from "react-router-dom"
import * as GH from "../gh"

const App = () => (
  <Router>
    <main className="flex flex-col justify-center max-w-xl p-4 mx-auto">
      <div className="py-6">
        <header>
          <p className="font-semibold">GitHub Stats</p>
        </header>
      </div>

      <Switch>
        <Route path="/:username?">
          <GH.UserSearch />
          <GH.StatsProvider>
            <>
              <GH.UserProfile />
              <GH.UserCommits />
              <GH.UserRepos />
            </>
          </GH.StatsProvider>
        </Route>
      </Switch>
    </main>
  </Router>
)

export default App
