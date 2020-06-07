import Axios from "axios";
import _ from "lodash";
import React, { Fragment, useEffect, useState } from "react";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
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
  Table,
  UncontrolledAlert,
} from "reactstrap";
import { baseUrl } from "../shared/baseUrl";
import { QUESTION_COLOR_TEXT } from "../shared/globals";
import * as helpers from "../shared/helperFunctions";
import * as validation from "../shared/validation";
import Question from "./Question";

/**
 * @typedef {object<string>} surveyStatistics
 * @property {num} surveyId
 */

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
export default function SurveyDetails(props) {
  // ############################################################
  // ############################################################
  // #####################       Hooks       ####################
  // ############################################################
  // ############################################################
  const [copied, setCopied] = useState(false);
  const [activeKey, setActiveKey] = useState("1");
  /**
   * @typedef {object} State
   * @property {number} surveyId
   * @property {string} surveyName
   * @property {number} numberOfSubmissions
   * @property {object[]} questionStatistics
   * @property {number} questionStatistics[].questionId
   * @property {string} questionStatistics[].questionBody
   * @property {object[]} questionStatistics[].choiceStatistics
   * @property {number} questionStatistics[].choiceStatistics[].choiceId
   * @property {string} questionStatistics[].choiceStatistics[].choiceBody
   * @property {string} questionStatistics[].choiceStatistics[].percentageOfSubmissions
   *
   * @typedef {Function} Setter
   * @type {[State, Setter]} statistics
   */
  const [surveyStatistics, setSurveyStatistics] = useState({});

  useEffect(() => {
    if (helpers.isAuth()) {
      getSurveyStatistics();
    }
  }, []);

  const {
    onSubmit,
    onChange,
    onBlur,
    addQuestion,
    removeQuestion,
    addChoice,
    removeChoice,
    activateSpinner,
    redirectToHome,
    publishSurvey,
    errors,
    survey,
    spinner,
    isEdit = false,
  } = props;

  // ############################################################
  // ############################################################
  // ####################       Actions       ###################
  // ############################################################
  // ############################################################
  const toggle = key => {
    if (activeKey !== key) setActiveKey(key);
  };

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

  const getSurveyStatistics = () => {
    Axios.get(baseUrl + "surveyStatistics", {
      headers: {
        Authorization: helpers.getJWT(),
      },
      params: {
        surveyId: survey.id,
      },
    })
      .then(res => {
        // console.log(res);
        // if success
        if (res.status === 200) {
          setSurveyStatistics(res.data);
        }
      })
      .catch(err => {
        console.error(err);
      });
  };

  // ############################################################
  // ############################################################
  // #####################       Views       ####################
  // ############################################################
  // ############################################################
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
    } else {
      // not published yet
      return (
        <FormGroup className="mb-5">
          <Button color="success" type="button" onClick={handlePublish}>
            Publish
          </Button>
        </FormGroup>
      );
    }
  };

  const surveyForm = (
    <Form name="surveyDetails" onSubmit={onSubmit} className="mx-3 mt-5">
      {publishButton()}
      {survey.published ? (
        <UncontrolledAlert color="primary">
          You cannot edit this survey as it's already published!
        </UncontrolledAlert>
      ) : null}
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
          disabled={survey.published}
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
              isPublished={survey.published}
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
          disabled={survey.published}
        >
          {spinner} Submit
        </Button>
        <div className="mt-2 text-danger font-weight-bold">
          {helpers.renderInnerHTML(errors.post_survey)}
        </div>
      </FormGroup>
    </Form>
  );

  const rowTitleClasses = "text-danger";
  const questionRowClasses = "text-primary";

  const generalTableBody = (
    <tbody>
      <tr>
        <td className={rowTitleClasses}>
          <strong>Survey ID</strong>
        </td>
        <td>{surveyStatistics.surveyId}</td>
      </tr>
      <tr>
        <td className={rowTitleClasses}>
          <strong>Survey Name</strong>
        </td>
        <td>{surveyStatistics.surveyName}</td>
      </tr>
      <tr>
        <td className={rowTitleClasses}>
          <strong>Number of Submissions</strong>
        </td>
        <td>{surveyStatistics.numberOfSubmissions}</td>
      </tr>
      <tr>
        <td className={rowTitleClasses}>
          <strong>Number of Questions</strong>
        </td>
        <td>
          {surveyStatistics.questionStatistics &&
            surveyStatistics.questionStatistics.length}
        </td>
      </tr>
    </tbody>
  );

  const questionsTableBody = _.map(
    surveyStatistics.questionStatistics,
    (questionStatistic, questionId) => (
      <Fragment key={questionId}>
        <Table
          responsive
          hover
          borderless
          className="table mt-4"
          id="table-toggler"
        >
          <thead>
            <tr className="d-flex">
              <th className={`${rowTitleClasses} col-4`}>Question Number </th>
              <th>{questionId + 1}</th>
            </tr>
          </thead>
          <tbody>
            <tr className="d-flex">
              <td className={`${questionRowClasses} col-4`}>Question Body</td>
              <td>{questionStatistic.questionBody}</td>
            </tr>
          </tbody>
        </Table>
        {_.map(
          questionStatistic.choiceStatistics,
          (choiceStatistic, choiceId) => {
            return (
              <Table
                responsive
                hover
                bordered
                className="table mt-4"
                id="table-toggler"
                key={`choice_${choiceId}`}
              >
                <thead>
                  <tr className="d-flex">
                    <th className="text-secondary col-4">Choice Number</th>
                    <th className="col-4">{choiceId + 1}</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="d-flex">
                    <td className={`${questionRowClasses} col-4`}>
                      Choice Body
                    </td>
                    <td className="col-4">{choiceStatistic.choiceBody}</td>
                  </tr>
                  <tr className="d-flex">
                    <td className={`${questionRowClasses} col-4`}>
                      Percentage of Submissions
                    </td>
                    <td className="col-4">
                      {choiceStatistic.percentageOfSubmissions}
                    </td>
                  </tr>
                </tbody>
              </Table>
            );
          }
        )}
        <hr />
      </Fragment>
    )
  );

  const tabs = (
    <Fragment>
      {isEdit ? (
        <FormGroup className="mb-4">
          <Button color="primary" type="button" onClick={redirectToHome}>
            Back to Home
          </Button>
        </FormGroup>
      ) : null}
      <Tabs activeKey={activeKey} onSelect={k => toggle(k)}>
        <Tab eventKey="1" title="Survey">
          {surveyForm}
        </Tab>
        <Tab eventKey="2" title="Statistics">
          <p className="mt-5 text-success">
            <ins>General Statistics:</ins>
          </p>
          <Table
            responsive
            hover
            borderless
            className="table"
            id="table-toggler"
          >
            <thead>
              <tr>
                <th></th>
                <th></th>
              </tr>
            </thead>
            {generalTableBody}
          </Table>
          <hr />
          <p className="mt-5 text-success">
            <ins>Questions Statistics:</ins>
          </p>
          {questionsTableBody}
        </Tab>
      </Tabs>
    </Fragment>
  );

  // ############################################################
  // ############################################################
  // #####################       Return       ####################
  // ############################################################
  // ############################################################
  return isEdit ? (
    <Col className="col-md-8 offset-md-2">
      <div className="mb-4">{tabs}</div>
    </Col>
  ) : (
    tabs
  );
}
