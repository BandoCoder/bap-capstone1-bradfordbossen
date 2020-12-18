import React from "react";
import { Route, Switch } from "react-router-dom";
import Nav from "./components/Nav";
import Login from "./routes/Login";
import Signup from "./routes/Signup";
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
            <Route exact path={"/login"} component={Login} />
            <Route exact path={"/signup"} component={Signup} />

            <Route path={"/sequencer"} component={Sequencer} />
          </Switch>
        </div>
      </>
    );
  }
}

export default App;
