/** @format */

import React from "react";
import { Route, Redirect } from "react-router-dom";
import Header from "./HeaderComponent";

export default function AuthRoute({ component: Component, isAuthenticated, redirectPath, logout, ...rest }) {
  setTimeout(3000)
  return (
    <Route
      {...rest}
      render={() => (isAuthenticated ? (
        <React.Fragment>
          <Header logout={logout} />
          <Component/>
        </React.Fragment>
      ) : <Redirect to={redirectPath} />)}
    />
  );
}
