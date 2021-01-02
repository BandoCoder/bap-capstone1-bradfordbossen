import React from "react";
import AuthApiService from "../services/auth-api-service";
import AuthContext from "../contexts/AuthContext";
import "./Login.css";

// ** LOGIN ROUTE FOR EXISTING USERS (PRIVATE ROUTE) **
export default class Login extends React.Component {
  static contextType = AuthContext;

  state = { error: null };

  // Push to patterns page on login success
  handleLoginSuccess = (username) => {
    const { location, history } = this.props;
    const destination = (location.state || {}).from || "/";
    if (destination === "/") {
      history.push(`/${username}/patterns`);
    } else {
      history.push(destination);
    }
  };

  // Submit button logic
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
          <input
            type="text"
            name="user_name"
            id="loginInputName"
            placeholder="Username"
            aria-label="username"
            required
          />
          <input
            type="password"
            name="password"
            id="loginPass"
            placeholder="Password"
            aria-label="password"
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
