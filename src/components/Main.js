/** @format */

import Axios from "axios";
import _ from "lodash";
import React, { Component } from "react";
import { Fade } from "react-animation-components";
import { Redirect, Route, Switch, withRouter } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import { baseUrl } from "../shared/baseUrl";
import { MINLEN } from "../shared/globals";
import * as helpers from "../shared/helperFunctions";
import * as messages from "../shared/messages";
import * as routers from "../shared/routes";
import * as actions from "../state/actions";
import AuthRoute from "./AuthRoute";
import Footer from "./Footer";
import GeneralError from "./GeneralError";
import Home from "./Home";
import Login from "./Login";
import Signup from "./Signup";
import SurveyDetails from "./SurveyDetails";
import SurveySubmit from "./SurveySubmit";

// #############################    State   #############################
const INITIAL_STATE = {
  jwt: "",
  fields: {
    id: 0,
    username: "",
    password: "",
    password_confirm: "",
    question: "",
    option: "",
  },
  errors: {
    username: null,
    password: null,
    password_confirm: null,
    login: null,
    signup: null,
    question: null,
    // Survey Being edited
    name: "",
    questions: [],
    edit_survey: "",
  },
  spinner: <></>,
  surveys: [], // list of all surveys
  survey: {}, // the survey to be edited
};

class Main extends Component {
  /**
   * @param {any} props
   */
  constructor(props) {
    super(props);
    this.state = INITIAL_STATE;

    // binding
    this.activateSpinner = actions.activateSpinner.bind(this);
    this.deactivateSpinner = actions.deactivateSpinner.bind(this);
    this.addChoice = actions.addChoice.bind(this);
    this.removeChoice = actions.removeChoice.bind(this);
    this.addQuestion = actions.addQuestion.bind(this);
    this.removeQuestion = actions.removeQuestion.bind(this);
    this.onBlurSurvey = actions.onBlur.bind(this);
    this.onChangeSurvey = actions.onChange.bind(this);
    this.setQuestionErrors = actions.setQuestionErrors.bind(this);
  }

  // ############################################################
  // ############################################################
  // ##############       Life-cycle Methods       ##############
  // ############################################################
  // ############################################################
  componentDidMount() {
    // if the user has a valid token, get all his/her surveys
    if (helpers.isAuth()) {
      this.getSurveys();
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (helpers.isAuth()) {
    }
  }

  // ############################################################
  // ############################################################
  // ################       event handlers       ################
  // ############################################################
  // ############################################################
  // <<<<<<<<<<<<<<<<<<<<       General       >>>>>>>>>>>>>>>>>>>
  setSurveyBeingEdited = survey_id => {
    this.setState({ survey: this.state.surveys[survey_id] });
  };

  setSurveyErrors = id => {
    // Mirror Survey structure to errors
    let errors = {
      ...this.state.errors,
      questions: helpers.mirrorQuestionErrors(this.state.surveys[id]),
    };
    this.setState({
      errors: errors,
    });
  };

  resetState = () => {
    this.setState(INITIAL_STATE);
  };

  handleGeneralError = () => {
    return this.props.history.push(routers.GENERAL_ERROR);
  };

  /** Set state to input values
   * @param {{ target: object; }} event
   */
  onChange = event => {
    // reset error message
    this.setState({
      errors: { ...this.state.errors, login: null, signup: null },
    });

    const target = event.target;
    const value = target.value;
    const name = target.name;
    this.setState({ fields: { ...this.state.fields, [name]: value } });
  };

  // Redirect to Signup page
  signupRedirect = () => {
    // reset state
    this.resetState();
    this.props.history.push(routers.SIGNUP);
  };

  // Redirect to Login page
  loginRedirect = () => {
    // reset state
    this.resetState();
    this.props.history.push(routers.LOGIN);
  };

  /** Validate input rules on blur
   * @param {object} field
   */
  onBlur = field => {
    // destructor
    const { username, password, password_confirm } = this.state.fields;
    // on Blur apply validations

    // ===================      Username       ===================
    if (field === "username") {
      if (username.length < MINLEN)
        this.setState({
          errors: {
            ...this.state.errors,
            username: <p>Username should be &ge; {MINLEN} characters!</p>,
          },
        });
      else {
        this.setState({ errors: { ...this.state.errors, username: null } });
      }
    }

    // ===================      Password       ==================
    else if (field === "password") {
      if (password.length < MINLEN)
        this.setState({
          errors: {
            ...this.state.errors,
            password: <p>Password should be &ge; {MINLEN} characters!</p>,
          },
        });

      // if no errors
      if (password.length >= MINLEN) {
        this.setState({
          errors: { ...this.state.errors, password: null },
        });
      }
    }

    // ================      Confirm Password       ===============
    // only for signup form
    else if (field === "password_confirm") {
      if (password_confirm !== password) {
        this.setState({
          errors: {
            ...this.state.errors,
            password_confirm: <p>* Make sure your passwords match, please!</p>,
          },
        });
      } else {
        this.setState({
          errors: { ...this.state.errors, password_confirm: null },
        });
      }
    }
  };

  // <<<<<<<<<<<<<<<<<<<<<       Login       >>>>>>>>>>>>>>>>>>>>
  /** When submit the form, Login with the passed credentials to obtain the `JWT`
   * @param {{ preventDefault: () => void; }} event
   */
  onLoginSubmit = event => {
    event.preventDefault();
    // check for errors
    const errors = this.state.errors;
    const { username, password } = this.state.fields;
    if (
      errors.username === null &&
      username !== "" &&
      errors.password === null &&
      password !== ""
    ) {
      // remove error messages if exist
      this.setState({ errors: { ...this.state.errors, login: null } });

      // activate spinner button
      this.activateSpinner();

      this.login(
        baseUrl + "authenticate",
        this.state.fields.username,
        this.state.fields.password
      );
    }
    // else, if the login form was not filled in print it an error message
    else {
      this.setState({
        errors: {
          ...this.state.errors,
          login: <p>* Please fill in the form fields!</p>,
        },
      });
      this.deactivateSpinner();
    }
  };

  // <<<<<<<<<<<<<<<<<<<<       Signup       >>>>>>>>>>>>>>>>>>>>
  /**
   * @param {{ preventDefault: () => void; }} event
   */
  onSignupSubmit = event => {
    event.preventDefault();
    // check for errors
    const errors = this.state.errors;
    const { username, password, password_confirm } = this.state.fields;
    if (
      errors.username === null &&
      username !== "" &&
      errors.password === null &&
      password !== "" &&
      errors.password_confirm === null &&
      password_confirm !== ""
    ) {
      // remove error messages if exist
      this.setState({ errors: { ...this.state.errors, signup: null } });

      // activate spinner button
      this.activateSpinner();

      this.signup(
        baseUrl + "signUp",
        this.state.fields.username,
        this.state.fields.password
      );
    } else {
      // handle clicking on submit button without filling all fields, and deactivate spinner
      this.setState({
        errors: {
          ...this.state.errors,
          signup: <p>* Fill in the form fields, please!</p>,
        },
      });
      this.deactivateSpinner();
    }
  };

  // <<<<<<<<<<<<<<<<<<<<       Survey       >>>>>>>>>>>>>>>>>>>>
  onSurveyEditSubmit = event => {
    event.preventDefault();
    // Check if form is valid
    let isErrorsFree = helpers.isValid(this.state.errors, helpers.checker);
    let isAllFieldsFilled = helpers.isValid(
      this.state.survey,
      helpers.checker,
      false
    );

    // If any empty field exists, set an error message
    if (!isAllFieldsFilled) {
      this.setState({
        errors: {
          ...this.state.errors,
          edit_survey: `* Fill in all the fields before submitting, please!`,
        },
      });

      // Deactivate Spinner
      this.deactivateSpinner();
      return;
    }

    // If errors exist
    if (!isErrorsFree) {
      this.setState({
        errors: {
          ...this.state.errors,
          post_survey: `* Fix the above issues, please!`,
        },
      });

      // Deactivate Spinner
      this.deactivateSpinner();
      return;
    }

    // if valid, send the API request
    this.editSurvey();

    // reset state
  };

  // ############################################################
  // ############################################################
  // ####################       Actions       ###################
  // ############################################################
  // ############################################################
  // Reset the state to the initial values
  resetState = () => {
    this.setState(INITIAL_STATE);
  };

  // <<<<<<<<<<<<<<<<<<<<<       Login       >>>>>>>>>>>>>>>>>>>>

  /** The Login function
   * @param {string} _username
   * @param {string} _password
   * @param {string} _url
   */
  login = (_url, _username, _password) => {
    Axios.post(_url, {
      username: _username,
      password: _password,
    })
      .then(res => {
        // if correct response
        if (res.status === 200) {
          // console.log(res);
          this.setState({
            jwt: res.data.jwt,
            fields: { ...this.state.fields, id: res.data.surveyUser.id },
          });
          localStorage.setItem("jwt", res.data.jwt);
          localStorage.setItem("username", this.state.fields.username);
          localStorage.setItem("id", this.state.fields.id.toString());

          this.props.history.push(routers.HOME);
        }
      })
      .catch(error => {
        console.log(error);

        // handle general error
        if (!error.response) {
          return this.props.history.push(routers.GENERAL_ERROR);
        }

        // handling
        if (error && error.response.status === 404) {
          this.setState({
            errors: {
              ...this.state.errors,
              login: <p>* Username or Password is not valid!</p>,
            },
          });
        }
      })
      .finally(() => {
        // deactivate spinner
        this.deactivateSpinner();
      });
  };

  // <<<<<<<<<<<<<<<<<<<<       Logout       >>>>>>>>>>>>>>>>>>>>
  /* Reset to the initial state, remove the token from the local
   ** storage, and redirect to login page
   */
  logout = () => {
    this.resetState();
    localStorage.clear();
    this.props.history.push(routers.LOGIN);
  };

  // <<<<<<<<<<<<<<<<<<<<<       Signup       >>>>>>>>>>>>>>>>>>>
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
        role: "ROLE_USER",
      },
    })
      .then(res => {
        // console.log(res);
        // if user added successfully, redirect to login page and
        // fill in the credentials
        if (res.status === 200) {
          this.props.history.push(routers.LOGIN);

          // deactivate spinner
          this.deactivateSpinner();
        }
      })
      .catch(error => {
        console.log(error.response);

        // deactivate spinner
        this.deactivateSpinner();

        // handle general error
        if (!error.response) {
          return this.props.history.push(routers.GENERAL_ERROR);
        }

        // resolve 409 error which means duplicate username
        if (error.response.status === 409) {
          this.setState({
            errors: {
              ...this.state.errors,
              signup: <p>* Username already exists!</p>,
            },
          });
        }
      });
  };

  // <<<<<<<<<<<<<<<<<<<<       Survey       >>>>>>>>>>>>>>>>>>>>
  // callback function to get the surveys of a user by id, save them to local storage
  getSurveys = () => {
    Axios.get(baseUrl + "getSurveysByUser", {
      headers: {
        Authorization: helpers.getJWT(),
      },
      params: {
        id: helpers.getUserId(),
      },
    })
      .then(res => {
        // correct response
        if (res.status === 200) {
          // console.log(res);

          this.setState({ surveys: res.data.surveys });

          // save to locale storage
          // localStorage.setItem("surveys", JSON.stringify(this.state.surveys));
        }
      })
      .catch(error => {
        console.log(error.response);

        // handle general error
        if (!error.response) {
          return this.props.history.push(routers.GENERAL_ERROR);
        }
      });
  };

  editSurvey = () => {
    Axios.put(
      baseUrl + "updateSurvey",
      {
        id: this.state.survey.id,
        name: this.state.survey.name,
        questions: this.state.survey.questions,
      },
      {
        headers: {
          Authorization: helpers.getJWT(),
        },
      }
    )
      .then(response => {
        if (response.status === 200) {
          // success
          toast.success(messages.editSurvey.success);
        }
      })
      .catch(error => {
        console.error(error.response);

        toast.error(error.response.data);

        // handle general error
        if (!error.response) {
          return this.props.history.push(routers.GENERAL_ERROR);
        }
      })
      .finally(() =>
        // Deactivate Spinner
        this.deactivateSpinner()
      );
  };

  publishSurvey = () => {
    Axios.put(
      baseUrl + "publishSurvey",
      {},
      {
        headers: {
          Authorization: helpers.getJWT(),
        },
        params: {
          surveyId: this.state.survey.id,
        },
      }
    )
      .then(res => {
        // success
        toast.success(messages.publishSurvey.success);
      })
      .catch(error => {
        console.error(error.response);

        toast.error(error.response.data);

        // handle general error
        if (!error.response) {
          return this.props.history.push(routers.GENERAL_ERROR);
        }
      })
      .finally(() => {
        this.redirectToHome();
      });
  };

  // ############################################################
  // ############################################################
  // ################       Pages Rendering       ###############
  // ############################################################
  // ############################################################
  redirectToHome = () => {
    return this.props.history.push(routers.HOME);
  };

  loginPage = () => {
    return (
      <Login
        onSubmit={event => this.onLoginSubmit(event)}
        onChange={event => this.onChange(event)}
        onBlur={field => this.onBlur(field)}
        fields={this.state.fields}
        errors={this.state.errors}
        signupOnClick={this.signupRedirect}
        spinner={this.state.spinner}
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
        loginOnClick={this.loginRedirect}
        spinner={this.state.spinner}
      />
    );
  };

  homePage = () => {
    return (
      <Home
        getSurveys={this.getSurveys}
        surveys={this.state.surveys}
        handleGeneralError={this.handleGeneralError}
        setSurveyErrors={this.setSurveyErrors}
        setSurveyBeingEdited={this.setSurveyBeingEdited}
      />
    );
  };

  surveyDetailsPage = () => {
    return (
      <SurveyDetails
        survey={this.state.survey}
        errors={this.state.errors}
        isEdit={true}
        spinner={this.state.spinner}
        activateSpinner={this.activateSpinner}
        addChoice={this.addChoice}
        removeChoice={this.removeChoice}
        addQuestion={this.addQuestion}
        removeQuestion={this.removeQuestion}
        onBlur={this.onBlurSurvey}
        onChange={this.onChangeSurvey}
        onSubmit={this.onSurveyEditSubmit}
        redirectToHome={this.redirectToHome}
        publishSurvey={this.publishSurvey}
      />
    );
  };

  surveySubmitPage = ({ match }) => {
    const surveyId = parseInt(match.params.id, 10);
    return <SurveySubmit surveyId={surveyId.toString()} />;
  };

  // ############################################################
  // ############################################################
  // ####################       Render       ####################
  // ############################################################
  // ############################################################
  render() {
    return (
      <Fade in delay={100} duration={700}>
        <React.Fragment>
          <Switch>
            <AuthRoute
              exact
              isAuthenticated={helpers.isAuth()}
              path={routers.HOME}
              component={this.homePage}
              logout={this.logout}
            />
            <AuthRoute
              isAuthenticated={helpers.isAuth()}
              path={routers.SURVEY_DETAILS}
              component={this.surveyDetailsPage}
              logout={this.logout}
            />
            <Route path={routers.LOGIN} component={this.loginPage} />
            <Route path={routers.SIGNUP} component={this.signupPage} />
            <Route path={routers.GENERAL_ERROR} component={GeneralError} />
            <Route
              path={routers.SURVEY_SUBMIT}
              component={this.surveySubmitPage}
            />
            <Redirect to={routers.HOME} />
          </Switch>
          <Footer />
          <ToastContainer />
        </React.Fragment>
      </Fade>
    );
  }
}

export default withRouter(Main);
