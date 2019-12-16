import React from "react";
import { Select } from "antd";
import { Col, Row } from "antd";
import { test, roleuser } from "@edulastic/constants";
import { ColLabel, Label, StyledSelect, StyledRow } from "./styled";
const { type } = test;
const { ASSESSMENT, PRACTICE, COMMON } = type;

const TestTypeSelector = ({ testType, onAssignmentTypeChange, userRole, isAdvanceView, disabled = false }) => {
  const isAdmin = userRole === roleuser.DISTRICT_ADMIN || userRole === roleuser.SCHOOL_ADMIN;
  const testTypes = {
    [ASSESSMENT]: "Class Assessment",
    [PRACTICE]: isAdmin ? "Practice" : "Practice Assessment"
  };

  const valueProps = disabled ? { value: testType } : { defaultValue: testType };
  return (
    <React.Fragment>
      <StyledRow gutter={32}>
        <Col span={12}>
          <Row>
            {!isAdvanceView && (
              <ColLabel span={24}>
                <Label>TEST TYPE</Label>
              </ColLabel>
            )}

            <Col span={24}>
              <StyledSelect data-cy="testType" defaultValue={testType} onChange={onAssignmentTypeChange}>
                {isAdmin && (
                  <Option key={COMMON} value={COMMON}>
                    {"Common Assessment"}
                  </Option>
                )}
                {Object.keys(testTypes).map(key => (
                  <Select.Option key={key} value={key}>
                    {testTypes[key]}
                  </Select.Option>
                ))}
              </StyledSelect>
            </Col>
          </Row>
        </Col>
      </StyledRow>
    </React.Fragment>
  );
};

export default TestTypeSelector;
