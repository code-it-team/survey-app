/** @format */

// return the jwt from local storage
export const getJWT = () => {
  return `Bearer ${localStorage.getItem("jwt")}`;
};

export const getUserId = () => {
  return localStorage.getItem("id");
};
