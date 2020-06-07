import _ from "lodash";
import React from "react";
import ReactHtmlParser from "react-html-parser";

// get the jwt from local storage
export const getJWT = () => `Bearer ${localStorage.getItem("jwt")}`;

// return true if authenticated else, false
export const isAuth = () => (localStorage.getItem("jwt") ? true : false);

// get the id of the logged in used, stored in the local storage
export const getUserId = () => localStorage.getItem("id");

// get the surveys of a user by ID from local storage
export const getPersistentObject = objName =>
  JSON.parse(localStorage.getItem(objName));

// get the surveys of a user by ID from local storage
export const persistObject = (object, objName) => {
  localStorage.setItem(objName, JSON.stringify(object));
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
export const mirrorQuestionErrors = survey => {
  let questions = [];
  // add N questions
  _.each(survey.questions, question => {
    let question_errors = {
      body: "",
      choices: [],
    };
    // add M choices
    _.each(question.choices, choices => {
      question_errors.choices.push({ body: "" });
    });
    questions.push(question_errors);
  });
  return questions;
};

/**
 * @param {object} collection The collection to be checked
 * @param {Function} checker Callback to check against each element
 * @param {boolean} empty The condition to be checked against the elements
 * of the collection. If `true` => the object value should be empty,
 * `false` => should not be empty
 * @returns `false` if any error exists otherwise, `true`
 */
export const isValid = (collection, checker, empty = true) => {
  // check survey name
  let name = true;
  if (empty) name = collection.name === "" ? true : false;
  else name = collection.name === "" ? false : true;
  if (!name) return false;

  // check questions if any error exists, return false
  let questions = true;
  if (empty) questions = checker(collection.questions);
  else questions = checker(collection.questions, false);
  if (!questions) return false;

  // check choices
  let choices = true;
  _.each(collection.questions, item => {
    let _choices = true;
    if (empty) _choices = checker(item.choices);
    else _choices = checker(item.choices, false);
    if (!_choices) {
      choices = false;
      return;
    }
  });
  return choices;
};
