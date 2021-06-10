import { BrowserRouter as Router, Switch, Route } from "react-router-dom"
import * as GHUser from "../../../gh-user/components"

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
          <GHUser.Search />
          <GHUser.Provider>
            <>
              <GHUser.Profile />
              <GHUser.Commits />
              <GHUser.Repos />
            </>
          </GHUser.Provider>
        </Route>
      </Switch>
    </main>
  </Router>
)

export default App
