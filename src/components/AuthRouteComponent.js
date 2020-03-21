/** @format */

import PropTypes from "prop-types";
import React from "react";
import { Redirect, Route } from "react-router-dom";
import * as Routes from "../shared/routes";
import Header from "./HeaderComponent";
export default function AuthRoute({
  component: Component,
  isAuthenticated,
  logout,
  ...rest
}) {
  return (
    <Route
      {...rest}
      render={() =>
        isAuthenticated ? (
          <React.Fragment>
            <Header logout={logout} />
            <Component />
          </React.Fragment>
        ) : (
          <Redirect to={Routes.LOGIN} />
        )
      }
    />
  );
}

// Prop types
AuthRoute.propTypes = {
  Component: PropTypes.element,
  isAuthenticated: PropTypes.bool.isRequired,
  logout: PropTypes.func.isRequired,
  path: PropTypes.string.isRequired
};
