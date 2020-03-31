/** @format */

import PropTypes from "prop-types";
import React from "react";
import { Button, Card, CardBody, CardHeader, Form, FormFeedback, FormGroup, Input, Label, Media } from "reactstrap";
import "../index.css";

function Login({ onSubmit, onChange, onBlur, fields, errors, signupOnClick }) {
  return (
    <div className="loginBody">
      <div className="container">
        <div className="row">
          <div className="col-lg-6 col-sm-12 mb-4">
            <Media
              src="/survey.svg"
              alt="logo"
              height="100px"
              className="mb-4 mt-4"
            />
            <h2>
              Build your own survey
              <br />
              easily ...
            </h2>
          </div>
          <div className="col-lg-6 col-sm-12">
            <Card>
              <CardHeader>
                <h2>Login</h2>
              </CardHeader>
              <CardBody>
                <Form onSubmit={onSubmit} name="loginForm">
                  <FormGroup>
                    <Label htmlFor="username">
                      <strong>Username</strong>
                    </Label>
                    <Input
                      type="text"
                      name="username"
                      id="username"
                      className="form-control"
                      placeholder="username"
                      value={fields.username}
                      onChange={onChange}
                      onBlur={() => onBlur("username")}
                      invalid={errors.username !== null}
                    />
                    <FormFeedback>{errors.username}</FormFeedback>
                  </FormGroup>
                  <FormGroup>
                    <Label htmlFor="password">
                      <strong>Password</strong>
                    </Label>
                    <Input
                      type="password"
                      name="password"
                      id="password"
                      className="form-control"
                      placeholder="password"
                      onChange={onChange}
                      onBlur={() => onBlur("password")}
                      invalid={errors.password !== null}
                    />
                    <FormFeedback>{errors.password}</FormFeedback>
                  </FormGroup>
                  <FormGroup>
                    <Button
                      type="submit"
                      outline
                      className="btn-block mt-5"
                      color="dark"
                    >
                      Login
                    </Button>
                    <div className="mt-2 text-danger">{errors.login}</div>
                  </FormGroup>
                </Form>
              </CardBody>
            </Card>
            <FormGroup>
              <br />
              <h3>Or create a new account</h3>
              <Button
                type="button"
                outline
                color="dark"
                className="mt-3 btn-block"
                onClick={() => signupOnClick()}
              >
                Signup
              </Button>
            </FormGroup>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;

// prop types
Login.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  onBlur: PropTypes.func.isRequired,
  fields: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired,
  signupOnClick: PropTypes.func.isRequired
};
