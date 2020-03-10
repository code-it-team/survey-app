/** @format */

import React, { Component } from "react";
import { withRouter, Switch, Route, Redirect } from "react-router-dom";
import Footer from "./FooterComponent";
import Login from "./LoginComponent";
import Signup from "./SignupComponent";
import Axios from "axios";

class Main extends Component {
  constructor(props) {
    super(props);
    this.state = {
      jwt: "",
      fields: { username: "", password: "" },
      errors: {
        username: "",
        password: ""
      },
      host: "https://young-plains-44293.herokuapp.com/"
    };
    // Binding
    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.onBlur = this.onBlur.bind(this);
  }
  // event handlers
  onChange = event => {
    const target = event.target;
    const value = target.value;
    const name = target.name;
    this.setState({ fields: { ...this.state.fields, [name]: value } });
  };

  onBlur = field => {
    // destructor
    const { username, password } = this.state.fields;
    // on Blur apply validations
    if (field === "username") {
      if (username.length < 3)
        this.setState({
          errors: { ...this.state.errors, username: <p>Username should be >= 3 characters!</p> }
        });
      else {
        this.setState({ errors: { ...this.state.errors, username: "" } });
      }
    } else if (field === "password") {
      const reg = /^(?=.*\d)(?=.*[a-zA-Z]).{2,}$/;
      if (!reg.test(password))
        this.setState({
          errors: {
            ...this.state.errors,
            password: <p>Password should contain at least one character & one digit!</p>
          }
        });
      if (password.length < 3)
        this.setState({
          errors: { ...this.state.errors, password: <p>Password should be >= 3 characters!</p> }
        });

      // if no errors
      if (password.length >= 3 && reg.test(password)) {
        this.setState({
          errors: { ...this.state.errors, password: "" }
        });
      }
    }
  };

  onSubmit = event => {
    event.preventDefault();
    // check if form is valid
    const errors = this.state.errors;
    const { username, password } = this.state.fields;
    if (errors.username === "" && username !== "" && errors.password === "" && password !== "") {
      Axios.post(this.state.host + "/authenticate", {
        username: this.state.fields.username,
        password: this.state.fields.password
      }).then(res => console.log(res));
    }
  };

  // pages rendering
  loginPage = () => {
    return (
      <Login
        onSubmit={event => this.onSubmit(event)}
        onChange={event => this.onChange(event)}
        onBlur={field => this.onBlur(field)}
        fields={this.state.fields}
        errors={this.state.errors}
        signupPage={this.signupPage}
      />
    );
  };

  signupPage = () => {
    this.props.history.push("/signup");
  };

  render() {
    return (
      <div className="container">
        <Switch>
          <Route path="/" component={this.loginPage} />
          <Route path="/signup" component={() => <Signup signupPage={this.signupPage} />} />
          <Redirect to="/welcome" />
        </Switch>
        <Footer />
      </div>
    );
  }
}

export default withRouter(Main);
