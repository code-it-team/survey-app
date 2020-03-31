/** @format */

// get the jwt from local storage
export const getJWT = () => `Bearer ${localStorage.getItem("jwt")}`;

// return true if authenticated else, false
export const isAuth = () => (localStorage.getItem("jwt") ? true : false);

// get the id of the logged in used, stored in the local storage
export const getUserId = () => localStorage.getItem("id");

// get the survey_name
export const getSurveyName = () => localStorage.getItem("survey_name")

// get the surveys of a user by ID from local storage
export const getSurveys = () => JSON.parse(localStorage.getItem("surveys"))
