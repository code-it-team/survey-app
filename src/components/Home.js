//@ts-check
import Axios from "axios";
import _ from "lodash";
import PropTypes from "prop-types";
import React, { Component } from "react";
import { Link } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import { Button, Col, Collapse, Table, UncontrolledTooltip } from "reactstrap";
import { baseUrl } from "../shared/baseUrl";
import { INITIAL_ERRORS, INITIAL_SURVEY } from "../shared/globals";
import * as helpers from "../shared/helperFunctions";
import * as messages from "../shared/messages";
import * as actions from "../state/actions";
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
  setSurveyErrors,
  setSurveyBeingEdited
) => {
  const { name } = survey_object;
  return (
    <tr key={survey_count} className="align-middle">
      <th scope="row">{survey_count + 1}</th>
      <td>
        {
          <Link
            to={`/surveys/${survey_count}`}
            onClick={() => {
              setSurveyBeingEdited(survey_count);
              setSurveyErrors(survey_count);
            }}
          >
            {name}
          </Link>
        }
      </td>
      <td>
        <Button outline onClick={() => deleteSurvey(survey_object.id)} color="danger">
          <i className="fa fa-trash-o" id="delete-survey"></i>
          <UncontrolledTooltip placeholder="top" target="delete-survey">
            delete the survey
          </UncontrolledTooltip>
        </Button>
      </td>
    </tr>
  );
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

    // binding
    this.activateSpinner = actions.activateSpinner.bind(this);
    this.deactivateSpinner = actions.deactivateSpinner.bind(this);
    this.addChoice = actions.addChoice.bind(this);
    this.removeChoice = actions.removeChoice.bind(this);
    this.addQuestion = actions.addQuestion.bind(this);
    this.removeQuestion = actions.removeQuestion.bind(this);
    this.onBlur = actions.onBlur.bind(this);
    this.onChange = actions.onChange.bind(this);
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

  onSubmit = event => {
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
    this.postSurvey();

    // reset state
    this.resetSurvey();
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
  postSurvey = () => {
    let { survey } = this.state;
    Axios.post(
      baseUrl + "addSurvey",
      {
        surveyUser: {
          id: helpers.getUserId(),
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
          console.log(res);

          // Redirect to show my surveys
          this.showSurveysToggle();

          toast.success(messages.postSurvey.success);
        }
      })
      .catch(error => {
        console.error(error.response);

        toast.error(error.response.data);

        // handle general error
        if (!error.response) {
          this.props.handleGeneralError();
        }
      })
      .finally(() => {
        // deactivate spinner
        this.deactivateSpinner();
      });
  };

  /**
   * @param {surveyId} surveyId The id of the survey to be deleted
   */
  deleteSurvey = surveyId => {
    // console.log(surveyId);
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
          toast.success(messages.deleteSurvey.success);

          // update the surveys
          this.props.getSurveys();
        }
      })
      .catch(error => {
        console.error(error.response);
        toast.error(error.response);
      })
      .finally(() => {
        this.deactivateSpinner();
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
          this.props.setSurveyErrors,
          this.props.setSurveyBeingEdited
        )
      )
    );
    return (
      <Col className="col-sm-6 offset-sm-3">
        <div className="text-center mb-4">
          <ToastContainer />
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
