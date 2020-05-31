import _ from "lodash";
import React, { Component } from "react";
import { Button, Container, Form, FormGroup, Input, Label, Row } from "reactstrap";
import { QUESTION_COLOR_TEXT } from "../shared/globals";

export default class SurveySubmit extends Component {
  /**
   * @param {object} props
   * @param {object} props.survey
   * @param {number} props.survey.id
   * @param {string} props.survey.name
   * @param {boolean} props.survey.published
   * @param {object[]} props.survey.questions
   * @param {number} props.survey.questions[].id
   * @param {string} props.survey.questions[].body The question body
   * @param {object[]} props.survey.questions[].choices The question choices
   * @param {object} props.survey.questions[].choices[]
   * @param {number} props.survey.questions[].choices[].id
   * @param {string} props.survey.questions[].choices[].body
   */
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const { survey } = this.props;
    return (
      <Container>
        <Row md={8} className="offset-md-2">
          <Form name="surveySubmit" className="mx-3">
            <FormGroup>
              <Label htmlFor="survey-name" className="font-weight-bold">
                SURVEY NAME
              </Label>
            </FormGroup>
            <div className="mt-4">
              <Label className={`font-weight-bold ${QUESTION_COLOR_TEXT}`}>
                QUESTIONS:
              </Label>
              {_.map(survey.questions, (question, question_id) => {
                return (
                  <FormGroup>
                    <Input type="select" name={`question_${question_id}`}>
                      {_.map(question.choices, (choice, choice_id) => {
                        return <option>{choice}</option>;
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
