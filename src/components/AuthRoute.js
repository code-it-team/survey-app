/** @format */

import PropTypes from "prop-types";
import React from "react";
import { Redirect, Route } from "react-router-dom";
import { Container, Row } from "reactstrap";
import * as ROUTES from "../shared/routes";
import Header from "./Header";

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
          <Container fluid>
            <Row style={{ marginTop: "8rem", marginBottom: "2rem" }}>
              <Header logout={logout} />
              <Component />
            </Row>
          </Container>
        ) : (
          <Redirect to={ROUTES.LOGIN} />
        )
      }
    />
  );
}

// Prop types
AuthRoute.propTypes = {
  component: PropTypes.func.isRequired,
  isAuthenticated: PropTypes.bool.isRequired,
  logout: PropTypes.func.isRequired,
  path: PropTypes.string.isRequired,
};
