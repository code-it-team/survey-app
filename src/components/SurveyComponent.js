/** @format */

import Axios from "axios";
import PropTypes from "prop-types";
import React, { Component } from "react";
import { Button, Col, Form, FormFeedback, FormGroup, Input, Label, Modal, ModalBody, ModalHeader, Table, UncontrolledCollapse, UncontrolledTooltip } from "reactstrap";
import { baseUrl } from "../shared/baseUrl";
import { getJWT, getUserId } from "../shared/helperFunctions";

const TableRow = () => {
  return (
    <tr>
      <th scope="row">1</th>
      <td>
        <a href="/">survey 1</a>
      </td>
      <td>
        <i className="fa fa-trash-o" id="delete-survey"></i>
        <UncontrolledTooltip placeholder="top" target="delete-survey">
          delete the survey
        </UncontrolledTooltip>
      </td>
      <td>
        <i className="fa fa-pencil-square-o" id="edit-survey"></i>
        <UncontrolledTooltip placeholder="top" target="edit-survey">
          edit the name
        </UncontrolledTooltip>
      </td>
    </tr>
  );
};

const AddSurveyModal = ({ isModalOpen, toggle, onSubmit, onChange }) => {
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
                onChange={onChange}
              />
              <FormFeedback>{}</FormFeedback>
            </FormGroup>

            <FormGroup>
              <Button
                type="submit"
                outline
                className="btn-block mt-5"
                color="dark"
                onClick={toggle}
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
      isModalOpen: false,
      fields: {
        survey_name: "",
        question_name: ""
      }
    };
    // binding
    this.toggle = this.toggle.bind(this);
    this.onAddSurveySubmit = this.onAddSurveySubmit.bind(this);
    this.onChange = this.onChange.bind(this);
  }

  // ############################################################
  // ################       event handlers       ################
  // ############################################################

  toggle = () => {
    this.setState({ isModalOpen: !this.state.isModalOpen });
  };

  onChange = event => {
    const target = event.target;
    const value = target.value;
    const name = target.name;
    this.setState({ fields: { ...this.state.fields, [name]: value } });
  };

  // ############################################################
  // ###############       Helper Functions       ###############
  // ############################################################

  /**
   * @param {string} _url
   * @param {string} _name
   * @param {string} _userID
   */
  addSurvey = (_url, _name, _userID) => {
    Axios.post(
      baseUrl + _url,
      {
        surveyUser: {
          id: _userID
        },
        name: _name
      },
      {
        headers: {
          Authorization: getJWT()
        }
      }
    )
      .then(res => {
        // console.log(res);
      })
      .catch(error => {
        console.log(error.response);
      });
  };

  /**
   * @param {{ preventDefault: () => void; }} event
   */
  onAddSurveySubmit = event => {
    event.preventDefault();
    // check for errors

    // if no errors, submit
    this.addSurvey("addSurvey", this.state.fields.survey_name, getUserId());
  };

  // ############################################################
  // ####################       Render       ####################
  // ############################################################

  render() {
    return (
      <Col className="col-sm-6 offset-sm-3 text-left">
        <div className="text-center mb-4">
          <Button id="table-toggler" color="primary">
            Show My Surveys
          </Button>
          <AddSurveyModal
            isModalOpen={this.state.isModalOpen}
            toggle={this.toggle}
            onSubmit={this.onAddSurveySubmit}
            onChange={this.onChange}
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
            <tbody>
              <TableRow />
              <TableRow />
            </tbody>
          </Table>
        </UncontrolledCollapse>
      </Col>
    );
  }
}

// Prop Types
AddSurveyModal.propTypes = {
  isModalOpen: PropTypes.bool.isRequired,
  toggle: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired
};
