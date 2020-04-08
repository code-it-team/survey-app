import React from "react";
import { UncontrolledTooltip } from "reactstrap";

export const TableRow = (
  /**
   * @param {string} survey_name
   * @param {number} survey_count
   */
  { survey_name, survey_count }
) => {
  return (
    <tr>
      <th scope="row">{survey_count + 1}</th>
      <td>
        <a href="/">{survey_name}</a>
      </td>

      <td>
        <i className="fa fa-pencil-square-o" id="edit-survey"></i>
        <UncontrolledTooltip placeholder="top" target="edit-survey">
          edit the survey's name
        </UncontrolledTooltip>
      </td>
      <td>
        <i className="fa fa-trash-o" id="delete-survey"></i>
        <UncontrolledTooltip placeholder="top" target="delete-survey">
          delete the survey
        </UncontrolledTooltip>
      </td>
    </tr>
  );
};
