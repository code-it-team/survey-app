/** @format */

import React, { Component } from "react";
import { BrowserRouter } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import Main from "./components/Main";

export default class App extends Component {
  render() {
    return (
      <div className="App">
        <BrowserRouter>
          <Main />
        </BrowserRouter>
      </div>
    );
  }
}
