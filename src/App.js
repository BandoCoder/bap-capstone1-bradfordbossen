import React from "react";
import { Route, Switch, Link } from "react-router-dom";
import PrivateRoute from "./custom-routers/PrivateRoute";
import PublicRoute from "./custom-routers/PublicRoute";
import Nav from "./components/Nav";
import Login from "./routes/Login";
import Signup from "./routes/Signup";
import Dashboard from "./routes/Dashboard";
import Sequencer from "./routes/Sequencer";

import Landing from "./routes/Landing";
import TokenService from "./services/token-service";
import AuthApiService from "./services/auth-api-service";
import IdleService from "./services/idle-service";

import "./App.css";

class App extends React.Component {
  state = { hasError: false };

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidMount() {
    /*
      set the function (callback) to call when a user goes idle
      we'll set this to logout a user when they're idle
    */
    IdleService.setIdleCallback(this.logoutFromIdle);

    /* if a user is logged in */
    if (TokenService.hasAuthToken()) {
      /*
        tell the idle service to register event listeners
        the event listeners are fired when a user does something, e.g. move their mouse
        if the user doesn't trigger one of these event listeners,
          the idleCallback (logout) will be invoked
      */
      IdleService.regiserIdleTimerResets();

      /*
        Tell the token service to read the JWT, looking at the exp value
        and queue a timeout just before the token expires
      */
      TokenService.queueCallbackBeforeExpiry(() => {
        /* the timoue will call this callback just before the token expires */
        AuthApiService.postRefreshToken();
      });
    }
  }

  componentWillUnmount() {
    /*
      when the app unmounts,
      stop the event listeners that auto logout (clear the token from storage)
    */
    IdleService.unRegisterIdleResets();
    /*
      and remove the refresh endpoint request
    */
    TokenService.clearCallbackBeforeExpiry();
  }

  logoutFromIdle = () => {
    /* remove the token from localStorage */
    TokenService.clearAuthToken();
    /* remove any queued calls to the refresh endpoint */
    TokenService.clearCallbackBeforeExpiry();
    /* remove the timeouts that auto logout when idle */
    IdleService.unRegisterIdleResets();
    /*
      react won't know the token has been removed from local storage,
      so we need to tell React to rerender
    */
    this.forceUpdate();
  };

  render() {
    return (
      <>
        <header>
          <h1>
            <Link className="home-link" to="/">
              BAP
            </Link>
          </h1>
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
