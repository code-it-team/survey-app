/** @format */

import Axios from "axios";
import React, { Component } from "react";
import { Redirect, Route, Switch, withRouter } from "react-router-dom";
import * as ROUTES from "../shared/routes";
import AuthRoute from "./AuthRouteComponent";
import Footer from "./FooterComponent";
import Home from "./HomeComponent";
import Login from "./LoginComponent";
import Signup from "./SignupComponent";

// Global Variables
const HOST = "https://calm-depths-29681.herokuapp.com/";
const INITIAL_STATE = {
  jwt: "",
  fields: { username: "", password: "", password_confirm: "" },
  errors: {
    username: "",
    password: "",
    password_confirm: ""
  }
};

class Main extends Component {
  constructor(props) {
    super(props);
    this.state = INITIAL_STATE;
    // Binding
    this.onChange = this.onChange.bind(this);
    this.onLoginSubmit = this.onLoginSubmit.bind(this);
    this.onSignupSubmit = this.onSignupSubmit.bind(this);
    this.onBlur = this.onBlur.bind(this);
    this.signupOnClick = this.signupOnClick.bind(this);
  }

  // ############################################################
  // ################       event handlers       ################
  // ############################################################

  /** Set state to input values
   * @param {{ target: object; }} event
   */
  onChange = event => {
    const target = event.target;
    const value = target.value;
    const name = target.name;
    this.setState({ fields: { ...this.state.fields, [name]: value } });
  };

  // Redirect to Signup page
  signupOnClick = () => {
    this.props.history.push(ROUTES.SIGNUP);
  };

  /** Validate input rules on blur
   * @param {object} field
   */
  onBlur = field => {
    // destructor
    const { username, password, password_confirm } = this.state.fields;
    // on Blur apply validations
    if (field === "username") {
      if (username.length < 3)
        this.setState({
          errors: {
            ...this.state.errors,
            username: <p>Username should be >= 3 characters!</p>
          }
        });
      else {
        this.setState({ errors: { ...this.state.errors, username: "" } });
      }
    } else if (field === "password") {
      if (password.length < 3)
        this.setState({
          errors: {
            ...this.state.errors,
            password: <p>Password should be >= 3 characters!</p>
          }
        });

      // if no errors
      if (password.length >= 3) {
        this.setState({
          errors: { ...this.state.errors, password: "" }
        });
      }
    }
    // only for signup form
    else if (field === "password_confirm") {
      if (password_confirm !== password) {
        this.setState({
          errors: {
            ...this.state.errors,
            password_confirm: <p>Please make sure your passwords match!</p>
          }
        });
      } else {
        this.setState({
          errors: { ...this.state.errors, password_confirm: "" }
        });
      }
    }
  };

  /** When submit the form, Login with the passed credentials to obtain the `JWT`
   * @param {{ preventDefault: () => void; }} event
   */
  onLoginSubmit = event => {
    event.preventDefault();
    // check if form is valid
    const errors = this.state.errors;
    const { username, password } = this.state.fields;
    if (
      errors.username === "" &&
      username !== "" &&
      errors.password === "" &&
      password !== ""
    ) {
      this.login(
        HOST + "authenticate",
        this.state.fields.username,
        this.state.fields.password
      );
    }
  };

  onSignupSubmit = event => {
    event.preventDefault();
    // check if form is valid
    const errors = this.state.errors;
    const { username, password, password_confirm } = this.state.fields;
    if (
      errors.username === "" &&
      username !== "" &&
      errors.password === "" &&
      password !== "" &&
      errors.password_confirm === "" &&
      password_confirm !== ""
    ) {
      this.signup(
        HOST + "signUp",
        this.state.fields.username,
        this.state.fields.password
      );
    } else{
      // handle clicking on submit button without filling all fields
      this.setState({errors: {...this.state.errors, signup: <p>Please Fill in the form fields!</p> }})
    }
  };

  // ############################################################
  // ###############       Helper Functions       ###############
  // ############################################################

  // Reset the state to the initial values
  resetState = () => {
    this.setState(INITIAL_STATE);
  };

  /** The Login function
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
          console.log(res);
          this.setState({ jwt: res.data.jwt });
          localStorage.setItem("jwt", res.data.jwt);
          this.props.history.push(ROUTES.HOME);
        }
      })
      .catch(error => {
        console.log(error.response);
        // handling
        if (error && error.response.status === 404) {
          this.setState({
            errors: {
              ...this.state.errors,
              login: "username or password is not valid!"
            }
          });
        }
      });
  };

  /* Reset to the initial state, remove the token from the local 
   storage, and redirect to login page
  */
  logout = () => {
    this.resetState();
    localStorage.clear();
    this.props.history.push(ROUTES.LOGIN);
  };

  /**
   * @param {string} _url
   * @param {string} _username
   * @param {string} _password
   */
  signup = (_url, _username, _password) => {
    Axios.post(_url, {
      username: _username,
      password: _password,
      authority: {
        role: "ROLE_USER"
      }
    })
      .then(res => {
        console.log(res);
        // if user added successfully, redirect to login page and
        // fill in the credentials
        if (res.status === 200) {
          this.props.history.push(ROUTES.LOGIN);
        }
      })
      .catch(error => {
        console.log(error.response);
      });
  };

  // ############################################################
  // ################       Pages Rendering       ###############
  // ############################################################

  loginPage = () => {
    return (
      <Login
        onSubmit={event => this.onLoginSubmit(event)}
        onChange={event => this.onChange(event)}
        onBlur={field => this.onBlur(field)}
        fields={this.state.fields}
        errors={this.state.errors}
        signupOnClick={this.signupOnClick}
      />
    );
  };

  signupPage = () => {
    return (
      <Signup
        onSubmit={event => this.onSignupSubmit(event)}
        onChange={event => this.onChange(event)}
        onBlur={field => this.onBlur(field)}
        fields={this.state.fields}
        errors={this.state.errors}
      />
    );
  };

  goToHomePage = () => {
    // remove token from local storage & clear the form data
    localStorage.clear();
    this.resetState();
    this.props.history.push(ROUTES.HOME);
  };

  // ############################################################

  render() {
    return (
      <div>
        <Switch>
          <AuthRoute
            exact
            isAuthenticated={localStorage.getItem("jwt") ? true : false}
            path={ROUTES.HOME}
            component={Home}
            logout={this.logout}
            goToHomePage={this.goToHomePage}
          />
          <Route path={ROUTES.LOGIN} component={this.loginPage} />
          <Route path={ROUTES.SIGNUP} component={this.signupPage} />
          <Redirect to={ROUTES.LOGIN} />
        </Switch>
        <Footer />
      </div>
    );
  }
}

export default withRouter(Main);
