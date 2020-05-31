import Axios from "axios";
import _ from "lodash";
import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import {
  Button,
  Container,
  Form,
  FormGroup,
  Input,
  Label,
  Row,
} from "reactstrap";
import { baseUrl } from "../shared/baseUrl";
import { QUESTION_COLOR_TEXT } from "../shared/globals";
import * as routers from "../shared/routes";
import { question } from "../shared/validation";

/**
 * @typedef {object} props
 * @property {number} surveyId
 * @extends {Component<props>}
 *
 * @typedef {object} state
 * @property {object} survey
 * @property {number} survey.id
 * @property {string} survey.name
 * @property {boolean} survey.published
 * @property {object[]} survey.questions
 * @property {number} survey.questions[].id
 * @property {string} survey.questions[].body The question body
 * @property {object[]} survey.questions[].choices The question choices
 * @property {object} survey.questions[].choices[]
 * @property {number} survey.questions[].choices[].id
 * @property {string} survey.questions[].choices[].body
 */

class SurveySubmit extends Component {
  constructor(props) {
    super(props);
    /** @type {state} */
    this.state = {
      survey: {},
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
          this.setState({ survey: res.data });
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

  // ##################   Lifecycle methods   ##################
  componentDidMount() {
    this.getSurveyById(this.props.surveyId);
  }

  // ####################   Main Component   ####################

  render() {
    const { survey } = this.state;
    return (
      <Container style={{ marginTop: "8rem" }}>
        <Row md={8} className="offset-md-2">
          <Form name="surveySubmit" className="mx-3">
            <FormGroup>
              <Label
                htmlFor="survey-name"
                className="font-weight-bold text-danger"
              >
                {survey.name}
              </Label>
            </FormGroup>
            <div className="mt-4">
              {_.map(survey.questions, (question, question_id) => {
                return (
                  <FormGroup key={question_id}>
                    <Label
                      className={`font-weight-bold ${QUESTION_COLOR_TEXT}`}
                    >
                      {question.body}
                    </Label>
                    <Input
                      type="select"
                      name={`question_${question_id}`}
                      required
                    >
                      {_.map(question.choices, (choice, choice_id) => {
                        return (
                          <option name={`choice_${choice_id}`} key={choice_id}>
                            {choice.body}
                          </option>
                        );
                      })}
                    </Input>
                  </FormGroup>
                );
              })}
            </div>
            <FormGroup>
              <Button type="submit" className={`mt-5 btn-lg`} color="dark">
                Submit
              </Button>
            </FormGroup>
          </Form>
        </Row>
      </Container>
    );
  }
}

export default withRouter(SurveySubmit);
