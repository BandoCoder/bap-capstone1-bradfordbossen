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
          <>
            <div className="left">
              <Link
                className="nav-link-button signup-link"
                to={`/${this.context.user_name}/patterns`}
              >
                Dashboard
              </Link>
              <Link
                className="nav-link-button login-link"
                to="/"
                onClick={() => this.logout()}
              >
                Logout
              </Link>
            </div>
            <div className="right">
              <Link className="nav-link-button new-link" to="/sequencer">
                New
              </Link>
            </div>
          </>
        ) : (
          <>
            <div className="left">
              <Link className="nav-link-button signup-link" to="/signup">
                Signup
              </Link>
              <Link className="nav-link-button login-link" to="/login">
                Login
              </Link>
            </div>
            <div className="right">
              <Link className="nav-link-button new-link" to="/sequencer">
                New
              </Link>
            </div>
          </>
        )}
      </nav>
    );
  }
}

export default withRouter(Nav);
