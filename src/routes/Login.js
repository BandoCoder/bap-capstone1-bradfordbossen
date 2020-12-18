import React from "react";
import "./Login.css";

export default class Login extends React.Component {
  static defaultProps = {
    onLoginSuccess: () => {},
  };

  render() {
    return (
      <form className="login-form">
        <fieldset>
          <h2>Login</h2>
          <label className="loginNameLable" htmlFor="loginName">
            Username
          </label>
          <input
            type="text"
            name="user_name"
            id="loginInputName"
            placeholder="username"
            required
          />
          <label className="loginPassLable" htmlFor="loginPass">
            Password
          </label>
          <input
            type="password"
            name="password"
            id="loginPass"
            placeholder="password"
            required
          />
        </fieldset>
      </form>
    );
  }
}
