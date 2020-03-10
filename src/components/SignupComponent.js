/** @format */

import React from "react";
import {
  Form,
  FormGroup,
  Label,
  Input,
  Button,
  Card,
  CardHeader,
  CardBody,
  Media
} from "reactstrap";
import "../index.css";
import { withRouter } from "react-router-dom";

function Signup() {
  return (
    <div className="container">
      <div className="row">
        <div className="col-md-6 col-sm-12 mb-3">
          <Media src="/survey.svg" alt="logo" height="100px" className="mb-5" />
          <h2>
            Build your own survey
            <br />
            easily ...
          </h2>
        </div>
        <div className="col-md-6 col-sm-12">
          <Card>
            <CardHeader>
              <h2>Signup</h2>
            </CardHeader>
            <CardBody>
                <Form>
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
                    />
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
                    />
                  </FormGroup>
                </Form>
              <Button type="submit" value="login" outline color="dark" className="mt-5 btn-block">
                Signup
              </Button>
            </CardBody>
          </Card>
          <div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default withRouter(Signup)
