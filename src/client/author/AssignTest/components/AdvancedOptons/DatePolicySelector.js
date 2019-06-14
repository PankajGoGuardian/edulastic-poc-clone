/* eslint-disable react/prop-types */
import React, { useState } from "react";
import { connect } from "react-redux";
import { getUserRole } from "../../../src/selectors/user";
// import PropTypes from "prop-types";
import * as moment from "moment";
import { Col, Select } from "antd";
import selectsData from "../../../TestPage/components/common/selectsData";
import { StyledRow, StyledRowLabel, StyledDatePicker, StyledSelect } from "./styled";

const DatePolicySelector = ({
  startDate,
  endDate,
  changeField,
  openPolicy: selectedOpenPolicy,
  closePolicy: selectedClosePolicy,
  userRole
}) => {
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
    return endDate.valueOf() < startDate.valueOf();
  };

  let openPolicy = selectsData.openPolicy;
  let closePolicy = selectsData.closePolicy;
  if (userRole !== "teacher") {
    openPolicy = selectsData.openPolicyForAdmin;
    closePolicy = selectsData.closePolicyForAdmin;
  }

  return (
    <React.Fragment>
      <StyledRowLabel gutter={48} style={{ marginBottom: "10" }}>
        <Col span={6}>Open Date</Col>
        <Col span={6}>Close Date</Col>
        <Col span={6}>Open Policy</Col>
        <Col span={6}>Close Policy</Col>
      </StyledRowLabel>
      <StyledRow gutter={48}>
        <Col span={6}>
          <StyledDatePicker
            data-cy="startDate"
            style={{ width: "100%" }}
            size="large"
            disabledDate={disabledStartDate}
            showTime
            format="YYYY-MM-DD HH:mm:ss"
            value={moment(startDate)}
            placeholder="Open Date"
            onChange={changeField("startDate")}
          />
        </Col>
        <Col span={6}>
          <StyledDatePicker
            data-cy="closeDate"
            style={{ width: "100%" }}
            size="large"
            disabledDate={disabledEndDate}
            showTime
            format="YYYY-MM-DD HH:mm:ss"
            value={moment(endDate)}
            placeholder="Close Date"
            onChange={changeField("endDate")}
          />
        </Col>
        <Col span={6}>
          <StyledSelect
            data-cy="selectOpenPolicy"
            placeholder="Please select"
            cache="false"
            value={selectedOpenPolicy}
            onChange={changeField("openPolicy")}
          >
            {openPolicy.map(({ value, text }, index) => (
              <Select.Option key={index} value={value} data-cy="open">
                {text}
              </Select.Option>
            ))}
          </StyledSelect>
        </Col>
        <Col span={6}>
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
    </React.Fragment>
  );
};

export default connect(state => ({
  userRole: getUserRole(state)
}))(DatePolicySelector);
