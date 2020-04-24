import _ from "lodash";
import React from "react";
import ReactHtmlParser from "react-html-parser";

// get the jwt from local storage
export const getJWT = () => `Bearer ${localStorage.getItem("jwt")}`;

// return true if authenticated else, false
export const isAuth = () => (localStorage.getItem("jwt") ? true : false);

// get the id of the logged in used, stored in the local storage
export const getUserId = () => localStorage.getItem("id");

// get the survey_name
export const getSurveyName = () => localStorage.getItem("survey_name");

// get the surveys of a user by ID from local storage
export const getPersistentSurveys = () =>
  JSON.parse(localStorage.getItem("surveys"));

// get the surveys of a user by ID from local storage
export const persistSurveys = state => {
  localStorage.setItem("surveys", JSON.stringify(state));
};

// get the surveys of a user by ID from local storage
export const getPersistentErrors = () =>
  JSON.parse(localStorage.getItem("errors"));

// get the surveys of a user by ID from local storage
export const persistErrors = state => {
  localStorage.setItem("errors", JSON.stringify(state));
};

// Converts errors to boolean "" => false 'no errors', otherwise true 'errors exist'
export const errorsToBool = error => (error === "" ? false : true);

// Render inner HTML from strings
export const renderInnerHTML = stringData => (
  <p>{ReactHtmlParser(stringData)}</p>
);

// Collection elements are checked against the condition `empty`
// if `false` should not be empty, `true` should be empty
export const checker = (collection, empty = true) => {
  if (empty)
    return !_.some(collection, item => (item.body !== "" ? true : false));
  else return !_.some(collection, item => (item.body === "" ? true : false));
};

// Used to mirror the errors object to have the same structure as survey does to follow up
export const mirrorErrors = survey => {
  let errors = {
    name: "",
    questions: [],
  };
  // add N questions
  _.each(survey.questionDTOs, question => {
    let question_errors = {
      body: "",
      choices: [],
    };
    // add M choices
    _.each(question.choices, choices => {
      question_errors.choices.push({ body: "" });
    });
    errors.questions.push(question_errors);
  });
  return errors;
};
