import React from "react";
import { Route, Redirect } from "react-router-dom";
import TokenService from "../services/token-service";
import AuthContext from "../contexts/AuthContext";

export default function PrivateRoute({ component, ...props }) {
  const Component = component;

  return (
    <Route
      {...props}
      render={(componentProps) => (
        <AuthContext.Consumer>
          {(userContext) =>
            TokenService.hasAuthToken() ? (
              <Component {...componentProps} user={userContext.user} />
            ) : (
              <Redirect
                to={{
                  pathname: "/login",
                  state: { from: componentProps.location },
                }}
              />
            )
          }
        </AuthContext.Consumer>
      )}
    />
  );
}
