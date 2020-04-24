import _ from "lodash";
import PropTypes from "prop-types";
import React from "react";
import { Button, FormFeedback, FormGroup, Input, Label, UncontrolledTooltip } from "reactstrap";
import { CHOICE_BTN_COLOR, CHOICE_COLOR_TEXT, QUESTION_BTN_COLOR, QUESTION_COLOR_TEXT } from "../shared/globals";
import * as helpers from "../shared/helperFunctions";
import * as VALIDATION from "../shared/validation";

export default function Question({
  question,
  question_id,
  onChange,
  onBlur,
  addChoice,
  removeChoice,
  addQuestion,
  removeQuestion,
  errors,
}) {
  return (
    <li className="mb-5" key={question_id}>
      {question_id > 0 ? <hr className="mt-5 mb-5" /> : ""}
      <FormGroup>
        <Input
          type="textarea"
          rows="1"
          className={`${QUESTION_COLOR_TEXT}`}
          name={`question_${question_id}`}
          placeholder="Question"
          value={question.body}
          onChange={event => onChange(event, VALIDATION.question, question_id)}
          onBlur={() => onBlur(VALIDATION.question, question_id)}
          invalid={helpers.errorsToBool(errors.questions[question_id].body)}
        />
        <FormFeedback>
          {helpers.renderInnerHTML(errors.questions[question_id].body)}
        </FormFeedback>
        {/* <<<<<<<<<<<<<<<<<<<<<       Options for Questions       >>>>>>>>>>>>>>>>>>>> */}
        <div className="mt-2">
          <Button
            outline
            className="mr-2 btn-circular"
            color={`${QUESTION_BTN_COLOR}`}
            onClick={() => removeQuestion(question_id)}
            id="remove-question"
          >
            <i className="fa fa-minus fa-center" id="remove-question"></i>
            <UncontrolledTooltip placeholder="top" target="remove-question">
              Remove this question
            </UncontrolledTooltip>
          </Button>
          <Button
            outline
            className="btn-circular"
            color={`${QUESTION_BTN_COLOR}`}
            onClick={() => addQuestion(question_id)}
            id="add-question"
          >
            <i className="fa fa-plus fa-center" id="add-question"></i>
            <UncontrolledTooltip placeholder="top" target="add-question">
              Add question next to this
            </UncontrolledTooltip>
          </Button>
        </div>
      </FormGroup>
      <FormGroup>
        <Label className={`font-weight-bold ${CHOICE_COLOR_TEXT}`}>
          CHOICES:
        </Label>
        <ol type="a">
          {_.map(question.choices, (choice, choice_id) => {
            return (
              <li key={choice_id}>
                <FormGroup>
                  <Input
                    type="textarea"
                    rows="1"
                    className={`mb-1 ${CHOICE_COLOR_TEXT}`}
                    name={`choice_${choice_id}`}
                    placeholder="Choice"
                    value={choice.body}
                    onChange={event =>
                      onChange(event, VALIDATION.choice, question_id, choice_id)
                    }
                    onBlur={() =>
                      onBlur(VALIDATION.choice, question_id, choice_id)
                    }
                    invalid={helpers.errorsToBool(
                      errors.questions[question_id].choices[choice_id].body
                    )}
                  />
                  <FormFeedback>
                    {helpers.renderInnerHTML(
                      errors.questions[question_id].choices[choice_id].body
                    )}
                  </FormFeedback>

                  {/* <<<<<<<<<<<<<<<<<<<<<       Options for Choice       >>>>>>>>>>>>>>>>>>>> */}
                  <div className="mt-2">
                    <Button
                      outline
                      className="mr-2 btn-sm btn-circular"
                      color={`${CHOICE_BTN_COLOR}`}
                      onClick={() => removeChoice(question_id, choice_id)}
                      id="remove-choice"
                    >
                      <i
                        className="fa fa-minus fa-center"
                        id="remove-choice"
                      ></i>
                      <UncontrolledTooltip
                        placeholder="top"
                        target="remove-choice"
                      >
                        Remove this choice
                      </UncontrolledTooltip>
                    </Button>
                    <Button
                      outline
                      className="btn-sm btn-circular"
                      color={`${CHOICE_BTN_COLOR}`}
                      onClick={() => addChoice(question_id, choice_id)}
                      id="add-choice"
                    >
                      <i className="fa fa-plus fa-center" id="add-choice"></i>
                      <UncontrolledTooltip
                        placeholder="top"
                        target="add-choice"
                      >
                        Add choice next to this
                      </UncontrolledTooltip>
                    </Button>
                  </div>
                </FormGroup>
              </li>
            );
          })}
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
  question_id: PropTypes.number.isRequired,
  onChange: PropTypes.func.isRequired,
  onBlur: PropTypes.func.isRequired,
  addChoice: PropTypes.func.isRequired,
  removeChoice: PropTypes.func.isRequired,
  addQuestion: PropTypes.func.isRequired,
  removeQuestion: PropTypes.func.isRequired,
  errors: PropTypes.object.isRequired,
};
