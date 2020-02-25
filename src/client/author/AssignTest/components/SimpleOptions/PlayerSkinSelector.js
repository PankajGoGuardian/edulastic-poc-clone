import React from "react";
import { Select , Col, Row } from "antd";

import { test, roleuser } from "@edulastic/constants";
import { ColLabel, Label, StyledSelect, StyledRow, StyledRowSelect } from "./styled";

const { playerSkinTypes } = test;

const PlayerSkinSelector = ({
  playerSkinType = playerSkinTypes.edulastic,
  onAssignmentTypeChange,
  userRole,
  isAdvanceView,
  disabled = false,
  fullwidth = false
}) => {
  const SelectOption = (
    <StyledSelect data-cy="playerSkinType" onChange={onAssignmentTypeChange} value={playerSkinType} disabled={disabled}>
      {Object.keys(playerSkinTypes).map(key => (
        <Select.Option key={key} value={key}>
          {playerSkinTypes[key]}
        </Select.Option>
      ))}
    </StyledSelect>
  );

  return fullwidth ? (
    <StyledRowSelect gutter={48}>
      <Col span={24}>
        <Label>STUDENT PLAYER SKIN</Label>
      </Col>
      <Col span={24}>{SelectOption}</Col>
    </StyledRowSelect>
  ) : (
    <React.Fragment>
      <StyledRow gutter={48}>
        {!isAdvanceView && (
          <ColLabel span={24}>
            <Label>STUDENT PLAYER SKIN</Label>
          </ColLabel>
        )}
        <Col span={24}>{SelectOption}</Col>
      </StyledRow>
    </React.Fragment>
  );
};

export default PlayerSkinSelector;
