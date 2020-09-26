import React from "react";
import { withRouter } from "react-router-dom";
import { find } from "lodash";
import { SelectInputStyled } from "@edulastic/common";
import { formatDateAndTime } from "../../utils";

const { Option } = SelectInputStyled;

const AttemptSelect = ({ attempts, history, match }) => {
  const { classId, testId, id } = match.params;
  const currentAttempt = find(attempts, x => x.activiyId === id);

  const handleSelectAttempt = activiyId => {
    history.push(`/home/class/${classId}/test/${testId}/testActivityReport/${activiyId}`);
  };

  return (
    <SelectInputStyled width="190px" defaultValue={currentAttempt.activiyId} onChange={handleSelectAttempt}>
      {attempts.map(attempt => (
        <Option key={attempt.activiyId} value={attempt.activiyId}>
          <span data-cy="date">{formatDateAndTime(attempt.createdAt)}</span>
        </Option>
      ))}
    </SelectInputStyled>
  );
};

export default withRouter(AttemptSelect);
