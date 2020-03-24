/** @format */

import React from "react";
import { Image } from "react-bootstrap";

export default function GeneralError() {
  return (
    <div className="container">
      <div className="row">
        <div className="col-12 text-center">
          <Image src="/general-error.png" fluid width="60%" /><br/>
          <i className="fa fa-bug fa-5x mb-3" style={{ color: "#FDC01B" }}></i>
          <h4>Something went wrong ... </h4>
        </div>
      </div>
    </div>
  );
}
