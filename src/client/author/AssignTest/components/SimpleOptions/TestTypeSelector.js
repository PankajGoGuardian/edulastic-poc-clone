import React from "react";
import { Select } from "antd";
import { Col, Row } from "antd";
import { test, roleuser } from "@edulastic/constants";
import { ColLabel, Label, StyledSelect, StyledRow, StyledRowSelect } from "./styled";
const { type } = test;
const { ASSESSMENT, PRACTICE, COMMON } = type;

const TestTypeSelector = ({
  testType,
  onAssignmentTypeChange,
  userRole,
  isAdvanceView,
  disabled = false,
  fullwidth = false
}) => {
  const isAdmin = userRole === roleuser.DISTRICT_ADMIN || userRole === roleuser.SCHOOL_ADMIN;
  const testTypes = {
    [ASSESSMENT]: "Class Assessment",
    [PRACTICE]: isAdmin ? "Practice" : "Practice Assessment"
  };

  const SelectOption = (
    <StyledSelect data-cy="testType" onChange={onAssignmentTypeChange} value={testType} disabled={disabled}>
      {isAdmin && (
        <Select.Option key={COMMON} value={COMMON}>
          Common Assessment
        </Select.Option>
      )}
      {Object.keys(testTypes).map(key => (
        <Select.Option key={key} value={key}>
          {testTypes[key]}
        </Select.Option>
      ))}
    </StyledSelect>
  );

  return fullwidth ? (
    <StyledRowSelect gutter={16}>
      <Col span={12}>
        <Label>TEST TYPE</Label>
      </Col>
      <Col span={12}>{SelectOption}</Col>
    </StyledRowSelect>
  ) : (
    <React.Fragment>
      <StyledRow gutter={32}>
        <Col span={12}>
          <Row>
            {!isAdvanceView && (
              <ColLabel span={24}>
                <Label>TEST TYPE</Label>
              </ColLabel>
            )}
            <Col span={24}>{SelectOption}</Col>
          </Row>
        </Col>
      </StyledRow>
    </React.Fragment>
  );
};

export default TestTypeSelector;
