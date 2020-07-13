import { test as testConst, roleuser } from "@edulastic/constants";
import { Col, Select } from "antd";
import * as moment from "moment";
import React from "react";
import { connect } from "react-redux";
import { getUserRole } from "../../../src/selectors/user";
import selectsData from "../../../TestPage/components/common/selectsData";
import TestTypeSelector from "../SimpleOptions/TestTypeSelector";
import PlayerSkinSelector from "../SimpleOptions/PlayerSkinSelector";
import { Label, StyledDatePicker, StyledRow, StyledSelect } from "./styled";
import { getIsOverrideFreezeSelector } from "../../../TestPage/ducks";

const DatePolicySelector = ({
  startDate,
  endDate,
  changeField,
  openPolicy: selectedOpenPolicy,
  closePolicy: selectedClosePolicy,
  userRole,
  testType,
  passwordPolicy = testConst.passwordPolicy.REQUIRED_PASSWORD_POLICY_OFF,
  playerSkinType,
  freezeSettings
}) => {
  const disabledStartDate = _startDate => {
    if (!_startDate || !endDate) {
      return false;
    }
    return _startDate.valueOf() < Date.now();
  };

  const disabledEndDate = _endDate => {
    if (!_endDate || !startDate) {
      return false;
    }
    return _endDate.valueOf() < startDate.valueOf() || _endDate.valueOf() < Date.now();
  };

  let openPolicy = selectsData.openPolicy;
  let closePolicy = selectsData.closePolicy;
  const isAdmin = userRole === roleuser.DISTRICT_ADMIN || userRole === roleuser.SCHOOL_ADMIN;
  if (isAdmin) {
    openPolicy = selectsData.openPolicyForAdmin;
    closePolicy = selectsData.closePolicyForAdmin;
  }

  return (
    <React.Fragment>
      <StyledRow gutter={24}>
        <Col xs={24} md={12} lg={6}>
          <Label>Open Date</Label>
          <StyledDatePicker
            allowClear={false}
            data-cy="startDate"
            style={{ width: "100%" }}
            size="large"
            disabledDate={disabledStartDate}
            showTime
            format="YYYY-MM-DD hh:mm:ss a"
            value={moment(startDate)}
            placeholder="Open Date"
            onChange={changeField("startDate")}
            disabled={passwordPolicy === testConst.passwordPolicy.REQUIRED_PASSWORD_POLICY_DYNAMIC}
          />
        </Col>
        <Col xs={24} md={12} lg={6}>
          <Label>Close Date</Label>
          <StyledDatePicker
            allowClear={false}
            data-cy="closeDate"
            style={{ width: "100%" }}
            size="large"
            disabledDate={disabledEndDate}
            showTime
            format="YYYY-MM-DD hh:mm:ss a"
            value={moment(endDate)}
            placeholder="Close Date"
            showToday={false}
            onChange={changeField("endDate")}
          />
        </Col>
        <Col xs={24} md={12} lg={6}>
          <Label>Open Policy</Label>
          <StyledSelect
            data-cy="selectOpenPolicy"
            placeholder="Please select"
            cache="false"
            value={selectedOpenPolicy}
            onChange={changeField("openPolicy")}
            disabled={passwordPolicy === testConst.passwordPolicy.REQUIRED_PASSWORD_POLICY_DYNAMIC}
          >
            {openPolicy.map(({ value, text }, index) => (
              <Select.Option key={index} value={value} data-cy="open">
                {text}
              </Select.Option>
            ))}
          </StyledSelect>
        </Col>
        <Col xs={24} md={12} lg={6}>
          <Label>Close Policy</Label>
          <StyledSelect
            data-cy="selectClosePolicy"
            placeholder="Please select"
            cache="false"
            value={selectedClosePolicy}
            onChange={changeField("closePolicy")}
          >
            {closePolicy.map(({ value, text }, index) => (
              <Select.Option data-cy="class" key={index} value={value}>
                {text}
              </Select.Option>
            ))}
          </StyledSelect>
        </Col>
      </StyledRow>
      <StyledRow gutter={24}>
        <Col xs={24} md={12} lg={6}>
          <Label>Test Type</Label>
          <TestTypeSelector
            isAdvanceView
            userRole={userRole}
            testType={testType}
            onAssignmentTypeChange={changeField("testType")}
            disabled={freezeSettings}
          />
        </Col>
        <Col xs={24} md={12} lg={6}>
          <Label>Student Player Skin</Label>
          <PlayerSkinSelector
            isAdvanceView
            testType={testType}
            userRole={userRole}
            playerSkinType={playerSkinType}
            onAssignmentTypeChange={changeField("playerSkinType")}
            disabled={freezeSettings}
          />
        </Col>
      </StyledRow>
    </React.Fragment>
  );
};

export default connect(state => ({
  userRole: getUserRole(state),
  freezeSettings: getIsOverrideFreezeSelector(state)
}))(DatePolicySelector);
