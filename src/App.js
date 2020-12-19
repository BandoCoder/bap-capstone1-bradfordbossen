import React from "react";
import { Route, Switch } from "react-router-dom";
import PrivateRoute from "./custom-routers/PrivateRoute";
import PublicRoute from "./custom-routers/PublicRoute";
import Nav from "./components/Nav";
import Login from "./routes/Login";
import Signup from "./routes/Signup";
import Dashboard from "./routes/Dashboard";
import Sequencer from "./routes/Sequencer";

import Landing from "./routes/Landing";

import "./App.css";

class App extends React.Component {
  render() {
    return (
      <>
        <header>
          <Nav />
        </header>
        <div className="App">
          <Switch>
            <Route exact path={"/"} component={Landing} />
            <PublicRoute exact path={"/login"} component={Login} />
            <PublicRoute exact path={"/signup"} component={Signup} />
            <PrivateRoute
              exact
              path={"/:user_name/patterns"}
              component={Dashboard}
            />
            <PrivateRoute
              exact
              path={"/:user_name/patterns/:pattern_id"}
              component={Sequencer}
            />
            <Route path={"/sequencer"} component={Sequencer} />
          </Switch>
        </div>
      </>
    );
  }
}

export default App;
