import React from "react";
import { Select } from "antd";
import { Col, Row } from "antd";
import { test } from "@edulastic/constants";
import { StyledRowLabel } from "./styled";
import { StyledSelect } from "./styled";
const { type } = test;
const { ASSESSMENT, PRACTICE } = type;

const TestTypeSelector = ({ testType, onAssignmentTypeChange, userRole, isAdvanceView }) => {
  const testTypes = {
    [ASSESSMENT]:
      userRole === "district-admin" || userRole === "school-admin" ? "Common Assessment" : "Class Assessment",
    [PRACTICE]: userRole === "district-admin" || userRole === "school-admin" ? "Practice" : "Practice Assessment"
  };
  return (
    <React.Fragment>
      {!isAdvanceView && (
        <StyledRowLabel gutter={16}>
          <Col span={12}>Test Type</Col>
        </StyledRowLabel>
      )}

      <Row gutter={32}>
        <Col span={!isAdvanceView ? 12 : 24}>
          <StyledSelect defaultValue={testType} onChange={onAssignmentTypeChange}>
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
