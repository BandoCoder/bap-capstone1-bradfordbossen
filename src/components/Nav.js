import React from "react";
import { Link, withRouter } from "react-router-dom";
import "./Nav.css";
import TokenService from "../services/token-service";

class Nav extends React.Component {
  logout = () => {
    TokenService.clearAuthToken();
    this.props.history.push("/");
  };
  render() {
    return (
      <nav className="nav">
        <h1>
          <Link to="/">BAP</Link>
        </h1>

        {TokenService.hasAuthToken() ? (
          <div className="nav-main">
            <Link to={`/${this.context.user_name}/patterns`}>Dashboard</Link>
            <Link to="/" onClick={() => this.logout()}>
              Logout
            </Link>
          </div>
        ) : (
          <div className="nav-main">
            <Link to="/signup">Signup</Link>
            <Link to="/login">Login</Link>
          </div>
        )}
        <Link to="/sequencer">New</Link>
        <div className="nav-authed"></div>
      </nav>
    );
  }
}

export default withRouter(Nav);
