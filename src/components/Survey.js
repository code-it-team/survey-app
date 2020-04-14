import _ from "lodash";
import PropTypes from "prop-types";
import React, { Component } from "react";
import { Button, Col, Collapse, Form, FormFeedback, FormGroup, Input, Label, Table, UncontrolledTooltip } from "reactstrap";
import { INITIAL_SURVEY, MAXLEN, MAX_CHOICES, MINLEN, MIN_CHOICES, QUESTION_COLOR_TEXT } from "../shared/globals";
import * as VALIDATION from "../shared/validation";
import Question from "./Question";
import { TableRow } from "./TableRow";

// ############################################################
// ############################################################
// ###############       Global Variables       ###############
// ############################################################
// ############################################################
const initial_errors = {
  name: null,
  questions: [
    {
      body: null,
      choices: [{ body: null }, { body: null }],
    },
  ],
};
// ############################################################
// ############################################################
// ###############       Helper Functions       ###############
// ############################################################
// ############################################################
/**
 * @param {object} survey_object
 * @param {number} survey_count
 */
const renderTableRow = (survey_object, survey_count) => {
  const { name } = survey_object;
  return (
    <TableRow
      survey_name={name}
      survey_count={survey_count}
      key={survey_count}
    />
  );
};

/**
 * @param {string} field
 * @param {object} error
 */
const isDisabled = (field, error) => {
  if (!error && field.length >= MINLEN && field.length <= MAXLEN) return false;
  return true;
};

export default class Survey extends Component {
  /**
   * @param {any} props
   */
  constructor(props) {
    super(props);
    this.state = {
      isShowSurveysOpen: false,
      isAddSurveyOpen: false,
      survey: INITIAL_SURVEY,
      errors: initial_errors,
    };
    // binding
    this.showSurveysToggle = this.showSurveysToggle.bind(this);
    this.addSurveyToggle = this.addSurveyToggle.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.onChange = this.onChange.bind(this);
    this.onBlur = this.onBlur.bind(this);
    this.addQuestion = this.addQuestion.bind(this);
    this.removeQuestion = this.removeQuestion.bind(this);
    this.addChoice = this.addChoice.bind(this);
    this.removeChoice = this.removeChoice.bind(this);
    this.setQuestionErrors = this.setQuestionErrors.bind(this);
  }

  // ############################################################
  // ############################################################
  // ################       Event Handlers       ################
  // ############################################################
  // ############################################################

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

  onSubmit = () => {};

  /**
   * @param {Event} event
   * @param {string} field The input type question, choice
   * @param {number} question_id The id of the question being updated
   * @param {number} choice_id The id of the choice being updated
   */
  onChange = (event, field, question_id = -1, choice_id = -1) => {
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
            name: (
              <p>
                Survey Name should be &ge; {VALIDATION.len.name.min} characters!
              </p>
            ),
          },
        });
      } else if (name.length > VALIDATION.len.name.max) {
        // greater than max length
        this.setState({
          errors: {
            ...this.state.errors,
            name: (
              <p>
                Survey Name should be &le; {VALIDATION.len.name.max} characters!
              </p>
            ),
          },
        });
      } else {
        // valid name length
        this.setState({ errors: { ...this.state.errors, name: null } });
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
          body: (
            <p>
              Question should be &ge; {VALIDATION.len.question.min} characters!
            </p>
          ),
        };
        this.setQuestionErrors(updatedQuestionErrors);
      } else if (body.length > VALIDATION.len.question.max) {
        // greater than max length
        updatedQuestionErrors[question_id] = {
          ...this.state.errors.questions[question_id],
          body: (
            <p>
              Question should be &le; {VALIDATION.len.question.max} characters!
            </p>
          ),
        };
        this.setQuestionErrors(updatedQuestionErrors);
      } else {
        // valid name length
        updatedQuestionErrors[question_id] = {
          ...this.state.errors.questions[question_id],
          body: null,
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
          body: (
            <p>Choice should be &ge; {VALIDATION.len.choice.min} characters!</p>
          ),
        };
        this.setQuestionErrors(updatedQuestionErrors);
      } else if (body.length > VALIDATION.len.choice.max) {
        // greater than max length
        updatedQuestionErrors[question_id].choices[choice_id] = {
          body: (
            <p>Choice should be &le; {VALIDATION.len.choice.max} characters!</p>
          ),
        };
        this.setQuestionErrors(updatedQuestionErrors);
      } else {
        // valid name length
        updatedQuestionErrors[question_id].choices[choice_id] = {
          body: null,
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
      body: null,
      choices: [{ body: null }, { body: null }],
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
              body: null,
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
   * @param {string} _url
   * @param {string} _name
   * @param {string} _userID
   */
  addSurvey = (_url, _name, _userID) => {};

  // ############################################################
  // ############################################################
  // ####################       Render       ####################
  // ############################################################
  // ############################################################
  render() {
    const renderSurveys = _.map(this.props.surveys, renderTableRow);
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
                <th width="5"></th>
              </tr>
            </thead>
            <tbody>{renderSurveys}</tbody>
          </Table>
        </Collapse>

        {/* <<<<<<<<<<<<<<<<<<<<<       Add New Survey       >>>>>>>>>>>>>>>>>>>> */}
        <Collapse isOpen={this.state.isAddSurveyOpen}>
          <Form name="addSurveyForm" onSubmit={this.onSubmit}>
            <FormGroup>
              <Label htmlFor="survey-name" className="font-weight-bold">
                SURVEY NAME
              </Label>
              <Input
                type="text"
                name="name"
                id="survey-name"
                placeholder={this.state.survey.name}
                value={this.state.survey.name}
                onChange={event => this.onChange(event, VALIDATION.survey_name)}
                onBlur={() => this.onBlur(VALIDATION.survey_name)}
                invalid={this.state.errors.name !== null}
              />
              <FormFeedback>{this.state.errors.name}</FormFeedback>
            </FormGroup>
            <div className="mt-4">
              <Label className={`font-weight-bold ${QUESTION_COLOR_TEXT}`}>
                QUESTIONS:
              </Label>
              <ol>
                {_.map(this.state.survey.questions, (question, index) => (
                  <Question
                    question={question}
                    key={index}
                    id={index}
                    onBlur={this.onBlur}
                    onChange={this.onChange}
                    addChoice={this.addChoice}
                    removeChoice={this.removeChoice}
                    addQuestion={this.addQuestion}
                    removeQuestion={this.removeQuestion}
                    errors={this.state.errors}
                  />
                ))}
              </ol>
            </div>

            <FormGroup>
              <Button
                type="submit"
                className="mt-5"
                color="dark"
                onClick={this.addSurveyToggle}
              >
                Submit
              </Button>
              <div className="mt-2 text-danger">{}</div>
            </FormGroup>
          </Form>
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
Survey.propTypes = {
  getSurveys: PropTypes.func.isRequired,
  surveys: PropTypes.array.isRequired,
};

TableRow.propTypes = {
  survey_name: PropTypes.string.isRequired,
  survey_count: PropTypes.number.isRequired,
};
