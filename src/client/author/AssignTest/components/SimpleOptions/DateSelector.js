/* eslint-disable react/prop-types */
import React, { useState } from "react";
// import PropTypes from "prop-types";
import { test as testConst, assignmentStatusOptions } from "@edulastic/constants";
import { Col, Row } from "antd";
import { StyledRow, ColLabel, StyledDatePicker, Label } from "./styled";
import { FieldLabel, DatePickerStyled } from "@edulastic/common";

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
      <StyledRow gutter={32} mb="15px">
        <Col span={12}>
          <Row>
            <Col span={24}>
              <FieldLabel>OPEN DATE</FieldLabel>
              <DatePickerStyled
                allowClear={false}
                data-cy="startDate"
                size="large"
                style={{ width: "100%" }}
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
          </Row>
        </Col>
        <Col span={12}>
          <Row>
            <Col span={24}>
              <FieldLabel>CLOSE DATE</FieldLabel>
              <DatePickerStyled
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
          </Row>
        </Col>
      </StyledRow>
    </React.Fragment>
  );
};

export default DateSelector;
