/** @format */

import React from "react";

export default function GeneralError() {
  return (
    <div className="container">
      <div className="row">
        <div className="col-12 text-center">
          <img src="/general-error.png" width="60%" alt="general_error" />
          <br />
          <i className="fa fa-bug fa-5x mb-3" style={{ color: "#FDC01B" }}></i>
          <h4>Something went wrong ... </h4>
        </div>
      </div>
    </div>
  );
}
