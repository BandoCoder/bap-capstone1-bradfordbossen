import React from "react";
import { Link, withRouter } from "react-router-dom";
import "./Nav.css";
import TokenService from "../services/token-service";
import IdleService from "../services/idle-service";

class Nav extends React.Component {
  logout = () => {
    TokenService.clearAuthToken();
    /* when logging out, clear the callbacks to the refresh api and idle auto logout */
    TokenService.clearCallbackBeforeExpiry();
    IdleService.unRegisterIdleResets();
    this.props.history.push("/");
  };
  render() {
    return (
      <nav className="nav">
        {TokenService.hasAuthToken() ? (
          <div className="nav-main">
            <Link
              className="nav-link-button"
              to={`/${this.context.user_name}/patterns`}
            >
              Dashboard
            </Link>
            <Link
              className="nav-link-button"
              to="/"
              onClick={() => this.logout()}
            >
              Logout
            </Link>
          </div>
        ) : (
          <div className="nav-main">
            <Link className="nav-link-button" to="/signup">
              Signup
            </Link>
            <Link className="nav-link-button" to="/login">
              Login
            </Link>
          </div>
        )}
        <h1>
          <Link className="home-link" to="/">
            BAP
          </Link>
        </h1>
        <Link className="nav-link-button" to="/sequencer">
          New Pattern
        </Link>
      </nav>
    );
  }
}

export default withRouter(Nav);
