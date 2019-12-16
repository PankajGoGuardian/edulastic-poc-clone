import React from "react";
import { Select } from "antd";
import { Col, Row } from "antd";
import { test, roleuser } from "@edulastic/constants";
import { StyledRowLabel } from "./styled";
import { StyledSelect } from "./styled";
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
      {!isAdvanceView && (
        <StyledRowLabel gutter={16}>
          <Col span={12}>Test Type</Col>
        </StyledRowLabel>
      )}

      <Row gutter={32}>
        <Col span={!isAdvanceView ? 12 : 24}>
          <StyledSelect disabled={disabled} data-cy="testType" {...valueProps} onChange={onAssignmentTypeChange}>
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
    </React.Fragment>
  );
};

export default TestTypeSelector;
