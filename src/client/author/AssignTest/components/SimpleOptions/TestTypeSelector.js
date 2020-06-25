import { FieldLabel } from "@edulastic/common";
import { roleuser, test } from "@edulastic/constants";
import { Col, Select } from "antd";
import React from "react";
import { connect } from "react-redux";
import { StyledRow, StyledRowSelect, StyledSelect } from "./styled";

const { type } = test;
const { ASSESSMENT, PRACTICE, COMMON } = type;

const TestTypeSelector = ({
  testType,
  onAssignmentTypeChange,
  userRole,
  isAdvanceView,
  disabled = false,
  fullwidth = false,
  districtPermissions = []
}) => {
  const isAdmin = userRole === roleuser.DISTRICT_ADMIN || userRole === roleuser.SCHOOL_ADMIN;
  const testTypes = {
    [ASSESSMENT]: "Class Assessment",
    [PRACTICE]: isAdmin ? "Practice" : "Practice Assessment"
  };

  const SelectOption = (
    <StyledSelect style={{textTransform:"capitalize"}} data-cy="testType" onChange={onAssignmentTypeChange} value={testType} disabled={disabled}>
      {isAdmin && !districtPermissions.includes("publisher") && (
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
        <FieldLabel>TEST TYPE</FieldLabel>
      </Col>
      <Col span={12}>{SelectOption}</Col>
    </StyledRowSelect>
  ) : (
    <React.Fragment>
      <StyledRow gutter={48}>
        {!isAdvanceView && (
          <Col span={24}>
            <FieldLabel>TEST TYPE</FieldLabel>
          </Col>
        )}
        <Col span={24}>{SelectOption}</Col>
      </StyledRow>
    </React.Fragment>
  );
};

export default connect(state => ({
  districtPermissions: state?.user?.user?.orgData?.districts?.[0]?.districtPermissions
}))(TestTypeSelector);
