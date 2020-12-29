import { Component } from "react";
import AuthApiService from "../services/auth-api-service";
import "./Signup.css";

export default class Signup extends Component {
  state = {
    error: null,
    user_name: "",
    email: "",
    password: "",
    passwordRepeat: "",
    passwordAttempted: false,
  };

  usernameChanged(user_name) {
    this.setState({ user_name });
  }
  emailChanged(email) {
    this.setState({ email });
  }
  passwordChanged(password) {
    this.setState({ password });
  }
  passwordRepeatChanged(passwordRepeat) {
    this.setState({ passwordRepeat });
  }

  passwordConfirm = () => {
    if (!this.state.passwordAttempted)
      this.setState({
        passwordAttempted: true,
      });
    if (this.state.password !== this.state.passwordRepeat) {
      this.setState({ error: "password must match" });
    } else {
      this.setState({ error: null });
    }
  };

  handleRegistrationSuccess = (user) => {
    const { history } = this.props;
    history.push("/login");
  };

  handleSubmit = (e) => {
    e.preventDefault();
    const { user_name, email, password, passwordRepeat } = this.state;

    this.setState({ error: null });
    try {
      if (password !== passwordRepeat) {
        // eslint-disable-next-line no-throw-literal
        throw "password must match";
      }

      this.setState({ error: null });
      AuthApiService.postUser({
        user_name,
        email,
        password,
      })
        .then((user) => {
          this.setState({
            user_name: "",
            email: "",
            password: "",
            passwordRepeat: "",
          });
          this.handleRegistrationSuccess();
        })
        .catch((res) => {
          this.setState({ error: res.error });
        });
    } catch (err) {
      this.setState({ error: err });
    }
  };

  render() {
    const { error } = this.state;
    return (
      <div className="signupForm">
        <form onSubmit={this.handleSubmit}>
          <fieldset>
            <h2>Create an account</h2>
            <label className="registration" htmlFor="registration-user-name">
              Username
            </label>
            <input
              type="text"
              name="user_name"
              id="registration-user-name"
              value={this.state.user_name}
              onChange={(e) => this.usernameChanged(e.target.value)}
              placeholder="username"
              required
            />
            <label className="registration" htmlFor="registration-email">
              Email
            </label>
            <input
              className="registration"
              type="email"
              name="email"
              id="registration-email"
              value={this.state.email}
              onChange={(e) => this.emailChanged(e.target.value)}
              placeholder="email"
              required
            />
            <label className="registration" htmlFor="registration-password">
              Password
            </label>
            <input
              className="registration"
              type="password"
              name="password"
              id="registration-password"
              value={this.state.password}
              onChange={(e) => this.passwordChanged(e.target.value)}
              placeholder="password"
              required
            />
            <label
              className="registration"
              htmlFor="registration-password-repeat"
            >
              Confirm Password
            </label>
            <input
              className="registration"
              type="password"
              name="passwordRepeat"
              id="registration-password-repeat"
              value={this.state.passwordRepeat}
              onChange={(e) => this.passwordRepeatChanged(e.target.value)}
              onBlur={() => this.passwordConfirm()}
              placeholder="password"
              required
            />
            <input className="submit" type="submit" value="submit" />
            <div role="alert">
              {error && <p className="error-msg">{error}</p>}
            </div>
          </fieldset>
        </form>
      </div>
    );
  }
}
