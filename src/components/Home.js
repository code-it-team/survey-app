//@ts-check
import Axios from "axios";
import _ from "lodash";
import PropTypes from "prop-types";
import React, { Component } from "react";
import { Link } from "react-router-dom";
import { Button, Col, Collapse, Spinner, Table, UncontrolledTooltip } from "reactstrap";
import { baseUrl } from "../shared/baseUrl";
import { GE_SYMBOL, INITIAL_ERRORS, INITIAL_SURVEY, LE_SYMBOL, MAX_CHOICES, MIN_CHOICES } from "../shared/globals";
import * as helpers from "../shared/helperFunctions";
import * as VALIDATION from "../shared/validation";
import SurveyDetails from "./SurveyDetails";

// ############################################################
// ############################################################
// ###############       Global Variables       ###############
// ############################################################
// ############################################################

// ############################################################
// ############################################################
// ###############       Helper Functions       ###############
// ############################################################
// ############################################################
/**
 * @param {object} survey_object
 * @param {number} survey_count
 */
const renderTableRow = (
  survey_object,
  survey_count,
  deleteSurvey,
  setSurveyErrors
) => {
  const { name } = survey_object;
  return (
    <tr key={survey_count}>
      <th scope="row">{survey_count + 1}</th>
      <td>
        {
          <Link
            to={`/surveys/${survey_count}`}
            onClick={() => setSurveyErrors(survey_count)}
          >
            {name}
          </Link>
        }
      </td>
      <td>
        <span
          className="fa fa-trash-o"
          id="delete-survey"
          onClick={() => deleteSurvey(survey_count)}
        ></span>
        <UncontrolledTooltip placeholder="top" target="delete-survey">
          delete the survey
        </UncontrolledTooltip>
      </td>
    </tr>
  );
};

/**
 * @param {object} collection The collection to be checked
 * @param {Function} checker Callback to check against each element
 * @param {boolean} empty The condition to be checked against the elements
 * of the collection. If `true` => the object value should be empty,
 * `false` => should not be empty
 * @returns `false` if any error exists otherwise, `true`
 */
const isValid = (collection, checker, empty = true) => {
  // check survey name
  let name = true;
  if (empty) name = collection.name === "" ? true : false;
  else name = collection.name === "" ? false : true;
  if (!name) return false;

  // check questions if any error exists, return false
  let questions = true;
  if (empty) questions = checker(collection.questions);
  else questions = checker(collection.questions, false);
  if (!questions) return false;

  // check choices
  let choices = true;
  _.each(collection.questions, item => {
    let _choices = true;
    if (empty) _choices = checker(item.choices);
    else _choices = checker(item.choices, false);
    if (!_choices) {
      choices = false;
      return;
    }
  });
  return choices;
};

export default class Home extends Component {
  /**
   * @param {any} props
   */
  constructor(props) {
    super(props);
    this.state = {
      isShowSurveysOpen: true,
      isAddSurveyOpen: false,
      survey: INITIAL_SURVEY,
      errors: INITIAL_ERRORS,
      spinner: <></>,
    };
  }

  // ############################################################
  // ############################################################
  // ##############       Life-cycle Methods       ##############
  // ############################################################
  // ############################################################
  componentDidMount() {
    // if the user has a valid token, get all his/her surveys
    if (helpers.isAuth()) {
      this.props.getSurveys();
    }
  }

  // ############################################################
  // ############################################################
  // ################       Event Handlers       ################
  // ############################################################
  // ############################################################
  resetSurvey = () => {
    this.setState({ survey: INITIAL_SURVEY, errors: INITIAL_ERRORS });
  };

  showSurveysToggle = () => {
    this.setState({
      isShowSurveysOpen: !this.state.isShowSurveysOpen,
      isAddSurveyOpen: false,
    });
  };

  addSurveyToggle = () => {
    this.setState({
      isAddSurveyOpen: !this.state.isAddSurveyOpen,
      isShowSurveysOpen: false,
    });
  };

  activateSpinner = () => {
    // if any error exists do not load the spinner
    this.setState({
      spinner: (
        <Spinner color="primary" style={{ width: "20px", height: "20px" }} />
      ),
    });
  };

  deactivateSpinner = () => {
    this.setState({
      spinner: <></>,
    });
  };

  clearPostSubmitErrorMessage = () => {
    this.setState({
      errors: {
        ...this.state.errors,
        post_survey: "",
      },
    });
  };

  onSubmit = event => {
    event.preventDefault();
    // Check if form is valid
    let isErrorsFree = isValid(this.state.errors, helpers.checker);
    let isAllFieldsFilled = isValid(this.state.survey, helpers.checker, false);

    // If any empty field exists, set an error message
    if (!isAllFieldsFilled) {
      this.setState({
        errors: {
          ...this.state.errors,
          post_survey: `* Fill in all the fields before submitting, please!`,
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
    this.postSurvey(helpers.getUserId());

    // reset state
    this.resetSurvey();
  };

  /**
   * @param {Event} event
   * @param {string} field The input type question, choice
   * @param {number} question_id The id of the question being updated
   * @param {number} choice_id The id of the choice being updated
   */
  onChange = (event, field, question_id = -1, choice_id = -1) => {
    // clear previous error message
    this.clearPostSubmitErrorMessage();

    const { value } = event.target;

    if (field === VALIDATION.survey_name) {
      // survey name
      this.setState({
        survey: { ...this.state.survey, name: value },
      });
    } else if (field === VALIDATION.question) {
      // question body
      let updatedQuestions = [...this.state.survey.questions];
      updatedQuestions[question_id] = {
        ...updatedQuestions[question_id],
        body: value,
      };
      this.setState({
        survey: {
          ...this.state.survey,
          questions: updatedQuestions,
        },
      });
    } else if (field === VALIDATION.choice) {
      let updatedQuestions = [...this.state.survey.questions];
      // choice body
      updatedQuestions[question_id]["choices"][choice_id] = {
        body: value,
      };
      this.setState({
        survey: {
          ...this.state.survey,
          questions: updatedQuestions,
        },
      });
    }
  };

  /**
   * @param {string} field The input type [question, choice]
   * @param {number} question_id The id of the question being updated
   * @param {number} choice_id The id of the choice being updated
   */
  onBlur = (field, question_id = -1, choice_id = -1) => {
    // ###################      Survey Name     ###################
    if (field === VALIDATION.survey_name) {
      const { name } = this.state.survey;
      // check valid length
      if (name.length < VALIDATION.len.name.min) {
        // less than min length
        this.setState({
          errors: {
            ...this.state.errors,
            name: `Survey Name should be ${
              GE_SYMBOL + " " + VALIDATION.len.name.min
            } characters!`,
          },
        });
      } else if (name.length > VALIDATION.len.name.max) {
        // greater than max length
        this.setState({
          errors: {
            ...this.state.errors,
            name: `Survey Name should be ${
              LE_SYMBOL + " " + VALIDATION.len.name.max
            } characters!`,
          },
        });
      } else {
        // valid name length
        this.setState({ errors: { ...this.state.errors, name: "" } });
      }
    } else if (field === VALIDATION.question) {
      // ###################    question body     ###################
      const { body } = this.state.survey.questions[question_id];
      let updatedQuestionErrors = [...this.state.errors.questions];
      // check valid length
      if (body.length < VALIDATION.len.question.min) {
        // less than min length
        updatedQuestionErrors[question_id] = {
          ...this.state.errors.questions[question_id],
          body: `Question should be ${
            GE_SYMBOL + " " + VALIDATION.len.question.min
          } characters!`,
        };
        this.setQuestionErrors(updatedQuestionErrors);
      } else if (body.length > VALIDATION.len.question.max) {
        // greater than max length
        updatedQuestionErrors[question_id] = {
          ...this.state.errors.questions[question_id],
          body: `Question should be ${
            LE_SYMBOL + " " + VALIDATION.len.question.max
          } characters!`,
        };
        this.setQuestionErrors(updatedQuestionErrors);
      } else {
        // valid name length
        updatedQuestionErrors[question_id] = {
          ...this.state.errors.questions[question_id],
          body: "",
        };
        this.setQuestionErrors(updatedQuestionErrors);
      }
    } else if (field === VALIDATION.choice) {
      // ###################    choice body     ###################
      const { body } = this.state.survey.questions[question_id].choices[
        choice_id
      ];
      let updatedQuestionErrors = [...this.state.errors.questions];
      // check valid length
      if (body.length < VALIDATION.len.choice.min) {
        // less than min length
        updatedQuestionErrors[question_id].choices[choice_id] = {
          body: `Choice should be ${
            GE_SYMBOL + " " + VALIDATION.len.choice.min
          } characters!`,
        };
        this.setQuestionErrors(updatedQuestionErrors);
      } else if (body.length > VALIDATION.len.choice.max) {
        // greater than max length
        updatedQuestionErrors[question_id].choices[choice_id] = {
          body: `Choice should be ${
            LE_SYMBOL + " " + VALIDATION.len.choice.max
          } characters!`,
        };
        this.setQuestionErrors(updatedQuestionErrors);
      } else {
        // valid name length
        updatedQuestionErrors[question_id].choices[choice_id] = {
          body: "",
        };
        this.setQuestionErrors(updatedQuestionErrors);
      }
    }
  };

  setQuestionErrors = updatedQuestionErrors => {
    this.setState({
      errors: {
        ...this.state.errors,
        questions: updatedQuestionErrors,
      },
    });
  };

  /**
   * @param {number} question_id The clicked question's id
   */
  addQuestion = question_id => {
    // Insert the question in the index next to the passed question id
    const updatedQuestions = [...this.state.survey.questions];
    updatedQuestions.splice(question_id + 1, 0, {
      body: "Question",
      choices: [{ body: "Choice" }, { body: "Choice" }],
    });

    this.setState({
      survey: {
        ...this.state.survey,
        questions: updatedQuestions,
      },
    });

    // update question errors to track survey fields
    const updatedQuestionErrors = [...this.state.errors.questions];
    updatedQuestionErrors.splice(question_id + 1, 0, {
      body: "",
      choices: [{ body: "" }, { body: "" }],
    });
    this.setQuestionErrors(updatedQuestionErrors);
  };

  /**
   * @param {number} question_id The clicked question's id
   */
  removeQuestion = question_id => {
    // Remove the last question only if at least a single question exists
    const { questions } = this.state.survey;
    if (questions.length > 1) {
      this.setState({
        survey: {
          ...this.state.survey,
          questions: _.filter(questions, (question, index) =>
            index === question_id ? false : true
          ),
        },
      });

      // update errors to track survey fields
      const { errors } = this.state;
      this.setState({
        errors: {
          ...this.state.errors,
          questions: _.filter(errors.questions, (question_error, index) =>
            index === question_id ? false : true
          ),
        },
      });
    }
  };

  /**
   * @param {number} question_id The clicked question's id
   * @param {number} choice_id The choice before the one to be added
   */
  addChoice = (question_id, choice_id) => {
    // check that the # of choices is in the valid range 2 => 8
    const { questions } = this.state.survey;
    const updatedQuestions = _.map(questions, (question, index) => {
      if (index === question_id) {
        // for this question of this id, add one more options if valid
        if (question.choices.length < MAX_CHOICES) {
          // update errors to track survey fields
          const updatedQuestionErrors = [...this.state.errors.questions];
          updatedQuestionErrors[question_id]["choices"].splice(
            choice_id + 1,
            0,
            {
              body: "",
            }
          );
          this.setState({
            errors: {
              ...this.state.errors,
              questions: updatedQuestionErrors,
            },
          });

          // if # of choices is less than 8, add one more
          const updatedChoices = [...question.choices];
          updatedChoices.splice(choice_id + 1, 0, { body: "choice" });
          return {
            ...question,
            choices: updatedChoices,
          };
        } else {
          // if cannot add more choices
          return question;
        }
      } else {
        // for other questions
        return question;
      }
    });
    this.setState({
      survey: { ...this.state.survey, questions: updatedQuestions },
    });
  };

  removeChoice = (question_id, choice_id) => {
    // check that the # of choices is in the valid range 2 => 8
    const { questions } = this.state.survey;
    const updatedQuestions = _.map(questions, (question, index) => {
      if (index === question_id) {
        const { choices } = question;
        // for this question of this id, remove the last options if valid
        if (choices.length > MIN_CHOICES) {
          // #### Update Errors ####
          // update errors to track survey fields
          const { errors } = this.state;
          let updatedQuestionErrors = [...errors.questions];
          let { choices: choiceErrors } = updatedQuestionErrors[question_id];
          let updatedChoices = _.filter(choiceErrors, (choice, index) =>
            index === choice_id ? false : true
          );
          updatedQuestionErrors[question_id].choices = updatedChoices;
          this.setQuestionErrors(updatedQuestionErrors);

          // #### Update Choices ####
          // if # of choices is greater than 2, remove the last
          return {
            ...question,
            choices: _.filter(choices, (choice, index) =>
              index === choice_id ? false : true
            ),
          };
        } else {
          // if cannot add more choices
          return question;
        }
      } else {
        // for other questions
        return question;
      }
    });
    this.setState({
      survey: { ...this.state.survey, questions: updatedQuestions },
    });
  };

  // ############################################################
  // ############################################################
  // ###############       Helper Functions       ###############
  // ############################################################
  // ############################################################

  // ############################################################
  // ############################################################
  // ####################       Actions       ###################
  // ############################################################
  // ############################################################
  /**
   * @param {string} _userID The user ID who is sending the API request
   */
  postSurvey = _userID => {
    let { survey } = this.state;
    Axios.post(
      baseUrl + "addSurvey",
      {
        surveyUser: {
          id: _userID,
        },
        ...survey,
      },
      {
        headers: {
          Authorization: helpers.getJWT(),
        },
      }
    )
      .then(res => {
        // if correct response
        if (res.status === 200) {
          this.props.getSurveys();
          // console.log(res);

          // Redirect to show my surveys
          this.showSurveysToggle();

          this.deactivateSpinner();
        }
      })
      .catch(error => {
        console.error(error.response);

        // deactivate spinner
        this.deactivateSpinner();

        // handle general error
        if (!error.response) {
          this.props.handleGeneralError();
        }
      });
  };

  /**
   * @param {surveyId} surveyId The id of the survey to be deleted
   */
  deleteSurvey = surveyId => {
    Axios.delete(baseUrl + "deleteSurvey", {
      params: {
        surveyId: surveyId,
      },
      headers: {
        Authorization: helpers.getJWT(),
      },
    })
      .then(response => {
        if (response.status === 200) {
        }
        //TODO error handling
      })
      .catch(error => {
        console.error(error.response);
      });
  };

  // ############################################################
  // ############################################################
  // ####################       Render       ####################
  // ############################################################
  // ############################################################
  render() {
    const renderSurveys = _.reverse(
      _.map(this.props.surveys, (survey_object, survey_count) =>
        renderTableRow(
          survey_object,
          survey_count,
          this.deleteSurvey,
          this.props.setSurveyErrors
        )
      )
    );
    return (
      <Col className="col-sm-6 offset-sm-3">
        <div className="text-center mb-4">
          <Button onClick={this.showSurveysToggle} color="primary">
            Show My Surveys
          </Button>
          <Button
            className="m-4"
            color="success"
            onClick={() => this.addSurveyToggle()}
            id="add-survey"
          >
            <i className="fa fa-plus"></i>
            <UncontrolledTooltip
              placeholder="top"
              target="add-survey"
              trigger="hover focus"
            >
              Add new survey
            </UncontrolledTooltip>
          </Button>
        </div>

        {/* <<<<<<<<<<<<<<<<<<<<<       Render Surveys       >>>>>>>>>>>>>>>>>>>> */}
        <Collapse isOpen={this.state.isShowSurveysOpen}>
          <Table
            responsive
            hover
            borderless
            className="table"
            id="table-toggler"
          >
            <thead>
              <tr>
                <th width="5">#</th>
                <th>Survey</th>
                <th width="5"></th>
              </tr>
            </thead>
            <tbody>{renderSurveys}</tbody>
          </Table>
        </Collapse>

        {/* <<<<<<<<<<<<<<<<<<<<<       Add New Survey       >>>>>>>>>>>>>>>>>>>> */}
        <Collapse isOpen={this.state.isAddSurveyOpen}>
          <SurveyDetails
            activateSpinner={this.activateSpinner}
            addChoice={this.addChoice}
            removeChoice={this.removeChoice}
            addQuestion={this.addQuestion}
            removeQuestion={this.removeQuestion}
            errors={this.state.errors}
            onBlur={this.onBlur}
            onChange={this.onChange}
            onSubmit={this.onSubmit}
            spinner={this.state.spinner}
            survey={this.state.survey}
          />
        </Collapse>
      </Col>
    );
  }
}

// ############################################################
// ############################################################
// ##################       Prop Types       ##################
// ############################################################
// ############################################################
Home.propTypes = {
  surveys: PropTypes.array.isRequired,
  handleGeneralError: PropTypes.func.isRequired,
};
