import _ from "lodash";
import React from "react";
import { Button, ButtonGroup, FormFeedback, FormGroup, Input, Label, UncontrolledTooltip } from "reactstrap";
import { CHOICE_BTN_COLOR, CHOICE_COLOR_TEXT, QUESTION_BTN_COLOR, QUESTION_COLOR_TEXT } from "../shared/globals";
import * as VALIDATION from "../shared/validation";

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
  errors,
}) {
  return (
    <li className="mb-5">
      {id > 0 ? <hr className="mt-5 mb-5" /> : ""}
      <FormGroup>
        <Input
          type="text"
          className={`${QUESTION_COLOR_TEXT}`}
          name={`question_${id}`}
          placeholder={question.body}
          value={question.body}
          onChange={event => onChange(event, VALIDATION.question, id)}
          onSubmit={onSubmit}
          onBlur={onBlur}
        />
        <FormFeedback>{}</FormFeedback>
        {/* <<<<<<<<<<<<<<<<<<<<<       Options for Questions       >>>>>>>>>>>>>>>>>>>> */}
        <div className="mt-1">
          <ButtonGroup>
            <Button
              outline
              className="m-1 btn-circular"
              color={`${QUESTION_BTN_COLOR}`}
              onClick={() => removeQuestion(id)}
              id="remove-question"
            >
              <i className="fa fa-minus fa-center"></i>
              <UncontrolledTooltip placeholder="top" target="remove-question">
                Remove This Question
              </UncontrolledTooltip>
            </Button>
            <Button
              outline
              className="m-1 btn-circular"
              color={`${QUESTION_BTN_COLOR}`}
              onClick={() => addQuestion(id)}
              id="add-question"
            >
              <i className="fa fa-plus fa-center"></i>
              <UncontrolledTooltip placeholder="top" target="add-question">
                Add New Question
              </UncontrolledTooltip>
            </Button>
          </ButtonGroup>
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
                    type="text"
                    className={`mb-1 ${CHOICE_COLOR_TEXT}`}
                    name={`choice_${choice_id}`}
                    placeholder={choice.body}
                    value={choice.body}
                    onChange={event =>
                      onChange(event, VALIDATION.choice, id, choice_id)
                    }
                    onSubmit={onSubmit}
                    onBlur={onBlur}
                  />
                  <ButtonGroup>
                    <Button
                      outline
                      className="mr-2 btn-sm btn-circular"
                      color={`${CHOICE_BTN_COLOR}`}
                      onClick={() => removeChoice(id, choice_id)}
                      id="remove-choice"
                    >
                      <i className="fa fa-minus fa-center"></i>
                      <UncontrolledTooltip
                        placeholder="top"
                        target="remove-choice"
                      >
                        Remove This Choice
                      </UncontrolledTooltip>
                    </Button>
                    <Button
                      outline
                      className="btn-sm btn-circular"
                      color={`${CHOICE_BTN_COLOR}`}
                      onClick={() => addChoice(id, choice_id)}
                      id="add-choice"
                    >
                      <i className="fa fa-plus fa-center"></i>
                      <UncontrolledTooltip
                        placeholder="top"
                        target="add-choice"
                      >
                        Add New Choice
                      </UncontrolledTooltip>
                    </Button>
                  </ButtonGroup>
                </FormGroup>
              </li>
            );
          })}
          {/* <<<<<<<<<<<<<<<<<<<<<       Options for Choice       >>>>>>>>>>>>>>>>>>>> */}
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
Question.propTypes = {};
