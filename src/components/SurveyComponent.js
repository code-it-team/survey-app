/** @format */

import _ from "lodash";
import PropTypes from "prop-types";
import React, { Component } from "react";
import { Button, Col, Form, FormFeedback, FormGroup, Input, Label, Modal, ModalBody, ModalHeader, Table, UncontrolledCollapse, UncontrolledTooltip } from "reactstrap";
import { maxLength, minLength } from "../shared/globals";

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
  if (!error && field.length >= minLength && field.length <= maxLength)
    return false;
  return true;
};

// ############################################################
// ############################################################
// ##############       Helper Components       ###############
// ############################################################
// ############################################################
const TableRow = (
  /**
   * @param {string} survey_name
   * @param {number} survey_count
   */
  { survey_name, survey_count }
) => {
  return (
    <tr>
      <th scope="row">{survey_count + 1}</th>
      <td>
        <a href="/">{survey_name}</a>
      </td>

      <td>
        <i className="fa fa-pencil-square-o" id="edit-survey"></i>
        <UncontrolledTooltip placeholder="top" target="edit-survey">
          edit the survey's name
        </UncontrolledTooltip>
      </td>
      <td>
        <i className="fa fa-trash-o" id="delete-survey"></i>
        <UncontrolledTooltip placeholder="top" target="delete-survey">
          delete the survey
        </UncontrolledTooltip>
      </td>
    </tr>
  );
};

const AddSurveyModal = ({
  isModalOpen,
  toggle,
  onSubmit,
  onChange,
  onBlur,
  fields,
  errors
}) => {
  return (
    <React.Fragment>
      <Button className="m-3" color="success" onClick={toggle} id="add-survey">
        <i className="fa fa-plus"></i>
        <UncontrolledTooltip placeholder="top" target="add-survey">
          Add new survey
        </UncontrolledTooltip>
      </Button>
      <Modal isOpen={isModalOpen} toggle={toggle}>
        <ModalHeader charCode="x" toggle={toggle}>
          <strong>Add new survey</strong>
        </ModalHeader>
        <ModalBody>
          <Form onSubmit={onSubmit} name="addSurveyForm">
            <FormGroup>
              <Label htmlFor="username">
                <strong>Survey Name</strong>
              </Label>
              <Input
                type="text"
                name="survey_name"
                id="survey_name"
                className="form-control"
                placeholder="Name"
                value={fields.survey_name}
                onChange={onChange}
                onBlur={() => onBlur("survey_name")}
                invalid={errors.survey_name !== null}
              />
              <FormFeedback>{errors.survey_name}</FormFeedback>
            </FormGroup>
            <FormGroup>
              <Button
                type="submit"
                outline
                className="btn-block mt-5"
                color="dark"
                onClick={toggle}
                disabled={isDisabled(fields.survey_name, errors.survey_name)}
              >
                Add Survey
              </Button>
              <div className="mt-2 text-danger">{}</div>
            </FormGroup>
          </Form>
        </ModalBody>
      </Modal>
    </React.Fragment>
  );
};

export default class Survey extends Component {
  /**
   * @param {any} props
   */
  constructor(props) {
    super(props);
    this.state = {
      isModalOpen: false
    };
    // binding
    this.toggle = this.toggle.bind(this);
  }

  // ############################################################
  // ############################################################
  // ################       event handlers       ################
  // ############################################################
  // ############################################################
  toggle = () => {
    this.setState({ isModalOpen: !this.state.isModalOpen });
  };

  // ############################################################
  // ############################################################
  // ####################       Render       ####################
  // ############################################################
  // ############################################################
  render() {
    const renderSurveys = _.map(this.props.surveys, renderTableRow);
    return (
      <Col className="col-sm-6 offset-sm-3 text-left">
        <div className="text-center mb-4">
          <Button id="table-toggler" color="primary">
            Show My Surveys
          </Button>
          <AddSurveyModal
            isModalOpen={this.state.isModalOpen}
            toggle={this.toggle}
            onSubmit={this.props.onSubmit}
            onChange={this.props.onChange}
            onBlur={this.props.onBlur}
            fields={this.props.fields}
            errors={this.props.errors}
          />
        </div>
        <UncontrolledCollapse toggler="#table-toggler">
          <Table
            responsive
            hover
            borderless
            className="table"
            id="table-toggler"
          >
            <thead>
              <tr>
                <th
                  // @ts-ignore
                  width="5"
                >
                  #
                </th>
                <th>Survey</th>
                <th
                  // @ts-ignore
                  width="5"
                ></th>
                <th
                  // @ts-ignore
                  width="5"
                ></th>
              </tr>
            </thead>
            <tbody>{renderSurveys}</tbody>
          </Table>
        </UncontrolledCollapse>
      </Col>
    );
  }
}

// ############################################################
// ############################################################
// ##################       Prop Types       ##################
// ############################################################
// ############################################################
AddSurveyModal.propTypes = {
  isModalOpen: PropTypes.bool.isRequired,
  toggle: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  onBlur: PropTypes.func.isRequired,
  fields: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired
};

Survey.propTypes = {
  onChange: PropTypes.func.isRequired,
  onBlur: PropTypes.func.isRequired,
  fields: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired,
  getSurveys: PropTypes.func.isRequired,
  surveys: PropTypes.array.isRequired
};

TableRow.propTypes = {
  survey_name: PropTypes.string.isRequired,
  survey_count: PropTypes.number.isRequired
};
