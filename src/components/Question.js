import _ from "lodash";
import PropTypes from "prop-types";
import React from "react";
import { Button, FormFeedback, FormGroup, Input, Label, UncontrolledTooltip } from "reactstrap";
import { CHOICE_BTN_COLOR, CHOICE_COLOR_TEXT, QUESTION_COLOR_TEXT } from "../shared/globals";

export default function Question({
  question,
  id,
  onChange,
  onSubmit,
  onBlur,
  addChoice,
  removeChoice,
  addQuestion,
  removeQuestion,
  errors
}) {
  return (
    <li>
      <FormGroup>
        <Input
          type="text"
          className={`mb-3 ${QUESTION_COLOR_TEXT}`}
          name={`question_${id}`}
          placeholder={question.body}
          value={question.body}
          onChange={onChange}
          onSubmit={onSubmit}
          onBlur={onBlur}
        />
        <FormFeedback>{errors}</FormFeedback>
      </FormGroup>
      <FormGroup>
        <Label className={`font-weight-bold ${CHOICE_COLOR_TEXT}`}>
          Choices
        </Label>
        <ol type="a">
          {_.map(question.choices, (choice, id) => {
            return (
              <li key={id}>
                <FormGroup>
                  <Input
                    type="text"
                    className={`mb-3 ${CHOICE_COLOR_TEXT}`}
                    name={`choice_${id}`}
                    placeholder={choice.body}
                    value={choice.body}
                    onChange={onChange}
                    onSubmit={onSubmit}
                    onBlur={onBlur}
                  />
                </FormGroup>
              </li>
            );
          })}
          {/* <<<<<<<<<<<<<<<<<<<<<       Options for Choice       >>>>>>>>>>>>>>>>>>>> */}
          <Button
            outline
            className="m-1 btn-sm btn-circular"
            color={`${CHOICE_BTN_COLOR}`}
            onClick={() => removeChoice(id)}
            id="remove-choice"
          >
            <i className="fa fa-minus fa-center"></i>
            <UncontrolledTooltip placeholder="top" target="remove-choice">
              Remove Last Choice
            </UncontrolledTooltip>
          </Button>
          <Button
            outline
            className="m-1 btn-sm btn-circular"
            color={`${CHOICE_BTN_COLOR}`}
            onClick={() => addChoice(id)}
            id="add-choice"
          >
            <i className="fa fa-plus fa-center"></i>
            <UncontrolledTooltip placeholder="top" target="add-choice">
              Add New Choice
            </UncontrolledTooltip>
          </Button>
        </ol>
      </FormGroup>
    </li>
  );
}

// ############################################################
// ############################################################
// ##################       Prop Types       ##################
// ############################################################
// ############################################################
Question.propTypes = {
  question: PropTypes.object.isRequired,
  id: PropTypes.number.isRequired,
  onChange: PropTypes.func.isRequired,
  onBlur: PropTypes.func.isRequired,
};
