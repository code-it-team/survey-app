import Axios from "axios";
import _ from "lodash";
import React, { Component } from "react";
import Loader from "react-loader-spinner";
import { withRouter } from "react-router-dom";
import { toast } from "react-toastify";
import {
  Button,
  Col,
  Container,
  Form,
  FormGroup,
  Input,
  Label,
  Row,
  UncontrolledAlert,
} from "reactstrap";
import { baseUrl } from "../shared/baseUrl";
import { QUESTION_COLOR_TEXT } from "../shared/globals";
import * as messages from "../shared/messages";
import * as routers from "../shared/routes";

/**
 * @typedef {object} state
 *
 * @property {object} survey
 * @property {number} survey.id
 * @property {string} survey.name
 * @property {boolean} survey.published
 * @property {object[]} survey.questions
 * @property {number} survey.questions[].id
 * @property {string} survey.questions[].body The question body
 * @property {object[]} survey.questions[].choices The question choices
 * @property {number} survey.questions[].choices[].id
 * @property {string} survey.questions[].choices[].body
 *
 * @property {object} filledInSurvey
 * @property {number} filledInSurvey.surveyId
 * @property {Object[]} filledInSurvey.questionSubmissions
 * @property {string} filledInSurvey.questionSubmissions[].choiceId
 * @property {string} filledInSurvey.questionSubmissions[].questionId
 *
 * @property {boolean} isValid
 *
 * @typedef {object} props
 * @property {string} surveyId
 * @extends {Component<props>}
 */

class SurveySubmit extends Component {
  constructor(props) {
    super(props);
    /** @type {state} */
    this.state = {
      survey: {},
      filledInSurvey: {},
      isValid: false,
    };
  }

  // ######################   API Calls   ######################
  /**
   * @param {number} surveyId The survey id
   */
  getSurveyById = surveyId => {
    Axios.get(baseUrl + "survey", {
      params: {
        surveyId: parseInt(surveyId),
      },
    })
      .then(res => {
        // Correct response
        if (res.status === 200) {
          // update the state
          this.setState({ survey: res.data }, this.setInitialSurveySubmit);
        }
      })
      .catch(err => {
        console.error(err);

        // handle general error
        if (!err.response) {
          return this.props.history.push(routers.GENERAL_ERROR);
        }
      });
  };

  // #####################   Helpers   #########################
  setInitialSurveySubmit = () => {
    const { surveyId } = this.props;
    const questionSubmissions = _.map(
      this.state.survey.questions,
      (question, questionId) => {
        return {
          questionId: question.id.toString(),
          choiceId: "",
        };
      }
    );
    this.setState({
      filledInSurvey: {
        surveyId,
        questionSubmissions,
      },
    });
  };

  /**
   * @param {Event} event
   * @param {string} questionId
   * @param {string} choiceId
   */
  onChange = (event, questionId) => {
    const choiceId = event.target.value;
    const updatedQuestionSubmissions = this.state.filledInSurvey
      .questionSubmissions;
    updatedQuestionSubmissions[questionId] = {
      ...updatedQuestionSubmissions[questionId],
      choiceId,
    };
    this.setState(
      { questionSubmissions: updatedQuestionSubmissions },
      this.validate
    );
  };

  validate = () => {
    if (
      !_.find(
        this.state.filledInSurvey.questionSubmissions,
        questionSubmission => questionSubmission.choiceId === ""
      )
    ) {
      // valid, no empty choiceIds exist
      this.setState({ isValid: true });
    }
  };

  /**
   * @param {Event} event
   */
  onSubmit = event => {
    event.preventDefault();

    Axios.post(baseUrl + "submitSurvey", {
      ...this.state.filledInSurvey,
    })
      .then(res => {
        if (res.status === 200) {
          // if success
          toast.success(messages.submitSurvey.success);

          // clear the form
          this.clearForm();
        }
      })
      .catch(err => {
        // if failure
        toast.error(messages.submitSurvey.failure);
      });
  };

  clearForm = () => {
    const updatedQuestionSubmissions = _.map(
      this.state.filledInSurvey.questionSubmissions,
      questionSubmission => ({ ...questionSubmission, choiceId: "" })
    );

    this.setState({
      filledInSurvey: {
        ...this.state.filledInSurvey,
        questionSubmissions: updatedQuestionSubmissions,
      },
    });
  };

  // ##################   Lifecycle methods   ##################
  componentDidMount() {
    this.getSurveyById(this.props.surveyId);
  }

  componentDidUpdate(prevProps, prevState) {
    if (!_.isEqual(prevState.survey, this.state.survey)) {
      this.setInitialSurveySubmit();
    }
  }

  // ###################   Main Component   ####################
  render() {
    const { survey } = this.state;

    // if not loaded yet, show loader skeleton
    if (_.isEmpty(this.state.filledInSurvey)) {
      return (
        <Container style={{ marginTop: "8rem" }}>
          <Row className="d-flex justify-content-center">
            <Loader type="Plane" color="#DC3790" />
          </Row>
        </Container>
      );
    }

    return (
      <Container style={{ marginTop: "6rem" }}>
        <Row md={8}>
          <Col>
            <Form name="surveySubmit" className="mx-3" onSubmit={this.onSubmit}>
              <FormGroup>
                <span
                  className="d-flex justify-content-center text-danger font-weight-bolder"
                  style={{ fontSize: "30px" }}
                >
                  {survey.name}
                </span>
                <hr />
              </FormGroup>
              <UncontrolledAlert color="info">
                All questions must be answered to be able to submit!
              </UncontrolledAlert>
              <div className="mt-5">
                <ol>
                  {_.map(survey.questions, (question, questionId) => {
                    return (
                      <li key={questionId}>
                        <FormGroup>
                          <Label
                            className={`font-weight-bold ${QUESTION_COLOR_TEXT}`}
                          >
                            {question.body}
                          </Label>
                          <Input
                            required
                            type="select"
                            name={`question_${questionId}`}
                            value={
                              this.state.filledInSurvey.questionSubmissions[
                                questionId
                              ].choiceId
                            }
                            onChange={event =>
                              this.onChange(event, questionId.toString())
                            }
                          >
                            <option value=""></option>
                            {_.map(question.choices, (choice, choiceId) => {
                              return (
                                <option
                                  name={`choice_${choiceId}`}
                                  key={choiceId}
                                  value={choice.id}
                                >
                                  {choice.body}
                                </option>
                              );
                            })}
                          </Input>
                        </FormGroup>
                      </li>
                    );
                  })}
                </ol>
              </div>
              <FormGroup>
                <Button
                  type="submit"
                  className={`mt-5 btn-lg`}
                  color="dark"
                  disabled={!this.state.isValid}
                >
                  Submit
                </Button>
              </FormGroup>
            </Form>
          </Col>
        </Row>
      </Container>
    );
  }
}

export default withRouter(SurveySubmit);
