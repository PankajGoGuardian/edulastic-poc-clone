/* eslint-disable react/prop-types */
import React, { useState } from "react";
// import PropTypes from "prop-types";
import { test as testConst, assignmentStatusOptions } from "@edulastic/constants";
import { Col } from "antd";
import { StyledRow, StyledRowLabel, StyledDatePicker } from "./styled";

const DateSelector = ({ startDate, endDate, changeField, passwordPolicy, forClassLevel, status }) => {
  const disabledStartDate = startDate => {
    if (!startDate || !endDate) {
      return false;
    }
    return startDate.valueOf() < Date.now();
  };

  const disabledEndDate = endDate => {
    if (!endDate || !startDate) {
      return false;
    }
    return endDate.valueOf() < startDate.valueOf() || endDate.valueOf() < Date.now();
  };

  return (
    <React.Fragment>
      <StyledRowLabel gutter={16} style={{ marginBottom: "10" }}>
        <Col span={12}>Open Date</Col>
        <Col span={12}>Close Date</Col>
      </StyledRowLabel>
      <StyledRow gutter={32}>
        <Col span={12}>
          <StyledDatePicker
            allowClear={false}
            data-cy="startDate"
            style={{ width: "100%" }}
            size="large"
            disabledDate={disabledStartDate}
            showTime
            format="YYYY-MM-DD HH:mm:ss"
            value={startDate}
            placeholder="Open Date"
            onChange={changeField("startDate")}
            disabled={
              passwordPolicy === testConst.passwordPolicy.REQUIRED_PASSWORD_POLICY_DYNAMIC ||
              (forClassLevel && status !== assignmentStatusOptions.NOT_OPEN)
            }
          />
        </Col>
        <Col span={12}>
          <StyledDatePicker
            allowClear={false}
            data-cy="closeDate"
            style={{ width: "100%" }}
            size="large"
            disabledDate={disabledEndDate}
            showTime
            format="YYYY-MM-DD HH:mm:ss"
            value={endDate}
            placeholder="Close Date"
            showToday={false}
            onChange={changeField("endDate")}
            disabled={forClassLevel && status === assignmentStatusOptions.DONE}
          />
        </Col>
      </StyledRow>
    </React.Fragment>
  );
};

export default DateSelector;
