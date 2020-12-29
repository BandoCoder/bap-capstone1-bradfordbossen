import React from "react";
//import { Link } from "react-router-dom";

import PatternsApiService from "../services/pat-api-service";
import AuthContext from "../contexts/AuthContext";
import TokenService from "../services/token-service";
import Item from "../components/Item";

import "./Dashboard.css";

class Dashboard extends React.Component {
  static contextType = AuthContext;

  state = {
    patterns: [],
    error: null,
    confirmDelete: false,
  };

  componentDidMount() {
    const jwt = TokenService.getAuthToken();
    if (jwt) {
      let base64Url = jwt.split(".")[1];
      let decodedValue = JSON.parse(window.atob(base64Url));

      if (decodedValue.sub !== this.props.match.params.user_name) {
        this.props.history.push(`/${decodedValue.sub}/patterns`);
      }
      PatternsApiService.getUserPatterns(decodedValue.user_id).then(
        (patterns) =>
          this.setState({
            patterns: patterns.map((pattern) => {
              return {
                id: pattern.id,
                title: pattern.title,
              };
            }),
          })
      );
    }
  }

  updatePatterns = (id) => {
    this.setState({
      patterns: this.state.patterns.filter((pattern) => pattern.id !== id),
    });
  };

  renderPatternsList = () => {
    const patterns = this.state.patterns;

    return patterns.map((pattern) => (
      <li>
        <Item
          className="pattern-box"
          key={`patternId${pattern.id}`}
          pattern={pattern}
          updatePatterns={(id) => this.updatePatterns(id)}
        />
      </li>
    ));
  };

  render() {
    return (
      <section className="patterns-page">
        <h2>Saved Patterns</h2>
        <ul className="patterns-page-list">{this.renderPatternsList()}</ul>
      </section>
    );
  }
}

export default Dashboard;
