/* eslint-disable react/prop-types */
import React, { useState } from "react";
// import PropTypes from "prop-types";
import * as moment from "moment";
import { Col, Select } from "antd";
import selectsData from "../../../TestPage/components/common/selectsData";
import { StyledRow, StyledRowLabel, StyledDatePicker, StyledSelect } from "./styled";

const DatePolicySelector = ({ startDate, endDate, changeField, openPolicy, closePolicy }) => {
  const [endOpen, setEndOpen] = useState(false);

  const disabledStartDate = sDate => {
    if (!sDate || !endDate) {
      return false;
    }
    return startDate.valueOf() > endDate.valueOf();
  };

  const disabledEndDate = eDate => {
    if (!eDate || !startDate) {
      return false;
    }
    return endDate.valueOf() <= startDate.valueOf();
  };

  const handleStartOpenChange = open => {
    if (!open) setEndOpen(true);
  };

  const handleEndOpenChange = open => {
    setEndOpen(open);
  };

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
            onOpenChange={handleStartOpenChange}
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
            open={endOpen}
            onOpenChange={handleEndOpenChange}
          />
        </Col>
        <Col span={6}>
          <StyledSelect
            data-cy="selectOpenPolicy"
            placeholder="Please select"
            cache="false"
            value={openPolicy}
            onChange={changeField("openPolicy")}
          >
            {selectsData.openPolicy.map(({ value, text }, index) => (
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
            value={closePolicy}
            onChange={changeField("closePolicy")}
          >
            {selectsData.closePolicy.map(({ value, text }, index) => (
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

export default DatePolicySelector;
