/** @format */

import React from "react";
import { Container, Row } from "reactstrap";
import Survey from "./SurveyComponent";

export default function Home() {
  return (
    <Container fluid>
      <Row style={{ marginTop: "8rem" }}>
        <Survey />
      </Row>
    </Container>
  );
}
