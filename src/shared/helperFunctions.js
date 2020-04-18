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
export const getSurveys = () => JSON.parse(localStorage.getItem("surveys"));

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
