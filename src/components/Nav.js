import React from "react";
import { Link } from "react-router-dom";
import "./Nav.css";

export default class Nav extends React.Component {
  render() {
    return (
      <nav className="nav">
        <h1>
          <Link to="/">BAP</Link>
        </h1>
        <div className="nav-main">
          <Link to="/signup">Signup</Link>
          <Link to="/login">Login</Link>
        </div>
        <Link to="/sequencer">New</Link>
        <div className="nav-authed">
          <Link to={`/${this.context.user_name}/patterns`}>Patterns</Link>
          <Link to="/">Logout</Link>
        </div>
      </nav>
    );
  }
}
