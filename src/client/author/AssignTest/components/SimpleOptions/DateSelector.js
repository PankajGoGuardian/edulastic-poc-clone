/* eslint-disable react/prop-types */
import React, { useState } from "react";
// import PropTypes from "prop-types";
import * as moment from "moment";
import { Col } from "antd";
import { StyledRow, StyledRowLabel, StyledDatePicker } from "./styled";

const DateSelector = ({ startDate, endDate, changeField }) => {
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
      <StyledRowLabel gutter={16} style={{ marginBottom: "10" }}>
        <Col span={12}>Open Date</Col>
        <Col span={12}>Close Date</Col>
      </StyledRowLabel>
      <StyledRow gutter={32}>
        <Col span={12}>
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
        <Col span={12}>
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
      </StyledRow>
    </React.Fragment>
  );
};

export default DateSelector;
