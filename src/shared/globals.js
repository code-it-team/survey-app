import React from "react";

export const MINLEN = 3;
export const MAXLEN = 50;

// #########################      Survey      #########################
export const QUESTION_COLOR_TEXT = "text-success";
export const QUESTION_BTN_COLOR = "success";
export const CHOICE_COLOR_TEXT = "text-info";
export const CHOICE_BTN_COLOR = "info";
export const INITIAL_SURVEY = {
  name: "Survey Name",
  questions: [
    {
      body: "Question",
      choices: [{ body: "choice" }, { body: "choice" }],
    },
  ],
};

export const MIN_CHOICES = 2;
export const MAX_CHOICES = 8;
export const LE_SYMBOL = "\u2264";
export const GE_SYMBOL = "\u2265";

// #############################    State   #############################
export const INITIAL_STATE = {
  jwt: "",
  fields: {
    id: 0,
    username: "",
    password: "",
    password_confirm: "",
    question: "",
    option: "",
  },
  errors: {
    username: null,
    password: null,
    password_confirm: null,
    login: null,
    signup: null,
    question: null,
  },
  spinner: <></>,
  surveys: [], // list of all surveys
  survey: {},
};

// ###########################    Errors   ##############################
export const INITIAL_ERRORS = {
  name: "",
  questions: [
    {
      body: "",
      choices: [{ body: "" }, { body: "" }],
    },
  ],
  post_survey: "",
};
