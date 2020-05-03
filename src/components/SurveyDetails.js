import _ from "lodash";
import React from "react";
import {
  Button,
  Col,
  Form,
  FormFeedback,
  FormGroup,
  Input,
  Label,
} from "reactstrap";
import { QUESTION_COLOR_TEXT } from "../shared/globals";
import * as helpers from "../shared/helperFunctions";
import * as validation from "../shared/validation";
import Question from "./Question";

export default function SurveyDetails({
  onSubmit,
  onChange,
  onBlur,
  errors,
  survey,
  addQuestion,
  removeQuestion,
  addChoice,
  removeChoice,
  spinner,
  activateSpinner,
  redirectToHome,
  isEdit = false,
}) {
  let surveyForm = (
    <Form name="surveyDetails" onSubmit={onSubmit}>
      {isEdit ? (
        <FormGroup>
          <Button color="primary" type="button" onClick={redirectToHome}>
            Back to Home
          </Button>
        </FormGroup>
      ) : null}
      <FormGroup>
        <Label htmlFor="survey-name" className="font-weight-bold">
          SURVEY NAME
        </Label>
        <Input
          type="text"
          name="name"
          id="survey-name"
          placeholder="Survey Name"
          value={survey.name}
          onChange={event => onChange(event, validation.survey_name)}
          onBlur={() => onBlur(validation.survey_name)}
          invalid={errors.name !== ""}
        />
        <FormFeedback>{helpers.renderInnerHTML(errors.name)}</FormFeedback>
      </FormGroup>
      <div className="mt-4">
        <Label className={`font-weight-bold ${QUESTION_COLOR_TEXT}`}>
          QUESTIONS:
        </Label>
        <ol>
          {_.map(survey.questions, (question, question_id) => (
            <Question
              addChoice={addChoice}
              addQuestion={addQuestion}
              errors={errors}
              question_id={question_id}
              key={question_id}
              onBlur={onBlur}
              onChange={onChange}
              question={question}
              removeChoice={removeChoice}
              removeQuestion={removeQuestion}
            />
          ))}
        </ol>
      </div>

      <FormGroup>
        <Button
          type="submit"
          className={`mt-5 btn-lg`}
          color="dark"
          onClick={activateSpinner}
        >
          {spinner} Submit
        </Button>
        <div className="mt-2 text-danger font-weight-bold">
          {helpers.renderInnerHTML(errors.post_survey)}
        </div>
      </FormGroup>
    </Form>
  );
  return isEdit ? (
    <Col className="col-sm-6 offset-sm-3">
      <div className="mb-4">{surveyForm}</div>
    </Col>
  ) : (
    surveyForm
  );
}
