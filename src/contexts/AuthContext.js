import React from "react";

const AuthContext = React.createContext({
  setSignIn: () => {},
  setSignOut: () => {},
  setUserName: () => {},
  setUserId: () => {},
  setUser: () => {},
  user: {},
  user_name: "",
  user_id: null,
  error: null,
  setError: () => {},
  clearError: () => {},
});

export default AuthContext;

export class AuthProvider extends React.Component {
  state = {
    error: null,
  };

  setError = (error) => {
    this.setState({ error });
  };

  clearError = () => {
    this.setState({ error: null });
  };

  setSignIn = () => {
    this.setState({ signin: true });
  };

  setSignOut = () => {
    this.setState({ signin: false });
  };

  setUserName = (user_name) => {
    this.setState({ user_name });
  };

  setUserId = (user_id) => {
    this.setState({ user_id });
  };

  setUser = (user_name, user_id) => {
    this.setState({ user: { user_name, user_id } });
  };

  render() {
    const value = {
      error: this.state.error,
      setError: this.setError,
      clearError: this.clearError,
      signin: this.state.signin,
      setSignIn: this.setSignIn,
      setSignOut: this.setSignOut,
      setUserName: this.setUserName,
      user_name: this.state.user_name,
      setUserId: this.setUserId,
      user_id: this.state.user_id,
      setUser: this.setUser,
      user: this.state.user,
    };

    return (
      <AuthContext.Provider value={value}>
        {this.props.children}
      </AuthContext.Provider>
    );
  }
}
