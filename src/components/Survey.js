import _ from "lodash";
import PropTypes from "prop-types";
import React, { Component } from "react";
import { Button, Col, Collapse, Form, FormFeedback, FormGroup, Input, Label, Table, UncontrolledTooltip } from "reactstrap";
import * as ERRORS from "../shared/errors";
import { INITIAL_CHOICE, INITIAL_QUESTION, MAXLEN, MAX_CHOICES, MINLEN, MIN_CHOICES, QUESTION_BTN_COLOR, QUESTION_COLOR_TEXT } from "../shared/globals";
import * as VALIDATION from "../shared/validation";
import Question from "./Question";
import { TableRow } from "./TableRow";

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
      survey: {
        name: "Survey Name",
        questions: [INITIAL_QUESTION],
      },
      errors: ERRORS.SURVEY_ERRORS,
    };
    // binding
    this.showSurveysToggle = this.showSurveysToggle.bind(this);
    this.addSurveyToggle = this.addSurveyToggle.bind(this);
    this.onChange = this.onChange.bind(this);
    this.onBlur = this.onBlur.bind(this);
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
    }
  };

  onBlur = field => {
    // if survey name
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
    }
  };

  addQuestion = () => {
    // survey object
    this.setState({
      survey: {
        ...this.state.survey,
        questions: [...this.state.survey.questions].concat(INITIAL_QUESTION),
      },
    });

    // update errors to track survey fields
    this.setState({
      errors: {
        ...this.state.errors,
        questions: [...this.state.errors.questions].concat(
          ERRORS.QUESTION_ERROR
        ),
      },
    });
  };

  removeQuestion = () => {
    // Remove the last question only if at least a single question exists
    const { questions } = this.state.survey;
    if (questions.length > 1) {
      this.setState({
        survey: {
          ...this.state.survey,
          questions: [
            ..._.filter(questions, (question, index) => {
              return index === questions.length - 1 ? false : true;
            }),
          ],
        },
      });

      // update errors to track survey fields
      const { errors } = this.state;
      this.setState({
        errors: {
          ...this.state.errors,
          questions: [
            ..._.filter(errors.questions, (question_error, index) => {
              return index === errors.questions.length - 1 ? false : true;
            }),
          ],
        },
      });
    }
  };

  addChoice = question_id => {
    // check that the # of choices is in the valid range 2 => 8
    const { questions } = this.state.survey;
    const updatedQuestions = _.map(questions, (question, index) => {
      if (index === question_id) {
        // for this question of this id, add one more options if valid
        if (question.choices.length < MAX_CHOICES) {
          // if # of choices is less than 8, add one more
          return {
            ...question,
            choices: [...question.choices].concat(INITIAL_CHOICE),
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

  removeChoice = question_id => {
    // check that the # of choices is in the valid range 2 => 8
    const { questions } = this.state.survey;
    const updatedQuestions = _.map(questions, (question, index) => {
      if (index === question_id) {
        const { choices } = question;
        // for this question of this id, remove the last options if valid
        if (choices.length > MIN_CHOICES) {
          // if # of choices is greater than 2, remove the last
          return {
            ...question,
            choices: _.filter(choices, (choice, index) =>
              index === choices.length - 1 ? false : true
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
                Survey Name
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
                Questions:
              </Label>
              <ol>
                {_.map(this.state.survey.questions, (question, index) => (
                  <Question
                    question={question}
                    key={index}
                    id={index}
                    onBlur={this.onBlur}
                    onChange={event =>
                      this.onChange(event, VALIDATION.question, index)
                    }
                    addChoice={this.addChoice}
                    removeChoice={this.removeChoice}
                  />
                ))}
                {/* <<<<<<<<<<<<<<<<<<<<<       Options for Questions       >>>>>>>>>>>>>>>>>>>> */}
                <div className="mt-4">
                  <Button
                    outline
                    className="m-1 btn-circular"
                    color={`${QUESTION_BTN_COLOR}`}
                    onClick={() => this.removeQuestion()}
                    id="remove-question"
                  >
                    <i className="fa fa-minus fa-center"></i>
                    <UncontrolledTooltip
                      placeholder="top"
                      target="remove-question"
                    >
                      Remove Last Question
                    </UncontrolledTooltip>
                  </Button>
                  <Button
                    outline
                    className="m-1 btn-circular"
                    color={`${QUESTION_BTN_COLOR}`}
                    onClick={() => this.addQuestion()}
                    id="add-question"
                  >
                    <i className="fa fa-plus fa-center"></i>
                    <UncontrolledTooltip
                      placeholder="top"
                      target="add-question"
                    >
                      Add New Question
                    </UncontrolledTooltip>
                  </Button>
                </div>
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
