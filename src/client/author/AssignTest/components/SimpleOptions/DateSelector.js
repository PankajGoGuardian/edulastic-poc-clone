/* eslint-disable react/prop-types */
import React from "react";
// import PropTypes from "prop-types";
import { test as testConst, assignmentStatusOptions } from "@edulastic/constants";
import { Col, Row } from "antd";
import { FieldLabel, DatePickerStyled, RadioBtn, RadioGrp } from "@edulastic/common";
import { withNamespaces } from "@edulastic/localization";
import { StyledRow, StyledRadioGropRow, Label, RadioButtonWrapper } from "./styled";

const DateSelector = ({
  startDate,
  endDate,
  changeField,
  passwordPolicy,
  forClassLevel,
  status,
  dueDate,
  changeRadioGrop,
  selectedOption,
  showOpenDueAndCloseDate,
  t
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

  const handleDisableDueDate = currentDate =>
    currentDate.valueOf() > endDate.valueOf() || currentDate.valueOf() < startDate.valueOf();

  const colSpan = forClassLevel ? (dueDate ? 8 : 12) : showOpenDueAndCloseDate && selectedOption ? 8 : 12;
  const showDueDatePicker = forClassLevel ? dueDate : showOpenDueAndCloseDate && selectedOption;

  return (
    <React.Fragment>
      <StyledRow gutter={32} mb="15px">
        <Col span={colSpan}>
          <Row>
            <Col span={24}>
              <FieldLabel>{t("common.assignTest.openDateTitle")}</FieldLabel>
              <DatePickerStyled
                allowClear={false}
                data-cy="startDate"
                size="large"
                style={{ width: "100%" }}
                disabledDate={disabledStartDate}
                showTime
                format="YYYY-MM-DD hh:mm:ss a"
                value={startDate}
                placeholder={t("common.assignTest.openDatePlaceholder")}
                onChange={changeField("startDate")}
                disabled={
                  passwordPolicy === testConst.passwordPolicy.REQUIRED_PASSWORD_POLICY_DYNAMIC ||
                  (forClassLevel && status !== assignmentStatusOptions.NOT_OPEN)
                }
              />
            </Col>
          </Row>
        </Col>
        {!!showDueDatePicker && (
          <Col span={colSpan}>
            <Row>
              <Col span={24}>
                <FieldLabel>{t("common.assignTest.dueDateTitle")}</FieldLabel>
                <DatePickerStyled
                  allowClear={false}
                  data-cy="dueDate"
                  size="large"
                  style={{ width: "100%" }}
                  showTime
                  format="YYYY-MM-DD hh:mm:ss a"
                  value={dueDate}
                  placeholder={t("common.assignTest.dueDatePlaceholder")}
                  onChange={changeField("dueDate")}
                  disabled={forClassLevel && status === assignmentStatusOptions.DONE}
                  disabledDate={handleDisableDueDate}
                />
              </Col>
            </Row>
          </Col>
        )}
        <Col span={colSpan}>
          <Row>
            <Col span={24}>
              <FieldLabel>{t("common.assignTest.closeDateTitle")}</FieldLabel>
              <DatePickerStyled
                allowClear={false}
                data-cy="closeDate"
                style={{ width: "100%" }}
                size="large"
                disabledDate={disabledEndDate}
                showTime
                format="YYYY-MM-DD hh:mm:ss a"
                value={endDate}
                placeholder={t("common.assignTest.closeDatePlaceholder")}
                showToday={false}
                onChange={changeField("endDate")}
                disabled={forClassLevel && status === assignmentStatusOptions.DONE}
              />
            </Col>
          </Row>
        </Col>
      </StyledRow>
      {!forClassLevel && showOpenDueAndCloseDate && (
        <StyledRadioGropRow gutter={32}>
          <Col span={24}>
            <RadioGrp style={{ display: "flex" }} onChange={changeRadioGrop} value={selectedOption}>
              <RadioButtonWrapper>
                <RadioBtn data-cy="radioOpenCloseDate" value={false} />
                <Label>{t("common.assignTest.dateRadioGroup.openClose")}</Label>
              </RadioButtonWrapper>

              <RadioButtonWrapper style={{ marginLeft: "50px" }}>
                <RadioBtn data-cy="radioOpenDueCloseDate" value />
                <Label>
                  {t("common.assignTest.dateRadioGroup.openCloseDue")}{" "}
                  <span style={{ fontWeight: "normal" }}>(Allows Late Submissions)</span>
                </Label>
              </RadioButtonWrapper>
            </RadioGrp>
          </Col>
        </StyledRadioGropRow>
      )}
    </React.Fragment>
  );
};

export default withNamespaces("author")(DateSelector);
