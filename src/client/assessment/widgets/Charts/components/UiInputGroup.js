import React from "react";
import PropTypes from "prop-types";
import { Row, Col, Input } from "antd";

import { WidgetSubHeading } from "../../../styled/Widget";
import { ColContainer } from "../../../styled/ColContainer";

const UiInputGroup = ({
  t,
  onChange,
  firstFieldValue,
  secondFieldValue,
  firstAttr,
  secondAttr,
  onBlur,
  firstInputType,
  secondInputType,
  ratio
}) => (
  <Row gutter={60}>
    <ColContainer>
      <Col span={12}>
        <WidgetSubHeading>{t(`component.chart.${firstAttr}`)}</WidgetSubHeading>
        <Input
          size="large"
          type={firstInputType}
          value={firstFieldValue}
          onChange={e => onChange(firstAttr, firstInputType === "text" ? e.target.value : +e.target.value)}
        />
      </Col>
      <Col span={12}>
        <WidgetSubHeading>{t(`component.chart.${secondAttr}`)}</WidgetSubHeading>
        <Input
          size="large"
          type={secondInputType}
          onBlur={onBlur}
          value={
            secondAttr === "value" ? Math.round(ratio ? secondFieldValue / ratio : secondFieldValue) : secondFieldValue
          }
          onChange={e => onChange(secondAttr, secondInputType === "text" ? e.target.value : +e.target.value)}
        />
      </Col>
    </ColContainer>
  </Row>
);

UiInputGroup.propTypes = {
  t: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  firstFieldValue: PropTypes.any.isRequired,
  secondFieldValue: PropTypes.any.isRequired,
  firstAttr: PropTypes.string,
  secondAttr: PropTypes.string,
  firstInputType: PropTypes.string,
  secondInputType: PropTypes.string,
  onBlur: PropTypes.func,
  ratio: PropTypes.number
};

UiInputGroup.defaultProps = {
  firstInputType: "number",
  secondInputType: "number",
  firstAttr: "label",
  secondAttr: "value",
  onBlur: () => {},
  ratio: 1
};

export default UiInputGroup;
