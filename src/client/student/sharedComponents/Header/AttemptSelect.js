import React from "react";
import { withRouter } from "react-router-dom";
import { find } from "lodash";
import { SelectInputStyled } from "@edulastic/common";

const { Option } = SelectInputStyled;

const AttemptSelect = ({ attempts = [], history, match }) => {
  const { classId, testId, id } = match.params;

  const currentAttempt = find(attempts, x => x?.activiyId === id) || {};

  const handleSelectAttempt = activiyId => {
    history.push(`/home/class/${classId}/test/${testId}/testActivityReport/${activiyId}`);
  };

  return (
    <SelectInputStyled width="190px" defaultValue={currentAttempt?.activiyId || id} onChange={handleSelectAttempt}>
      {attempts?.map((attempt = {}, index) => (
        <Option key={attempt?.activiyId || id} value={attempt?.activiyId || id}>
          <span data-cy="date">Attempt {index + 1}</span>
        </Option>
      ))}
    </SelectInputStyled>
  );
};

export default withRouter(AttemptSelect);
