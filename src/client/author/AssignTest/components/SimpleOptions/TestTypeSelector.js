import React from "react";
import { Select } from "antd";
import { Col, Row } from "antd";
import { test } from "@edulastic/constants";
import { StyledRowLabel } from "./styled";
import { StyledSelect } from "./styled";
const { type } = test;
const { ASSESSMENT, PRACTICE } = type;
const testTypes = {
  [ASSESSMENT]: "Assessment",
  [PRACTICE]: "Practice"
};

const TestTypeSelector = ({ testType, onAssignmentTypeChange, userRole }) => {
  return (
    <React.Fragment>
      <StyledRowLabel gutter={16}>
        <Col span={12}>Test Type</Col>
      </StyledRowLabel>
      <Row gutter={32}>
        <Col span={12}>
          <StyledSelect defaultValue={testType} onChange={value => onAssignmentTypeChange(value)}>
            {Object.keys(testTypes).map(key => (
              <Select.Option key={key} value={key}>
                {key === "assessment" && userRole !== "teacher" ? "Common Assessment" : testTypes[key]}
              </Select.Option>
            ))}
          </StyledSelect>
        </Col>
      </Row>
    </React.Fragment>
  );
};

export default TestTypeSelector;
