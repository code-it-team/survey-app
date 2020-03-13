/** @format */

import Axios from "axios";
import React, { Component } from "react";
import { Redirect, Route, Switch, withRouter } from "react-router-dom";
import Footer from "./FooterComponent";
import Home from "./HomeComponent";
import Login from "./LoginComponent";
import Signup from "./SignupComponent";
import AuthRoute from "./AuthRouteComponent";

// Global Variables
const HOST = "https://calm-depths-29681.herokuapp.com/";
// * Routes
const HOME = "/";
const LOGIN = "/login";
const SIGNUP = "/signup";

class Main extends Component {
  constructor(props) {
    super(props);
    this.state = {
      jwt: "",
      fields: { username: "", password: "" },
      errors: {
        username: "",
        password: "",
        login: ""
      }
    };
    // Binding
    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.onBlur = this.onBlur.bind(this);
    this.signupOnClick = this.signupOnClick.bind(this);
  }
  // event handlers
  /**
   * @param {{ target: object; }} event
   */
  onChange = event => {
    const target = event.target;
    const value = target.value;
    const name = target.name;
    this.setState({ fields: { ...this.state.fields, [name]: value } });
  };

  signupOnClick = () => {
    this.props.history.push("/signup");
  };

  /**
   * @param {object} field
   */
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
      if (password.length < 3)
        this.setState({
          errors: { ...this.state.errors, password: <p>Password should be >= 3 characters!</p> }
        });

      // if no errors
      if (password.length >= 3) {
        this.setState({
          errors: { ...this.state.errors, password: "" }
        });
      }
    }
  };

  /**
   * @param {{ preventDefault: () => void; }} event
   */
  onSubmit = event => {
    event.preventDefault();
    // check if form is valid
    const errors = this.state.errors;
    const { username, password } = this.state.fields;
    if (errors.username === "" && username !== "" && errors.password === "" && password !== "") {
      this.login(HOST + "authenticate", this.state.fields.username, this.state.fields.password);
    }
  };
  // methods
  resetState = () => {
    this.setState({
      jwt: "",
      fields: { username: "", password: "" },
      errors: {
        username: "",
        password: "",
        login: ""
      }
    });
  };

  /**
   * @param {string} _username
   * @param {string} _password
   * @param {string} _url
   */
  login = (_url, _username, _password) => {
    Axios.post(_url, {
      username: _username,
      password: _password
    })
      .then(res => {
        // if correct response
        if (res.status === 200) {
          this.setState({ jwt: res.data.jwt });
          this.props.history.push("/");
        }
      })
      .catch(error => {
        console.log(error.response);
        // handling
        // if (error && error.response.status === 404) {
        //   this.setState({
        //     errors: { ...this.state.errors, login: "username or password is not valid!" }
        //   });
        // }
      });
  };

  logout = () => {
    this.resetState();
    this.props.history.push(LOGIN);
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
        signupOnClick={this.signupOnClick}
      />
    );
  };

  signupPage = () => {
    return <Signup />;
  };

  goToHomePage = () => {
    this.props.history.push("/")
  }

  render() {
    return (
      <div>
        <Switch>
          <AuthRoute
            exact
            isAuthenticated={this.state.jwt === "" ? false : true}
            path={HOME}
            redirectPath={LOGIN}
            component={Home}
            logout={this.logout}
          />
          <Route path={LOGIN} component={this.loginPage} />
          <Route path={SIGNUP} component={this.signupPage} />
          <Redirect to={LOGIN} />
        </Switch>
        <Footer />
      </div>
    );
  }
}

export default withRouter(Main);
