import _ from "lodash";
import React from "react";
import { Spinner } from "reactstrap";
import { GE_SYMBOL, LE_SYMBOL, MAX_CHOICES, MIN_CHOICES } from "../shared/globals";
import * as VALIDATION from "../shared/validation";

export function activateSpinner() {
  // if any error exists do not load the spinner
  this.setState({
    spinner: (
      <Spinner color="primary" style={{ width: "20px", height: "20px" }} />
    ),
  });
}

export function deactivateSpinner() {
  this.setState({
    spinner: <></>,
  });
}

/**
 * @param {number} question_id The clicked question's id
 */
export function addQuestion(question_id) {
  // Insert the question in the index next to the passed question id
  const updatedQuestions = [...this.state.survey.questions];
  updatedQuestions.splice(question_id + 1, 0, {
    body: "Question",
    choices: [{ body: "Choice" }, { body: "Choice" }],
  });

  this.setState({
    survey: {
      ...this.state.survey,
      questions: updatedQuestions,
    },
  });

  // update question errors to track survey fields
  const updatedQuestionErrors = [...this.state.errors.questions];
  updatedQuestionErrors.splice(question_id + 1, 0, {
    body: "",
    choices: [{ body: "" }, { body: "" }],
  });
  this.setQuestionErrors(updatedQuestionErrors);
}

/**
 * @param {number} question_id The clicked question's id
 */
export function removeQuestion(question_id) {
  // Remove the last question only if at least a single question exists
  const { questions } = this.state.survey;
  if (questions.length > 1) {
    this.setState({
      survey: {
        ...this.state.survey,
        questions: _.filter(questions, (question, index) =>
          index === question_id ? false : true
        ),
      },
    });

    // update errors to track survey fields
    const { errors } = this.state;
    this.setState({
      errors: {
        ...this.state.errors,
        questions: _.filter(errors.questions, (question_error, index) =>
          index === question_id ? false : true
        ),
      },
    });
  }
}

/**
 * @param {number} question_id The clicked question's id
 * @param {number} choice_id The choice before the one to be added
 */
export function addChoice(question_id, choice_id) {
  // check that the # of choices is in the valid range 2 => 8
  const { questions } = this.state.survey;
  const updatedQuestions = _.map(questions, (question, index) => {
    if (index === question_id) {
      // for this question of this id, add one more options if valid
      if (question.choices.length < MAX_CHOICES) {
        // update errors to track survey fields
        const updatedQuestionErrors = [...this.state.errors.questions];
        updatedQuestionErrors[question_id]["choices"].splice(choice_id + 1, 0, {
          body: "",
        });
        this.setState({
          errors: {
            ...this.state.errors,
            questions: updatedQuestionErrors,
          },
        });

        // if # of choices is less than 8, add one more
        const updatedChoices = [...question.choices];
        updatedChoices.splice(choice_id + 1, 0, { body: "choice" });
        return {
          ...question,
          choices: updatedChoices,
        };
      } else {
        // if cannot add more choices
        return question;
      }
    } else {
      // for other questions
      return question;
    }
  });
  this.setState({
    survey: { ...this.state.survey, questions: updatedQuestions },
  });
}

export function removeChoice(question_id, choice_id) {
  // check that the # of choices is in the valid range 2 => 8
  const { questions } = this.state.survey;
  const updatedQuestions = _.map(questions, (question, index) => {
    if (index === question_id) {
      const { choices } = question;
      // for this question of this id, remove the last options if valid
      if (choices.length > MIN_CHOICES) {
        // #### Update Errors ####
        // update errors to track survey fields
        const { errors } = this.state;
        let updatedQuestionErrors = [...errors.questions];
        let { choices: choiceErrors } = updatedQuestionErrors[question_id];
        let updatedChoices = _.filter(choiceErrors, (choice, index) =>
          index === choice_id ? false : true
        );
        updatedQuestionErrors[question_id].choices = updatedChoices;
        this.setQuestionErrors(updatedQuestionErrors);

        // #### Update Choices ####
        // if # of choices is greater than 2, remove the last
        return {
          ...question,
          choices: _.filter(choices, (choice, index) =>
            index === choice_id ? false : true
          ),
        };
      } else {
        // if cannot add more choices
        return question;
      }
    } else {
      // for other questions
      return question;
    }
  });
  this.setState({
    survey: { ...this.state.survey, questions: updatedQuestions },
  });
}

/**
 * @param {string} field The input type [question, choice]
 * @param {number} question_id The id of the question being updated
 * @param {number} choice_id The id of the choice being updated
 */
export function onBlur(field, question_id = -1, choice_id = -1) {
  // ###################      Survey Name     ###################
  if (field === VALIDATION.survey_name) {
    const { name } = this.state.survey;
    // check valid length
    if (name.length < VALIDATION.len.name.min) {
      // less than min length
      this.setState({
        errors: {
          ...this.state.errors,
          name: `Survey Name should be ${
            GE_SYMBOL + " " + VALIDATION.len.name.min
          } characters!`,
        },
      });
    } else if (name.length > VALIDATION.len.name.max) {
      // greater than max length
      this.setState({
        errors: {
          ...this.state.errors,
          name: `Survey Name should be ${
            LE_SYMBOL + " " + VALIDATION.len.name.max
          } characters!`,
        },
      });
    } else {
      // valid name length
      this.setState({ errors: { ...this.state.errors, name: "" } });
    }
  } else if (field === VALIDATION.question) {
    // ###################    question body     ###################
    const { body } = this.state.survey.questions[question_id];
    let updatedQuestionErrors = [...this.state.errors.questions];
    // check valid length
    if (body.length < VALIDATION.len.question.min) {
      // less than min length
      updatedQuestionErrors[question_id] = {
        ...this.state.errors.questions[question_id],
        body: `Question should be ${
          GE_SYMBOL + " " + VALIDATION.len.question.min
        } characters!`,
      };
      this.setQuestionErrors(updatedQuestionErrors);
    } else if (body.length > VALIDATION.len.question.max) {
      // greater than max length
      updatedQuestionErrors[question_id] = {
        ...this.state.errors.questions[question_id],
        body: `Question should be ${
          LE_SYMBOL + " " + VALIDATION.len.question.max
        } characters!`,
      };
      this.setQuestionErrors(updatedQuestionErrors);
    } else {
      // valid name length
      updatedQuestionErrors[question_id] = {
        ...this.state.errors.questions[question_id],
        body: "",
      };
      this.setQuestionErrors(updatedQuestionErrors);
    }
  } else if (field === VALIDATION.choice) {
    // ###################    choice body     ###################
    const { body } = this.state.survey.questions[question_id].choices[
      choice_id
    ];
    let updatedQuestionErrors = [...this.state.errors.questions];
    // check valid length
    if (body.length < VALIDATION.len.choice.min) {
      // less than min length
      updatedQuestionErrors[question_id].choices[choice_id] = {
        body: `Choice should be ${
          GE_SYMBOL + " " + VALIDATION.len.choice.min
        } characters!`,
      };
      this.setQuestionErrors(updatedQuestionErrors);
    } else if (body.length > VALIDATION.len.choice.max) {
      // greater than max length
      updatedQuestionErrors[question_id].choices[choice_id] = {
        body: `Choice should be ${
          LE_SYMBOL + " " + VALIDATION.len.choice.max
        } characters!`,
      };
      this.setQuestionErrors(updatedQuestionErrors);
    } else {
      // valid name length
      updatedQuestionErrors[question_id].choices[choice_id] = {
        body: "",
      };
      this.setQuestionErrors(updatedQuestionErrors);
    }
  }
}

// Update the question errors as the passed array
export function setQuestionErrors(updatedQuestionErrors) {
  this.setState({
    errors: {
      ...this.state.errors,
      questions: updatedQuestionErrors,
    },
  });
}

/**
 * @param {Event} event
 * @param {string} field The input type question, choice
 * @param {number} question_id The id of the question being updated
 * @param {number} choice_id The id of the choice being updated
 */
export function onChange(event, field, question_id = -1, choice_id = -1) {
  // clear previous error message
  this.setState({
    errors: {
      ...this.state.errors,
      post_survey: "",
    },
  });

  const { value } = event.target;

  if (field === VALIDATION.survey_name) {
    // survey name
    this.setState({
      survey: { ...this.state.survey, name: value },
    });
  } else if (field === VALIDATION.question) {
    // question body
    let updatedQuestions = [...this.state.survey.questions];
    updatedQuestions[question_id] = {
      ...updatedQuestions[question_id],
      body: value,
    };
    this.setState({
      survey: {
        ...this.state.survey,
        questions: updatedQuestions,
      },
    });
  } else if (field === VALIDATION.choice) {
    let updatedQuestions = [...this.state.survey.questions];
    // choice body
    updatedQuestions[question_id]["choices"][choice_id] = {
      body: value,
    };
    this.setState({
      survey: {
        ...this.state.survey,
        questions: updatedQuestions,
      },
    });
  }
}
