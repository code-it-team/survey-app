import _ from "lodash";
import React, { Fragment, useState } from "react";
import { confirmAlert } from "react-confirm-alert"; // Import
import "react-confirm-alert/src/react-confirm-alert.css"; // Import css
import { CopyToClipboard } from "react-copy-to-clipboard";
import {
  Alert,
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
  publishSurvey,
  isEdit = false,
}) {
  const [copied, setCopied] = useState(false);

  const handlePublish = () => {
    confirmAlert({
      title: "Confirm to Publish",
      message:
        "After you publish a survey, you cannot edit it. Do you want to publish?",
      buttons: [
        {
          label: "Yes",
          onClick: () => {
            publishSurvey();
          },
        },
        {
          label: "No",
          onClick: () => {},
        },
      ],
    });
  };

  const publishButton = () => {
    const link =
      window.location.href.split(/(?=surveys)/)[0] +
      "submitSurvey/" +
      survey.id;
    if (survey.published === null) {
      // Being added now
      return null;
    } else if (survey.published === true) {
      // published
      return (
        <div className="mb-5">
          <Alert color="info">
            <a href={link}>{link}</a>
          </Alert>
          <CopyToClipboard text={link} onCopy={() => setCopied(true)}>
            <Button className="rounded-pill">Copy to clipboard</Button>
          </CopyToClipboard>
          {copied ? (
            <span className="text-success ml-4">Copied &#10004;</span>
          ) : null}
        </div>
      );
    }
    // not published yet
    return (
      <FormGroup className="mb-5">
        <Button color="success" type="button" onClick={handlePublish}>
          Publish
        </Button>
      </FormGroup>
    );
  };

  let surveyForm = (
    <Form name="surveyDetails" onSubmit={onSubmit} className="mx-3">
      {isEdit ? (
        <Fragment>
          <FormGroup>
            <Button color="primary" type="button" onClick={redirectToHome}>
              Back to Home
            </Button>
          </FormGroup>
        </Fragment>
      ) : null}
      {publishButton()}
      <FormGroup>
        <Label htmlFor="survey-name" className="font-weight-bold">
          Survey Name
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
          Questions:
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
    <Col className="col-md-8 offset-md-2">
      <div className="mb-4">{surveyForm}</div>
    </Col>
  ) : (
    surveyForm
  );
}
