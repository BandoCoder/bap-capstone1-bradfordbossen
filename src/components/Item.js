import React from "react";
import { Link } from "react-router-dom";

import PatternsApiService from "../services/pat-api-service";
// import TokenService from "../services/token-service";
import "./Item.css";

// ** ITEM COMPONENT FOR DASHBOARD LIST OF PATTERNS FOR EACH USER **
export default class Item extends React.Component {
  state = {
    confirmDelete: false,
  };

  handleDelete = (e) => {
    PatternsApiService.deletePattern(this.props.pattern.id)
      .then(() => {
        this.props.updatePatterns(this.props.pattern.id);
      })
      .catch((err) => {
        this.setState({ error: err.error });
      });
  };

  confirmDelete = (e) => {
    this.setState({ confirmDelete: true });
  };

  cancelDelete = () => {
    this.setState({ confirmDelete: false });
  };

  render() {
    const deleteButtons = !this.state.confirmDelete ? (
      <button
        type="button"
        className="delete-pattern"
        onClick={(e) => this.confirmDelete(e)}
      >
        Delete
      </button>
    ) : (
      <>
        <button
          type="button"
          className="confirmDelete-pattern"
          onClick={(e) => this.handleDelete(e)}
        >
          Confirm
        </button>
        <button
          type="button"
          className="cancelDelete-pattern"
          onClick={(e) => this.cancelDelete(e)}
        >
          Cancel
        </button>
      </>
    );

    return (
      <li key={this.props.pattern.id} className="listItem">
        <Link
          className="pattern-link"
          to={`/${this.context.user_name}/patterns/${this.props.pattern.id}`}
        >
          {this.props.pattern.title}
        </Link>

        <div>{deleteButtons}</div>
      </li>
    );
  }
}
