import React from "react";
import TokenService from "../services/token-service";
import AuthApiService from "../services/auth-api-service";
import AuthContext from "../contexts/AuthContext";
import "./Login.css";

export default class Login extends React.Component {
  static contextType = AuthContext;

  state = { error: null };

  handleLoginSuccess = (username) => {
    const { location, history } = this.props;
    const destination = (location.state || {}).from || "/";
    if (destination === "/") {
      history.push(`/${username}/patterns`);
    } else {
      history.push(destination);
    }
  };

  handleSubmit = (e) => {
    e.preventDefault();
    this.setState({ error: null });
    const { user_name, password } = e.target;

    AuthApiService.postLogin({
      user_name: user_name.value,
      password: password.value,
    })
      .then((res) => {
        user_name.value = "";
        password.value = "";

        TokenService.saveAuthToken(res.authToken);
        const base64Url = res.authToken.split(".")[1];
        const decodedValue = JSON.parse(window.atob(base64Url));
        this.context.setUserName(decodedValue.sub);
        this.context.setUserId(decodedValue.user_id);
        this.context.setUser(decodedValue.sub, decodedValue.user_id);
        this.handleLoginSuccess();
      })
      .catch((res) => {
        this.setState({ error: res.error });
      });
  };

  render() {
    const { error } = this.state;
    return (
      <form className="login-form" onSubmit={this.handleSubmit}>
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
          <div role="alert">
            {error && <p className="error-msg">{error}</p>}
          </div>
          <button className="signup-button" type="submit">
            Submit
          </button>
        </fieldset>
      </form>
    );
  }
}
